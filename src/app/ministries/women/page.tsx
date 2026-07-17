import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import SectionGlow from '@/shared/ui/SectionGlow';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: "Women's Ministry — Wisdom Church",
  description:
    "A women's ministry built for spiritual growth, genuine community, and purpose-filled living at every stage of life. Part of The Wisdom Church, Lagos.",
  path: '/ministries/women',
});

/* ── What we do ───────────────────────────────────────── */
const activities = [
  {
    title: 'Bible Study Circles',
    description:
      'Focused spaces to understand scripture, ask honest questions, and apply truth with maturity — not just read it.',
  },
  {
    title: 'Prayer Gatherings',
    description:
      'Shared prayer moments that strengthen women spiritually and deepen a genuine dependence on God together.',
  },
  {
    title: 'Mentorship & Support',
    description:
      'Relationships that help women grow through counsel, shared wisdom, and real encouragement across seasons.',
  },
  {
    title: 'Service & Leadership',
    description:
      'Clear pathways to contribute in church life and develop steady responsibility in ministry over time.',
  },
] as const;

/* ── Core values ──────────────────────────────────────── */
const values = [
  {
    title: 'Faith',
    body: 'A ministry rooted in the Word and sustained by prayer — not events, not performance, just genuine growth.',
  },
  {
    title: 'Sisterhood',
    body: 'Real relationships that carry women through every season honestly — not surface-level, but truly present.',
  },
  {
    title: 'Purpose',
    body: 'Growing into who God created you to be — in your home, your work, your service, and your community.',
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

export default function WomenMinistryPage() {
  return (
    <main className="min-h-screen">
      {/* ── 1. Hero — cinematic, full height ─────────────────── */}
      <PageHero
        eyebrow="Women's Ministry"
        title="Women who grow with grace. Women who lead with purpose."
        subtitle="A community built for women at every stage of life — rooted in scripture, prayer, and genuine sisterhood."
      />

      {/* ── 2. Flourish Conference — dark ────────────────────── */}
      <section className="relative overflow-hidden min-w-0 border-b border-white/8 bg-[var(--app-dark)]">
        <SectionGlow />
        <Container size="xl">
          <ScrollFadeIn className="pt-14 lg:pt-18">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  Flourish · Women&apos;s Conference 2025
                </p>
                <h2 className="mt-3 font-headline text-[2rem] font-normal leading-snug text-white sm:text-[2.6rem] lg:text-[3rem]">
                  Rooted. Rising.
                  <em className="italic text-[var(--app-primary)]/80">
                    {' '}
                    Flourishing.
                  </em>
                </h2>
                <p className="mt-5 max-w-xl font-ui text-[0.86rem] leading-[2] text-white/70">
                  Flourish is the Wisdom Church Women&apos;s Conference — a
                  gathering where women come together in worship, the Word, and
                  honest community to celebrate what God is doing in and through
                  their lives. This year&apos;s conference was a moment of
                  breakthrough, renewal, and real conversation about growing as
                  a woman of God in every season. If you missed it, watch the
                  full session below.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 self-start border border-white/18 px-6 py-3 font-ui text-[0.72rem] font-semibold text-white/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] lg:self-auto"
              >
                Stay updated on next conference <Arrow />
              </Link>
            </div>
          </ScrollFadeIn>

          {/* YouTube embed */}
          <ScrollFadeIn delay={0.1}>
            <div className="pb-14 pt-8 lg:pb-18 lg:pt-10">
              <div className="relative aspect-video w-full overflow-hidden border border-white/8">
                <iframe
                  src="https://www.youtube.com/embed/St-kiKLelUU"
                  title="Flourish — Wisdom Church Women's Conference 2025"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </div>
          </ScrollFadeIn>
        </Container>
      </section>

      {/* ── 3. Mission — canvas ──────────────────────────────── */}
      <section className="overflow-hidden min-w-0 border-b border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <ScrollFadeIn className="py-16 lg:py-20">
            <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Our mission
            </p>
            <h2 className="mt-4 max-w-2xl font-headline text-[1.8rem] font-normal leading-snug text-[var(--app-ink)] sm:text-[2.3rem]">
              Women flourish best where
              <em className="italic text-[var(--app-primary)]/80">
                {' '}
                biblical formation and genuine support{' '}
              </em>
              work together.
            </h2>
            <div className="mt-8 h-[1.5px] w-10 bg-[var(--app-primary)]/50" />
            <p className="mt-6 max-w-xl font-ui text-[0.87rem] leading-[2] text-[var(--app-ink)]/70">
              This ministry creates space for women to deepen their walk with
              God, carry one another through real life, and grow into stronger
              service, leadership, and witness. Spiritual depth and community
              warmth are not opposites here — they belong together.
            </p>
          </ScrollFadeIn>
        </Container>
      </section>

      {/* ── 4. What we do — dark ─────────────────────────────── */}
      <section className="relative overflow-hidden min-w-0 border-b border-white/8 bg-[var(--app-dark)]">
        <SectionGlow />
        <Container size="xl">
          <ScrollFadeIn className="pt-16 lg:pt-20">
            <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              What we do
            </p>
            <h2 className="mt-3 max-w-xl font-headline text-[1.7rem] font-normal leading-snug text-white sm:text-[2rem]">
              Built for women who want to
              <em className="italic text-[var(--app-primary)]/80">
                {' '}
                go deeper and grow further.
              </em>
            </h2>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 gap-x-12 gap-y-0 pb-16 pt-12 sm:grid-cols-2 lg:pb-20 lg:pt-14">
            {activities.map((item, i) => (
              <ScrollFadeIn key={item.title} delay={i * 0.07}>
                <div className="border-t border-white/8 py-8">
                  <div className="mb-4 h-[1.5px] w-6 bg-[var(--app-primary)]/50" />
                  <h3 className="font-headline text-[1.25rem] font-normal text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-ui text-[0.84rem] leading-[1.95] text-white/70">
                    {item.description}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5. Core values — canvas ──────────────────────────── */}
      <section className="overflow-hidden min-w-0 border-b border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <ScrollFadeIn>
            <div className="border-b border-[var(--app-ink)]/8 py-12 lg:py-14">
              <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                What shapes us
              </p>
              <h2 className="mt-3 max-w-lg font-headline text-[1.7rem] font-normal leading-snug text-[var(--app-ink)] sm:text-[2rem]">
                The values that define
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  every woman in this ministry.
                </em>
              </h2>
            </div>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 divide-y divide-[var(--app-ink)]/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {values.map((v, i) => (
              <ScrollFadeIn key={v.title} delay={i * 0.08}>
                <div className="flex flex-col py-10 sm:px-8 lg:px-10 lg:py-12">
                  <div className="mb-5 h-[1.5px] w-6 bg-[var(--app-primary)]/55" />
                  <h3 className="font-headline text-[1.8rem] font-normal leading-none text-[var(--app-ink)] lg:text-[2.2rem]">
                    {v.title}
                  </h3>
                  <p className="mt-4 font-ui text-[0.84rem] leading-[1.95] text-[var(--app-ink)]/68">
                    {v.body}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 6. CTA — dark ────────────────────────────────────── */}
      <ScrollFadeIn>
        <section className="relative overflow-hidden min-w-0 bg-[var(--app-dark)] py-20 lg:py-28">
          <SectionGlow />
          <Container size="lg">
            <div className="flex flex-col items-center gap-7 text-center">
              <p className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Join the ministry
              </p>
              <h2 className="font-headline text-[1.9rem] font-normal leading-snug text-white sm:text-[2.5rem]">
                Step into a sisterhood
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  that walks with you.
                </em>
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/40" />
              <p className="max-w-md font-ui text-[0.85rem] leading-[2] text-white/70">
                Reach out and we will help you find the right starting point —
                whether that is fellowship, prayer, Bible study, or service.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition hover:brightness-105"
                >
                  Join the sisterhood <Arrow />
                </Link>
                <Link
                  href="/events/weekly"
                  className="inline-flex items-center justify-center gap-2 border border-white/18 px-8 py-3.5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white/50 transition hover:border-white/35 hover:text-white"
                >
                  See service times
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
