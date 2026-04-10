// hooks/useAnalyticsTracking.ts
'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/shared/providers/AnalyticsProvider';
import {
  useAdvancedTracking,
  type ScrollTrackingOptions,
} from '@/hooks/useAdvancedTracking'; // ✅ fixed import

export interface UseAnalyticsTrackingReturn {
  trackClick: (
    label: string,
    category?: string,
    additional?: Record<string, any>
  ) => void;
  trackFormStart: (formName: string, additional?: Record<string, any>) => void;
  trackFormComplete: (
    formName: string,
    additional?: Record<string, any>
  ) => void;
  trackFormError: (
    formName: string,
    error: string,
    additional?: Record<string, any>
  ) => void;
  trackDonate: (amount: number, currency?: string, method?: string) => void;
  trackRegister: (eventName: string, eventId?: string) => void;
  /** Set up scroll depth tracking. Accepts options or legacy thresholds array. */
  trackScroll: (
    thresholdsOrOptions?: number[] | ScrollTrackingOptions
  ) => () => void;
}

export function useAnalyticsTracking(): UseAnalyticsTrackingReturn {
  const { trackEvent } = useAnalytics();
  const {
    trackScroll,
    setupOutboundLinkTracking,
    trackFormStart,
    trackFormComplete,
    trackFormError,
    trackDonate,
    trackRegister,
    trackClick,
  } = useAdvancedTracking();

  // Auto‑setup outbound link tracking once
  useEffect(() => {
    const cleanup = setupOutboundLinkTracking();
    return cleanup;
  }, [setupOutboundLinkTracking]);

  // Compatibility wrapper: accept both number[] and ScrollTrackingOptions
  const trackScrollWrapper = (
    thresholdsOrOptions?: number[] | ScrollTrackingOptions
  ) => {
    const options: ScrollTrackingOptions | undefined = Array.isArray(
      thresholdsOrOptions
    )
      ? { thresholds: thresholdsOrOptions }
      : thresholdsOrOptions;
    return trackScroll(options);
  };

  return {
    trackClick,
    trackFormStart,
    trackFormComplete,
    trackFormError,
    trackDonate,
    trackRegister,
    trackScroll: trackScrollWrapper,
  };
}
