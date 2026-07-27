import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import SectionGlow from '@/shared/ui/SectionGlow';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: "Men's Ministry — Wisdom Church",
  description:
    "A men's ministry built on integrity, biblical brotherhood, and leadership that serves. Part of The Wisdom Church, Lagos.",
  path: '/ministries/men',
});

/* ── What we do ───────────────────────────────────────── */
const activities = [
  {
    title: 'Brotherhood Gatherings',
    description:
      'Meetings that build real trust — spiritually honest conversations, shared prayer, and men committed to one another.',
  },
  {
    title: 'Biblical Formation',
    description:
      'Teaching and discussion shaped to build conviction, scriptural clarity, and the kind of wisdom that holds under pressure.',
  },
  {
    title: 'Leadership Development',
    description:
      'Intentional growth toward dependability — at home, in church, and in every area where men are called to lead.',
  },
  {
    title: 'Accountability Culture',
    description:
      'A community where honesty is normal, correction is welcomed, and long-term spiritual consistency is the standard.',
  },
] as const;

/* ── Core values ──────────────────────────────────────── */
const values = [
  {
    title: 'Integrity',
    body: 'Character built in private that holds consistently in public — at home, at work, and in the church.',
  },
  {
    title: 'Brotherhood',
    body: 'Men who challenge, trust, and walk honestly with each other. Not surface level — real accountability.',
  },
  {
    title: 'Leadership',
    body: 'The natural outworking of mature faith — serving faithfully and leading well wherever God has placed you.',
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

export default function MenMinistryPage() {
  return (
    <main className="min-h-screen">
      {/* ── 1. Hero — full cinematic with conference image ────── */}
      <PageHero
        eyebrow="Men's Ministry"
        title="Men of integrity. Men of purpose."
        subtitle="A community where men grow in faith, accountability, and the kind of strength that leads — at home, in church, and beyond."
      />

      {/* ── 2. Men's Conference — dark ───────────────────────── */}
      <section className="relative overflow-hidden min-w-0 border-b border-white/8 bg-[var(--app-dark)]">
        <SectionGlow />
        <Container size="xl">
          <ScrollFadeIn className="pt-14 lg:pt-18">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  Men&apos;s Conference · Wisdom Church
                </p>
                <h2 className="mt-3 font-headline text-[2rem] font-normal leading-snug text-white sm:text-[2.6rem] lg:text-[3rem]">
                  Iron sharpens
                  <em className="italic text-[var(--app-primary)]/80">
                    {' '}
                    iron.
                  </em>
                </h2>
                <p className="mt-4 max-w-lg font-ui text-body-sm leading-[2] text-white/70">
                  A gathering of men coming together in the Word, worship, and
                  honest brotherhood. Watch the full conference session below.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 self-start border border-white/18 px-6 py-3 font-ui text-label font-semibold text-white/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] lg:self-auto"
              >
                Stay updated on next event <Arrow />
              </Link>
            </div>
          </ScrollFadeIn>

          {/* YouTube embed */}
          <ScrollFadeIn delay={0.1}>
            <div className="pb-14 pt-8 lg:pb-18 lg:pt-10">
              <div className="relative aspect-video w-full overflow-hidden border border-white/8">
                <iframe
                  src="https://www.youtube.com/embed/eSAvP3h0ASY"
                  title="Wisdom Church Men's Conference"
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
            <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Our mission
            </p>
            <h2 className="mt-4 max-w-2xl font-headline text-heading-md font-normal leading-snug text-[var(--app-ink)] sm:text-[2.3rem]">
              Men need a context where
              <em className="italic text-[var(--app-primary)]/80">
                {' '}
                truth, challenge, and brotherhood{' '}
              </em>
              work together.
            </h2>
            <div className="mt-8 h-[1.5px] w-10 bg-[var(--app-primary)]/50" />
            <p className="mt-6 max-w-xl font-ui text-body-sm leading-[2] text-[var(--app-ink)]/70">
              This ministry exists to help men develop biblical strength,
              spiritual discipline, and the kind of maturity that produces
              faithful leadership in every area of life. We want men who are
              clear in conviction, stable in character, and genuinely
              accountable in community.
            </p>
          </ScrollFadeIn>
        </Container>
      </section>

      {/* ── 4. What we do — dark ─────────────────────────────── */}
      <section className="relative overflow-hidden min-w-0 border-b border-white/8 bg-[var(--app-dark)]">
        <SectionGlow />
        <Container size="xl">
          <ScrollFadeIn className="pt-16 lg:pt-20">
            <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              What we do
            </p>
            <h2 className="mt-3 max-w-xl font-headline text-heading-md font-normal leading-snug text-white sm:text-[2rem]">
              Built for men who want to
              <em className="italic text-[var(--app-primary)]/80">
                {' '}
                grow and lead well.
              </em>
            </h2>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 gap-x-12 gap-y-0 pb-16 pt-12 sm:grid-cols-2 lg:pb-20 lg:pt-14">
            {activities.map((item, i) => (
              <ScrollFadeIn key={item.title} delay={i * 0.07}>
                <div className="border-t border-white/8 py-8">
                  <div className="mb-4 h-[1.5px] w-6 bg-[var(--app-primary)]/50" />
                  <h3 className="font-headline text-heading-sm font-normal text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-ui text-body-sm leading-[1.95] text-white/70">
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
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                What shapes us
              </p>
              <h2 className="mt-3 max-w-lg font-headline text-heading-md font-normal leading-snug text-[var(--app-ink)] sm:text-[2rem]">
                The values that define
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  every man in this ministry.
                </em>
              </h2>
            </div>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 divide-y divide-[var(--app-ink)]/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {values.map((v, i) => (
              <ScrollFadeIn key={v.title} delay={i * 0.08}>
                <div className="flex flex-col py-10 sm:px-8 lg:px-10 lg:py-12">
                  <div className="mb-5 h-[1.5px] w-6 bg-[var(--app-primary)]/55" />
                  <h3 className="font-headline text-heading-md font-normal leading-none text-[var(--app-ink)] lg:text-[2.2rem]">
                    {v.title}
                  </h3>
                  <p className="mt-4 font-ui text-body-sm leading-[1.95] text-[var(--app-ink)]/68">
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
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Join the ministry
              </p>
              <h2 className="font-headline text-heading-md font-normal leading-snug text-white sm:text-[2.5rem]">
                Step into a brotherhood
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  built to last.
                </em>
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/40" />
              <p className="max-w-md font-ui text-body-sm leading-[2] text-white/70">
                Reach out and we will connect you to the right entry point —
                brotherhood, formation, or service.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-label font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition hover:brightness-105"
                >
                  Join the brotherhood <Arrow />
                </Link>
                <Link
                  href="/events/weekly"
                  className="inline-flex items-center justify-center gap-2 border border-white/18 px-8 py-3.5 font-ui text-label font-semibold uppercase tracking-[0.14em] text-white/50 transition hover:border-white/35 hover:text-white"
                >
                  See weekly services
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
