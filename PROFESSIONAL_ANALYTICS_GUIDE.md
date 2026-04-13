# Professional Analytics Implementation Guide

## Overview

This is a **production-grade analytics system** designed for:

- ✅ Professional event tracking
- ✅ User identification and profiling
- ✅ Real-time engagement metrics
- ✅ HTTP/Cookie-based storage (no localStorage/sessionStorage)
- ✅ GDPR/Privacy compliance
- ✅ Error and performance monitoring
- ✅ Conversion and revenue tracking

## Architecture

```
┌─────────────────────────────────────────────────────┐
│         Frontend Application                        │
├─────────────────────────────────────────────────────┤
│  AnalyticsProvider (Root)                           │
│    ├─ AnalyticsServiceV2 (Main Service)            │
│    ├─ SessionManager (HTTP Cookies)                │
│    ├─ UserIdentificationService                    │
│    ├─ EngagementMetricsTracker (Real-time)         │
│    └─ ConsentManager (GDPR)                        │
├─────────────────────────────────────────────────────┤
│  Components / Hooks                                 │
│    ├─ usePageView                                   │
│    ├─ useClickTracking                              │
│    ├─ useFormTracking                               │
│    ├─ useConversionTracking                         │
│    ├─ useEngagementTracking                         │
│    └─ ... (15+ specialized hooks)                  │
├─────────────────────────────────────────────────────┤
│  Event Batching & HTTP                              │
│    └─ Batch Events → POST /api/analytics           │
├─────────────────────────────────────────────────────┤
│  Backend API                                        │
│    ├─ Validation & Processing                      │
│    ├─ Aggregation                                   │
│    └─ External Service Integration                 │
└─────────────────────────────────────────────────────┘
```

## Core Components

### 1. CookieManager

**Purpose**: HTTP-only cookie management for secure storage

```typescript
import { CookieManager } from '@/lib/analytics';

// Set cookie
CookieManager.setCookie('name', 'value', { maxAge: 365 * 24 * 60 * 60 });

// Get cookie
const value = CookieManager.getCookie('name');

// Delete cookie
CookieManager.deleteCookie('name');

// Check if cookies enabled
if (CookieManager.areCookiesEnabled()) {
  // Proceed with analytics
}
```

### 2. SessionManager

**Purpose**: Manage user sessions using HTTP cookies (30-min timeout, 24-hour duration)

```typescript
import { SessionManager } from '@/lib/analytics';

// Get or create session
const session = SessionManager.getOrCreateSession();
console.log(session.sessionId, session.deviceId);

// Set user in session (after login)
SessionManager.setUserInSession('user-123', {
  email: 'user@example.com',
  segment: 'premium',
});

// End session (logout)
SessionManager.endSession();
```

### 3. UserIdentificationService

**Purpose**: Anonymous & identified user tracking with behavior profiling

```typescript
import { UserIdentificationService } from '@/lib/analytics';

// Get or create anonymous profile
const profile = UserIdentificationService.getOrCreateUserProfile();

// Identify user (after login)
UserIdentificationService.identifyUser('user-123', {
  email: 'user@example.com',
  name: 'John Doe',
  segment: 'premium',
  customAttributes: { company: 'Acme Inc.' },
});

// Get behavior profile
const behavior = UserIdentificationService.getBehaviorProfile();

// Export user data (GDPR)
const userData = UserIdentificationService.exportUserData();

// Reset user (logout)
UserIdentificationService.resetUser();
```

### 4. EngagementMetricsTracker

**Purpose**: Real-time engagement and interaction metrics

```typescript
import { EngagementMetricsTracker } from '@/lib/analytics';

// Initialize tracking
EngagementMetricsTracker.initialize();

// Get current metrics
const metrics = EngagementMetricsTracker.getMetrics();
console.log(metrics.totalTimeOnSite, metrics.maxScrollDepth);

// Get engagement score (0-100)
const score = EngagementMetricsTracker.getEngagementScore();

// Record interactions
EngagementMetricsTracker.recordClick();
EngagementMetricsTracker.recordFormInteraction();
EngagementMetricsTracker.recordConversion(100);
EngagementMetricsTracker.recordPageView('/about');
```

### 5. AnalyticsServiceV2

**Purpose**: Main analytics service coordinating all operations

