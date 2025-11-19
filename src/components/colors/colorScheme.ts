/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/ui/fonts/color/colorScheme.ts

// Base color interfaces
type BackgroundColor = string;
type Color = string;

interface GrayScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

interface BorderRadius {
  small: string;
  medium: string;
  large: string;
  xlarge: string;
  full: string;
}

interface OpacityColors {
  warning10: string;
  warning20: string;
  primary10: string;
  primary20: string;
  primary30: string;
  black10: string;
  black20: string;
  black50: string;
  black80: string;
  white10: string;
  white20: string;
  white50: string;
}

export interface ColorScheme {
  // Base colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
  info: string;

  // === TEXT COLORS - FIXED FOR MAXIMUM CONTRAST ===
  text: string; // Main body text (high contrast)
  textSecondary: string; // Secondary labels, captions
  textTertiary: string; // Subtle hints
  textInverted: string; // Text on primary/yellow backgrounds
  subtleText: string; // Very low-priority text

  heading: string; // H1-H6 headings (highest contrast)

  // Background colors
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceVariant: string;
  card: string;
  body: string;
  footer: string;
  pageBackground: string;

  // Interactive elements
  button: string;
  buttonText: string;
  buttonHover: string;
  buttonActive: string;

  // Borders and dividers
  border: string;
  borderLight: string;
  borderDark: string;

  // Gray scale
  gray: GrayScale;

  // Gradients
  primaryGradient: string;
  primaryGradientLight: string;
  secondaryGradient: string;

  // Focus states
  focusRing: string;
  focusBorder: string;

  // Shadows
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;

  // Border radius
  borderRadius: BorderRadius;

  // Core black/white
  white: string;
  black: string;

  // Highlight color
  highlight: string;

  // Opacity colors
  opacity: OpacityColors;

  // Material-like additions
  tertiary?: BackgroundColor;
  onTertiary?: Color;
  onPrimary?: Color;
  onSecondary?: Color;
  outline?: string;

  // Modal and overlay
  overlay: string;
  backdrop: string;
}

const baseGrayScale: GrayScale = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

const baseBorderRadius: BorderRadius = {
  small: '4px',
  medium: '8px',
  large: '12px',
  xlarge: '16px',
  full: '9999px',
};

const createOpacityColors = (
  primary: string,
  black: string,
  white: string,
  warning: string
): OpacityColors => ({
  primary10: `${primary}1A`,
  primary20: `${primary}33`,
  primary30: `${primary}4D`,
  black10: `${black}1A`,
  black20: `${black}33`,
  black50: `${black}80`,
  black80: `${black}CC`,
  white10: `${white}1A`,
  white20: `${white}33`,
  white50: `${white}80`,
  warning10: `${warning}1A`,
  warning20: `${warning}33`,
});

