/**
 * Professional Analytics Service v2
 * Enterprise-grade analytics with HTTP/Cookie-based architecture
 * Comprehensive event tracking and analysis
 */

import { CookieManager } from './CookieManager';
import { SessionManager, SessionData } from './SessionManager';
import {
  UserIdentificationService,
  UserProfile,
} from './UserIdentificationService';
import {
  EngagementMetricsTracker,
  EngagementMetrics,
} from './EngagementMetricsTracker';
import { EventFactory, AnalyticsEvent, EventProperties } from './EventFactory';
import { ConsentManager } from './ConsentManager';
import { resolveConfiguredApiOrigin } from '@/lib/apiOrigin';

export interface BatchPayload {
  events: AnalyticsEvent[];
  session: SessionData;
  userProfile: UserProfile;
  timestamp: number;
  batchId: string;
}

export interface AnalyticsConfig {
  apiEndpoint: string;
  batchSize: number;
  batchTimeout: number;
  enableAutoTracking: boolean;
  enableErrorTracking: boolean;
  enablePerformanceTracking: boolean;
  enableConversionTracking: boolean;
  enableUserIdentification: boolean;
  debug: boolean;
}

const API_BASE = resolveConfiguredApiOrigin();
const ANALYTICS_ENDPOINT = API_BASE
  ? `${API_BASE.replace(/\/+$/, '')}/api/v1/analytics/events`
  : '/api/v1/analytics/events';

const DEFAULT_CONFIG: AnalyticsConfig = {
  apiEndpoint: ANALYTICS_ENDPOINT,
  batchSize: 20,
  batchTimeout: 30000, // 30 seconds
  enableAutoTracking: true,
  enableErrorTracking: true,
  enablePerformanceTracking: true,
  enableConversionTracking: true,
  enableUserIdentification: true,
  debug: false,
};

export class AnalyticsServiceV2 {
  private static instance: AnalyticsServiceV2;
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private session: SessionData | null = null;
  private userProfile: UserProfile | null = null;

