/**
 * Analytics Provider
 * Root provider for analytics initialization
 */

'use client';

import React, { useEffect } from 'react';
import { AnalyticsService } from '@/lib/analytics/AnalyticsService';
import { AnalyticsConfig } from '@/lib/analytics/types';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: Partial<AnalyticsConfig>;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  config,
}) => {
  useEffect(() => {
    // Initialize analytics service
    AnalyticsService.initialize({
      enabled: true,
      apiEndpoint: '/api/analytics',
      batchSize: 10,
      batchTimeout: 10000,
      sessionTimeout: 30 * 60 * 1000,
      enableAutoTracking: true,
      enableErrorTracking: true,
      enablePerformanceTracking: true,
      ...config,
    });

    // Track initial page view
    const analytics = AnalyticsService.getInstance();
    analytics.trackPageView();

    return () => {
      // Cleanup and flush events on unmount
      analytics.flush();
    };
  }, [config]);

  return <>{children}</>;
};

export default AnalyticsProvider;
