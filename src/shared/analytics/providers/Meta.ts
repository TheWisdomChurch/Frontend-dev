// lib/analytics/providers/meta.ts
'use client';

// ----------------------------------------------------------------------
// Type declarations for Facebook Pixel
// ----------------------------------------------------------------------
// Facebook Pixel event type names
export type FbqEventName =
  | 'PageView'
  | 'ViewContent'
  | 'Search'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'Schedule'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe'
  | string; // allow custom event names

export interface FbqPixelConfig {
  autoConfig?: boolean;
  debug?: boolean;
  cookieDomain?: string;
  cookieExpiryDays?: number;
  dataProcessingOptions?: {
    options: number[]; // e.g., [1] for limited data use
    country?: number; // 1 for US, 2 for CA
    state?: number; // e.g., 1000 for California
  };
}

export interface FbqAdvancedMatchingData {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  external_id?: string;
  client_user_agent?: string;
  fbc?: string;
  fbp?: string;
  [key: string]: any;
}

export interface FbqEventParams {
  value?: number;
  currency?: string;
  content_name?: string;
  content_type?: string;
  content_ids?: string[];
  contents?: any[];
  num_items?: number;
  order_id?: string;
  predicted_ltv?: number;
  search_string?: string;
  status?: boolean;
  [key: string]: any;
}

export interface FbqInterface {
  (command: 'init', pixelId: string, config?: any): void;
  (command: 'track', eventName: FbqEventName, params?: FbqEventParams): void;
  (command: 'trackCustom', eventName: string, params?: FbqEventParams): void;
  (command: 'set', key: string, value: any): void;
  (command: 'consent', consentState: 'grant' | 'revoke', purpose: string): void;
  (
    command: 'dataProcessingOptions',
    options: number[],
    country?: number,
    state?: number
  ): void;
  (...args: unknown[]): void;
}

declare global {
  interface Window {
    fbq?: FbqInterface;
    _fbq?: any;
  }
}

export interface MetaPixelConfig {
  pixelId: string;
  autoConfig?: boolean;
  debug?: boolean;
  cookieDomain?: string;
  cookieExpiryDays?: number;
  advancedMatching?: boolean; // enable automatic advanced matching
  dataProcessingOptions?: FbqPixelConfig['dataProcessingOptions'];
}

interface LoadState {
  loaded: boolean;
  loading: boolean;
  error?: Error;
}

// ----------------------------------------------------------------------
// Meta Pixel Loader with state management and consent support
// ----------------------------------------------------------------------
let loadState: LoadState = { loaded: false, loading: false };
let pendingLoads: Array<(value: void) => void> = [];

