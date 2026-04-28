import { useState } from "react";
import { Copy, KeyRound, Mail, RefreshCcw, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import PageWrapper from "../components/layout/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

export default function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [digest, setDigest] = useState(true);
  const apiKey = "nyaay_live_sk_••••••••••••7f2a";

  async function copy() {
    try {
      await navigator.clipboard.writeText("nyaay_live_sk_4f9e2c1a3d8b9b7e7f2a");
      toast.success("API key copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <PageWrapper>
      <div className="mb-6">
        <p className="label">Workspace settings</p>
        <h2 className="serif mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Organisation & API</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard className="p-6">
          <h3 className="serif text-xl font-semibold tracking-tight">Organisation profile</h3>
          <p className="mt-1 text-sm text-ink-secondary">Used in your generated compliance reports.</p>
          <div className="mt-5 space-y-3">
            <label className="block">
              <span className="label">Org name</span>
              <input className="input mt-2" defaultValue="Nyaay Demo Org" />
            </label>
            <label className="block">
              <span className="label">Compliance contact</span>
              <input className="input mt-2" defaultValue="compliance@nyaay.demo" type="email" />
            </label>
            <Button><Save className="h-4 w-4" /> Save profile</Button>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-1 flex items-center gap-2 text-saffron-300">
            <KeyRound className="h-4 w-4" />
            <span className="label" style={{ color: "inherit" }}>Partner API</span>
          </div>
          <h3 className="serif text-xl font-semibold tracking-tight">Programmatic audits</h3>
          <p className="mt-1 text-sm text-ink-secondary">Use this key to launch audits from your CI/CD pipeline.</p>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 mono text-sm text-saffron-200">
            <span className="truncate">{apiKey}</span>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-ink-secondary transition hover:border-saffron-400/40 hover:text-saffron-300"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
          <Button variant="secondary" className="mt-3" size="sm">
            <RefreshCcw className="h-3.5 w-3.5" /> Rotate key
          </Button>

          <div className="mt-6 space-y-3">
            <Toggle
              icon={Mail}
              label="Email critical bias alerts"
              hint="Page on-call when disparity exceeds threshold."
              value={emailAlerts}
              onChange={setEmailAlerts}
            />
            <Toggle
              icon={Mail}
              label="Monthly compliance digest"
              hint="One PDF, every audit and remediation, first Monday."
              value={digest}
              onChange={setDigest}
            />
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}

function Toggle({ icon: Icon, label, hint, value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition hover:border-white/15"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-ink-secondary">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <div className="text-sm font-semibold text-ink-primary">{label}</div>
          <div className="mt-0.5 text-xs text-ink-muted">{hint}</div>
        </div>
      </div>
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
          value ? "bg-saffron-gradient" : "bg-white/10"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow-md transition ${value ? "translate-x-5" : ""}`}
        />
      </span>
    </button>
  );
}