export const darkShades: ColorScheme = {
  // Primary palette (your signature yellow)
  primary: '#F7DE12',
  primaryLight: '#F9E755',
  primaryDark: '#D4BC0F',
  secondary: '#1F2937',
  accent: '#F7DE12',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',

  // TEXT - HIGH CONTRAST ON DARK BACKGROUND
  text: '#F3F4F6', // gray-100 → excellent readability
  textSecondary: '#D1D5DB', // gray-300
  textTertiary: '#9CA3AF', // gray-400
  textInverted: '#000000', // black on yellow
  subtleText: '#9CA3AF',

  heading: '#FFFFFF', // pure white for maximum impact

  // Backgrounds
  background: '#000000',
  backgroundSecondary: '#111827',
  surface: '#1F2937',
  surfaceVariant: '#374151',
  card: '#1F2937',
  body: '#000000',
  footer: '#000000',
  pageBackground: '#000000',

  // Buttons
  button: '#F7DE12',
  buttonText: '#000000',
  buttonHover: '#F9E755',
  buttonActive: '#D4BC0F',

  // Borders
  border: '#374151',
  borderLight: '#4B5563',
  borderDark: '#1F2937',

  gray: baseGrayScale,

  // Gradients
  primaryGradient: 'linear-gradient(135deg, #F7DE12 0%, #D4BC0F 100%)',
  primaryGradientLight:
    'linear-gradient(135deg, rgba(247, 222, 18, 0.1) 0%, rgba(212, 188, 15, 0.1) 100%)',
  secondaryGradient: 'linear-gradient(135deg, #1F2937 0%, #000000 100%)',

  focusRing: '0 0 0 3px rgba(247, 222, 18, 0.5)',
  focusBorder: '#F7DE12',

  shadowSm: '0 1px 3px rgba(0,0,0,0.5)',
  shadowMd: '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -1px rgba(0,0,0,0.3)',
  shadowLg: '0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -2px rgba(0,0,0,0.25)',

  borderRadius: baseBorderRadius,

  white: '#FFFFFF',
  black: '#000000',
  highlight: '#F7DE12',

  opacity: createOpacityColors('#F7DE12', '#000000', '#FFFFFF', '#F59E0B'),

  overlay: 'rgba(0, 0, 0, 0.8)',
  backdrop: 'rgba(0, 0, 0, 0.5)',

  // Material-like
  tertiary: '#374151',
  onTertiary: '#FFFFFF',
  onPrimary: '#000000',
  onSecondary: '#FFFFFF',
  outline: '#4B5563',
};

export const lightShades: ColorScheme = {
  // Primary palette (same yellow)
  primary: '#F7DE12',
  primaryLight: '#F9E755',
  primaryDark: '#D4BC0F',
  secondary: '#FFFFFF',
  accent: '#F7DE12',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',

  // TEXT - HIGH CONTRAST ON LIGHT BACKGROUND
  text: '#111827', // gray-900 → very dark
  textSecondary: '#374151', // gray-700
  textTertiary: '#6B7280', // gray-500
  textInverted: '#000000',
  subtleText: '#6B7280',

  heading: '#000000', // pure black for strong headings

  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceVariant: '#F3F4F6',
  card: '#FFFFFF',
  body: '#FFFFFF',
  footer: '#F8FAFC',
  pageBackground: '#FFFFFF',

  // Buttons
  button: '#F7DE12',
  buttonText: '#000000',
  buttonHover: '#F9E755',
  buttonActive: '#D4BC0F',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',

  gray: baseGrayScale,

  // Gradagem
  primaryGradient: 'linear-gradient(135deg, #F7DE12 0%, #D4BC0F 100%)',
  primaryGradientLight:
    'linear-gradient(135deg, rgba(247, 222, 18, 0.1) 0%, rgba(212, 188, 15, 0.1) 100%)',
  secondaryGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',

  focusRing: '0 0 0 3px rgba(247, 222, 18, 0.3)',
  focusBorder: '#F7DE12',

  shadowSm: '0 1px 3px rgba(0,0,0,0.1)',
  shadowMd: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  shadowLg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',

  borderRadius: baseBorderRadius,

  white: '#FFFFFF',
  black: '#000000',
  highlight: '#F7DE12',

  opacity: createOpacityColors('#F7DE12', '#000000', '#FFFFFF', '#F59E0B'),

  overlay: 'rgba(0, 0, 0, 0.8)',
  backdrop: 'rgba(0, 0, 0, 0.5)',

  // Material-like
  tertiary: '#F3F4F6',
  onTertiary: '#000000',
  onPrimary: '#000000',
  onSecondary: '#000000',
  outline: '#D1D5DB',
};

// Utility types
export type ThemeColor = keyof Omit<
  ColorScheme,
  'gray' | 'borderRadius' | 'opacity'
>;
export type GrayColor = keyof GrayScale;
export type BorderRadiusSize = keyof BorderRadius;
export type OpacityColor = keyof OpacityColors;

// Optional: color manipulation utilities (you can expand later)
export const colorUtils = {
  hexToRgba: (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  lighten: (color: string, percent: number): string => color,
  darken: (color: string, percent: number): string => color,
};
