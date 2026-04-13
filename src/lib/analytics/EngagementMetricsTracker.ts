/**
 * Engagement Metrics Tracker
 * Professional engagement and interaction tracking
 * Real-time user behavior monitoring
 */

import { CookieManager } from './CookieManager';

export interface EngagementMetrics {
  // Time metrics
  totalTimeOnSite: number; // milliseconds
  averageTimePerPage: number; // milliseconds
  sessionCount: number;

  // Interaction metrics
  totalPageViews: number;
  totalClicks: number;
  totalScrolls: number;
  totalFormInteractions: number;

  // Engagement quality
  maxScrollDepth: number; // 0-100%
  averageScrollDepth: number; // 0-100%
  cumulativeScrollDepth: number;

  // Conversion metrics
  totalConversions: number;
  conversionValue: number;
  conversionRate: number;

  // Device metrics
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  // Last activity
  lastActivityTime: number;
  isActive: boolean;
  bounceRate: number;

  // Page metrics
  mostedVisitedPages: Array<{ url: string; count: number }>;
  timePerPage: Record<string, number>;
}

export class EngagementMetricsTracker {
  private static METRICS_COOKIE_NAME = 'wcm-engagement-metrics';
  private static METRICS_INTERVAL = 10000; // 10 seconds
  private static INACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  private static metricsInterval: NodeJS.Timeout | null = null;
  private static lastScrollDepth = 0;
  private static pageStartTime = Date.now();
  private static currentPageUrl = '';

  /**
   * Initialize engagement tracking
   */
  static initialize(): void {
    if (typeof window === 'undefined') return;

    this.currentPageUrl = window.location.href;
    this.setupEventListeners();
    this.startMetricsCollection();
  }

  /**
   * Setup event listeners for tracking
   */
  private static setupEventListeners(): void {
    // Track clicks
    document.addEventListener('click', () => this.recordClick(), true);

    // Track scroll
    window.addEventListener('scroll', () => this.recordScroll(), {
      passive: true,
    });

    // Track mouse movement (activity indicator)
    document.addEventListener('mousemove', () => this.recordActivity(), {
      passive: true,
    });

    // Track keyboard input (activity indicator)
    document.addEventListener('keydown', () => this.recordActivity(), {
      passive: true,
    });

    // Page visibility
    document.addEventListener('visibilitychange', () =>
      this.handleVisibilityChange()
    );

    // Before unload - save current metrics
    window.addEventListener('beforeunload', () => this.saveMetrics());
  }

