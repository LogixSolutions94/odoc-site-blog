import type { Config } from "tailwindcss";

export default {
  darkMode: ["attribute", "data-theme"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "brand-panel": {
          DEFAULT: "hsl(var(--brand-panel))",
          foreground: "hsl(var(--brand-panel-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        text: {
          DEFAULT: "hsl(var(--color-text))",
          muted: "hsl(var(--color-text-muted))",
          faint: "hsl(var(--color-text-faint))",
        },
        surface: {
          DEFAULT: "hsl(var(--color-surface))",
          2: "hsl(var(--color-surface-2))",
        },
        divider: "hsl(var(--color-divider))",
      },
      backgroundImage: {
        'gradient-cta': 'var(--gradient-cta)',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-cool': 'var(--gradient-cool)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04), 0 0 0 1px hsl(var(--border))',
        'card-hover': '0 10px 25px -5px rgba(0,0,0,0.08), 0 4px 10px -5px rgba(0,0,0,0.04), 0 0 0 1px hsl(var(--border))',
        'elevated': '0 20px 40px -12px rgba(0,0,0,0.1), 0 0 0 1px hsl(var(--border))',
        'glow': '0 0 30px -5px hsl(var(--primary-glow) / 0.25)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "spin-slow-reverse": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(-360deg)" },
        },
        "aurora": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(4%, -6%, 0) scale(1.12)" },
          "66%": { transform: "translate3d(-4%, 4%, 0) scale(0.94)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "scan-y": {
          "0%": { top: "-8%", opacity: "0" },
          "12%": { opacity: "1" },
          "88%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "70%, 100%": { transform: "scale(1.4)", opacity: "0" },
        },
        "send-fly": {
          "0%": { transform: "translate(0,0) scale(1)", opacity: "0" },
          "15%": { opacity: "1" },
          "70%": { transform: "translate(28px,-22px) scale(0.85)", opacity: "1" },
          "100%": { transform: "translate(60px,-46px) scale(0.55)", opacity: "0" },
        },
        "fill-bar": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "beam-x": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "12%, 88%": { opacity: "1" },
          "100%": { transform: "translateX(200%)", opacity: "0" },
        },
        "beam-y": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "12%, 88%": { opacity: "1" },
          "100%": { transform: "translateY(200%)", opacity: "0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin-slow 28s linear infinite",
        "spin-slow-reverse": "spin-slow-reverse 20s linear infinite",
        "aurora": "aurora 22s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "scan-y": "scan-y 1.6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
        "send-fly": "send-fly 2.4s ease-in-out infinite",
        "fill-bar": "fill-bar 1.1s ease-out forwards",
        "beam-x": "beam-x 5s linear infinite",
        "beam-y": "beam-y 6.5s linear infinite",
        "marquee": "marquee 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
