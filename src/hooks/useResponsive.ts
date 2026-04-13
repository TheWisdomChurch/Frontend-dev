/**
 * Enhanced Responsive Hook
 * Provides screen size detection and responsive utilities
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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

/**
 * Enhanced responsive hook with screen detection
 */
export function useResponsive(): UseResponsiveReturn {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    // Initial call
    handleResize();

    // Add listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const screenSize = useMemo(() => {
    if (!mounted) return 'mobile';
    return getScreenSize(dimensions.width);
  }, [mounted, dimensions.width]);

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
        typeof window !== 'undefined' &&
        ('ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0),
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

/**
 * Hook to check if screen size is at least a certain size
 */
export function useIsAtLeast(size: ScreenSize): boolean {
  const { screenSize } = useResponsive();
  const sizes: ScreenSize[] = ['mobile', 'tablet', 'desktop', 'large', 'tv'];
  const sizeIndex = sizes.indexOf(size);
  const currentIndex = sizes.indexOf(screenSize);
  return currentIndex >= sizeIndex;
}

/**
 * Hook to check if screen size is at most a certain size
 */
export function useIsAtMost(size: ScreenSize): boolean {
  const { screenSize } = useResponsive();
  const sizes: ScreenSize[] = ['mobile', 'tablet', 'desktop', 'large', 'tv'];
  const sizeIndex = sizes.indexOf(size);
  const currentIndex = sizes.indexOf(screenSize);
  return currentIndex <= sizeIndex;
}

/**
 * Hook to conditionally render based on screen size
 */
export function useHideOnScreenSize(
  hideOn: ScreenSize | ScreenSize[]
): boolean {
  const { screenSize } = useResponsive();
  const hideOnArray = Array.isArray(hideOn) ? hideOn : [hideOn];
  return hideOnArray.includes(screenSize);
}

/**
 * Hook to show only on specific screen sizes
 */
export function useShowOnScreenSize(
  showOn: ScreenSize | ScreenSize[]
): boolean {
  const { screenSize } = useResponsive();
  const showOnArray = Array.isArray(showOn) ? showOn : [showOn];
  return showOnArray.includes(screenSize);
}

/**
 * Hook for media query matching
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Hook for touch device detection
 */
export function useTouchDevice(): boolean {
  const { isTouchDevice } = useResponsive();
  return isTouchDevice;
}
