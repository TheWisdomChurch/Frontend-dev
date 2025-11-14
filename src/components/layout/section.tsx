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
  id?: string; // Add this line
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      padding = 'lg',
      background = 'none',
      customBackground,
      backgroundImage,
      overlay = false,
      overlayOpacity = 50,
      className = '',
      fullHeight = false,
      centered = false,
      style,
      id, // Add this line
    },
    ref
  ) => {
    const { colorScheme } = useTheme();

    // Responsive padding classes - FIXED for mobile
    const paddingClasses = {
      none: 'py-0',
      xs: 'py-4 sm:py-4',
      sm: 'py-6 sm:py-8',
      md: 'py-8 sm:py-12',
      lg: 'py-12 sm:py-16',
      xl: 'py-16 sm:py-20',
      '2xl': 'py-20 sm:py-24',
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
      paddingClasses[padding],
      fullHeight ? 'min-h-screen' : 'min-h-0',
      centered ? 'flex items-center' : '',
      className,
    ].join(' ');

    // Combine background styles with custom style prop
    const combinedStyles = {
      ...(background !== 'none' ? backgroundStyles[background] : {}),
      ...style,
    };

    return (
      <section
        ref={ref}
        id={id} // Add this line
        className={sectionClasses}
        style={combinedStyles} // Use combined styles
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
