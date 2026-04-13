/**
 * Analytics Types and Interfaces
 * Professional analytics tracking for user engagement and behavior
 */

// Consent Categories
export type ConsentCategory =
  | 'necessary'
  | 'analytics'
  | 'marketing'
  | 'personalization';

export interface ConsentPreferences {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  timestamp: number;
  version: number; // Policy version
}

// Event Types
export type EventType =
  | 'page_view'
  | 'click'
  | 'scroll'
  | 'form_submission'
  | 'form_interaction'
  | 'component_view'
  | 'component_interaction'
  | 'video_play'
  | 'video_pause'
  | 'video_complete'
  | 'link_click'
  | 'cta_click'
  | 'search'
  | 'error'
  | 'custom';

// Event Interface
export interface AnalyticsEvent {
  eventType: EventType;
  eventName: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  pageTitle?: string;
  pageUrl: string;
  referrer?: string;
  deviceInfo: {
    userAgent: string;
    viewport: { width: number; height: number };
    screenResolution: { width: number; height: number };
    platform: string;
    language: string;
  };
  eventData?: Record<string, any>;
  engagement?: {
    timeOnPage?: number;
    scrollDepth?: number;
    interactionCount?: number;
  };
}

// User Profile
export interface UserProfile {
  userId: string;
  sessionId: string;
  firstVisit: number;
  lastVisit: number;
  visitCount: number;
  totalEngagementTime: number;
  preferences: ConsentPreferences;
  segments?: string[];
  customProperties?: Record<string, any>;
}

// Engagement Metrics
export interface EngagementMetrics {
  timeOnPage: number;
  scrollDepth: number; // 0-100 percentage
  interactionCount: number;
  clickCount: number;
  formInteractions: number;
  videoViews: number;
  videoPlayback: number; // seconds
}

// Page View Data
export interface PageViewData {
  pageTitle: string;
  pageUrl: string;
  referrer: string;
  timestamp: number;
  sessionDuration: number; // milliseconds
  engagementMetrics: EngagementMetrics;
}

// Analytics Config
export interface AnalyticsConfig {
  enabled: boolean;
  trackingId?: string;
  apiEndpoint: string;
  batchSize: number; // Number of events before sending batch
  batchTimeout: number; // Milliseconds
  sessionTimeout: number; // Milliseconds for session expiry
  cookieDomain?: string;
  cookiePath: string;
  secureCookie: boolean;
  sameSiteCookie: 'Strict' | 'Lax' | 'None';
  enableAutoTracking: boolean;
  enableErrorTracking: boolean;
  enablePerformanceTracking: boolean;
  customProperties?: Record<string, any>;
}

// Tracking Context
export interface TrackingContext {
  sessionId: string;
  userId: string;
  consentGiven: boolean;
  consentCategories: ConsentPreferences;
  pageStartTime: number;
  lastActivityTime: number;
}

// User Journey
export interface UserJourney {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  events: AnalyticsEvent[];
  pageViews: PageViewData[];
  totalEngagementTime: number;
  conversionGoals?: string[];
}
