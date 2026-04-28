import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const colorFor = (v) => {
  if (v >= 15) return "#FF5466";
  if (v >= 10) return "#FF9933";
  if (v >= 5)  return "#F2C94C";
  return "#3DD68C";
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <div className="rounded-xl border border-white/12 bg-bg-secondary/95 px-3 py-2 text-xs shadow-glass backdrop-blur">
      <div className="font-semibold text-ink-primary">{label}</div>
      <div className="mt-1 mono text-saffron-300">Disparity {v}%</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-ink-muted">
        {v >= 15 ? "Critical" : v >= 10 ? "High" : v >= 5 ? "Medium" : "Pass"}
      </div>
    </div>
  );
}

export default function BiasBarChart({ data, threshold = 10 }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 12, right: 24, top: 8, bottom: 8 }}>
        <defs>
          <linearGradient id="barCritical" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF5466" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#FF5466" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="barHigh" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF9933" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#FF9933" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="barMedium" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F2C94C" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#F2C94C" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="barPass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3DD68C" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#3DD68C" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis type="number" stroke="#7A8699" unit="%" tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#C4CCDA"
          width={84}
          tick={{ fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <ReferenceLine
          x={threshold}
          stroke="rgba(255,153,51,0.45)"
          strokeDasharray="4 4"
          label={{ value: `Threshold ${threshold}%`, fill: "#FFB35F", fontSize: 10, position: "top" }}
        />
        <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[0, 10, 10, 0]} animationDuration={950}>
          {data.map((entry, index) => {
            const v = entry.value;
            const id = v >= 15 ? "barCritical" : v >= 10 ? "barHigh" : v >= 5 ? "barMedium" : "barPass";
            return <Cell key={`cell-${index}`} fill={`url(#${id})`} stroke={colorFor(v)} strokeOpacity={0.4} />;
          })}
          <LabelList
            dataKey="value"
            position="right"
            content={(props) => {
              const { x, y, width, height, value } = props;
              return (
                <text
                  x={x + width + 8}
                  y={y + height / 2}
                  fill={colorFor(value)}
                  fontSize="11"
                  fontWeight="600"
                  alignmentBaseline="middle"
                  fontFamily="JetBrains Mono"
                >
                  {value}%
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
