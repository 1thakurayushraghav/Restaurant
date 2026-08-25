/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8ED",
        ivory: "#FFFDF7",
        maroon: {
          DEFAULT: "#7A1F2B",
          dark: "#5C1620",
          light: "#9B2C3A",
        },
        saffron: {
          DEFAULT: "#E8963E",
          light: "#F2B36B",
        },
        gold: "#C9A24B",
        brown: "#3B2A20",
        veg: "#2E7D32",
        nonveg: "#B3261E",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(59, 42, 32, 0.08)",
        cardHover: "0 8px 24px rgba(59, 42, 32, 0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
