// components/layout/FlexboxLayout.tsx
import React, { forwardRef } from 'react';
import { useTheme } from '@/components/contexts/ThemeContext';

interface FlexboxLayoutProps {
  children: React.ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
  background?: 'none' | 'primary' | 'secondary' | 'dark' | 'light' | 'custom';
  customBackground?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  responsiveDirection?: {
    sm?: 'row' | 'column';
    md?: 'row' | 'column';
    lg?: 'row' | 'column';
  };
  style?: React.CSSProperties;
}

const FlexboxLayout = forwardRef<HTMLDivElement, FlexboxLayoutProps>(
  (
    {
      children,
      direction = 'row',
      justify = 'start',
      align = 'stretch',
      wrap = 'nowrap',
      gap = 'md',
      className = '',
      fullWidth = false,
      fullHeight = false,
      background = 'none',
      customBackground,
      padding = 'none', // CHANGED: Default to none
      responsiveDirection,
      style,
    },
    ref
  ) => {
    const { colorScheme } = useTheme();

    // Direction classes with responsive options
    const getDirectionClasses = () => {
      const baseDirection = {
        row: 'flex-row',
        column: 'flex-col',
        'row-reverse': 'flex-row-reverse',
        'column-reverse': 'flex-col-reverse',
      }[direction];

      if (!responsiveDirection) return baseDirection;

      const responsiveClasses = [];
      if (responsiveDirection.sm)
        responsiveClasses.push(
          `sm:flex-${responsiveDirection.sm === 'row' ? 'row' : 'col'}`
        );
      if (responsiveDirection.md)
        responsiveClasses.push(
          `md:flex-${responsiveDirection.md === 'row' ? 'row' : 'col'}`
        );
      if (responsiveDirection.lg)
        responsiveClasses.push(
          `lg:flex-${responsiveDirection.lg === 'row' ? 'row' : 'col'}`
        );

      return `${baseDirection} ${responsiveClasses.join(' ')}`;
    };

    // Justify classes
    const justifyClasses = {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    // Align classes
    const alignClasses = {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    };

    // Gap classes - SIMPLIFIED (no extra padding)
    const gapClasses = {
      none: 'gap-0',
      xs: 'gap-2',
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
    };

    // REMOVED all padding classes - use 'none' by default
    const paddingClasses = {
      none: '',
      xs: 'p-2',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
      '2xl': 'p-12',
    };

    // Background colors
    const backgroundStyles = {
      none: {},
      primary: { backgroundColor: colorScheme.primary },
      secondary: { backgroundColor: colorScheme.secondary },
      dark: { backgroundColor: colorScheme.background },
      light: { backgroundColor: colorScheme.white },
      custom: customBackground ? { backgroundColor: customBackground } : {},
    };

    const layoutClasses = [
      'flex',
      getDirectionClasses(),
      justifyClasses[justify],
      alignClasses[align],
      `flex-${wrap}`,
      gapClasses[gap],
      paddingClasses[padding], // Only applied if explicitly set
      fullWidth ? 'w-full' : '',
      fullHeight ? 'h-full' : '',
      className,
    ]
      .join(' ')
      .trim();

    const combinedStyles = {
      ...(background !== 'none' ? backgroundStyles[background] : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={layoutClasses}
        style={
          Object.keys(combinedStyles).length > 0 ? combinedStyles : undefined
        }
      >
        {children}
      </div>
    );
  }
);

FlexboxLayout.displayName = 'FlexboxLayout';

export default FlexboxLayout;
