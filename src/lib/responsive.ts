/**
 * lib/responsive.ts
 * Professional responsive design system for Wisdom House UI.
 */

export const screenOrder = [
  'mobile',
  'tablet',
  'desktop',
  'large',
  'tv',
] as const;

export type ScreenSize = (typeof screenOrder)[number];

export const breakpoints = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  large: 1536,
  tv: 2560,
} as const satisfies Record<ScreenSize, number>;

export type ResponsiveMap<T = string> = Readonly<Record<ScreenSize, T>>;

export type ResponsiveToken =
  | 'heading'
  | 'subheading'
  | 'body'
  | 'small'
  | 'caption'
  | 'button'
  | 'card'
  | 'modal'
  | 'form'
  | 'image'
  | 'hero'
  | 'thumbnail'
  | 'padding'
  | 'margin'
  | 'gap'
  | 'section'
  | 'container'
  | 'grid'
  | 'breakpoints';

export interface ResponsiveConfig {
  heading: ResponsiveMap;
  subheading: ResponsiveMap;
  body: ResponsiveMap;
  small: ResponsiveMap;
  caption: ResponsiveMap;
  button: ResponsiveMap;
  card: ResponsiveMap;
  modal: ResponsiveMap;
  form: ResponsiveMap;
  image: ResponsiveMap;
  hero: ResponsiveMap;
  thumbnail: ResponsiveMap;
  padding: ResponsiveMap;
  margin: ResponsiveMap;
  gap: ResponsiveMap;
  section: ResponsiveMap;
  container: ResponsiveMap;
  grid: ResponsiveMap;
  breakpoints: typeof breakpoints;
}

export const responsiveConfig = {
  heading: {
    mobile: 'text-2xl leading-tight tracking-tight',
    tablet: 'text-3xl leading-tight tracking-tight',
    desktop: 'text-4xl leading-tight tracking-tight',
    large: 'text-5xl leading-tight tracking-tight',
    tv: 'text-6xl leading-tight tracking-tight',
  },

  subheading: {
    mobile: 'text-lg leading-snug',
    tablet: 'text-xl leading-snug',
    desktop: 'text-2xl leading-snug',
    large: 'text-3xl leading-snug',
    tv: 'text-4xl leading-snug',
  },

  body: {
    mobile: 'text-sm leading-6',
    tablet: 'text-base leading-7',
    desktop: 'text-base leading-7',
    large: 'text-lg leading-8',
    tv: 'text-xl leading-9',
  },

  small: {
    mobile: 'text-xs leading-5',
    tablet: 'text-xs leading-5',
    desktop: 'text-sm leading-6',
    large: 'text-sm leading-6',
    tv: 'text-base leading-7',
  },

  caption: {
    mobile: 'text-[11px] leading-4 tracking-[0.18em]',
    tablet: 'text-xs leading-4 tracking-[0.18em]',
    desktop: 'text-xs leading-4 tracking-[0.2em]',
    large: 'text-sm leading-5 tracking-[0.2em]',
    tv: 'text-sm leading-5 tracking-[0.22em]',
  },

  button: {
    mobile: 'h-10 px-4 text-sm rounded-full',
    tablet: 'h-11 px-5 text-sm rounded-full',
    desktop: 'h-12 px-6 text-base rounded-full',
    large: 'h-13 px-7 text-lg rounded-full',
    tv: 'h-14 px-8 text-xl rounded-full',
  },

  card: {
    mobile: 'rounded-2xl p-4 gap-3',
    tablet: 'rounded-[1.25rem] p-5 gap-4',
    desktop: 'rounded-[1.5rem] p-6 gap-5',
    large: 'rounded-[1.75rem] p-7 gap-6',
    tv: 'rounded-[2rem] p-8 gap-7',
  },

  modal: {
    mobile: 'w-[calc(100vw-24px)] max-w-sm max-h-[88vh]',
    tablet: 'w-[calc(100vw-48px)] max-w-lg max-h-[88vh]',
    desktop: 'max-w-2xl max-h-[86vh]',
    large: 'max-w-3xl max-h-[86vh]',
    tv: 'max-w-5xl max-h-[82vh]',
  },

  form: {
    mobile: 'w-full p-4 gap-3',
    tablet: 'max-w-md p-5 gap-4',
    desktop: 'max-w-lg p-6 gap-4',
    large: 'max-w-2xl p-7 gap-5',
    tv: 'max-w-3xl p-8 gap-6',
  },

  image: {
    mobile: 'h-44',
    tablet: 'h-52',
    desktop: 'h-60',
    large: 'h-72',
    tv: 'h-96',
  },

  hero: {
    mobile: 'min-h-[78vh]',
    tablet: 'min-h-[82vh]',
    desktop: 'min-h-[92vh]',
    large: 'min-h-screen',
    tv: 'min-h-screen',
  },

  thumbnail: {
    mobile: 'h-24 w-24',
    tablet: 'h-28 w-28',
    desktop: 'h-32 w-32',
    large: 'h-40 w-40',
    tv: 'h-48 w-48',
  },

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
    mobile: 'py-10 px-4',
    tablet: 'py-14 px-6',
    desktop: 'py-18 px-8',
    large: 'py-22 px-10',
    tv: 'py-28 px-12',
  },

  container: {
    mobile: 'mx-auto w-full max-w-full px-4',
    tablet: 'mx-auto w-full max-w-3xl px-6',
    desktop: 'mx-auto w-full max-w-6xl px-8',
    large: 'mx-auto w-full max-w-7xl px-10',
    tv: 'mx-auto w-full max-w-[112rem] px-12',
  },

  grid: {
    mobile: 'grid grid-cols-1 gap-3',
    tablet: 'grid grid-cols-2 gap-4',
    desktop: 'grid grid-cols-3 gap-5',
    large: 'grid grid-cols-4 gap-6',
    tv: 'grid grid-cols-5 gap-8',
  },

  breakpoints,
} as const satisfies ResponsiveConfig;

