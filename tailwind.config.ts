import type { Config } from "tailwindcss";

// Color tokens & radii lifted 1:1 from the original prototype (index (3).html :root vars)
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: "var(--beige)",
        "beige-dark": "var(--beige-dark)",
        cream: "var(--cream)",
        "beige-light": "var(--beige-light)",
        ink: "var(--ink)",
        gold: "var(--gold)",
        "gold-dark": "var(--gold-dark)",
        "gold-soft": "var(--gold-soft)",
        grey: "var(--grey)",
        "grey-soft": "var(--grey-soft)",
        line: "var(--line)",
        danger: "var(--danger)",
        success: "var(--success)",
      },
      borderRadius: {
        xl2: "var(--r-xl)",
        lg2: "var(--r-lg)",
        md2: "var(--r-md)",
        sm2: "var(--r-sm)",
      },
      boxShadow: {
        soft: "var(--sh-soft)",
        card: "var(--sh-card)",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      maxWidth: {
        shell: "460px",
      },
    },
  },
  plugins: [],
};
export default config;
