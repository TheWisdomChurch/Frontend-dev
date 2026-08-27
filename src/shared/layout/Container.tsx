import React from 'react';
import { cn } from '@/lib/cn';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
type ContainerPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ContainerProps {
  children: React.ReactNode;
  size?: ContainerSize;
  padding?: ContainerPadding;
  className?: string;
  centered?: boolean;
  style?: React.CSSProperties;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-[var(--content-wide)]',
  '2xl': 'max-w-[var(--content-wide)]',
  full: 'max-w-none',
};

const paddingClasses: Record<ContainerPadding, string> = {
  none: 'px-0',
  xs: 'px-[var(--page-gutter-compact)]',
  sm: 'px-[var(--page-gutter)]',
  md: 'px-[var(--page-gutter)]',
  lg: 'px-[var(--page-gutter)]',
  xl: 'px-[var(--page-gutter)]',
};

export default function Container({
  children,
  size = 'xl',
  padding = 'md',
  className,
  centered = true,
  style,
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full min-w-0',
        sizeClasses[size],
        paddingClasses[padding],
        centered && 'mx-auto',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
