import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Download,
  FileSpreadsheet,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench
} from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import StatCard from "../components/ui/StatCard";
import GlassCard from "../components/ui/GlassCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import RadarChart from "../components/charts/RadarChart";
import BiasBarChart from "../components/charts/BiasBarChart";
import TwinDiff from "../components/audit/TwinDiff";
import { dimensionData, useAudit } from "../hooks/useAudit";

const detailRows = [
  { dim: "Caste / Surname",     disp: 18.4, group: "SC/ST surnames",         conf: 97, sev: "Critical" },
  { dim: "Religion proxy",      disp: 12.1, group: "Muslim-majority pincodes", conf: 95, sev: "High" },
  { dim: "Regional / Pincode",  disp: 9.3,  group: "Non-metro applicants",   conf: 91, sev: "Medium" },
  { dim: "Gender",              disp: 4.8,  group: "Female applicants",      conf: 88, sev: "Passed" }
];

const rawPairs = [
  { id: 2400, swap: "Sharma → Paswan",                outcome: "Approved → Rejected", dimension: "caste",    severity: "Critical" },
  { id: 2401, swap: "Iyer → Meghwal",                 outcome: "Approved → Rejected", dimension: "caste",    severity: "Critical" },
  { id: 2402, swap: "Verma → Jadhav",                 outcome: "Approved → Review",   dimension: "caste",    severity: "High" },
  { id: 2403, swap: "Nair → Khan",                    outcome: "Approved → Rejected", dimension: "religion", severity: "High" },
  { id: 2404, swap: "Pillai → Ansari",                outcome: "Approved → Review",   dimension: "religion", severity: "High" },
  { id: 2405, swap: "400001 → 831001",                outcome: "Approved → Rejected", dimension: "region",   severity: "Medium" },
  { id: 2406, swap: "560001 → 755001",                outcome: "Approved → Review",   dimension: "region",   severity: "Medium" },
  { id: 2407, swap: "Male → Female",                  outcome: "Approved → Approved", dimension: "gender",   severity: "Passed" },
  { id: 2408, swap: "Male → Non-binary",              outcome: "Review → Review",     dimension: "gender",   severity: "Passed" },
  { id: 2409, swap: "English signal → vernacular",    outcome: "Approved → Review",   dimension: "language", severity: "Medium" }
];

