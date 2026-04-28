import { CalendarPlus, Pencil, TrendingDown, TrendingUp, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import PageWrapper from "../components/layout/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import TrendLineChart from "../components/charts/TrendLineChart";
import { audits, trendData } from "../hooks/useAudit";

const scheduled = [
  ["NBFC credit model",  "30 Apr 2026", "Lending"],
  ["Hiring shortlist ranker", "03 May 2026", "HR"],
  ["Insurance risk scorer", "08 May 2026", "Insurance"]
];

export default function Monitor() {
  return (
    <PageWrapper>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label">Continuous compliance monitoring</p>
          <h2 className="serif mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Bias drift control room</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-secondary">
            Watch dimension trends across audits. Get paged when disparity crosses the configured
            threshold or drifts up week-over-week.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-signal-pass/30 bg-signal-pass/[0.08] px-3 py-1.5 text-xs font-semibold text-signal-pass">
          <span className="live-dot" /> Live monitoring
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Current bias score" value="13.2%" tone="amber" trend="vs threshold 10%" />
        <StatCard label="Score change · 30d" value="-4.8%" tone="green" delay={0.05} hint="Improving" />
        <StatCard label="Next scheduled audit" value="30 Apr" tone="default" delay={0.1} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="serif text-lg font-semibold tracking-tight">Dimension trend</h3>
              <p className="mt-0.5 text-xs text-ink-muted">Caste, religion, region, gender · last 6 audits</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-ink-secondary">
              {[
                ["Caste", "#FF5466"],
                ["Religion", "#FF9933"],
                ["Region", "#5EA0FF"],
                ["Gender", "#3DD68C"]
              ].map(([k, c]) => (
                <span key={k} className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: c }} />
                  {k}
                </span>
              ))}
            </div>
          </div>
          <TrendLineChart data={trendData} multi threshold={10} />
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="serif text-lg font-semibold tracking-tight">Scheduled audits</h3>
            <Button variant="secondary" size="sm"><CalendarPlus className="h-3.5 w-3.5" /> Add</Button>
          </div>
          <ul className="space-y-2">
            {scheduled.map(([name, date, type]) => (
              <li key={name} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-ink-primary">{name}</div>
                    <div className="mt-0.5 text-[11px] text-ink-muted">{type}</div>
                  </div>
                  <span className="mono text-xs text-saffron-300">{date}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-ink-secondary transition hover:border-saffron-400/40 hover:text-saffron-300">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-ink-secondary transition hover:border-signal-critical/40 hover:text-signal-critical">
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="mt-6 overflow-hidden p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="serif text-lg font-semibold tracking-tight">Audit history</h3>
          <span className="label">Most recent first</span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-ink-muted">
              <tr className="bg-white/[0.02]">
                {["Model", "Audit ID", "Date", "Score", "Trend", "Severity"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {audits.map((audit, index) => {
                const up = index % 2 === 1;
                return (
                  <motion.tr
                    key={audit.id}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04 }}
                    className="border-t border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 text-ink-primary">{audit.model}</td>
                    <td className="px-4 py-3 mono text-ink-secondary">{audit.id}</td>
                    <td className="px-4 py-3 text-ink-secondary">{audit.date}</td>
                    <td className="px-4 py-3 mono text-ink-primary">{audit.score}%</td>
                    <td className={`px-4 py-3 ${up ? "text-signal-critical" : "text-signal-pass"}`}>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                        {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {up ? "Drift up" : "Improving"}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Badge>{audit.severity}</Badge></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </PageWrapper>
  );
}
