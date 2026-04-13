/**
 * Modal Responsive Configuration
 * Optimized modal sizing and behavior for all screen sizes
 */

import type { ScreenSize } from '@/lib/responsive';

export interface ModalResponsiveConfig {
  maxWidth: string;
  maxHeight: string;
  padding: string;
  borderRadius: string;
  bottomSheetThreshold: ScreenSize;
}

/**
 * Get responsive modal configuration based on screen size
 */
export const getModalConfig = (
  screenSize: ScreenSize
): ModalResponsiveConfig => {
  const configs: Record<ScreenSize, ModalResponsiveConfig> = {
    mobile: {
      maxWidth: 'max-w-sm',
      maxHeight: 'max-h-[90vh]',
      padding: 'p-4',
      borderRadius: 'rounded-t-3xl',
      bottomSheetThreshold: 'mobile',
    },
    tablet: {
      maxWidth: 'max-w-2xl',
      maxHeight: 'max-h-[85vh]',
      padding: 'p-6',
      borderRadius: 'rounded-2xl',
      bottomSheetThreshold: 'tablet',
    },
    desktop: {
      maxWidth: 'max-w-3xl',
      maxHeight: 'max-h-[80vh]',
      padding: 'p-8',
      borderRadius: 'rounded-2xl',
      bottomSheetThreshold: 'none' as any,
    },
    large: {
      maxWidth: 'max-w-4xl',
      maxHeight: 'max-h-[85vh]',
      padding: 'p-10',
      borderRadius: 'rounded-3xl',
      bottomSheetThreshold: 'none' as any,
    },
    tv: {
      maxWidth: 'max-w-5xl',
      maxHeight: 'max-h-[80vh]',
      padding: 'p-12',
      borderRadius: 'rounded-3xl',
      bottomSheetThreshold: 'none' as any,
    },
  };

  return configs[screenSize] || configs.mobile;
};

/**
 * Modal sizing based on content type
 */
export const getModalSizeByType = (
  type: 'compact' | 'default' | 'large' | 'fullscreen',
  screenSize: ScreenSize
): ModalResponsiveConfig => {
  const baseConfig = getModalConfig(screenSize);

  const adjustments: Record<
    'compact' | 'default' | 'large' | 'fullscreen',
    Partial<ModalResponsiveConfig>
  > = {
    compact: {
      maxWidth: screenSize === 'mobile' ? 'max-w-xs' : 'max-w-sm',
      maxHeight: 'max-h-[70vh]',
    },
    default: baseConfig,
    large: {
      maxWidth:
        screenSize === 'mobile'
          ? 'max-w-sm'
          : screenSize === 'tablet'
            ? 'max-w-3xl'
            : 'max-w-4xl',
      maxHeight: 'max-h-[90vh]',
    },
    fullscreen: {
      maxWidth:
        screenSize === 'mobile'
          ? 'max-w-full'
          : screenSize === 'tablet'
            ? 'max-w-5xl'
            : 'max-w-full',
      maxHeight: '100vh',
      padding:
        screenSize === 'mobile'
          ? 'p-4'
          : screenSize === 'tablet'
            ? 'p-6'
            : 'p-8',
    },
  };

  return {
    ...baseConfig,
    ...adjustments[type],
  };
};

/**
 * Get modal styles as CSS object
 */
export const getModalStylesBySize = (
  screenSize: ScreenSize,
  type: 'compact' | 'default' | 'large' | 'fullscreen' = 'default'
): React.CSSProperties => {
  const config = getModalSizeByType(type, screenSize);

  // Parse max-width and max-height to pixel values for inline styles
  const maxWidthMap: Record<string, string> = {
    'max-w-xs': '320px',
    'max-w-sm': '384px',
    'max-w-md': '448px',
    'max-w-lg': '512px',
    'max-w-2xl': '672px',
    'max-w-3xl': '768px',
    'max-w-4xl': '896px',
    'max-w-5xl': '1024px',
    'max-w-full': '100%',
  };

  const maxHeightMap: Record<string, string> = {
    'max-h-[70vh]': '70vh',
    'max-h-[80vh]': '80vh',
    'max-h-[85vh]': '85vh',
    'max-h-[90vh]': '90vh',
    '100vh': '100vh',
  };

  return {
    maxWidth: maxWidthMap[config.maxWidth] || '512px',
    maxHeight: maxHeightMap[config.maxHeight] || '85vh',
  };
};

/**
 * Adjust modal behavior based on screen orientation
 */
export const getModalOrientationStyles = (
  orientation: 'portrait' | 'landscape',
  screenSize: ScreenSize
): Partial<ModalResponsiveConfig> => {
  if (orientation === 'landscape' && screenSize === 'mobile') {
    return {
      maxHeight: 'max-h-[80vh]',
      padding: 'p-3',
    };
  }

  return {};
};

/**
 * Check if modal should use bottom sheet based on screen size and device
 */
export const shouldUseBottomSheet = (
  screenSize: ScreenSize,
  isTouchDevice: boolean,
  forceBottomSheet?: boolean
): boolean => {
  if (forceBottomSheet) return true;
  if (!isTouchDevice) return false;

  return screenSize === 'mobile' || screenSize === 'tablet';
};

/**
 * Get safe area insets for modals (for notched devices)
 */
export const getSafeAreaInsets = (): {
  top: string;
  bottom: string;
  left: string;
  right: string;
} => {
  if (typeof window === 'undefined') {
    return { top: '0', bottom: '0', left: '0', right: '0' };
  }

  return {
    top: 'max(env(safe-area-inset-top), 0px)',
    bottom: 'max(env(safe-area-inset-bottom), 0px)',
    left: 'max(env(safe-area-inset-left), 0px)',
    right: 'max(env(safe-area-inset-right), 0px)',
  };
};
