/**
 * lib/modalResponsive.ts
 * Professional modal responsive configuration.
 */

import type React from 'react';
import type { ScreenSize } from '@/lib/responsive';

export type ModalSize = 'compact' | 'default' | 'large' | 'fullscreen';
export type ModalOrientation = 'portrait' | 'landscape';
export type BottomSheetThreshold = ScreenSize | 'none';

export interface ModalResponsiveConfig {
  maxWidth: string;
  maxHeight: string;
  padding: string;
  borderRadius: string;
  bottomSheetThreshold: BottomSheetThreshold;
}

const modalConfigs = {
  mobile: {
    maxWidth: 'max-w-[calc(100vw-1rem)]',
    maxHeight: 'max-h-[90dvh]',
    padding: 'p-4',
    borderRadius: 'rounded-t-3xl sm:rounded-3xl',
    bottomSheetThreshold: 'mobile',
  },
  tablet: {
    maxWidth: 'max-w-2xl',
    maxHeight: 'max-h-[88dvh]',
    padding: 'p-6',
    borderRadius: 'rounded-3xl',
    bottomSheetThreshold: 'tablet',
  },
  desktop: {
    maxWidth: 'max-w-3xl',
    maxHeight: 'max-h-[86dvh]',
    padding: 'p-7',
    borderRadius: 'rounded-3xl',
    bottomSheetThreshold: 'none',
  },
  large: {
    maxWidth: 'max-w-4xl',
    maxHeight: 'max-h-[86dvh]',
    padding: 'p-8',
    borderRadius: 'rounded-[2rem]',
    bottomSheetThreshold: 'none',
  },
  tv: {
    maxWidth: 'max-w-5xl',
    maxHeight: 'max-h-[82dvh]',
    padding: 'p-10',
    borderRadius: 'rounded-[2.25rem]',
    bottomSheetThreshold: 'none',
  },
} as const satisfies Record<ScreenSize, ModalResponsiveConfig>;

const sizeOverrides = {
  compact: {
    mobile: {
      maxWidth: 'max-w-[calc(100vw-1rem)]',
      maxHeight: 'max-h-[72dvh]',
      padding: 'p-4',
    },
    tablet: {
      maxWidth: 'max-w-md',
      maxHeight: 'max-h-[76dvh]',
      padding: 'p-5',
    },
    desktop: {
      maxWidth: 'max-w-lg',
      maxHeight: 'max-h-[76dvh]',
      padding: 'p-6',
    },
    large: {
      maxWidth: 'max-w-xl',
      maxHeight: 'max-h-[76dvh]',
      padding: 'p-7',
    },
    tv: {
      maxWidth: 'max-w-2xl',
      maxHeight: 'max-h-[74dvh]',
      padding: 'p-8',
    },
  },

  default: {},

  large: {
    mobile: {
      maxWidth: 'max-w-[calc(100vw-1rem)]',
      maxHeight: 'max-h-[92dvh]',
      padding: 'p-4',
    },
    tablet: {
      maxWidth: 'max-w-3xl',
      maxHeight: 'max-h-[90dvh]',
      padding: 'p-6',
    },
    desktop: {
      maxWidth: 'max-w-4xl',
      maxHeight: 'max-h-[88dvh]',
      padding: 'p-7',
    },
    large: {
      maxWidth: 'max-w-5xl',
      maxHeight: 'max-h-[88dvh]',
      padding: 'p-8',
    },
    tv: {
      maxWidth: 'max-w-6xl',
      maxHeight: 'max-h-[86dvh]',
      padding: 'p-10',
    },
  },

  fullscreen: {
    mobile: {
      maxWidth: 'max-w-full',
      maxHeight: 'h-[100dvh]',
      padding: 'p-4',
      borderRadius: 'rounded-none',
      bottomSheetThreshold: 'none',
    },
    tablet: {
      maxWidth: 'max-w-full',
      maxHeight: 'h-[100dvh]',
      padding: 'p-6',
      borderRadius: 'rounded-none',
      bottomSheetThreshold: 'none',
    },
    desktop: {
      maxWidth: 'max-w-full',
      maxHeight: 'h-[100dvh]',
      padding: 'p-8',
      borderRadius: 'rounded-none',
      bottomSheetThreshold: 'none',
    },
    large: {
      maxWidth: 'max-w-full',
      maxHeight: 'h-[100dvh]',
      padding: 'p-10',
      borderRadius: 'rounded-none',
      bottomSheetThreshold: 'none',
    },
    tv: {
      maxWidth: 'max-w-full',
      maxHeight: 'h-[100dvh]',
      padding: 'p-12',
      borderRadius: 'rounded-none',
      bottomSheetThreshold: 'none',
    },
  },
} as const satisfies Record<
  ModalSize,
  Partial<Record<ScreenSize, Partial<ModalResponsiveConfig>>>
