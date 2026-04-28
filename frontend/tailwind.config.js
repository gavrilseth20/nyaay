export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"]
      },
      colors: {
        bg: {
          primary: "#070B17",
          secondary: "#0B1226",
          tertiary: "#0F1830",
          card: "rgba(255,255,255,0.035)"
        },
        ink: {
          primary: "#F4F1EA",
          secondary: "#C4CCDA",
          muted: "#7A8699",
          dim: "#4F5A70"
        },
        saffron: {
          50: "#FFF6EC",
          100: "#FFE7CC",
          200: "#FFCD96",
          300: "#FFB35F",
          400: "#FF9933",
          500: "#F08220",
          600: "#C45F12",
          700: "#8E430B"
        },
        midnight: {
          400: "#3956A3",
          500: "#2A4180",
          600: "#1B2C5C",
          700: "#101D3F",
          800: "#0A1430",
          900: "#070B17"
        },
        signal: {
          critical: "#FF5466",
          high: "#FF9933",
          medium: "#F2C94C",
          pass: "#3DD68C",
          info: "#5EA0FF"
        }
      },
      boxShadow: {
        glow: "0 0 60px rgba(255,153,51,0.18), 0 0 120px rgba(94,160,255,0.10)",
        "glow-saffron": "0 0 40px rgba(255,153,51,0.32), 0 0 80px rgba(255,153,51,0.18)",
        "glow-blue": "0 0 40px rgba(94,160,255,0.28), 0 0 80px rgba(94,160,255,0.14)",
        "glow-critical": "0 0 28px rgba(255,84,102,0.42)",
        glass: "0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-lift": "0 24px 60px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.10)",
        "inset-line": "inset 0 0 0 1px rgba(255,255,255,0.07)"
      },
      backgroundImage: {
        "grid-fade": "linear-gradient(180deg, rgba(7,11,23,0) 0%, rgba(7,11,23,1) 80%)",
        "saffron-gradient": "linear-gradient(135deg, #FF9933 0%, #F08220 100%)",
        "midnight-gradient": "linear-gradient(135deg, #101D3F 0%, #070B17 100%)",
        "diagonal-sheen": "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%)"
      },
      keyframes: {
        "drift-slow": {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(2%,-1%,0)" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "scan": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "rise": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "tick": {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.55)" }
        }
      },
      animation: {
        "drift-slow": "drift-slow 18s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        "shimmer": "shimmer 2.4s linear infinite",
        "scan": "scan 2.6s ease-in-out infinite",
        "rise": "rise 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "tick": "tick 1.4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
