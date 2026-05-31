/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#1d4ed8",
          700: "#12315f",
          800: "#0f2a4f",
          900: "#0a1f3f",
        },
        signal: {
          green: "#0f766e",
          amber: "#b45309",
          rose: "#be123c",
          cyan: "#0e7490",
        },
      },
      boxShadow: {
        card: "0 10px 30px rgba(15, 42, 79, 0.07)",
        soft: "0 18px 44px rgba(15, 42, 79, 0.10)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
