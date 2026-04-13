# Analytics Quick Reference & Common Use Cases

## Installation Checklist

- [ ] Copy new services (v2) to `src/lib/analytics/`
- [ ] Update `src/components/providers/AnalyticsProviderV2.tsx`
- [ ] Copy new hooks `src/hooks/useAnalyticsV2.ts`
- [ ] Update `src/lib/analytics/index.ts`
- [ ] Update `src/app/api/analytics/route.ts`
- [ ] Update root layout with `AnalyticsProviderV2`
- [ ] Add `.env.local` variables
- [ ] Test with dev tools

## 10-Minute Setup

```typescript
// 1. Update layout.tsx
import AnalyticsProviderV2 from '@/components/providers/AnalyticsProviderV2';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsProviderV2>
          {children}
        </AnalyticsProviderV2>
      </body>
    </html>
  );
}

// 2. Add to env.local
NEXT_PUBLIC_ANALYTICS_API=/api/analytics

// 3. Ready to use!
```

## Common Use Cases

### 1. Track Homepage View

```typescript
'use client';
import { usePageView } from '@/hooks/useAnalyticsV2';

export default function Home() {
  usePageView('Home', 'https://example.com');
  return <div>Homepage</div>;
}
```

### 2. Track Donation Button Click

```typescript
'use client';
import { useClickTracking } from '@/hooks/useAnalyticsV2';

export function DonateButton() {
  const clickRef = useClickTracking('Donate Button');
  return <button ref={clickRef} className="btn-primary">Donate Now</button>;
}
```

### 3. Track Form Submission

```typescript
'use client';
import { useFormTracking } from '@/hooks/useAnalyticsV2';
import { useState } from 'react';

export function ContactForm() {
  const { trackSubmit, trackFieldInteraction } = useFormTracking('Contact');
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    trackSubmit(formData);
    // Send form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={(e) => {
          trackFieldInteraction('email', e.target.value);
          setFormData({ ...formData, email: e.target.value });
        }}
      />
      <button>Submit</button>
    </form>
  );
}
```

### 4. Track Purchase

```typescript
'use client';
import { useConversionTracking } from '@/hooks/useAnalyticsV2';

export function CheckoutButton() {
  const { trackPurchase } = useConversionTracking();

  const handlePurchase = async (orderId, amount) => {
    trackPurchase(orderId, amount, 'USD', [
      { name: 'Donation', quantity: 1, price: amount }
    ]);
    // Process payment
  };

  return <button onClick={() => handlePurchase('order-123', 100)}>
    Complete Purchase
  </button>;
}
```

### 5. Track User Login

```typescript
'use client';
import { useUserIdentification } from '@/hooks/useAnalyticsV2';

export function LoginForm() {
  const { identifyUser } = useUserIdentification();

  const handleLogin = async (userId, email) => {
    identifyUser(userId, {
      email,
      segment: 'premium',
      customAttributes: { loginSource: 'web' }
    });
  };

  return <button onClick={() => handleLogin('user-123', 'user@example.com')}>
    Login
  </button>;
}
```

### 6. Track Video Watch Time

```typescript
'use client';
import { useMediaTracking, useTimeTracking } from '@/hooks/useAnalyticsV2';
import { useRef } from 'react';

export function VideoPlayer({ videoTitle }) {
  const { trackPlay, trackPause, trackComplete } = useMediaTracking(videoTitle);
  const videoRef = useRef(null);

  return (
    <video
      ref={videoRef}
      onPlay={() => trackPlay(0)}
      onPause={() => trackPause(videoRef.current?.currentTime)}
      onEnded={() => trackComplete()}
    >
      <source src="video.mp4" type="video/mp4" />
    </video>
  );
}
```

### 7. Track Search Queries

```typescript
'use client';
import { useSearchTracking } from '@/hooks/useAnalyticsV2';
import { useState } from 'react';

export function SearchBox() {
  const { trackSearch } = useSearchTracking();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    trackSearch(query);
    // Perform search
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button>Search</button>
    </form>
  );
}
```

