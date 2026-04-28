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
  xl: 'max-w-7xl',
  '2xl': 'max-w-[1440px]',
  full: 'max-w-none',
};

const paddingClasses: Record<ContainerPadding, string> = {
  none: 'px-0',
  xs: 'px-3 sm:px-4',
  sm: 'px-4 sm:px-5 lg:px-6',
  md: 'px-4 sm:px-6 lg:px-8',
  lg: 'px-5 sm:px-8 lg:px-10',
  xl: 'px-5 sm:px-10 lg:px-12',
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
