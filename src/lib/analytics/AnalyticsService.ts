/**
 * Analytics Service
 * Core analytics tracking and event management
 */

import {
  AnalyticsEvent,
  EventType,
  UserProfile,
  AnalyticsConfig,
  TrackingContext,
  PageViewData,
  EngagementMetrics,
} from './types';
import { ConsentManager } from './ConsentManager';

const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: true,
  apiEndpoint: process.env.NEXT_PUBLIC_ANALYTICS_API || '/api/analytics',
  batchSize: 10,
  batchTimeout: 10000, // 10 seconds
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  cookiePath: '/',
  secureCookie: true,
  sameSiteCookie: 'Lax',
  enableAutoTracking: true,
  enableErrorTracking: true,
  enablePerformanceTracking: true,
};

export class AnalyticsService {
  private static instance: AnalyticsService;
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private userProfile: UserProfile | null = null;
  private trackingContext: TrackingContext | null = null;
  private pageStartTime: number = 0;
  private lastActivityTime: number = 0;
  private scrollDepth: number = 0;
  private engagementMetrics: EngagementMetrics = {
    timeOnPage: 0,
    scrollDepth: 0,
    interactionCount: 0,
    clickCount: 0,
    formInteractions: 0,
    videoViews: 0,
    videoPlayback: 0,
  };

