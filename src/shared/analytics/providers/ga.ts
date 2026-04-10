// lib/analytics/providers/ga.ts
'use client';

// ----------------------------------------------------------------------
// Type declarations
// ----------------------------------------------------------------------
// Google Analytics 4 official command types (partial)
export interface GtagInterface {
  (command: 'config', targetId: string, config?: Record<string, any>): void;
  (command: 'set', config: Record<string, any>): void;
  (
    command: 'event',
    eventName: string,
    eventParams?: Record<string, any>
  ): void;
  (command: 'js', date: Date): void;
  (
    command: 'consent',
    consentMode: 'default' | 'update',
    consentParams: Record<string, any>
  ): void;
  (
    command: 'get',
    targetId: string,
    fieldName: string,
    callback: (field: any) => void
  ): void;
  (command: string, ...args: any[]): void;
}

declare global {
  interface Window {
    gtag?: GtagInterface;
    dataLayer?: any[];
  }
}

export interface GA4Config {
  measurementId: string;
  debugMode?: boolean;
  cookieDomain?: string;
  cookieExpires?: number; // in seconds, default 63072000 (2 years)
  cookieFlags?: string; // e.g., 'SameSite=None;Secure'
  allowGoogleSignals?: boolean;
  allowAdPersonalizationSignals?: boolean;
  anonymizeIp?: boolean;
}

interface LoadState {
  loaded: boolean;
  loading: boolean;
  error?: Error;
}

// ----------------------------------------------------------------------
// GA4 Loader with retry and state management
// ----------------------------------------------------------------------
let loadState: LoadState = { loaded: false, loading: false };
let pendingLoads: Array<(value: void) => void> = [];

export async function loadGA4(config: GA4Config): Promise<void> {
  if (typeof window === 'undefined') return;

  // Already loaded
  if (window.gtag && loadState.loaded) return;

  // If already loading, wait for it
  if (loadState.loading) {
    return new Promise(resolve => {
      pendingLoads.push(resolve);
    });
  }

  loadState.loading = true;

  return new Promise((resolve, reject) => {
    try {
      // Inject GA4 script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
      script.onload = () => {
        initializeGA4(config);
        loadState.loaded = true;
        loadState.loading = false;
        resolve();
        pendingLoads.forEach(res => res());
        pendingLoads = [];
      };
      script.onerror = err => {
        const error = new Error(`Failed to load GA4: ${err}`);
        loadState.error = error;
        loadState.loading = false;
        reject(error);
        pendingLoads = [];
      };
      document.head.appendChild(script);
    } catch (err) {
      loadState.loading = false;
      reject(err);
    }
  });
}

function initializeGA4(config: GA4Config): void {
  if (!window.gtag) {
    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: any[]) {
      window.dataLayer!.push(args);
    };
  }

  // Set default consent (deny all until user opts in)
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500,
  });

  // Send initial page view timestamp
  window.gtag('js', new Date());

  // Configure GA4 with advanced options
  const gtagConfig: Record<string, any> = {
    send_page_view: false, // we manually send page views
    debug_mode: config.debugMode || false,
    anonymize_ip: config.anonymizeIp !== false, // default true for GDPR
    allow_google_signals: config.allowGoogleSignals !== false,
    allow_ad_personalization_signals:
      config.allowAdPersonalizationSignals !== false,
  };

  if (config.cookieDomain) {
    gtagConfig.cookie_domain = config.cookieDomain;
  }
  if (config.cookieExpires) {
    gtagConfig.cookie_expires = config.cookieExpires;
  }
  if (config.cookieFlags) {
    gtagConfig.cookie_flags = config.cookieFlags;
  }

  window.gtag('config', config.measurementId, gtagConfig);
}

// ----------------------------------------------------------------------
// GA4 Provider Interface for AnalyticsCore
// ----------------------------------------------------------------------
export interface GA4ProviderInstance {
  pageView: (params: any) => void;
  trackEvent: (eventName: string, params: any) => void;
  identify: (user: any) => void;
  updateConsent: (consent: { analytics: boolean; marketing: boolean }) => void;
}

export function createGA4Provider(
  measurementId: string,
  config?: Omit<GA4Config, 'measurementId'>
): GA4ProviderInstance {
  let initialized = false;

  const ensureInitialized = async () => {
    if (!initialized) {
      await loadGA4({ measurementId, ...config });
      initialized = true;
    }
  };

  return {
    pageView: (params: any) => {
      ensureInitialized()
        .then(() => {
          if (window.gtag) {
            window.gtag('event', 'page_view', {
              page_title: params.page_title,
              page_location: params.page_location,
              page_referrer: params.page_referrer,
              session_id: params.session_id,
              ...params,
            });
          }
        })
        .catch(console.warn);
    },

    trackEvent: (eventName: string, params: any) => {
      ensureInitialized()
        .then(() => {
          if (window.gtag) {
            window.gtag('event', eventName, params);
          }
        })
        .catch(console.warn);
    },

    identify: (user: any) => {
      ensureInitialized()
        .then(() => {
          if (window.gtag && user.user_id) {
            window.gtag('set', { user_id: user.user_id });
          }
        })
        .catch(console.warn);
    },

    updateConsent: (consent: { analytics: boolean; marketing: boolean }) => {
      ensureInitialized()
        .then(() => {
          if (window.gtag) {
            window.gtag('consent', 'update', {
              analytics_storage: consent.analytics ? 'granted' : 'denied',
              ad_storage: consent.marketing ? 'granted' : 'denied',
              ad_user_data: consent.marketing ? 'granted' : 'denied',
              ad_personalization: consent.marketing ? 'granted' : 'denied',
            });
          }
        })
        .catch(console.warn);
    },
  };
}

// ----------------------------------------------------------------------
// Default export for easy integration with AnalyticsCore
// ----------------------------------------------------------------------
let defaultProviderInstance: GA4ProviderInstance | null = null;

export function getGA4Provider(
  measurementId: string,
  config?: Omit<GA4Config, 'measurementId'>
): GA4ProviderInstance {
  if (!defaultProviderInstance) {
    defaultProviderInstance = createGA4Provider(measurementId, config);
  }
  return defaultProviderInstance;
}

// For backward compatibility with existing AnalyticsProvider code
export const ga4Provider = {
  pageView: (params: any) => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: params.page_title,
        page_location: params.page_location,
        page_referrer: params.page_referrer,
      });
    }
  },
  trackEvent: (eventName: string, params: any) => {
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }
  },
  identify: (user: any) => {
    if (window.gtag && user.user_id) {
      window.gtag('set', { user_id: user.user_id });
    }
  },
};
