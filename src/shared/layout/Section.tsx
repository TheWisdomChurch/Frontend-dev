// components/layout/Section.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';

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
  perf?: 'auto' | 'none';
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      padding = 'xl',
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
      perf = 'auto',
    },
    ref
  ) => {
    // REMOVED all vertical padding - only apply when explicitly requested
    const paddingClasses = {
      none: '',
      xs: 'py-10 sm:py-12',
      sm: 'py-12 sm:py-16',
      md: 'py-16 sm:py-20 lg:py-24',
      lg: 'py-20 sm:py-24 lg:py-28',
      xl: 'py-24 sm:py-28 lg:py-32',
      '2xl': 'py-28 sm:py-32 lg:py-36',
    };

    // Background colors
    const backgroundStyles = {
      none: {},
      primary: { backgroundColor: 'var(--color-primary, #f7de12)' },
      secondary: { backgroundColor: 'var(--color-secondary, #1f2937)' },
      dark: { backgroundColor: 'var(--color-background, #000000)' },
      light: { backgroundColor: 'var(--color-white, #ffffff)' },
      custom: customBackground ? { backgroundColor: customBackground } : {},
      image: backgroundImage
        ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        : {},
    };

    const sectionClasses = cn(
      'relative w-full overflow-hidden',
      paddingClasses[padding],
      fullHeight && 'min-h-screen',
      centered && 'flex items-center',
      perf === 'auto' && 'perf-section',
      className
    );

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
