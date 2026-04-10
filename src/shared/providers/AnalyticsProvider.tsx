'use client';

import {
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useRef,
  useState, // ✅ Added useState import
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  type AnalyticsCoreConfig,
  analyticsCore,
  type ConsentSettings,
  type UserIdentity,
} from '../analytics/core';
import {
  getMetaPixelProvider,
  type MetaPixelConfig,
} from '../analytics/providers/Meta';
import { getGA4Provider, type GA4Config } from '../analytics/providers/ga';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
export interface AnalyticsProviderProps {
  children: ReactNode;
  metaPixelId?: string;
  gaMeasurementId?: string;
  defaultConsent?: Partial<ConsentSettings>;
  coreConfig?: AnalyticsCoreConfig;
  metaConfig?: Omit<MetaPixelConfig, 'pixelId'>;
  gaConfig?: Omit<GA4Config, 'measurementId'>;
  debug?: boolean;
}

export interface AnalyticsContextValue {
  trackEvent: (name: string, params?: Record<string, any>) => void;
  identify: (user: UserIdentity) => void;
  setConsent: (consent: Partial<ConsentSettings>) => void;
  getConsent: () => ConsentSettings;
  isReady: boolean;
}

// ----------------------------------------------------------------------
// Context
// ----------------------------------------------------------------------
const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

// ----------------------------------------------------------------------
// Provider Component
// ----------------------------------------------------------------------
export function AnalyticsProvider({
  children,
  metaPixelId,
  gaMeasurementId,
  defaultConsent,
  coreConfig,
  metaConfig,
  gaConfig,
  debug = false,
}: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isReadyRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const previousPageRef = useRef<string>('');

  // --------------------------------------------------------------------
  // 1. Initialize providers and consent
  // --------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (debug) console.log('[AnalyticsProvider] Initializing...');

      // ✅ Removed analyticsCore.loadConsentFromStorage() – core loads it automatically

      if (coreConfig) {
        if (debug) console.log('[AnalyticsProvider] Core config:', coreConfig);
      }

      const currentConsent = analyticsCore.getConsent();
      const hasConsentCookie = document.cookie.includes('_ana_consent');
      if (!hasConsentCookie && defaultConsent) {
        analyticsCore.setConsent(defaultConsent);
        if (debug)
          console.log(
            '[AnalyticsProvider] Applied default consent:',
            defaultConsent
          );
      } else if (debug) {
        console.log(
          '[AnalyticsProvider] Loaded existing consent:',
          currentConsent
        );
      }

      // Register Meta Pixel provider
      if (metaPixelId) {
        const metaProvider = getMetaPixelProvider(metaPixelId, {
          debug,
          ...metaConfig,
        });
        analyticsCore.registerProvider('meta', {
          pageView: metaProvider.pageView,
          trackEvent: metaProvider.trackEvent,
          identify: metaProvider.identify,
          updateConsent: metaProvider.updateConsent,
        });
        metaProvider.updateConsent({ marketing: currentConsent.marketing });
        if (debug) console.log('[AnalyticsProvider] Meta Pixel registered');
      }

      // Register GA4 provider
      if (gaMeasurementId) {
        // ✅ Fix: GA4 uses `debugMode`, not `debug`
        const gaProvider = getGA4Provider(gaMeasurementId, {
          debugMode: debug,
          ...gaConfig,
        });
        analyticsCore.registerProvider('ga', {
          pageView: gaProvider.pageView,
          trackEvent: gaProvider.trackEvent,
          identify: gaProvider.identify,
          updateConsent: gaProvider.updateConsent,
        });
        gaProvider.updateConsent({
          analytics: currentConsent.analytics,
          marketing: currentConsent.marketing,
        });
        if (debug) console.log('[AnalyticsProvider] GA4 registered');
      }

      if (mounted) {
        isReadyRef.current = true;
        setIsReady(true);
        if (debug) console.log('[AnalyticsProvider] Ready');
      }
    };

    initialize().catch(err => {
      console.error('[AnalyticsProvider] Initialization error:', err);
      if (mounted) setIsReady(true);
    });

    return () => {
      mounted = false;
    };
  }, [
    metaPixelId,
    gaMeasurementId,
    coreConfig,
    metaConfig,
    gaConfig,
    debug,
    defaultConsent,
  ]);

  // --------------------------------------------------------------------
  // 2. Auto-track page views
  // --------------------------------------------------------------------
  useEffect(() => {
    if (!isReady) return;

    const currentPath =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    if (previousPageRef.current === currentPath) return;

    previousPageRef.current = currentPath;

    const timeout = setTimeout(() => {
      analyticsCore.trackPageView({
        page_title: document.title,
        page_location: window.location.href,
        page_referrer: document.referrer,
      });
      if (debug) console.log('[AnalyticsProvider] Page view:', currentPath);
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams, isReady, debug]);

  // --------------------------------------------------------------------
  // 3. Public API methods
  // --------------------------------------------------------------------
  const trackEvent = useCallback(
    (name: string, params?: Record<string, any>) => {
      if (!isReadyRef.current) {
        if (debug)
          console.warn('[AnalyticsProvider] Not ready, event dropped:', name);
        return;
      }
      analyticsCore.trackEvent({ name, params });
    },
    [debug]
  );

  const identify = useCallback(
    (user: UserIdentity) => {
      if (!isReadyRef.current) {
        if (debug)
          console.warn('[AnalyticsProvider] Not ready, identify dropped');
        return;
      }
      analyticsCore.identify(user);
    },
    [debug]
  );

  const setConsent = useCallback(
    (consent: Partial<ConsentSettings>) => {
      analyticsCore.setConsent(consent);
      if (debug) console.log('[AnalyticsProvider] Consent updated:', consent);
    },
    [debug]
  );

  const getConsent = useCallback(() => analyticsCore.getConsent(), []);

  // --------------------------------------------------------------------
  // 4. Context value
  // --------------------------------------------------------------------
  const contextValue: AnalyticsContextValue = {
    trackEvent,
    identify,
    setConsent,
    getConsent,
    isReady,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// ----------------------------------------------------------------------
// Hook with safety check
// ----------------------------------------------------------------------
export function useAnalytics(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return ctx;
}
