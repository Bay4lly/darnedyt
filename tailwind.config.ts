import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#07070a",
        foreground: "#f8fafc",
        card: {
          DEFAULT: "rgba(15, 15, 23, 0.75)",
          border: "rgba(124, 58, 237, 0.2)",
        },
        brand: {
          purple: "#7c3aed",
          pink: "#ec4899",
          cyan: "#06b6d4",
          blue: "#3b82f6",
          dark: "#0a0a10",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(124, 58, 237, 0.4)",
        "glow-pink": "0 0 25px -5px rgba(236, 72, 153, 0.4)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.4)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "brand-gradient": "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #06b6d4 100%)",
        "hero-pattern": "radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.25) 0%, rgba(7, 7, 10, 1) 70%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