export const responsive = responsiveConfig;

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
    tablet: '28px',
    desktop: '32px',
    large: '40px',
    tv: '48px',
  },
} as const satisfies Record<string, ResponsiveMap>;

export const surfaces = {
  appBackground:
    'bg-[#050505] text-white bg-[radial-gradient(circle_at_15%_15%,rgba(247,222,18,0.10),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.06),transparent_28%)]',

  panel:
    'rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl',

  card: 'rounded-[1.75rem] border border-white/10 bg-white/[0.055] shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl',

  cardInteractive:
    'rounded-[1.75rem] border border-white/10 bg-white/[0.055] shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.085]',

  input:
    'w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/20 focus:border-[#F7DE12]/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-[#F7DE12]/10',

  select:
    'w-full rounded-2xl border border-white/12 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[#F7DE12]/70 focus:ring-4 focus:ring-[#F7DE12]/10',

  goldPill:
    'inline-flex items-center gap-2 rounded-full border border-[#F7DE12]/25 bg-[#F7DE12]/10 px-3 py-1.5 text-[#F7DE12]',

  mutedPill:
    'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-white/65',
} as const;

export const tailwindResponsivePrefixes = {
  mobile: '',
  tablet: 'sm:',
  desktop: 'lg:',
  large: '2xl:',
  tv: 'min-[2560px]:',
} as const satisfies Record<ScreenSize, string>;

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}

export function getScreenSize(width: number): ScreenSize {
  if (width >= breakpoints.tv) return 'tv';
  if (width >= breakpoints.large) return 'large';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'mobile';
}

export function getResponsiveValue<T>(
  config: ResponsiveMap<T>,
  screenSize: ScreenSize
): T {
  return config[screenSize] ?? config.mobile;
}

export function getResponsiveClasses(
  componentKey: ResponsiveToken,
  screenSize: ScreenSize
): string {
  const config = responsiveConfig[componentKey];

  if (componentKey === 'breakpoints') return '';

  return getResponsiveValue(config as ResponsiveMap, screenSize);
}

export function getGridCols(screenSize: ScreenSize): number {
  const gridMap = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4,
    tv: 5,
  } satisfies Record<ScreenSize, number>;

  return gridMap[screenSize];
}

export function getSafeAreaPadding(screenSize: ScreenSize): string {
  const paddingMap = {
    mobile: 'pt-safe-top pb-safe-bottom',
    tablet: 'pt-safe-top pb-4',
    desktop: 'pt-0 pb-0',
    large: 'pt-0 pb-0',
    tv: 'pt-0 pb-0',
  } satisfies ResponsiveMap;

  return paddingMap[screenSize];
}

export function isAtLeastScreenSize(
  current: ScreenSize,
  target: ScreenSize
): boolean {
  return screenOrder.indexOf(current) >= screenOrder.indexOf(target);
}

export function getCurrentScreenSize(): ScreenSize {
  if (typeof window === 'undefined') return 'desktop';
  return getScreenSize(window.innerWidth);
}

export function buildResponsiveClass(config: Partial<ResponsiveMap>): string {
  return screenOrder
    .map(screen => {
      const value = config[screen];
      if (!value) return '';

      const prefix = tailwindResponsivePrefixes[screen];
      if (!prefix) return value;

      return value
        .split(/\s+/)
        .filter(Boolean)
        .map(className => `${prefix}${className}`)
        .join(' ');
    })
    .filter(Boolean)
    .join(' ');
}

export function buildResponsiveToken(token: ResponsiveToken): string {
  if (token === 'breakpoints') return '';

  return buildResponsiveClass(
    responsiveConfig[token] as Partial<ResponsiveMap>
  );
}

export function fluidClamp({
  min,
  preferred,
  max,
}: {
  min: string;
  preferred: string;
  max: string;
}): string {
  return `clamp(${min}, ${preferred}, ${max})`;
}

export const fluidType = {
  hero: fluidClamp({ min: '2.25rem', preferred: '6vw', max: '6rem' }),
  heading: fluidClamp({ min: '1.875rem', preferred: '4vw', max: '4.5rem' }),
  subheading: fluidClamp({ min: '1.25rem', preferred: '2.4vw', max: '2.5rem' }),
  body: fluidClamp({ min: '0.95rem', preferred: '1vw', max: '1.25rem' }),
} as const;

export type ResponsiveConfigType = typeof responsiveConfig;
export type ResponsiveSurface = keyof typeof surfaces;
