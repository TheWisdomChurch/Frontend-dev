# 📋 Analytics Quick Reference

## Copy & Paste Code Snippets

### 1️⃣ Track Page View

```tsx
'use client';
import { usePageView } from '@/hooks/useAnalytics';

export default function Page() {
  usePageView('Page Title');
  return <div>Content</div>;
}
```

### 2️⃣ Track Component View

```tsx
import { useComponentView } from '@/hooks/useAnalytics';

export function MyComponent() {
  useComponentView('MyComponent', '/path');
  return <div>Component</div>;
}
```

### 3️⃣ Track Click

```tsx
import { useClickTracking } from '@/hooks/useAnalytics';

export function Button() {
  const ref = useClickTracking('Button Label');
  return <button ref={ref}>Click</button>;
}
```

### 4️⃣ Track CTA Click

```tsx
import { useCTATracking } from '@/hooks/useAnalytics';

export function DonateButton() {
  const trackCTA = useCTATracking('Donate Button', 'primary');
  return <button onClick={trackCTA}>Donate</button>;
}
```

### 5️⃣ Track Link Click

```tsx
import { useLinkTracking } from '@/hooks/useAnalytics';

export function Link() {
  const ref = useLinkTracking('https://example.com', 'Learn More');
  return (
    <a ref={ref} href="https://example.com">
      Learn More
    </a>
  );
}
```

### 6️⃣ Track Form

```tsx
import { useFormTracking } from '@/hooks/useAnalytics';
import { useState } from 'react';

export function Form() {
  const { trackFieldChange, trackSubmit } = useFormTracking('Contact Form');
  const [data, setData] = useState({});

  const handleChange = (field, value) => {
    trackFieldChange(field, value);
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    trackSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={e => handleChange('email', e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 7️⃣ Track Custom Event

```tsx
import { useEventTracking } from '@/hooks/useAnalytics';

export function Component() {
  const trackEvent = useEventTracking();

  const handleAction = () => {
    trackEvent('Custom Action', { action: 'donate', amount: 100 });
  };

  return <button onClick={handleAction}>Action</button>;
}
```

### 8️⃣ Track Search

```tsx
import { useSearchTracking } from '@/hooks/useAnalytics';

export function SearchBar() {
  const trackSearch = useSearchTracking();

  const handleSearch = query => {
    const results = search(query);
    trackSearch(query, results.length);
  };

  return <input onKeyDown={handleSearch} />;
}
```

### 9️⃣ Get Engagement Metrics

```tsx
import { useEngagementMetrics } from '@/hooks/useAnalytics';

export function Dashboard() {
  const metrics = useEngagementMetrics();

  return (
    <div>
      <p>Time: {metrics.timeOnPage}ms</p>
      <p>Scroll: {metrics.scrollDepth}%</p>
      <p>Interactions: {metrics.interactionCount}</p>
    </div>
  );
}
```

### 🔟 Check Consent

```tsx
import { useConsentManager } from '@/hooks/useAnalytics';

export function ConsentStatus() {
  const { consent, hasConsent, acceptAll } = useConsentManager();

  return (
    <div>
      {hasConsent('analytics') ? 'Analytics enabled' : 'Analytics disabled'}
      <button onClick={acceptAll}>Accept All</button>
    </div>
  );
}
```

---

## 🎨 Hook Patterns

### Pattern 1: Page with Multiple Components

```tsx
'use client';
import { usePageView } from '@/hooks/useAnalytics';
import { HeroSection, Features, CTA } from '@/components';

export default function Page() {
  usePageView('Service Details');

  return (
    <>
      <HeroSection /> {/* Add useComponentView in HeroSection */}
      <Features /> {/* Add useComponentView in Features */}
      <CTA /> {/* Add useCTATracking in CTA */}
    </>
  );
}
```

### Pattern 2: Modal User Actions

```tsx
import { useCTATracking } from '@/hooks/useAnalytics';

