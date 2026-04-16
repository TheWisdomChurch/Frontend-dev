'use client';

import {
  Suspense,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
  useCallback,
  useRef,
  useState,
  useMemo,
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
  trackEvent: (name: string, params?: Record<string, unknown>) => void;
  identify: (user: UserIdentity) => void;
  setConsent: (consent: Partial<ConsentSettings>) => void;
  getConsent: () => ConsentSettings;
  isReady: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

function AnalyticsPageTracker({
  isReady,
  debug,
  previousPageRef,
}: {
  isReady: boolean;
  debug: boolean;
  previousPageRef: React.MutableRefObject<string>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isReady) return;
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return;

    const currentPath =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    if (previousPageRef.current === currentPath) return;
    previousPageRef.current = currentPath;

    const timeout = window.setTimeout(() => {
      analyticsCore.trackPageView({
        page_title: document.title,
        page_location: window.location.href,
        page_referrer: document.referrer,
      });

      if (debug) {
        console.log('[AnalyticsProvider] Page view:', currentPath);
      }
    }, 100);

    return () => window.clearTimeout(timeout);
  }, [pathname, searchParams, isReady, debug, previousPageRef]);

  return null;
}

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
  const isReadyRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const previousPageRef = useRef<string>('');

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (debug) console.log('[AnalyticsProvider] Initializing...');

      if (coreConfig && debug) {
        console.log('[AnalyticsProvider] Core config:', coreConfig);
      }

      const currentConsent = analyticsCore.getConsent();
      const hasConsentCookie =
        typeof document !== 'undefined' &&
        document.cookie.includes('_ana_consent');

      if (!hasConsentCookie && defaultConsent) {
        analyticsCore.setConsent(defaultConsent);
        if (debug) {
          console.log(
            '[AnalyticsProvider] Applied default consent:',
            defaultConsent
          );
        }
      } else if (debug) {
        console.log(
          '[AnalyticsProvider] Loaded existing consent:',
          currentConsent
        );
      }

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

      if (gaMeasurementId) {
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

      if (mounted) {
        isReadyRef.current = true;
        setIsReady(true);
      }
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

  const trackEvent = useCallback(
    (name: string, params?: Record<string, unknown>) => {
      if (!isReadyRef.current) {
        if (debug) {
          console.warn('[AnalyticsProvider] Not ready, event dropped:', name);
        }
        return;
      }

      analyticsCore.trackEvent({ name, params });
    },
    [debug]
  );

  const identify = useCallback(
    (user: UserIdentity) => {
      if (!isReadyRef.current) {
        if (debug) {
          console.warn('[AnalyticsProvider] Not ready, identify dropped');
        }
        return;
      }

      analyticsCore.identify(user);
    },
    [debug]
  );

  const setConsent = useCallback(
    (consent: Partial<ConsentSettings>) => {
      analyticsCore.setConsent(consent);
      if (debug) {
        console.log('[AnalyticsProvider] Consent updated:', consent);
      }
    },
    [debug]
  );

  const getConsent = useCallback(() => analyticsCore.getConsent(), []);

  const contextValue = useMemo<AnalyticsContextValue>(
    () => ({
      trackEvent,
      identify,
      setConsent,
      getConsent,
      isReady,
    }),
    [trackEvent, identify, setConsent, getConsent, isReady]
  );

  return (
    <AnalyticsContext.Provider value={contextValue}>
      <Suspense fallback={null}>
        <AnalyticsPageTracker
          isReady={isReady}
          debug={debug}
          previousPageRef={previousPageRef}
        />
      </Suspense>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext);

  if (!ctx) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }

  return ctx;
}
