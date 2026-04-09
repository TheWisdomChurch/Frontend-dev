// contexts/ThemeContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { ColorScheme, darkShades, lightShades } from '../colors/colorScheme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  colorScheme: ColorScheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Safe default values for build time
const defaultTheme: ThemeContextType = {
  theme: 'system',
  resolvedTheme: 'light',
  colorScheme: lightShades,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
  mounted: false,
};

const resolveTheme = (
  mode: ThemeMode,
  systemPrefersDark: boolean
): 'light' | 'dark' => {
  if (mode === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return mode;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const getInitialTheme = (): ThemeMode => {
    if (typeof window === 'undefined') return 'system';
    const saved = window.localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' || saved === 'system'
      ? saved
      : 'system';
  };

  const [theme, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isDark, setIsDark] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasAnimated = useRef(false);

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

    Object.entries(scheme).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, value);
      }
    });
  };

  // Ease the transition between modes
  const animateThemeChange = () => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 450);
  };

  // Listen to system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    const resolved = resolveTheme(theme, media.matches);
    const scheme = resolved === 'dark' ? darkShades : lightShades;

    setResolvedTheme(resolved);
    setIsDark(resolved === 'dark');
    setSystemPrefersDark(media.matches);
    applyThemeToDOM(resolved === 'dark');
    applyCSSVariables(scheme);
    setMounted(true);
    media.addEventListener('change', handleSystemChange);

    return () => media.removeEventListener('change', handleSystemChange);
  }, [theme]);

  // Re-apply theme when user switches or system preference changes
  useEffect(() => {
    if (!mounted) return;

    const resolved = resolveTheme(theme, systemPrefersDark);
    const scheme = resolved === 'dark' ? darkShades : lightShades;

    setResolvedTheme(resolved);
    setIsDark(resolved === 'dark');
    if (hasAnimated.current) {
      animateThemeChange();
    } else {
      hasAnimated.current = true;
    }
    applyThemeToDOM(resolved === 'dark');
    applyCSSVariables(scheme);

    try {
      window.localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [theme, systemPrefersDark, mounted]);

  const toggleTheme = (): void => {
    setThemeMode(prev =>
      prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light'
    );
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const colorScheme = useMemo(
    () => (resolvedTheme === 'dark' ? darkShades : lightShades),
    [resolvedTheme]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        resolvedTheme,
        colorScheme,
        isDark,
        toggleTheme,
        setTheme,
        mounted,
      }}
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
