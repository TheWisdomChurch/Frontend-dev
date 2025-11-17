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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const applyTheme = () => {
      try {
        // Check if we're in a browser environment
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

        // Apply theme class immediately and synchronously
        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        // Fallback to system preference if localStorage fails
        console.warn('Theme detection failed, using system preference:', error);
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
      // Apply the theme class immediately
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

  // Use the imported color schemes
  const colorScheme = isDark ? darkShades : lightShades;

  // Prevent flash of unstyled content - return minimal content
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden', height: '100vh' }}>{children}</div>
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
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
