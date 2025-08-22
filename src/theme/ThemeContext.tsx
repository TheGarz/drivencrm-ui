import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ThemeKey, ThemeContextType } from './types';
import { themes, getTheme } from './themes';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeKey;
}

export const ThemeProvider = ({ children, defaultTheme = 'light' }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeKey>(() => {
    // Try to load theme from localStorage
    const savedTheme = localStorage.getItem('app-theme') as ThemeKey;
    return savedTheme && savedTheme in themes ? savedTheme : defaultTheme;
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const currentTheme = getTheme(theme);

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    currentTheme,
    setTheme,
    toggleTheme,
    availableThemes: themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};