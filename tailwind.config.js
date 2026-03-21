/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",          // toggled via .dark on <html>
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,jsx,js}"
  ],
  theme: {
    extend: {
      colors: {
        /* ── App theme tokens ───────────────────────────────────── */
        background: "rgb(var(--background) / <alpha-value>)",
        surface:    "rgb(var(--surface)    / <alpha-value>)",
        elevated:   "rgb(var(--elevated)   / <alpha-value>)",
        overlay:    "rgb(var(--overlay)    / <alpha-value>)",

        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted:      "rgb(var(--muted)      / <alpha-value>)",
        subtle:     "rgb(var(--subtle)     / <alpha-value>)",

        border:     "rgb(var(--border)     / <alpha-value>)",

        primary: {
          DEFAULT:    "rgb(var(--primary)            / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },

        /* ── Shadcn tokens (Select, Popover, etc.) ──────────────── */
        popover: {
          DEFAULT:    "rgb(var(--popover)            / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT:    "rgb(var(--accent)            / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: "rgb(var(--destructive) / <alpha-value>)",

        /* ── Sidebar ─────────────────────────────────────────────── */
        sidebar: {
          DEFAULT:            "rgb(var(--sidebar)                    / <alpha-value>)",
          foreground:         "rgb(var(--sidebar-foreground)         / <alpha-value>)",
          primary:            "rgb(var(--sidebar-primary)            / <alpha-value>)",
          "primary-foreground":"rgb(var(--sidebar-primary-foreground)/ <alpha-value>)",
          accent:             "rgb(var(--sidebar-accent)             / <alpha-value>)",
          "accent-foreground":"rgb(var(--sidebar-accent-foreground)  / <alpha-value>)",
          border:             "rgb(var(--sidebar-border)             / <alpha-value>)",
          ring:               "rgb(var(--sidebar-ring)               / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
}
