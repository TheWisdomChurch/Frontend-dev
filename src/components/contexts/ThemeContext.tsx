// contexts/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorScheme, darkShades, lightShades } from '../colors/colorScheme';

interface ThemeContextType {
  colorScheme: ColorScheme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(systemPrefersDark);
    }
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;

    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Use the imported color schemes
  const colorScheme = !mounted
    ? lightShades
    : isDark
      ? darkShades
      : lightShades;

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          colorScheme: lightShades,
          isDark: false,
          toggleTheme: () => {},
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ colorScheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
