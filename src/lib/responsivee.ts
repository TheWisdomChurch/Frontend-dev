// lib/responsive.ts

// Base responsive configuration
export const responsive = {
  // Text Sizes
  heading: {
    mobile: 'text-lg',
    tablet: 'text-xl',
    desktop: 'text-2xl'
  },
  body: {
    mobile: 'text-xs',
    tablet: 'text-sm',
    desktop: 'text-base'
  },
  price: {
    mobile: 'text-lg',
    tablet: 'text-xl',
    desktop: 'text-2xl'
  },
  
  // Components
  button: {
    mobile: 'py-2.5 text-sm',
    tablet: 'py-3 text-base',
    desktop: 'py-3.5 text-base'
  },
  modal: {
    mobile: 'max-h-[85vh] rounded-t-2xl rounded-b-none',
    tablet: 'max-h-[90vh] max-w-lg rounded-2xl',
    desktop: 'max-h-[90vh] max-w-xl rounded-2xl'
  },
  image: {
    mobile: 'h-56',
    tablet: 'h-64',
    desktop: 'h-72'
  },
  
  // Spacing
  padding: {
    mobile: 'p-4',
    tablet: 'p-6',
    desktop: 'p-8'
  },
  gap: {
    mobile: 'gap-3',
    tablet: 'gap-4',
    desktop: 'gap-5'
  },
  
  // Hero Section Specific Styles
  hero: {
    title: {
      base: 'text-2xl',
      xs: 'xs:text-3xl',
      sm: 'sm:text-4xl',
      md: 'md:text-5xl',
      lg: 'lg:text-6xl',
      xl: 'xl:text-7xl'
    },
    subtitle: {
      base: 'text-sm',
      xs: 'xs:text-base',
      sm: 'sm:text-lg',
      md: 'md:text-xl',
      lg: 'lg:text-2xl',
      xl: 'xl:text-3xl'
    },
    description: {
      base: 'text-xs',
      xs: 'xs:text-sm',
      sm: 'sm:text-base',
      md: 'md:text-lg',
      lg: 'lg:text-xl',
      xl: 'xl:text-2xl'
    },
    button: {
      base: 'text-xs px-4 py-2.5',
      xs: 'xs:text-sm xs:px-5 xs:py-3',
      sm: 'sm:text-base sm:px-6 sm:py-3.5',
      md: 'md:text-lg md:px-7 md:py-4'
    },
    container: {
      base: 'px-3',
      xs: 'xs:px-4',
      sm: 'sm:px-5',
      md: 'md:px-6',
      lg: 'lg:px-8'
    },
    spacing: {
      titleBottom: 'mb-2',
      subtitleBottom: 'mb-3',
      descriptionBottom: 'mb-4',
      buttonsGap: 'gap-2'
    }
  }
} as const;

// Types
export type ViewportSize = 'mobile' | 'tablet' | 'desktop';
export type ResponsiveConfig = typeof responsive;
export type ResponsiveKey = keyof ResponsiveConfig;

// Define the shape of responsive values
type ResponsiveRecord = Record<ViewportSize, string>;

// Type guard to check if a value is a ResponsiveRecord
function isResponsiveRecord(value: unknown): value is ResponsiveRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    'mobile' in value &&
    'tablet' in value &&
    'desktop' in value
  );
}

// Helper function to get responsive value based on viewport
export function getResponsiveValue<T extends ResponsiveKey>(
  key: T,
  viewport: ViewportSize
): string {
  const value = responsive[key];
  
  if (isResponsiveRecord(value)) {
    return value[viewport];
  }
  
  // For hero values which have a different structure
  return JSON.stringify(value);
}

// Helper function to get hero responsive value
export function getHeroResponsiveValue<T extends keyof typeof responsive['hero']>(
  key: T,
  viewport?: ViewportSize
): string | Record<string, string> {
  const value = responsive.hero[key];
  
  // If it's a string (like spacing values), return as is
  if (typeof value === 'string') {
    return value;
  }
  
  // If it's an object and we have a viewport, try to get that specific value
  if (viewport && typeof value === 'object' && value !== null) {
    const viewportValue = (value as Record<string, string>)[viewport];
    if (viewportValue) {
      return viewportValue;
    }
  }
  
  // Otherwise return the entire object
  return value as Record<string, string>;
}

// Get all hero styles as a complete object
export function getHeroResponsiveStyles() {
  return responsive.hero;
}

// Breakpoints configuration
export const breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Type-safe responsive configuration
export type ResponsiveConfigType = {
  [K in ResponsiveKey]: K extends 'hero' 
    ? typeof responsive['hero']
    : ResponsiveRecord;
};