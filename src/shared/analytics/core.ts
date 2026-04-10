// lib/analytics/core.ts
'use client';

// ----------------------------------------------------------------------
// Cookie Management Utilities (RFC 6265 compliant)
// ----------------------------------------------------------------------

export interface CookieOptions {
  days?: number; // expiration in days (default: 365)
  path?: string; // cookie path (default: '/')
  domain?: string; // optional domain (e.g., '.example.com')
  secure?: boolean; // HTTPS only (default: true in production)
  sameSite?: 'Strict' | 'Lax' | 'None'; // default: 'Lax'
  httpOnly?: boolean; // server‑side only – this flag is ignored on client‑side set
}

const DEFAULT_COOKIE_OPTIONS: Required<Omit<CookieOptions, 'domain'>> = {
  days: 365,
  path: '/',
  secure:
    typeof window !== 'undefined'
      ? window.location.protocol === 'https:'
      : true,
  sameSite: 'Lax',
  httpOnly: false, // client‑side cannot set HttpOnly; only server can
};

function setCookie(name: string, value: string, options?: CookieOptions): void {
  if (typeof document === 'undefined') return;
  const opts = { ...DEFAULT_COOKIE_OPTIONS, ...options };
  const expires = new Date();
  expires.setTime(expires.getTime() + opts.days * 24 * 60 * 60 * 1000);
  const cookieParts: string[] = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `expires=${expires.toUTCString()}`,
    `path=${opts.path}`,
    `SameSite=${opts.sameSite}`,
  ];
  if (opts.secure) cookieParts.push('Secure');
  if (opts.domain) cookieParts.push(`domain=${opts.domain}`);
  document.cookie = cookieParts.join('; ');
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(^| )' + encodeURIComponent(name) + '=([^;]+)')
  );
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(
  name: string,
  options?: Pick<CookieOptions, 'path' | 'domain'>
): void {
  setCookie(name, '', { ...options, days: -1 });
}

// ----------------------------------------------------------------------
// Analytics Core
// ----------------------------------------------------------------------

export type AnalyticsProvider = 'meta' | 'ga' | 'custom';

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
  provider?: AnalyticsProvider | AnalyticsProvider[];
}

export interface PageViewParams {
  page_title?: string;
  page_location?: string;
  page_referrer?: string;
  [key: string]: any;
}

