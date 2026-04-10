# 📊 Analytics Integration Complete

Your application now has **fully integrated analytics** with Meta Pixel and Google Analytics 4 support.

## ✅ What's Working

### Components & Providers

- ✅ **MetaPixel.tsx** - Meta Pixel script injection & initialization
- ✅ **AnalyticsProvider** - Central analytics hub with consent management
- ✅ **Analytics Core** - Event tracking & user identification
- ✅ **useAnalyticsTracking** - Hook for tracking forms, scrolls, clicks
- ✅ **useAdvancedTracking** - Advanced event tracking (scroll depth, outbound links, etc.)

### Auto-Tracked Events

- ✅ **Page Views** - Every page navigation
- ✅ **Scroll Depth** - 25%, 50%, 75%, 100% on pages with tracking
- ✅ **Outbound Links** - External link clicks (automatic)
- ✅ **Time on Page** - User session duration
- ✅ **Form Events** - Form start, complete, error

### Integrated Pages

- ✅ **Homepage** - Scroll depth tracking
- ✅ **Contact Form** - Form submission tracking
- ✅ **Checkout** - Purchase funnel tracking

---

## 🚀 Setup Instructions

### Step 1: Get Your Tracking IDs

**Meta Pixel ID:**

1. Go to https://business.facebook.com/
2. Navigate to Events Manager → Pixels
3. Create or select a pixel
4. Copy the Pixel ID (16-digit number)

**Google Analytics 4 Measurement ID:**

1. Go to https://analytics.google.com/
2. Create a new GA4 property
3. Go to Data Streams
4. Copy the Measurement ID (format: G-XXXXXXXXXX)

### Step 2: Update Environment Variables

Create/update `.env.local`:

```bash
# Meta Pixel
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456

# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Note:** These are public variables (prefixed with `NEXT_PUBLIC_`), safe to expose in browser.

### Step 3: Restart Development Server

```bash
npm run dev
```

### Step 4: Verify in Browser

1. Open your site in production mode or dev with `.env.local` set
2. Open **DevTools** → **Network** tab
3. Look for requests to:
   - `https://www.facebook.com/tr` (Meta Pixel)
   - `https://www.google-analytics.com/g/collect` (GA4)
4. Fill out contact form → should see tracking events

---

## 📍 Where Tracking Happens

| Page                       | Events Tracked                                        |
| -------------------------- | ----------------------------------------------------- |
| **Homepage** (`/`)         | Page view, scroll depth (25/50/75/100%), time on page |
| **Contact** (`/contact`)   | Page view, form start, form submit, form error        |
| **Checkout** (`/checkout`) | Page view, cart interaction                           |
| **All Pages**              | Outbound link clicks, page views, time on page        |

---

## 🎯 Available Tracking Methods

### In Any Component

```tsx
'use client';
import { useAnalyticsTracking } from '@/shared/analytics/useTracking';

export default function MyComponent() {
  const {
    trackFormStart, // Track form focus
    trackFormComplete, // Track form submission
    trackFormError, // Track form errors
    trackDonate, // Track donations
    trackScroll, // Track scroll depth
    trackRegister, // Track registration
  } = useAnalyticsTracking();

  return (
    <button onClick={() => trackDonate(5000, 'NGN', 'card')}>
      Donate ₦5,000
    </button>
  );
}
```

### Using Core Analytics API

```tsx
'use client';
import { useAnalytics } from '@/shared/providers/AnalyticsProvider';

export default function MyComponent() {
  const { trackEvent, identify, setConsent } = useAnalytics();

  // Track custom events
  trackEvent('video_played', {
    video_id: 'sermon_001',
    duration: 1800,
  });

  // Identify users
  identify({
    user_id: 'user_123',
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe',
  });

  return null;
}
```

---

## 🔐 Consent & GDPR Compliance

The system automatically handles GDPR/CCPA consent:

```tsx
'use client';
import { useAnalytics } from '@/shared/providers/AnalyticsProvider';

export default function CookieBanner() {
  const { setConsent } = useAnalytics();

  const handleAcceptAll = () => {
    setConsent({
      analytics: true,
      marketing: true,
      necessary: true,
    });
  };

  const handleRejectMarketing = () => {
    setConsent({
      analytics: true,
      marketing: false,
      necessary: true,
    });
  };

  return (
    <div>
      <button onClick={handleAcceptAll}>Accept All</button>
      <button onClick={handleRejectMarketing}>Reject Marketing</button>
    </div>
  );
}
```