```typescript
import { analytics } from '@/lib/analytics';

// Track page view
analytics.trackPageView('Home', 'https://example.com');

// Track click
analytics.trackClick('Donate Button', element);

// Track form submission
analytics.trackFormSubmission('Contact Form', { name, email });

// Track conversion
analytics.trackConversion('Newsletter Signup', 0);
analytics.trackConversion('Donation', 100);

// Track purchase
analytics.trackPurchase('order-123', 99.99, 'USD', [
  { name: 'Product A', quantity: 1, price: 99.99 },
]);

// Track search
analytics.trackSearch('how to donate', 5);

// Track custom event
analytics.trackCustomEvent('member-joined', {
  membership_tier: 'gold',
  duration_months: 12,
});

// Track media (video/audio)
analytics.trackMediaEvent('play', 'Service Video', 300, 0);
analytics.trackMediaEvent('pause', 'Service Video', 300, 120);
analytics.trackMediaEvent('complete', 'Service Video', 300, 300);

// Track error
analytics.trackError('API Error', 'Failed to fetch data', stack);

// Identify user
analytics.identifyUser('user-123', {
  email: 'user@example.com',
  name: 'John Doe',
  segment: 'premium',
});

// Flush events immediately
await analytics.flush();
```

## Setup Instructions

### Step 1: Update Root Layout

**File**: `src/app/layout.tsx`

```typescript
import AnalyticsProviderV2 from '@/components/providers/AnalyticsProviderV2';
import CookieConsentBanner from '@/components/ui/analytics/CookieConsentBanner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProviderV2
          config={{
            debug: process.env.NODE_ENV === 'development',
          }}
        >
          {children}
          <CookieConsentBanner />
        </AnalyticsProviderV2>
      </body>
    </html>
  );
}
```

### Step 2: Environment Variables

**File**: `.env.local`

```env
# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_API=http://localhost:3000/api/analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Optional: External Analytics Service
ANALYTICS_WEBHOOK_URL=https://your-analytics-service.com/webhook
```

### Step 3: Track Page Views

```typescript
'use client';

import { usePageView } from '@/hooks/useAnalyticsV2';

export default function MyPage() {
  usePageView('My Page Title', 'https://example.com/my-page');

  return <div>Page content</div>;
}
```

## React Hooks Reference

All hooks are in `@/hooks/useAnalyticsV2`:

### Tracking Hooks

```typescript
import {
  usePageView, // Track page views
  useComponentView, // Track component mounts
  useClickTracking, // Track clicks on elements
  useFormTracking, // Track form interactions
  useTimeTracking, // Track time spent
  useScrollTracking, // Track scroll depth
  useMediaTracking, // Track video/audio
  useSearchTracking, // Track searches
  useConversionTracking, // Track conversions
  useErrorTracking, // Track errors
} from '@/hooks/useAnalyticsV2';
```

### Info Hooks

```typescript
import {
  useAnalytics, // Get analytics service
  useEngagementTracking, // Get engagement metrics
  useUserIdentification, // Manage user identity
  useSessionInfo, // Get session info
} from '@/hooks/useAnalyticsV2';
```

## Event Categories & Actions

### Event Categories

- `page_view` - Page views
- `user_engagement` - Clicks, scrolls, interactions
- `conversion` - Goal completions
- `form` - Form submissions
- `media` - Video/audio playback
- `error` - Errors and exceptions
- `performance` - Performance metrics
- `commerce` - E-commerce events
- `social` - Social interactions
- `search` - Search queries
- `custom` - Custom events

### Event Actions

- `view`, `click`, `submit`, `scroll`, `play`, `pause`, `complete`, `error`, `load`, `share`, `search`, `add_to_cart`, `remove_from_cart`, `checkout`, `purchase`, `signup`, `login`, `logout`, `custom`

## Cookie Structure

```
wcm-session-id              → Session ID
wcm-session-data            → Full session data (JSON)
wcm-device-id               → Device ID (persistent)
wcm-user-id                 → Current user ID
wcm-user-profile            → User profile data (JSON)
wcm-behavior-profile        → Behavior analytics (JSON)
wcm-engagement-metrics      → Engagement metrics (JSON)
wcm-consent-preferences     → GDPR consent (JSON)
wcm-tracking-id             → Tracking identifier
```

## API Endpoints

### POST /api/analytics

**Purpose**: Receive and process event batches

**Request**:

```json
{
  "batchId": "batch_1234567890_abc123",
  "events": [
    {
      "id": "evt_1234567890_abc123",
      "timestamp": 1234567890000,
      "category": "page_view",
      "action": "view",
      "label": "Home Page",
      "properties": { ... },
      "context": { ... }
    }
  ],
  "session": { ... },
  "userProfile": { ... },
  "timestamp": 1234567890000
}
```

**Response**:

```json
{
  "success": true,
  "batchId": "batch_1234567890_abc123",
  "eventsProcessed": 15,
  "message": "Analytics events received and processed successfully",
  "processingTime": 45
}
```

### GET /api/analytics (Development)

**Purpose**: Get analytics summary and metrics

### DELETE /api/analytics (Development)

**Purpose**: Clear all analytics data

## Best Practices

### 1. Consent First

Always check consent before tracking:

```typescript
import { ConsentManager } from '@/lib/analytics';

if (ConsentManager.hasConsent('analytics')) {
  analytics.trackCustomEvent('my-event');
}
```

### 2. Batch Events

Events are automatically batched and sent every 30 seconds or when 20 events accumulate.

