/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefdf8",
          100: "#d4f7ea",
          500: "#10b981",
          700: "#047857"
        }
      }
    }
  },
  plugins: []
};