export function BookingModal() {
  const trackOpen = useCTATracking('Open Booking', 'modal');
  const trackSubmit = useCTATracking('Submit Booking', 'modal');

  return (
    <Modal onOpen={trackOpen}>
      <form
        onSubmit={e => {
          trackSubmit();
          handleSubmit(e);
        }}
      >
        {/* Form fields */}
      </form>
    </Modal>
  );
}
```

### Pattern 3: Complex Form

```tsx
import { useFormTracking, useEventTracking } from '@/hooks/useAnalytics';

export function DonationForm() {
  const { trackFieldChange, trackSubmit } = useFormTracking('Donation');
  const trackEvent = useEventTracking();

  const handleAmountSelect = (amount) => {
    trackEvent('Amount Selected', { amount });
    trackFieldChange('amount', amount);
  };

  const handleSubmit = (data) => {
    trackSubmit(data);
    trackEvent('Donation Completed', { amount: data.amount });
  };

  return (
    // Form JSX
  );
}
```

---

## 📊 Event Naming Conventions

### Pages

```
'Homepage'
'Service Details'
'Event Registration'
'Contact Page'
```

### Buttons

```
'Donate Button'
'Book Service Button'
'Register Event Button'
'View More Button'
```

### Forms

```
'Contact Form'
'Donation Form'
'Event Registration Form'
```

### Events

```
'Donation Completed'
'Event Registered'
'Message Sent'
'Item Shared'
```

---

## 🔄 Consent Flow

### First Visit

1. User visits site
2. Sees consent banner
3. Options: Accept All, Reject All, Customize
4. Preference stored in cookie

### Subsequent Visits

1. Consent cookie found
2. Banner hidden
3. Analytics respects preferences
4. User can reset preferences in UI

---

## 🚀 Implementation Checklist

- [ ] Add tracking to homepage
- [ ] Add tracking to all CTAs
- [ ] Add tracking to forms
- [ ] Add tracking to key links
- [ ] Add tracking to modals
- [ ] Test consent banner
- [ ] Test analytics dashboard
- [ ] Monitor in console.log
- [ ] Review events in API
- [ ] Set up external service

---

## 💡 Tips

✅ **Do**

- Track meaningful user actions
- Use consistent naming
- Include context data
- Test in development
- Review metrics regularly

❌ **Don't**

- Track every single click
- Use vague event names
- Collect sensitive data
- Forget about consent
- Ignore privacy concerns

---

## 🔗 Links

- **Full Guide**: `ANALYTICS_INTEGRATION_GUIDE.md`
- **Examples**: `ANALYTICS_EXAMPLES.tsx`
- **Config**: `ANALYTICS_CONFIGURATION.ts`
- **Summary**: `ANALYTICS_IMPLEMENTATION_SUMMARY.md`

---

## 📞 Quick Answers

**Q: How to track clicks?**

```tsx
const ref = useClickTracking('Label');
return <button ref={ref}>Click</button>;
```

**Q: How to track forms?**

```tsx
const { trackFieldChange, trackSubmit } = useFormTracking('FormName');
```

**Q: How to check consent?**

```tsx
const { hasConsent } = useConsentManager();
if (hasConsent('analytics')) {
  /* track */
}
```

**Q: How to track custom events?**

```tsx
const trackEvent = useEventTracking();
trackEvent('Event Name', { data: 'value' });
```

**Q: Where's the dev dashboard?**
→ Bottom-right corner in development mode

**Q: How to see all events?**
→ Click "Log to Console" in dev dashboard

---

## ⚡ Most Used Hooks

```
1. usePageView()           → Add to every page
2. useCTATracking()        → Add to all CTAs
3. useFormTracking()       → Add to all forms
4. useClickTracking()      → Add to key buttons
5. useConsentManager()     → Check consent

Advanced:
6. useEventTracking()      → Custom events
7. useEngagementMetrics()  → Dev dashboard
8. useAnalytics()          → Direct access
```

---

Ready to add tracking? Start with one component and expand! 🚀