  private constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.pageStartTime = Date.now();
    this.lastActivityTime = Date.now();
    this.setupEventListeners();
    this.initializeSession();
  }

  /**
   * Get singleton instance
   */
  static getInstance(config?: Partial<AnalyticsConfig>): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService(config);
    }
    return AnalyticsService.instance;
  }

  /**
   * Initialize analytics service
   */
  static initialize(config?: Partial<AnalyticsConfig>): void {
    if (typeof window === 'undefined') return;
    this.getInstance(config);
    console.log('[Analytics] Service initialized');
  }

  /**
   * Track a custom event
   */
  trackEvent(
    eventName: string,
    eventType: EventType = 'custom',
    data?: Record<string, any>
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(eventName, eventType, data);
    this.addToQueue(event);
  }

  /**
   * Track page view
   */
  trackPageView(pageTitle?: string, url?: string): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent('Page View', 'page_view', {
      pageTitle: pageTitle || document.title,
      pageUrl: url || window.location.href,
    });
    this.addToQueue(event);
  }

  /**
   * Track click event
   */
  trackClick(target: HTMLElement | null, label?: string): void {
    if (!this.shouldTrack() || !target) return;

    this.engagementMetrics.clickCount++;
    this.engagementMetrics.interactionCount++;

    const event = this.createEvent(
      `Click: ${label || target.textContent?.slice(0, 50) || 'Element'}`,
      'click',
      {
        elementId: target.id,
        elementClass: target.className,
        elementTag: target.tagName,
        elementText: target.textContent?.slice(0, 100),
        label,
      }
    );
    this.addToQueue(event);
  }

  /**
   * Track form interaction
   */
  trackFormInteraction(formName: string, fieldName: string, value?: any): void {
    if (!this.shouldTrack()) return;

    this.engagementMetrics.formInteractions++;
    this.engagementMetrics.interactionCount++;

    const event = this.createEvent(
      `Form Interaction: ${formName} - ${fieldName}`,
      'form_interaction',
      {
        formName,
        fieldName,
        fieldType: value?.type || 'unknown',
      }
    );
    this.addToQueue(event);
  }

  /**
   * Track form submission
   */
  trackFormSubmission(
    formName: string,
    dataFields?: Record<string, any>
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      `Form Submission: ${formName}`,
      'form_submission',
      {
        formName,
        fieldCount: dataFields ? Object.keys(dataFields).length : 0,
      }
    );
    this.addToQueue(event);
  }

  /**
   * Track component view
   */
  trackComponentView(componentName: string, path?: string): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      `Component View: ${componentName}`,
      'component_view',
      {
        componentName,
        componentPath: path,
      }
    );
    this.addToQueue(event);
  }

  /**
   * Track link click
   */
  trackLinkClick(href: string, label?: string): void {
    if (!this.shouldTrack()) return;

    this.engagementMetrics.clickCount++;
    this.engagementMetrics.interactionCount++;

    const event = this.createEvent(
      `Link Click: ${label || href}`,
      'link_click',
      {
        href,
        label,
        isExternal: !href.startsWith('/'),
      }
    );
    this.addToQueue(event);
  }

  /**
   * Track CTA click
   */
  trackCTAClick(ctaName: string, ctaType?: string): void {
    if (!this.shouldTrack()) return;

    this.engagementMetrics.clickCount++;
    this.engagementMetrics.interactionCount++;

    const event = this.createEvent(`CTA Click: ${ctaName}`, 'cta_click', {
      ctaName,
      ctaType,
    });
    this.addToQueue(event);
  }

  /**
   * Track search
   */
  trackSearch(query: string, resultCount?: number): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(`Search: ${query}`, 'search', {
      query,
      resultCount,
    });
    this.addToQueue(event);
  }

  /**
   * Track error
   */
  trackError(error: Error | string, context?: Record<string, any>): void {
    if (!this.config.enableErrorTracking) return;

    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'object' ? error.stack : undefined;

    const event = this.createEvent(`Error: ${errorMessage}`, 'error', {
      errorMessage,
      errorStack,
      ...context,
    });
    this.addToQueue(event);
  }

  /**
   * Get current engagement metrics
   */
  getEngagementMetrics(): EngagementMetrics {
    this.engagementMetrics.timeOnPage = Date.now() - this.pageStartTime;
    this.engagementMetrics.scrollDepth = this.scrollDepth;
    return { ...this.engagementMetrics };
  }

  /**
   * Get user profile
   */
  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  /**
   * Set custom user property
   */
  setUserProperty(key: string, value: any): void {
    if (!this.userProfile) return;
    if (!this.userProfile.customProperties) {
      this.userProfile.customProperties = {};
    }
    this.userProfile.customProperties[key] = value;
  }

  /**
   * Flush queued events
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;
    await this.sendBatch(this.eventQueue);
    this.eventQueue = [];
  }

  /**
   * Private Methods
   */
  private createEvent(
    eventName: string,
    eventType: EventType,
    data?: Record<string, any>
  ): AnalyticsEvent {
    return {
      eventType,
      eventName,
      timestamp: Date.now(),
      userId: this.userProfile?.userId,
      sessionId: this.trackingContext?.sessionId || '',
      pageTitle: document.title,
      pageUrl: window.location.href,
      referrer: document.referrer,
      deviceInfo: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        screenResolution: {
          width: window.screen.width,
          height: window.screen.height,
        },
        platform: navigator.platform,
        language: navigator.language,
      },
      eventData: data,
      engagement: {
        timeOnPage: Date.now() - this.pageStartTime,
        scrollDepth: this.scrollDepth,
        interactionCount: this.engagementMetrics.interactionCount,
      },
    };
  }

  private addToQueue(event: AnalyticsEvent): void {
    this.eventQueue.push(event);
    this.lastActivityTime = Date.now();

    if (this.eventQueue.length >= this.config.batchSize) {
      this.sendBatch();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(
        () => this.sendBatch(),
        this.config.batchTimeout
      );
    }
  }

  private async sendBatch(events?: AnalyticsEvent[]): Promise<void> {
    const eventsToSend = events || this.eventQueue;
    if (eventsToSend.length === 0) return;

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    try {
      await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.trackingContext?.sessionId || '',
        },
        body: JSON.stringify({
          events: eventsToSend,
          timestamp: Date.now(),
          userProfile: this.userProfile,
        }),
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Analytics] Error sending events:', error);
      }
    }
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('Page Hidden', 'custom');
      } else {
        this.trackEvent('Page Visible', 'custom');
      }
    });

    // Track clicks
    document.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href) this.trackLinkClick(href);
      }
    });

    // Track scroll depth
    window.addEventListener('scroll', () => this.updateScrollDepth(), {
      passive: true,
    });

    // Track unload
    window.addEventListener('beforeunload', () => this.flush());

    // Error tracking
    if (this.config.enableErrorTracking) {
      window.addEventListener('error', e => {
        this.trackError(e.error || new Error(e.message));
      });

      window.addEventListener('unhandledrejection', e => {
        this.trackError(e.reason || 'Unhandled Promise Rejection');
      });
    }
  }

  private updateScrollDepth(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    const scrollPercent = Math.min(
      100,
      Math.round(((scrollTop + windowHeight) / documentHeight) * 100)
    );

    if (scrollPercent > this.scrollDepth && scrollPercent % 25 === 0) {
      this.scrollDepth = scrollPercent;
      this.engagementMetrics.scrollDepth = scrollPercent;
    }
  }

  private initializeSession(): void {
    if (typeof window === 'undefined') return;

    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem('wcm-session-id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('wcm-session-id', sessionId);
    }

    // Generate or retrieve user ID
    let userId = localStorage.getItem('wcm-user-id');
    if (!userId) {
      userId = this.generateId();
      localStorage.setItem('wcm-user-id', userId);
    }

    const consent = ConsentManager.getConsent();

    this.trackingContext = {
      sessionId,
      userId,
      consentGiven: ConsentManager.isConsentGiven(),
      consentCategories: consent,
      pageStartTime: this.pageStartTime,
      lastActivityTime: this.lastActivityTime,
    };

    this.userProfile = {
      userId,
      sessionId,
      firstVisit:
        parseInt(localStorage.getItem('wcm-first-visit') || '') || Date.now(),
      lastVisit: Date.now(),
      visitCount: parseInt(localStorage.getItem('wcm-visit-count') || '0') + 1,
      totalEngagementTime: 0,
      preferences: consent,
    };

    localStorage.setItem(
      'wcm-first-visit',
      this.userProfile.firstVisit.toString()
    );
    localStorage.setItem(
      'wcm-visit-count',
      this.userProfile.visitCount.toString()
    );
  }

  private shouldTrack(): boolean {
    if (!this.config.enabled) return false;
    if (!ConsentManager.hasConsent('analytics')) return false;
    return true;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default AnalyticsService;
