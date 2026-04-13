/**
 * Theme and Color Utilities
 * Centralized color scheme and theming configurations
 */

export type BackgroundColor = string;
export type Color = string;

export interface GrayScale {
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

export interface BorderRadius {
  small: string;
  medium: string;
  large: string;
  xlarge: string;
  full: string;
}

export interface OpacityColors {
  [key: string]: string;
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
  secondary10: string;
  secondary20: string;
}

export interface ColorScheme {
  primary: Color;
  secondary: Color;
  tertiary: Color;
  neutral: Color;
  error: Color;
  warning: Color;
  success: Color;
  info: Color;
}

/**
 * Default color scheme
 */
export const defaultColorScheme: ColorScheme = {
  primary: '#1F2937',
  secondary: '#6B7280',
  tertiary: '#9CA3AF',
  neutral: '#F3F4F6',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
};

/**
 * Get theme color from scheme
 */
export const getThemeColor = (
  colorScheme: ColorScheme,
  colorName: keyof ColorScheme
): string => {
  return colorScheme[colorName] || colorScheme.neutral;
};