>;

const maxWidthToCss: Record<string, string> = {
  'max-w-xs': '20rem',
  'max-w-sm': '24rem',
  'max-w-md': '28rem',
  'max-w-lg': '32rem',
  'max-w-xl': '36rem',
  'max-w-2xl': '42rem',
  'max-w-3xl': '48rem',
  'max-w-4xl': '56rem',
  'max-w-5xl': '64rem',
  'max-w-6xl': '72rem',
  'max-w-full': '100%',
  'max-w-[calc(100vw-1rem)]': 'calc(100vw - 1rem)',
};

const maxHeightToCss: Record<string, string> = {
  'max-h-[72dvh]': '72dvh',
  'max-h-[74dvh]': '74dvh',
  'max-h-[76dvh]': '76dvh',
  'max-h-[82dvh]': '82dvh',
  'max-h-[86dvh]': '86dvh',
  'max-h-[88dvh]': '88dvh',
  'max-h-[90dvh]': '90dvh',
  'max-h-[92dvh]': '92dvh',
  'h-[100dvh]': '100dvh',
};

export function getModalConfig(screenSize: ScreenSize): ModalResponsiveConfig {
  return modalConfigs[screenSize] ?? modalConfigs.mobile;
}

export function getModalSizeByType(
  type: ModalSize,
  screenSize: ScreenSize
): ModalResponsiveConfig {
  const baseConfig = getModalConfig(screenSize);

  const overrideMap = sizeOverrides[type] as Partial<
    Record<ScreenSize, Partial<ModalResponsiveConfig>>
  >;

  const override = overrideMap[screenSize] ?? {};

  return {
    ...baseConfig,
    ...override,
  };
}

export function getModalClassNames(
  screenSize: ScreenSize,
  type: ModalSize = 'default',
  extra?: string
): string {
  const config = getModalSizeByType(type, screenSize);

  return [
    config.maxWidth,
    config.maxHeight,
    config.padding,
    config.borderRadius,
    'w-full overflow-hidden',
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}

export function getModalStylesBySize(
  screenSize: ScreenSize,
  type: ModalSize = 'default'
): React.CSSProperties {
  const config = getModalSizeByType(type, screenSize);

  return {
    maxWidth: maxWidthToCss[config.maxWidth] ?? '42rem',
    maxHeight: maxHeightToCss[config.maxHeight] ?? '86dvh',
  };
}

export function getModalOrientationConfig(
  orientation: ModalOrientation,
  screenSize: ScreenSize
): Partial<ModalResponsiveConfig> {
  if (orientation === 'landscape' && screenSize === 'mobile') {
    return {
      maxHeight: 'max-h-[76dvh]',
      padding: 'p-3',
      borderRadius: 'rounded-2xl',
    };
  }

  return {};
}

export function shouldUseBottomSheet({
  screenSize,
  isTouchDevice,
  forceBottomSheet = false,
  disabled = false,
}: {
  screenSize: ScreenSize;
  isTouchDevice: boolean;
  forceBottomSheet?: boolean;
  disabled?: boolean;
}): boolean {
  if (disabled) return false;
  if (forceBottomSheet) return true;
  if (!isTouchDevice) return false;

  return screenSize === 'mobile';
}

export function getSafeAreaInsets(): {
  top: string;
  bottom: string;
  left: string;
  right: string;
} {
  return {
    top: 'max(env(safe-area-inset-top), 0px)',
    bottom: 'max(env(safe-area-inset-bottom), 0px)',
    left: 'max(env(safe-area-inset-left), 0px)',
    right: 'max(env(safe-area-inset-right), 0px)',
  };
}

export function getModalSafeAreaStyle(): React.CSSProperties {
  const safeArea = getSafeAreaInsets();

  return {
    paddingTop: safeArea.top,
    paddingBottom: safeArea.bottom,
    paddingLeft: safeArea.left,
    paddingRight: safeArea.right,
  };
}

export function isFullscreenModal(type: ModalSize): boolean {
  return type === 'fullscreen';
}

export function isCompactModal(type: ModalSize): boolean {
  return type === 'compact';
}
