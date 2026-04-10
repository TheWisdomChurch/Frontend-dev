// hooks/useAnalyticsTracking.ts
'use client';

import { useEffect } from 'react';
import { useAnalytics } from '../providers/AnalyticsProvider';
import {
  useAdvancedTracking,
  type ScrollTrackingOptions,
} from '@/hooks/useAdvancedTracking';

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
  /** Set up scroll depth tracking. Returns a cleanup function. */
  trackScroll: (options?: ScrollTrackingOptions) => () => void;
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

  return {
    trackClick,
    trackFormStart,
    trackFormComplete,
    trackFormError,
    trackDonate,
    trackRegister,
    trackScroll, // now matches the advanced hook's signature
  };
}
