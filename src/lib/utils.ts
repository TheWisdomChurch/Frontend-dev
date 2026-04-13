/**
 * Utility Consolidation Index
 * Re-exports all utility functions for easy access
 */

// Styling utilities
export { cn } from './cn';

// API utilities
export { apiClient } from './api';
export type { EventPublic, ReelPublic } from './apiTypes';

// Data utilities
export * from './data';

// YouTube utilities
export * from './youtube';

// Responsive utilities
export * from './responsive';
export * from './modal-responsive';

// Safe motion utilities
export { motion, AnimatePresence } from './safe-motion';

// Analytics
export * from './analytics';

// Types
export type * from './types';
