# 🎉 Professional Church Website Upgrade - Integration Guide

Your website has been transformed into a **smart, dynamic, professional web application** with advanced engagement tracking and beautiful animations.

## ✨ What's New

### 1. **Advanced Church Analytics** 🎯

- ✅ Donation tracking with payment methods
- ✅ Event registration & attendance tracking
- ✅ Volunteer signup tracking
- ✅ Sermon engagement metrics
- ✅ Prayer request submissions
- ✅ Testimony sharing tracking
- ✅ Member engagement scoring system

### 2. **Dynamic Interactive Components** 🎬

- ✅ Three.js animated hero backgrounds
- ✅ Smart event recommendation engine (AI-powered based on user behavior)
- ✅ Interactive donation widget with GSAP animations
- ✅ Professional animated buttons with ripple effects
- ✅ Member engagement tracker with real-time metrics
- ✅ Beautiful card animations and hover effects

### 3. **Professional UI Enhancements** 🎨

- ✅ GSAP scroll animations on all components
- ✅ Smooth hover effects with shadow/scale transitions
- ✅ Staggered card reveals
- ✅ Floating animations for visual appeal
- ✅ Responsive grid layouts
- ✅ Gradient backgrounds with glass effects

### 4. **Smart Automation** 🤖

- ✅ Automatic event recommendations based on user engagement
- ✅ Engagement scoring algorithm
- ✅ Smart member profile tracking
- ✅ Real-time engagement metrics
- ✅ Intelligent lead scoring for CRM integration

---

## 🚀 How to Use New Components

### **1. Church Analytics Hook**

Use in any component to track church-specific events:

```tsx
'use client';
import { useChurchAnalytics } from '@/shared/analytics/churchAnalytics';

export default function DonationButton() {
  const { trackDonation } = useChurchAnalytics();

  const handleDonate = async () => {
    // Process donation...

    // ✅ Track donation with all details
    trackDonation({
      amount: 5000,
      currency: 'NGN',
      method: 'card',
      purpose: 'offering',
      donorName: 'John Doe',
      isAnonymous: false,
    });
  };

  return <button onClick={handleDonate}>Donate</button>;
}
```

### **2. Three.js Hero Background**

Add animated particle background to hero sections:

```tsx
'use client';
import ThreeHero from '@/shared/components/ThreeHero';

export default function HeroSection() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <ThreeHero
        backgroundColor="#0A0A0F"
        particleColor="#C9A84C"
        particleCount={150}
        animationSpeed={0.5}
      />

      {/* Your hero content goes here */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1>Welcome to Wisdom Church</h1>
      </div>
    </div>
  );
}
```

### **3. Donation Widget**

Add interactive donation widget to any page:

```tsx
'use client';
import DonationWidget from '@/shared/components/DonationWidget';

export default function Page() {
  return (
    <div>
      <DonationWidget
        variant="card"
        onSuccess={amount => {
          console.log(`Donation of ₦${amount} received!`);
        }}
      />
    </div>
  );
}
```

### **4. Smart Event Recommendations**

Display intelligent event recommendations:

```tsx
'use client';
import SmartEventRecommendation from '@/shared/components/SmartEventRecommendation';

export default function EventsPage() {
  return (
    <div>
      <SmartEventRecommendation limit={3} title="Events Recommended For You" />
    </div>
  );
}
```

### **5. Animated Buttons**

Use professional animated buttons throughout your site:

```tsx
'use client';
import { AnimatedButton, ButtonGroup } from '@/shared/ui/AnimatedButton';

export default function Page() {
  return (
    <ButtonGroup direction="row" gap={12}>
      <AnimatedButton variant="primary" size="lg" icon="✨">
        Register Now
      </AnimatedButton>

      <AnimatedButton variant="secondary" icon="👁️" iconPosition="left">
        Learn More
      </AnimatedButton>

      <AnimatedButton variant="outline">Contact Us</AnimatedButton>
    </ButtonGroup>
  );
}
```

### **6. Member Engagement Tracker**

Display member engagement metrics:

```tsx
'use client';
import MemberEngagementTracker from '@/shared/components/MemberEngagementTracker';

export default function ProfilePage({ memberId }: { memberId: string }) {
  return (
    <MemberEngagementTracker
      memberId={memberId}
      onMemberUpdate={member => {
        console.log('Member profile updated:', member);
      }}
    />
  );
}
```

---

## 📊 Advanced Analytics Events

### **Track Donations**

```tsx
trackDonation({
  amount: 10000,
  currency: 'NGN',
  method: 'card' | 'bank' | 'mobile',
  purpose: 'general' | 'offering' | 'project' | 'emergency',
  donorName: 'Name',
  isAnonymous: false,
});
```

