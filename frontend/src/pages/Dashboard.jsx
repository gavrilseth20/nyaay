import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileSearch,
  PlayCircle,
  Sparkles,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import StatCard from "../components/ui/StatCard";
import GlassCard from "../components/ui/GlassCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import BiasBarChart from "../components/charts/BiasBarChart";
import TrendLineChart from "../components/charts/TrendLineChart";
import SeverityHeatmap from "../components/ui/SeverityHeatmap";
import { audits, dimensionData, trendData } from "../hooks/useAudit";
import { useAuth } from "../hooks/useAuth";
import { useGreeting } from "../hooks/useGreeting";

function deriveName(user, orgName) {
  if (!user) return orgName?.split(" ")[0] || "Auditor";
  if (user.firstName) return user.firstName;
  if (user.email) return user.email.split("@")[0].split(/[._-]/)[0].replace(/^./, (c) => c.toUpperCase());
  return "Auditor";
}

const upcoming = [
  { model: "NBFC credit model", date: "30 Apr", type: "Lending" },
  { model: "Hiring shortlist ranker", date: "03 May", type: "HR" },
  { model: "Insurance risk scorer", date: "08 May", type: "Insurance" }
];

const activity = [
  { dot: "saffron", text: "Twin batch 412–620 completed on Llama 3.2", time: "2m ago" },
  { dot: "info", text: "New audit created · Retail Loan Underwriter", time: "14m ago" },
  { dot: "critical", text: "Caste disparity exceeded 15% threshold", time: "31m ago" },
  { dot: "pass", text: "Gender dimension cleared on hiring model", time: "1h ago" },
  { dot: "info", text: "PDF report exported · AUD-2398", time: "3h ago" }
];

