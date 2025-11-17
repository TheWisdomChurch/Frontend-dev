// contexts/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorScheme, darkShades, lightShades } from '../colors/colorScheme';

interface ThemeContextType {
  colorScheme: ColorScheme;
  isDark: boolean;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Safe default values for build time
const defaultTheme: ThemeContextType = {
  colorScheme: lightShades,
  isDark: false,
  toggleTheme: () => {},
  mounted: false,
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const applyTheme = () => {
      try {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
          return;
        }

        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;

        const shouldBeDark =
          savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

        setIsDark(shouldBeDark);

        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.warn('Theme detection failed:', error);
        const systemPrefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        setIsDark(systemPrefersDark);
        if (systemPrefersDark) {
          document.documentElement.classList.add('dark');
        }
      }
    };

    applyTheme();
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;

    const newTheme = !isDark;
    setIsDark(newTheme);

    try {
      if (newTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const colorScheme = isDark ? darkShades : lightShades;

  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        <ThemeContext.Provider value={defaultTheme}>
          {children}
        </ThemeContext.Provider>
      </div>
    );
  }

  return (
    <ThemeContext.Provider
      value={{ colorScheme, isDark, toggleTheme, mounted }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  // During build, return default values instead of throwing
  if (context === undefined) {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