### **Track Event Engagement**

```tsx
trackEventEngagement({
  eventId: 'event_123',
  eventName: 'Sunday Service',
  eventType: 'service' | 'conference' | 'workshop' | 'meeting' | 'outreach',
  action: 'view' | 'register' | 'attend' | 'share',
  attendees: 150,
  registrationSource: 'website' | 'social' | 'referral' | 'email',
});
```

### **Track Volunteer/Ministry Signup**

```tsx
trackVolunteerAction({
  ministryName: 'Youth Ministry',
  ministryType: 'youth' | 'women' | 'men' | 'children' | 'outreach',
  action: 'express_interest' | 'register' | 'complete_training' | 'serve',
  hoursCommitted: 10,
  frequency: 'weekly' | 'monthly' | 'occasional' | 'seasonal',
});
```

### **Track Sermon Engagement**

```tsx
trackSermonEngagement({
  sermonId: 'sermon_001',
  sermonTitle: 'The Power of Faith',
  speaker: 'Pastor John',
  duration: 3600,
  percentageWatched: 85,
  action: 'view' | 'share' | 'download' | 'bookmark',
});
```

### **Track Member Interactions**

```tsx
trackMemberInteraction({
  memberId: 'member_123',
  memberName: 'John Doe',
  interactionType:
    'prayer_request' |
    'testimony_submitted' |
    'profile_updated' |
    'group_joined' |
    'resource_downloaded',
  resourceType: 'document',
  engagementScore: 75,
});
```

### **Identify Member (for CRM)**

```tsx
identifyMember('member_123', {
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  memberType: 'member',
  memberSince: '2023-01-15',
  ministryInterests: ['youth', 'outreach'],
  engagementLevel: 'high',
  totalDonations: 50000,
  eventsAttended: 12,
  volunteerHours: 24,
});
```

---

## 🎯 Engagement Scoring

The system automatically calculates engagement scores based on:

- **Page Views** → 1 point per 5 views
- **Event Registrations** → 10 points each
- **Volunteer Signups** → 15 points each
- **Donations** → 1 point per ₦1,000 (min 5)
- **Sermon Engagement** → 5 points per watch
- **Prayer Requests** → 3 points each
- **Testimonies Shared** → 20 points each (high value!)
- **Member Interactions** → 2 points each

Use manual calculation:

```tsx
const { calculateEngagementScore } = useChurchAnalytics();

const score = calculateEngagementScore({
  pageViews: 45,
  eventRegistrations: 3,
  donationsReceived: 15000,
  // ... other metrics
});
```

---

## 📱 Integration Examples by Page

### **Homepage Integration**

```tsx
'use client';
import ThreeHero from '@/shared/components/ThreeHero';
import DonationWidget from '@/shared/components/DonationWidget';
import SmartEventRecommendation from '@/shared/components/SmartEventRecommendation';
import { useChurchAnalytics } from '@/shared/analytics/churchAnalytics';
import { useEffect } from 'react';

export default function Home() {
  const { trackEventEngagement } = useChurchAnalytics();

  useEffect(() => {
    // Track homepage view
    trackEventEngagement({
      eventId: 'homepage',
      eventName: 'Homepage View',
      action: 'view',
    });
  }, [trackEventEngagement]);

  return (
    <>
      <section style={{ position: 'relative', height: '100vh' }}>
        <ThreeHero particleCount={150} />
        {/* Your hero content */}
      </section>

      <section style={{ padding: '60px 20px' }}>
        <DonationWidget variant="card" />
      </section>

      <section>
        <SmartEventRecommendation limit={4} />
      </section>
    </>
  );
}
```

### **Events Page Integration**

```tsx
'use client';
import SmartEventRecommendation from '@/shared/components/SmartEventRecommendation';
import { AnimatedButton } from '@/shared/ui/AnimatedButton';
import { useChurchAnalytics } from '@/shared/analytics/churchAnalytics';

export default function EventsPage() {
  const { trackEventEngagement } = useChurchAnalytics();

  return (
    <div>
      <h1>Upcoming Events</h1>

      <SmartEventRecommendation limit={6} title="Recommended Events For You" />

      {/* Additional content */}
      <AnimatedButton variant="primary" size="lg" icon="📅">
        View All Events
      </AnimatedButton>
    </div>
  );
}
```

### **Contact Page Integration**

Already has analytics integration! Contact form submissions are tracked.

### **Donation/Giving Page**