### 3. Identify Users

After login, always identify the user:

```typescript
const { identifyUser } = useUserIdentification();
identifyUser(userId, { email, name, segment: 'premium' });
```

### 4. Track Conversions

Track all important business events:

```typescript
const { trackConversion, trackPurchase } = useConversionTracking();
trackConversion('newsletter-signup');
trackPurchase('order-123', 99.99, 'USD');
```

### 5. Monitor Performance

Use engagement metrics to track user experience:

```typescript
const { getEngagementScore, getMetrics } = useEngagementTracking();
const score = getEngagementScore(); // 0-100
```

### 6. GDPR Compliance

Export user data on request:

```typescript
const userData = UserIdentificationService.exportUserData();
// Returns: { profile, behavior }
```

## Metrics Dashboard Example

```typescript
'use client';

import { useEngagementTracking } from '@/hooks/useAnalyticsV2';

export function AnalyticsDashboard() {
  const { getMetrics, getEngagementScore } = useEngagementTracking();
  const metrics = getMetrics();
  const score = getEngagementScore();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-gray-500">Engagement Score</p>
        <p className="text-3xl font-bold">{score}/100</p>
      </div>

      <div>
        <p className="text-gray-500">Page Views</p>
        <p className="text-3xl font-bold">{metrics.totalPageViews}</p>
      </div>

      <div>
        <p className="text-gray-500">Time on Site</p>
        <p className="text-3xl font-bold">
          {Math.round(metrics.totalTimeOnSite / 1000)}s
        </p>
      </div>

      <div>
        <p className="text-gray-500">Max Scroll</p>
        <p className="text-3xl font-bold">{metrics.maxScrollDepth}%</p>
      </div>

      <div>
        <p className="text-gray-500">Total Clicks</p>
        <p className="text-3xl font-bold">{metrics.totalClicks}</p>
      </div>

      <div>
        <p className="text-gray-500">Conversions</p>
        <p className="text-3xl font-bold">{metrics.totalConversions}</p>
      </div>

      <div className="col-span-2">
        <p className="text-gray-500">Most Visited Pages</p>
        <div className="space-y-1">
          {metrics.mostedVisitedPages.map((page) => (
            <p key={page.url} className="text-sm">
              {page.url.split('/').pop() || 'home'} ({page.count})
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Troubleshooting

### Events Not Being Tracked

1. Check consent: `ConsentManager.hasConsent('analytics')`
2. Check cookies enabled: `CookieManager.areCookiesEnabled()`
3. Check API endpoint: Verify `NEXT_PUBLIC_ANALYTICS_API` is correct
4. Check network tab: Look for POST requests to `/api/analytics`

### Session Not Persisting

1. Verify cookies are enabled
2. Check cookie max-age settings
3. Verify secure cookie settings (HTTPS required for secure cookies)

### User Not Being Identified

1. Call `identifyUser()` with correct user ID
2. Check `UserIdentificationService.getUserProfile()`
3. Verify session data includes user info

## Performance Considerations

- Events are batched to reduce network calls
- Session timeout: 30 minutes of inactivity
- Session duration: 24 hours maximum
- Metrics updated every 10 seconds
- Scroll tracking debounced
- Light-weight, minimal impact on page performance

## Privacy & Security

✅ **GDPR Compliant**

- Explicit consent required
- Right to be forgotten supported via `exportUserData()`
- Cookie consent banner included

✅ **Secure**

- HTTP-only cookie support
- Secure cookie flag for HTTPS
- SameSite cookie protection
- No sensitive data in cookies

✅ **Privacy-First**

- Anonymous user IDs by default
- Optional explicit identification
- Behavior profiling opt-in
- Easy data export

## Migration from v1

Old hooks still work but new hooks are recommended:

```typescript
// Old (v1)
import { useAnalytics } from '@/hooks/useAnalytics';

// New (v2) - Recommended
import {
  usePageView,
  useClickTracking,
  useFormTracking,
} from '@/hooks/useAnalyticsV2';
```

Replace provider in layout:

```typescript
// Old
import AnalyticsProvider from '@/components/providers/AnalyticsProvider';

// New
import AnalyticsProviderV2 from '@/components/providers/AnalyticsProviderV2';
```

## Support & Monitoring

**Development Mode**:

- Debug logs in console
- GET `/api/analytics` shows summary
- DELETE `/api/analytics` clears data

**Production Mode**:

- Silent operation
- Errors logged but not shown
- External webhook integration

## Next Steps

1. ✅ Install AnalyticsProviderV2 in layout
2. ✅ Add CookieConsentBanner
3. ✅ Track key pages with `usePageView`
4. ✅ Track key conversions with `useConversionTracking`
5. ✅ Identify users after login with `useUserIdentification`
6. ✅ Monitor in development with GET `/api/analytics`
7. ✅ Configure ANALYTICS_WEBHOOK_URL for production integration
