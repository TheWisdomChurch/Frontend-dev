// components/text/baseText.tsx
'use client';

import React, { forwardRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { bricolageGrotesque, worksans, playfair } from '../fonts/fonts';

// ADD "black" to FontWeight type
type FontWeight =
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black'; // ← ADD THIS LINE

type FontSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl';

type TextVariant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body-xl'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'body-xs'
  | 'caption'
  | 'elegant-xl'
  | 'elegant-lg'
  | 'elegant-md';

export interface BaseTextProps {
  children: React.ReactNode;
  weight?: FontWeight;
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
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const fontFamilyMap: Record<string, string> = {
  bricolage: bricolageGrotesque.className,
  worksans: worksans.className,
  playfair: playfair.className,
};

const fontSizeMap: Record<FontSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl',
};

// ADD "black" to weightClassMap
const weightClassMap: Record<FontWeight, string> = {
  light: 'font-light',
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black', // ← ADD THIS LINE
};

// Professional variant system with responsive scaling
const variantMap: Record<
  TextVariant,
  {
    fontSize: {
      base: FontSize;
      sm?: FontSize;
      md?: FontSize;
      lg?: FontSize;
      xl?: FontSize;
    };
    weight: {
      base: FontWeight;
      sm?: FontWeight;
      md?: FontWeight;
      lg?: FontWeight;
      xl?: FontWeight;
    };
    fontFamily: string;
    lineHeight?: string;
  }
> = {
  // Hero - Largest, most prominent text
  hero: {
    fontSize: { base: '4xl', sm: '5xl', md: '6xl', lg: '7xl', xl: '8xl' },
    weight: { base: 'black', sm: 'black', md: 'black', lg: 'black' }, // ← Use 'black' here
    fontFamily: 'bricolage',
    lineHeight: '1.1',
  },
  // Headings with progressive scaling
  h1: {
    fontSize: { base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' },
    weight: { base: 'black', sm: 'black', md: 'black', lg: 'black' }, // ← Use 'black' here
    fontFamily: 'bricolage',
    lineHeight: '1.2',
  },
  h2: {
    fontSize: { base: '2xl', sm: '3xl', md: '4xl', lg: '5xl' },
    weight: { base: 'bold', sm: 'black', md: 'black', lg: 'black' }, // ← Use 'black' here
    fontFamily: 'bricolage',
    lineHeight: '1.3',
  },
  h3: {
    fontSize: { base: 'xl', sm: '2xl', md: '3xl', lg: '4xl' },
    weight: { base: 'bold', sm: 'bold', md: 'black', lg: 'black' }, // ← Use 'black' here
    fontFamily: 'bricolage',
    lineHeight: '1.4',
  },
  h4: {
    fontSize: { base: 'lg', sm: 'xl', md: '2xl', lg: '3xl' },
    weight: { base: 'semibold', sm: 'bold', md: 'bold', lg: 'black' }, // ← Use 'black' here
    fontFamily: 'bricolage',
    lineHeight: '1.4',
  },
  h5: {
    fontSize: { base: 'base', sm: 'lg', md: 'xl', lg: '2xl' },
    weight: { base: 'semibold', sm: 'semibold', md: 'bold', lg: 'bold' },
    fontFamily: 'bricolage',
    lineHeight: '1.5',
  },
  h6: {
    fontSize: { base: 'sm', sm: 'base', md: 'lg', lg: 'xl' },
    weight: { base: 'medium', sm: 'semibold', md: 'semibold', lg: 'bold' },
    fontFamily: 'bricolage',
    lineHeight: '1.5',
  },
  // Body text - consistent readability
  'body-xl': {
    fontSize: { base: 'xl', sm: 'xl', md: '2xl', lg: '2xl' },
    weight: { base: 'regular', sm: 'regular', md: 'regular', lg: 'regular' },
    fontFamily: 'worksans',
    lineHeight: '1.6',
  },
  'body-lg': {
    fontSize: { base: 'lg', sm: 'lg', md: 'xl', lg: 'xl' },
    weight: { base: 'regular', sm: 'regular', md: 'regular', lg: 'regular' },
    fontFamily: 'worksans',
    lineHeight: '1.6',
  },
  'body-md': {
    fontSize: { base: 'base', sm: 'base', md: 'lg', lg: 'lg' },
    weight: { base: 'regular', sm: 'regular', md: 'regular', lg: 'regular' },
    fontFamily: 'worksans',
    lineHeight: '1.6',
  },
  'body-sm': {
    fontSize: { base: 'sm', sm: 'sm', md: 'base', lg: 'base' },
    weight: { base: 'regular', sm: 'regular', md: 'regular', lg: 'regular' },
    fontFamily: 'worksans',
    lineHeight: '1.5',
  },
  'body-xs': {
    fontSize: { base: 'xs', sm: 'xs', md: 'sm', lg: 'sm' },
    weight: { base: 'regular', sm: 'regular', md: 'regular', lg: 'regular' },
    fontFamily: 'worksans',
    lineHeight: '1.4',
  },
  caption: {
    fontSize: { base: 'xs', sm: 'xs', md: 'xs', lg: 'xs' },
    weight: { base: 'light', sm: 'light', md: 'light', lg: 'light' },
    fontFamily: 'worksans',
    lineHeight: '1.4',
  },
  // Elegant text variants
  'elegant-xl': {
    fontSize: { base: 'xl', sm: '2xl', md: '3xl', lg: '4xl' },
    weight: { base: 'regular', sm: 'regular', md: 'regular', lg: 'regular' },
    fontFamily: 'playfair',
    lineHeight: '1.4',
  },
  'elegant-lg': {
    fontSize: { base: 'lg', sm: 'xl', md: '2xl', lg: '3xl' },
    weight: { base: 'regular', sm: 'regular', md: 'regular', lg: 'regular' },
    fontFamily: 'playfair',
    lineHeight: '1.4',
  },
  'elegant-md': {
    fontSize: { base: 'base', sm: 'lg', md: 'xl', lg: '2xl' },
    weight: { base: 'regular', sm: 'regular', md: 'regular', lg: 'regular' },
    fontFamily: 'playfair',
    lineHeight: '1.5',
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
      fontSize = 'base',
      className = '',
      fontFamily,
      as: Component = 'p',
      useThemeColor = false,
      style,
      variant,
      weight,
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

    // Get text color - use theme color if useThemeColor is true and no explicit color is provided
    const textColor = useThemeColor && !color ? colorScheme.text : color;

    // Build responsive classes
    const buildResponsiveClasses = () => {
      const classes: string[] = [];

      if (variantSettings) {
        // Variant-based responsive sizing
        const { fontSize: variantFontSize, weight: variantWeight } =
          variantSettings;

        // Base size and weight
        classes.push(fontSizeMap[variantFontSize.base]);
        classes.push(weightClassMap[variantWeight.base]);

        // Responsive sizes
        if (variantFontSize.sm)
          classes.push(`sm:${fontSizeMap[variantFontSize.sm]}`);
        if (variantFontSize.md)
          classes.push(`md:${fontSizeMap[variantFontSize.md]}`);
        if (variantFontSize.lg)
          classes.push(`lg:${fontSizeMap[variantFontSize.lg]}`);
        if (variantFontSize.xl)
          classes.push(`xl:${fontSizeMap[variantFontSize.xl]}`);

        // Responsive weights
        if (variantWeight.sm)
          classes.push(`sm:${weightClassMap[variantWeight.sm]}`);
        if (variantWeight.md)
          classes.push(`md:${weightClassMap[variantWeight.md]}`);
        if (variantWeight.lg)
          classes.push(`lg:${weightClassMap[variantWeight.lg]}`);
        if (variantWeight.xl)
          classes.push(`xl:${weightClassMap[variantWeight.xl]}`);
      } else {
        // Manual sizing and weights
        classes.push(fontSizeMap[fontSize]);
        if (weight) {
          classes.push(weightClassMap[weight]);
        }

        // Responsive weights
        if (smWeight) classes.push(`sm:${weightClassMap[smWeight]}`);
        if (mdWeight) classes.push(`md:${weightClassMap[mdWeight]}`);
        if (lgWeight) classes.push(`lg:${weightClassMap[lgWeight]}`);
        if (xlWeight) classes.push(`xl:${weightClassMap[xlWeight]}`);
      }

      return classes.join(' ');
    };

    const finalFontFamily =
      variantSettings?.fontFamily || fontFamily || 'worksans';
    const resolvedFontFamily =
      fontFamilyMap[finalFontFamily] || worksans.className;
    const responsiveClasses = buildResponsiveClasses();
    const finalLineHeight = lineHeight || variantSettings?.lineHeight;

    const styles: React.CSSProperties = {
      margin,
      lineHeight: finalLineHeight,
      textDecoration,
      ...(textColor && { color: textColor }),
      ...style,
    };

    return (
      <Component
        ref={ref}
        style={styles}
        className={`${resolvedFontFamily} ${responsiveClasses} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

BaseText.displayName = 'BaseText';
