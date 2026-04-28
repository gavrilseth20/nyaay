const styles = {
  Critical: "bg-signal-critical/12 text-signal-critical border-signal-critical/35",
  High: "bg-saffron-400/12 text-saffron-200 border-saffron-400/35",
  Medium: "bg-signal-medium/12 text-signal-medium border-signal-medium/35",
  Low: "bg-signal-info/12 text-signal-info border-signal-info/35",
  Passed: "bg-signal-pass/12 text-signal-pass border-signal-pass/35",
  Complete: "bg-signal-pass/12 text-signal-pass border-signal-pass/35",
  Review: "bg-saffron-400/12 text-saffron-200 border-saffron-400/35"
};

const dots = {
  Critical: "bg-signal-critical",
  High: "bg-saffron-400",
  Medium: "bg-signal-medium",
  Low: "bg-signal-info",
  Passed: "bg-signal-pass",
  Complete: "bg-signal-pass",
  Review: "bg-saffron-400"
};

export default function Badge({ children, pulse = false }) {
  const variant = styles[children] || styles.Medium;
  const dot = dots[children] || dots.Medium;
  const isCritical = children === "Critical";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${variant} ${pulse && isCritical ? "critical-pulse" : ""}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot} ${pulse ? "animate-pulse-soft" : ""}`} />
      {children}
    </span>
  );
}
