import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9ecff",
          200: "#b3d8ff",
          300: "#86c0ff",
          400: "#58a7ff",
          500: "#2a8eff",
          600: "#0d72e6",
          700: "#0758b4",
          800: "#073f80",
          900: "#072a55"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
