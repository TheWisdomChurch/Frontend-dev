'use client';

import {
  useEffect,
  useRef,
  useCallback,
  createContext,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { AnalyticsService } from '../lib/analytics/AnalyticsService';
import { ConsentManager } from '../lib/analytics/ConsentManager';
import { AnalyticsConfig, ConsentPreferences } from '../lib/analytics/types';

const AnalyticsContext = createContext<AnalyticsService | null>(null);

export function useAnalyticsInit(config?: Partial<AnalyticsConfig>) {
  useEffect(() => {
    AnalyticsService.initialize(config);
  }, [config]);
}

export function useAnalytics(): AnalyticsService {
  return AnalyticsService.getInstance();
}

export function usePageView(pageTitle?: string, url?: string) {
  const analytics = useAnalytics();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    analytics.trackPageView(
      pageTitle || document.title,
      url || window.location.href
    );
  }, [analytics, pageTitle, url]);
}

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

export function useClickTracking<T extends HTMLElement = HTMLElement>(
  label?: string,
  callback?: (e: ReactMouseEvent<T>) => void
) {
  const analytics = useAnalytics();
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClick = (e: MouseEvent) => {
      analytics.trackClick(element, label);
      callback?.(e as unknown as ReactMouseEvent<T>);
    };

    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }, [analytics, label, callback]);

  return ref;
}

export function useEngagementTracking(elementId?: string) {
  const analytics = useAnalytics();
  const ref = useRef<HTMLElement>(null);
  const interactionCountRef = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleInteraction = () => {
      interactionCountRef.current += 1;
      void analytics;
      void elementId;
    };

    element.addEventListener('click', handleInteraction);
    element.addEventListener('mouseover', handleInteraction);
    element.addEventListener('focus', handleInteraction);

    return () => {
      element.removeEventListener('click', handleInteraction);
      element.removeEventListener('mouseover', handleInteraction);
      element.removeEventListener('focus', handleInteraction);
    };
  }, [analytics, elementId]);

  return ref;
}

export function useFormTracking(formName: string) {
  const analytics = useAnalytics();

  const trackFieldChange = useCallback(
    (fieldName: string, value?: unknown) => {
      analytics.trackFormInteraction(formName, fieldName, value);
    },
    [analytics, formName]
  );

  const trackSubmit = useCallback(
    (data?: Record<string, unknown>) => {
      analytics.trackFormSubmission(formName, data);
    },
    [analytics, formName]
  );

  return { trackFieldChange, trackSubmit };
}

export function useLinkTracking(href: string, label?: string) {
  const analytics = useAnalytics();
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClick = () => {
      analytics.trackLinkClick(href, label);
    };

    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }, [analytics, href, label]);

  return ref;
}

export function useCTATracking(ctaName: string, ctaType?: string) {
  const analytics = useAnalytics();

  const track = useCallback(() => {
    analytics.trackCTAClick(ctaName, ctaType);
  }, [analytics, ctaName, ctaType]);

  return track;
}

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

export function useEventTracking() {
  const analytics = useAnalytics();

  const trackEvent = useCallback(
    (eventName: string, data?: Record<string, unknown>) => {
      analytics.trackEvent(eventName, 'custom', data);
    },
    [analytics]
  );

  return trackEvent;
}

export function useConsent(): ConsentPreferences {
  const [consent, setConsent] = useState<ConsentPreferences>(() =>
    ConsentManager.getConsent()
  );

  useEffect(() => {
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<ConsentPreferences>;
      setConsent(customEvent.detail);
    };

    window.addEventListener('consent-change', handleConsentChange);

    return () =>
      window.removeEventListener('consent-change', handleConsentChange);
  }, []);

  return consent;
}

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

export function useUserProfile() {
  const analytics = useAnalytics();
  return analytics.getUserProfile();
}

export { AnalyticsContext };
