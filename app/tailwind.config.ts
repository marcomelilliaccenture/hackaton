import type { Config } from "tailwindcss";

// Token di colore: docs/ux-spec.md §2. Ogni token ha un solo ruolo dichiarato.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A1A1A",
        "ink-soft": "#4A4A4A",
        paper: "#FFFFFF",
        "paper-warm": "#F5F2EC",
        rule: "#D8D2C7",
        accent: "#0F5D5A",
        "accent-weak": "#E3EFEE",
        alert: "#B3261E",
        "alert-weak": "#FCEFEE",
        warn: "#7A4B00",
        "warn-weak": "#FFF4E0",
        ok: "#1E6B3A",
        focus: "#0B4F8A",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      fontSize: {
        base: ["1.0625rem", { lineHeight: "1.6" }], // 17px, mai sotto 16px
      },
      borderRadius: {
        DEFAULT: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
