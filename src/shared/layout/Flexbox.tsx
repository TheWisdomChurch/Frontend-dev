import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';

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
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsiveDirection?: {
    sm?: 'row' | 'column';
    md?: 'row' | 'column';
    lg?: 'row' | 'column';
  };
  style?: React.CSSProperties;
}

const directionClasses = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
};

const justifyClasses = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const alignClasses = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const wrapClasses = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
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

function getResponsiveDirectionClasses(
  responsiveDirection?: FlexboxLayoutProps['responsiveDirection']
) {
  if (!responsiveDirection) return '';

  return cn(
    responsiveDirection.sm &&
      `sm:${responsiveDirection.sm === 'row' ? 'flex-row' : 'flex-col'}`,
    responsiveDirection.md &&
      `md:${responsiveDirection.md === 'row' ? 'flex-row' : 'flex-col'}`,
    responsiveDirection.lg &&
      `lg:${responsiveDirection.lg === 'row' ? 'flex-row' : 'flex-col'}`
  );
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
      className,
      fullWidth = true,
      fullHeight = false,
      padding = 'none',
      responsiveDirection,
      style,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex min-w-0',
          directionClasses[direction],
          getResponsiveDirectionClasses(responsiveDirection),
          justifyClasses[justify],
          alignClasses[align],
          wrapClasses[wrap],
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
);

FlexboxLayout.displayName = 'FlexboxLayout';

export default FlexboxLayout;
