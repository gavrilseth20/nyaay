import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";

const defaultBase = {
  name: "Aarav Sharma",
  surname: "Sharma",
  pincode: "400001",
  city: "Mumbai",
  age: 32,
  income: "₹ 12,40,000",
  credit: 762,
  community: "Brahmin"
};

const defaultTwin = {
  name: "Rahul Paswan",
  surname: "Paswan",
  pincode: "834001",
  city: "Ranchi",
  age: 32,
  income: "₹ 12,40,000",
  credit: 762,
  community: "SC"
};

function fieldsFrom(profile) {
  return [
    ["Name", profile.name, "name"],
    ["Pincode", profile.pincode, "pincode"],
    ["Age", String(profile.age), "age"],
    ["Income", profile.income, "income"],
    ["Credit score", String(profile.credit), "credit"],
    ["Community proxy", profile.community, "community"]
  ];
}

function ProfilePanel({
  side,
  profile,
  decision = "Approved",
  reason = "Approved at threshold 720+ with affordability check passing.",
  changedKeys = new Set()
}) {
  const fields = useMemo(() => fieldsFrom(profile), [profile]);
  const isApproved = decision.toLowerCase() === "approved" || decision.toLowerCase() === "pass";
  const tone = isApproved
    ? "border-signal-pass/40 from-signal-pass/[0.10] to-transparent"
    : "border-signal-critical/40 from-signal-critical/[0.10] to-transparent";
  const dotTone = isApproved ? "bg-signal-pass" : "bg-signal-critical";
  return (
    <div className={`relative rounded-2xl border bg-gradient-to-br p-5 ${tone}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="label">{side === "base" ? "Reference Twin" : "Counterfactual Twin"}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold">
          <span className={`h-1.5 w-1.5 rounded-full ${dotTone}`} />
          {decision}
        </span>
      </div>
      <div className="serif text-xl font-semibold tracking-tight">{profile.name}</div>
      <div className="mt-1 text-xs text-ink-muted">{profile.city} · {profile.community}</div>
      <dl className="mt-4 space-y-2 text-xs">
        {fields.map(([label, value, key]) => {
          const changed = changedKeys.has(key);
          return (
            <div
              key={key}
              className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 ${changed ? "bg-saffron-400/10 ring-1 ring-saffron-400/30" : ""}`}
            >
              <dt className="text-ink-muted">{label}</dt>
              <dd className={`mono ${changed ? "text-saffron-200" : "text-ink-secondary"}`}>{value}</dd>
            </div>
          );
        })}
      </dl>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] leading-5 text-ink-muted">
        {reason}
      </div>
    </div>
  );
}

export default function TwinDiff({
  base = defaultBase,
  twin = defaultTwin,
  baseDecision = "Approved",
  twinDecision = "Rejected",
  baseReason = "Approved with credit score 762, affordability ratio 0.31.",
  twinReason = "Rejected at risk band 4. Reviewer flagged regional risk.",
  changedKeys = new Set(["name", "pincode", "community"]),
  delta = "+18.4%"
}) {
  const isBiased = baseDecision.toLowerCase() !== twinDecision.toLowerCase();
  return (
    <div className="relative">
      <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr]">
        <ProfilePanel
          side="base"
          profile={base}
          decision={baseDecision}
          reason={baseReason}
          changedKeys={changedKeys}
        />

        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 grid h-20 w-20 place-items-center rounded-2xl border bg-bg-secondary/80 backdrop-blur-md ${
              isBiased ? "border-signal-critical/50 shadow-glow-critical" : "border-signal-pass/40"
            }`}
          >
            {isBiased ? (
              <CircleAlert className="h-9 w-9 text-signal-critical" />
            ) : (
              <CircleCheck className="h-9 w-9 text-signal-pass" />
            )}
            <span
              aria-hidden
              className={`absolute inset-0 rounded-2xl ${
                isBiased ? "border border-signal-critical/40 critical-pulse" : ""
              }`}
            />
          </motion.div>
          <div className="absolute inset-x-0 top-1/2 -z-0 h-px -translate-y-1/2 bg-gradient-to-r from-signal-pass/40 via-saffron-400/60 to-signal-critical/40 md:block" />
        </div>

        <ProfilePanel
          side="twin"
          profile={twin}
          decision={twinDecision}
          reason={twinReason}
          changedKeys={changedKeys}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <div className={`grid h-9 w-9 place-items-center rounded-lg ${isBiased ? "bg-signal-critical/15 text-signal-critical" : "bg-signal-pass/15 text-signal-pass"}`}>
            <ArrowRight className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">
              {isBiased ? "Decision diverged after a single proxy swap" : "Decision held under counterfactual swap"}
            </div>
            <div className="mt-0.5 text-xs text-ink-muted">
              Same merit, only {Array.from(changedKeys).join(" + ")} changed.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="label">Disparity</span>
          <span className={`mono text-lg font-semibold ${isBiased ? "text-signal-critical" : "text-signal-pass"}`}>{delta}</span>
        </div>
      </div>
    </div>
  );
}