export default function Dashboard() {
  const { user, orgName } = useAuth();
  const { greeting, dateLine, time } = useGreeting();
  const name = deriveName(user, orgName);

  return (
    <PageWrapper>
      {/* Header strip */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">{dateLine} · {time}</p>
          <h2 className="serif mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {greeting}, <span className="italic text-saffron-300">{name}</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink-secondary">
            3 audits in flight. 1 critical disparity needs your attention before the next merge window.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/upload"><Button variant="secondary">Upload data</Button></Link>
          <Link to="/configure"><Button>New audit <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total audits run" value="24" icon={FileSearch} tone="default" trend="+12%" />
        <StatCard label="Models flagged" value="9" icon={AlertTriangle} tone="red" trend="+2" hint="3 critical · 6 high" />
        <StatCard label="Models cleared" value="12" icon={CheckCircle2} tone="green" delay={0.1} />
        <StatCard label="Pending reviews" value="3" icon={Clock3} tone="amber" delay={0.15} hint="Avg. 4.2 days to resolve" />
      </div>

      {/* Hero card row: critical highlight + bar chart */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <GlassCard className="relative overflow-hidden p-6" tone="critical">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-signal-critical/10 blur-3xl" />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Live finding</span>
              <h3 className="serif mt-3 text-2xl font-semibold tracking-tight">
                Retail Loan Underwriter is flagging caste-linked surnames.
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-secondary">
                Across 5,000 counterfactual twins, applicants with SC/ST surnames were rejected 18.4
                percentage points more often than upper-caste twins with identical merit.
              </p>
            </div>
            <Badge pulse>Critical</Badge>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["Disparity", "18.4%", "text-signal-critical"],
              ["Confidence", "97%", "text-saffron-300"],
              ["Affected pairs", "920", "text-ink-primary"]
            ].map(([k, v, color]) => (
              <div key={k} className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="label">{k}</div>
                <div className={`serif mt-2 text-2xl font-semibold tabular ${color}`}>{v}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/results/AUD-2401">
              <Button>Open audit <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/remediation/AUD-2401">
              <Button variant="secondary">View remediation</Button>
            </Link>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="serif text-lg font-semibold tracking-tight">Bias by dimension</h3>
            <span className="label">Latest audit</span>
          </div>
          <BiasBarChart data={dimensionData} threshold={10} />
        </GlassCard>
      </div>

      {/* Heatmap + activity feed */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="serif text-lg font-semibold tracking-tight">Severity matrix</h3>
              <p className="mt-1 text-xs text-ink-muted">Disparity % across dimensions × scenarios</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-ink-secondary">
              <Activity className="h-3.5 w-3.5 text-saffron-300" />
              Last 30 days
            </span>
          </div>
          <SeverityHeatmap />
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="serif text-lg font-semibold tracking-tight">Activity</h3>
            <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
              <span className="live-dot" /> Streaming
            </span>
          </div>
          <ul className="space-y-3">
            {activity.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
              >
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    item.dot === "critical" ? "bg-signal-critical shadow-[0_0_12px_rgba(255,84,102,0.7)]"
                    : item.dot === "saffron" ? "bg-saffron-400 shadow-[0_0_12px_rgba(255,153,51,0.6)]"
                    : item.dot === "pass" ? "bg-signal-pass shadow-[0_0_12px_rgba(61,214,140,0.6)]"
                    : "bg-signal-info shadow-[0_0_12px_rgba(94,160,255,0.6)]"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5 text-ink-secondary">{item.text}</p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">{item.time}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Audits table + trend */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <GlassCard className="overflow-hidden p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="serif text-lg font-semibold tracking-tight">Recent audits</h3>
              <p className="mt-1 text-xs text-ink-muted">Sorted by completion · click to drill in</p>
            </div>
            <Link to="/configure">
              <Button variant="secondary" size="sm">Run audit <ArrowRight className="h-3.5 w-3.5" /></Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-ink-muted">
                <tr>
                  {["Model", "Type", "Date", "Bias", "Severity", "Status", ""].map((h, i) => (
                    <th key={i} className="border-b border-white/[0.06] py-3 text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {audits.map((audit, idx) => (
                  <motion.tr
                    key={audit.id}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.04 }}
                    className="group border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                  >
                    <td className="py-4">
                      <div className="font-medium text-ink-primary">{audit.model}</div>
                      <div className="text-[11px] text-ink-muted mono">{audit.id}</div>
                    </td>
                    <td className="text-ink-secondary">{audit.type}</td>
                    <td className="text-ink-secondary">{audit.date}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="mono text-ink-primary">{audit.score}%</span>
                        {audit.score > 10 ? <TrendingUp className="h-3.5 w-3.5 text-signal-critical" /> : <TrendingDown className="h-3.5 w-3.5 text-signal-pass" />}
                      </div>
                    </td>
                    <td><Badge>{audit.severity}</Badge></td>
                    <td><Badge>{audit.status}</Badge></td>
                    <td>
                      <Link to={`/results/${audit.id}`} className="inline-flex items-center gap-1 text-saffron-300 transition group-hover:text-saffron-200">
                        Open <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="grid gap-6">
          <GlassCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="serif text-lg font-semibold tracking-tight">Last 6 audits trend</h3>
              <span className="label">Bias %</span>
            </div>
            <TrendLineChart data={trendData} threshold={10} />
          </GlassCard>

          <GlassCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="serif text-lg font-semibold tracking-tight">Upcoming audits</h3>
              <Link to="/monitor" className="text-xs text-saffron-300 hover:text-saffron-200">View all →</Link>
            </div>
            <ul className="space-y-2">
              {upcoming.map((u) => (
                <li key={u.model} className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-saffron-400/20 bg-saffron-400/[0.08]">
                      <PlayCircle className="h-4 w-4 text-saffron-300" />
                    </span>
                    <div>
                      <div className="text-sm font-medium text-ink-primary">{u.model}</div>
                      <div className="mt-0.5 text-[11px] text-ink-muted">{u.type}</div>
                    </div>
                  </div>
                  <span className="mono text-xs text-saffron-300">{u.date}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </PageWrapper>
  );
}
