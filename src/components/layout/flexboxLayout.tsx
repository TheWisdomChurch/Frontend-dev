// components/layout/FlexboxLayout.tsx
import React, { forwardRef } from 'react'; // Add forwardRef import
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

// Use forwardRef to wrap the component
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
      padding = 'md',
      responsiveDirection,
      style,
    },
    ref
  ) => {
    // Add ref parameter
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

    // Responsive gap classes - FIXED for mobile
    const gapClasses = {
      none: 'gap-0',
      xs: 'gap-2 sm:gap-2',
      sm: 'gap-3 sm:gap-4',
      md: 'gap-4 sm:gap-6',
      lg: 'gap-6 sm:gap-8',
      xl: 'gap-8 sm:gap-12',
      '2xl': 'gap-12 sm:gap-16',
    };

    // Responsive padding classes - FIXED for mobile
    const paddingClasses = {
      none: 'p-0',
      xs: 'p-2 sm:p-2',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
      xl: 'p-8 sm:p-12',
      '2xl': 'p-12 sm:p-16',
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
      paddingClasses[padding],
      fullWidth ? 'w-full' : '',
      fullHeight ? 'h-full' : '',
      className,
    ].join(' ');

    // Combine background styles with custom style prop
    const combinedStyles = {
      ...(background !== 'none' ? backgroundStyles[background] : {}),
      ...style,
    };

    return (
      <div
        ref={ref} // Add the ref here
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

// Add display name for better debugging
FlexboxLayout.displayName = 'FlexboxLayout';

export default FlexboxLayout;
