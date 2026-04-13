/**
 * Lib Directory Index
 * Central export point for all utilities, constants, and helpers
 */

// ============================================
// Core Utilities
// ============================================
export { cn } from './cn';

// ============================================
// Theme & Colors
// ============================================
export * from './theme';

// ============================================
// ============================================
// API & Data
// ============================================
export { default, apiClient } from './api';
export type {
  FormFieldType,
  PublicFormField,
  PublicFormPayload,
  PublicFormSubmissionRequest,
  EventPublic,
  ReelPublic,
  Testimonial as ApiTestimonial,
  CreateTestimonialRequest,
  SubscriberPayload,
  NotificationPayload,
} from './apiTypes';
export * from './data';

// ============================================
// Hooks & Motion
// ============================================
export { motion, AnimatePresence } from './safe-motion';
export * from './responsive';
export * from './modal-responsive';

// ============================================
// Media & Content
// ============================================
export * from './youtube';

// ============================================
// Analytics
// ============================================
export * from './analytics';

// ============================================
// Types
// ============================================
export type * from './types';
