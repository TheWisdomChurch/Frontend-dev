'use client';

import { forwardRef } from 'react';
import type { CSSProperties, ElementType, MouseEvent, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { dmSans } from '@/shared/fonts/fonts';

/**
 * The single text-component system. One `BaseText` renders every styled string;
 * the named presets below are thin wrappers. Sizes come from the `--type-*`
 * scale (via Tailwind `text-*` utilities); the typeface is the one app sans.
 */

export type FontWeight =
  'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

export type TextVariant =
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'caption'
  | 'eyebrow';

export interface BaseTextProps {
  children: ReactNode;
  as?: ElementType;
  variant?: TextVariant;
  weight?: FontWeight;
  color?: string;
  /** Retained for call-site compatibility; BaseText never reads it. */
  useThemeColor?: boolean;
  textDecoration?: 'none' | 'underline' | 'line-through';
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: CSSProperties;
  id?: string;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

const weightClass: Record<FontWeight, string> = {
  light: 'font-light',
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
};

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

const variantClass: Record<TextVariant, string> = {
  h2: 'text-2xl leading-[1.12] tracking-[-0.035em] sm:text-3xl lg:text-4xl font-semibold text-balance',
  h3: 'text-xl leading-[1.2] tracking-[-0.025em] sm:text-2xl lg:text-3xl font-semibold text-balance',
  h4: 'text-lg leading-[1.25] tracking-[-0.02em] sm:text-xl lg:text-2xl font-semibold text-balance',
  'body-lg':
    'text-body-md leading-7 sm:text-base sm:leading-7 lg:text-lg lg:leading-8 font-normal text-pretty',
  'body-md':
    'text-sm leading-6 sm:text-body-md sm:leading-7 lg:text-base lg:leading-7 font-normal text-pretty',
  'body-sm':
    'text-body-sm leading-6 sm:text-sm sm:leading-6 font-normal text-pretty',
  caption: 'text-xs leading-5 font-medium tracking-[0.02em]',
  eyebrow:
    'text-caption leading-5 font-bold uppercase tracking-[0.22em] sm:text-xs',
};

export const BaseText = forwardRef<HTMLElement, BaseTextProps>(
  function BaseText(
    {
      children,
      as: Component = 'p',
      variant = 'body-md',
      weight,
      color,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useThemeColor,
      textDecoration = 'none',
      align,
      className,
      style,
      ...props
    },
    ref
  ) {
    return (
      <Component
        ref={ref}
        className={cn(
          'min-w-0 antialiased',
          dmSans.className,
          variantClass[variant],
          weight && weightClass[weight],
          align && alignClass[align],
          className
        )}
        // eslint-disable-next-line no-restricted-syntax
        style={{ textDecoration, ...(color ? { color } : {}), ...style }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

export const H2 = forwardRef<HTMLElement, BaseTextProps>(
  function H2(props, ref) {
    return <BaseText ref={ref} as="h2" variant="h2" {...props} />;
  }
);

export const H3 = forwardRef<HTMLElement, BaseTextProps>(
  function H3(props, ref) {
    return <BaseText ref={ref} as="h3" variant="h3" {...props} />;
  }
);

export const H4 = forwardRef<HTMLElement, BaseTextProps>(
  function H4(props, ref) {
    return <BaseText ref={ref} as="h4" variant="h4" {...props} />;
  }
);

export const BodyLG = forwardRef<HTMLElement, BaseTextProps>(
  function BodyLG(props, ref) {
    return <BaseText ref={ref} as="p" variant="body-lg" {...props} />;
  }
);

export const BodyMD = forwardRef<HTMLElement, BaseTextProps>(
  function BodyMD(props, ref) {
    return <BaseText ref={ref} as="p" variant="body-md" {...props} />;
  }
);

export const BodySM = forwardRef<HTMLElement, BaseTextProps>(
  function BodySM(props, ref) {
    return <BaseText ref={ref} as="p" variant="body-sm" {...props} />;
  }
);

export const SmallText = forwardRef<HTMLElement, BaseTextProps>(
  function SmallText(props, ref) {
    return <BaseText ref={ref} as="p" variant="body-sm" {...props} />;
  }
);

export const Caption = forwardRef<HTMLElement, BaseTextProps>(
  function Caption(props, ref) {
    return <BaseText ref={ref} as="span" variant="caption" {...props} />;
  }
);

export const Eyebrow = forwardRef<HTMLElement, BaseTextProps>(
  function Eyebrow(props, ref) {
    return <BaseText ref={ref} as="p" variant="eyebrow" {...props} />;
  }
);

export const LightText = forwardRef<HTMLElement, BaseTextProps>(
  function LightText(props, ref) {
    return <BaseText ref={ref} weight="light" {...props} />;
  }
);

export const RegularText = forwardRef<HTMLElement, BaseTextProps>(
  function RegularText(props, ref) {
    return <BaseText ref={ref} weight="regular" {...props} />;
  }
);

export const MediumText = forwardRef<HTMLElement, BaseTextProps>(
  function MediumText(props, ref) {
    return <BaseText ref={ref} weight="medium" {...props} />;
  }
);
