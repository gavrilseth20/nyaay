import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Brain,
  CircleDot,
  Database,
  Github,
  Layers,
  LineChart,
  PlayCircle,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
  Zap
} from "lucide-react";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";
import Logo from "../components/ui/Logo";
import TwinDiff from "../components/audit/TwinDiff";

const features = [
  {
    icon: Scale,
    title: "India-native protected proxies",
    body:
      "AIF360 and Fairlearn encode US race and gender. Nyaay tests caste-linked surnames, religion proxies via pincode, region, language and gender — the dimensions Indian models actually fail on.",
    accent: "saffron"
  },
  {
    icon: Layers,
    title: "Counterfactual twin engine",
    body:
      "Generate matched applicant pairs that are identical in merit but differ on one demographic signal. Send both to the model. Measure decision divergence with confidence intervals.",
    accent: "blue"
  },
  {
    icon: ShieldCheck,
    title: "Compliance-ready evidence",
    body:
      "Every audit produces a defensible report mapping to DPDP Act, RBI Fair Practices Code and EU AI Act Article 10 — not vibes-based fairness checks.",
    accent: "saffron"
  },
  {
    icon: Brain,
    title: "Model-agnostic",
    body:
      "Audit any model: locally hosted (Ollama, Llama 3.x), proprietary APIs (Gemini, Claude, OpenAI) or your own fine-tunes. One harness, twin profiles, decision diff.",
    accent: "blue"
  }
];

const steps = [
  ["Upload", "CSV / XLS of historical decisions or define a live model schema."],
  ["Map", "Auto-detect surname, pincode, gender and custom proxy columns."],
  ["Twin", "Generate matched profiles that vary only the protected signal."],
  ["Probe", "Run twin pairs against the model. Stream results incrementally."],
  ["Report", "Statistical findings, severity, remediation guidance, PDF export."]
];

const comparison = [
  ["Indian surnames (caste signal)", false, false, true],
  ["Pincode → religion proxy", false, false, true],
  ["Multidirectional twin tests", true, false, true],
  ["DPDP Act / RBI mapping", false, false, true],
  ["Model-agnostic harness", true, true, true],
  ["Counterfactual confidence intervals", true, true, true]
];

const stats = [
  ["320+", "Twin probes / audit"],
  ["54", "Surnames × 12 communities"],
  ["4", "High-stakes scenarios"],
  ["20 min", "Avg. local audit"]
];

