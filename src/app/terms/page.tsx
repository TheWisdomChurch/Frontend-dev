import type { Metadata } from 'next';

import SiteHero from '@/features/hero/SiteHero';
import { buildPageMetadata } from '@/lib/seo';
import { DocumentLayout, Page, type DocumentSection } from '@/shared/ui/layout';

export const metadata: Metadata = buildPageMetadata({
  title: 'Terms of Use',
  description:
    "Terms governing your access to Wisdom Church's website, livestreams, and digital services.",
  path: '/terms',
});

const sections: readonly DocumentSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    body: 'By accessing or using any part of the Services, you confirm that you have read, understood, and agree to these Terms. If you disagree, please do not use the Services.',
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Account Responsibility',
    body: 'You must be legally able to enter into these Terms. If you create an account, you are responsible for its activity and for safeguarding your credentials.',
  },
  {
    id: 'content',
    title: 'Use of Content',
    body: 'Text, graphics, audio, video, and downloads are owned by The Wisdom Church or our licensors. You may use them for personal, non-commercial purposes only unless written permission is provided.',
  },
  {
    id: 'conduct',
    title: 'Community Conduct',
    items: [
      'Do not post unlawful, abusive, hateful, or misleading content.',
      'Do not impersonate others or misrepresent your affiliation with the church.',
      'Do not interfere with the Services, servers, or connected networks.',
      'Do not attempt to access non-public areas or data without authorisation.',
    ],
  },
  {
    id: 'forms',
    title: 'Forms, Registrations & Submissions',
    body: 'Provide accurate and complete information when submitting forms or event registrations. We use this information to manage registrations, confirmations, and relevant updates.',
  },
  {
    id: 'payments',
    title: 'Donations, Payments & Refunds',
    body: 'Payments are final unless required otherwise by law. Approved refunds are returned to the original payment method.',
    links: [{ href: '/contact', label: 'Ask about a payment' }],
  },
  {
    id: 'third-party',
    title: 'Third-Party Links',
    body: 'We may link to third-party sites for convenience. We do not control and are not responsible for their content or practices.',
  },
  {
    id: 'privacy',
    title: 'Privacy & Cookies',
    body: 'Our Privacy and Cookies policies describe how information is collected, used, and protected.',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/cookies', label: 'Cookies Policy' },
    ],
  },
  {
    id: 'communications',
    title: 'Communications',
    body: 'When you provide an email address or phone number, you agree to receive communications related to your requests, registrations, or the Services.',
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    body: 'The Services are provided “as is” and “as available.” We do not guarantee uninterrupted, error-free, or secure operation.',
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, The Wisdom Church is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the Services.',
  },
  {
    id: 'termination',
    title: 'Termination',
    body: 'We may suspend or terminate access for conduct that violates these Terms or harms the Services or our community.',
  },
  {
    id: 'ugc',
    title: 'User-Generated Content',
    body: 'By submitting testimonies, comments, or media, you grant us a non-exclusive, worldwide, royalty-free licence to use that content within the Services and confirm that you have the right to submit it.',
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    body: 'We are committed to an accessible experience. Contact us if you encounter difficulty so we can provide a reasonable alternative.',
    links: [{ href: '/contact', label: 'Report an accessibility issue' }],
  },
  {
    id: 'copyright',
    title: 'Copyright',
    body: 'If you believe content within the Services infringes your rights, provide sufficient detail through the Contact page so we can investigate.',
    links: [{ href: '/contact', label: 'Send a copyright notice' }],
  },
  {
    id: 'law',
    title: 'Governing Law',
    body: "These Terms are governed by the laws applicable to The Wisdom Church's primary place of operation, without regard to conflict-of-law principles.",
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    body: 'We may revise these Terms. Continued use after a revision is published constitutes acceptance of the updated Terms.',
  },
  {
    id: 'contact',
    title: 'Contact',
    body: 'Contact us if you have questions about these Terms.',
    links: [{ href: '/contact', label: 'Contact us' }],
  },
];

const relatedPolicies = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookies', label: 'Cookies & Privacy' },
  { href: '/contact', label: 'Contact us' },
] as const;

export default function TermsPage() {
  return (
    <Page>
      <SiteHero
        backgroundImage="/Picflow/DSC00019-copy.webp"
        eyebrow="Legal · Terms"
        title="Terms of Use"
        subtitle="These terms govern your access to our website, livestreams, registrations, forms, and related digital services."
        note="Last updated: February 2026"
      />
      <DocumentLayout sections={sections} navigation={relatedPolicies} />
    </Page>
  );
}
