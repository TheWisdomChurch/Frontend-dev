/**
 * API Services Index
 * Central export point for all backend API services
 * Provides type-safe interfaces and singleton instances
 */

export {
  apiClient,
  type ApiResponse,
  type PaginatedResponse,
} from './apiClient';
export {
  eventRegistrationService,
  type EventRegistrationResponse,
} from './eventRegistrationService';
export { eventsService, type Event } from './eventsService';
export {
  givingService,
  type DonationData,
  type DonationResponse,
} from './givingService';

// Re-export for convenience
export * from './apiClient';
export * from './eventRegistrationService';
export * from './eventsService';
export * from './givingService';
