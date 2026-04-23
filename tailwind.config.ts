import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        border: "var(--border-light)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        ui: ["var(--font-ui)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        editorial: "0 28px 72px rgba(0, 0, 0, 0.38)",
        soft: "0 16px 40px rgba(0, 0, 0, 0.26)",
      },
    },
  },
  plugins: [],
};
export default config;
