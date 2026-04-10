// components/layout/Container.tsx
import React from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?: 'none' | 'primary' | 'secondary' | 'dark' | 'light' | 'custom';
  customBackground?: string;
  className?: string;
  centered?: boolean;
  style?: React.CSSProperties;
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  padding = 'lg',
  background = 'none',
  customBackground,
  className = '',
  centered = true,
  style = {},
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  // REMOVED all vertical padding - only horizontal padding
  const paddingClasses = {
    none: 'px-0',
    xs: 'px-5',
    sm: 'px-5 sm:px-7 md:px-9',
    md: 'px-5 sm:px-8 md:px-10',
    lg: 'px-5 sm:px-10 md:px-12 lg:px-14',
    xl: 'px-5 sm:px-12 md:px-14 lg:px-16',
    '2xl': 'px-5 sm:px-14 md:px-16 lg:px-20',
  };

  // Background colors
  const backgroundStyles = {
    none: {},
    primary: { backgroundColor: 'var(--color-primary, #f7de12)' },
    secondary: { backgroundColor: 'var(--color-secondary, #1f2937)' },
    dark: { backgroundColor: 'var(--color-background, #000000)' },
    light: { backgroundColor: 'var(--color-white, #ffffff)' },
    custom: customBackground ? { backgroundColor: customBackground } : {},
  };

  const containerClasses = cn(
    'w-full min-w-0',
    sizeClasses[size],
    paddingClasses[padding],
    centered && 'mx-auto',
    className
  );

  return (
    <div
      className={containerClasses}
      style={{
        ...(background !== 'none' ? backgroundStyles[background] : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Container;
