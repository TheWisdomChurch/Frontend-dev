export interface ConsentSettings {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface UserIdentity {
  userId?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export interface PageViewData {
  page_title: string;
  page_location: string;
  page_referrer?: string;
}

export interface EventData {
  name: string;
  params?: Record<string, unknown>;
}

export interface AnalyticsProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageView: (...args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackEvent: (...args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identify: (...args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateConsent: (...args: any[]) => void;
}

export interface AnalyticsCoreConfig {
  debug?: boolean;
  defaultConsent?: Partial<ConsentSettings>;
}

const CONSENT_COOKIE = '_ana_consent';

function readConsentCookie(): Partial<ConsentSettings> {
  if (typeof document === 'undefined') return {};
  try {
    const match = document.cookie.match(new RegExp(`${CONSENT_COOKIE}=([^;]+)`));
    if (match) return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    // ignore
  }
  return {};
}

function writeConsentCookie(consent: ConsentSettings): void {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(JSON.stringify(consent));
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${CONSENT_COOKIE}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

class AnalyticsCore {
  private providers: Map<string, AnalyticsProvider> = new Map();
  private consent: ConsentSettings = {
    analytics: false,
    marketing: false,
    functional: true,
  };

  constructor() {
    const saved = readConsentCookie();
    this.consent = { ...this.consent, ...saved };
  }

  registerProvider(name: string, provider: AnalyticsProvider): void {
    this.providers.set(name, provider);
  }

  getConsent(): ConsentSettings {
    return { ...this.consent };
  }

  setConsent(partial: Partial<ConsentSettings>): void {
    this.consent = { ...this.consent, ...partial };
    writeConsentCookie(this.consent);
    this.providers.forEach(p => p.updateConsent(partial));
  }

  trackPageView(data: PageViewData): void {
    this.providers.forEach(p => p.pageView(data));
  }

  trackEvent(data: EventData): void {
    this.providers.forEach(p => p.trackEvent(data));
  }

  identify(user: UserIdentity): void {
    this.providers.forEach(p => p.identify(user));
  }
}

export const analyticsCore = new AnalyticsCore();
