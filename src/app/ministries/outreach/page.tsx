import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';

export const metadata: Metadata = {
  title: 'Outreach & Missions — Wisdom Church',
  description:
    "Practical expressions of God's love through service, evangelism, and community development. Part of The Wisdom Church, Lagos.",
};

/* ── What we do ───────────────────────────────────────── */
const activities = [
  {
    title: 'Community Support',
    description:
      'Projects focused on meeting practical needs and strengthening families and neighbourhoods with care and dignity.',
  },
  {
    title: 'Evangelism',
    description:
      'Intentional moments of gospel witness that combine compassion, clarity, and spiritual courage beyond the church walls.',
  },
  {
    title: 'Volunteer Teams',
    description:
      'Teams that plan, prepare, and execute outreach initiatives with consistency, humility, and genuine care for people.',
  },
  {
    title: 'Project Mobilisation',
    description:
      'Focused initiatives that help the church respond well to specific community needs and meaningful moments.',
  },
] as const;

/* ── Core values ──────────────────────────────────────── */
const values = [
  {
    title: 'Compassion',
    body: 'Meeting people where they are — with real help, genuine respect, and the love of Christ expressed practically.',
  },
  {
    title: 'Humility',
    body: 'Serving without agenda. Outreach works best when people come prepared to give, not to be seen.',
  },
  {
    title: 'Mission',
    body: 'Carrying the gospel beyond church walls — not occasionally, but as a natural part of how this church lives.',
  },
] as const;

/* ── Arrow ────────────────────────────────────────────── */
function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 6h10M6 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function OutreachPage() {
  return (
    <main className="min-h-screen">
      {/* ── 1. Hero ───────────────────────────────────────────── */}
      <PageHero
        eyebrow="Outreach & Missions"
        title="Taking the church beyond the walls."
        subtitle="Practical expressions of compassion, service, and gospel witness in the communities around us."
        backgroundImage="/images/supernatural-service.webp"
      />

      {/* ── 2. Mission — dark ────────────────────────────────── */}
      <section className="overflow-hidden min-w-0 border-b border-white/8 bg-[var(--app-dark)]">
        <Container size="xl">
          <ScrollFadeIn className="py-16 lg:py-20">
            <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Our mission
            </p>
            <h2 className="mt-4 max-w-2xl font-headline text-[1.8rem] font-normal leading-snug text-white sm:text-[2.3rem]">
              Outreach should carry both the
              <em className="italic text-[var(--app-primary)]/80">
                {' '}
                compassion of Christ{' '}
              </em>
              and the wisdom to serve people well.
            </h2>
            <div className="mt-8 h-[1.5px] w-10 bg-[var(--app-primary)]/50" />
            <p className="mt-6 max-w-xl font-ui text-[0.87rem] leading-[2] text-white/70">
              This ministry exists to meet practical needs, strengthen human
              dignity, and create meaningful opportunities for the church to
              serve its city with love and clarity. Mission is not occasional
              here — it is part of how Wisdom Church lives.
            </p>
          </ScrollFadeIn>
        </Container>
      </section>

      {/* ── 3. What we do — canvas ───────────────────────────── */}
      <section className="overflow-hidden min-w-0 border-b border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <ScrollFadeIn className="pt-16 lg:pt-20">
            <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              What we do
            </p>
            <h2 className="mt-3 max-w-xl font-headline text-[1.7rem] font-normal leading-snug text-[var(--app-ink)] sm:text-[2rem]">
              Built for those who want to
              <em className="italic text-[var(--app-primary)]/80">
                {' '}
                serve beyond Sunday.
              </em>
            </h2>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 gap-x-12 gap-y-0 pb-16 pt-12 sm:grid-cols-2 lg:pb-20 lg:pt-14">
            {activities.map((item, i) => (
              <ScrollFadeIn key={item.title} delay={i * 0.07}>
                <div className="border-t border-[var(--app-ink)]/10 py-8">
                  <div className="mb-4 h-[1.5px] w-6 bg-[var(--app-primary)]/50" />
                  <h3 className="font-headline text-[1.25rem] font-normal text-[var(--app-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-ui text-[0.84rem] leading-[1.95] text-[var(--app-ink)]/68">
                    {item.description}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. Core values — dark ────────────────────────────── */}
      <section className="overflow-hidden min-w-0 border-b border-white/8 bg-[var(--app-dark)]">
        <Container size="xl">
          <ScrollFadeIn>
            <div className="border-b border-white/8 py-12 lg:py-14">
              <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                What shapes us
              </p>
              <h2 className="mt-3 max-w-lg font-headline text-[1.7rem] font-normal leading-snug text-white sm:text-[2rem]">
                The values behind
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  every initiative we run.
                </em>
              </h2>
            </div>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 divide-y divide-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {values.map((v, i) => (
              <ScrollFadeIn key={v.title} delay={i * 0.08}>
                <div className="flex flex-col py-10 sm:px-8 lg:px-10 lg:py-12">
                  <div className="mb-5 h-[1.5px] w-6 bg-[var(--app-primary)]/55" />
                  <h3 className="font-headline text-[1.8rem] font-normal leading-none text-white lg:text-[2.2rem]">
                    {v.title}
                  </h3>
                  <p className="mt-4 font-ui text-[0.84rem] leading-[1.95] text-white/70">
                    {v.body}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5. CTA — canvas ──────────────────────────────────── */}
      <ScrollFadeIn>
        <section className="overflow-hidden min-w-0 bg-[var(--app-canvas)] py-20 lg:py-28">
          <Container size="lg">
            <div className="flex flex-col items-center gap-7 text-center">
              <p className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Get involved
              </p>
              <h2 className="font-headline text-[1.9rem] font-normal leading-snug text-[var(--app-ink)] sm:text-[2.5rem]">
                Ready to serve
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  beyond the walls?
                </em>
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/35" />
              <p className="max-w-md font-ui text-[0.85rem] leading-[2] text-[var(--app-ink)]/68">
                Reach out and we will connect you to the next outreach
                initiative or community service opportunity.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition hover:brightness-105"
                >
                  Join outreach <Arrow />
                </Link>
                <Link
                  href="/events/upcoming"
                  className="inline-flex items-center justify-center gap-2 border border-[var(--app-ink)]/18 px-8 py-3.5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                >
                  See upcoming events
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
