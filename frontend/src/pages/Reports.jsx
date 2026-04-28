import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Download, FileJson, FileText, Sparkles, Table } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { audits } from "../hooks/useAudit";

const reportData = {
  "AUD-2401": {
    summary: "The retail lending audit found strong evidence that surname and pincode proxies influence approval outcomes even when credit score and income remain comparable.",
    findings: [
      ["Caste surname clusters", "18.4%", "Critical"],
      ["Religion pincode proxy", "12.1%", "High"],
      ["Non-metro region", "9.3%", "Medium"]
    ],
    checklist: [["DPDP Act 2023", "fail"], ["RBI Fair Practices Code", "fail"], ["EU AI Act Article 10", "pass"]],
    actions: ["Remove direct pincode feature", "Rebalance rejected applicant samples", "Add fairness threshold monitoring"]
  },
  "AUD-2398": {
    summary: "The hiring shortlist model shows elevated disparity for college tier, language fluency and gender-coded career gap signals. Caste surname effects were lower than the lending model but still reviewable.",
    findings: [
      ["College tier proxy", "14.7%", "High"],
      ["Language fluency signal", "10.8%", "High"],
      ["Gender career-gap proxy", "7.6%", "Medium"]
    ],
    checklist: [["DPDP Act 2023", "pass"], ["RBI Fair Practices Code", "n/a"], ["EU AI Act Article 10", "fail"]],
    actions: ["Remove college-tier shortcut", "Normalize vernacular resume signals", "Audit career gap feature weights"]
  },
  "AUD-2381": {
    summary: "The insurance risk scorer has moderate regional disparity, mostly concentrated in non-metro pincodes. No critical protected-proxy movement was found, but manual review is recommended.",
    findings: [
      ["Non-metro pincode", "6.2%", "Medium"],
      ["Age bracket variance", "5.9%", "Medium"],
      ["Gender", "2.1%", "Passed"]
    ],
    checklist: [["DPDP Act 2023", "pass"], ["RBI Fair Practices Code", "pass"], ["EU AI Act Article 10", "review"]],
    actions: ["Calibrate regional risk bands", "Document age-bracket justification", "Schedule next monitoring audit"]
  },
  "AUD-2374": {
    summary: "The credit limit allocator stayed within the acceptable threshold across tested proxy dimensions. Monitoring should continue, but no immediate remediation is required.",
    findings: [
      ["Caste surname clusters", "3.1%", "Passed"],
      ["Pincode proxy", "2.8%", "Passed"],
      ["Gender", "1.4%", "Passed"]
    ],
    checklist: [["DPDP Act 2023", "pass"], ["RBI Fair Practices Code", "pass"], ["EU AI Act Article 10", "pass"]],
    actions: ["Keep monitoring enabled", "Attach this report to the model card", "Re-audit after next model update"]
  }
};

const checklistTone = {
  pass: "border-signal-pass/30 bg-signal-pass/[0.06] text-signal-pass",
  fail: "border-signal-critical/30 bg-signal-critical/[0.06] text-signal-critical",
  review: "border-saffron-400/30 bg-saffron-400/[0.06] text-saffron-300",
  "n/a": "border-white/10 bg-white/[0.02] text-ink-muted"
};

export default function Reports() {
  const [selected, setSelected] = useState(audits[0]);
  const reportRef = useRef(null);
  const report = reportData[selected.id] || reportData["AUD-2401"];

  async function exportPdf() {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
    const canvas = await html2canvas(reportRef.current, { backgroundColor: "#070B17" });
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, height);
    pdf.save(`${selected.id}-nyaay-report.pdf`);
    toast.success("PDF exported");
  }

  return (
    <PageWrapper>
      <div className="mb-6">
        <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Compliance reports</span>
        <h2 className="serif mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Defensible audit evidence</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-secondary">
          Download portable PDFs, JSON evidence packs, or raw twin pair CSVs. Every report carries
          an audit ID, threshold, confidence interval, and remediation status.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="serif text-lg font-semibold tracking-tight">Past audits</h3>
            <span className="label">{audits.length}</span>
          </div>
          <div className="space-y-2">
            {audits.map((audit) => (
              <motion.button
                key={audit.id}
                onClick={() => setSelected(audit)}
                whileHover={{ x: 2 }}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selected.id === audit.id
                    ? "border-saffron-400/40 bg-saffron-400/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className={`truncate font-semibold ${selected.id === audit.id ? "text-saffron-200" : "text-ink-primary"}`}>{audit.model}</div>
                    <div className="mt-1 mono text-[11px] text-ink-muted">{audit.id} · {audit.date}</div>
                  </div>
                  <Badge>{audit.severity}</Badge>
                </div>
              </motion.button>
            ))}
          </div>
        </GlassCard>

        <div>
          <GlassCard className="p-6">
            <div ref={reportRef} className="rounded-2xl bg-bg-primary p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <div className="flex items-center gap-2 text-saffron-300">
                    <FileText className="h-4 w-4" />
                    <span className="label" style={{ color: "inherit" }}>Nyaay Compliance Report</span>
                  </div>
                  <h2 className="serif mt-3 text-3xl font-semibold tracking-tight">{selected.model}</h2>
                  <p className="mt-2 mono text-xs text-ink-muted">Nyaay Demo Org · {selected.id} · {selected.date}</p>
                </div>
                <Badge>{selected.severity}</Badge>
              </div>

              <h3 className="serif mt-6 text-lg font-semibold tracking-tight">Executive summary</h3>
              <p className="mt-3 text-sm leading-7 text-ink-secondary">{report.summary}</p>

              <h3 className="serif mt-6 text-lg font-semibold tracking-tight">Bias findings</h3>
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/[0.06]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.02] text-ink-muted">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Finding</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Disparity</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.findings.map(([item, score, severity]) => (
                      <tr key={item} className="border-t border-white/[0.04]">
                        <td className="px-4 py-3 text-ink-primary">{item}</td>
                        <td className="px-4 py-3 mono text-saffron-300">{score}</td>
                        <td className="px-4 py-3"><Badge>{severity}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="serif mt-6 text-lg font-semibold tracking-tight">Regulatory checklist</h3>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {report.checklist.map(([reg, status]) => (
                  <div key={reg} className={`rounded-xl border p-3 ${checklistTone[status]}`}>
                    <div className="text-[11px] uppercase tracking-wider opacity-70">{status}</div>
                    <div className="mt-1 text-sm font-semibold">{reg}</div>
                  </div>
                ))}
              </div>

              <h3 className="serif mt-6 text-lg font-semibold tracking-tight">Recommended actions</h3>
              <ol className="mt-3 space-y-2">
                {report.actions.map((item, i) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-sm text-ink-secondary">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-saffron-400/30 bg-saffron-400/[0.08] mono text-[11px] font-semibold text-saffron-300">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </GlassCard>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={exportPdf}><Download className="h-4 w-4" /> Download PDF</Button>
            <Button variant="secondary"><FileJson className="h-4 w-4" /> Export JSON</Button>
            <Button variant="secondary"><Table className="h-4 w-4" /> Export CSV</Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
