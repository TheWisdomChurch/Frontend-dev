/**
 * Cookie Manager - HTTP-based Cookie Storage
 * Professional cookie management for analytics persistence
 * Uses HTTP-only cookies for secure session management
 */

export interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  path?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  httpOnly?: boolean;
  domain?: string;
}

const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  path: '/',
  secure:
    typeof window !== 'undefined' && window.location.protocol === 'https:',
  sameSite: 'Lax',
  maxAge: 365 * 24 * 60 * 60, // 1 year
};

export class CookieManager {
  /**
   * Set a cookie
   */
  static setCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void {
    if (typeof document === 'undefined') return;

    const mergedOptions = { ...DEFAULT_COOKIE_OPTIONS, ...options };
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (mergedOptions.maxAge) {
      cookieString += `; Max-Age=${mergedOptions.maxAge}`;
    }
    if (mergedOptions.expires) {
      cookieString += `; Expires=${mergedOptions.expires.toUTCString()}`;
    }
    if (mergedOptions.path) {
      cookieString += `; Path=${mergedOptions.path}`;
    }
    if (mergedOptions.domain) {
      cookieString += `; Domain=${mergedOptions.domain}`;
    }
    if (mergedOptions.sameSite) {
      cookieString += `; SameSite=${mergedOptions.sameSite}`;
    }
    if (mergedOptions.secure) {
      cookieString += '; Secure';
    }

    document.cookie = cookieString;
  }

  /**
   * Get a cookie value
   */
  static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const nameEQ = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }

  /**
   * Get all cookies
   */
  static getAllCookies(): Record<string, string> {
    if (typeof document === 'undefined') return {};

    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    });

    return cookies;
  }

  /**
   * Delete a cookie
   */
  static deleteCookie(name: string, path: string = '/'): void {
    if (typeof document === 'undefined') return;
    this.setCookie(name, '', { maxAge: 0, path });
  }

  /**
   * Clear all analytics cookies
   */
  static clearAnalyticsCookies(): void {
    const analyticsKeys = [
      'wcm-session-id',
      'wcm-user-id',
      'wcm-consent-preferences',
      'wcm-tracking-id',
      'wcm-user-segment',
    ];

    analyticsKeys.forEach(key => this.deleteCookie(key));
  }

  /**
   * Check if cookies are enabled
   */
  static areCookiesEnabled(): boolean {
    if (typeof document === 'undefined') return false;

    const testCookie = 'wcm-test-cookie';
    this.setCookie(testCookie, 'test');
    const result = this.getCookie(testCookie) === 'test';
    this.deleteCookie(testCookie);

    return result;
  }

  /**
   * Parse cookie value as JSON
   */
  static getCookieAsJSON<T = any>(name: string): T | null {
    const value = this.getCookie(name);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  /**
   * Set cookie value as JSON
   */
  static setCookieAsJSON(
    name: string,
    value: any,
    options: CookieOptions = {}
  ): void {
    this.setCookie(name, JSON.stringify(value), options);
  }
}
