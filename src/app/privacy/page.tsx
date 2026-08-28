import type { Metadata } from 'next';

import SiteHero from '@/features/hero/SiteHero';
import { buildPageMetadata } from '@/lib/seo';
import { DocumentLayout, Page, type DocumentSection } from '@/shared/ui/layout';

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'How Wisdom Church collects, uses, and protects your personal information.',
  path: '/privacy',
});

const sections: readonly DocumentSection[] = [
  {
    id: 'collect',
    title: 'Information we collect',
    items: [
      'Name and contact details you submit through forms — contact, prayer, pastoral care, or event registration.',
      'Testimony submissions shared voluntarily through the testimonies feature.',
      'Giving intent records when you interact with online giving options.',
      'Basic analytics data used to understand site navigation. This data is aggregated and contains no personal identifiers.',
      'We do not purchase or receive personal data from third-party data brokers.',
    ],
  },
  {
    id: 'use',
    title: 'How we use your information',
    items: [
      'To respond to your contact, prayer, or pastoral care request.',
      'To process event registrations and send relevant details and confirmations.',
      'To display approved testimonies only when you explicitly consent.',
      'To improve the site experience using aggregated, anonymous analytics.',
      'We do not sell, trade, or share your personal data for third-party marketing.',
    ],
  },
  {
    id: 'protect',
    title: 'Data protection',
    items: [
      'All form submissions are transmitted over HTTPS and encrypted in transit.',
      'Personal data is stored on secured servers with access restricted to authorised church staff.',
      'We retain data only as long as necessary for the purpose for which it was shared.',
      'You may request correction or deletion of your data through the Contact page.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies',
    body: 'We use a minimal set of cookies for sessions, CSRF protection, and preferences. We do not use advertising cookies or social-media tracking pixels.',
    links: [{ href: '/cookies', label: 'Read the Cookies Policy' }],
  },
  {
    id: 'rights',
    title: 'Your rights',
    items: [
      'Access — request a copy of the personal data we hold about you.',
      'Correction — ask us to correct inaccurate or incomplete data.',
      'Deletion — request deletion where we have no lawful basis to retain the data.',
      'Objection — object to how we process your data in certain circumstances.',
    ],
    links: [{ href: '/contact', label: 'Exercise your rights' }],
  },
  {
    id: 'updates',
    title: 'Changes to this policy',
    body: 'We may update this Privacy Policy from time to time. The last-updated date will change whenever a revision is published.',
  },
];

const relatedPolicies = [
  { href: '/cookies', label: 'Cookies & Privacy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/contact', label: 'Contact us' },
] as const;

export default function PrivacyPage() {
  return (
    <Page>
      <SiteHero
        backgroundImage="/Picflow/DSC00019 copy.webp"
        eyebrow="Legal · Privacy"
        title="Privacy Policy"
        subtitle="We handle your information with care and respect. This policy explains what we collect, why we collect it, and how we protect it—in plain language."
        note="Last updated: July 2026"
      />
      <DocumentLayout sections={sections} navigation={relatedPolicies} />
    </Page>
  );
}
