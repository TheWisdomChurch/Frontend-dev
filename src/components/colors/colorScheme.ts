/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/ui/fonts/color/colorScheme.ts

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
  [x: string]: string;
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
  error10: string;
  error20: string;
  success10: string;
  success20: string;
  info10: string;
  info20: string;
  secondary10?: string; // ← ADDED: Secondary opacity color
  secondary20?: string; // ← ADDED: Secondary opacity color
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

  // Text colors
  accentText: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverted: string;
  subtleText: string;
  heading: string;

  // Backgrounds
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceVariant: string;
  card: string;
  body: string;
  footer: string;
  pageBackground: string;

  // Interactive
  button: string;
  buttonText: string;
  buttonHover: string;
  buttonActive: string;

  // Borders
  border: string;
  borderLight: string;
  borderDark: string;

  gray: GrayScale;

  // Gradients
  primaryGradient: string;
  primaryGradientLight: string;
  secondaryGradient: string;

  // Focus & Shadows
  focusRing: string;
  focusBorder: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;

  borderRadius: BorderRadius;

  white: string;
  black: string;
  highlight: string;

  opacity: OpacityColors;

  // Material-like
  tertiary?: BackgroundColor;
  onTertiary?: Color;
  onPrimary?: Color;
  onSecondary?: Color;
  outline?: string;

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
  warning: string,
  error: string,
  success: string,
  info: string,
  secondary?: string // ← ADDED: Secondary color parameter
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
  error10: `${error}1A`,
  error20: `${error}33`,
  success10: `${success}1A`,
  success20: `${success}33`,
  info10: `${info}1A`,
  info20: `${info}33`,
  secondary10: secondary ? `${secondary}1A` : undefined, // ← ADDED: Secondary opacity
  secondary20: secondary ? `${secondary}33` : undefined, // ← ADDED: Secondary opacity
});

export const darkShades: ColorScheme = {
  primary: '#F7DE12',
  primaryLight: '#F9E755',
  primaryDark: '#D4BC0F',
  secondary: '#1F2937',
  accent: '#F7DE12',
  accentText: '#D4BC0F',

  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',

  text: '#F3F4F6',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textInverted: '#000000',
  subtleText: '#9CA3AF',
  heading: '#FFFFFF',

  background: '#000000',
  backgroundSecondary: '#111827',
  surface: '#1F2937',
  surfaceVariant: '#374151',
  card: '#1F2937',
  body: '#000000',
  footer: '#000000',
  pageBackground: '#000000',

  button: '#F7DE12',
  buttonText: '#000000',
  buttonHover: '#F9E755',
  buttonActive: '#D4BC0F',

  border: '#374151',
  borderLight: '#4B5563',
  borderDark: '#1F2937',

  gray: baseGrayScale,

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

  opacity: createOpacityColors(
    '#F7DE12',
    '#000000',
    '#FFFFFF',
    '#F59E0B',
    '#EF4444',
    '#10B981',
    '#3B82F6',
    '#1F2937' // ← ADDED: Secondary color for dark mode
  ),

  overlay: 'rgba(0, 0, 0, 0.8)',
  backdrop: 'rgba(0, 0, 0, 0.5)',

  tertiary: '#374151',
  onTertiary: '#FFFFFF',
  onPrimary: '#000000',
  onSecondary: '#FFFFFF',
  outline: '#4B5563',
};

export const lightShades: ColorScheme = {
  primary: '#F7DE12',
  primaryLight: '#F9E755',
  primaryDark: '#D4BC0F',
  secondary: '#FFFFFF',
  accent: '#F7DE12',
  accentText: '#A67C00',

  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',

  text: '#111827',
  textSecondary: '#374151',
  textTertiary: '#6B7280',
  textInverted: '#000000',
  subtleText: '#6B7280',
  heading: '#000000',

  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceVariant: '#F3F4F6',
  card: '#FFFFFF',
  body: '#FFFFFF',
  footer: '#F8FAFC',
  pageBackground: '#FFFFFF',

  button: '#F7DE12',
  buttonText: '#000000',
  buttonHover: '#F9E755',
  buttonActive: '#D4BC0F',

  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',

  gray: baseGrayScale,

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

  opacity: createOpacityColors(
    '#F7DE12',
    '#000000',
    '#FFFFFF',
    '#F59E0B',
    '#EF4444',
    '#10B981',
    '#3B82F6',
    '#FFFFFF' // ← ADDED: Secondary color for light mode
  ),

  overlay: 'rgba(0, 0, 0, 0.8)',
  backdrop: 'rgba(0, 0, 0, 0.5)',

  tertiary: '#F3F4F6',
  onTertiary: '#000000',
  onPrimary: '#000000',
  onSecondary: '#000000',
  outline: '#D1D5DB',
};

// Utility types & functions
export type ThemeColor = keyof Omit<
  ColorScheme,
  'gray' | 'borderRadius' | 'opacity'
>;
export type GrayColor = keyof GrayScale;
export type BorderRadiusSize = keyof BorderRadius;
export type OpacityColor = keyof OpacityColors;

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
