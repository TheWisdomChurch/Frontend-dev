/**
 * Enhanced Responsive Design System
 * Complete responsive configuration for mobile, tablet, desktop, large screens, and TV
 */

export type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'large' | 'tv';

export interface ResponsiveConfig {
  // Text sizes
  heading: Record<ScreenSize, string>;
  subheading: Record<ScreenSize, string>;
  body: Record<ScreenSize, string>;
  small: Record<ScreenSize, string>;
  caption: Record<ScreenSize, string>;

  // Components
  button: Record<ScreenSize, string>;
  card: Record<ScreenSize, string>;
  modal: Record<ScreenSize, string>;
  form: Record<ScreenSize, string>;

  // Images
  image: Record<ScreenSize, string>;
  hero: Record<ScreenSize, string>;
  thumbnail: Record<ScreenSize, string>;

  // Spacing
  padding: Record<ScreenSize, string>;
  margin: Record<ScreenSize, string>;
  gap: Record<ScreenSize, string>;
  section: Record<ScreenSize, string>;

  // Layout
  container: Record<ScreenSize, string>;
  grid: Record<ScreenSize, string>;

  // Viewport breakpoints (for reference)
  breakpoints: Record<ScreenSize, number>;
}

/**
 * Comprehensive responsive configuration
 * Breakpoints: mobile (0-640), tablet (640-1024), desktop (1024-1536), large (1536-2560), tv (2560+)
 */
export const responsiveConfig: ResponsiveConfig = {
  // Text Sizes
  heading: {
    mobile: 'text-2xl',
    tablet: 'text-3xl',
    desktop: 'text-4xl',
    large: 'text-5xl',
    tv: 'text-6xl',
  },
  subheading: {
    mobile: 'text-lg',
    tablet: 'text-xl',
    desktop: 'text-2xl',
    large: 'text-3xl',
    tv: 'text-4xl',
  },
  body: {
    mobile: 'text-sm',
    tablet: 'text-base',
    desktop: 'text-base',
    large: 'text-lg',
    tv: 'text-xl',
  },
  small: {
    mobile: 'text-xs',
    tablet: 'text-xs',
    desktop: 'text-sm',
    large: 'text-sm',
    tv: 'text-base',
  },
  caption: {
    mobile: 'text-xs',
    tablet: 'text-xs',
    desktop: 'text-xs',
    large: 'text-sm',
    tv: 'text-sm',
  },

  // Component Sizing
  button: {
    mobile: 'px-3 py-2 text-sm rounded-lg',
    tablet: 'px-4 py-2.5 text-base rounded-lg',
    desktop: 'px-5 py-3 text-base rounded-lg',
    large: 'px-6 py-3.5 text-lg rounded-xl',
    tv: 'px-8 py-4 text-xl rounded-xl',
  },
  card: {
    mobile: 'rounded-lg p-4 gap-3',
    tablet: 'rounded-lg p-5 gap-4',
    desktop: 'rounded-xl p-6 gap-4',
    large: 'rounded-xl p-7 gap-5',
    tv: 'rounded-2xl p-8 gap-6',
  },
  modal: {
    mobile: 'max-w-sm max-h-[90vh]',
    tablet: 'max-w-lg max-h-[90vh]',
    desktop: 'max-w-2xl max-h-[85vh]',
    large: 'max-w-3xl max-h-[85vh]',
    tv: 'max-w-5xl max-h-[80vh]',
  },
  form: {
    mobile: 'max-w-full p-4 gap-3',
    tablet: 'max-w-md p-5 gap-4',
    desktop: 'max-w-lg p-6 gap-4',
    large: 'max-w-2xl p-7 gap-5',
    tv: 'max-w-3xl p-8 gap-6',
  },

  // Image Sizing
  image: {
    mobile: 'h-40',
    tablet: 'h-48',
    desktop: 'h-56',
    large: 'h-64',
    tv: 'h-80',
  },
  hero: {
    mobile: 'h-48',
    tablet: 'h-64',
    desktop: 'h-96',
    large: 'h-[28rem]',
    tv: 'h-[32rem]',
  },
  thumbnail: {
    mobile: 'h-24',
    tablet: 'h-28',
    desktop: 'h-32',
    large: 'h-40',
    tv: 'h-48',
  },

  // Spacing
  padding: {
    mobile: 'p-4',
    tablet: 'p-6',
    desktop: 'p-8',
    large: 'p-10',
    tv: 'p-12',
  },
  margin: {
    mobile: 'my-4',
    tablet: 'my-6',
    desktop: 'my-8',
    large: 'my-10',
    tv: 'my-12',
  },
  gap: {
    mobile: 'gap-3',
    tablet: 'gap-4',
    desktop: 'gap-5',
    large: 'gap-6',
    tv: 'gap-8',
  },
  section: {
    mobile: 'py-8 px-4',
    tablet: 'py-12 px-6',
    desktop: 'py-16 px-8',
    large: 'py-20 px-10',
    tv: 'py-24 px-12',
  },

  // Layout
  container: {
    mobile: 'max-w-full px-4',
    tablet: 'max-w-2xl mx-auto px-6',
    desktop: 'max-w-6xl mx-auto px-8',
    large: 'max-w-7xl mx-auto px-10',
    tv: 'max-w-screen-2xl mx-auto px-12',
  },
  grid: {
    mobile: 'grid-cols-1 gap-3',
    tablet: 'grid-cols-2 gap-4',
    desktop: 'grid-cols-3 gap-5',
    large: 'grid-cols-4 gap-6',
    tv: 'grid-cols-5 gap-8',
  },

  // Breakpoints (in pixels)
  breakpoints: {
    mobile: 0,
    tablet: 640,
    desktop: 1024,
    large: 1536,
    tv: 2560,
  },
};

