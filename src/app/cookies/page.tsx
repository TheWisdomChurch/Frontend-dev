import type { Metadata } from 'next';

import SiteHero from '@/features/hero/SiteHero';
import { buildPageMetadata } from '@/lib/seo';
import { DocumentLayout, Page, type DocumentSection } from '@/shared/ui/layout';

export const metadata: Metadata = buildPageMetadata({
  title: 'Cookies & Privacy',
  description:
    'How The Wisdom Church uses cookies and how to manage your preferences.',
  path: '/cookies',
});

const sections: readonly DocumentSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    body: 'Cookies are small text files placed in your browser. We use a minimal set to keep the site secure, operate forms, and remember basic preferences. We do not use cookies for advertising, profiling, or cross-site tracking.',
  },
  {
    id: 'essential',
    title: 'Essential cookies',
    body: 'These cookies are required for the site to function and cannot be disabled through the site.',
    items: [
      'Session token — keeps a session active and secures form submissions. Duration: current session.',
      'CSRF token — prevents unauthorised cross-site form submissions. Duration: current session.',
    ],
  },
  {
    id: 'preferences',
    title: 'Preference cookies',
    body: 'These optional cookies remember choices so they do not need to be selected on every visit.',
    items: [
      'cookie_consent — records that you have seen and accepted the cookie notice. Duration: one year.',
      'theme — stores your visual theme preference. Duration: one year.',
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    body: 'Aggregated analytics help us understand navigation and improve the experience. They do not contain names, email addresses, or device fingerprints.',
    items: [
      'Analytics session — counts page views and navigation paths. Duration: up to 30 days.',
    ],
  },
  {
    id: 'not-used',
    title: 'What we do not use',
    items: [
      'Advertising or remarketing cookies.',
      'Third-party advertising-network data sharing.',
      'Social-media tracking pixels.',
      'Browser or device fingerprinting.',
    ],
  },
  {
    id: 'choices',
    title: 'Your choices',
    items: [
      'Clear cookies through your browser settings or history.',
      'Enable Do Not Track in your browser to opt out of analytics where supported.',
      'Request deletion of personal data submitted through forms.',
      'Skip optional form fields when using basic site services.',
    ],
    links: [{ href: '/contact', label: 'Request data deletion' }],
  },
];

const relatedPolicies = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/contact', label: 'Contact us' },
] as const;

export default function CookiesPage() {
  return (
    <Page>
      <SiteHero
        eyebrow="Legal · Cookies"
        title="Cookies & Privacy"
        subtitle="We use only the cookies this site needs—no advertising trackers, marketing pixels, or profiling."
        note="Last updated: July 2026"
      />
      <DocumentLayout sections={sections} navigation={relatedPolicies} />
    </Page>
  );
}
