import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart as ReRadarChart, ResponsiveContainer, Tooltip } from "recharts";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/12 bg-bg-secondary/95 px-3 py-2 text-xs shadow-glass backdrop-blur">
      <div className="font-semibold text-ink-primary">{item.dimension}</div>
      <div className="mt-1 mono text-saffron-300">{item.score}% disparity</div>
    </div>
  );
}

export default function RadarChart({ data }) {
  const radarData = data.map((item) => ({ dimension: item.name, score: item.value }));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ReRadarChart data={radarData}>
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FF9933" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#FF5466" stopOpacity={0.18} />
          </radialGradient>
        </defs>
        <PolarGrid stroke="rgba(255,255,255,0.10)" />
        <PolarAngleAxis dataKey="dimension" stroke="#C4CCDA" tick={{ fontSize: 11, fontWeight: 600 }} />
        <PolarRadiusAxis stroke="rgba(122,134,153,0.5)" tick={{ fontSize: 10, fill: "#7A8699" }} angle={90} />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          dataKey="score"
          stroke="#FF9933"
          strokeWidth={2}
          fill="url(#radarFill)"
          fillOpacity={1}
          isAnimationActive
          animationDuration={950}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}
