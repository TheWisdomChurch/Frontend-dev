// lib/responsive.ts

export const breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;
export type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export type ResponsiveRecord = Readonly<Record<ViewportSize, string>>;
export type BreakpointRecord = Partial<
  Readonly<Record<Breakpoint | 'base', string>>
>;

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export const responsive = {
  heading: {
    mobile: 'text-lg leading-tight',
    tablet: 'text-xl leading-tight',
    desktop: 'text-2xl leading-tight',
  },
  body: {
    mobile: 'text-xs leading-relaxed',
    tablet: 'text-sm leading-relaxed',
    desktop: 'text-base leading-relaxed',
  },
  price: {
    mobile: 'text-lg font-semibold',
    tablet: 'text-xl font-semibold',
    desktop: 'text-2xl font-semibold',
  },

  button: {
    mobile: 'px-4 py-2.5 text-sm',
    tablet: 'px-5 py-3 text-sm',
    desktop: 'px-6 py-3.5 text-base',
  },
  modal: {
    mobile: 'max-h-[85vh] w-[calc(100vw-24px)]',
    tablet: 'max-h-[90vh] max-w-2xl',
    desktop: 'max-h-[90vh] max-w-3xl',
  },
  image: {
    mobile: 'h-56',
    tablet: 'h-64',
    desktop: 'h-72',
  },

  padding: {
    mobile: 'p-4',
    tablet: 'p-6',
    desktop: 'p-8',
  },
  gap: {
    mobile: 'gap-3',
    tablet: 'gap-4',
    desktop: 'gap-5',
  },

  hero: {
    title: {
      base: 'text-[2.25rem] leading-[0.98] tracking-[-0.055em]',
      xs: 'xs:text-[2.65rem]',
      sm: 'sm:text-5xl',
      md: 'md:text-6xl',
      lg: 'lg:text-[4.8rem]',
      xl: 'xl:text-[5.8rem]',
    },
    subtitle: {
      base: 'text-sm leading-[1.45]',
      sm: 'sm:text-lg',
      md: 'md:text-xl',
      lg: 'lg:text-2xl',
    },
    description: {
      base: 'text-sm leading-7',
      sm: 'sm:text-base',
      md: 'md:text-[1.05rem]',
    },
    button: {
      base: 'px-5 py-3 text-sm',
      sm: 'sm:px-6 sm:py-3.5',
      md: 'md:text-base',
    },
    container: {
      base: 'px-4',
      sm: 'sm:px-6',
      lg: 'lg:px-12',
    },
    spacing: {
      sectionY: 'py-14 sm:py-18 lg:py-24',
      titleBottom: 'mb-4 sm:mb-5',
      subtitleBottom: 'mb-4',
      descriptionBottom: 'mb-6',
      buttonsGap: 'gap-3 sm:gap-4',
    },
  },

  layout: {
    section: {
      tight: 'py-10 sm:py-12 lg:py-14',
      default: 'py-14 sm:py-18 lg:py-20',
      relaxed: 'py-16 sm:py-20 lg:py-24',
      hero: 'min-h-[86vh] sm:min-h-[92vh] lg:min-h-screen',
    },
    container: {
      default: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
      narrow: 'mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8',
      wide: 'mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-10',
    },
    grid: {
      two: 'grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8',
      three: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
      feature: 'grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10',
    },
  },

  surface: {
    card: 'rounded-[1.75rem] border border-white/10 bg-white/[0.055] shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl',
    cardHover:
      'transition duration-300 hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.085]',
    panel:
      'rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl',
    input:
      'w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/20 focus:border-[#F7DE12]/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-[#F7DE12]/10',
    select:
      'w-full rounded-2xl border border-white/12 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[#F7DE12]/70 focus:ring-4 focus:ring-[#F7DE12]/10',
  },
} as const;

export type ResponsiveConfig = typeof responsive;
export type ResponsiveKey = keyof ResponsiveConfig;

function isResponsiveRecord(value: unknown): value is ResponsiveRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    'mobile' in value &&
    'tablet' in value &&
    'desktop' in value
  );
}

export function resolveViewport(width: number): ViewportSize {
  if (width >= breakpoints.lg) return 'desktop';
  if (width >= breakpoints.md) return 'tablet';
  return 'mobile';
}

export function getResponsiveValue<T extends ResponsiveKey>(
  key: T,
  viewport: ViewportSize
): string {
  const value = responsive[key];

  if (isResponsiveRecord(value)) {
    return value[viewport];
  }

  return '';
}

export function responsiveClass(record: BreakpointRecord): string {
  const parts: string[] = [];

  if (record.base) parts.push(record.base);

  (Object.keys(breakpoints) as Breakpoint[]).forEach(bp => {
    const value = record[bp];
    if (value) parts.push(`${bp}:${value}`);
  });

  return parts.join(' ');
}

export function mergeResponsive(
  ...classes: Array<string | false | null | undefined>
): string {
  return cx(...classes);
}

export function getHeroResponsiveValue<
  T extends keyof (typeof responsive)['hero'],
>(key: T): string {
  const value = responsive.hero[key];

  if (typeof value === 'string') return value;

  return Object.values(value).join(' ');
}

export function getHeroResponsiveStyles() {
  return responsive.hero;
}

export function getSurfaceClass(
  key: keyof typeof responsive.surface,
  extra?: string
): string {
  return cx(responsive.surface[key], extra);
}

export function getLayoutClass<
  T extends keyof typeof responsive.layout,
  K extends keyof (typeof responsive.layout)[T],
>(group: T, key: K, extra?: string): string {
  return cx(responsive.layout[group][key] as string, extra);
}

export function getViewportFromWindow(): ViewportSize {
  if (typeof window === 'undefined') return 'desktop';
  return resolveViewport(window.innerWidth);
}

export function isAtLeastBreakpoint(width: number, breakpoint: Breakpoint) {
  return width >= breakpoints[breakpoint];
}

export type ResponsiveConfigType = {
  [K in ResponsiveKey]: K extends 'hero'
    ? (typeof responsive)['hero']
    : K extends 'layout'
      ? (typeof responsive)['layout']
      : K extends 'surface'
        ? (typeof responsive)['surface']
        : ResponsiveRecord;
};
