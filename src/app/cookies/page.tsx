import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookies & Privacy — Wisdom Church',
  description:
    'How Wisdom Church uses cookies and handles your data on this website.',
};

const cookieGroups = [
  {
    category: 'Essential',
    badge: 'Always active',
    description:
      'Required for the site to work. These cannot be disabled — without them, forms, security, and core features would not function.',
    cookies: [
      {
        name: 'Session token',
        purpose: 'Keeps your session active and secures form submissions',
        duration: 'Session',
      },
      {
        name: 'CSRF token',
        purpose: 'Prevents unauthorised cross-site form submissions',
        duration: 'Session',
      },
    ],
  },
  {
    category: 'Preferences',
    badge: 'Optional',
    description:
      'Remember choices you make so you don’t have to re-select them on every visit.',
    cookies: [
      {
        name: 'cookie_consent',
        purpose: 'Records that you have seen and accepted this cookie notice',
        duration: '1 year',
      },
      {
        name: 'theme',
        purpose: 'Stores your light or dark mode preference',
        duration: '1 year',
      },
    ],
  },
  {
    category: 'Analytics',
    badge: 'Optional',
    description:
      'Help us understand how the site is used. All data is aggregated and contains no personal identifiers.',
    cookies: [
      {
        name: 'Analytics session',
        purpose:
          'Counts page views and navigation paths — no names, emails, or device fingerprints',
        duration: '30 days',
      },
    ],
  },
];

const choices = [
  'Clear all cookies at any time through your browser settings or history.',
  'Enable "Do Not Track" in your browser to opt out of analytics.',
  'Request deletion of personal data you submitted through forms — use the Contact page.',
  'Skip any optional form fields — they are never required for basic site use.',
];

