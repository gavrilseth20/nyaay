import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { ArrowLeft, Chrome, ShieldCheck } from "lucide-react";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";
import Logo from "../components/ui/Logo";
import { useAuth } from "../hooks/useAuth";

const tagline = [
  "DPDP Act compliant evidence packs",
  "Counterfactual confidence intervals",
  "Twin probes streamed in real-time"
];

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ orgName: "", email: "", password: "", confirm: "" });
  const { login, register, googleLogin, clerkEnabled } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    if (mode === "register" && form.password !== form.confirm) return toast.error("Passwords do not match");
    try {
      toast.loading(mode === "login" ? "Signing in..." : "Creating workspace...", { id: "auth" });
      if (mode === "login") await login(form.email, form.password);
      else await register({ orgName: form.orgName, email: form.email, password: form.password });
      toast.success("Welcome to Nyaay", { id: "auth" });
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Authentication failed", { id: "auth" });
    }
  }

  async function signInGoogle() {
    try {
      await googleLogin();
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="aurora min-h-screen lg:grid lg:grid-cols-2">
      {/* Left storytelling pane */}
      <div className="relative flex flex-col justify-between p-8 lg:p-14">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-muted transition hover:text-saffron-300">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div>
          <Logo size={44} />
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="serif mt-10 max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            Evidence-grade fairness audits, made for{" "}
            <span className="italic text-saffron-300">Indian AI</span>.
          </motion.h1>
          <p className="mt-5 max-w-md text-base leading-7 text-ink-secondary">
            Every login lands in a workspace where caste, religion, and region are first-class
            audit dimensions — not afterthoughts.
          </p>

          <ul className="mt-8 space-y-3">
            {tagline.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-center gap-3 text-sm text-ink-secondary"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg border border-saffron-400/30 bg-saffron-400/[0.08]">
                  <ShieldCheck className="h-3.5 w-3.5 text-saffron-300" />
                </span>
                {t}
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="mono text-[11px] text-ink-muted">
          MIT code · CC-BY-4.0 dataset · Built for Solution Challenge 2026
        </p>
      </div>

      {/* Right form pane */}
      <div className="relative flex items-center justify-center p-5 lg:border-l lg:border-white/[0.06]">
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-gradient-to-br from-saffron-400/[0.06] via-transparent to-signal-info/[0.06] lg:block" />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <GlassCard className="p-6">
            <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-white/[0.06] bg-white/[0.025] p-1">
              {["login", "register"].map((item) => (
                <button
                  key={item}
                  onClick={() => setMode(item)}
                  className={`relative rounded-lg py-2 text-sm font-semibold capitalize transition-colors ${
                    mode === item ? "text-midnight-900" : "text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  {mode === item && (
                    <motion.span
                      layoutId="authTab"
                      className="absolute inset-0 rounded-lg bg-saffron-gradient shadow-glow-saffron"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item}</span>
                </button>
              ))}
            </div>

            {clerkEnabled ? (
              <div className="[&_.cl-card]:!bg-transparent [&_.cl-card]:!shadow-none [&_.cl-footer]:!hidden [&_.cl-headerTitle]:!text-ink-primary [&_.cl-headerSubtitle]:!text-ink-secondary [&_.cl-formButtonPrimary]:!bg-saffron-400 [&_.cl-formButtonPrimary]:!text-midnight-900 [&_.cl-socialButtonsIconButton]:!border-white/10 [&_.cl-internal-1z9b6h7]:!text-ink-secondary">
                {mode === "login"
                  ? <SignIn routing="hash" afterSignInUrl="/dashboard" signUpUrl="/auth#register" />
                  : <SignUp routing="hash" afterSignUpUrl="/dashboard" signInUrl="/auth" />}
              </div>
            ) : (
              <>
                <div className="mb-4 rounded-xl border border-saffron-400/25 bg-saffron-400/[0.08] p-3 text-xs leading-5 text-saffron-200">
                  Set <span className="mono">VITE_CLERK_PUBLISHABLE_KEY</span> to enable real Clerk auth.
                  This local form keeps the prototype runnable for judging.
                </div>
                <form onSubmit={submit} className="space-y-3">
                  {mode === "register" && (
                    <input className="input" placeholder="Organisation name" value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} required />
                  )}
                  <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  {mode === "register" && (
                    <input className="input" type="password" placeholder="Confirm password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
                  )}
                  <Button className="w-full" type="submit">{mode === "login" ? "Sign in" : "Create workspace"}</Button>
                </form>
                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-[11px] uppercase tracking-wider text-ink-muted">or</span>
                  <span className="h-px flex-1 bg-white/[0.06]" />
                </div>
                <Button className="w-full" variant="secondary" onClick={signInGoogle}>
                  <Chrome className="h-4 w-4" /> Continue as demo user
                </Button>
              </>
            )}
          </GlassCard>

          <p className="mt-5 text-center text-xs text-ink-muted">
            By continuing you agree to the audit-evidence retention policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
