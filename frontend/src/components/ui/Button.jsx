import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-saffron-gradient text-midnight-900 shadow-glow-saffron hover:shadow-[0_0_60px_rgba(255,153,51,0.55)] focus-visible:ring-saffron-300/60",
  secondary:
    "bg-white/[0.04] text-ink-primary border border-white/10 hover:border-saffron-300/50 hover:bg-white/[0.07] focus-visible:ring-saffron-300/40",
  ghost:
    "bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04] focus-visible:ring-saffron-300/30",
  danger:
    "bg-signal-critical/15 text-signal-critical border border-signal-critical/30 hover:bg-signal-critical/25 focus-visible:ring-signal-critical/50"
};

const sizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm"
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  as,
  ...props
}) {
  const Component = as ? motion(as) : motion.button;
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-colors disabled:cursor-not-allowed disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-offset-0 select-none";
  return (
    <Component
      whileHover={{ y: -1 }}
      whileTap={{ y: 0, scale: 0.985 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
        >
          <span className="absolute -inset-y-2 -left-1/2 h-[200%] w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Component>
  );
}
