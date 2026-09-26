// tailwind.config.js
// ------------------------------------------------------------------
// "darkMode: 'class'" means dark mode is toggled by adding/removing
// a "dark" class on the <html> element (done in ThemeContext.jsx),
// rather than following the OS-level setting automatically.
// ------------------------------------------------------------------

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Platform brand colors — used only for Swiggy/Zomato price
        // comparison UI (badges, buttons, borders). Keep these exact;
        // they should visually match the real platforms.
        swiggy: "#fc8019",
        zomato: "#e23744",

        // App's own brand color — an appetite-friendly green, used
        // for links, primary buttons, "cheaper" badges, focus states.
        brand: {
          light: "#22c55e",
          DEFAULT: "#178A4C",
          dark: "#0F6B3A",
        },

        // Neutral surface tokens, replacing plain gray-50/gray-900
        // so light/dark mode both feel warmer than default Tailwind gray.
        surface: {
          light: "#FFFDF9",
          card: "#FFFFFF",
          dark: "#0F0D0B",
          "dark-card": "#1C1815",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,17,15,0.06), 0 1px 1px rgba(20,17,15,0.04)",
        "card-hover": "0 12px 24px -8px rgba(20,17,15,0.18)",
      },
    },
  },
  plugins: [],
};