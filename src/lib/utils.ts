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

// Responsive utilities
export * from './responsive';

// Safe motion utilities
export { motion, AnimatePresence } from './safe-motion';

// Types
export type * from './types';
