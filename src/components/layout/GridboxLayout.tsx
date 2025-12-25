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
    xs?: 1 | 2 | 3 | 4; // FIXED: Added xs property
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
  padding = 'none',
  responsive,
}) => {
  const { colorScheme } = useTheme();

  // Default responsive behavior
  const defaultResponsive = {
    xs: 1, // FIXED: Added default xs value
    sm: 1,
    md: 2,
    lg: columns,
    ...responsive,
  };

  // Build responsive grid classes
  const getGridClasses = () => {
    const classes = [];
    
    // FIXED: Include xs breakpoint
    if (defaultResponsive.xs)
      classes.push(`grid-cols-${defaultResponsive.xs}`);
    
    // Only add other breakpoints if they're defined and different from previous
    if (defaultResponsive.sm && defaultResponsive.sm !== defaultResponsive.xs)
      classes.push(`sm:grid-cols-${defaultResponsive.sm}`);
    
    if (defaultResponsive.md && defaultResponsive.md !== defaultResponsive.sm)
      classes.push(`md:grid-cols-${defaultResponsive.md}`);
    
    if (defaultResponsive.lg && defaultResponsive.lg !== defaultResponsive.md)
      classes.push(`lg:grid-cols-${defaultResponsive.lg}`);
    
    if (defaultResponsive.xl && defaultResponsive.xl !== defaultResponsive.lg)
      classes.push(`xl:grid-cols-${defaultResponsive.xl}`);
    
    return classes.join(' ');
  };

  // Gap classes
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  };

  // Padding classes
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
    'grid w-full',
    getGridClasses(),
    gapClasses[gap],
    paddingClasses[padding],
    fullWidth ? 'w-full' : '',
    fullHeight ? 'h-full' : '',
    className,
  ]
    .join(' ')
    .trim();

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