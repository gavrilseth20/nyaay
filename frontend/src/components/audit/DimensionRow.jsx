import { motion } from "framer-motion";

export default function DimensionRow({ label, value, active, onChange }) {
  return (
    <motion.button
      type="button"
      onClick={onChange}
      whileTap={{ scale: 0.99 }}
      className={`group relative flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${
        active
          ? "border-saffron-400/40 bg-saffron-400/[0.06] shadow-glow-saffron"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
      }`}
    >
      <span className="min-w-0">
        <span className={`block font-semibold ${active ? "text-saffron-200" : "text-ink-primary"}`}>{label}</span>
        <span className="mt-1 block text-xs text-ink-muted">{value}</span>
      </span>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          active ? "bg-saffron-gradient" : "bg-white/10"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 480, damping: 32 }}
          className={`block h-5 w-5 rounded-full bg-white shadow-md ${active ? "ml-auto" : ""}`}
        />
      </span>
    </motion.button>
  );
}
