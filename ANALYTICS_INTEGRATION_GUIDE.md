# Professional Analytics Integration Guide

## 🎯 Overview

This document outlines the professional analytics system implemented for the Wisdom Church website. The system provides:

- **User Action Tracking** - Track page views, clicks, form submissions, and custom events
- **Engagement Metrics** - Monitor time on page, scroll depth, interaction counts
- **Cookie-Based Consent** - GDPR/CCPA compliant consent management
- **Privacy-First Design** - Only track with explicit user consent
- **Real-Time Dashboard** - Development mode analytics dashboard

---

## 📦 Architecture

### Core Components

1. **AnalyticsService** (`src/lib/analytics/AnalyticsService.ts`)
   - Main tracking service
   - Event queue management
   - Batch event sending
   - Automatic tracking setup

2. **ConsentManager** (`src/lib/analytics/ConsentManager.ts`)
   - Cookie-based consent storage
   - GDPR/CCPA compliance
   - Consent preference management

3. **React Hooks** (`src/hooks/useAnalytics.ts`)
   - Easy component integration
   - Custom hooks for different tracking scenarios
   - Consent management hooks

4. **UI Components**
   - `CookieConsentBanner` - Professional consent interface
   - `AnalyticsDashboard` - Real-time metrics display

5. **API Route** (`src/app/api/analytics/route.ts`)
   - Handle analytics events from frontend
   - Batch processing and storage

---

## 🚀 Setup Instructions

### 1. Already Integrated in Layout

The analytics system is already set up in `src/app/layout.tsx`:

```tsx
import AnalyticsProvider from '@/components/providers/AnalyticsProvider';
import CookieConsentBanner from '@/components/ui/analytics/CookieConsentBanner';
import AnalyticsDashboard from '@/components/ui/analytics/AnalyticsDashboard';

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      {/* Other providers */}
      {children}
      <CookieConsentBanner ... />
      <AnalyticsDashboard ... />
    </AnalyticsProvider>
  );
}
```

### 2. Tracking Page Views

```tsx
import { usePageView } from '@/hooks/useAnalytics';

export default function MyPage() {
  usePageView('My Page Title');
  return <div>Page content</div>;
}
```

### 3. Tracking Component Views

```tsx
import { useComponentView } from '@/hooks/useAnalytics';

export function MyComponent() {
  useComponentView('MyComponent', '/my-page');
  return <div>Component content</div>;
}
```

### 4. Tracking Clicks

```tsx
import { useClickTracking } from '@/hooks/useAnalytics';

export function MyButton() {
  const clickRef = useClickTracking('My Button Click');
  return (
    <button ref={clickRef} className="...">
      Click me
    </button>
  );
}
```

### 5. Form Tracking

```tsx
import { useFormTracking } from '@/hooks/useAnalytics';

export function ContactForm() {
  const { trackFieldChange, trackSubmit } = useFormTracking('Contact Form');

  const handleChange = (field, value) => {
    trackFieldChange(field, value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    trackSubmit({ name, email, message });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={e => handleChange('name', e.target.value)}
        placeholder="Name"
      />
      <input
        onChange={e => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 6. Custom Event Tracking

```tsx
import { useEventTracking } from '@/hooks/useAnalytics';

export function DonateButton() {
  const trackEvent = useEventTracking();

  const handleDonate = amount => {
    trackEvent('Donation', {
      amount,
      method: 'stripe',
      timestamp: Date.now(),
    });
  };

  return <button onClick={() => handleDonate(100)}>Donate $100</button>;
}
```

### 7. Link Tracking

```tsx
import { useLinkTracking } from '@/hooks/useAnalytics';

export function ExternalLink() {
  const linkRef = useLinkTracking('https://example.com', 'Learn More');
  return (
    <a ref={linkRef} href="https://example.com">
      Learn More
    </a>
  );
}
```

### 8. CTA Tracking

```tsx
import { useCTATracking } from '@/hooks/useAnalytics';

export function BookServiceButton() {
  const trackCTA = useCTATracking('Book Service Button', 'primary-cta');

  return (
    <button
      onClick={trackCTA}
      className="bg-blue-600 text-white px-6 py-2 rounded"
    >
      Book Service
    </button>
  );
}
```

### 9. Search Tracking

```tsx
import { useSearchTracking } from '@/hooks/useAnalytics';

export function SearchBar() {
  const trackSearch = useSearchTracking();

  const handleSearch = query => {
    const results = performSearch(query);
    trackSearch(query, results.length);
  };

  return (
    <input
      onKeyDown={e => {
        if (e.key === 'Enter') {
          handleSearch(e.target.value);
        }
      }}
      placeholder="Search..."
    />
  );
}
```

### 10. Engagement Tracking

```tsx
import {
  useEngagementTracking,
  useEngagementMetrics,
} from '@/hooks/useAnalytics';

