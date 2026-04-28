'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface ButtonGroupProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical' | 'responsive';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
  fullWidthOnMobile?: boolean;
  align?: 'start' | 'center' | 'end' | 'between';
}

const spacingClasses = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
};

const alignClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

export function ButtonGroup({
  children,
  direction = 'responsive',
  spacing = 'md',
  className,
  fullWidthOnMobile = true,
  align = 'start',
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-wrap items-center',
        direction === 'horizontal' && 'flex-row',
        direction === 'vertical' && 'flex-col items-stretch',
        direction === 'responsive' && 'flex-col sm:flex-row',
        spacingClasses[spacing],
        alignClasses[align],
        fullWidthOnMobile &&
          '[&>button]:w-full [&>a]:w-full sm:[&>button]:w-auto sm:[&>a]:w-auto',
        className
      )}
    >
      {children}
    </div>
  );
}
