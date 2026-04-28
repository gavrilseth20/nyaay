import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import Badge from "../ui/Badge";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";

export default function RemediationCard({ fix, onResolved }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard className={`p-5 ${fix.resolved ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge>{fix.priority}</Badge>
            <span className="mono text-[11px] text-ink-muted">FIX-{String(fix.id).padStart(3, "0")}</span>
          </div>
          <h3 className={`serif mt-3 text-lg font-semibold tracking-tight ${fix.resolved ? "line-through text-ink-muted" : "text-ink-primary"}`}>
            {fix.title}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-secondary">{fix.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-ink-secondary">Effort · {fix.effort}</span>
          <span className="rounded-full border border-saffron-400/25 bg-saffron-400/[0.08] px-2.5 py-1 text-[11px] font-semibold text-saffron-300">Impact · {fix.impact}</span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <pre className="rounded-xl border border-white/[0.08] bg-black/30 p-4 text-xs leading-5 text-saffron-100 mono whitespace-pre-wrap">
              {fix.note}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant={fix.resolved ? "primary" : "secondary"}
          size="sm"
          onClick={onResolved}
        >
          {fix.resolved ? <><Check className="h-3.5 w-3.5" /> Resolved</> : "Mark resolved"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen((s) => !s)}>
          {open ? "Hide details" : "View details"}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </Button>
      </div>
    </GlassCard>
  );
}