export function HeroSection() {
  const engagementRef = useEngagementTracking('hero-section');
  const metrics = useEngagementMetrics();

  return (
    <section ref={engagementRef} className="...">
      {/* Content */}
      <p>You've spent {metrics.timeOnPage}ms on this page</p>
      <p>Scroll depth: {metrics.scrollDepth}%</p>
    </section>
  );
}
```

---

## 🍪 Consent Management

### Getting Consent Status

```tsx
import { useConsentManager } from '@/hooks/useAnalytics';

export function ConsentStatus() {
  const { consent, hasConsent, acceptAll, rejectAll, updateConsent } =
    useConsentManager();

  return (
    <div>
      <p>Analytics: {hasConsent('analytics') ? 'Enabled' : 'Disabled'}</p>
      <p>Marketing: {hasConsent('marketing') ? 'Enabled' : 'Disabled'}</p>

      <button onClick={acceptAll}>Accept All</button>
      <button onClick={rejectAll}>Reject All</button>

      <button
        onClick={() =>
          updateConsent({
            analytics: true,
            marketing: false,
            personalization: true,
          })
        }
      >
        Customize
      </button>
    </div>
  );
}
```

### Programmatic Consent

```tsx
import { ConsentManager } from '@/lib/analytics/ConsentManager';

// Check consent
ConsentManager.hasConsent('analytics'); // true/false

// Set consent
ConsentManager.updateConsent({
  analytics: true,
  marketing: true,
  personalization: false,
});

// Accept/Reject all
ConsentManager.acceptAll();
ConsentManager.rejectAll();

// Reset consent
ConsentManager.resetConsent();
```

---

## 📊 Available Metrics

### Engagement Metrics

```tsx
interface EngagementMetrics {
  timeOnPage: number; // Milliseconds
  scrollDepth: number; // 0-100 percentage
  interactionCount: number; // Total interactions
  clickCount: number; // Total clicks
  formInteractions: number; // Form field changes
  videoViews: number; // Video plays
  videoPlayback: number; // Seconds played
}
```

### User Profile

```tsx
interface UserProfile {
  userId: string;
  sessionId: string;
  firstVisit: number;
  lastVisit: number;
  visitCount: number;
  totalEngagementTime: number;
  preferences: ConsentPreferences;
  customProperties?: Record<string, any>;
}
```

### Event Types

```tsx
type EventType =
  | 'page_view'
  | 'click'
  | 'scroll'
  | 'form_submission'
  | 'form_interaction'
  | 'component_view'
  | 'component_interaction'
  | 'video_play'
  | 'video_pause'
  | 'video_complete'
  | 'link_click'
  | 'cta_click'
  | 'search'
  | 'error'
  | 'custom';
```

---

## 🔧 Advanced Usage

### Manual Event Tracking

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

export function MyComponent() {
  const analytics = useAnalytics();

  const handleSpecialAction = () => {
    analytics.trackEvent('Special Action', 'custom', {
      userId: 'user123',
      context: 'special-offer',
      value: 50,
    });
  };

  return <button onClick={handleSpecialAction}>Do Special Thing</button>;
}
```

### Get User Profile

```tsx
import { useUserProfile } from '@/hooks/useAnalytics';

export function UserInfo() {
  const userProfile = useUserProfile();

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div>
      <p>Session: {userProfile.sessionId}</p>
      <p>Visit #{userProfile.visitCount}</p>
      <p>User since: {new Date(userProfile.firstVisit).toLocaleDateString()}</p>
    </div>
  );
}
```

### Flush Events Manually

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

