// components/layout/GridboxLayout.tsx
import React from 'react';
import { useTheme } from '@/components/contexts/ThemeContext';

interface GridboxLayoutProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
  background?: 'none' | 'primary' | 'secondary' | 'dark' | 'light' | 'custom';
  customBackground?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  responsive?: {
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4 | 5 | 6;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
}

const GridboxLayout: React.FC<GridboxLayoutProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className = '',
  fullWidth = false,
  fullHeight = false,
  background = 'none',
  customBackground,
  padding = 'md',
  responsive,
}) => {
  const { colorScheme } = useTheme();

  // Default responsive behavior - FIXED for mobile
  const defaultResponsive = {
    sm: 1, // Mobile: 1 column
    md: 2, // Tablet: 2 columns
    lg: columns, // Desktop: use provided columns
    ...responsive, // Override with custom responsive settings
  };

  // Build responsive grid classes
  const getGridClasses = () => {
    const classes = [];

    // Mobile first (sm)
    classes.push(`grid-cols-${defaultResponsive.sm}`);

    // Tablet (md)
    if (defaultResponsive.md)
      classes.push(`md:grid-cols-${defaultResponsive.md}`);

    // Desktop (lg)
    if (defaultResponsive.lg)
      classes.push(`lg:grid-cols-${defaultResponsive.lg}`);

    // Large desktop (xl)
    if (defaultResponsive.xl)
      classes.push(`xl:grid-cols-${defaultResponsive.xl}`);

    return classes.join(' ');
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
    'grid w-full',
    getGridClasses(),
    gapClasses[gap],
    paddingClasses[padding],
    fullWidth ? 'w-full' : '',
    fullHeight ? 'h-full' : '',
    className,
  ].join(' ');

  return (
    <div
      className={layoutClasses}
      style={background !== 'none' ? backgroundStyles[background] : undefined}
    >
      {children}
    </div>
  );
};

export default GridboxLayout;