export default function Results() {
  const { auditId } = useParams();
  const { audit } = useAudit(auditId);
  const [tab, setTab] = useState("Overview");
  const [filters, setFilters] = useState({ q: "", severity: "All" });

  const filteredPairs = rawPairs.filter((pair) => {
    const q = filters.q.toLowerCase();
    const matchesQ = !q || [pair.swap, pair.outcome, pair.dimension].some((s) => s.toLowerCase().includes(q));
    const matchesSev = filters.severity === "All" || pair.severity === filters.severity;
    return matchesQ && matchesSev;
  });

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mono">{audit.id} · {audit.date}</p>
          <h2 className="serif mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{audit.model}</h2>
          <p className="mt-2 text-sm text-ink-secondary">Counterfactual twin audit · 5,000 pairs · 4 dimensions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge pulse>{audit.severity}</Badge>
          <Link to="/reports"><Button variant="secondary"><Download className="h-4 w-4" /> PDF</Button></Link>
          <Link to={`/remediation/${audit.id}`}><Button><Wrench className="h-4 w-4" /> Remediate</Button></Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Overall bias score" value={`${audit.score}%`} tone="red" icon={AlertTriangle} hint="vs 10% threshold" />
        <StatCard label="Pairs tested" value="5,000" tone="default" icon={FileSpreadsheet} delay={0.05} />
        <StatCard label="Dimensions flagged" value="3 / 4" tone="amber" icon={Filter} delay={0.1} />
        <StatCard label="Confidence" value="97%" tone="green" icon={ShieldCheck} delay={0.15} />
      </div>

      {/* Twin-diff signature card — the headline finding */}
      <GlassCard className="mt-6 p-6" tone="critical">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Headline finding</span>
            <h3 className="serif mt-3 text-2xl font-semibold tracking-tight">
              Same merit. One swapped surname. Different decision.
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-secondary">
              The model approves the reference applicant and rejects an identical twin whose only
              changes are surname, pincode, and inferred community. This is the strongest twin-pair
              evidence in the audit.
            </p>
          </div>
          <Badge pulse>Critical</Badge>
        </div>
        <TwinDiff />
      </GlassCard>

      {/* Tabs */}
      <div className="mt-6 inline-flex w-full max-w-md gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-1">
        {["Overview", "Details", "Raw twin pairs"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`relative flex-1 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
              tab === item ? "text-midnight-900" : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {tab === item && (
              <motion.span
                layoutId="resultsTab"
                className="absolute inset-0 rounded-xl bg-saffron-gradient shadow-glow-saffron"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">{item}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="mt-5"
        >
          {tab === "Overview" && (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <GlassCard className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="serif text-lg font-semibold tracking-tight">Dimension radar</h3>
                  <BarChart3 className="h-4 w-4 text-ink-muted" />
                </div>
                <RadarChart data={dimensionData} />
              </GlassCard>

              <GlassCard className="p-5">
                <h3 className="serif text-lg font-semibold tracking-tight">Top findings</h3>
                <p className="mt-3 text-sm leading-6 text-ink-secondary">
                  Statistically significant adverse outcome variance for caste-linked surnames and
                  pincode clusters. Twin pairs with identical creditworthiness but SC/ST surnames
                  were rejected 18.4 percentage points more often than upper-caste twins.
                </p>
                <div className="mt-5 space-y-3">
                  {detailRows.slice(0, 3).map((row) => (
                    <div key={row.dim} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-ink-primary">{row.dim}</span>
                        <Badge>{row.sev}</Badge>
                      </div>
                      <ProgressBar value={(row.disp / 25) * 100} tone={row.disp >= 15 ? "critical" : row.disp >= 10 ? "saffron" : "blue"} threshold={(10 / 25) * 100} />
                      <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
                        <span>{row.group}</span>
                        <span className="mono text-ink-secondary">{row.disp}% · {row.conf}% conf.</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl border border-signal-critical/30 bg-signal-critical/[0.08] p-4 text-sm text-signal-critical">
                  Critical remediation should start with pincode feature removal and representation
                  balancing before production rollout.
                </div>
              </GlassCard>

              <GlassCard className="p-5 xl:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="serif text-lg font-semibold tracking-tight">Disparity by dimension</h3>
                  <span className="label">Threshold 10%</span>
                </div>
                <BiasBarChart data={dimensionData} threshold={10} />
              </GlassCard>
            </div>
          )}

          {tab === "Details" && (
            <GlassCard className="overflow-hidden p-0">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-ink-muted">
                  <tr>
                    {["Dimension", "Disparity", "Affected group", "Confidence", "Severity"].map((h) => (
                      <th key={h} className="border-b border-white/[0.06] px-5 py-3 text-xs font-semibold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detailRows.map((row, i) => (
                    <motion.tr
                      key={row.dim}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4 font-medium text-ink-primary">{row.dim}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-32"><ProgressBar value={(row.disp / 25) * 100} tone={row.disp >= 15 ? "critical" : row.disp >= 10 ? "saffron" : "blue"} height={6} /></div>
                          <span className="mono text-sm text-ink-primary">{row.disp}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-ink-secondary">{row.group}</td>
                      <td className="px-5 py-4 mono text-ink-secondary">{row.conf}%</td>
                      <td className="px-5 py-4"><Badge>{row.sev}</Badge></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          )}

          {tab === "Raw twin pairs" && (
            <GlassCard className="p-5">
              <p className="mb-4 text-sm leading-6 text-ink-secondary">
                Each row is one counterfactual twin: the same applicant profile with one proxy field
                changed, then compared against the model decision.
              </p>
              <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    className="input pl-9"
                    placeholder="Search swap, dimension, outcome"
                    value={filters.q}
                    onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                  />
                </label>
                <div className="flex flex-wrap gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
                  {["All", "Critical", "High", "Medium", "Passed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilters({ ...filters, severity: s })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        filters.severity === s
                          ? "bg-saffron-gradient text-midnight-900"
                          : "text-ink-secondary hover:text-ink-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <Button variant="secondary" size="md"><Download className="h-4 w-4" /> CSV</Button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-ink-muted">
                    <tr className="bg-white/[0.02]">
                      {["Pair", "Changed", "Decision", "Dimension", "Severity"].map((h) => (
                        <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPairs.map((pair, i) => (
                      <motion.tr
                        key={pair.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-t border-white/[0.04] hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 mono text-ink-secondary">#{pair.id}</td>
                        <td className="px-4 py-3 mono text-ink-primary">{pair.swap}</td>
                        <td className="px-4 py-3 mono text-ink-secondary">{pair.outcome}</td>
                        <td className="px-4 py-3 capitalize text-ink-secondary">{pair.dimension}</td>
                        <td className="px-4 py-3"><Badge>{pair.severity}</Badge></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!filteredPairs.length && (
                <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-ink-muted">
                  No twin pairs match those filters.
                </div>
              )}
            </GlassCard>
          )}
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  );
}
