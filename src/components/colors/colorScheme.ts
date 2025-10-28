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
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverted: string;
  subtleText: string;

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

  // Shadows
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;

  // Border radius
  borderRadius: BorderRadius;

  // Additional colors
  heading: string;
  white: string;
  black: string;

  // Highlight color
  highlight: string;

  // Material-like color scheme additions
  tertiary?: BackgroundColor;
  onTertiary?: Color;
  onPrimary?: Color;
  onSecondary?: Color;
  outline?: string;
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

export const darkShades: ColorScheme = {
  // Primary colors based on #F7DE12 (your yellow)
  primary: '#F7DE12', // Your yellow
  primaryLight: '#F9E755', // Lighter yellow
  primaryDark: '#D4BC0F', // Darker yellow
  secondary: '#1F2937', // Dark gray
  accent: '#F7DE12', // Using yellow as accent too
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#E5E7EB',
  textTertiary: '#9CA3AF',
  textInverted: '#000000', // Black for text on yellow
  subtleText: '#9CA3AF',

  // Background colors
  background: '#000000', // Black background
  backgroundSecondary: '#111827', // Very dark gray
  surface: '#1F2937', // Dark gray
  surfaceVariant: '#374151', // Medium dark gray
  card: '#1F2937',
  body: '#000000', // Black
  footer: '#000000', // Black
  pageBackground: '#000000', // Black

  // Buttons - using yellow
  button: '#F7DE12',
  buttonText: '#000000', // Black text on yellow buttons
  buttonHover: '#F9E755', // Lighter yellow on hover
  buttonActive: '#D4BC0F', // Darker yellow when active

  // Borders
  border: '#374151',
  borderLight: '#4B5563',
  borderDark: '#1F2937',

  gray: baseGrayScale,

  // Gradients using yellow
  primaryGradient: 'linear-gradient(135deg, #F7DE12 0%, #D4BC0F 100%)',
  primaryGradientLight:
    'linear-gradient(135deg, rgba(247, 222, 18, 0.1) 0%, rgba(212, 188, 15, 0.1) 100%)',
  secondaryGradient: 'linear-gradient(135deg, #1F2937 0%, #000000 100%)',

  focusRing: '0 0 0 3px rgba(247, 222, 18, 0.5)',

  shadowSm: '0 1px 3px rgba(0,0,0,0.5)',
  shadowMd: '0 4px 6px -1px rgba(0,0,0,0.5),0 2px 4px -1px rgba(0,0,0,0.3)',
  shadowLg: '0 10px 15px -3px rgba(0,0,0,0.5),0 4px 6px -2px rgba(0,0,0,0.25)',

  borderRadius: baseBorderRadius,

  heading: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  highlight: '#F7DE12', // Using yellow as highlight

  tertiary: '#374151',
  onTertiary: '#FFFFFF',
  onPrimary: '#000000', // Black text on yellow
  onSecondary: '#FFFFFF',
  outline: '#4B5563',
};

export const lightShades: ColorScheme = {
  // Primary colors based on #F7DE12 (your yellow)
  primary: '#F7DE12', // Your yellow
  primaryLight: '#F9E755', // Lighter yellow
  primaryDark: '#D4BC0F', // Darker yellow
  secondary: '#FFFFFF', // White
  accent: '#F7DE12', // Using yellow as accent too
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Text colors
  text: '#000000', // Black text
  textSecondary: '#374151', // Dark gray
  textTertiary: '#6B7280',
  textInverted: '#000000', // Black for text on yellow
  subtleText: '#6B7280',

  // Background colors
  background: '#FFFFFF', // White background
  backgroundSecondary: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceVariant: '#F3F4F6',
  card: '#FFFFFF',
  body: '#FFFFFF', // White
  footer: '#F8FAFC',
  pageBackground: '#FFFFFF', // White

  // Buttons - using yellow
  button: '#F7DE12',
  buttonText: '#000000', // Black text on yellow buttons
  buttonHover: '#F9E755', // Lighter yellow on hover
  buttonActive: '#D4BC0F', // Darker yellow when active

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',

  gray: baseGrayScale,

  // Gradients using yellow
  primaryGradient: 'linear-gradient(135deg, #F7DE12 0%, #D4BC0F 100%)',
  primaryGradientLight:
    'linear-gradient(135deg, rgba(247, 222, 18, 0.1) 0%, rgba(212, 188, 15, 0.1) 100%)',
  secondaryGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',

  focusRing: '0 0 0 3px rgba(247, 222, 18, 0.3)',

  shadowSm: '0 1px 3px rgba(0,0,0,0.1)',
  shadowMd: '0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)',
  shadowLg: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)',

  borderRadius: baseBorderRadius,

  heading: '#000000', // Black headings
  white: '#FFFFFF',
  black: '#000000',
  highlight: '#F7DE12', // Using yellow as highlight

  tertiary: '#F3F4F6',
  onTertiary: '#000000', // Black text on light gray
  onPrimary: '#000000', // Black text on yellow
  onSecondary: '#000000', // Black text on white
  outline: '#D1D5DB',
};

// Utility types for theme usage
export type ThemeColor = keyof Omit<ColorScheme, 'gray' | 'borderRadius'>;
export type GrayColor = keyof GrayScale;
export type BorderRadiusSize = keyof BorderRadius;
