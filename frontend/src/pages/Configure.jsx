import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Calendar, Clock3, PlayCircle, Settings2, Sliders, Sparkles } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import DimensionRow from "../components/audit/DimensionRow";

const dimensions = [
  ["Caste / Surname Bias", "Uses 4,200+ Indian surname database"],
  ["Religion Proxy Bias", "Inferred from name and pincode patterns"],
  ["Regional / Pincode Bias", "Metro vs non-metro and state patterns"],
  ["Gender Bias", "Male, female and non-binary profiles"],
  ["Language Fluency Bias", "English vs vernacular signals"],
  ["Age Bias", "Decision variance across age brackets"]
];

export default function Configure() {
  const [selected, setSelected] = useState(dimensions.slice(0, 4).map(([label]) => label));
  const [volume, setVolume] = useState(5000);
  const [threshold, setThreshold] = useState(95);
  const [name, setName] = useState("Retail Loan Underwriter Audit");
  const [scheduleMode, setScheduleMode] = useState("now");
  const navigate = useNavigate();
  const minutes = useMemo(() => Math.ceil(volume / 1200) + selected.length, [volume, selected.length]);

  function launch() {
    toast.loading("Generating twin profiles...", { id: "audit" });
    setTimeout(() => {
      toast.success("Audit launched and synced to Firestore", { id: "audit" });
      navigate("/results/AUD-2401");
    }, 800);
  }

  return (
    <PageWrapper>
      <div className="mb-6">
        <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> New audit</span>
        <h2 className="serif mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Configure twin generation</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-secondary">
          Pick the bias dimensions to test, decide how many synthetic twins to run, and set your
          confidence threshold. The engine will generate matched applicant pairs and stream
          decisions to Firestore.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="serif text-xl font-semibold tracking-tight">Bias dimensions</h3>
            <span className="label">{selected.length} selected</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {dimensions.map(([label, value]) => (
              <DimensionRow
                key={label}
                label={label}
                value={value}
                active={selected.includes(label)}
                onChange={() =>
                  setSelected((current) =>
                    current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
                  )
                }
              />
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-5 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-saffron-300" />
            <h3 className="serif text-xl font-semibold tracking-tight">Parameters</h3>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="label">Audit name</span>
              <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <div>
              <div className="flex items-center justify-between">
                <span className="label">Synthetic profile volume</span>
                <span className="mono text-sm font-semibold text-saffron-300">{volume.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="mt-3 w-full accent-[#FF9933]"
              />
              <div className="mt-1 flex justify-between text-[10px] text-ink-muted mono">
                <span>1,000</span><span>5,000</span><span>10,000</span>
              </div>
            </div>

            <div>
              <span className="label">Confidence threshold</span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[85, 90, 95].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setThreshold(item)}
                    className={`relative rounded-xl border py-3 text-sm font-semibold transition ${
                      threshold === item
                        ? "border-saffron-400/50 bg-saffron-400/[0.10] text-saffron-200 shadow-glow-saffron"
                        : "border-white/10 bg-white/[0.02] text-ink-secondary hover:border-white/20"
                    }`}
                  >
                    {item}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="label">Schedule</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleMode("now")}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                    scheduleMode === "now"
                      ? "border-saffron-400/50 bg-saffron-400/[0.10] text-saffron-200"
                      : "border-white/10 bg-white/[0.02] text-ink-secondary hover:border-white/20"
                  }`}
                >
                  <PlayCircle className="h-4 w-4" /> Run now
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleMode("later")}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                    scheduleMode === "later"
                      ? "border-saffron-400/50 bg-saffron-400/[0.10] text-saffron-200"
                      : "border-white/10 bg-white/[0.02] text-ink-secondary hover:border-white/20"
                  }`}
                >
                  <Calendar className="h-4 w-4" /> Schedule
                </button>
              </div>
              {scheduleMode === "later" && (
                <input className="input mt-3" type="datetime-local" />
              )}
            </div>

            <motion.div
              key={`${selected.length}-${volume}-${minutes}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-saffron-400/25 bg-saffron-400/[0.06] p-4"
            >
              <div className="flex items-center gap-2 text-saffron-300">
                <Settings2 className="h-4 w-4" />
                <span className="label" style={{ color: "inherit" }}>Plan</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="serif text-lg font-semibold text-ink-primary tabular">{selected.length}</div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-muted">Dimensions</div>
                </div>
                <div>
                  <div className="serif text-lg font-semibold text-ink-primary tabular">{volume.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-muted">Twins</div>
                </div>
                <div>
                  <div className="serif text-lg font-semibold text-ink-primary tabular flex items-center justify-center gap-1">
                    <Clock3 className="h-4 w-4 text-saffron-300" /> {minutes}m
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-muted">Estimated</div>
                </div>
              </div>
            </motion.div>

            <Button className="w-full" onClick={launch} size="lg">
              <PlayCircle className="h-4 w-4" /> Launch audit
            </Button>
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
