import React from 'react';
import { cn } from '@/lib/cn';

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface GridboxLayoutProps {
  children: React.ReactNode;
  columns?: GridColumns;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    xs?: GridColumns;
    sm?: GridColumns;
    md?: GridColumns;
    lg?: GridColumns;
    xl?: GridColumns;
  };
  style?: React.CSSProperties;
}

const columnClasses: Record<GridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
};

const smColumnClasses: Record<GridColumns, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
  7: 'sm:grid-cols-7',
  8: 'sm:grid-cols-8',
  9: 'sm:grid-cols-9',
  10: 'sm:grid-cols-10',
  11: 'sm:grid-cols-11',
  12: 'sm:grid-cols-12',
};

const mdColumnClasses: Record<GridColumns, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
};

const lgColumnClasses: Record<GridColumns, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
  10: 'lg:grid-cols-10',
  11: 'lg:grid-cols-11',
  12: 'lg:grid-cols-12',
};

const xlColumnClasses: Record<GridColumns, string> = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
  7: 'xl:grid-cols-7',
  8: 'xl:grid-cols-8',
  9: 'xl:grid-cols-9',
  10: 'xl:grid-cols-10',
  11: 'xl:grid-cols-11',
  12: 'xl:grid-cols-12',
};

const gapClasses = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-5 sm:gap-6',
  xl: 'gap-6 sm:gap-8',
  '2xl': 'gap-8 sm:gap-10 lg:gap-12',
};

const paddingClasses = {
  none: '',
  xs: 'p-2',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
  xl: 'p-6 sm:p-8',
};

export default function GridboxLayout({
  children,
  columns = 3,
  gap = 'md',
  className,
  fullWidth = true,
  fullHeight = false,
  padding = 'none',
  responsive,
  style,
}: GridboxLayoutProps) {
  const xs = responsive?.xs ?? 1;

  return (
    <div
      className={cn(
        'grid min-w-0',
        columnClasses[xs],
        responsive?.sm && smColumnClasses[responsive.sm],
        responsive?.md && mdColumnClasses[responsive.md],
        responsive?.lg && lgColumnClasses[responsive.lg],
        responsive?.xl && xlColumnClasses[responsive.xl],
        !responsive?.lg && !responsive?.md && lgColumnClasses[columns],
        gapClasses[gap],
        paddingClasses[padding],
        fullWidth && 'w-full',
        fullHeight && 'h-full',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
