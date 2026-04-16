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
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDimensions({ width, height });
      setOrientation(height > width ? 'portrait' : 'landscape');
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const screenSize = useMemo<ScreenSize>(() => {
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
          'msMaxTouchPoints' in navigator),
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

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }

    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
}

export function useTouchDevice(): boolean {
  const { isTouchDevice } = useResponsive();
  return isTouchDevice;
}
