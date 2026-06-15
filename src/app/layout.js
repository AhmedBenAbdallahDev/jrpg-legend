import { Open_Sans, Dela_Gothic_One } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import ThemeProvider from "@/components/ThemeProvider";

const openSansFont = Open_Sans({
  subsets: ["latin"],
  variable: "--body-font",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const delaGothicFont = Dela_Gothic_One({
  subsets: ["latin"],
  variable: "--heading-font",
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  title: "The Next Game Platform",
  description: "Retro gaming platform.",
};

/**
 * Default theme colors — matches SettingsContext "default" theme.
 * Used as inline-script defaults so the page renders correctly
 * before React hydrates.
 */
const defaultThemeColors = {
  primary: "#071D2C",
  main: "#031322",
  accent: "#446171",
  "accent-secondary": "#0A2737",
  error: "#dc2626",
  success: "#16a34a",
};

/**
 * All theme definitions — kept in sync with SettingsContext themes.
 */
const allThemes = {
  default: defaultThemeColors,
  dev: { primary: "#1A1A1A", main: "#1A1A1A", accent: "#FFD93D", "accent-secondary": "#0A2737", error: "#FF6B6B", success: "#16a34a" },
  dracula: { primary: "#282A36", main: "#0e0d11", accent: "#FF79C6", "accent-secondary": "#6272A4", error: "#FF5555", success: "#50FA7B" },
  midnight: { primary: "#0f172a", main: "#020617", accent: "#f59e0b", "accent-secondary": "#1e293b", error: "#ef4444", success: "#10b981" },
  cyberpunk: { primary: "#2d0b5a", main: "#0d0221", accent: "#ff007f", "accent-secondary": "#3a0ca3", error: "#ff4d4d", success: "#00f5d4" },
  phantom: { primary: "#212121", main: "#1a1a1a", accent: "#d00000", "accent-secondary": "#333333", error: "#9d0208", success: "#2dc653" },
  forest: { primary: "#1b4332", main: "#081c15", accent: "#b7e4c7", "accent-secondary": "#2d6a4f", error: "#e63946", success: "#74c69d" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script restores theme from localStorage BEFORE React hydrates.
            This prevents the flash of white/unstyled background. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var saved = localStorage.getItem('theme');
    var theme = (saved && ${JSON.stringify(allThemes)}[saved]) || ${JSON.stringify(defaultThemeColors)};
    var root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--main', theme.main);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-secondary', theme['accent-secondary']);
    root.style.setProperty('--error', theme.error);
    root.style.setProperty('--success', theme.success);
  } catch(e) {}
})();
`,
          }}
        />
      </head>
      <body
        className={`${openSansFont.variable} ${delaGothicFont.variable} antialiased`}
      >
        <SettingsProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