  /**
   * Start periodic metrics collection
   */
  private static startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      this.updateMetrics();
    }, this.METRICS_INTERVAL);
  }

  /**
   * Record click activity
   */
  private static recordClick(): void {
    const metrics = this.getMetrics();
    metrics.totalClicks += 1;
    this.updateMetrics();
  }

  /**
   * Record scroll depth
   */
  private static recordScroll(): void {
    const scrollDepth = this.calculateScrollDepth();
    const metrics = this.getMetrics();

    if (scrollDepth > this.lastScrollDepth) {
      metrics.totalScrolls += 1;
      metrics.maxScrollDepth = Math.max(metrics.maxScrollDepth, scrollDepth);
      this.lastScrollDepth = scrollDepth;
    }
  }

  /**
   * Calculate scroll depth percentage
   */
  private static calculateScrollDepth(): number {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;

    if (documentHeight === 0) return 0;
    return Math.round((scrolled / documentHeight) * 100);
  }

  /**
   * Record user activity
   */
  private static recordActivity(): void {
    const metrics = this.getMetrics();
    metrics.lastActivityTime = Date.now();
    metrics.isActive = true;
  }

  /**
   * Handle page visibility changes
   */
  private static handleVisibilityChange(): void {
    if (document.hidden) {
      this.saveMetrics();
    } else {
      // Resume tracking
      this.recordActivity();
    }
  }

  /**
   * Update metrics
   */
  private static updateMetrics(): void {
    const metrics = this.getMetrics();
    const now = Date.now();

    // Update time metrics
    metrics.totalTimeOnSite += this.METRICS_INTERVAL;

    // Check if user is active
    const inactiveTime = now - metrics.lastActivityTime;
    metrics.isActive = inactiveTime < this.INACTIVITY_THRESHOLD;

    // Update engagement score
    this.updateEngagementScore(metrics);

    this.saveMetrics();
  }

  /**
   * Update engagement score
   */
  private static updateEngagementScore(metrics: EngagementMetrics): void {
    let score = 0;

    // Time on site (max 30 points)
    score += Math.min(30, Math.floor(metrics.totalTimeOnSite / 60000));

    // Interactions (max 30 points)
    const interactions = metrics.totalClicks + metrics.totalScrolls;
    score += Math.min(30, Math.floor(interactions / 10));

    // Scroll depth (max 20 points)
    score += Math.min(20, Math.floor(metrics.maxScrollDepth / 5));

    // Direct conversions (max 20 points)
    score += Math.min(20, metrics.totalConversions * 10);

    // Ensure score is between 0-100
    metrics.bounceRate = Math.max(0, Math.min(100, score));
  }

  /**
   * Get current metrics
   */
  static getMetrics(): EngagementMetrics {
    const stored = CookieManager.getCookieAsJSON<EngagementMetrics>(
      this.METRICS_COOKIE_NAME
    );

    if (stored) return stored;

    return this.createDefaultMetrics();
  }

  /**
   * Create default metrics object
   */
  private static createDefaultMetrics(): EngagementMetrics {
    const now = Date.now();
    const mobile = window.innerWidth < 768;
    const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    return {
      totalTimeOnSite: 0,
      averageTimePerPage: 0,
      sessionCount: 1,
      totalPageViews: 1,
      totalClicks: 0,
      totalScrolls: 0,
      totalFormInteractions: 0,
      maxScrollDepth: 0,
      averageScrollDepth: 0,
      cumulativeScrollDepth: 0,
      totalConversions: 0,
      conversionValue: 0,
      conversionRate: 0,
      isMobile: mobile,
      isTablet: tablet,
      isDesktop: !mobile && !tablet,
      lastActivityTime: now,
      isActive: true,
      bounceRate: 0,
      mostedVisitedPages: [],
      timePerPage: {},
    };
  }

  /**
   * Record form interaction
   */
  static recordFormInteraction(): void {
    const metrics = this.getMetrics();
    metrics.totalFormInteractions += 1;
    this.saveMetrics();
  }

  /**
   * Record conversion
   */
  static recordConversion(value?: number): void {
    const metrics = this.getMetrics();
    metrics.totalConversions += 1;
    if (value) {
      metrics.conversionValue += value;
    }
    this.saveMetrics();
  }

  /**
   * Record page view
   */
  static recordPageView(url: string): void {
    const metrics = this.getMetrics();
    metrics.totalPageViews += 1;

    // Track page visit
    const existing = metrics.mostedVisitedPages.find(p => p.url === url);
    if (existing) {
      existing.count += 1;
    } else {
      metrics.mostedVisitedPages.push({ url, count: 1 });
    }

    // Sort by count
    metrics.mostedVisitedPages.sort((a, b) => b.count - a.count);
    metrics.mostedVisitedPages = metrics.mostedVisitedPages.slice(0, 10); // Top 10

    this.saveMetrics();
  }

  /**
   * Save metrics to cookie
   */
  static saveMetrics(): void {
    const metrics = this.getMetrics();
    CookieManager.setCookieAsJSON(this.METRICS_COOKIE_NAME, metrics, {
      maxAge: 24 * 60 * 60,
    });
  }

  /**
   * Get engagement score (0-100)
   */
  static getEngagementScore(): number {
    const metrics = this.getMetrics();
    return metrics.bounceRate;
  }

  /**
   * Reset metrics
   */
  static resetMetrics(): void {
    CookieManager.deleteCookie(this.METRICS_COOKIE_NAME);
  }

  /**
   * Export metrics
   */
  static exportMetrics(): EngagementMetrics {
    return this.getMetrics();
  }

  /**
   * Cleanup on unload
   */
  static destroy(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    this.saveMetrics();
  }
}