---

## 📊 Meta Pixel Standard Events

The system automatically maps these events for Meta Pixel:

- `PageView` - Viewed a page
- `ViewContent` - Viewed product/content
- `Search` - Performed search
- `AddToCart` - Added item to cart
- `AddToWishlist` - Added to wishlist
- `InitiateCheckout` - Started checkout
- `AddPaymentInfo` - Added payment method
- `Purchase` - Completed purchase
- `Lead` - Generated lead
- `CompleteRegistration` - Completed registration
- `Contact` - Contact request
- `Donate` - Donation made
- `Subscribe` - Subscription created

**Any custom event names also work** - they're tracked as custom events.

---

## 📈 Google Analytics 4 Custom Events

GA4 auto-tracks:

- Page views
- Scroll depth
- Form interactions
- User engagement
- Custom events (anything you `trackEvent()` call)

All GA4 events can filter by:

- `event_name` - The event type
- Event parameters (custom properties you pass)
- User properties (from `identify()`)

---

## 🛠️ Troubleshooting

### Meta Pixel Not Working?

```bash
# Check these:
1. NEXT_PUBLIC_META_PIXEL_ID is set in .env.local
2. Browser DevTools → Network → filter for "facebook.com"
3. Check browser console for error messages
4. Verify Pixel ID format (should be 16 digits)
```

### Google Analytics Not Appearing?

```bash
# Check these:
1. NEXT_PUBLIC_GA_MEASUREMENT_ID is set in .env.local
2. Refresh page after updating .env.local
3. Check Network tab for "google-analytics.com" requests
4. GA4 may take 24-48 hours to show data in dashboard
```

### Events Not Tracking?

```bash
# Verify in browser DevTools:
1. Network tab → see tracking requests
2. Console → check for error messages
3. Make sure pages have analytics code:
   import { useAnalyticsTracking } from '@/shared/analytics/useTracking';
4. Call tracking functions BEFORE navigation
```

---

## 🎓 Advanced: Custom Events

### Track Donation

```tsx
const { trackDonate } = useAnalyticsTracking();

trackDonate(5000, 'NGN', 'card');
// → Sends: {
//     event: 'Donate',
//     amount: 5000,
//     currency: 'NGN',
//     method: 'card'
//   }
```

### Track Event Registration

```tsx
const { trackRegister } = useAnalyticsTracking();

trackRegister('event_registration', 'wpc_2026');
// → Sends registration event with event ID
```

### Track Sermon Playback

```tsx
const { trackEvent } = useAnalytics();

trackEvent('sermon_played', {
  sermon_title: 'The Power of Faith',
  sermon_id: 'sermon_001',
  duration_seconds: 3600,
  speaker: 'Pastor John',
});
```

---

## 📝 Environment Variables Reference

```bash
# REQUIRED for Meta Pixel tracking
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456

# REQUIRED for Google Analytics tracking
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# OPTIONAL: Development debugging
# NEXT_PUBLIC_ANALYTICS_DEBUG=true
```

---

## ✨ Next Steps

1. ✅ **Set environment variables** → Tracking starts automatically
2. ✅ **Test form submissions** → Verify events appear in Meta Pixel & GA4
3. ✅ **Add user identification** → Call `identify()` on login
4. ✅ **Set up consent banner** → Manage GDPR/CCPA compliance
5. ✅ **Configure GA4 dashboard** → Create custom reports & alerts

---

**Status:** ✅ Analytics fully integrated & ready to use!

For questions or updates, see individual component files:

- `/src/shared/providers/AnalyticsProvider.tsx` - Main provider
- `/src/shared/analytics/MetaPixel.tsx` - Meta Pixel script
- `/src/shared/analytics/useTracking.ts` - Tracking hook
- `/src/shared/analytics/providers/Meta.ts` - Meta provider
- `/src/shared/analytics/providers/ga.ts` - GA4 provider