export function Dashboard() {
  const analytics = useAnalytics();

  return <button onClick={() => analytics.flush()}>Send Events Now</button>;
}
```

---

## 📈 Development Dashboard

The analytics dashboard appears in the bottom-right corner during development:

- **Real-time metrics** - Time on page, scroll depth, interactions
- **User info** - Session ID, visit count, platform
- **Screen info** - Viewport and screen resolution
- **Manual actions** - Flush events, log to console

To hide in production, the dashboard only shows when `NODE_ENV === 'development'`.

---

## 🔐 Privacy & Security

### GDPR Compliance

✅ Consent required before tracking
✅ Cookie-based preference storage
✅ Privacy policy and cookie policy links
✅ Right to reject or customize preferences
✅ Easy consent withdrawal

### Data Storage

- **Cookies**: Preferences stored for 365 days
- **Local Storage**: User ID and visit count
- **Session Storage**: Session ID (expires on browser close)

### Event Data

Events include only:

- User interactions (clicks, form changes)
- Engagement metrics (time, scroll depth)
- Device information (platform, language)
- Page/referrer information

**Never collected**:

- Personal data (names, emails - unless submitted in forms)
- Sensitive form values (passwords, credit cards)
- Third-party tracking IDs

---

## 🎨 Customization

### Event Batching

```tsx
AnalyticsProvider config={{
  batchSize: 20,        // Events before sending
  batchTimeout: 5000,   // Milliseconds before auto-send
}}
```

### Cookie Settings

```tsx
// In ConsentManager.ts
const COOKIE_EXPIRY_DAYS = 365;
const CONSENT_COOKIE_NAME = 'wcm-consent-preferences';
```

### Analytics Endpoints

```tsx
config={{
  apiEndpoint: '/api/analytics',  // Custom endpoint
  enableAutoTracking: true,
  enableErrorTracking: true,
}}
```

---

## 📝 Examples

### Contact Form with Full Tracking

```tsx
'use client';

import { useFormTracking, useCTATracking } from '@/hooks/useAnalytics';
import { useState } from 'react';

export function ContactForm() {
  const { trackFieldChange, trackSubmit } = useFormTracking('Contact Form');
  const trackFormSubmitCTA = useCTATracking('Contact Form Submit', 'contact');
  const [formData, setFormData] = useState({});

  const handleFieldChange = (field, value) => {
    trackFieldChange(field, { value, type: 'text' });
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    trackFormSubmitCTA();
    trackSubmit(formData);

    // Submit to server
    await submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={e => handleFieldChange('name', e.target.value)}
        placeholder="Name"
      />
      <input
        onChange={e => handleFieldChange('email', e.target.value)}
        placeholder="Email"
      />
      <textarea
        onChange={e => handleFieldChange('message', e.target.value)}
        placeholder="Message"
      />
      <button type="submit">Send Message</button>
    </form>
  );
}
```

### Hero Section with Engagement Tracking

```tsx
'use client';

import { useComponentView, useEngagementTracking } from '@/hooks/useAnalytics';

export function HeroSection() {
  useComponentView('HeroSection', '/');
  const heroRef = useEngagementTracking('hero-section');

  return (
    <section
      ref={heroRef}
      className="bg-gradient-to-b from-blue-900 to-blue-800 py-20 px-4"
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Wisdom Church</h1>
        <p className="text-xl mb-8">Experience God's transforming power</p>
        <button className="bg-white text-blue-900 px-8 py-3 rounded font-bold">
          Learn More
        </button>
      </div>
    </section>
  );
}
```

---

## 🚀 Starting with Analytics

### Step 1: Verify Installation

All components are already installed. Check these files exist:

- `/src/lib/analytics/` - Core analytics library
- `/src/hooks/useAnalytics.ts` - React hooks
- `/src/components/providers/AnalyticsProvider.tsx` - Provider component
- `/src/components/ui/analytics/` - UI components
- `/src/app/api/analytics/route.ts` - API endpoint

### Step 2: Add Tracking Gradually

Start by adding tracking to key pages:

1. Homepage (page views, component views)
2. Important CTAs (donation, event registration)
3. Contact form
4. Key navigation links

### Step 3: Monitor in Development

Use the dev dashboard to see:

- Which events are being tracked
- Engagement metrics
- User session information
- Any tracking issues

### Step 4: Review Consent Flow

Test the consent banner:

1. First time visitor sees banner
2. Can accept/reject/customize preferences
3. Preferences persist across sessions
4. Analytics respects consent choices

---

## 📞 API Reference

See `src/lib/analytics/types.ts` for full TypeScript interfaces.

---

## 🎓 Best Practices

1. **Track meaningful interactions** - Don't track every small action
2. **Use consistent naming** - `Event: Action`, e.g., "Click: Donate Button"
3. **Include context** - Add relevant data to events
4. **Respect consent** - Always check before tracking
5. **Test in development** - Use the analytics dashboard
6. **Monitor performance** - Don't send too many events
7. **Regular reviews** - Check analytics data regularly for insights

---

## ✅ Implementation Checklist

- [x] Analytics service initialized
- [x] Consent manager integrated
- [x] React hooks available
- [x] UI components created
- [x] API endpoint set up
- [x] Layout updated with provider
- [x] Cookie consent banner added
- [x] Dev dashboard included
- [ ] Track homepage events
- [ ] Track key CTAs
- [ ] Track form submissions
- [ ] Monitor engagement metrics
- [ ] Set up external analytics service webhook
- [ ] Create admin analytics dashboard

---

This analytics system provides a solid foundation for understanding user behavior while maintaining privacy and respecting user consent.