### 8. Track Newsletter Signup

```typescript
'use client';
import { useConversionTracking } from '@/hooks/useAnalyticsV2';

export function NewsletterSignup() {
  const { trackConversion } = useConversionTracking();

  const handleSignup = async (email) => {
    trackConversion('newsletter-signup', 0);
    // Subscribe email
  };

  return <button onClick={() => handleSignup('user@example.com')}>
    Subscribe
  </button>;
}
```

### 9. Track Service Registration

```typescript
'use client';
import { useConversionTracking } from '@/hooks/useAnalyticsV2';

export function EventRegistration() {
  const { trackConversion } = useConversionTracking();

  const handleRegistration = (eventName) => {
    trackConversion(`event-registration-${eventName}`);
    // Register attendee
  };

  return <button onClick={() => handleRegistration('sunday-service')}>
    Register
  </button>;
}
```

### 10. Display Engagement Score

```typescript
'use client';
import { useEngagementTracking } from '@/hooks/useAnalyticsV2';

export function UserEngagementBadge() {
  const { getEngagementScore } = useEngagementTracking();
  const score = getEngagementScore();

  const getLevel = (score) => {
    if (score >= 80) return 'Highly Engaged';
    if (score >= 60) return 'Engaged';
    if (score >= 40) return 'Moderately Engaged';
    return 'New User';
  };

  return (
    <div className="badge">
      {getLevel(score)} ({score}/100)
    </div>
  );
}
```

### 11. Track Scroll Depth

```typescript
'use client';
import { useScrollTracking } from '@/hooks/useAnalyticsV2';

export function ArticlePage() {
  useScrollTracking('article-page');

  return (
    <article>
      <h1>Long Article</h1>
      {/* Content */}
    </article>
  );
}
```

### 12. Track Component View Duration

```typescript
'use client';
import { useTimeTracking } from '@/hooks/useAnalyticsV2';

export function PricingSection() {
  useTimeTracking('pricing-section', 3000); // Track if viewed for 3+ seconds

  return (
    <section>
      <h2>Pricing Plans</h2>
      {/* Pricing plans */}
    </section>
  );
}
```

### 13. Track Donation Milestone

```typescript
'use client';
import { useAnalytics } from '@/hooks/useAnalyticsV2';

export function DonationWall() {
  const analytics = useAnalytics();

  const handleDonation = (amount) => {
    analytics.trackCustomEvent('donation-received', {
      amount,
      donor_count: 10,
      campaign: 'annual-giving',
    });
  };

  return <button onClick={() => handleDonation(500)}>Donate $500</button>;
}
```

### 14. Handle Error Tracking

```typescript
'use client';
import { useErrorTracking } from '@/hooks/useAnalyticsV2';

export function DataFetcher() {
  const { trackError } = useErrorTracking();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('API Error');
    } catch (error) {
      trackError((error as Error).name, (error as Error).message, (error as Error).stack);
    }
  };

  return <button onClick={fetchData}>Load Data</button>;
}
```

### 15. Get Session Information

```typescript
'use client';
import { useSessionInfo } from '@/hooks/useAnalyticsV2';

export function SessionStatus() {
  const { sessionId, deviceId, isActive } = useSessionInfo();

  return (
    <div>
      <p>Session ID: {sessionId.substring(0, 8)}...</p>
      <p>Device: {deviceId.substring(0, 8)}...</p>
      <p>Status: {isActive ? '🟢 Active' : '🔴 Inactive'}</p>
    </div>
  );
}
```

## Real-World Example: Church Website

