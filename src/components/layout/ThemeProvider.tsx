"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // DARK THEME BY DEFAULT
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;

    // Saved preference wins; otherwise DARK is default
    const initial: Theme =
      saved === "light" || saved === "dark" ? saved : "dark";

    setTheme(initial);

    document.documentElement.classList.toggle(
      "dark",
      initial === "dark"
    );
  }, []);

  function toggleTheme() {
    setTheme((current) => {
      const next: Theme =
        current === "dark" ? "light" : "dark";

      localStorage.setItem("theme", next);

      document.documentElement.classList.toggle(
        "dark",
        next === "dark"
      );

      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}