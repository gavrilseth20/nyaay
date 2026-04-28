import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Trash2,
  UploadCloud
} from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { inferMapping, parseDecisionFile, runBiasAudit } from "../lib/biasAudit";

const mappingFields = [
  ["applicantId", "Applicant ID"],
  ["decision", "Decision / outcome"],
  ["name", "Name / surname"],
  ["pincode", "Pincode"],
  ["gender", "Gender"],
  ["income", "Income"],
  ["score", "Credit score"]
];

export default function Upload() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customDimensions, setCustomDimensions] = useState([]);
  const [drag, setDrag] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  async function handleFile(nextFile) {
    if (!nextFile) return;
    setFile(nextFile);
    setLoading(true);
    try {
      const parsedRows = await parseDecisionFile(nextFile);
      const nextHeaders = Object.keys(parsedRows[0] || {});
      setRows(parsedRows);
      setHeaders(nextHeaders);
      setMapping(inferMapping(nextHeaders));
      setAudit(null);
      toast.success(`Parsed ${parsedRows.length.toLocaleString()} decision rows`);
    } catch (error) {
      toast.error(error.message || "Could not parse file");
    } finally {
      setLoading(false);
    }
  }

  function runAudit() {
    try {
      const result = runBiasAudit(rows, {
        ...mapping,
        customDimensions: customDimensions.filter((dimension) => dimension.column)
      });
      setAudit(result);
      toast.success(result.verdict);
      setStep(3);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <PageWrapper>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mono">Step {step} of 3</p>
          <h2 className="serif mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Upload · Map · Validate</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-secondary">
            Drop a CSV/XLS of historical decisions. Nyaay parses it, finds protected-proxy
            disparities, and reruns a counterfactual swap to a common reference group.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold transition ${
                  step >= n
                    ? "border-saffron-400/50 bg-saffron-400/[0.10] text-saffron-200 shadow-glow-saffron"
                    : "border-white/[0.08] bg-white/[0.02] text-ink-muted"
                }`}
              >
                {step > n ? <CheckCircle2 className="h-4 w-4" /> : n}
              </span>
              {n < 3 && <span className={`h-px w-8 ${step > n ? "bg-saffron-400/40" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <GlassCard className="p-7">
              <label
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                }}
                className={`relative flex min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed transition ${
                  drag
                    ? "border-saffron-400/60 bg-saffron-400/[0.08]"
                    : "border-white/[0.10] bg-white/[0.02] hover:border-saffron-400/30 hover:bg-white/[0.04]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  className="hidden"
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <span className="grid h-16 w-16 place-items-center rounded-2xl border border-saffron-400/30 bg-saffron-400/[0.08]">
                  <UploadCloud className="h-7 w-7 text-saffron-300" />
                </span>
                <h3 className="serif mt-5 text-2xl font-semibold tracking-tight">Drop historical decision data</h3>
                <p className="mt-2 max-w-xl text-center text-sm text-ink-secondary">
                  CSV, XLS, or XLSX. Decision values like <span className="mono text-saffron-300">approved</span>,{" "}
                  <span className="mono text-saffron-300">accepted</span>, <span className="mono text-saffron-300">yes</span>, or{" "}
                  <span className="mono text-saffron-300">1</span> are treated as positive outcomes.
                </p>
                <div className="mt-5 flex gap-3">
                  <Button onClick={() => fileInputRef.current?.click()} type="button">Choose file</Button>
                  <span className="self-center text-xs text-ink-muted">or drop a file here</span>
                </div>
              </label>

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-signal-pass/15 text-signal-pass">
                      <FileSpreadsheet className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-semibold">{file.name}</div>
                      <div className="mt-0.5 mono text-xs text-ink-muted">
                        {Math.round(file.size / 1024)} KB · {rows.length.toLocaleString()} rows
                      </div>
                    </div>
                  </div>
                  <Badge>Passed</Badge>
                </motion.div>
              )}

              <Button
                className="mt-6"
                disabled={!file || loading || !rows.length}
                onClick={() => setStep(2)}
              >
                {loading ? "Parsing..." : "Map columns"} <ArrowRight className="h-4 w-4" />
              </Button>
            </GlassCard>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <GlassCard className="p-6">
              <h3 className="serif text-xl font-semibold tracking-tight">Map columns</h3>
              <p className="mt-1 text-sm text-ink-secondary">
                Match your file's columns to the audit dimensions Nyaay knows about.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {mappingFields.map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="label">
                      {label}
                      {key === "decision" && <span className="ml-1 text-saffron-300">*</span>}
                    </span>
                    <select
                      className="input mt-2"
                      value={mapping[key] || ""}
                      onChange={(event) => setMapping({ ...mapping, [key]: event.target.value })}
                    >
                      <option value="">Not available</option>
                      {headers.map((header) => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-saffron-400/25 bg-saffron-400/[0.06] p-4 text-xs leading-5 text-saffron-200">
                Bias checks use surname, pincode, and gender when those columns exist. Add the
                fields below to test custom proxies (school, language, college tier, etc.).
              </div>

              <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold">Custom bias fields</h4>
                    <p className="mt-1 text-xs text-ink-muted">
                      Anything in your data: school, language, device, city, college tier, employment type.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCustomDimensions([...customDimensions, { column: headers[0] || "", label: "" }])}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add field
                  </Button>
                </div>
                <div className="mt-4 space-y-3">
                  {customDimensions.map((dimension, index) => (
                    <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                      <select
                        className="input"
                        value={dimension.column}
                        onChange={(event) =>
                          setCustomDimensions((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, column: event.target.value } : item
                            )
                          )
                        }
                      >
                        <option value="">Choose column</option>
                        {headers.map((header) => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                      <input
                        className="input"
                        placeholder="Label · e.g. College tier bias"
                        value={dimension.label}
                        onChange={(event) =>
                          setCustomDimensions((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, label: event.target.value } : item
                            )
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={() =>
                          setCustomDimensions((current) => current.filter((_, itemIndex) => itemIndex !== index))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={runAudit}>
                  <RefreshCw className="h-4 w-4" /> Run counterfactual bias check
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <GlassCard className="p-6" tone={audit?.flagged.length ? "critical" : "default"}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="label">Counterfactual audit complete</p>
                  <h3 className="serif mt-2 text-2xl font-semibold tracking-tight">
                    {audit?.verdict || "Audit results"}
                  </h3>
                  <p className="mt-2 text-sm text-ink-secondary">
                    Overall disparity score:{" "}
                    <span className="mono text-saffron-300">{audit ? audit.overallScore.toFixed(1) : "0.0"}%</span>
                  </p>
                </div>
                {audit?.flagged.length ? <Badge pulse>Critical</Badge> : <Badge>Passed</Badge>}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  ["Rows tested", audit?.rowCount.toLocaleString() ?? "0"],
                  ["Positive decisions", `${audit ? Math.round(audit.positiveRate * 100) : 0}%`],
                  ["Biased divisions", audit?.flagged.length ?? 0]
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="label">{k}</div>
                    <div className="serif mt-2 text-2xl font-semibold tabular text-ink-primary">{v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {audit?.dimensions.map((dimension) => (
                  <div key={dimension.key} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-xl ${
                          dimension.flagged ? "bg-signal-critical/15 text-signal-critical" : "bg-signal-pass/15 text-signal-pass"
                        }`}>
                          {dimension.flagged ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                        </span>
                        <div>
                          <h4 className="font-bold">{dimension.label}</h4>
                          <p className="text-xs text-ink-muted">
                            {dimension.disparity.toFixed(1)}% approval-rate disparity
                          </p>
                        </div>
                      </div>
                      <Badge>{dimension.flagged ? "High" : "Passed"}</Badge>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-ink-secondary">{dimension.explanation}</p>
                    <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.05]">
                      <table className="w-full min-w-[520px] text-left text-sm">
                        <thead className="text-ink-muted">
                          <tr className="bg-white/[0.02]">
                            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider">Group</th>
                            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider">Rows</th>
                            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider">Approved</th>
                            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dimension.groups.map((group) => (
                            <tr className="border-t border-white/[0.04]" key={group.group}>
                              <td className="px-3 py-2">{group.group}</td>
                              <td className="px-3 py-2 mono text-ink-secondary">{group.total}</td>
                              <td className="px-3 py-2 mono text-ink-secondary">{group.approved}</td>
                              <td className="px-3 py-2 mono text-saffron-300">{Math.round(group.rate * 100)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
                {!audit?.dimensions.length && (
                  <div className="rounded-2xl border border-saffron-400/30 bg-saffron-400/[0.08] p-4 text-saffron-200 text-sm">
                    No protected proxy columns were mapped. Add name/surname, pincode or gender columns to test bias.
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setStep(2)}>Adjust mapping</Button>
                <Button onClick={() => navigate("/configure")}>
                  Proceed to full audit <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
