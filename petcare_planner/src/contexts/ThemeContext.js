import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * ThemeContext for managing dark/light theme and storing preference.
 */
const ThemeContext = createContext("dark");

// PUBLIC_INTERFACE
export const useTheme = () => useContext(ThemeContext);

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Try to get previous theme preference, default to "dark"
    const stored = localStorage.getItem("theme") || "dark";
    setTheme(stored);
    // Apply theme root variable (not detailed, for future development)
    document.body.setAttribute("data-theme", stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