export interface UserIdentity {
  user_id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface ConsentSettings {
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface AnalyticsCoreConfig {
  cookieDomain?: string; // e.g., '.wisdomchurch.org'
  secure?: boolean; // force Secure flag (default: auto)
  sessionCookieDays?: number; // default: 30
  consentCookieDays?: number; // default: 365
}

class AnalyticsCore {
  private providers: Map<AnalyticsProvider, any> = new Map();
  private consent: ConsentSettings = {
    functional: true,
    analytics: false,
    marketing: false,
  };
  private sessionId: string | null = null;
  private userId?: string;
  private initialReferrer: string;
  private firstVisit: number;
  private config: Required<Omit<AnalyticsCoreConfig, 'cookieDomain'>> & {
    cookieDomain?: string;
  };

  constructor(config?: AnalyticsCoreConfig) {
    // Default config
    this.config = {
      secure:
        typeof window !== 'undefined'
          ? window.location.protocol === 'https:'
          : true,
      sessionCookieDays: 30,
      consentCookieDays: 365,
      cookieDomain: config?.cookieDomain,
    };
    // Only run on client
    if (typeof window === 'undefined') {
      this.sessionId = null;
      this.initialReferrer = '';
      this.firstVisit = Date.now();
      return;
    }
    this.initialReferrer = document.referrer || 'direct';
    this.firstVisit = this.getFirstVisitTimestamp();
    this.sessionId = this.getOrCreateSessionId();
    this.loadConsentFromCookie();
  }

  // --------------------------------------------------------------------
  // Cookie‑based session ID (persistent, cross‑tab, cross‑restart)
  // --------------------------------------------------------------------
  private getOrCreateSessionId(): string {
    const cookieName = '_ana_sid';
    let session = getCookie(cookieName);
    if (!session) {
      session = crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2);
      setCookie(cookieName, session, {
        days: this.config.sessionCookieDays,
        path: '/',
        domain: this.config.cookieDomain,
        secure: this.config.secure,
        sameSite: 'Lax',
      });
    }
    return session;
  }

  // --------------------------------------------------------------------
  // First visit timestamp – stored in a cookie (not localStorage)
  // --------------------------------------------------------------------
  private getFirstVisitTimestamp(): number {
    const cookieName = '_ana_first_visit';
    const existing = getCookie(cookieName);
    if (existing) {
      return parseInt(existing, 10);
    }
    const now = Date.now();
    setCookie(cookieName, now.toString(), {
      days: 3650, // 10 years – essentially permanent
      path: '/',
      domain: this.config.cookieDomain,
      secure: this.config.secure,
      sameSite: 'Lax',
    });
    return now;
  }

  // --------------------------------------------------------------------
  // Consent stored in a cookie (GDPR/CCPA friendly)
  // --------------------------------------------------------------------
  private loadConsentFromCookie(): void {
    const consentCookie = getCookie('_ana_consent');
    if (consentCookie) {
      try {
        const parsed = JSON.parse(consentCookie);
        this.consent = { ...this.consent, ...parsed };
      } catch (e) {
        // ignore malformed cookie
      }
    }
  }

  private persistConsent(): void {
    setCookie('_ana_consent', JSON.stringify(this.consent), {
      days: this.config.consentCookieDays,
      path: '/',
      domain: this.config.cookieDomain,
      secure: this.config.secure,
      sameSite: 'Lax',
    });
  }

  // --------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------
  public registerProvider(provider: AnalyticsProvider, instance: any): void {
    this.providers.set(provider, instance);
  }

  public setConsent(consent: Partial<ConsentSettings>): void {
    this.consent = { ...this.consent, ...consent };
    this.persistConsent();
  }

  public getConsent(): ConsentSettings {
    return { ...this.consent };
  }

  public identify(user: UserIdentity): void {
    this.userId = user.user_id;
    // Optionally store user ID in a cookie (if needed for cross‑session identification)
    // But we don't store PII in cookies by default – only if explicitly allowed.
    if (this.consent.analytics && user.user_id) {
      setCookie('_ana_user', user.user_id, {
        days: 30,
        path: '/',
        domain: this.config.cookieDomain,
        secure: this.config.secure,
        sameSite: 'Lax',
      });
    }
    this.providers.forEach((provider, name) => {
      if (this.shouldTrackForProvider(name) && provider.identify) {
        provider.identify(user);
      }
    });
  }

  public trackPageView(params: PageViewParams): void {
    const enriched = {
      ...params,
      session_id: this.sessionId,
      user_id: this.userId,
      page_referrer: params.page_referrer || this.initialReferrer,
      first_visit: this.firstVisit,
    };
    this.providers.forEach((provider, name) => {
      if (this.shouldTrackForProvider(name) && provider.pageView) {
        provider.pageView(enriched);
      }
    });
  }

  public trackEvent(event: AnalyticsEvent): void {
    const providers = event.provider
      ? Array.isArray(event.provider)
        ? event.provider
        : [event.provider]
      : Array.from(this.providers.keys());

    for (const providerName of providers) {
      const provider = this.providers.get(providerName);
      if (
        provider &&
        this.shouldTrackForProvider(providerName) &&
        provider.trackEvent
      ) {
        // Add session and user context to every event
        const enrichedParams = {
          ...(event.params || {}),
          session_id: this.sessionId,
          user_id: this.userId,
        };
        provider.trackEvent(event.name, enrichedParams);
      }
    }
  }

  public resetSession(): void {
    if (typeof window === 'undefined') return;
    deleteCookie('_ana_sid', { path: '/', domain: this.config.cookieDomain });
    this.sessionId = this.getOrCreateSessionId();
  }

  public deleteAllCookies(): void {
    deleteCookie('_ana_sid', { path: '/', domain: this.config.cookieDomain });
    deleteCookie('_ana_first_visit', {
      path: '/',
      domain: this.config.cookieDomain,
    });
    deleteCookie('_ana_consent', {
      path: '/',
      domain: this.config.cookieDomain,
    });
    deleteCookie('_ana_user', { path: '/', domain: this.config.cookieDomain });
  }

  private shouldTrackForProvider(provider: AnalyticsProvider): boolean {
    if (provider === 'meta') return this.consent.marketing;
    if (provider === 'ga') return this.consent.analytics;
    if (provider === 'custom') return this.consent.analytics;
    return false;
  }
}

// Singleton instance – but allows configuration via environment variables
let coreInstance: AnalyticsCore | null = null;

export function getAnalyticsCore(config?: AnalyticsCoreConfig): AnalyticsCore {
  if (typeof window === 'undefined') {
    // Return a dummy instance for SSR (no cookie ops)
    return new AnalyticsCore(config);
  }
  if (!coreInstance) {
    coreInstance = new AnalyticsCore(config);
  }
  return coreInstance;
}

// For backward compatibility, export a default singleton (will be initialized on first use)
export const analyticsCore = getAnalyticsCore();
