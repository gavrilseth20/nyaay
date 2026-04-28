import { motion } from "framer-motion";

export default function ProgressBar({ value = 0, tone = "saffron", height = 8, threshold }) {
  const tones = {
    saffron: "from-saffron-400 to-saffron-600",
    blue: "from-signal-info to-midnight-400",
    pass: "from-signal-pass to-emerald-500",
    critical: "from-signal-critical to-rose-600"
  };
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="relative w-full overflow-hidden rounded-full bg-white/[0.06]"
      style={{ height }}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full rounded-full bg-gradient-to-r ${tones[tone] || tones.saffron} relative`}
      >
        <span className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.0)_0%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.0)_100%)] bg-[length:200%_100%] animate-shimmer" />
      </motion.div>
      {typeof threshold === "number" && (
        <span
          className="absolute top-0 h-full w-px bg-white/40"
          style={{ left: `${threshold}%` }}
          aria-label={`threshold ${threshold}%`}
        />
      )}
    </div>
  );
}
