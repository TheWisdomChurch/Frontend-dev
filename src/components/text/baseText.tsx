// components/text/baseText.tsx
'use client';

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { bricolageGrotesque, worksans, playfair } from '../fonts/fonts';

type FontWeight =
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold';

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
  | 'elegant-lg'
  | 'elegant-md'
  | 'elegant-sm'
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
  fontFamily?: 'bricolage' | 'worksans' | 'playfair';
  as?: React.ElementType;
  useThemeColor?: boolean;
  style?: React.CSSProperties;
  variant?: TextVariant;
}

const fontFamilyMap: Record<string, string> = {
  bricolage: bricolageGrotesque.className,
  worksans: worksans.className,
  playfair: playfair.className,
};

const fontSizeMap: Record<string, string> = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  xxl: '24px',
};

const weightClassMap: Record<FontWeight, string> = {
  light: 'font-light',
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

const variantMap: Record<
  string,
  { fontSize: FontSize; weight: FontWeight; fontFamily: string }
> = {
  'heading-xl': {
    fontSize: 'xxl',
    weight: 'extrabold',
    fontFamily: 'bricolage',
  },
  'heading-lg': { fontSize: 'xl', weight: 'bold', fontFamily: 'bricolage' },
  'heading-md': { fontSize: 'lg', weight: 'semibold', fontFamily: 'bricolage' },
  'heading-sm': { fontSize: 'md', weight: 'medium', fontFamily: 'bricolage' },
  'body-lg': { fontSize: 'lg', weight: 'regular', fontFamily: 'worksans' },
  'body-md': { fontSize: 'md', weight: 'regular', fontFamily: 'worksans' },
  'body-sm': { fontSize: 'sm', weight: 'regular', fontFamily: 'worksans' },
  caption: { fontSize: 'xs', weight: 'light', fontFamily: 'worksans' },
  'elegant-lg': { fontSize: 'lg', weight: 'regular', fontFamily: 'playfair' },
  'elegant-md': { fontSize: 'md', weight: 'regular', fontFamily: 'playfair' },
  'elegant-sm': { fontSize: 'sm', weight: 'regular', fontFamily: 'playfair' },
};

export const BaseText: React.FC<BaseTextProps> = ({
  children,
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
  weight,
  fontWeight,
  ...props
}) => {
  const { colorScheme } = useTheme();

  const variantSettings = variant ? variantMap[variant] : null;

  // Priority: variant > explicit props > defaults
  const finalFontSize = variantSettings?.fontSize || fontSize || 'md';
  const finalFontFamily =
    variantSettings?.fontFamily || fontFamily || 'worksans';
  const finalWeight =
    weight || fontWeight || variantSettings?.weight || 'regular';

  // Get text color - use theme color if useThemeColor is true and no explicit color is provided
  const textColor = useThemeColor && !color ? colorScheme.text : color;

  const resolvedFontSize = fontSizeMap[finalFontSize] || finalFontSize;
  const resolvedFontFamily =
    fontFamilyMap[finalFontFamily] || worksans.className;
  const resolvedWeightClass = weightClassMap[finalWeight];

  const styles: React.CSSProperties = {
    margin,
    lineHeight,
    textDecoration,
    fontSize: resolvedFontSize,
    ...(textColor && { color: textColor }),
    ...style,
  };

  return (
    <Component
      style={styles}
      className={`${resolvedFontFamily} ${resolvedWeightClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
