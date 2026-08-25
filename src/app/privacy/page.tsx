import Link from 'next/link';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'How Wisdom Church collects, uses, and protects your personal information.',
  path: '/privacy',
});

const sections = [
  {
    id: 'collect',
    title: 'Information we collect',
    items: [
      'Name and contact details you submit through forms — contact, prayer, pastoral care, or event registration.',
      'Testimony submissions shared voluntarily through the testimonies feature.',
      'Giving intent records when you interact with online giving options.',
      'Basic analytics data to understand how people navigate the site — aggregated only, no personal identifiers.',
      'We do not purchase or receive personal data from third-party data brokers.',
    ],
  },
  {
    id: 'use',
    title: 'How we use your information',
    items: [
      'To respond to your contact, prayer, or pastoral care request.',
      'To process event registrations and send you relevant event details and confirmations.',
      'To display approved testimonies — only when you explicitly consent at the point of submission.',
      'To improve the site experience using aggregated, anonymous analytics.',
      'We do not sell, trade, or share your personal data with third parties for marketing purposes.',
    ],
  },
  {
    id: 'protect',
    title: 'Data protection',
    items: [
      'All form submissions are transmitted over HTTPS — your data is encrypted in transit.',
      'Personal data is stored on secured servers with access restricted to authorised church staff only.',
      'We retain submitted data only as long as necessary to fulfil the purpose for which it was shared.',
      'You may request correction or deletion of your data at any time through the Contact page.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies',
    body: 'We use a minimal set of cookies — session tokens, CSRF protection, and basic preference storage. We do not use advertising cookies or social media tracking pixels. For a full breakdown, see our Cookies & Privacy page.',
    link: { href: '/cookies', label: 'Cookies & Privacy page' },
  },
  {
    id: 'rights',
    title: 'Your rights',
    items: [
      'Access — you may request a copy of the personal data we hold about you.',
      'Correction — you may ask us to correct inaccurate or incomplete data.',
      'Deletion — you may request that we delete your personal data where we have no lawful basis to retain it.',
      'Objection — you may object to how we process your data in certain circumstances.',
      'To exercise any of these rights, contact us through the Contact page.',
    ],
  },
  {
    id: 'updates',
    title: 'Changes to this policy',
    body: 'We may update this Privacy Policy from time to time. When we do, the "Last updated" date at the top of this page will change. Continued use of the site after changes are posted constitutes acceptance of the revised policy.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--app-canvas)]">
      {/* ── Dark hero ─────────────────────────────────────────── */}
      <div className="bg-[var(--app-dark)] px-6 pb-20 pt-32">
        <div className="mx-auto max-w-5xl">
          <p className="mb-5 font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Legal · Privacy
          </p>
          <h1
            className="font-headline font-normal text-white"
            // eslint-disable-next-line no-restricted-syntax
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
          >
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-xl font-ui text-body-md leading-[1.9] text-white/62">
            We handle your information with care and respect. This policy
            explains what we collect, why we collect it, and how we protect it —
            in plain language.
          </p>
          <p className="mt-5 font-ui text-label text-white/45">
            Last updated: July 2026
          </p>
        </div>
      </div>

      {/* ── Two-column document body ───────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 py-16 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-14 lg:py-24">
        {/* ── Sticky TOC ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-4 font-ui text-eyebrow font-bold uppercase tracking-[0.18em] text-[var(--app-ink)]/60">
              Sections
            </p>
            <nav aria-label="Privacy Policy table of contents">
              <ul className="space-y-1.5">
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
                  href="/cookies"
                  className="block font-ui text-label text-[var(--app-ink)]/60 transition hover:text-[var(--app-primary)]"
                >
                  → Cookies & Privacy
                </Link>
                <Link
                  href="/terms"
                  className="block font-ui text-label text-[var(--app-ink)]/60 transition hover:text-[var(--app-primary)]"
                >
                  → Terms of Use
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
                  <h2 className="font-headline text-heading-sm font-normal text-[var(--app-ink)]">
                    {section.title}
                  </h2>

                  {'items' in section && section.items && (
                    <ul className="mt-4 space-y-3">
                      {section.items.map(item => (
                        <li
                          key={item}
                          className="flex items-start gap-3 font-ui text-body-md leading-[1.9] text-[var(--app-ink)]/65"
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

                  {'body' in section && section.body && (
                    <p className="mt-3 font-ui text-body-md leading-[2] text-[var(--app-ink)]/65">
                      {section.body}
                    </p>
                  )}

                  {'link' in section && section.link && (
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

      {/* ── Contact CTA ─────────────────────────────────────────── */}
      <div className="border-t border-[var(--app-ink)]/8 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-3">
          <div>
            <p className="font-ui text-body-md font-semibold text-[var(--app-ink)]">
              Privacy questions?
            </p>
            <p className="mt-0.5 font-ui text-body-sm text-[var(--app-ink)]/50">
              Request access, correction, or deletion of your data.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center bg-[var(--app-primary)] px-6 font-ui text-label font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)]"
          >
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
