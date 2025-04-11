/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        demon: {
          red: "#FF2D55",
          ember: "#FF5733",
          orange: "#FF9500",
          gold: "#FFCC00",
          teal: "#00D4B1",
          blue: "#0EA5E9",
          indigo: "#6366F1",
          purple: "#5E17EB",
          black: "#121212"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "flame-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
        },
        "sword-draw": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "50%": { transform: "translateX(5px)", opacity: "0.8" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flame-pulse": "flame-pulse 2s ease-in-out infinite",
        "sword-draw": "sword-draw 1s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        "demon-aura": "0 0 15px rgba(255, 45, 85, 0.3)",
        "flame-breathing": "0 0 10px rgba(255, 87, 51, 0.4)",
        "water-breathing": "0 0 10px rgba(14, 165, 233, 0.4)",
        "thunder-breathing": "0 0 10px rgba(94, 23, 235, 0.4)",
      },
      backgroundImage: {
        "night-sky": "linear-gradient(to bottom, #121212, #1f1f3a)",
        "shrine-glow": "radial-gradient(circle at center, rgba(255,45,85,0.15) 0%, rgba(255,45,85,0.05) 40%, rgba(0,0,0,0) 70%)",
        "misty-mountains": "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 30%, rgba(0,0,0,0) 60%)",
        "demon-gradient": "linear-gradient(to right, #FF2D55, #FF9500)",
        "flame-gradient": "linear-gradient(to right, #FF2D55, #FF5733, #FF9500)",
        "water-gradient": "linear-gradient(to right, #00D4B1, #0EA5E9)",
        "thunder-gradient": "linear-gradient(to right, #5E17EB, #6366F1)",
        "wind-gradient": "linear-gradient(to right, #10B981, #6EE7B7)",
      },
      fontSize: {
        "xxs": "0.65rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
