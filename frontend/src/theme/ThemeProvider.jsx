/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { themeStore } from "./theme.store";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => themeStore.getTheme());

  useEffect(() => {
    themeStore.initTheme();
  }, []);

  const setTheme = (newTheme) => {
    const applied = themeStore.setTheme(newTheme);
    setThemeState(applied);
  };

  const toggleTheme = () => {
    const newTheme = themeStore.toggleTheme();
    setThemeState(newTheme);
  };

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
