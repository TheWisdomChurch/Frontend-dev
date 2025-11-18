// components/text/baseText.tsx
'use client';

import React, { forwardRef } from 'react';
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
  // Responsive weight props
  smWeight?: FontWeight;
  mdWeight?: FontWeight;
  lgWeight?: FontWeight;
  xlWeight?: FontWeight;
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
  // Add these missing event handlers
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const fontFamilyMap: Record<string, string> = {
  bricolage: bricolageGrotesque.className,
  worksans: worksans.className,
  playfair: playfair.className,
};

const fontSizeMap: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  xxl: 'text-2xl',
};

const weightClassMap: Record<FontWeight, string> = {
  light: 'font-light',
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

// Updated variantMap with more appropriate base weights
const variantMap: Record<
  string,
  { fontSize: FontSize; weight: FontWeight; fontFamily: string }
> = {
  'heading-xl': {
    fontSize: 'xxl',
    weight: 'bold',
    fontFamily: 'bricolage',
  },
  'heading-lg': {
    fontSize: 'xl',
    weight: 'bold',
    fontFamily: 'bricolage',
  },
  'heading-md': {
    fontSize: 'lg',
    weight: 'semibold',
    fontFamily: 'bricolage',
  },
  'heading-sm': {
    fontSize: 'md',
    weight: 'medium',
    fontFamily: 'bricolage',
  },
  'body-lg': {
    fontSize: 'lg',
    weight: 'regular',
    fontFamily: 'worksans',
  },
  'body-md': {
    fontSize: 'md',
    weight: 'regular',
    fontFamily: 'worksans',
  },
  'body-sm': {
    fontSize: 'sm',
    weight: 'regular',
    fontFamily: 'worksans',
  },
  caption: {
    fontSize: 'xs',
    weight: 'light',
    fontFamily: 'worksans',
  },
  'elegant-lg': {
    fontSize: 'lg',
    weight: 'regular',
    fontFamily: 'playfair',
  },
  'elegant-md': {
    fontSize: 'md',
    weight: 'regular',
    fontFamily: 'playfair',
  },
  'elegant-sm': {
    fontSize: 'sm',
    weight: 'regular',
    fontFamily: 'playfair',
  },
};

export const BaseText = forwardRef<HTMLElement, BaseTextProps>(
  (
    {
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
      // New responsive weight props
      smWeight,
      mdWeight,
      lgWeight,
      xlWeight,
      ...props
    },
    ref
  ) => {
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

    // Convert fontSize to Tailwind class instead of inline style
    const fontSizeClass = fontSizeMap[finalFontSize] || '';
    const resolvedFontFamily =
      fontFamilyMap[finalFontFamily] || worksans.className;

    // Base weight class
    const baseWeightClass = weightClassMap[finalWeight];

    // Responsive weight classes
    const responsiveWeightClasses = [
      smWeight ? `sm:${weightClassMap[smWeight]}` : '',
      mdWeight ? `md:${weightClassMap[mdWeight]}` : '',
      lgWeight ? `lg:${weightClassMap[lgWeight]}` : '',
      xlWeight ? `xl:${weightClassMap[xlWeight]}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const styles: React.CSSProperties = {
      margin,
      lineHeight,
      textDecoration,
      // fontSize is now handled by Tailwind classes, removed from inline styles
      ...(textColor && { color: textColor }),
      ...style,
    };

    return (
      <Component
        ref={ref}
        style={styles}
        className={`${resolvedFontFamily} ${baseWeightClass} ${fontSizeClass} ${responsiveWeightClasses} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

BaseText.displayName = 'BaseText';