const notUsed = [
  'We do not use advertising cookies or remarketing trackers.',
  'We do not share cookie data with third-party ad networks.',
  'We do not use social media tracking pixels (Facebook, TikTok, Google Ads, etc.).',
  'We do not fingerprint your browser or device to identify you across visits.',
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[var(--app-canvas)]">
      {/* ── Dark hero ─────────────────────────────────────────── */}
      <div className="bg-[var(--app-dark)] px-6 pb-20 pt-32">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Legal · Cookies
          </p>
          <h1
            className="font-headline font-normal text-white"
            // eslint-disable-next-line no-restricted-syntax
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
          >
            Cookies &amp; Privacy
          </h1>
          <p className="mt-5 max-w-xl font-ui text-[0.95rem] leading-[1.9] text-white/62">
            We use only the cookies this site needs to function — no advertising
            trackers, no marketing pixels, no profiling. Here is exactly what we
            store and why.
          </p>
          <p className="mt-5 font-ui text-[0.7rem] text-white/28">
            Last updated: July 2026
          </p>
        </div>
      </div>

      {/* ── Document body ─────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
        {/* Overview */}
        <section className="overflow-hidden min-w-0 border-b border-[var(--app-ink)]/10 pb-14">
          <p className="mb-4 font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Overview
          </p>
          <p className="max-w-2xl font-ui text-[0.96rem] leading-[2] text-[var(--app-ink)]/70">
            Cookies are small text files placed in your browser when you visit a
            website. We use a minimal set — only what is necessary to keep the
            site running and to remember your basic preferences. We do not use
            cookies for advertising, cross-site tracking, or data brokering.
          </p>
        </section>

        {/* Cookie tables */}
        <section className="overflow-hidden min-w-0 space-y-14 border-b border-[var(--app-ink)]/10 py-14">
          <p className="mb-2 font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Cookies we use
          </p>

          {cookieGroups.map(group => (
            <div key={group.category}>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h2 className="font-headline text-[1.35rem] font-normal text-[var(--app-ink)]">
                  {group.category}
                </h2>
                <span
                  className={`px-2.5 py-0.5 font-ui text-[0.6rem] font-bold uppercase tracking-[0.12em] ${
                    group.category === 'Essential'
                      ? 'bg-[var(--app-ink)]/8 text-[var(--app-ink)]/50'
                      : 'bg-[var(--app-primary)]/10 text-[var(--app-primary)]'
                  }`}
                >
                  {group.badge}
                </span>
              </div>

              <p className="mb-5 max-w-xl font-ui text-[0.88rem] leading-[1.85] text-[var(--app-ink)]/55">
                {group.description}
              </p>

              {/* Table */}
              <div className="overflow-hidden border border-[var(--app-ink)]/10">
                <div className="hidden grid-cols-[1.4fr_2.4fr_0.7fr] border-b border-[var(--app-ink)]/8 bg-[var(--app-ink)]/[0.035] px-5 py-2.5 sm:grid">
                  <span className="font-ui text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--app-ink)]/38">
                    Cookie
                  </span>
                  <span className="font-ui text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--app-ink)]/38">
                    Purpose
                  </span>
                  <span className="font-ui text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--app-ink)]/38">
                    Duration
                  </span>
                </div>

                {group.cookies.map((cookie, i) => (
                  <div
                    key={cookie.name}
                    className={`grid grid-cols-1 px-5 py-4 sm:grid-cols-[1.4fr_2.4fr_0.7fr] ${
                      i < group.cookies.length - 1
                        ? 'border-b border-[var(--app-ink)]/8'
                        : ''
                    } bg-white/50`}
                  >
                    <span className="mb-1 font-ui text-[0.85rem] font-semibold text-[var(--app-ink)] sm:mb-0">
                      {cookie.name}
                    </span>
                    <span className="font-ui text-[0.85rem] leading-[1.7] text-[var(--app-ink)]/65">
                      {cookie.purpose}
                    </span>
                    <span className="mt-1 font-ui text-[0.8rem] text-[var(--app-ink)]/42 sm:mt-0">
                      {cookie.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* What we do not do */}
        <section className="overflow-hidden min-w-0 border-b border-[var(--app-ink)]/10 py-14">
          <p className="mb-5 font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            What we don't do
          </p>
          <ul className="space-y-3.5">
            {notUsed.map(item => (
              <li
                key={item}
                className="flex items-start gap-3.5 font-ui text-[0.9rem] leading-[1.85] text-[var(--app-ink)]/70"
              >
                <span
                  className="mt-2.5 h-[2px] w-4 flex-none bg-[var(--app-primary)]"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Your choices */}
        <section className="overflow-hidden min-w-0 border-b border-[var(--app-ink)]/10 py-14">
          <p className="mb-5 font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Your choices
          </p>
          <ul className="space-y-3.5">
            {choices.map(item => (
              <li
                key={item}
                className="flex items-start gap-3.5 font-ui text-[0.9rem] leading-[1.85] text-[var(--app-ink)]/70"
              >
                <span
                  className="mt-2.5 h-[2px] w-4 flex-none bg-[var(--app-primary)]"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="overflow-hidden min-w-0 py-14">
          <p className="mb-4 font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Questions?
          </p>
          <p className="mb-7 max-w-lg font-ui text-[0.92rem] leading-[1.9] text-[var(--app-ink)]/65">
            If you have questions about our cookie use or wish to request
            deletion of data you submitted, contact us through the Contact page
            or visit the church office.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center bg-[var(--app-primary)] px-7 font-ui text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
            >
              Contact us
            </Link>
            <Link
              href="/privacy"
              className="inline-flex h-11 items-center gap-1 font-ui text-[0.82rem] font-semibold text-[var(--app-ink)]/50 transition hover:text-[var(--app-primary)]"
            >
              Privacy Policy →
            </Link>
            <Link
              href="/terms"
              className="inline-flex h-11 items-center gap-1 font-ui text-[0.82rem] font-semibold text-[var(--app-ink)]/50 transition hover:text-[var(--app-primary)]"
            >
              Terms of Use →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