export async function loadMetaPixel(config: MetaPixelConfig): Promise<void> {
  if (typeof window === 'undefined') return;

  // Already loaded
  if (window.fbq && loadState.loaded) return;

  // If already loading, wait for it
  if (loadState.loading) {
    return new Promise(resolve => {
      pendingLoads.push(resolve);
    });
  }

  loadState.loading = true;

  return new Promise((resolve, reject) => {
    try {
      // Initialize fbq function before script loads (Facebook's requirement)
      window.fbq = function (...args: unknown[]) {
        if (window._fbq) window._fbq.push(args);
        else window._fbq = [args];
      };
      window._fbq = window._fbq || [];

      // Inject Facebook Pixel script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.onload = () => {
        initializeMetaPixel(config);
        loadState.loaded = true;
        loadState.loading = false;
        resolve();
        pendingLoads.forEach(res => res());
        pendingLoads = [];
      };
      script.onerror = err => {
        const error = new Error(`Failed to load Meta Pixel: ${err}`);
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

function initializeMetaPixel(config: MetaPixelConfig): void {
  if (!window.fbq) return;

  const initConfig: any = {
    autoConfig: config.autoConfig !== false,
    debug: config.debug || false,
  };

  // Set cookie domain if provided
  if (config.cookieDomain) {
    initConfig.cookie_domain = config.cookieDomain;
  }
  // Set cookie expiry
  if (config.cookieExpiryDays) {
    initConfig.cookie_expiry_days = config.cookieExpiryDays;
  }
  // Enable advanced matching (auto-collects hashed user data)
  if (config.advancedMatching !== false) {
    initConfig.advanced_matching = true;
  }

  window.fbq('init', config.pixelId, initConfig);

  // Apply data processing options for GDPR/CCPA compliance
  if (config.dataProcessingOptions) {
    const { options, country, state } = config.dataProcessingOptions;
    window.fbq('dataProcessingOptions', options, country, state);
  } else {
    // Default: no limited data use (fully track)
    // But you may want to set LDU=1 initially until consent is given
    // We'll handle that via updateConsent method.
  }

  if (config.debug) {
    console.log('[MetaPixel] Initialized', config.pixelId, initConfig);
  }
}

// ----------------------------------------------------------------------
// Meta Pixel Provider Interface for AnalyticsCore
// ----------------------------------------------------------------------
export interface MetaPixelProviderInstance {
  pageView: (params: any) => void;
  trackEvent: (eventName: string, params: any) => void;
  identify: (user: any) => void;
  updateConsent: (consent: { marketing: boolean }) => void;
  setAdvancedMatchingData: (data: FbqAdvancedMatchingData) => void;
}

export function createMetaPixelProvider(
  pixelId: string,
  config?: Omit<MetaPixelConfig, 'pixelId'>
): MetaPixelProviderInstance {
  let initialized = false;
  let currentConsent = { marketing: false };

  const ensureInitialized = async () => {
    if (!initialized) {
      await loadMetaPixel({ pixelId, ...config });
      initialized = true;
      // Apply initial consent state after load
      updateConsentInternal(currentConsent);
    }
  };

  const updateConsentInternal = (consent: { marketing: boolean }) => {
    if (!window.fbq) return;
    if (consent.marketing) {
      // Grant consent for marketing – remove data processing restrictions
      window.fbq('consent', 'grant', 'facebook_pixel');
      // Optionally reset dataProcessingOptions to full tracking
      // window.fbq('dataProcessingOptions', []);
    } else {
      // Revoke consent – apply limited data use (LDU=1) as required by GDPR/CCPA
      window.fbq('consent', 'revoke', 'facebook_pixel');
      // Apply data processing options for limited use
      window.fbq('dataProcessingOptions', [1]); // LDU=1
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentConsent = consent;
  };

  return {
    pageView: (params: any) => {
      ensureInitialized()
        .then(() => {
          if (window.fbq) {
            // Add session_id and user_id automatically
            const enriched = {
              ...params,
              session_id: params.session_id,
              user_id: params.user_id,
            };
            window.fbq('track', 'PageView', enriched);
          }
        })
        .catch(console.warn);
    },

    trackEvent: (eventName: string, params: any) => {
      ensureInitialized()
        .then(() => {
          if (window.fbq) {
            const enriched = {
              ...params,
              session_id: params.session_id,
              user_id: params.user_id,
            };
            // Use trackCustom for custom event names, track for standard ones
            const isStandardEvent = [
              'PageView',
              'ViewContent',
              'Search',
              'AddToCart',
              'AddToWishlist',
              'InitiateCheckout',
              'AddPaymentInfo',
              'Purchase',
              'Lead',
              'CompleteRegistration',
              'Contact',
              'CustomizeProduct',
              'Donate',
              'FindLocation',
              'Schedule',
              'StartTrial',
              'SubmitApplication',
              'Subscribe',
            ].includes(eventName);
            if (isStandardEvent) {
              window.fbq('track', eventName as FbqEventName, enriched);
            } else {
              window.fbq('trackCustom', eventName, enriched);
            }
          }
        })
        .catch(console.warn);
    },

    identify: (user: any) => {
      ensureInitialized()
        .then(() => {
          if (window.fbq && user.user_id) {
            // Set external_id for advanced matching
            window.fbq('set', 'external_id', user.user_id);
            // Also pass other advanced matching data if available
            const advancedData: FbqAdvancedMatchingData = {};
            if (user.email) advancedData.email = user.email;
            if (user.phone) advancedData.phone = user.phone;
            if (user.first_name) advancedData.first_name = user.first_name;
            if (user.last_name) advancedData.last_name = user.last_name;
            if (user.city) advancedData.city = user.city;
            if (user.state) advancedData.state = user.state;
            if (user.zip) advancedData.zip = user.zip;
            if (user.country) advancedData.country = user.country;
            if (Object.keys(advancedData).length) {
              window.fbq('init', pixelId, { advanced_matching: advancedData });
            }
          }
        })
        .catch(console.warn);
    },

    updateConsent: (consent: { marketing: boolean }) => {
      currentConsent = consent;
      if (initialized) {
        updateConsentInternal(consent);
      } else {
        // Store consent; will apply after load
        ensureInitialized().catch(console.warn);
      }
    },

    setAdvancedMatchingData: (data: FbqAdvancedMatchingData) => {
      ensureInitialized()
        .then(() => {
          if (window.fbq) {
            for (const [key, value] of Object.entries(data)) {
              window.fbq('set', key, value);
            }
          }
        })
        .catch(console.warn);
    },
  };
}

// ----------------------------------------------------------------------
// Default export for easy integration with AnalyticsCore
// ----------------------------------------------------------------------
let defaultProviderInstance: MetaPixelProviderInstance | null = null;

export function getMetaPixelProvider(
  pixelId: string,
  config?: Omit<MetaPixelConfig, 'pixelId'>
): MetaPixelProviderInstance {
  if (!defaultProviderInstance) {
    defaultProviderInstance = createMetaPixelProvider(pixelId, config);
  }
  return defaultProviderInstance;
}

// For backward compatibility with existing AnalyticsProvider code
export const metaPixelProvider = {
  pageView: (params: any) => {
    if (window.fbq) {
      window.fbq('track', 'PageView', params);
    }
  },
  trackEvent: (eventName: string, params: any) => {
    if (window.fbq) {
      // Auto-detect standard vs custom
      const isStandard = [
        'PageView',
        'ViewContent',
        'Search',
        'AddToCart',
        'AddToWishlist',
        'InitiateCheckout',
        'AddPaymentInfo',
        'Purchase',
        'Lead',
        'CompleteRegistration',
        'Contact',
        'CustomizeProduct',
        'Donate',
        'FindLocation',
        'Schedule',
        'StartTrial',
        'SubmitApplication',
        'Subscribe',
      ].includes(eventName);
      if (isStandard) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('trackCustom', eventName, params);
      }
    }
  },
  identify: (user: any) => {
    if (window.fbq && user.user_id) {
      window.fbq('set', 'external_id', user.user_id);
    }
  },
};
