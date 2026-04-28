import { forwardRef } from "react";
import { motion } from "framer-motion";

const GlassCard = forwardRef(function GlassCard(
  { children, className = "", delay = 0, interactive = false, tone = "default", as = "div", ...props },
  ref
) {
  const tones = {
    default: "",
    saffron: "shadow-glow-saffron",
    blue: "shadow-glow-blue",
    critical: "shadow-glow-critical"
  };
  const Component = motion[as] || motion.div;
  return (
    <Component
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={interactive ? { y: -3 } : undefined}
      className={`glass ${tones[tone]} ${interactive ? "cursor-pointer transition-shadow hover:shadow-glass-lift" : ""} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

export default GlassCard;
