'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  getScreenSize,
  getResponsiveValue,
  getResponsiveClasses,
  type ScreenSize,
  responsiveConfig,
} from '@/lib/responsive';

export interface UseResponsiveReturn {
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  isTV: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  isPortrait: boolean;
  isLandscape: boolean;
  isTouchDevice: boolean;
  getClasses: (key: keyof typeof responsiveConfig) => string;
  getValue: (config: Record<ScreenSize, string>) => string;
}

// ---------------------------------------------------------------------------
// useIsClient — the SSR-hydration-safe replacement for the classic
// `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])`
// pattern. useSyncExternalStore lets the server and first client render
// legitimately differ (server: false, client: true) without ever calling
// setState inside an effect.
// ---------------------------------------------------------------------------

function subscribeNever() {
  return () => {};
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    getClientSnapshot,
    getServerSnapshot
  );
}

// ---------------------------------------------------------------------------
// Viewport dimensions — shared external store keyed off window resize.
// ---------------------------------------------------------------------------

const SERVER_DIMENSIONS = { width: 0, height: 0 };
let cachedDimensions = SERVER_DIMENSIONS;

function subscribeToViewport(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('resize', callback);
  window.addEventListener('orientationchange', callback);
  return () => {
    window.removeEventListener('resize', callback);
    window.removeEventListener('orientationchange', callback);
  };
}

function getViewportSnapshot() {
  if (typeof window === 'undefined') return SERVER_DIMENSIONS;

  const width = window.innerWidth;
  const height = window.innerHeight;

  if (cachedDimensions.width !== width || cachedDimensions.height !== height) {
    cachedDimensions = { width, height };
  }

  return cachedDimensions;
}

function getViewportServerSnapshot() {
  return SERVER_DIMENSIONS;
}

export function useResponsive(): UseResponsiveReturn {
  const dimensions = useSyncExternalStore(
    subscribeToViewport,
    getViewportSnapshot,
    getViewportServerSnapshot
  );
  const mounted = dimensions !== SERVER_DIMENSIONS;

  const orientation: 'portrait' | 'landscape' =
    dimensions.height > dimensions.width ? 'portrait' : 'landscape';

  const screenSize = useMemo<ScreenSize>(
    () => getScreenSize(dimensions.width),
    [dimensions.width]
  );

  const screenChecks = useMemo(
    () => ({
      isMobile: screenSize === 'mobile',
      isTablet: screenSize === 'tablet',
      isDesktop: screenSize === 'desktop',
      isLarge: screenSize === 'large',
      isTV: screenSize === 'tv',
    }),
    [screenSize]
  );

  const deviceChecks = useMemo(() => {
    if (!mounted) return { isTouchDevice: false };

    return {
      isTouchDevice:
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        'msMaxTouchPoints' in navigator,
    };
  }, [mounted]);

  const getClasses = useCallback(
    (key: keyof typeof responsiveConfig): string => {
      return getResponsiveClasses(key, screenSize);
    },
    [screenSize]
  );

  const getValue = useCallback(
    (config: Record<ScreenSize, string>): string => {
      return getResponsiveValue(config, screenSize);
    },
    [screenSize]
  );

  return {
    screenSize,
    ...screenChecks,
    width: dimensions.width,
    height: dimensions.height,
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    ...deviceChecks,
    getClasses,
    getValue,
  };
}

export function useIsAtLeast(size: ScreenSize): boolean {
  const { screenSize } = useResponsive();
  const sizes: ScreenSize[] = ['mobile', 'tablet', 'desktop', 'large', 'tv'];
  const sizeIndex = sizes.indexOf(size);
  const currentIndex = sizes.indexOf(screenSize);
  return currentIndex >= sizeIndex;
}

export function useIsAtMost(size: ScreenSize): boolean {
  const { screenSize } = useResponsive();
  const sizes: ScreenSize[] = ['mobile', 'tablet', 'desktop', 'large', 'tv'];
  const sizeIndex = sizes.indexOf(size);
  const currentIndex = sizes.indexOf(screenSize);
  return currentIndex <= sizeIndex;
}

export function useHideOnScreenSize(
  hideOn: ScreenSize | ScreenSize[]
): boolean {
  const { screenSize } = useResponsive();
  const hideOnArray = Array.isArray(hideOn) ? hideOn : [hideOn];
  return hideOnArray.includes(screenSize);
}

export function useShowOnScreenSize(
  showOn: ScreenSize | ScreenSize[]
): boolean {
  const { screenSize } = useResponsive();
  const showOnArray = Array.isArray(showOn) ? showOn : [showOn];
  return showOnArray.includes(screenSize);
}

// ---------------------------------------------------------------------------
// useMediaQuery — matchMedia as an external store, no effect/setState.
// ---------------------------------------------------------------------------

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined') return () => {};

      const mediaQuery = window.matchMedia(query);

      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', callback);
        return () => mediaQuery.removeEventListener('change', callback);
      }

      mediaQuery.addListener(callback);
      return () => mediaQuery.removeListener(callback);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () =>
      typeof window === 'undefined' ? false : window.matchMedia(query).matches,
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useTouchDevice(): boolean {
  const { isTouchDevice } = useResponsive();
  return isTouchDevice;
}