```typescript
// src/app/events/page.tsx
'use client';

import { usePageView, useClickTracking, useConversionTracking } from '@/hooks/useAnalyticsV2';
import { useRef } from 'react';

export default function EventsPage() {
  usePageView('Events', 'https://church.com/events');
  const registerRef = useClickTracking('Event Register Button');
  const { trackConversion } = useConversionTracking();

  const handleRegister = (eventId, eventName) => {
    trackConversion(`event-registration`, 0, { event_id: eventId, event_name: eventName });
    // Show registration modal
  };

  return (
    <main>
      <h1>Upcoming Events</h1>

      <div className="event-card">
        <h2>Sunday Service</h2>
        <p>Every Sunday at 10:00 AM</p>
        <button
          ref={registerRef}
          onClick={() => handleRegister('sunday-service', 'Sunday Service')}
        >
          Register Now
        </button>
      </div>

      <div className="event-card">
        <h2>Bible Study</h2>
        <p>Wednesdays at 7:00 PM</p>
        <button
          ref={registerRef}
          onClick={() => handleRegister('bible-study', 'Bible Study')}
        >
          Register Now
        </button>
      </div>
    </main>
  );
}
```

## Development Debugging

```typescript
// Check analytics in console
const { analytics } = require('@/lib/analytics');

// Get session
console.log(analytics.getSession());

// Get user profile
console.log(analytics.getUserProfile());

// Get engagement metrics
console.log(analytics.getEngagementMetrics());

// Manual event flush
await analytics.flush();
```

## Monitoring API

**Development only** - Check analytics dashboard:

```bash
# Get summary
curl http://localhost:3000/api/analytics

# Clear all data
curl -X DELETE http://localhost:3000/api/analytics
```

Response includes:

```json
{
  "aggregatedMetrics": {
    "totalEvents": 150,
    "uniqueSessions": 5,
    "uniqueUsers": 3,
    "eventsByCategory": {
      "page_view": 45,
      "user_engagement": 60,
      "conversion": 5,
      "form": 40
    }
  },
  "recentBatches": [ ... ]
}
```

## Key Metrics to Monitor

### User Engagement

- **Engagement Score**: 0-100 (automatic calculation)
- **Page Views**: Track page traffic
- **Scroll Depth**: User interest indicator
- **Time on Page**: Content engagement

### Conversions

- **Newsletter Signups**: Marketing effectiveness
- **Event Registrations**: Event popularity
- **Donations**: Revenue tracking
- **Form Completions**: Lead generation

### Technical

- **Error Rate**: System health
- **Session Duration**: Visit length
- **Device Distribution**: Mobile vs desktop
- **Traffic Sources**: Where users come from

## Type-Safe API

All services are fully typed with TypeScript:

```typescript
// All types available
import type {
  AnalyticsEvent,
  EventProperties,
  EventCategory,
  UserProfile,
  SessionData,
  EngagementMetrics,
} from '@/lib/analytics';
```

## Performance Tips

1. **Lazy load analytics** for faster page loads
2. **Batch events** - automatically batched
3. **Use hooks** - optimized React integration
4. **Check consent** - before tracking
5. **Profile in dev** - use browser dev tools

## Troubleshooting

### Events not showing up

```typescript
// Check consent
import { ConsentManager } from '@/lib/analytics';
console.log(ConsentManager.hasConsent('analytics')); // Should be true

// Check cookies enabled
console.log(CookieManager.areCookiesEnabled()); // Should be true

// Check API endpoint
console.log(process.env.NEXT_PUBLIC_ANALYTICS_API);
```

### Cookies not persisting

- Verify no incognito mode
- Check cookie settings in browser
- Ensure HTTPS for secure cookies

### User not identified

- Call identifyUser() after login
- Check UserIdentificationService.getUserProfile()
- Verify session includes user info

## Next Steps

1. **Integrate** - Follow 10-minute setup
2. **Test** - Use development dashboard
3. **Deploy** - Production ready
4. **Monitor** - Use analytics dashboard
5. **Optimize** - Based on metrics

For full documentation, see `PROFESSIONAL_ANALYTICS_GUIDE.md`
