export interface ConsentSettings {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface StoredConsent extends ConsentSettings {
  updatedAt: string;
  version: 1;
}

export const CONSENT_COOKIE = 'wc_cookie_preferences_data';
export const CONSENT_EVENT = 'wc:cookie-consent-updated';
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export const DEFAULT_CONSENT: ConsentSettings = {
  analytics: false,
  marketing: false,
  functional: true,
};

export function readStoredConsent(): StoredConsent | null {
  if (typeof document === 'undefined') return null;
  const raw = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(
      decodeURIComponent(raw)
    ) as Partial<StoredConsent> & {
      essential?: boolean;
    };
    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      functional: parsed.functional ?? parsed.essential ?? true,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
      version: 1,
    };
  } catch {
    return null;
  }
}

export function writeStoredConsent(consent: ConsentSettings): StoredConsent {
  const stored: StoredConsent = {
    ...consent,
    functional: true,
    updatedAt: new Date().toISOString(),
    version: 1,
  };
  if (typeof document === 'undefined') return stored;

  const options = `Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(stored))}; ${options}`;
  document.cookie = `wc_cookie_consent=1; ${options}`;
  document.cookie = `wc_cookie_analytics=${stored.analytics ? '1' : '0'}; ${options}`;
  document.cookie = `wc_cookie_marketing=${stored.marketing ? '1' : '0'}; ${options}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: stored }));
  return stored;
}
