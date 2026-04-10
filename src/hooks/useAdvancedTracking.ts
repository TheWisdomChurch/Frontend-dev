// hooks/useAdvancedTracking.ts
'use client';

import { useEffect, useRef, useCallback } from 'react'; // adjust path if needed
import { useAnalytics } from '@/shared/providers/AnalyticsProvider';
// ✅ Export this interface so it can be imported elsewhere
export interface ScrollTrackingOptions {
  thresholds?: number[]; // e.g., [25, 50, 75, 100]
  trackOnce?: boolean;
}

export function useAdvancedTracking() {
  const { trackEvent } = useAnalytics();
  const scrollTracked = useRef<Set<number>>(new Set());
  const timeOnPageStart = useRef<number>(Date.now());

  // Scroll depth tracking
  const trackScroll = useCallback(
    (options: ScrollTrackingOptions = {}) => {
      const thresholds = options.thresholds || [25, 50, 75, 100];
      const trackOnce = options.trackOnce !== false;

      const handleScroll = () => {
        const scrollPercent =
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
          100;
        thresholds.forEach(threshold => {
          if (
            scrollPercent >= threshold &&
            !scrollTracked.current.has(threshold)
          ) {
            if (trackOnce) scrollTracked.current.add(threshold);
            trackEvent('scroll_depth', { percent: threshold });
          }
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    },
    [trackEvent]
  );

  // Time on page (send on unload)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Math.round(
        (Date.now() - timeOnPageStart.current) / 1000
      );
      if (timeSpent > 2) {
        trackEvent('time_on_page', { seconds: timeSpent });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackEvent]);

  // Outbound link tracking
  const setupOutboundLinkTracking = useCallback(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href && !link.href.startsWith(window.location.origin)) {
        trackEvent('outbound_click', {
          url: link.href,
          text: link.innerText,
          target: link.target,
        });
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackEvent]);

  // Form interaction tracking
  const trackFormStart = useCallback(
    (formName: string, additional?: any) => {
      trackEvent('form_start', { form_name: formName, ...additional });
    },
    [trackEvent]
  );

  const trackFormComplete = useCallback(
    (formName: string, additional?: any) => {
      trackEvent('form_complete', { form_name: formName, ...additional });
    },
    [trackEvent]
  );

  const trackFormError = useCallback(
    (formName: string, error: string, additional?: any) => {
      trackEvent('form_error', { form_name: formName, error, ...additional });
    },
    [trackEvent]
  );

  // Donation tracking
  const trackDonate = useCallback(
    (amount: number, currency: string = 'NGN', method?: string) => {
      trackEvent('donate', { value: amount, currency, method });
    },
    [trackEvent]
  );

  // Event registration
  const trackRegister = useCallback(
    (eventName: string, eventId?: string) => {
      trackEvent('event_registration', {
        event_name: eventName,
        event_id: eventId,
      });
    },
    [trackEvent]
  );

  // Custom click tracking
  const trackClick = useCallback(
    (label: string, category?: string, additional?: any) => {
      trackEvent('click', { label, category, ...additional });
    },
    [trackEvent]
  );

  return {
    trackScroll,
    setupOutboundLinkTracking,
    trackFormStart,
    trackFormComplete,
    trackFormError,
    trackDonate,
    trackRegister,
    trackClick,
  };
}
