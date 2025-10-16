// components/text/BaseText.tsx
'use client';

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

type FontWeight =
  | 'extralight'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'extraregular';

type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | string;

type TextVariant =
  | 'heading-xl'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'caption'
  | string;

export interface BaseTextProps {
  children: React.ReactNode;
  weight?: FontWeight;
  fontWeight?: FontWeight;
  color?: string;
  margin?: string;
  lineHeight?: string;
  textDecoration?: 'none' | 'underline' | 'line-through';
  fontSize?: FontSize;
  xsFontSize?: FontSize;
  smFontSize?: FontSize;
  mdFontSize?: FontSize;
  lgFontSize?: FontSize;
  xlFontSize?: FontSize;
  className?: string;
  fontFamily?: string;
  as?: React.ElementType;
  useThemeColor?: boolean;
  style?: React.CSSProperties;
  variant?: TextVariant;
}

const fontWeights: Record<FontWeight, number> = {
  extralight: 200,
  light: 200,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  extraregular: 400,
};

const fontFamilyMap: Record<FontWeight, string> = {
  extralight: 'var(--font-raleway), sans-serif',
  light: 'var(--font-raleway), sans-serif',
  regular: 'var(--font-bricolage), sans-serif',
  medium: 'var(--font-raleway), sans-serif',
  semibold: 'var(--font-work-sans), sans-serif',
  bold: 'var(--font-roboto), sans-serif',
  extrabold: 'var(--font-bricolage), sans-serif',
  extraregular: 'var(--font-bricolage), sans-serif',
};

const customFontFamilyMap: Record<string, string> = {
  LukiestGuy: 'LukiestGuy, cursive',
  Ultra: 'Ultra, serif',
  AbrilFatFace: 'AbrilFatFace, serif',
  Bricolage: 'var(--font-bricolage), sans-serif',
  Shadows: 'Shadows, cursive',
};

const fontSizeMap: Record<string, string> = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  xxl: '24px',
};

const variantMap: Record<string, { fontSize: FontSize; weight: FontWeight }> = {
  'heading-xl': { fontSize: 'xxl', weight: 'extrabold' },
  'heading-lg': { fontSize: 'xl', weight: 'bold' },
  'heading-md': { fontSize: 'lg', weight: 'semibold' },
  'heading-sm': { fontSize: 'md', weight: 'medium' },
  'body-lg': { fontSize: 'lg', weight: 'regular' },
  'body-md': { fontSize: 'md', weight: 'regular' },
  'body-sm': { fontSize: 'sm', weight: 'regular' },
  caption: { fontSize: 'xs', weight: 'light' },
};

export const BaseText: React.FC<BaseTextProps> = ({
  children,
  weight,
  fontWeight,
  color,
  margin,
  lineHeight,
  textDecoration = 'none',
  fontSize = 'md',
  className = '',
  fontFamily,
  as: Component = 'p',
  useThemeColor = false,
  style,
  variant,
  ...props
}) => {
  const { colorScheme } = useTheme();

  const variantSettings = variant ? variantMap[variant] : null;
  const finalWeight =
    weight || fontWeight || variantSettings?.weight || 'regular';
  const finalFontSize = fontSize || variantSettings?.fontSize || 'md';

  const textColor = useThemeColor && !color ? colorScheme.text : color;
  const resolvedFontSize = fontSizeMap[finalFontSize] || finalFontSize;

  const resolvedFontFamily = fontFamily
    ? customFontFamilyMap[fontFamily] || fontFamily
    : fontFamilyMap[finalWeight];

  const styles: React.CSSProperties = {
    fontFamily: resolvedFontFamily,
    fontWeight: fontWeights[finalWeight],
    margin,
    lineHeight,
    textDecoration,
    fontSize: resolvedFontSize,
    ...(textColor && { color: textColor }),
    ...style,
  };

  return (
    <Component style={styles} className={className} {...props}>
      {children}
    </Component>
  );
};
