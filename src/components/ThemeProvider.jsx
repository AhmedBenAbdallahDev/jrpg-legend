"use client";

import { useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import { themes } from "@/context/SettingsContext";

/**
 * Writes the active theme's colors as CSS custom properties on <html>.
 * This is the bridge between React state and the Tailwind @theme chain:
 *   React state → CSS vars on <html> → @theme var() references → Tailwind utilities
 */
function applyThemeVars(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.colors.primary);
  root.style.setProperty("--main", theme.colors.main);
  root.style.setProperty("--accent", theme.colors.accent);
  root.style.setProperty("--accent-secondary", theme.colors["accent-secondary"]);
  root.style.setProperty("--error", theme.colors.error);
  root.style.setProperty("--success", theme.colors.success);
}

export default function ThemeProvider({ children }) {
  const { currentTheme } = useSettings();
  const theme = themes[currentTheme] || themes.default;

  // Apply theme vars on <html> whenever the theme changes.
  useEffect(() => {
    applyThemeVars(theme);
  }, [theme]);

  // No wrapper div needed — <html> and <body> already get bg-main
  // from globals.css @layer base, so the theme colors apply everywhere.
  return children;
}
