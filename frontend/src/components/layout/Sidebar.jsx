import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Bot,
  FileText,
  Home,
  LineChart,
  Settings,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  WandSparkles,
  X
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../ui/Logo";

const sections = [
  {
    title: "Workspace",
    items: [
      ["/dashboard", Home, "Dashboard"],
      ["/upload", UploadCloud, "Upload Data"],
      ["/configure", WandSparkles, "Run Audit"]
    ]
  },
  {
    title: "Audit",
    items: [
      ["/results/AUD-2401", BarChart3, "Results"],
      ["/remediation/AUD-2401", ShieldCheck, "Remediation"],
      ["/reports", FileText, "Reports"],
      ["/monitor", LineChart, "Monitor"]
    ]
  },
  {
    title: "Tools",
    items: [
      ["/live-audit", Bot, "Live AI Audit"],
      ["/settings", Settings, "Settings"]
    ]
  }
];

function NavItem({ to, Icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
          isActive
            ? "bg-saffron-400/10 text-saffron-200 ring-1 ring-saffron-400/30"
            : "text-ink-secondary hover:bg-white/[0.04] hover:text-ink-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="h-4 w-4" />
          <span className="font-medium">{label}</span>
          {isActive && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-saffron-400 shadow-[0_0_10px_rgba(255,153,51,0.7)]" />
          )}
        </>
      )}
    </NavLink>
  );
}

function NavSections({ onNavigate }) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="label mb-2 px-2">{section.title}</p>
          <nav className="space-y-1">
            {section.items.map(([to, Icon, label]) => (
              <NavItem key={to} to={to} Icon={Icon} label={label} onNavigate={onNavigate} />
            ))}
          </nav>
        </div>
      ))}
    </div>
  );
}

function FooterCard({ orgName }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-saffron-400/[0.08] to-transparent p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-saffron-300" />
        <span className="text-xs font-semibold uppercase tracking-wider text-saffron-300">{orgName}</span>
      </div>
      <p className="mt-2 text-xs leading-5 text-ink-muted">
        India-native bias audits powered by counterfactual twin generation.
      </p>
    </div>
  );
}

export default function Sidebar({ mobileOpen = false, onMobileClose }) {
  const { orgName } = useAuth();
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    if (mobileOpen) onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Lock body scroll while drawer open
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="relative hidden w-72 shrink-0 flex-col justify-between border-r border-white/[0.06] bg-bg-secondary/60 p-5 backdrop-blur-2xl lg:flex">
        <div>
          <NavLink to="/" className="mb-8 flex items-center">
            <Logo size={40} />
          </NavLink>
          <NavSections />
        </div>
        <FooterCard orgName={orgName} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-bg-primary/70 backdrop-blur-md lg:hidden"
              aria-hidden
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              role="dialog"
              aria-label="Navigation"
              className="fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-[320px] flex-col justify-between border-r border-white/[0.08] bg-bg-secondary/95 p-5 backdrop-blur-2xl lg:hidden"
            >
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <NavLink to="/" onClick={onMobileClose} className="flex items-center">
                    <Logo size={40} />
                  </NavLink>
                  <button
                    type="button"
                    onClick={onMobileClose}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-ink-secondary transition hover:border-saffron-400/40 hover:text-ink-primary"
                    aria-label="Close navigation"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <NavSections onNavigate={onMobileClose} />
              </div>
              <FooterCard orgName={orgName} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
