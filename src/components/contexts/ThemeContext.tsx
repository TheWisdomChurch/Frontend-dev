// contexts/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ColorScheme {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Neutral colors
  black: string;
  white: string;
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;

  // Accent colors
  yellow: string;
  yellowLight: string;
  yellowDark: string;
  orange: string;
  orangeLight: string;
  orangeDark: string;

  // Semantic colors
  text: string;
  textSecondary: string;
  textMuted: string;
  background: string;
  surface: string;
  border: string;
  divider: string;

  // State colors
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface ThemeContextType {
  colorScheme: ColorScheme;
  isDark: boolean;
  toggleTheme: () => void;
}

// Light theme - Yellow, Black, Light Grays, Orange
const lightColors: ColorScheme = {
  // Primary colors (Black as primary)
  primary: '#000000',
  primaryLight: '#333333',
  primaryDark: '#000000',

  // Neutral colors
  black: '#000000',
  white: '#FFFFFF',
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#e5e5e5',
  gray300: '#d4d4d4',
  gray400: '#a3a3a3',
  gray500: '#737373',

  // Accent colors
  yellow: '#fbbf24',
  yellowLight: '#fcd34d',
  yellowDark: '#f59e0b',
  orange: '#fb923c',
  orangeLight: '#fdba74',
  orangeDark: '#f97316',

  // Semantic colors
  text: '#000000',
  textSecondary: '#404040',
  textMuted: '#737373',
  background: '#FFFFFF',
  surface: '#fafafa',
  border: '#e5e5e5',
  divider: '#f5f5f5',

  // State colors
  success: '#16a34a',
  warning: '#d97706',
  error: '#dc2626',
  info: '#0284c7',
};

// Dark theme - Inverted with yellow/orange accents
const darkColors: ColorScheme = {
  // Primary colors (White as primary in dark mode)
  primary: '#FFFFFF',
  primaryLight: '#f5f5f5',
  primaryDark: '#e5e5e5',

  // Neutral colors
  black: '#000000',
  white: '#FFFFFF',
  gray50: '#18181b',
  gray100: '#27272a',
  gray200: '#3f3f46',
  gray300: '#52525b',
  gray400: '#71717a',
  gray500: '#a1a1aa',

  // Accent colors
  yellow: '#fbbf24',
  yellowLight: '#fcd34d',
  yellowDark: '#f59e0b',
  orange: '#fb923c',
  orangeLight: '#fdba74',
  orangeDark: '#f97316',

  // Semantic colors
  text: '#FFFFFF',
  textSecondary: '#e5e5e5',
  textMuted: '#a1a1aa',
  background: '#000000',
  surface: '#18181b',
  border: '#3f3f46',
  divider: '#27272a',

  // State colors
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#0ea5e9',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme only on client side
  // In your ThemeContext.tsx, replace the useEffect with:
  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous state updates in effects
    requestAnimationFrame(() => {
      setMounted(true);
    });

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

  // Use light theme as default during SSR to avoid hydration mismatch
  const colorScheme = !mounted
    ? lightColors
    : isDark
      ? darkColors
      : lightColors;

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          colorScheme: lightColors,
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
