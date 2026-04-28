import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import GlassCard from "./GlassCard";

function parseValue(value) {
  if (typeof value === "number") return { number: value, prefix: "", suffix: "" };
  if (typeof value !== "string") return null;
  const match = value.match(/^([^\d-]*)(-?\d+(?:[.,]\d+)?)([^\d]*)$/);
  if (!match) return null;
  const [, prefix, raw, suffix] = match;
  const number = Number(String(raw).replace(/,/g, ""));
  if (Number.isNaN(number)) return null;
  return { number, prefix, suffix };
}

function AnimatedNumber({ value, decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const duration = 950;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref} className="tabular">
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
    </span>
  );
}

const toneRing = {
  blue: "after:bg-signal-info/40",
  red: "after:bg-signal-critical/45",
  green: "after:bg-signal-pass/40",
  amber: "after:bg-saffron-400/45",
  default: "after:bg-white/15"
};

const toneIcon = {
  blue: "text-signal-info bg-signal-info/10",
  red: "text-signal-critical bg-signal-critical/10",
  green: "text-signal-pass bg-signal-pass/10",
  amber: "text-saffron-300 bg-saffron-400/12",
  default: "text-ink-secondary bg-white/5"
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  delay = 0,
  trend,
  hint
}) {
  const parsed = parseValue(value);
  const decimals = parsed && /\./.test(String(value)) ? (String(value).split(".")[1].match(/\d+/)?.[0]?.length || 1) : 0;

  return (
    <GlassCard
      className={`relative p-5 after:absolute after:left-5 after:top-0 after:h-[2px] after:w-12 after:-translate-y-px after:rounded-full ${toneRing[tone] || toneRing.default}`}
      delay={delay}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="label">{label}</p>
        {Icon && (
          <div className={`grid h-9 w-9 place-items-center rounded-xl ${toneIcon[tone] || toneIcon.default}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.1, duration: 0.5 }}
          className="serif text-3xl font-semibold leading-none tracking-tight"
        >
          {parsed ? (
            <>
              {parsed.prefix}
              <AnimatedNumber value={parsed.number} decimals={decimals} />
              {parsed.suffix}
            </>
          ) : (
            value
          )}
        </motion.div>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.startsWith("-") ? "text-signal-pass" : "text-signal-critical"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      {hint && <p className="mt-2 text-xs text-ink-muted">{hint}</p>}
    </GlassCard>
  );
}
