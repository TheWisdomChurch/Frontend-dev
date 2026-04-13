/**
 * Professional Analytics Hooks
 * React hooks for easy analytics integration
 * User-focused tracking utilities
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AnalyticsServiceV2 } from '../lib/analytics/AnalyticsServiceV2';
import { UserIdentificationService } from '../lib/analytics/UserIdentificationService';
import { EngagementMetricsTracker } from '../lib/analytics/EngagementMetricsTracker';
import { SessionManager } from '../lib/analytics/SessionManager';
import { EventProperties } from '../lib/analytics/EventFactory';

// Get singleton analytics instance
export const useAnalytics = () => {
  return AnalyticsServiceV2.getInstance({
    debug: process.env.NODE_ENV === 'development',
  });
};

/**
 * Track page view on component mount
 */
export const usePageView = (pageTitle?: string, pageUrl?: string) => {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackPageView(
      pageTitle || document.title,
      pageUrl || window.location.href
    );
  }, [analytics, pageTitle, pageUrl]);
};

/**
 * Track component view
 */
export const useComponentView = (componentName: string) => {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackCustomEvent(`${componentName}-viewed`, {
      component_name: componentName,
      event_type: 'component_view',
    });

    return () => {
      analytics.trackCustomEvent(`${componentName}-unmounted`, {
        component_name: componentName,
        event_type: 'component_unmount',
      });
    };
  }, [analytics, componentName]);
};

/**
 * Track element clicks with automatic labeling
 */
export const useClickTracking = (
  label: string,
  properties?: EventProperties
) => {
  const analytics = useAnalytics();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClick = (event: MouseEvent) => {
      analytics.trackClick(label, element, properties);
    };

    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }, [analytics, label, properties]);

  return ref;
};

/**
 * Track form submission
 */
export const useFormTracking = (formName: string) => {
  const analytics = useAnalytics();

  const trackSubmit = useCallback(
    (fields?: Record<string, any>) => {
      analytics.trackFormSubmission(formName, fields);
    },
    [analytics, formName]
  );

  const trackFieldInteraction = useCallback(
    (fieldName: string, value?: any) => {
      analytics.trackCustomEvent(`${formName}-${fieldName}-filled`, {
        form_name: formName,
        field_name: fieldName,
        field_value_type: typeof value,
      });
    },
    [analytics, formName]
  );

  return { trackSubmit, trackFieldInteraction };
};

/**
 * Track time spent on page/section
 */
export const useTimeTracking = (eventName: string, threshold?: number) => {
  const startTimeRef = useRef(Date.now());
  const analytics = useAnalytics();

  useEffect(() => {
    return () => {
      const timeSpent = Date.now() - startTimeRef.current;

      // Only track if threshold is met (default 1 second)
      if (timeSpent >= (threshold || 1000)) {
        analytics.trackCustomEvent(`${eventName}-time-tracked`, {
          event_name: eventName,
          time_spent_ms: timeSpent,
          time_spent_sec: Math.round(timeSpent / 1000),
        });
      }
    };
  }, [analytics, eventName, threshold]);
};

/**
 * Track scroll depth
 */
