'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
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

const readCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}=([^;]*)`
    )
  );

  return match ? decodeURIComponent(match[1]) : null;
};

const writeCookie = (name: string, value: string, days = 365): void => {
  if (typeof document === 'undefined') return;

  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeMode] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isDark, setIsDark] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasAnimated = useRef(false);

  const applyThemeToDOM = useCallback((dark: boolean): void => {
    if (typeof document === 'undefined') return;

    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, []);

  const applyCSSVariables = useCallback((scheme: ColorScheme): void => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    Object.entries(scheme).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, value);
      }
    });

    const hexToHsl = (hex: string): string | null => {
      let raw = hex.trim().replace(/^#/, '');

      if (raw.length === 3) {
        raw = raw
          .split('')
          .map(ch => ch + ch)
          .join('');
      }

      if (raw.length !== 6) return null;

      const r = parseInt(raw.slice(0, 2), 16) / 255;
      const g = parseInt(raw.slice(2, 4), 16) / 255;
      const b = parseInt(raw.slice(4, 6), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          default:
            h = (r - g) / d + 4;
        }

        h /= 6;
      }

      const hDeg = Math.round(h * 360);
      const sPct = Math.round(s * 100);
      const lPct = Math.round(l * 100);
      return `${hDeg} ${sPct}% ${lPct}%`;
    };

    const setHslVar = (name: string, value?: string) => {
      if (!value) return;
      const hsl = hexToHsl(value);
      if (hsl) {
        root.style.setProperty(`--${name}`, hsl);
      }
    };

    setHslVar('background', scheme.background);
    setHslVar('foreground', scheme.text);
    setHslVar('card', scheme.card ?? scheme.surface);
    setHslVar('card-foreground', scheme.text);
    setHslVar('popover', scheme.surface);
    setHslVar('popover-foreground', scheme.text);
    setHslVar('primary', scheme.primary);
    setHslVar('primary-foreground', scheme.textInverted);
    setHslVar('secondary', scheme.secondary);
    setHslVar('secondary-foreground', scheme.text);
    setHslVar('muted', scheme.surfaceVariant ?? scheme.backgroundSecondary);
    setHslVar('muted-foreground', scheme.textTertiary);
    setHslVar('accent', scheme.accent);
    setHslVar('accent-foreground', scheme.textInverted);
    setHslVar('destructive', scheme.error);
    setHslVar('destructive-foreground', scheme.textInverted);
    setHslVar('border', scheme.border);
    setHslVar('input', scheme.border);
    setHslVar('ring', scheme.primary);

    setHslVar('sidebar-background', scheme.background);
    setHslVar('sidebar-foreground', scheme.text);
    setHslVar('sidebar-primary', scheme.primary);
    setHslVar('sidebar-primary-foreground', scheme.textInverted);
    setHslVar('sidebar-accent', scheme.accent);
    setHslVar('sidebar-accent-foreground', scheme.textInverted);
    setHslVar('sidebar-border', scheme.border);
    setHslVar('sidebar-ring', scheme.primary);

    setHslVar('chart-1', scheme.primary);
    setHslVar('chart-2', scheme.info);
    setHslVar('chart-3', scheme.success);
    setHslVar('chart-4', scheme.warning);
    setHslVar('chart-5', scheme.error);
  }, []);

  const animateThemeChange = useCallback(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 450);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = readCookie('wc_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      setThemeMode(saved);
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const syncSystemPreference = (matches: boolean) => {
      setSystemPrefersDark(matches);
    };

    syncSystemPreference(media.matches);

    const handleSystemChange = (event: MediaQueryListEvent) => {
      syncSystemPreference(event.matches);
    };

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleSystemChange);
      return () => media.removeEventListener('change', handleSystemChange);
    }

    media.addListener(handleSystemChange);
    return () => media.removeListener(handleSystemChange);
  }, []);

  useEffect(() => {
    const resolved = resolveTheme(theme, systemPrefersDark);
    const scheme = resolved === 'dark' ? darkShades : lightShades;

    setResolvedTheme(resolved);
    setIsDark(resolved === 'dark');

    if (mounted) {
      if (hasAnimated.current) {
        animateThemeChange();
      } else {
        hasAnimated.current = true;
      }
    }

    applyThemeToDOM(resolved === 'dark');
    applyCSSVariables(scheme);

    try {
      writeCookie('wc_theme', theme, 365);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }

    if (!mounted) {
      setMounted(true);
    }
  }, [
    theme,
    systemPrefersDark,
    mounted,
    animateThemeChange,
    applyThemeToDOM,
    applyCSSVariables,
  ]);

  const toggleTheme = useCallback((): void => {
    setThemeMode(prev =>
      prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light'
    );
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
  }, []);

  const colorScheme = useMemo(
    () => (resolvedTheme === 'dark' ? darkShades : lightShades),
    [resolvedTheme]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
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
