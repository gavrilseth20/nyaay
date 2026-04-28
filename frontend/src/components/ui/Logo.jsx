import { motion } from "framer-motion";

export default function Logo({ size = 40, withWord = true, accent = true }) {
  const s = size;
  return (
    <span className="inline-flex items-center gap-3">
      <span
        className="relative grid place-items-center rounded-xl"
        style={{ width: s, height: s, background: "linear-gradient(135deg,#101D3F 0%,#070B17 100%)", border: "1px solid rgba(255,153,51,0.35)" }}
      >
        <svg width={s * 0.55} height={s * 0.55} viewBox="0 0 24 24" fill="none" aria-hidden>
          <defs>
            <linearGradient id="nyaay-logo-grad" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor="#FFCD96" />
              <stop offset="100%" stopColor="#FF9933" />
            </linearGradient>
          </defs>
          {/* Scales of justice — abstracted */}
          <path
            d="M12 3v18M5 8h14M7 8c0 3-1 5-3 5 1.5 1.8 4.5 1.8 6 0-2 0-3-2-3-5zm10 0c0 3-1 5-3 5 1.5 1.8 4.5 1.8 6 0-2 0-3-2-3-5z"
            stroke="url(#nyaay-logo-grad)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="3" r="1.4" fill="#FF9933" />
        </svg>
        {accent && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-xl"
            style={{ boxShadow: "0 0 24px rgba(255,153,51,0.45)" }}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </span>
      {withWord && (
        <span className="flex flex-col leading-none">
          <span className="serif text-xl font-semibold tracking-tight text-ink-primary">Nyaay</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-saffron-300">Bias Auditor</span>
        </span>
      )}
    </span>
  );
}
