// contexts/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorScheme, darkShades, lightShades } from '../colors/colorScheme';

interface ThemeContextType {
  theme: string;
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

  // Apply theme to DOM immediately (synchronous)
  const applyThemeToDOM = (dark: boolean): void => {
    if (typeof document === 'undefined') return;

    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  };

  // Apply CSS variables immediately
  const applyCSSVariables = (scheme: ColorScheme): void => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Apply all color scheme variables
    Object.entries(scheme).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, value);
      }
    });
  };

  useEffect(() => {
    const initializeTheme = (): void => {
      try {
        let theme = 'light';

        if (typeof window !== 'undefined') {
          // Check localStorage first
          const saved = localStorage.getItem('theme');

          // If no saved theme, check system preference
          if (!saved) {
            const systemDark = window.matchMedia(
              '(prefers-color-scheme: dark)'
            ).matches;
            theme = systemDark ? 'dark' : 'light';
          } else {
            theme = saved;
          }
        }

        const darkMode = theme === 'dark';

        // Apply theme immediately before React state update
        applyThemeToDOM(darkMode);
        applyCSSVariables(darkMode ? darkShades : lightShades);

        setIsDark(darkMode);
      } catch (error) {
        console.warn('Theme initialization failed:', error);
        // Apply light theme as fallback
        applyThemeToDOM(false);
        applyCSSVariables(lightShades);
      } finally {
        setMounted(true);
      }
    };

    initializeTheme();
  }, []);

  const toggleTheme = (): void => {
    const newTheme = !isDark;

    // Apply immediately
    applyThemeToDOM(newTheme);
    applyCSSVariables(newTheme ? darkShades : lightShades);

    setIsDark(newTheme);

    try {
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const colorScheme = isDark ? darkShades : lightShades;

  // Apply CSS variables whenever color scheme changes
  useEffect(() => {
    if (mounted) {
      applyCSSVariables(colorScheme);
    }
  }, [colorScheme, mounted]);

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

  if (context === undefined) {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