export const useScrollTracking = (elementId?: string) => {
  const analytics = useAnalytics();
  const lastDepthRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      // Track at intervals (25%, 50%, 75%, 100%)
      const milestones = [25, 50, 75, 100];
      const currentMilestone = Math.floor(scrollPercentage / 25) * 25;

      if (currentMilestone > lastDepthRef.current && currentMilestone <= 100) {
        lastDepthRef.current = currentMilestone;

        analytics.trackCustomEvent('scroll-milestone', {
          scroll_depth_percent: currentMilestone,
          page_url: window.location.href,
          element_id: elementId,
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [analytics, elementId]);
};

/**
 * Track user engagement (interaction count, time, etc.)
 */
export const useEngagementTracking = () => {
  const analytics = useAnalytics();

  const getEngagementScore = useCallback(() => {
    return EngagementMetricsTracker.getEngagementScore();
  }, []);

  const getMetrics = useCallback(() => {
    return EngagementMetricsTracker.getMetrics();
  }, []);

  const recordConversion = useCallback(
    (value?: number) => {
      EngagementMetricsTracker.recordConversion(value);
      analytics.trackConversion('user-conversion', value);
    },
    [analytics]
  );

  return { getEngagementScore, getMetrics, recordConversion };
};

/**
 * Track user identification
 */
export const useUserIdentification = () => {
  const identifyUser = useCallback(
    (
      userId: string,
      attributes?: {
        email?: string;
        name?: string;
        segment?: string;
        customAttributes?: Record<string, any>;
      }
    ) => {
      const analytics = AnalyticsServiceV2.getInstance();
      analytics.identifyUser(userId, attributes);
    },
    []
  );

  const resetUser = useCallback(() => {
    const analytics = AnalyticsServiceV2.getInstance();
    analytics.resetUser();
  }, []);

  const getUserProfile = useCallback(() => {
    return UserIdentificationService.getUserProfile();
  }, []);

  return { identifyUser, resetUser, getUserProfile };
};

/**
 * Track media playback (video, audio)
 */
export const useMediaTracking = (mediaTitle: string, duration?: number) => {
  const analytics = useAnalytics();

  const trackPlay = useCallback(
    (currentTime?: number) => {
      analytics.trackMediaEvent('play', mediaTitle, duration, currentTime);
    },
    [analytics, mediaTitle, duration]
  );

  const trackPause = useCallback(
    (currentTime?: number) => {
      analytics.trackMediaEvent('pause', mediaTitle, duration, currentTime);
    },
    [analytics, mediaTitle, duration]
  );

  const trackComplete = useCallback(() => {
    analytics.trackMediaEvent('complete', mediaTitle, duration);
  }, [analytics, mediaTitle, duration]);

  return { trackPlay, trackPause, trackComplete };
};

/**
 * Track search queries
 */
export const useSearchTracking = () => {
  const analytics = useAnalytics();

  const trackSearch = useCallback(
    (query: string, results?: number) => {
      analytics.trackSearch(query, results);
    },
    [analytics]
  );

  return { trackSearch };
};

/**
 * Track conversions and purchases
 */
export const useConversionTracking = () => {
  const analytics = useAnalytics();

  const trackConversion = useCallback(
    (conversionType: string, value?: number) => {
      analytics.trackConversion(conversionType, value);
    },
    [analytics]
  );

  const trackPurchase = useCallback(
    (
      orderId: string,
      value: number,
      currency: string,
      items?: Array<{ name: string; quantity: number; price: number }>
    ) => {
      analytics.trackPurchase(orderId, value, currency, items);
    },
    [analytics]
  );

  return { trackConversion, trackPurchase };
};

/**
 * Track errors and exceptions
 */
export const useErrorTracking = () => {
  const analytics = useAnalytics();

  const trackError = useCallback(
    (errorType: string, message: string, stack?: string) => {
      analytics.trackError(errorType, message, stack);
    },
    [analytics]
  );

  return { trackError };
};

/**
 * Get session information
 */
export const useSessionInfo = () => {
  const session = SessionManager.getOrCreateSession();

  return {
    sessionId: session.sessionId,
    deviceId: session.deviceId,
    createdAt: session.createdAt,
    isActive: Date.now() - session.lastActivityAt < 5 * 60 * 1000,
  };
};

/**
 * Export all hooks
 */
export default {
  useAnalytics,
  usePageView,
  useComponentView,
  useClickTracking,
  useFormTracking,
  useTimeTracking,
  useScrollTracking,
  useEngagementTracking,
  useUserIdentification,
  useMediaTracking,
  useSearchTracking,
  useConversionTracking,
  useErrorTracking,
  useSessionInfo,
};
