/**
 * Professional Analytics Provider
 * Root provider for analytics initialization
 * Enhanced with v2 services
 */

'use client';

import React, { useEffect } from 'react';
import {
  AnalyticsServiceV2,
  type AnalyticsConfig,
} from '@/lib/analytics/AnalyticsServiceV2';
import { EngagementMetricsTracker } from '@/lib/analytics/EngagementMetricsTracker';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: Partial<AnalyticsConfig>;
}

export const AnalyticsProviderV2: React.FC<AnalyticsProviderProps> = ({
  children,
  config,
}) => {
  useEffect(() => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      '';
    const defaultEndpoint = apiBase
      ? `${apiBase.replace(/\/+$/, '')}/api/v1/analytics/events`
      : '/api/v1/analytics/events';

    // Initialize analytics service with configuration
    const analyticsConfig: Partial<AnalyticsConfig> = {
      apiEndpoint: process.env.NEXT_PUBLIC_ANALYTICS_API || defaultEndpoint,
      batchSize: 20,
      batchTimeout: 30000,
      enableAutoTracking: true,
      enableErrorTracking: true,
      enablePerformanceTracking: true,
      enableConversionTracking: true,
      enableUserIdentification: true,
      debug: process.env.NODE_ENV === 'development',
      ...config,
    };

    const analytics = AnalyticsServiceV2.getInstance(analyticsConfig);

    // Initialize engagement tracking
    EngagementMetricsTracker.initialize();

    // Track initial page view
    analytics.trackPageView();

    // Cleanup on unmount
    return () => {
      EngagementMetricsTracker.destroy();
      analytics.flush();
    };
  }, [config]);

  return <>{children}</>;
};

export default AnalyticsProviderV2;