  private constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initialize();
  }

  /**
   * Get singleton instance
   */
  static getInstance(config?: Partial<AnalyticsConfig>): AnalyticsServiceV2 {
    if (!AnalyticsServiceV2.instance) {
      AnalyticsServiceV2.instance = new AnalyticsServiceV2(config);
    }
    return AnalyticsServiceV2.instance;
  }

  /**
   * Initialize analytics
   */
  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Check cookies are enabled
    if (!CookieManager.areCookiesEnabled()) {
      this.log('Cookies are disabled, analytics may not work properly');
      return;
    }

    // Initialize core services
    this.session = SessionManager.getOrCreateSession();
    this.userProfile = UserIdentificationService.getOrCreateUserProfile();

    // Setup auto-tracking
    if (this.config.enableAutoTracking) {
      this.setupAutoTracking();
    }

    // Setup error tracking
    if (this.config.enableErrorTracking) {
      this.setupErrorTracking();
    }

    // Setup engagement tracking
    EngagementMetricsTracker.initialize();

    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush());

    this.log('Analytics initialized');
  }

  /**
   * Setup automatic page view tracking
   */
  private setupAutoTracking(): void {
    // Track initial page view
    this.trackPageView();

    // Track page view on URL change (for SPA)
    window.addEventListener('popstate', () => this.trackPageView());
  }

  /**
   * Setup error tracking
   */
  private setupErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', event => {
      this.trackError(
        'JavaScript Error',
        event.message,
        event.filename + ':' + event.lineno + ':' + event.colno,
        {
          error_type: 'uncaught_error',
          source: 'error_event',
        }
      );
    });

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', event => {
      this.trackError('Promise Rejection', event.reason, undefined, {
        error_type: 'unhandled_promise_rejection',
        source: 'unhandledrejection_event',
      });
    });
  }

  /**
   * Track page view
   */
  trackPageView(pageTitle?: string, url?: string): void {
    if (!this.shouldTrack()) return;

    const title = pageTitle || document.title;
    const pageUrl = url || window.location.href;

    const event = this.createEvent(
      EventFactory.createPageViewEvent(title, pageUrl)
    );

    this.addToQueue(event);
    EngagementMetricsTracker.recordPageView(pageUrl);
  }

  /**
   * Track click event
   */
  trackClick(
    label: string,
    element?: HTMLElement,
    properties?: EventProperties
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      EventFactory.createClickEvent(label, element, properties)
    );

    this.addToQueue(event);
    EngagementMetricsTracker.recordFormInteraction();
  }

  /**
   * Track form submission
   */
  trackFormSubmission(
    formName: string,
    fields?: Record<string, any>,
    properties?: EventProperties
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      EventFactory.createFormSubmitEvent(formName, fields, properties)
    );

    this.addToQueue(event);
    EngagementMetricsTracker.recordFormInteraction();
  }

  /**
   * Track conversion
   */
  trackConversion(
    conversionType: string,
    value?: number,
    properties?: EventProperties
  ): void {
    if (!this.config.enableConversionTracking) return;
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      EventFactory.createConversionEvent(conversionType, value, properties)
    );

    this.addToQueue(event);
    EngagementMetricsTracker.recordConversion(value);
  }

  /**
   * Track error
   */
  trackError(
    errorType: string,
    message: string,
    stack?: string,
    properties?: EventProperties
  ): void {
    if (!this.config.enableErrorTracking) return;
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      EventFactory.createErrorEvent(errorType, message, stack, properties)
    );

    this.addToQueue(event);
  }

  /**
   * Track search
   */
  trackSearch(
    query: string,
    results?: number,
    properties?: EventProperties
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      EventFactory.createSearchEvent(query, results, properties)
    );

    this.addToQueue(event);
  }

  /**
   * Track purchase/transaction
   */
  trackPurchase(
    orderId: string,
    value: number,
    currency: string,
    items?: Array<{ name: string; quantity: number; price: number }>,
    properties?: EventProperties
  ): void {
    if (!this.config.enableConversionTracking) return;
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      EventFactory.createPurchaseEvent(
        orderId,
        value,
        currency,
        items,
        properties
      )
    );

    this.addToQueue(event);
    EngagementMetricsTracker.recordConversion(value);
  }

  /**
   * Track custom event
   */
  trackCustomEvent(eventName: string, properties?: EventProperties): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      EventFactory.createCustomEvent(eventName, properties)
    );

    this.addToQueue(event);
  }

  /**
   * Track video/media event
   */
  trackMediaEvent(
    action: 'play' | 'pause' | 'complete',
    mediaTitle: string,
    duration?: number,
    currentTime?: number,
    properties?: EventProperties
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      EventFactory.createMediaEvent(
        action,
        mediaTitle,
        duration,
        currentTime,
        properties
      )
    );

    this.addToQueue(event);
  }

  /**
   * Identify user
   */
  identifyUser(
    userId: string,
    attributes?: {
      email?: string;
      name?: string;
      segment?: string;
      customAttributes?: Record<string, any>;
    }
  ): void {
    if (!this.config.enableUserIdentification) return;

    this.userProfile = UserIdentificationService.identifyUser(
      userId,
      attributes
    );
    SessionManager.setUserInSession(userId, attributes);

    this.log(`User identified: ${userId}`);
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>): void {
    if (!this.config.enableUserIdentification) return;

    UserIdentificationService.updateUserProfile({
      customAttributes: {
        ...(this.userProfile?.customAttributes || {}),
        ...properties,
      },
    });
  }

  /**
   * Reset user
   */
  resetUser(): void {
    UserIdentificationService.resetUser();
    SessionManager.endSession();
    this.userProfile = null;
  }

  /**
   * Get engagement metrics
   */
  getEngagementMetrics(): EngagementMetrics {
    return EngagementMetricsTracker.getMetrics();
  }

  /**
   * Create event with context
   */
  private createEvent(eventData: any): AnalyticsEvent {
    return {
      id: this.generateEventId(),
      timestamp: Date.now(),
      ...eventData,
      context: {
        sessionId: this.session?.sessionId || '',
        anonymousId: this.userProfile?.anonymousId || '',
        userId: this.userProfile?.userId,
        deviceId: this.session?.deviceId || '',
      },
    };
  }

  /**
   * Add event to queue
   */
  private addToQueue(event: AnalyticsEvent): void {
    if (!ConsentManager.hasConsent('analytics')) {
      this.log('Analytics consent not given, event not tracked');
      return;
    }

    this.eventQueue.push(event);

    // Flush if batch size reached
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    } else {
      // Schedule flush if not already scheduled
      this.scheduleBatchFlush();
    }
  }

  /**
   * Schedule batch flush
   */
  private scheduleBatchFlush(): void {
    if (this.batchTimer) return;

    this.batchTimer = setTimeout(() => {
      this.flush();
      this.batchTimer = null;
    }, this.config.batchTimeout);
  }

  /**
   * Flush events to server
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    if (!this.session || !this.userProfile) return;

    // Clear timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    const payload: BatchPayload = {
      events,
      session: this.session,
      userProfile: this.userProfile,
      timestamp: Date.now(),
      batchId: this.generateBatchId(),
    };

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.session.sessionId,
          'X-User-ID': this.userProfile.userId || this.userProfile.anonymousId,
          'X-Batch-ID': payload.batchId,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.statusText}`);
      }

      this.log(`Flushed ${events.length} events`);
    } catch (error) {
      this.log(`Failed to sync events: ${error}`, 'error');
      // Re-queue events for retry
      this.eventQueue.unshift(...events);
    }
  }

  /**
   * Check if should track
   */
  private shouldTrack(): boolean {
    return (
      this.config.apiEndpoint !== 'disabled' &&
      ConsentManager.hasConsent('analytics')
    );
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate batch ID
   */
  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Logging helper
   */
  private log(
    message: string,
    level: 'info' | 'warn' | 'error' = 'info'
  ): void {
    if (!this.config.debug) return;

    const prefix = '[Analytics]';
    if (level === 'error') console.error(prefix, message);
    else if (level === 'warn') console.warn(prefix, message);
    else console.log(prefix, message);
  }

  /**
   * Get current session
   */
  getSession(): SessionData | null {
    return this.session;
  }

  /**
   * Get current user profile
   */
  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }
}

// Export singleton instance
export const analytics = AnalyticsServiceV2.getInstance();
