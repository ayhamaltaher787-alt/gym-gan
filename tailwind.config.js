/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bbd0ff",
          300: "#8fb0ff",
          400: "#5c85ff",
          500: "#3a5eff",
          600: "#243cff",
          700: "#1b2ed6",
          800: "#1a2ca8",
          900: "#1a2a83",
        },
        accent: {
          400: "#ffb84c",
          500: "#ff9a1a",
          600: "#e57a00",
        },
        ink: {
          50: "#f5f7fb",
          100: "#e9edf5",
          200: "#c9d1e0",
          300: "#9aa5bc",
          400: "#6b7691",
          500: "#4a5470",
          600: "#333b52",
          700: "#232a3d",
          800: "#151a29",
          900: "#0b0f1c",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "'Space Grotesk'",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(58, 94, 255, 0.55)",
        card: "0 10px 40px -10px rgba(11, 15, 28, 0.35)",
      },
      backgroundImage: {
        "grid-slate":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
    },
  },
  plugins: [],
};
