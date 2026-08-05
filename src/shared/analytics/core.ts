import {
  DEFAULT_CONSENT,
  readStoredConsent,
  writeStoredConsent,
  type ConsentSettings,
} from './consent';

export type { ConsentSettings } from './consent';

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
  pageView: (data: PageViewData) => void;
  trackEvent: (data: EventData) => void;
  identify: (user: UserIdentity) => void;
  updateConsent: (consent: Partial<ConsentSettings>) => void;
}

export interface AnalyticsCoreConfig {
  debug?: boolean;
  defaultConsent?: Partial<ConsentSettings>;
}

class AnalyticsCore {
  private providers: Map<string, AnalyticsProvider> = new Map();
  private consent: ConsentSettings = DEFAULT_CONSENT;

  constructor() {
    const saved = readStoredConsent();
    if (saved) this.consent = saved;
  }

  registerProvider(name: string, provider: AnalyticsProvider): void {
    this.providers.set(name, provider);
  }

  getConsent(): ConsentSettings {
    return { ...this.consent };
  }

  setConsent(partial: Partial<ConsentSettings>): void {
    this.consent = { ...this.consent, ...partial };
    writeStoredConsent(this.consent);
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
