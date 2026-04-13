/**
 * Example: Homepage Implementation with Analytics
 * This example shows how to integrate analytics tracking throughout your pages
 *
 * Copy patterns from this file to your actual components
 */

'use client';

import React from 'react';
import {
  usePageView,
  useComponentView,
  useClickTracking,
  useCTATracking,
  useEngagementTracking,
  useEventTracking,
  useFormTracking,
} from '@/hooks/useAnalytics';

/**
 * EXAMPLE 1: Homepage with Full Analytics Integration
 */
export function HomepageWithAnalytics() {
  // Track page view
  usePageView('Wisdom Church - Home');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <HeroSectionExample />

      {/* About Section */}
      <AboutSectionExample />

      {/* Events Section */}
      <EventsSectionExample />

      {/* Donation CTA */}
      <DonationCTAExample />

      {/* Contact Form */}
      <ContactFormExample />
    </div>
  );
}

/**
 * EXAMPLE 2: Hero Section with Component View & Engagement Tracking
 */
function HeroSectionExample() {
  useComponentView('HeroSection', '/');
  const heroRef = useEngagementTracking('hero-section');

  return (
    <section
      ref={heroRef}
      className="py-20 px-4 sm:px-6 lg:px-8 text-center text-white"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">
          Welcome to Wisdom Church
        </h1>
        <p className="text-xl sm:text-2xl mb-8 text-gray-300">
          Experience God's transforming power in our community
        </p>

        {/* CTA Button with Tracking */}
        <BookServiceButtonExample />
      </div>
    </section>
  );
}

/**
 * EXAMPLE 3: CTA Button with Click & Event Tracking
 */
function BookServiceButtonExample() {
  const trackCTA = useCTATracking('Book Service Button', 'hero-cta');

  const handleClick = () => {
    trackCTA();
    // Navigate to booking page
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition"
    >
      Book Service
    </button>
  );
}

/**
 * EXAMPLE 4: About Section with Component View
 */
function AboutSectionExample() {
  useComponentView('AboutSection', '/about');

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-white">About Us</h2>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          Wisdom Church is a Spirit-filled community dedicated to worshiping
          God, sharing the gospel, and serving others with love and compassion.
        </p>

        {/* Learn More Link with Tracking */}
        <LearnMoreLinkExample />
      </div>
    </section>
  );
}

/**
 * EXAMPLE 5: External Link with Link Click Tracking
 */
function LearnMoreLinkExample() {
  const linkRef = useClickTracking<HTMLAnchorElement>('Learn More About');

  return (
    <a
      ref={linkRef}
      href="/about"
      className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition"
    >
      Learn More
    </a>
  );
}

/**
 * EXAMPLE 6: Events Section with Component View
 */
function EventsSectionExample() {
  useComponentView('EventsSection', '/events');

  const events = [
    { title: 'Sunday Service', time: '9:00 AM', capacity: 500 },
    { title: 'Youth Meeting', time: '5:00 PM', capacity: 100 },
    { title: "Women's Fellowship", time: '6:30 PM', capacity: 80 },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-white">Upcoming Events</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {events.map(event => (
            <EventCardExample key={event.title} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * EXAMPLE 7: Event Card with Click Tracking
 */
function EventCardExample({ event }: { event: any }) {
  const clickRef = useClickTracking<HTMLDivElement>(
    `Event Card: ${event.title}`
  );

  return (
    <div
      ref={clickRef}
      className="bg-slate-700 rounded-lg p-6 cursor-pointer hover:bg-slate-600 transition"
    >
      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
      <p className="text-gray-300 mb-4">🕐 {event.time}</p>
      <p className="text-gray-400 text-sm">Capacity: {event.capacity} people</p>
    </div>
  );
}

/**
 * EXAMPLE 8: Donation CTA with Custom Event Tracking
 */
function DonationCTAExample() {
  const trackCTA = useCTATracking('Donate Now Button', 'donation-primary');

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-700/50">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Support Our Mission
        </h2>
        <p className="text-gray-300 mb-8">
          Your generous donation helps us continue our ministry and reach more
          lives
        </p>

        <DonateButtonExample trackCTA={trackCTA} />
      </div>
    </section>
  );
}

/**
 * EXAMPLE 9: Donate Button with CTA Tracking
 */
function DonateButtonExample({ trackCTA }: { trackCTA: () => void }) {
  const handleDonate = () => {
    trackCTA();
    // Navigate to donation page
  };

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {[50, 100, 250, 500].map(amount => (
        <DonationAmountButton
          key={amount}
          amount={amount}
          onClick={handleDonate}
        />
      ))}
    </div>
  );
}

/**
 * EXAMPLE 10: Amount Selection Button
 */
function DonationAmountButton({
  amount,
  onClick,
}: {
  amount: number;
  onClick: () => void;
}) {
  const trackEvent = useEventTracking();

  const handleClick = () => {
    onClick();
    trackEvent('Donation Amount Selected', { amount, currency: 'USD' });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition"
    >
      Give ${amount}
    </button>
  );
}

/**
 * EXAMPLE 11: Contact Form with Full Form Tracking
 */
function ContactFormExample() {
  const { trackFieldChange, trackSubmit } = useFormTracking('Contact Form');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });

  const handleFieldChange = (field: string, value: string) => {
    trackFieldChange(field, { value, type: 'text' });
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackSubmit(formData);

    // Call API
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-white">Get in Touch</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleFieldChange('name', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleFieldChange('email', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={e => handleFieldChange('message', e.target.value)}
              rows={5}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

/**
 * EXAMPLE 12: Quick Reference - Available Hooks
 */
export const AvailableHooksReference = {
  // Track page views
  usePageView: `
    usePageView('Page Title');
  `,

  // Track component views
  useComponentView: `
    useComponentView('ComponentName', '/path');
  `,

  // Track clicks on element
  useClickTracking: `
    const ref = useClickTracking('Click Label');
    return <div ref={ref}>...</div>;
  `,

  // Track form interactions
  useFormTracking: `
    const { trackFieldChange, trackSubmit } = useFormTracking('FormName');
    trackFieldChange('fieldName', value);
    trackSubmit(formData);
  `,

  // Track link clicks
  useLinkTracking: `
    const ref = useLinkTracking('https://example.com', 'Link Label');
    return <a ref={ref} href="...">...</a>;
  `,

  // Track CTA clicks
  useCTATracking: `
    const trackCTA = useCTATracking('CTA Name', 'cta-type');
    <button onClick={trackCTA}>...</button>;
  `,

  // Track search
  useSearchTracking: `
    const trackSearch = useSearchTracking();
    trackSearch('search query', resultCount);
  `,

  // Track custom events
  useEventTracking: `
    const trackEvent = useEventTracking();
    trackEvent('Event Name', { customData: 'value' });
  `,

  // Get consent status
  useConsentManager: `
    const { consent, hasConsent, acceptAll } = useConsentManager();
  `,

  // Get engagement metrics
  useEngagementMetrics: `
    const metrics = useEngagementMetrics();
    // { timeOnPage, scrollDepth, interactionCount, ... }
  `,

  // Get user profile
  useUserProfile: `
    const userProfile = useUserProfile();
    // { userId, sessionId, visitCount, ... }
  `,
};

export default HomepageWithAnalytics;
