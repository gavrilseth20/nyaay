import { Bell, Command, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const titleMap = {
  dashboard: "Dashboard",
  upload: "Upload & validate",
  configure: "Configure audit",
  results: "Audit results",
  remediation: "Remediation plan",
  reports: "Compliance reports",
  monitor: "Drift monitor",
  "live-audit": "Live AI audit",
  settings: "Settings"
};

export default function Topbar({ onMobileMenu }) {
  const location = useLocation();
  const slug = location.pathname.split("/")[1] || "dashboard";
  const title = titleMap[slug] || slug;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/[0.06] bg-bg-primary/70 px-4 py-3.5 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenu}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-ink-secondary transition hover:border-saffron-400/40 hover:text-ink-primary lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="label">Nyaay / {slug}</p>
          <h1 className="serif mt-1 text-xl font-semibold tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="hidden flex-1 items-center md:flex md:max-w-md md:px-4">
        <label className="group relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            placeholder="Search audits, models, dimensions"
            className="input pl-9"
            style={{ paddingTop: 9, paddingBottom: 9 }}
          />
          <span className="pointer-events-none absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">
            <Command className="h-3 w-3" /> K
          </span>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-2 rounded-full border border-signal-pass/30 bg-signal-pass/10 px-3 py-1.5 text-xs font-semibold text-signal-pass md:inline-flex">
          <span className="live-dot" /> Live
        </span>
        <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-ink-secondary transition hover:border-saffron-400/40 hover:text-ink-primary" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-saffron-400 shadow-[0_0_8px_rgba(255,153,51,0.8)]" />
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-saffron-gradient font-bold text-midnight-900">N</div>
      </div>
    </header>
  );
}
