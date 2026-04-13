/**
 * Cookie Consent Manager
 * GDPR/CCPA compliant consent management system
 */

import { ConsentPreferences, ConsentCategory } from './types';

const CONSENT_COOKIE_NAME = 'wcm-consent-preferences';
const CONSENT_VERSION = 1;
const COOKIE_EXPIRY_DAYS = 365;

export class ConsentManager {
  private static readonly STORAGE_KEY = CONSENT_COOKIE_NAME;
  private static readonly VERSION = CONSENT_VERSION;

  /**
   * Get current consent preferences
   */
  static getConsent(): ConsentPreferences {
    try {
      if (typeof window === 'undefined') return this.getDefaultConsent();

      const stored = this.getCookie(this.STORAGE_KEY);
      if (!stored) return this.getDefaultConsent();

      const parsed = JSON.parse(
        decodeURIComponent(stored)
      ) as ConsentPreferences;

      // Check if version matches
      if (parsed.version !== this.VERSION) {
        return this.getDefaultConsent();
      }

      return parsed;
    } catch (error) {
      console.error('[ConsentManager] Error getting consent:', error);
      return this.getDefaultConsent();
    }
  }

  /**
   * Set consent preferences
   */
  static setConsent(preferences: Partial<ConsentPreferences>): void {
    try {
      if (typeof window === 'undefined') return;

      const current = this.getConsent();
      const updated: ConsentPreferences = {
        necessary: true, // Always true
        analytics: preferences.analytics ?? current.analytics ?? false,
        marketing: preferences.marketing ?? current.marketing ?? false,
        personalization:
          preferences.personalization ?? current.personalization ?? false,
        timestamp: Date.now(),
        version: this.VERSION,
      };

      this.setCookie(
        this.STORAGE_KEY,
        JSON.stringify(updated),
        COOKIE_EXPIRY_DAYS
      );

      // Dispatch custom event for consent changes
      this.dispatchConsentChangeEvent(updated);
    } catch (error) {
      console.error('[ConsentManager] Error setting consent:', error);
    }
  }

  /**
   * Check if specific category is consented
   */
  static hasConsent(category: ConsentCategory): boolean {
    const consent = this.getConsent();
    if (category === 'necessary') return true; // Always true
    return consent[category] ?? false;
  }

  /**
   * Accept all consents
   */
  static acceptAll(): void {
    this.setConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    });
  }

  /**
   * Reject optional consents
   */
  static rejectAll(): void {
    this.setConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    });
  }

  /**
   * Accept specific categories
   */
  static updateConsent(categories: Partial<ConsentPreferences>): void {
    this.setConsent(categories);
  }

  /**
   * Reset consent to default
   */
  static resetConsent(): void {
    if (typeof window === 'undefined') return;
    this.deleteCookie(this.STORAGE_KEY);
    this.dispatchConsentChangeEvent(this.getDefaultConsent());
  }

  /**
   * Check if consent was given (not first visit)
   */
  static isConsentGiven(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      return !!this.getCookie(this.STORAGE_KEY);
    } catch {
      return false;
    }
  }

  /**
   * Get consent timestamp
   */
  static getConsentTimestamp(): number {
    return this.getConsent().timestamp;
  }

  /**
   * Cookie Management Utilities
   */
  private static setCookie(name: string, value: string, days: number): void {
    try {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = `expires=${date.toUTCString()}`;
      const domain = this.getDomain();
      const secure = this.isSecure() ? 'Secure' : '';
      const sameSite = 'SameSite=Lax';

      const cookieString = `${name}=${encodeURIComponent(
        value
      )}; ${expires}; path=/;${domain}${secure ? ` ${secure};` : ''} ${sameSite}`;

      document.cookie = cookieString;
    } catch (error) {
      console.error('[ConsentManager] Error setting cookie:', error);
    }
  }

  private static getCookie(name: string): string | null {
    try {
      const nameEQ = `${name}=`;
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
          return cookie.substring(nameEQ.length);
        }
      }
      return null;
    } catch (error) {
      console.error('[ConsentManager] Error getting cookie:', error);
      return null;
    }
  }

  private static deleteCookie(name: string): void {
    try {
      const domain = this.getDomain();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain}`;
    } catch (error) {
      console.error('[ConsentManager] Error deleting cookie:', error);
    }
  }

  private static getDomain(): string {
    try {
      const hostname = window.location.hostname;
      // For production, use the main domain
      if (hostname && !hostname.includes('localhost')) {
        const parts = hostname.split('.');
        if (parts.length > 1) {
          return `; domain=.${parts.slice(-2).join('.')}`;
        }
      }
    } catch (error) {
      console.error('[ConsentManager] Error getting domain:', error);
    }
    return '';
  }

  private static isSecure(): boolean {
    try {
      return window.location.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private static getDefaultConsent(): ConsentPreferences {
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
      timestamp: Date.now(),
      version: this.VERSION,
    };
  }

  private static dispatchConsentChangeEvent(
    preferences: ConsentPreferences
  ): void {
    try {
      window.dispatchEvent(
        new CustomEvent('consent-change', { detail: preferences })
      );
    } catch (error) {
      console.error('[ConsentManager] Error dispatching consent event:', error);
    }
  }
}

export default ConsentManager;
