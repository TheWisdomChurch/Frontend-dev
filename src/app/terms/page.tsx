import Link from 'next/link';
import type { Metadata } from 'next';
import type { JSX } from 'react';
import { buildPageMetadata } from '@/lib/seo';
import SiteHero from '@/features/hero/SiteHero';

export const metadata: Metadata = buildPageMetadata({
  title: 'Terms of Use',
  description:
    "Terms governing your access to Wisdom Church's website, livestreams, and digital services.",
  path: '/terms',
});

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    body: 'By accessing or using any part of the Services, you confirm that you have read, understood, and agree to be bound by these Terms. If you disagree, please do not use the Services.',
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Account Responsibility',
    body: 'You must be legally able to enter into these Terms. If you create an account, you are responsible for all activity under that account and for safeguarding your credentials.',
  },
  {
    id: 'content',
    title: 'Use of Content',
    body: 'All content — text, graphics, audio, video, and downloads — is owned by The Wisdom Church or our licensors. You may use it only for personal, non-commercial purposes. Do not copy, modify, distribute, or create derivative works without written permission.',
  },
  {
    id: 'conduct',
    title: 'Community Conduct',
    list: [
      'Do not post unlawful, abusive, hateful, or misleading content.',
      'Do not impersonate others or misrepresent your affiliation with the church.',
      'Do not interfere with or disrupt the Services, servers, or connected networks.',
      'Do not attempt to access non-public areas or data without authorisation.',
    ],
  },
  {
    id: 'forms',
    title: 'Forms, Registrations & Submissions',
    body: 'Provide accurate and complete information when submitting forms or event registrations. We use this information to manage registrations, send confirmations, and provide relevant updates.',
  },
  {
    id: 'payments',
    title: 'Donations, Payments & Refunds',
    body: 'Payments are final unless required otherwise by law. Refunds, if issued, are processed to the original payment method. For questions about a specific payment, reach us via the Contact page.',
    link: { href: '/contact', label: 'Contact page' },
  },
  {
    id: 'third-party',
    title: 'Third-Party Links',
    body: 'We may link to third-party sites for convenience. We do not control and are not responsible for their content or practices. Use third-party sites at your own risk.',
  },
  {
    id: 'privacy',
    title: 'Privacy & Cookies',
    body: 'Our data practices are described in our Privacy Policy and Cookies Policy. By using the Services, you consent to our collection and use of information as described there.',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/cookies', label: 'Cookies Policy' },
    ],
  },
  {
    id: 'communications',
    title: 'Communications',
    body: 'By providing your email or phone number, you agree to receive communications related to your requests, registrations, or the Services. You may opt out of promotional emails at any time.',
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    body: 'The Services are provided "as is" and "as available." We do not guarantee uninterrupted, error-free, or secure operation. To the fullest extent permitted by law, we disclaim all warranties, express or implied.',
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, The Wisdom Church will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Services.',
  },
  {
    id: 'termination',
    title: 'Termination',
    body: 'We may suspend or terminate access to the Services at any time for conduct that violates these Terms or is otherwise harmful to the Services or our community.',
  },
  {
    id: 'ugc',
    title: 'User-Generated Content',
    body: 'If you submit content — including testimonies, comments, or media — you grant us a non-exclusive, worldwide, royalty-free licence to use, display, and distribute that content within the Services. You confirm you have the rights to submit it and that it does not violate laws or third-party rights.',
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    body: 'We are committed to providing an accessible experience. If you encounter difficulty using the Services, please contact us so we can provide a reasonable alternative.',
  },
  {
    id: 'copyright',
    title: 'Copyright & DMCA',
    body: 'We respect intellectual property rights. If you believe content on the Services infringes your copyright, notify us via the Contact page with sufficient detail to investigate and respond.',
    link: { href: '/contact', label: 'Contact page' },
  },
  {
    id: 'law',
    title: 'Governing Law',
    body: "These Terms are governed by the laws applicable to The Wisdom Church's primary place of operation, without regard to conflict-of-law principles. Disputes will be resolved in the courts of that jurisdiction unless otherwise required by law.",
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    body: 'We may update these Terms from time to time. Continued use of the Services after changes are posted constitutes acceptance of the revised Terms.',
  },
  {
    id: 'contact',
    title: 'Contact',
    body: 'For questions about these Terms, contact us through the Contact page.',
    link: { href: '/contact', label: 'Contact page' },
  },
];

