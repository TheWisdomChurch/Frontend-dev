/**
 * Utility Consolidation Index
 * Re-exports all utility functions for easy access
 */

// Styling utilities
export { cn } from './cn';

// Validation
export { validateEmail, validatePhone, validateUrl } from './validation';

// API utilities
export { apiClient } from './api';
export type { EventPublic, ReelPublic } from './apiTypes';

// Data utilities
export * from './data';

// YouTube utilities
export { getYoutubeVideoData } from './youtube';

// Responsive utilities
export { useResponsive } from './responsivee';

// Safe motion utilities
export { SafeMotionDiv, SafeMotionSection } from './safe-motion';

// Analytics
export * from './analytics';

// Types
export type * from './types';
