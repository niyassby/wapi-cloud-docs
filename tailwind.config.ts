import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08100D",
          900: "#0B1512",
          850: "#0E1B17",
          800: "#122019",
          700: "#1A2E26",
          600: "#243D33",
          500: "#33564A",
        },
        paper: {
          50: "#F6F8F5",
          100: "#EAF0EA",
          200: "#C9D6CC",
          300: "#9FB3A4",
        },
        signal: {
          DEFAULT: "#33E17F",
          soft: "#8CF0B6",
          dim: "#1C8F53",
          deep: "#0E3B2C",
        },
        amber: {
          signal: "#F4B740",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(51,225,127,0.14), transparent 45%), radial-gradient(circle at 85% 0%, rgba(51,225,127,0.08), transparent 40%)",
        "noise-line":
          "linear-gradient(180deg, rgba(240,247,243,0.05) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(51,225,127,0.25), 0 0 40px -10px rgba(51,225,127,0.35)",
      },
      keyframes: {
        tick: {
          "0%": { opacity: "0", transform: "translateY(2px) scale(0.9)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.15" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        tick: "tick 0.4s ease forwards",
        pulseDot: "pulseDot 1.8s ease-in-out infinite",
        blink: "blink 1.1s steps(1) infinite",
        rise: "rise 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
