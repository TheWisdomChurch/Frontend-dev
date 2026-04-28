'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { useTheme } from '../contexts/ThemeContext';
import { bricolageGrotesque, playfair, worksans } from '../fonts/fonts';

export type FontWeight =
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

export type FontFamily = 'bricolage' | 'worksans' | 'playfair';

export type TextVariant =
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
  | 'eyebrow'
  | 'elegant-xl'
  | 'elegant-lg'
  | 'elegant-md';

export interface BaseTextProps {
  children: React.ReactNode;
  as?: React.ElementType;
  variant?: TextVariant;
  weight?: FontWeight;
  fontFamily?: FontFamily;
  color?: string;
  useThemeColor?: boolean;
  textDecoration?: 'none' | 'underline' | 'line-through';
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const fontFamilyClassMap: Record<FontFamily, string> = {
  bricolage: bricolageGrotesque.className,
  worksans: worksans.className,
  playfair: playfair.className,
};

const weightClassMap: Record<FontWeight, string> = {
  light: 'font-light',
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
};

const alignClassMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const variantClassMap: Record<TextVariant, string> = {
  hero: 'text-[2.15rem] leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-6xl xl:text-[4rem] font-semibold text-balance',
  h1: 'text-3xl leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-5xl font-semibold text-balance',
  h2: 'text-2xl leading-[1.12] tracking-[-0.035em] sm:text-3xl lg:text-4xl font-semibold text-balance',
  h3: 'text-xl leading-[1.2] tracking-[-0.025em] sm:text-2xl lg:text-3xl font-semibold text-balance',
  h4: 'text-lg leading-[1.25] tracking-[-0.02em] sm:text-xl lg:text-2xl font-semibold text-balance',
  h5: 'text-base leading-[1.3] tracking-[-0.015em] sm:text-lg lg:text-xl font-semibold',
  h6: 'text-sm leading-[1.35] tracking-[-0.01em] sm:text-base lg:text-lg font-semibold',

  'body-xl':
    'text-base leading-7 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9 font-normal text-pretty',
  'body-lg':
    'text-[0.98rem] leading-7 sm:text-base sm:leading-7 lg:text-lg lg:leading-8 font-normal text-pretty',
  'body-md':
    'text-sm leading-6 sm:text-[0.95rem] sm:leading-7 lg:text-base lg:leading-7 font-normal text-pretty',
  'body-sm':
    'text-[0.82rem] leading-6 sm:text-sm sm:leading-6 font-normal text-pretty',
  'body-xs': 'text-xs leading-5 sm:text-[0.8rem] sm:leading-5 font-normal',

  caption: 'text-xs leading-5 font-medium tracking-[0.02em]',
  eyebrow:
    'text-[0.68rem] leading-5 font-bold uppercase tracking-[0.22em] sm:text-xs',

  'elegant-xl':
    'text-2xl leading-snug sm:text-3xl lg:text-4xl font-normal text-balance',
  'elegant-lg':
    'text-xl leading-snug sm:text-2xl lg:text-3xl font-normal text-balance',
  'elegant-md':
    'text-lg leading-snug sm:text-xl lg:text-2xl font-normal text-balance',
};

const variantFontFamilyMap: Record<TextVariant, FontFamily> = {
  hero: 'bricolage',
  h1: 'bricolage',
  h2: 'bricolage',
  h3: 'bricolage',
  h4: 'bricolage',
  h5: 'bricolage',
  h6: 'bricolage',
  'body-xl': 'worksans',
  'body-lg': 'worksans',
  'body-md': 'worksans',
  'body-sm': 'worksans',
  'body-xs': 'worksans',
  caption: 'worksans',
  eyebrow: 'worksans',
  'elegant-xl': 'playfair',
  'elegant-lg': 'playfair',
  'elegant-md': 'playfair',
};

export const BaseText = forwardRef<HTMLElement, BaseTextProps>(
  (
    {
      children,
      as: Component = 'p',
      variant = 'body-md',
      weight,
      fontFamily,
      color,
      useThemeColor = false,
      textDecoration = 'none',
      align,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const { colorScheme } = useTheme();

    const resolvedFontFamily = fontFamily || variantFontFamilyMap[variant];
    const textColor = useThemeColor && !color ? colorScheme.text : color;

    return (
      <Component
        ref={ref}
        className={cn(
          'min-w-0 antialiased',
          fontFamilyClassMap[resolvedFontFamily],
          variantClassMap[variant],
          weight && weightClassMap[weight],
          align && alignClassMap[align],
          className
        )}
        style={{
          textDecoration,
          ...(textColor ? { color: textColor } : {}),
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

BaseText.displayName = 'BaseText';
