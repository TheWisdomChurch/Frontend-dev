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
  secondary10: string; // ← CHANGED: Removed optional modifier
  secondary20: string; // ← CHANGED: Removed optional modifier
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
  secondary: string // ← CHANGED: Removed optional modifier, made required
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
  secondary10: `${secondary}1A`, // ← CHANGED: Always defined now
  secondary20: `${secondary}33`, // ← CHANGED: Always defined now
});

export const darkShades: ColorScheme = {
  primary: '#F6D34A',
  primaryLight: '#FFE27F',
  primaryDark: '#C8A731',
  secondary: '#0F1115',
  accent: '#F6D34A',
  accentText: '#C8A731',

  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',

  text: '#F5F6F7',
  textSecondary: '#C9CED6',
  textTertiary: '#9AA3AF',
  textInverted: '#000000',
  subtleText: '#9CA3AF',
  heading: '#FFFFFF',

  background: '#050505',
  backgroundSecondary: '#0B0C10',
  surface: '#0F1115',
  surfaceVariant: '#15171C',
  card: '#101217',
  body: '#050505',
  footer: '#060606',
  pageBackground: '#050505',

  button: '#F6D34A',
  buttonText: '#0A0A0A',
  buttonHover: '#FFE27F',
  buttonActive: '#C8A731',

  border: '#1F2229',
  borderLight: '#2A2E36',
  borderDark: '#121418',

  gray: baseGrayScale,

  primaryGradient: 'linear-gradient(135deg, #F6D34A 0%, #C8A731 100%)',
  primaryGradientLight:
    'linear-gradient(135deg, rgba(246, 211, 74, 0.12) 0%, rgba(200, 167, 49, 0.12) 100%)',
  secondaryGradient: 'linear-gradient(135deg, #111318 0%, #050505 100%)',

  focusRing: '0 0 0 3px rgba(246, 211, 74, 0.45)',
  focusBorder: '#F6D34A',

  shadowSm: '0 2px 10px rgba(0,0,0,0.45)',
  shadowMd: '0 10px 30px rgba(0,0,0,0.45)',
  shadowLg: '0 24px 60px rgba(0,0,0,0.45)',

  borderRadius: baseBorderRadius,

  white: '#FFFFFF',
  black: '#000000',
  highlight: '#F6D34A',

  opacity: createOpacityColors(
    '#F6D34A',
    '#050505',
    '#FFFFFF',
    '#F59E0B',
    '#EF4444',
    '#10B981',
    '#3B82F6',
    '#0F1115'
  ),

  overlay: 'rgba(0, 0, 0, 0.82)',
  backdrop: 'rgba(0, 0, 0, 0.55)',

  tertiary: '#1B1E25',
  onTertiary: '#FFFFFF',
  onPrimary: '#000000',
  onSecondary: '#FFFFFF',
  outline: '#2A2E36',
};

export const lightShades: ColorScheme = {
  primary: '#F2C94C',
  primaryLight: '#F8E08A',
  primaryDark: '#C8A128',
  secondary: '#FFFFFF',
  accent: '#F2C94C',
  accentText: '#B8841C',

  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',

  text: '#1C1F24',
  textSecondary: '#38414B',
  textTertiary: '#6B7280',
  textInverted: '#000000',
  subtleText: '#6B7280',
  heading: '#000000',

  background: '#FAFAF7',
  backgroundSecondary: '#F4F3EE',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F0EA',
  card: '#FFFFFF',
  body: '#FAFAF7',
  footer: '#F4F3EE',
  pageBackground: '#FAFAF7',

  button: '#F2C94C',
  buttonText: '#111111',
  buttonHover: '#F8E08A',
  buttonActive: '#C8A128',

  border: '#E0E0DA',
  borderLight: '#EFEDE7',
  borderDark: '#D6D4CE',

  gray: baseGrayScale,

  primaryGradient: 'linear-gradient(135deg, #F2C94C 0%, #C8A128 100%)',
  primaryGradientLight:
    'linear-gradient(135deg, rgba(242, 201, 76, 0.12) 0%, rgba(200, 161, 40, 0.12) 100%)',
  secondaryGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F4F3EE 100%)',

  focusRing: '0 0 0 3px rgba(242, 201, 76, 0.3)',
  focusBorder: '#F2C94C',

  shadowSm: '0 2px 10px rgba(17,24,39,0.08)',
  shadowMd: '0 10px 30px rgba(17,24,39,0.12)',
  shadowLg: '0 24px 60px rgba(17,24,39,0.16)',

  borderRadius: baseBorderRadius,

  white: '#FFFFFF',
  black: '#000000',
  highlight: '#F2C94C',

  opacity: createOpacityColors(
    '#F2C94C',
    '#000000',
    '#FFFFFF',
    '#F59E0B',
    '#EF4444',
    '#10B981',
    '#3B82F6',
    '#FFFFFF'
  ),

  overlay: 'rgba(0, 0, 0, 0.7)',
  backdrop: 'rgba(0, 0, 0, 0.4)',

  tertiary: '#F1F0EA',
  onTertiary: '#000000',
  onPrimary: '#000000',
  onSecondary: '#000000',
  outline: '#D6D4CE',
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
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Handle 3-digit hex
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // Parse hex values
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Handle invalid hex
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return `rgba(0, 0, 0, ${alpha})`;
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  lighten: (color: string, percent: number): string => {
    // Simple lightening - in a real implementation you'd want to use a proper color library
    return color;
  },

  darken: (color: string, percent: number): string => {
    // Simple darkening - in a real implementation you'd want to use a proper color library
    return color;
  },
};
