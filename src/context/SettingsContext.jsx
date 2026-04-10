"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const themes = {
  default: {
    name: "Default Theme",
    colors: {
      primary: "#071D2C",
      main: "#031322",
      accent: "#446171",
      "accent-secondary": "#0A2737",
      error: "#dc2626",
      success: "#16a34a",
    },
  },
  dev: {
    name: "Dev Theme",
    colors: {
      primary: "#1A1A1A",
      main: "#1A1A1A",
      accent: "#FFD93D",
      "accent-secondary": "#0A2737",
      error: "#FF6B6B",
      success: "#16a34a",
    },
  },
  dracula: {
    name: "Dracula Theme",
    colors: {
      primary: "#282A36",
      main: "#0e0d11",
      accent: "#FF79C6",
      "accent-secondary": "##6272A4",
      error: "#FF5555",
      success: "#50FA7B",
    },
  },
  midnight: {
    name: "Midnight Legend",
    colors: {
      primary: "#0f172a",
      main: "#020617",
      accent: "#f59e0b",
      "accent-secondary": "#1e293b",
      error: "#ef4444",
      success: "#10b981",
    },
  },
  cyberpunk: {
    name: "Neo Tokyo",
    colors: {
      primary: "#2d0b5a",
      main: "#0d0221",
      accent: "#ff007f",
      "accent-secondary": "#3a0ca3",
      error: "#ff4d4d",
      success: "#00f5d4",
    },
  },

  phantom: {
    name: "Phantom Thief",
    colors: {
      primary: "#212121",
      main: "#1a1a1a",
      accent: "#d00000",
      "accent-secondary": "#333333",
      error: "#9d0208",
      success: "#2dc653",
    },
  },
  forest: {
    name: "Mana Tree",
    colors: {
      primary: "#1b4332",
      main: "#081c15",
      accent: "#b7e4c7",
      "accent-secondary": "#2d6a4f",
      error: "#e63946",
      success: "#74c69d",
    },
  },
};

export function SettingsProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState("default");
  const [badgeSettings, setBadgeSettings] = useState({
    showRegionBadges: true,
    showNetworkBadges: true,
    showLocalBadges: true,
    showImageSourceBadges: true,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = localStorage.getItem("theme");
    const savedBadgeSettings = localStorage.getItem("badgeSettings");

    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedBadgeSettings) setBadgeSettings(JSON.parse(savedBadgeSettings));
  }, []);

  const updateTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem("theme", themeName);
  };

  const updateBadgeSetting = (setting, value) => {
    const newSettings = { ...badgeSettings, [setting]: value };
    setBadgeSettings(newSettings);
    localStorage.setItem("badgeSettings", JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider
      value={{
        currentTheme,
        themes,
        updateTheme,
        badgeSettings,
        updateBadgeSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
