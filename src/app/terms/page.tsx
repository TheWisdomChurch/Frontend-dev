// app/terms/page.tsx

import Link from 'next/link';
import type { JSX } from 'react';
import { BodyMD, BodySM, Caption, H2, H3 } from '@/components/text';
import { PageSection } from '@/components/layout';

type Section = {
  title: string;
  body?: string;
  list?: string[];
  link?: { href: string; label: string };
  links?: { href: string; label: string }[];
};

const sections: Section[] = [
  {
    title: '1. Acceptance of Terms',
    body:
      'By accessing or using any part of the Services, you confirm that you have read, understood, and agree to be bound by these Terms. If you disagree, please do not use the Services.',
  },
  {
    title: '2. Eligibility & Account Responsibility',
    body:
      'You must be legally able to enter into these Terms. If you create an account, you are responsible for all activity under that account and for safeguarding your credentials.',
  },
  {
    title: '3. Use of Content',
    body:
      'All content (text, graphics, audio, video, downloads) is owned by The Wisdom Church or our licensors. You may use it only for personal, non-commercial purposes. Do not copy, modify, distribute, or create derivative works without written permission.',
  },
  {
    title: '4. Community Conduct',
    list: [
      'Do not post unlawful, abusive, hateful, or misleading content.',
      'Do not impersonate others or misrepresent your affiliation.',
      'Do not interfere with or disrupt the Services, servers, or networks.',
      'Do not attempt to access non-public areas or data without authorization.',
    ],
  },
  {
    title: '5. Forms, Registrations & Submissions',
    body:
      'Provide accurate and complete information when submitting forms or event registrations. We use this information to manage registrations, send confirmations, and provide updates.',
  },
  {
    title: '6. Donations, Payments & Refunds',
    body:
      'Payments are final unless required otherwise by law. Refunds, if issued, are processed to the original payment method. For questions, contact us via the Contact page.',
    link: { href: '/contact', label: 'Contact page' },
  },
  {
    title: '7. Third-Party Links',
    body:
      'We may link to third-party sites for convenience. We do not control and are not responsible for their content or practices. Use third-party sites at your own risk.',
  },
  {
    title: '8. Privacy & Cookies',
    body:
      'Our data practices are described in our Privacy Policy and Cookies Policy. By using the Services, you consent to our collection and use of information as described there.',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/cookies', label: 'Cookies Policy' },
    ],
  },
  {
    title: '9. Communications',
    body:
      'By providing your email or phone, you agree to receive communications related to your requests, registrations, or the Services. You may opt out of promotional emails at any time.',
  },
  {
    title: '10. Disclaimers',
    body:
      'The Services are provided “as is” and “as available.” We do not guarantee uninterrupted, error-free, or secure operation. To the fullest extent permitted by law, we disclaim all warranties, express or implied.',
  },
  {
    title: '11. Limitation of Liability',
    body:
      'To the fullest extent permitted by law, The Wisdom Church will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Services.',
  },
  {
    title: '12. Termination',
    body:
      'We may suspend or terminate access to the Services at any time for conduct that violates these Terms or is otherwise harmful to the Services or community.',
  },
  {
    title: '13. User-Generated Content',
    body:
      'If you submit content (including testimonies, comments, or media), you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content within the Services. You confirm you have rights to submit it and that it does not violate laws or third-party rights.',
  },
  {
    title: '14. Accessibility',
    body:
      'We are committed to providing an accessible experience. If you encounter difficulty using the Services, please contact us so we can provide a reasonable alternative.',
  },
  {
    title: '15. Copyright & DMCA',
    body:
      'We respect intellectual property rights. If you believe content on the Services infringes your copyright, notify us via the Contact page with sufficient detail to investigate and respond.',
    link: { href: '/contact', label: 'Contact page' },
  },
  {
    title: '16. Governing Law',
    body:
      'These Terms are governed by the laws applicable to The Wisdom Church’s primary place of operation, without regard to conflict-of-law principles. Disputes will be resolved in the courts of that jurisdiction unless otherwise required by law.',
  },
  {
    title: '17. Changes to These Terms',
    body:
      'We may update these Terms from time to time. Continued use of the Services after changes are posted constitutes acceptance of the revised Terms.',
  },
  {
    title: '18. Contact',
    body: 'For questions about these Terms, contact us through the Contact page.',
    link: { href: '/contact', label: 'Contact page' },
  },
];

export default function TermsPage(): JSX.Element {
  return (
    <PageSection tone="surface" padding="xl">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-3">
          <Caption className="uppercase tracking-[0.32em] text-subtle">Legal</Caption>
          <H2>Terms of Use</H2>
          <BodyMD className="text-muted max-w-3xl">
            Welcome to The Wisdom Church online experience. These Terms govern
            your access to and use of our website, livestreams, event
            registrations, forms, content, and related services (the “Services”).
            By using the Services, you agree to these Terms.
          </BodyMD>
          <BodySM className="text-subtle">Last updated: February 6, 2026</BodySM>
        </header>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <H3>{section.title}</H3>
              {section.body && <BodyMD className="text-muted">{section.body}</BodyMD>}
              {section.list && (
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.links && (
                <div className="space-x-4 text-sm">
                  {section.links.map((l) => (
                    <Link key={l.href} href={l.href} className="underline underline-offset-4 text-muted">
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
              {section.link && !section.links && (
                <div className="text-sm">
                  <Link href={section.link.href} className="underline underline-offset-4 text-muted">
                    {section.link.label}
                  </Link>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
