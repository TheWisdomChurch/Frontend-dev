// components/layout/Container.tsx
import React from 'react';

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
  size = 'lg',
  padding = 'md',
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
    xs: 'px-4', // Mobile first
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6',
    lg: 'px-4 sm:px-8',
    xl: 'px-4 sm:px-12',
    '2xl': 'px-4 sm:px-16',
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

  const containerClasses = [
    'w-full',
    sizeClasses[size],
    paddingClasses[padding],
    centered ? 'mx-auto' : '',
    className,
  ].join(' ');

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
