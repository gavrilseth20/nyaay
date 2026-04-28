import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/12 bg-bg-secondary/95 px-3 py-2 text-xs shadow-glass backdrop-blur">
      <div className="label mb-1">{label}</div>
      <div className="space-y-0.5">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 mono">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
            <span className="capitalize text-ink-secondary">{p.dataKey}</span>
            <span className="ml-auto font-semibold text-ink-primary">{p.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrendLineChart({ data, multi = false, threshold = 10 }) {
  if (!multi) {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ left: 4, right: 12, top: 12, bottom: 4 }}>
          <defs>
            <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9933" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#FF9933" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" stroke="#7A8699" tick={{ fontSize: 11 }} />
          <YAxis stroke="#7A8699" unit="%" tick={{ fontSize: 11 }} />
          <ReferenceArea y1={threshold} y2={1000} fill="rgba(255,84,102,0.06)" />
          <ReferenceLine y={threshold} stroke="rgba(255,153,51,0.5)" strokeDasharray="4 4" label={{ value: `Threshold ${threshold}%`, fill: "#FFB35F", fontSize: 10, position: "right" }} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,153,51,0.4)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#FF9933"
            strokeWidth={2.5}
            fill="url(#trendArea)"
            dot={{ r: 3, stroke: "#FF9933", fill: "#070B17", strokeWidth: 2 }}
            activeDot={{ r: 5, stroke: "#FF9933", fill: "#FFCD96" }}
            animationDuration={950}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ left: 4, right: 12, top: 12, bottom: 4 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" stroke="#7A8699" tick={{ fontSize: 11 }} />
        <YAxis stroke="#7A8699" unit="%" tick={{ fontSize: 11 }} />
        <ReferenceArea y1={threshold} y2={1000} fill="rgba(255,84,102,0.05)" />
        <ReferenceLine y={threshold} stroke="rgba(255,153,51,0.5)" strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          wrapperStyle={{ paddingBottom: 8, fontSize: 11, color: "#C4CCDA" }}
        />
        <Line type="monotone" dataKey="caste" stroke="#FF5466" strokeWidth={2.5} dot={false} animationDuration={900} />
        <Line type="monotone" dataKey="religion" stroke="#FF9933" strokeWidth={2.5} dot={false} animationDuration={900} />
        <Line type="monotone" dataKey="region" stroke="#5EA0FF" strokeWidth={2.5} dot={false} animationDuration={900} />
        <Line type="monotone" dataKey="gender" stroke="#3DD68C" strokeWidth={2.5} dot={false} animationDuration={900} />
      </LineChart>
    </ResponsiveContainer>
  );
}