export default function TermsPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[var(--app-canvas)]">
      <SiteHero
        eyebrow="Legal · Terms"
        title="Terms of Use"
        subtitle="These terms govern your access to our website, livestreams, event registrations, forms, and related digital services. By using the site you agree to them."
        note="Last updated: February 2026"
      />

      {/* ── Two-column document body ───────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 py-16 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-14 lg:py-24">
        {/* ── Sticky TOC ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-4 font-ui text-eyebrow font-bold uppercase tracking-[0.18em] text-[var(--app-ink)]/60">
              Sections
            </p>
            <nav aria-label="Terms of Use table of contents">
              <ul className="space-y-1">
                {sections.map(s => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="group flex items-center gap-2.5 py-1 font-ui text-label text-[var(--app-ink)]/45 transition hover:text-[var(--app-primary)]"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-[var(--app-ink)]/8 pt-6 space-y-1.5">
                <Link
                  href="/privacy"
                  className="block font-ui text-label text-[var(--app-ink)]/60 transition hover:text-[var(--app-primary)]"
                >
                  → Privacy Policy
                </Link>
                <Link
                  href="/cookies"
                  className="block font-ui text-label text-[var(--app-ink)]/60 transition hover:text-[var(--app-primary)]"
                >
                  → Cookies & Privacy
                </Link>
                <Link
                  href="/contact"
                  className="block font-ui text-label text-[var(--app-ink)]/60 transition hover:text-[var(--app-primary)]"
                >
                  → Contact us
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* ── Sections ── */}
        <article className="space-y-0">
          {sections.map((section, index) => (
            <section
              id={section.id}
              key={section.id}
              className={`py-10 ${index < sections.length - 1 ? 'border-b border-[var(--app-ink)]/8' : ''}`}
            >
              <div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
                    {section.title}
                  </h2>

                  {section.body && (
                    <p className="mt-3 font-ui text-body-md leading-[2] text-[var(--app-ink)]/65">
                      {section.body}
                    </p>
                  )}

                  {section.list && (
                    <ul className="mt-3 space-y-2.5">
                      {section.list.map(item => (
                        <li
                          key={item}
                          className="flex items-start gap-3 font-ui text-body-md leading-[1.85] text-[var(--app-ink)]/65"
                        >
                          <span
                            className="mt-2.5 h-[2px] w-3.5 flex-none bg-[var(--app-primary)]/60"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.links && (
                    <div className="mt-3 flex gap-5">
                      {section.links.map(l => (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="font-ui text-body-sm font-semibold text-[var(--app-primary)] underline underline-offset-4 transition hover:text-[var(--app-primary-light)]"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {section.link && !section.links && (
                    <div className="mt-3">
                      <Link
                        href={section.link.href}
                        className="font-ui text-body-sm font-semibold text-[var(--app-primary)] underline underline-offset-4 transition hover:text-[var(--app-primary-light)]"
                      >
                        {section.link.label}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </article>
      </div>

      {/* ── Footer nav ─────────────────────────────────────────── */}
      <div className="border-t border-[var(--app-ink)]/8 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-3">
          <Link
            href="/contact"
            className="inline-flex h-10 items-center bg-[var(--app-primary)] px-6 font-ui text-label font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)]"
          >
            Contact us
          </Link>
          <Link
            href="/privacy"
            className="font-ui text-body-sm text-[var(--app-ink)]/50 transition hover:text-[var(--app-primary)]"
          >
            Privacy Policy
          </Link>
          <Link
            href="/cookies"
            className="font-ui text-body-sm text-[var(--app-ink)]/50 transition hover:text-[var(--app-primary)]"
          >
            Cookies & Privacy
          </Link>
        </div>
      </div>
    </main>
  );
}
