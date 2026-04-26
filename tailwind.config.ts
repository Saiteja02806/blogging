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
        display: [
          "var(--font-display)",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        body: [
          "var(--font-body)",
          "ui-serif",
          "Georgia",
          "Cambria",
          "serif",
        ],
        ui: [
          "var(--font-ui)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "Cascadia Code",
          "Source Code Pro",
          "monospace",
        ],
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