/**
 * Get screen size from viewport width
 */
export function getScreenSize(width: number): ScreenSize {
  if (width >= 2560) return 'tv';
  if (width >= 1536) return 'large';
  if (width >= 1024) return 'desktop';
  if (width >= 640) return 'tablet';
  return 'mobile';
}

/**
 * Helper to get responsive value based on screen size
 */
export function getResponsiveValue(
  config: Record<ScreenSize, string>,
  screenSize: ScreenSize
): string {
  return config[screenSize] || config.mobile;
}

/**
 * Get all responsive classes for a component
 */
export function getResponsiveClasses(
  componentKey: keyof ResponsiveConfig,
  screenSize: ScreenSize
): string {
  const config = responsiveConfig[componentKey] as Record<ScreenSize, string>;
  return config[screenSize] || config.mobile;
}

/**
 * Tailwind media queries for responsive design
 */
export const tailwindResponsivePrefixes = {
  mobile: '',
  tablet: 'sm:', // 640px
  desktop: 'lg:', // 1024px
  large: 'xl:', // 1280px
  tv: '2xl:', // 1536px
};

/**
 * Helper to build responsive tailwind classes
 */
export function buildResponsiveClass(baseClass: string): string {
  return `${baseClass} sm:${baseClass} lg:${baseClass} xl:${baseClass} 2xl:${baseClass}`;
}

/**
 * Get card grid based on screen size
 */
export function getGridCols(screenSize: ScreenSize): number {
  const gridMap = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4,
    tv: 5,
  };
  return gridMap[screenSize];
}

/**
 * Get safe area padding for mobile/tablet
 */
export function getSafeAreaPadding(screenSize: ScreenSize): string {
  const paddingMap = {
    mobile: 'pb-safe-bottom pt-safe-top',
    tablet: 'pb-4 pt-safe-top',
    desktop: 'pb-0 pt-0',
    large: 'pb-0 pt-0',
    tv: 'pb-0 pt-0',
  };
  return paddingMap[screenSize];
}

/**
 * Responsive font size helper
 */
export const responsiveFontSizes = {
  xs: {
    mobile: '11px',
    tablet: '12px',
    desktop: '12px',
    large: '14px',
    tv: '16px',
  },
  sm: {
    mobile: '13px',
    tablet: '14px',
    desktop: '14px',
    large: '16px',
    tv: '18px',
  },
  base: {
    mobile: '15px',
    tablet: '16px',
    desktop: '16px',
    large: '18px',
    tv: '20px',
  },
  lg: {
    mobile: '17px',
    tablet: '18px',
    desktop: '18px',
    large: '20px',
    tv: '24px',
  },
  xl: {
    mobile: '20px',
    tablet: '22px',
    desktop: '24px',
    large: '28px',
    tv: '32px',
  },
  '2xl': {
    mobile: '24px',
    tablet: '26px',
    desktop: '28px',
    large: '32px',
    tv: '40px',
  },
};

// Export for backwards compatibility
export const responsive = { ...responsiveConfig };
