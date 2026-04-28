import * as XLSX from "xlsx";

const surnameGroups = {
  upper_caste: ["sharma", "verma", "iyer", "nair", "pillai"],
  obc: ["yadav", "kurmi", "lodhi", "mali"],
  sc_st: ["paswan", "chamar", "manjhi", "meghwal", "jadhav"],
  muslim: ["ansari", "khan", "sheikh", "siddiqui", "mirza"],
  christian: ["d'souza", "fernandes", "mathew", "thomas"]
};

const pincodeGroups = {
  metro: ["400001", "110001", "560001", "600001"],
  non_metro: ["831001", "755001", "362001", "413001"],
  muslim_majority: ["400070", "400072", "110006", "380001"],
  sc_st_majority: ["834001", "486001", "770001"]
};

const positiveWords = ["approved", "approve", "accepted", "accept", "yes", "true", "1", "pass", "selected", "sanctioned"];

export async function parseDecisionFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
}

export function inferMapping(headers) {
  const find = (needles) => headers.find((header) => needles.some((needle) => header.toLowerCase().includes(needle))) || "";
  return {
    applicantId: find(["id", "applicant"]),
    decision: find(["decision", "status", "outcome", "approved", "result"]),
    name: find(["name", "surname", "full"]),
    pincode: find(["pincode", "pin", "zip", "postal"]),
    gender: find(["gender", "sex"]),
    score: find(["score", "credit"]),
    income: find(["income", "salary"])
  };
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function isApproved(value) {
  return positiveWords.includes(normalize(value));
}

function surnameGroup(value) {
  const tokens = normalize(value).split(/\s+/).filter(Boolean);
  const surname = tokens[tokens.length - 1] || "";
  for (const [group, names] of Object.entries(surnameGroups)) {
    if (names.includes(surname)) return group;
  }
  return "unknown";
}

function pincodeGroup(value) {
  const pin = normalize(value).replace(/\D/g, "").slice(0, 6);
  for (const [group, pins] of Object.entries(pincodeGroups)) {
    if (pins.includes(pin)) return group;
  }
  return pin ? "other" : "unknown";
}

function genderGroup(value) {
  const gender = normalize(value);
  if (["m", "male", "man"].includes(gender)) return "male";
  if (["f", "female", "woman"].includes(gender)) return "female";
  if (gender) return "non_binary_or_other";
  return "unknown";
}

function approvalSummary(rows, mapping, groupGetter) {
  const groups = new Map();
  rows.forEach((row) => {
    const group = groupGetter(row);
    if (group === "unknown") return;
    const current = groups.get(group) || { group, total: 0, approved: 0 };
    current.total += 1;
    current.approved += isApproved(row[mapping.decision]) ? 1 : 0;
    groups.set(group, current);
  });
  return [...groups.values()].map((item) => ({ ...item, rate: item.total ? item.approved / item.total : 0 })).sort((a, b) => b.total - a.total);
}

function analyzeDimension({ key, label, rows, mapping, groupGetter }) {
  const groups = approvalSummary(rows, mapping, groupGetter);
  if (groups.length < 2) return null;

  const rankedByRate = [...groups].sort((a, b) => a.rate - b.rate);
  const disadvantaged = rankedByRate[0];
  const advantaged = rankedByRate[rankedByRate.length - 1];
  const common = groups[0];
  const disparity = Math.abs(advantaged.rate - disadvantaged.rate) * 100;
  const changedApprovals = Math.max(0, Math.round((common.rate - disadvantaged.rate) * disadvantaged.total));

  return {
    key,
    label,
    groups,
    disparity,
    flagged: disparity >= 10,
    affectedGroup: disadvantaged.group,
    referenceGroup: common.group,
    rerunApprovalRate: common.rate * 100,
    changedApprovals,
    explanation: `If ${disadvantaged.group} records are counterfactually changed to the common reference group ${common.group}, the proxy model estimates ${changedApprovals} additional approvals across ${disadvantaged.total} comparable records.`
  };
}

export function runBiasAudit(rows, mapping) {
  if (!mapping.decision) throw new Error("Map a decision/outcome column before running the audit.");
  const dimensions = [
    mapping.name && analyzeDimension({ key: "surname", label: "Caste / surname proxy", rows, mapping, groupGetter: (row) => surnameGroup(row[mapping.name]) }),
    mapping.pincode && analyzeDimension({ key: "pincode", label: "Region / pincode proxy", rows, mapping, groupGetter: (row) => pincodeGroup(row[mapping.pincode]) }),
    mapping.gender && analyzeDimension({ key: "gender", label: "Gender", rows, mapping, groupGetter: (row) => genderGroup(row[mapping.gender]) }),
    ...(mapping.customDimensions || []).map((dimension) => analyzeDimension({
      key: `custom_${dimension.column}`,
      label: dimension.label || `${dimension.column} bias`,
      rows,
      mapping,
      groupGetter: (row) => normalize(row[dimension.column]) || "unknown"
    }))
  ].filter(Boolean);

  const flagged = dimensions.filter((dimension) => dimension.flagged);
  return {
    rowCount: rows.length,
    positiveRate: rows.length ? rows.filter((row) => isApproved(row[mapping.decision])).length / rows.length : 0,
    dimensions,
    flagged,
    overallScore: dimensions.length ? Math.max(...dimensions.map((dimension) => dimension.disparity)) : 0,
    verdict: flagged.length ? "Potential bias detected" : "No major proxy bias detected"
  };
}

export function parseSchemaText(schemaText) {
  return schemaText
    .split(/[\n,]+/)
    .map((field) => field.trim())
    .filter(Boolean)
    .map((field) => {
      const [name, type = "text"] = field.split(":").map((part) => part.trim());
      return { name, type };
    });
}

export function generateTwinProfiles(fields, protectedField, referenceValue, testValue) {
  const base = {};
  fields.forEach((field) => {
    const key = field.name;
    const lower = key.toLowerCase();
    if (lower.includes("income") || lower.includes("salary")) base[key] = 900000;
    else if (lower.includes("score")) base[key] = 742;
    else if (lower.includes("age")) base[key] = 34;
    else if (lower.includes("pincode") || lower.includes("pin")) base[key] = "400001";
    else if (lower.includes("gender")) base[key] = "male";
    else if (lower.includes("name")) base[key] = "Aarav Sharma";
    else base[key] = "standard";
  });

  return {
    base: { ...base, [protectedField]: referenceValue },
    twin: { ...base, [protectedField]: testValue }
  };
}
