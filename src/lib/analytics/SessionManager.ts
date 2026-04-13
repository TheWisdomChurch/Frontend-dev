/**
 * Session Manager - Professional Session Management
 * Manages user sessions using HTTP cookies
 * Tracks session lifecycle and activity
 */

import { CookieManager } from './CookieManager';
import { v4 as uuidv4 } from 'uuid';

export interface SessionData {
  sessionId: string;
  userId?: string;
  createdAt: number;
  lastActivityAt: number;
  expiresAt: number;
  deviceId: string;
  source?: string;
  referrer?: string;
  metadata?: Record<string, any>;
}

export class SessionManager {
  private static SESSION_COOKIE_NAME = 'wcm-session-id';
  private static SESSION_DATA_COOKIE_NAME = 'wcm-session-data';
  private static SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Create or get session
   */
  static getOrCreateSession(): SessionData {
    let session = this.getSession();

    if (!session || this.isSessionExpired(session)) {
      session = this.createNewSession();
      this.saveSession(session);
    } else {
      // Update last activity
      session.lastActivityAt = Date.now();
      this.saveSession(session);
    }

    return session;
  }

  /**
   * Get current session
   */
  static getSession(): SessionData | null {
    const sessionId = CookieManager.getCookie(this.SESSION_COOKIE_NAME);
    if (!sessionId) return null;

    const sessionData = CookieManager.getCookieAsJSON<SessionData>(
      this.SESSION_DATA_COOKIE_NAME
    );

    return sessionData;
  }

  /**
   * Create new session
   */
  private static createNewSession(): SessionData {
    const now = Date.now();
    const deviceId = this.getOrCreateDeviceId();

    return {
      sessionId: uuidv4(),
      createdAt: now,
      lastActivityAt: now,
      expiresAt: now + this.SESSION_DURATION,
      deviceId,
      source: document.referrer || 'direct',
      referrer: document.referrer,
      metadata: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    };
  }

  /**
   * Save session to cookie
   */
  private static saveSession(session: SessionData): void {
    CookieManager.setCookie(this.SESSION_COOKIE_NAME, session.sessionId, {
      maxAge: 24 * 60 * 60,
    });

    CookieManager.setCookieAsJSON(this.SESSION_DATA_COOKIE_NAME, session, {
      maxAge: 24 * 60 * 60,
    });
  }

  /**
   * Check if session is expired
   */
  private static isSessionExpired(session: SessionData): boolean {
    const now = Date.now();
    return (
      now > session.expiresAt ||
      now - session.lastActivityAt > this.SESSION_TIMEOUT
    );
  }

  /**
   * Set user in session
   */
  static setUserInSession(
    userId: string,
    metadata?: Record<string, any>
  ): void {
    const session = this.getOrCreateSession();
    session.userId = userId;
    session.metadata = { ...session.metadata, ...metadata };
    this.saveSession(session);
  }

  /**
   * Get or create device ID
   */
  private static getOrCreateDeviceId(): string {
    const DEVICE_ID_COOKIE = 'wcm-device-id';
    let deviceId = CookieManager.getCookie(DEVICE_ID_COOKIE);

    if (!deviceId) {
      deviceId = uuidv4();
      CookieManager.setCookie(DEVICE_ID_COOKIE, deviceId, {
        maxAge: 365 * 24 * 60 * 60, // 1 year
      });
    }

    return deviceId;
  }

  /**
   * End session
   */
  static endSession(): void {
    CookieManager.deleteCookie(this.SESSION_COOKIE_NAME);
    CookieManager.deleteCookie(this.SESSION_DATA_COOKIE_NAME);
  }

  /**
   * Get session ID
   */
  static getSessionId(): string {
    return this.getOrCreateSession().sessionId;
  }

  /**
   * Get device ID
   */
  static getDeviceId(): string {
    return this.getOrCreateSession().deviceId;
  }

  /**
   * Record user activity
   */
  static recordActivity(): void {
    const session = this.getSession();
    if (session) {
      session.lastActivityAt = Date.now();
      this.saveSession(session);
    }
  }
}
