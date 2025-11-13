// components/layout/Container.tsx
import React from 'react';
import { useTheme } from '@/components/contexts/ThemeContext';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?: 'none' | 'primary' | 'secondary' | 'dark' | 'light' | 'custom';
  customBackground?: string;
  className?: string;
  centered?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  padding = 'md',
  background = 'none',
  customBackground,
  className = '',
  centered = true,
}) => {
  const { colorScheme } = useTheme();

  // Size classes
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  // Responsive padding classes - FIXED for mobile
  const paddingClasses = {
    none: 'px-0 py-0',
    xs: 'px-4 py-4 sm:px-6 sm:py-6', // Mobile: px-4, Desktop: px-6
    sm: 'px-4 py-6 sm:px-6 sm:py-8',
    md: 'px-4 py-8 sm:px-6 sm:py-12',
    lg: 'px-4 py-12 sm:px-8 sm:py-16',
    xl: 'px-4 py-16 sm:px-12 sm:py-20',
    '2xl': 'px-4 py-20 sm:px-16 sm:py-24',
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
      style={background !== 'none' ? backgroundStyles[background] : undefined}
    >
      {children}
    </div>
  );
};

export default Container;
