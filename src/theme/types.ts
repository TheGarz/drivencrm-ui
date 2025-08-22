export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  background: string;
  cardBg: string;
  sidebarBg: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  sand: string;
  warmSand: string;
}

export type ThemeKey = 'light' | 'dark' | 'sunset' | 'forest' | 'ocean' | 'lavender';

export interface ThemeContextType {
  theme: ThemeKey;
  currentTheme: Theme;
  setTheme: (theme: ThemeKey) => void;
  toggleTheme: () => void;
  availableThemes: Record<ThemeKey, Theme>;
}