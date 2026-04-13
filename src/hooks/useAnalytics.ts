/**
 * Analytics Hooks
 * React hooks for easy analytics integration in components
 */

'use client';

import { useEffect, useRef, useCallback, createContext, useState } from 'react';
import { AnalyticsService } from '../lib/analytics/AnalyticsService';
import { ConsentManager } from '../lib/analytics/ConsentManager';
import { AnalyticsConfig, ConsentPreferences } from '../lib/analytics/types';

// Create context for analytics
const AnalyticsContext = createContext<AnalyticsService | null>(null);

/**
 * Initialize analytics in root provider
 */
export function useAnalyticsInit(config?: Partial<AnalyticsConfig>) {
  useEffect(() => {
    AnalyticsService.initialize(config);
  }, [config]);
}

/**
 * Get analytics service instance
 */
export function useAnalytics(): AnalyticsService {
  return AnalyticsService.getInstance();
}

/**
 * Track page view
 */
export function usePageView(pageTitle?: string, url?: string) {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackPageView(
      pageTitle || document.title,
      url || window.location.href
    );
  }, [analytics, pageTitle, url]);
}

/**
 * Track component view
 */
export function useComponentView(componentName: string, path?: string) {
  const analytics = useAnalytics();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!trackedRef.current) {
      analytics.trackComponentView(componentName, path);
      trackedRef.current = true;
    }
  }, [analytics, componentName, path]);
}

/**
 * Track clicks on element
 */
export function useClickTracking<T extends HTMLElement = HTMLElement>(
  label?: string,
  callback?: (e: React.MouseEvent) => void
) {
  const analytics = useAnalytics();
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClick = (e: MouseEvent) => {
      analytics.trackClick(element, label);
      callback?.(e as any);
    };

    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }, [analytics, label, callback]);

  return ref;
}

/**
 * Track engagement on element
 */
export function useEngagementTracking(elementId?: string) {
  const analytics = useAnalytics();
  const ref = useRef<HTMLElement>(null);
  const interactionCountRef = useRef(0);

  useEffect(() => {
    if (!ref.current) return;

    const handleInteraction = () => {
      interactionCountRef.current++;
    };

    const element = ref.current;
    element.addEventListener('click', handleInteraction);
    element.addEventListener('mouseover', handleInteraction);
    element.addEventListener('focus', handleInteraction);

    return () => {
      element.removeEventListener('click', handleInteraction);
      element.removeEventListener('mouseover', handleInteraction);
      element.removeEventListener('focus', handleInteraction);
    };
  }, [analytics]);

  return ref;
}

/**
 * Track form interactions
 */
export function useFormTracking(formName: string) {
  const analytics = useAnalytics();

  const trackFieldChange = useCallback(
    (fieldName: string, value?: any) => {
      analytics.trackFormInteraction(formName, fieldName, value);
    },
    [analytics, formName]
  );

  const trackSubmit = useCallback(
    (data?: Record<string, any>) => {
      analytics.trackFormSubmission(formName, data);
    },
    [analytics, formName]
  );

  return { trackFieldChange, trackSubmit };
}

/**
 * Track link clicks
 */
export function useLinkTracking(href: string, label?: string) {
  const analytics = useAnalytics();
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const handleClick = (e: MouseEvent) => {
      analytics.trackLinkClick(href, label);
    };

    ref.current.addEventListener('click', handleClick);
    return () => ref.current?.removeEventListener('click', handleClick);
  }, [analytics, href, label]);

  return ref;
}

/**
 * Track CTA clicks
 */
export function useCTATracking(ctaName: string, ctaType?: string) {
  const analytics = useAnalytics();

  const track = useCallback(() => {
    analytics.trackCTAClick(ctaName, ctaType);
  }, [analytics, ctaName, ctaType]);

  return track;
}

/**
 * Track search
 */
export function useSearchTracking() {
  const analytics = useAnalytics();

  const trackSearch = useCallback(
    (query: string, resultCount?: number) => {
      analytics.trackSearch(query, resultCount);
    },
    [analytics]
  );

  return trackSearch;
}

/**
 * Track custom event
 */
export function useEventTracking() {
  const analytics = useAnalytics();

  const trackEvent = useCallback(
    (eventName: string, data?: Record<string, any>) => {
      analytics.trackEvent(eventName, 'custom', data);
    },
    [analytics]
  );

  return trackEvent;
}

/**
 * Get consent status
 */
export function useConsent(): ConsentPreferences {
  const [consent, setConsent] = useState<ConsentPreferences>(() =>
    ConsentManager.getConsent()
  );

  useEffect(() => {
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setConsent(customEvent.detail);
    };

    window.addEventListener('consent-change', handleConsentChange);
    return () =>
      window.removeEventListener('consent-change', handleConsentChange);
  }, []);

  return consent;
}

/**
 * Consent management hook
 */
export function useConsentManager() {
  const consent = useConsent();

  return {
    consent,
    hasConsent: (category: keyof ConsentPreferences) => {
      return consent[category] ?? false;
    },
    acceptAll: () => ConsentManager.acceptAll(),
    rejectAll: () => ConsentManager.rejectAll(),
    updateConsent: (preferences: Partial<ConsentPreferences>) => {
      ConsentManager.updateConsent(preferences);
    },
    reset: () => ConsentManager.resetConsent(),
    isConsentGiven: () => ConsentManager.isConsentGiven(),
  };
}

/**
 * Get engagement metrics
 */
export function useEngagementMetrics() {
  const analytics = useAnalytics();
  const [metrics, setMetrics] = useState(() =>
    analytics.getEngagementMetrics()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(analytics.getEngagementMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [analytics]);

  return metrics;
}

/**
 * Get user profile
 */
export function useUserProfile() {
  const analytics = useAnalytics();
  return analytics.getUserProfile();
}

export { AnalyticsContext };