```tsx
'use client';
import DonationWidget from '@/shared/components/DonationWidget';
import { AnimatedButton } from '@/shared/ui/AnimatedButton';
import { useChurchAnalytics } from '@/shared/analytics/churchAnalytics';

export default function GivingPage() {
  const { trackDonation } = useChurchAnalytics();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
      <h1>Support Our Ministry</h1>
      <p>Your generous giving helps us reach more lives...</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '40px',
        }}
      >
        <div>
          <h2>One-Time Donation</h2>
          <DonationWidget variant="card" />
        </div>

        <div>
          <h2>Recurring Giving</h2>
          <AnimatedButton variant="primary" size="lg">
            Set Up Recurring Donation
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔄 Integration Workflow

### **Step 1: Import Analytics Hook**

```tsx
import { useChurchAnalytics } from '@/shared/analytics/churchAnalytics';
```

### **Step 2: Call Hook in Component**

```tsx
const {
  trackDonation,
  trackEventEngagement,
  trackVolunteerAction,
  trackSermonEngagement,
  trackMemberInteraction,
  identifyMember,
} = useChurchAnalytics();
```

### **Step 3: Track Actions**

```tsx
// When user donates
trackDonation({ amount: 5000, currency: 'NGN' /* ... */ });

// When user registers for event
trackEventEngagement({ eventId: '123', action: 'register' /* ... */ });
```

### **Step 4: Data Flows To**

- ✅ Analytics Provider (core tracking)
- ✅ Meta Pixel (Facebook retargeting)
- ✅ Google Analytics 4 (detailed reports)
- ✅ Your Backend API (custom tracking)
- ✅ CRM System (member profiles)

---

## 🎨 Customization

### **Change Donation Presets**

Edit `DONATION_PRESETS` in `DonationWidget.tsx`:

```tsx
const DONATION_PRESETS = [
  { label: '₦100', amount: 100, emoji: '🙏' },
  // ... add more
];
```

### **Customize Particle Colors**

```tsx
<ThreeHero
  backgroundColor="#1a1a1a"
  particleColor="#FFD700"
  particleCount={200}
/>
```

### **Adjust Button Styles**

```tsx
<AnimatedButton
  variant="secondary"
  size="lg"
  icon="🎉"
  style={{ borderRadius: '20px' }}
>
  Click Me!
</AnimatedButton>
```

---

## 🚤 Performance Tips

1. **Lazy Load Components**

   ```tsx
   const SmartEventRecommendation = dynamic(
     () => import('@/shared/components/SmartEventRecommendation'),
     { ssr: false }
   );
   ```

2. **Memoize Analytics Calls**

   ```tsx
   useEffect(() => {
     trackEventEngagement({...});
   }, []); // Only track once on mount
   ```

3. **Debounce Scroll Events**
   - Already handled by scroll tracking system

---

## 📊 Viewing Analytics Data

### **In Meta Pixel:**

1. Visit https://business.facebook.com/events
2. Select your Pixel
3. View "Test Events" or "Events Manager"
4. See donations, registrations, etc.

### **In Google Analytics 4:**

1. Visit https://analytics.google.com/
2. Go to "Realtime" to see live events
3. Go to "Reports" → "Engagement" for detailed metrics

### **Custom Dashboard (Future):**

- Create an admin page to display aggregated metrics
- Show member engagement scores
- Display donation trends
- View volunteer signup funnels

---

## ✅ Checklist for Full Integration

- [ ] Add `.env.local` with Meta Pixel ID and GA4 ID
- [ ] Restart dev server (`npm run dev`)
- [ ] Add `ThreeHero` to homepage hero section
- [ ] Add `DonationWidget` to giving page
- [ ] Add `SmartEventRecommendation` to events page
- [ ] Replace all buttons with `AnimatedButton`
- [ ] Add church analytics tracking to key pages
- [ ] Test donations in browser DevTools
- [ ] Verify Meta Pixel events firing
- [ ] Verify GA4 events appearing in real-time
- [ ] Set up CRM integration with `identifyMember()`
- [ ] Create custom analytics dashboard (optional)

---

## 🎓 Next Steps

1. **Add to More Pages:** Integrate components into all ministry pages
2. **Custom Events:** Add tracking for unique ministry interactions
3. **Email Integration:** Send engagement alerts to staff
4. **CRM Connection:** Sync member data with email system
5. **Advanced Reporting:** Build admin dashboard with charts
6. **A/B Testing:** Test different donation amounts/CTAs
7. **Automation:** Set up automated workflows based on engagement

---

**Your church website is now a smart, professional, dynamic web application! 🎉**

For questions or updates, check the individual component files in `/src/shared/components/` and `/src/shared/analytics/`.
