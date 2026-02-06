// components/layout/Section.tsx
import React, { forwardRef } from 'react';
import { useTheme } from '@/components/contexts/ThemeContext';

interface SectionProps {
  children: React.ReactNode;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?:
    | 'none'
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'light'
    | 'custom'
    | 'image';
  customBackground?: string;
  backgroundImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
  fullHeight?: boolean;
  centered?: boolean;
  style?: React.CSSProperties;
  id?: string;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      padding = 'none', // CHANGED: Default to none
      background = 'none',
      customBackground,
      backgroundImage,
      overlay = false,
      overlayOpacity = 50,
      className = '',
      fullHeight = false,
      centered = false,
      style,
      id,
    },
    ref
  ) => {
    const { colorScheme } = useTheme();

    // REMOVED all vertical padding - only apply when explicitly requested
    const paddingClasses = {
      none: '',
      xs: 'py-4',
      sm: 'py-6',
      md: 'py-8',
      lg: 'py-12',
      xl: 'py-16',
      '2xl': 'py-20',
    };

    // Background colors
    const backgroundStyles = {
      none: {},
      primary: { backgroundColor: colorScheme.primary },
      secondary: { backgroundColor: colorScheme.secondary },
      dark: { backgroundColor: colorScheme.background },
      light: { backgroundColor: colorScheme.white },
      custom: customBackground ? { backgroundColor: customBackground } : {},
      image: backgroundImage
        ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        : {},
    };

    const sectionClasses = [
      'relative w-full overflow-hidden',
      paddingClasses[padding], // Only applied if explicitly set
      fullHeight ? 'min-h-screen' : '',
      centered ? 'flex items-center' : '',
      className,
    ]
      .join(' ')
      .trim();

    const combinedStyles = {
      ...(background !== 'none' ? backgroundStyles[background] : {}),
      ...style,
    };

    return (
      <section
        ref={ref}
        id={id}
        className={sectionClasses}
        style={combinedStyles}
        data-gsap="reveal"
      >
        {background === 'image' && overlay && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
            }}
          />
        )}
        <div className="relative z-10 w-full">{children}</div>
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;