export default function Landing() {
  const { scrollY } = useScroll();
  const yShift = useTransform(scrollY, [0, 400], [0, -40]);
  const [showDemo, setShowDemo] = useState(false);
  const [variant, setVariant] = useState(0);
  const variants = [
    {
      base: { name: "Aarav Sharma", surname: "Sharma", pincode: "400001", city: "Mumbai", age: 32, income: "₹ 12,40,000", credit: 762, community: "Brahmin" },
      twin: { name: "Rahul Paswan", surname: "Paswan", pincode: "834001", city: "Ranchi", age: 32, income: "₹ 12,40,000", credit: 762, community: "SC" },
      baseDecision: "Approved",
      twinDecision: "Rejected",
      baseReason: "Approved at credit 762 with affordability 0.31.",
      twinReason: "Rejected — risk band 4 cited despite identical merit.",
      changedKeys: new Set(["name", "pincode", "community"]),
      delta: "+18.4%"
    },
    {
      base: { name: "Priya Iyer", surname: "Iyer", pincode: "560001", city: "Bengaluru", age: 28, income: "₹ 9,80,000", credit: 738, community: "Tamil Brahmin" },
      twin: { name: "Salma Khan", surname: "Khan", pincode: "110025", city: "Delhi", age: 28, income: "₹ 9,80,000", credit: 738, community: "Muslim" },
      baseDecision: "Approved",
      twinDecision: "Review",
      baseReason: "Approved with strong income and metro tier-1 location.",
      twinReason: "Held for manual review citing 'address risk indicators'.",
      changedKeys: new Set(["name", "pincode", "community"]),
      delta: "+12.1%"
    },
    {
      base: { name: "Vikram Reddy", surname: "Reddy", pincode: "500001", city: "Hyderabad", age: 35, income: "₹ 14,20,000", credit: 781, community: "Reddy" },
      twin: { name: "Mahesh Meghwal", surname: "Meghwal", pincode: "324001", city: "Kota", age: 35, income: "₹ 14,20,000", credit: 781, community: "SC" },
      baseDecision: "Approved",
      twinDecision: "Rejected",
      baseReason: "Approved — premium tier underwriting band.",
      twinReason: "Rejected — score downshifted by regional risk multiplier.",
      changedKeys: new Set(["name", "pincode", "community"]),
      delta: "+15.6%"
    }
  ];

  useEffect(() => {
    if (!showDemo) return;
    const id = setInterval(() => setVariant((v) => (v + 1) % variants.length), 5500);
    return () => clearInterval(id);
  }, [showDemo, variants.length]);

  return (
    <div className="aurora min-h-screen">
      {/* Top nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.04] bg-bg-primary/65 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/"><Logo size={38} /></Link>
          <div className="hidden gap-8 text-sm text-ink-secondary md:flex">
            <a href="#why" className="hover:text-ink-primary transition">Why Nyaay</a>
            <a href="#workflow" className="hover:text-ink-primary transition">Workflow</a>
            <a href="#compare" className="hover:text-ink-primary transition">Vs AIF360</a>
            <a href="#demo" className="hover:text-ink-primary transition">Demo</a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-ink-secondary transition hover:border-saffron-400/40 hover:text-ink-primary md:inline-flex"
              aria-label="github"
            >
              <Github className="h-4 w-4" />
            </a>
            <Link to="/auth"><Button>Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-12 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pb-20 lg:pt-16">
        <motion.div style={{ y: yShift }} className="relative">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            Solution Challenge 2026 · Unbiased AI Decision
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="serif mt-6 text-[44px] font-semibold leading-[1.04] tracking-[-0.02em] text-ink-primary md:text-6xl lg:text-[68px]"
          >
            Audit any AI for the bias{" "}
            <span className="relative inline-block">
              <span className="relative z-10 italic text-saffron-300">India</span>
              <span aria-hidden className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-saffron-400/25 blur-md" />
            </span>{" "}
            actually has.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 max-w-xl text-base leading-7 text-ink-secondary md:text-lg"
          >
            IBM AIF360, Google What-If, and Microsoft Fairlearn encode US protected attributes.
            Nyaay tests caste-linked surnames, pincode-religion proxies, regional and class signals
            — with counterfactual twin pairs that change one thing and compare what the model does.
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/dashboard">
              <Button size="lg">Start Free Audit <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <button
              onClick={() => setShowDemo((s) => !s)}
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-ink-secondary transition hover:border-saffron-400/40 hover:text-ink-primary"
            >
              <PlayCircle className="h-4 w-4 text-saffron-300" />
              {showDemo ? "Pause demo" : "Watch a twin test"}
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map(([n, label]) => (
              <div key={label} className="border-l border-white/10 pl-3">
                <div className="serif text-2xl font-semibold tracking-tight text-ink-primary">{n}</div>
                <div className="mt-1 text-xs text-ink-muted">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero centerpiece — twin divergence */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-8 rounded-[40px] bg-saffron-400/10 blur-3xl" aria-hidden />
          <div className="absolute -inset-8 rounded-[40px] bg-signal-info/10 blur-3xl" aria-hidden />

          <GlassCard className="relative p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="live-dot" />
                <span className="label">Live twin test · Retail loan model</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-critical/30 bg-signal-critical/10 px-2.5 py-1 text-[11px] font-semibold text-signal-critical">
                <CircleDot className="h-3 w-3" /> Critical
              </span>
            </div>

            <motion.div key={variant} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <TwinDiff {...variants[variant]} />
            </motion.div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-ink-muted">
              <span>Variant {variant + 1} of {variants.length}</span>
              <div className="flex gap-1.5">
                {variants.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setVariant(i)}
                    className={`h-1.5 w-6 rounded-full transition-colors ${i === variant ? "bg-saffron-400" : "bg-white/15 hover:bg-white/25"}`}
                    aria-label={`view variant ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto max-w-7xl px-5 pb-10">
        <div className="grid grid-cols-2 gap-6 border-y border-white/[0.06] py-6 md:grid-cols-4">
          {[
            ["Caste · Surname", "Critical", "text-signal-critical"],
            ["Religion · Pincode", "High", "text-saffron-300"],
            ["Region · Tier", "Medium", "text-signal-medium"],
            ["Gender · Class", "Pass", "text-signal-pass"]
          ].map(([dim, sev, color]) => (
            <div key={dim} className="flex items-center justify-between">
              <span className="text-sm text-ink-secondary">{dim}</span>
              <span className={`text-xs font-semibold ${color}`}>{sev}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section id="why" className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="eyebrow">Why this exists</span>
            <h2 className="serif mt-5 max-w-md text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              The fairness toolbox is built for a country that isn't ours.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-ink-secondary">
              In India, bias hides in surnames, pincodes, and language signals — not the variables
              the standard tools watch. Nyaay was built to surface the bias that matters here, with
              evidence courts and regulators can use.
            </p>
            <span className="accent-rule mt-8" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {features.map(({ icon: Icon, title, body, accent }, idx) => (
              <GlassCard
                key={title}
                delay={idx * 0.07}
                className="group p-5"
                interactive
              >
                <div
                  className={`mb-4 grid h-10 w-10 place-items-center rounded-xl ${
                    accent === "saffron"
                      ? "bg-saffron-400/10 text-saffron-300 border border-saffron-400/25"
                      : "bg-signal-info/10 text-signal-info border border-signal-info/25"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="serif text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-secondary">{body}</p>
                <ArrowUpRight className="mt-5 h-4 w-4 text-ink-muted transition group-hover:text-saffron-300" />
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow"><Workflow className="h-3.5 w-3.5" /> Workflow</span>
            <h2 className="serif mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
              From data to defensible evidence in five steps.
            </h2>
          </div>
          <Link to="/upload">
            <Button variant="secondary">Try the upload flow <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[34px] hidden h-px bg-gradient-to-r from-transparent via-saffron-400/40 to-transparent md:block" aria-hidden />
          <div className="grid gap-4 md:grid-cols-5">
            {steps.map(([title, body], i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-saffron-400/30 bg-saffron-400/[0.08] mono text-sm font-semibold text-saffron-300">
                    0{i + 1}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Step</span>
                </div>
                <div className="serif text-lg font-semibold">{title}</div>
                <p className="mt-2 text-xs leading-5 text-ink-muted">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison vs incumbents */}
      <section id="compare" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-10 max-w-2xl">
          <span className="eyebrow"><Target className="h-3.5 w-3.5" /> The moat</span>
          <h2 className="serif mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
            What AIF360 and Fairlearn structurally miss.
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-secondary">
            The big fairness libraries assume US protected classes. They have no notion of caste,
            no understanding of pincode-as-religion-proxy, no Indian language fluency signal.
            Nyaay starts from those.
          </p>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="grid grid-cols-[1.6fr_repeat(3,1fr)] text-sm">
            <div className="border-b border-white/[0.06] p-4 label">Capability</div>
            <div className="border-b border-l border-white/[0.06] p-4 text-center label">IBM AIF360</div>
            <div className="border-b border-l border-white/[0.06] p-4 text-center label">MS Fairlearn</div>
            <div className="border-b border-l border-saffron-400/30 bg-saffron-400/[0.05] p-4 text-center">
              <span className="inline-flex items-center gap-1.5 text-saffron-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="label" style={{ color: "inherit" }}>Nyaay</span>
              </span>
            </div>

            {comparison.map(([cap, aif, fl, ny], idx) => (
              <div key={cap} className="contents">
                <div className={`p-4 text-ink-secondary ${idx < comparison.length - 1 ? "border-b border-white/[0.04]" : ""}`}>{cap}</div>
                <Cell value={aif} />
                <Cell value={fl} />
                <Cell value={ny} highlight />
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Demo CTA */}
      <section id="demo" className="mx-auto max-w-7xl px-5 py-16">
        <GlassCard className="relative overflow-hidden p-8 md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-saffron-400/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-signal-info/15 blur-3xl"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow"><Zap className="h-3.5 w-3.5" /> Try it</span>
              <h2 className="serif mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Run a twin test on a model you actually use.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-ink-secondary">
                Bring an Ollama model, a Gemini API key, or a custom endpoint. Define the schema,
                pick the field to swap, and watch the divergence in real time.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/live-audit">
                  <Button size="lg"><PlayCircle className="h-4 w-4" /> Open Live Audit</Button>
                </Link>
                <Link to="/upload">
                  <Button variant="secondary" size="lg">Upload decisions instead</Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                ["Ollama / Llama 3.x", "Local · 320 probes / 20 min", "text-signal-pass border-signal-pass/30"],
                ["Gemini · GPT · Claude", "API · twin pairs streamed", "text-saffron-300 border-saffron-400/30"],
                ["Custom endpoint", "BYO body template + response path", "text-signal-info border-signal-info/30"]
              ].map(([title, body, color]) => (
                <div key={title} className={`flex items-center justify-between rounded-2xl border bg-white/[0.02] p-4 ${color}`}>
                  <div>
                    <div className="text-sm font-semibold text-ink-primary">{title}</div>
                    <div className="mt-0.5 text-xs text-ink-muted">{body}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo size={36} />
            <p className="mt-4 max-w-sm text-sm leading-6 text-ink-muted">
              India-native AI bias auditing. Built for Solution Challenge 2026 · problem statement
              <span className="text-ink-secondary"> Unbiased AI Decision</span>.
            </p>
          </div>
          <FooterCol title="Product" items={[["Dashboard", "/dashboard"], ["Upload", "/upload"], ["Live Audit", "/live-audit"], ["Reports", "/reports"]]} />
          <FooterCol title="Methodology" items={[["Twin generator", "#workflow"], ["Bias dimensions", "#why"], ["AIF360 vs Nyaay", "#compare"]]} />
          <FooterCol title="Compliance" items={[["DPDP Act 2023", "#"], ["RBI Fair Practices", "#"], ["EU AI Act Art. 10", "#"]]} />
        </div>
        <div className="border-t border-white/[0.04] py-5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              <Database className="h-3.5 w-3.5" />
              Powered by Firebase, Ollama, and the Indian Bias Layer.
            </div>
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-3.5 w-3.5 text-signal-pass" />
              MIT code · CC-BY-4.0 dataset
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Cell({ value, highlight = false }) {
  return (
    <div className={`flex items-center justify-center border-b border-l p-4 ${
      highlight ? "border-saffron-400/30 bg-saffron-400/[0.04]" : "border-white/[0.04]"
    }`}>
      {value ? (
        <span className={`grid h-7 w-7 place-items-center rounded-full ${
          highlight ? "bg-saffron-400/20 text-saffron-300" : "bg-signal-pass/15 text-signal-pass"
        }`}>
          <BadgeCheck className="h-3.5 w-3.5" />
        </span>
      ) : (
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/[0.04] text-ink-muted">
          <span className="h-px w-3 bg-current" />
        </span>
      )}
    </div>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <p className="label">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
        {items.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="transition hover:text-saffron-300">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
