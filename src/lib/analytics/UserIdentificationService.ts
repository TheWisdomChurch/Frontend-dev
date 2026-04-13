/**
 * User Identification & Profiling Service
 * Professional user tracking and profiling
 * Privacy-first approach with explicit identification
 */

import { CookieManager } from './CookieManager';

export interface UserProfile {
  anonymousId: string;
  userId?: string;
  email?: string;
  name?: string;
  segment?: string;
  customAttributes?: Record<string, any>;
  createdAt: number;
  lastUpdatedAt: number;
  identificationMethod: 'anonymous' | 'explicit' | 'email' | 'account';
}

export interface UserBehaviorProfile {
  totalViews: number;
  totalInteractions: number;
  averageTimePerSession: number;
  lastSeen: number;
  preferredDevice: 'mobile' | 'tablet' | 'desktop';
  preferredBrowser: string;
  topPages: string[];
  conversionPoints: string[];
  engagementScore: number; // 0-100
}

export class UserIdentificationService {
  private static USER_COOKIE_NAME = 'wcm-user-id';
  private static USER_PROFILE_COOKIE_NAME = 'wcm-user-profile';
  private static ANONYMOUS_ID_COOKIE_NAME = 'wcm-anonymous-id';
  private static BEHAVIOR_PROFILE_COOKIE_NAME = 'wcm-behavior-profile';

  /**
   * Get or create user profile
   */
  static getOrCreateUserProfile(): UserProfile {
    let profile = this.getUserProfile();

    if (!profile) {
      profile = this.createAnonymousProfile();
      this.saveUserProfile(profile);
    }

    return profile;
  }

  /**
   * Get current user profile
   */
  static getUserProfile(): UserProfile | null {
    return CookieManager.getCookieAsJSON<UserProfile>(
      this.USER_PROFILE_COOKIE_NAME
    );
  }

  /**
   * Create anonymous profile
   */
  private static createAnonymousProfile(): UserProfile {
    const anonymousId = this.generateAnonymousId();

    return {
      anonymousId,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now(),
      identificationMethod: 'anonymous',
    };
  }

  /**
   * Generate anonymous ID
   */
  private static generateAnonymousId(): string {
    let anonymousId = CookieManager.getCookie(this.ANONYMOUS_ID_COOKIE_NAME);

    if (!anonymousId) {
      // Create a fingerprint-based anonymous ID
      const fingerprint = this.generateFingerprint();
      anonymousId = `anon_${fingerprint}`;
      CookieManager.setCookie(this.ANONYMOUS_ID_COOKIE_NAME, anonymousId, {
        maxAge: 365 * 24 * 60 * 60, // 1 year
      });
    }

    return anonymousId;
  }

  /**
   * Generate browser fingerprint
   */
  private static generateFingerprint(): string {
    const data = [
      navigator.userAgent,
      navigator.language,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      new Date().getTimezoneOffset(),
      screen.width,
      screen.height,
      screen.colorDepth,
    ].join('|');

    return this.simpleHash(data);
  }

  /**
   * Simple hash function for fingerprint
   */
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Identify user (e.g., after login)
   */
  static identifyUser(
    userId: string,
    attributes?: {
      email?: string;
      name?: string;
      segment?: string;
      customAttributes?: Record<string, any>;
    }
  ): UserProfile {
    const profile = this.getOrCreateUserProfile();

    profile.userId = userId;
    profile.email = attributes?.email;
    profile.name = attributes?.name;
    profile.segment = attributes?.segment;
    profile.customAttributes = attributes?.customAttributes;
    profile.identificationMethod = 'explicit';
    profile.lastUpdatedAt = Date.now();

    this.saveUserProfile(profile);

    // Set user cookie for backend access
    CookieManager.setCookie(this.USER_COOKIE_NAME, userId, {
      maxAge: 365 * 24 * 60 * 60,
    });

    return profile;
  }

  /**
   * Update user profile
   */
  static updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const profile = this.getOrCreateUserProfile();

    const updated = {
      ...profile,
      ...updates,
      lastUpdatedAt: Date.now(),
    };

    this.saveUserProfile(updated);
    return updated;
  }

  /**
   * Save user profile to cookie
   */
  private static saveUserProfile(profile: UserProfile): void {
    CookieManager.setCookieAsJSON(this.USER_PROFILE_COOKIE_NAME, profile, {
      maxAge: 365 * 24 * 60 * 60,
    });
  }

  /**
   * Get anonymous ID
   */
  static getAnonymousId(): string {
    const profile = this.getOrCreateUserProfile();
    return profile.anonymousId;
  }

  /**
   * Get user ID (if identified)
   */
  static getUserId(): string | undefined {
    const profile = this.getOrCreateUserProfile();
    return profile.userId;
  }

  /**
   * Get behavior profile
   */
  static getBehaviorProfile(): UserBehaviorProfile | null {
    return CookieManager.getCookieAsJSON<UserBehaviorProfile>(
      this.BEHAVIOR_PROFILE_COOKIE_NAME
    );
  }

  /**
   * Update behavior profile
   */
  static updateBehaviorProfile(updates: Partial<UserBehaviorProfile>): void {
    const current = this.getBehaviorProfile() || {
      totalViews: 0,
      totalInteractions: 0,
      averageTimePerSession: 0,
      lastSeen: Date.now(),
      preferredDevice: 'desktop',
      preferredBrowser: '',
      topPages: [],
      conversionPoints: [],
      engagementScore: 0,
    };

    const updated = {
      ...current,
      ...updates,
      lastSeen: Date.now(),
    };

    CookieManager.setCookieAsJSON(this.BEHAVIOR_PROFILE_COOKIE_NAME, updated, {
      maxAge: 365 * 24 * 60 * 60,
    });
  }

  /**
   * Reset user (logout)
   */
  static resetUser(): void {
    CookieManager.deleteCookie(this.USER_COOKIE_NAME);
    CookieManager.deleteCookie(this.USER_PROFILE_COOKIE_NAME);
    CookieManager.deleteCookie(this.BEHAVIOR_PROFILE_COOKIE_NAME);

    // Recreate as anonymous
    const profile = this.createAnonymousProfile();
    this.saveUserProfile(profile);
  }

  /**
   * Export user data (GDPR)
   */
  static exportUserData(): {
    profile: UserProfile | null;
    behavior: UserBehaviorProfile | null;
  } {
    return {
      profile: this.getUserProfile(),
      behavior: this.getBehaviorProfile(),
    };
  }
}
