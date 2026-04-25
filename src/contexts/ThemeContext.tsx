import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeMode, lightTheme, darkTheme } from '../types/theme';
import { loadTheme, saveTheme } from '../utils/storage';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(lightTheme);

  useEffect(() => {
    loadTheme().then((savedMode) => {
      if (savedMode === 'dark') {
        setThemeState(darkTheme);
      }
    });
  }, []);

  const setTheme = (mode: ThemeMode) => {
    const newTheme = mode === 'dark' ? darkTheme : lightTheme;
    setThemeState(newTheme);
    saveTheme(mode);
  };

  const toggleTheme = () => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    setTheme(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
