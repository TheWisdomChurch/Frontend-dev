import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import SectionGlow from '@/shared/ui/SectionGlow';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Youth Ministry — Wisdom Church',
  description:
    'A youth ministry built for conviction, community, and confident Christian living for ages 13–25. Part of The Wisdom Church, Lagos.',
  path: '/ministries/youth',
});

/* ── What we do ───────────────────────────────────────── */
const activities = [
  {
    title: 'Scripture-Centred Gatherings',
    description:
      'Teaching moments that connect faith with the real pressure points young people face — not surface-level, but honest and grounded.',
  },
  {
    title: 'Community & Conversation',
    description:
      'Space for friendship, accountability, and honest questions without performance — where young people can be known and belong.',
  },
  {
    title: 'Prayer & Worship',
    description:
      'Times set apart for spiritual encounter, worship response, and growing in the kind of personal devotion that lasts.',
  },
  {
    title: 'Leadership Development',
    description:
      'Practical responsibility that helps young people move from simply attending into real service, ownership, and ministry.',
  },
] as const;

/* ── Core values ──────────────────────────────────────── */
const values = [
  {
    title: 'Truth',
    body: 'Biblical teaching that is honest, practical, and strong enough to hold young people through real life — not just Sunday.',
  },
  {
    title: 'Community',
    body: 'Friendships and relationships that reinforce healthy discipleship. Young people grow better together than alone.',
  },
  {
    title: 'Conviction',
    body: 'A generation that knows what they believe and why — confident, grounded, and able to lead in their time.',
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

export default function YouthMinistryPage() {
  return (
    <main className="min-h-screen">
      {/* ── 1. Hero ───────────────────────────────────────────── */}
      <PageHero
        eyebrow="Youth Ministry · Ages 13 – 25"
        title="A generation on fire for God."
        subtitle="Building young people who know what they believe, why they believe it, and how to live it — confidently."
        backgroundImage="/images/conference-2025.webp"
      />

      {/* ── 2. Mission — dark ────────────────────────────────── */}
      <section className="relative overflow-hidden min-w-0 border-b border-white/8 bg-[var(--app-dark)]">
        <SectionGlow />
        <Container size="xl">
          <ScrollFadeIn className="py-16 lg:py-20">
            <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Our mission
            </p>
            <h2 className="mt-4 max-w-2xl font-headline text-[1.8rem] font-normal leading-snug text-white sm:text-[2.3rem]">
              Young people need more than energy.
              <em className="italic text-[var(--app-primary)]/80">
                {' '}
                They need formation, truth, and healthy community.
              </em>
            </h2>
            <div className="mt-8 h-[1.5px] w-10 bg-[var(--app-primary)]/50" />
            <p className="mt-6 max-w-xl font-ui text-[0.87rem] leading-[2] text-white/70">
              The youth ministry exists to help young people build a strong
              spiritual foundation early, ask honest questions, and develop a
              life of faith that is steady under pressure. Clarity, belonging,
              and real guidance — this is what this ministry is built to give.
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
              Built for young people who want to
              <em className="italic text-[var(--app-primary)]/80">
                {' '}
                grow, lead, and belong.
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
      <section className="relative overflow-hidden min-w-0 border-b border-white/8 bg-[var(--app-dark)]">
        <SectionGlow />
        <Container size="xl">
          <ScrollFadeIn>
            <div className="border-b border-white/8 py-12 lg:py-14">
              <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                What shapes us
              </p>
              <h2 className="mt-3 max-w-lg font-headline text-[1.7rem] font-normal leading-snug text-white sm:text-[2rem]">
                The values at the heart of
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  this generation.
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
                Join the ministry
              </p>
              <h2 className="font-headline text-[1.9rem] font-normal leading-snug text-[var(--app-ink)] sm:text-[2.5rem]">
                Ready to be part of
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  this generation?
                </em>
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/35" />
              <p className="max-w-md font-ui text-[0.85rem] leading-[2] text-[var(--app-ink)]/68">
                Reach out and we will help you or your family understand the
                youth ministry and what the first step should look like.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition hover:brightness-105"
                >
                  Join the youth ministry <Arrow />
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
