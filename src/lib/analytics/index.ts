/**
 * Analytics Library - Professional Analytics Platform
 * Enterprise-grade analytics with HTTP/Cookie-based architecture
 * Version 2.0
 */

// Core services (v1 - legacy)
export { AnalyticsService } from './AnalyticsService';
export { ConsentManager } from './ConsentManager';
export * from './types';

// New services (v2 - recommended)
export { CookieManager } from './CookieManager';
export { SessionManager, type SessionData } from './SessionManager';
export {
  UserIdentificationService,
  type UserProfile,
  type UserBehaviorProfile,
} from './UserIdentificationService';
export {
  EngagementMetricsTracker,
  type EngagementMetrics,
} from './EngagementMetricsTracker';
export {
  EventFactory,
  type AnalyticsEvent,
  type EventProperties,
  type EventCategory,
  type EventAction,
} from './EventFactory';
export {
  AnalyticsServiceV2,
  analytics,
  type AnalyticsConfig,
  type BatchPayload,
} from './AnalyticsServiceV2';

/**
 * PROFESSIONAL ANALYTICS SETUP GUIDE
 * ===================================
 *
 * This is a complete, enterprise-grade analytics system with:
 * ✅ HTTP/Cookie-based session management (no localStorage)
 * ✅ Professional event taxonomy
 * ✅ User identification & profiling
 * ✅ Real-time engagement metrics
 * ✅ Error and performance tracking
 * ✅ Conversion tracking
 * ✅ GDPR/Privacy compliant
 * ✅ Batched event processing
 * ✅ Automatic consent checking
 *
 * QUICK START
 * ===========
 *
 * 1. Update providers.tsx:
 *    import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';
 *
 *    export default function Providers({ children }: { children: React.ReactNode }) {
 *      return (
 *        <AnalyticsProvider config={{ debug: true }}>
 *          {children}
 *        </AnalyticsProvider>
 *      );
 *    }
 *
 * 2. Update layout.tsx:
 *    import Providers from './providers';
 *    import CookieConsentBanner from '@/components/ui/analytics/CookieConsentBanner';
 *
 *    export default function RootLayout({ children }) {
 *      return (
 *        <html>
 *          <body>
 *            <Providers>
 *              {children}
 *              <CookieConsentBanner />
 *            </Providers>
 *          </body>
 *        </html>
 *      );
 *    }
 *
 * 3. Use analytics in components:
 *
 *    // Basic page view tracking
 *    'use client';
 *    import { usePageView } from '@/hooks/useAnalyticsV2';
 *
 *    export default function MyPage() {
 *      usePageView('My Page Title');
 *      return <div>Page content</div>;
 *    }
 *
 *    // Track clicks
 *    'use client';
 *    import { useClickTracking } from '@/hooks/useAnalyticsV2';
 *
 *    export function MyButton() {
 *      const clickRef = useClickTracking('My Button');
 *      return <button ref={clickRef}>Click Me</button>;
 *    }
 *
 *    // Track form submission
 *    'use client';
 *    import { useFormTracking } from '@/hooks/useAnalyticsV2';
 *
 *    export function MyForm() {
 *      const { trackSubmit, trackFieldInteraction } = useFormTracking('Contact');
 *
 *      return (
 *        <form onSubmit={(e) => {
 *          e.preventDefault();
 *          trackSubmit({ name, email });
 *        }}>
 *          <input onChange={(e) => trackFieldInteraction('email', e.target.value)} />
 *          <button>Submit</button>
 *        </form>
 *      );
 *    }
 *
 *    // Track conversions
 *    'use client';
 *    import { useConversionTracking } from '@/hooks/useAnalyticsV2';
 *
 *    export function DonateButton() {
 *      const { trackPurchase } = useConversionTracking();
 *
 *      return (
 *        <button onClick={() => trackPurchase('order-123', 100, 'USD')}>
 *          Donate $100
 *        </button>
 *      );
 *    }
 *
 *    // Track user identification
 *    'use client';
 *    import { useUserIdentification } from '@/hooks/useAnalyticsV2';
 *
 *    export function LoginComponent() {
 *      const { identifyUser } = useUserIdentification();
 *
 *      const handleLogin = (userId, email) => {
 *        identifyUser(userId, { email, segment: 'premium' });
 *      };
 *
 *      return <button onClick={() => handleLogin('user-123', 'user@example.com')}>Login</button>;
 *    }
 *
 *    // Get engagement metrics
 *    'use client';
 *    import { useEngagementTracking } from '@/hooks/useAnalyticsV2';
 *
 *    export function MetricsDashboard() {
 *      const { getMetrics, getEngagementScore } = useEngagementTracking();
 *      const metrics = getMetrics();
 *      const score = getEngagementScore();
 *
 *      return (
 *        <div>
 *          <p>Engagement Score: {score}/100</p>
 *          <p>Total Time: {Math.round(metrics.totalTimeOnSite / 1000)}s</p>
 *          <p>Page Views: {metrics.totalPageViews}</p>
 *        </div>
 *      );
 *    }
 *
 * ADVANCED USAGE
 * ==============
 *
 * Direct Service Usage:
 *   import { analytics } from '@/lib/analytics';
 *
 *   // Track custom events
 *   analytics.trackCustomEvent('my-event', { custom_prop: 'value' });
 *
 *   // Identify user
 *   analytics.identifyUser('user-123', { email: 'user@example.com' });
 *
 *   // Get session info
 *   const session = analytics.getSession();
 *   const userId = session?.userId;
 *
 *   // Flush events immediately
 *   await analytics.flush();
 *
 * Cookie Management:
 *   import { CookieManager } from '@/lib/analytics';
 *
 *   // Get/Set cookies
 *   const value = CookieManager.getCookie('my-cookie');
 *   CookieManager.setCookie('my-cookie', 'value');
 *
 * Session Management:
 *   import { SessionManager } from '@/lib/analytics';
 *
 *   // Get session
 *   const session = SessionManager.getOrCreateSession();
 *   console.log(session.sessionId, session.deviceId);
 *
 * User Profiling:
 *   import { UserIdentificationService } from '@/lib/analytics';
 *
 *   // Get user profile
 *   const profile = UserIdentificationService.getOrCreateUserProfile();
 *   console.log(profile.anonymousId, profile.userId);
 *
 *   // Export user data (GDPR)
 *   const data = UserIdentificationService.exportUserData();
 *
 * Engagement Tracking:
 *   import { EngagementMetricsTracker } from '@/lib/analytics';
 *
 *   // Get metrics
 *   const metrics = EngagementMetricsTracker.getMetrics();
 *   const score = EngagementMetricsTracker.getEngagementScore();
 *
 * EVENT TAXONOMY
 * ==============
 *
 * Categories:
 *   - page_view: User views a page
 *   - user_engagement: General engagement (clicks, scrolls)
 *   - conversion: Goal completions
 *   - form: Form interactions
 *   - media: Video/audio playback
 *   - error: Errors and exceptions
 *   - performance: Performance metrics
 *   - commerce: E-commerce events
 *   - social: Social interactions
 *   - search: Search queries
 *   - custom: Custom events
 *
 * METRICS TRACKED
 * ===============
 *
 * Time Metrics:
 *   - Total time on site
 *   - Average time per page
 *   - Session duration
 *
 * Interaction Metrics:
 *   - Page views
 *   - Clicks
 *   - Scrolls
 *   - Form interactions
 *
 * Engagement Quality:
 *   - Scroll depth
 *   - Bounce rate
 *   - Engagement score (0-100)
 *
 * Device & Browser:
 *   - Device type (mobile/tablet/desktop)
 *   - Browser info
 *   - OS info
 */
