import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ListChecks, Wrench } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import RemediationCard from "../components/audit/RemediationCard";
import ProgressBar from "../components/ui/ProgressBar";

const seedFixes = [
  ["Critical", "Remove pincode as a direct feature", "Direct location features are acting as a proxy for religion and caste concentration.", "Drop pincode; replace with calibrated affordability bands and monitored residual geography features."],
  ["Critical", "Rebalance training data by caste representation", "Historical approvals underrepresent several surname clusters.", "Apply stratified resampling and measure equal opportunity by surname cluster before retraining."],
  ["High", "Apply equalized odds fairness constraint", "False negative rates diverge across protected proxies.", "Use post-processing thresholds or fairness-constrained optimization across outcome groups."],
  ["High", "Audit name field for indirect encoding", "Name tokens are encoding caste and religion in model decisions.", "Hash or remove raw name; retain only verified non-protected derived fields where necessary."],
  ["Medium", "Add fairness monitoring post-deployment", "Current process lacks recurring fairness drift checks.", "Schedule Firestore-triggered monthly audits and alert when disparity exceeds 10%."],
  ["Medium", "Document model card with bias test results", "Compliance reviewers need explainable evidence and remediation history.", "Generate model card section from audit results, confidence intervals and known limitations."]
];

export default function Remediation() {
  const { auditId } = useParams();
  const [filter, setFilter] = useState("All");
  const [fixes, setFixes] = useState(
    seedFixes.map((item, index) => ({
      id: index + 1,
      priority: item[0],
      title: item[1],
      description: item[2],
      note: item[3],
      effort: index < 2 ? "High" : "Medium",
      impact: index < 3 ? "High" : "Medium",
      resolved: false
    }))
  );
  const visible = fixes.filter((fix) => filter === "All" || fix.priority === filter);
  const resolved = fixes.filter((fix) => fix.resolved).length;
  const counts = useMemo(() => ({
    All: fixes.length,
    Critical: fixes.filter((f) => f.priority === "Critical").length,
    High: fixes.filter((f) => f.priority === "High").length,
    Medium: fixes.filter((f) => f.priority === "Medium").length
  }), [fixes]);

  return (
    <PageWrapper>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label mono">Linked audit · {auditId}</p>
          <h2 className="serif mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Remediation guidance</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-secondary">
            Prioritised by impact and severity. Mark fixes as you ship them — Nyaay tracks completion
            and includes the trail in your next compliance report.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
          <ListChecks className="h-4 w-4 text-saffron-300" />
          <span className="text-sm font-semibold tabular text-ink-primary">{resolved}/{fixes.length}</span>
          <span className="text-xs text-ink-muted">resolved</span>
        </div>
      </div>

      <GlassCard className="mb-6 p-5">
        <div className="mb-3 flex items-center justify-between text-xs text-ink-muted">
          <span>Resolution progress</span>
          <span className="mono text-saffron-300">{Math.round((resolved / fixes.length) * 100)}%</span>
        </div>
        <ProgressBar value={(resolved / fixes.length) * 100} tone="saffron" />
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Critical", counts.Critical, "border-signal-critical/30 text-signal-critical"],
            ["High", counts.High, "border-saffron-400/30 text-saffron-300"],
            ["Medium", counts.Medium, "border-signal-medium/30 text-signal-medium"],
            ["Total", counts.All, "border-white/10 text-ink-secondary"]
          ].map(([label, count, color]) => (
            <div key={label} className={`rounded-xl border bg-white/[0.02] p-3 ${color}`}>
              <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
              <div className="serif mt-1 text-2xl font-semibold tabular">{count}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="mb-5 flex flex-wrap gap-2">
        {["All", "Critical", "High", "Medium"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`relative rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
              filter === item
                ? "border-saffron-400/50 bg-saffron-400/[0.10] text-saffron-200 shadow-glow-saffron"
                : "border-white/[0.08] bg-white/[0.02] text-ink-secondary hover:border-white/20 hover:text-ink-primary"
            }`}
          >
            {item} <span className="ml-1 text-ink-muted">{counts[item] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visible.map((fix, idx) => (
          <motion.div
            key={fix.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <RemediationCard
              fix={fix}
              onResolved={() =>
                setFixes((current) =>
                  current.map((item) => (item.id === fix.id ? { ...item, resolved: !item.resolved } : item))
                )
              }
            />
          </motion.div>
        ))}
      </div>

      {resolved === fixes.length && (
        <GlassCard className="mt-6 flex items-center gap-4 p-5" tone="default">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-signal-pass/15 text-signal-pass">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div>
            <div className="serif text-lg font-semibold">All remediation steps cleared.</div>
            <div className="mt-1 text-sm text-ink-secondary">
              Re-audit this model to confirm the disparity has dropped below threshold.
            </div>
          </div>
        </GlassCard>
      )}
    </PageWrapper>
  );
}
