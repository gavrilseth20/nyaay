import { motion } from "framer-motion";

const dimensions = ["Caste", "Religion", "Region", "Gender"];
const scenarios = ["Loan", "Hiring", "Rental", "Insurance"];

const seedMatrix = [
  [18.4, 11.8, 7.2, 4.1],
  [12.1, 8.4, 14.3, 5.2],
  [9.3, 6.1, 11.5, 3.8],
  [4.8, 3.9, 4.2, 2.1]
];

function colorFor(value) {
  if (value >= 15) return { bg: "rgba(255,84,102,0.55)", border: "rgba(255,84,102,0.85)", glow: "0 0 22px rgba(255,84,102,0.55)" };
  if (value >= 10) return { bg: "rgba(255,153,51,0.50)", border: "rgba(255,153,51,0.85)", glow: "0 0 16px rgba(255,153,51,0.45)" };
  if (value >= 5)  return { bg: "rgba(242,201,76,0.42)", border: "rgba(242,201,76,0.78)", glow: "0 0 12px rgba(242,201,76,0.36)" };
  return { bg: "rgba(61,214,140,0.32)", border: "rgba(61,214,140,0.62)", glow: "0 0 10px rgba(61,214,140,0.30)" };
}

export default function SeverityHeatmap({ matrix = seedMatrix }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px]">
        <div className="grid grid-cols-[110px_repeat(4,1fr)] gap-2">
          <div />
          {scenarios.map((s) => (
            <div key={s} className="label text-center">{s}</div>
          ))}
          {dimensions.map((dim, rowIdx) => (
            <div key={dim} className="contents">
              <div className="flex items-center text-xs font-semibold text-ink-secondary">{dim}</div>
              {scenarios.map((_, colIdx) => {
                const value = matrix[rowIdx][colIdx];
                const c = colorFor(value);
                return (
                  <motion.div
                    key={colIdx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (rowIdx * 4 + colIdx) * 0.04, duration: 0.35 }}
                    style={{
                      background: c.bg,
                      borderColor: c.border,
                      boxShadow: c.glow
                    }}
                    className="grid aspect-square place-items-center rounded-lg border text-center"
                  >
                    <span className="mono text-sm font-semibold text-white/95">{value.toFixed(1)}</span>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-[11px] text-ink-muted">
          <span className="label">Disparity %</span>
          <Legend tone="rgba(61,214,140,0.62)">≤ 5</Legend>
          <Legend tone="rgba(242,201,76,0.78)">5–10</Legend>
          <Legend tone="rgba(255,153,51,0.85)">10–15</Legend>
          <Legend tone="rgba(255,84,102,0.85)">≥ 15</Legend>
        </div>
      </div>
    </div>
  );
}

function Legend({ tone, children }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block h-3 w-3 rounded-sm" style={{ background: tone, border: `1px solid ${tone}` }} />
      {children}
    </span>
  );
}
