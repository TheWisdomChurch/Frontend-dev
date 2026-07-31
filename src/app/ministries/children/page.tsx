import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import SectionGlow from '@/shared/ui/SectionGlow';
import ChildrenGallery from './ChildrenGallery';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: "Children's Ministry",
  description:
    'A safe, joyful, and Bible-centered ministry for children from nursery through pre-teen years at The Wisdom Church.',
  path: '/ministries/children',
});

/* ── What we do ───────────────────────────────────────── */
const activities = [
  {
    title: 'Bible Teaching',
    description:
      'Scripture brought to life at the right level — engaging, memorable, and built for young minds.',
  },
  {
    title: 'Worship & Response',
    description:
      'Music and worship moments that help children experience the presence of God with joy and openness.',
  },
  {
    title: 'Supervised Care',
    description:
      'Every child is known by name and watched by trained leaders who take safety and warmth seriously.',
  },
  {
    title: 'Family Connection',
    description:
      'Parents stay informed and connected to what their children are learning every time they come in.',
  },
] as const;

/* ── Parent promises ──────────────────────────────────── */
const promises = [
  {
    title: 'Safe',
    body: 'Every child is supervised, known by name, and cared for in an environment parents can fully trust.',
  },
  {
    title: 'Joyful',
    body: 'We build experiences children actually look forward to — worship, stories, and moments they carry home.',
  },
  {
    title: 'Grounded',
    body: 'Biblical truth taught at the right level — not watered down, just made real and accessible for young hearts.',
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

export default function ChildrenMinistryPage() {
  return (
    <main className="min-h-screen">
      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <PageHero
        eyebrow="Children's Ministry"
        title="Where little ones meet Jesus."
        subtitle="Safe, joyful, and built around families — from nursery through pre-teen years."
        backgroundImage="/images/easter-service.webp"
      />

      {/* ── 2. Mission statement — dark ──────────────────────── */}
      <section className="relative overflow-hidden min-w-0 border-b border-white/8 bg-[var(--app-dark)]">
        <SectionGlow />
        <Container size="xl">
          <ScrollFadeIn className="py-16 lg:py-20">
            <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Our mission
            </p>
            <h2 className="mt-4 max-w-2xl font-headline text-heading-md font-normal leading-snug text-white sm:text-heading-lg">
              Children should experience church as a place of
              <em className="italic text-[var(--app-primary)]/80">
                {' '}
                safety, joy, and truth.
              </em>
            </h2>
            <div className="mt-8 h-[1.5px] w-10 bg-[var(--app-primary)]/50" />
            <p className="mt-6 max-w-xl font-ui text-body-sm leading-[2] text-white/70">
              The children&apos;s ministry exists to help young people know God
              early, feel genuinely cared for at church, and build spiritual
              foundations that support growth well into their teenage years and
              beyond.
            </p>
          </ScrollFadeIn>
        </Container>
      </section>

      {/* ── 3. What we do — canvas ───────────────────────────── */}
      <section className="overflow-hidden min-w-0 border-b border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <ScrollFadeIn className="pt-16 lg:pt-20">
            <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              What we do
            </p>
            <h2 className="mt-3 max-w-xl font-headline text-heading-md font-normal leading-snug text-[var(--app-ink)] sm:text-heading-lg">
              Programs built for
              <em className="italic text-[var(--app-primary)]/80">
                {' '}
                consistent growth.
              </em>
            </h2>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 gap-x-12 gap-y-0 pb-16 pt-12 sm:grid-cols-2 lg:pb-20 lg:pt-14">
            {activities.map((item, i) => (
              <ScrollFadeIn key={item.title} delay={i * 0.07}>
                <div className="border-t border-[var(--app-ink)]/10 py-8">
                  <div className="mb-4 h-[1.5px] w-6 bg-[var(--app-primary)]/50" />
                  <h3 className="font-headline text-heading-sm font-normal text-[var(--app-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-ui text-body-sm leading-[1.95] text-[var(--app-ink)]/68">
                    {item.description}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. Gallery — dark ────────────────────────────────── */}
      <section className="relative overflow-hidden min-w-0 border-b border-white/8 bg-[var(--app-dark)]">
        <SectionGlow />
        <Container size="xl">
          <ScrollFadeIn className="pt-14 lg:pt-18">
            <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Life in our ministry
            </p>
            <h2 className="mt-3 max-w-lg font-headline text-heading-md font-normal leading-snug text-white sm:text-heading-md">
              A glimpse of what Sunday looks like
              <em className="italic text-[var(--app-primary)]/80">
                {' '}
                for your child.
              </em>
            </h2>
          </ScrollFadeIn>
          <div className="pb-14 pt-8 lg:pb-18 lg:pt-10">
            <ChildrenGallery />
          </div>
        </Container>
      </section>

      {/* ── 5. For parents — canvas ──────────────────────────── */}
      <section className="overflow-hidden min-w-0 border-b border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <ScrollFadeIn>
            <div className="border-b border-[var(--app-ink)]/8 py-12 lg:py-14">
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                A word to parents
              </p>
              <h2 className="mt-3 max-w-xl font-headline text-heading-md font-normal leading-snug text-[var(--app-ink)] sm:text-heading-lg">
                Your child will be in
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  great hands.
                </em>
              </h2>
            </div>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 divide-y divide-[var(--app-ink)]/8 pb-0 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {promises.map((p, i) => (
              <ScrollFadeIn key={p.title} delay={i * 0.08}>
                <div className="flex flex-col py-10 sm:px-8 lg:px-10 lg:py-12">
                  <div className="mb-5 h-[1.5px] w-6 bg-[var(--app-primary)]/55" />
                  <h3 className="font-headline text-heading-md font-normal leading-none text-[var(--app-ink)] lg:text-heading-lg">
                    {p.title}
                  </h3>
                  <p className="mt-4 font-ui text-body-sm leading-[1.95] text-[var(--app-ink)]/68">
                    {p.body}
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
              <h2 className="font-headline text-heading-md font-normal leading-snug text-white sm:text-heading-lg">
                Connect your child to a
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  community that cares.
                </em>
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/40" />
              <p className="max-w-md font-ui text-body-sm leading-[2] text-white/70">
                Reach out and we will help your family understand what to
                expect, meet the team, and settle comfortably into the ministry.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-label font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition hover:brightness-105"
                >
                  Connect my family <Arrow />
                </Link>
                <Link
                  href="/events/weekly"
                  className="inline-flex items-center justify-center gap-2 border border-white/18 px-8 py-3.5 font-ui text-label font-semibold uppercase tracking-[0.14em] text-white/50 transition hover:border-white/35 hover:text-white"
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
