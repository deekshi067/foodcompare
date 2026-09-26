// src/context/ThemeContext.jsx
// ------------------------------------------------------------------
// Manages dark/light mode for the whole app. Tailwind is configured
// with darkMode: "class" (see tailwind.config.js), so all we have to
// do is add/remove the "dark" class on the <html> element — every
// "dark:" utility class in our components then activates automatically.
// ------------------------------------------------------------------

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Initialize from localStorage so the user's choice persists across visits.
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("fc_theme") === "dark";
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("fc_theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("fc_theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a <ThemeProvider>");
  }
  return context;
}
