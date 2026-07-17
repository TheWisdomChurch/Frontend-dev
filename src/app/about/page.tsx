import type { Metadata } from 'next';
import Image from 'next/image';
import { IMAGE_QUALITY } from '@/shared/constants';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { lader_1 } from '@/shared/assets';
import { H2, BodyMD } from '@/shared/text';
import { Container, Section } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo';
import SectionGlow from '@/shared/ui/SectionGlow';
import { apiClient } from '@/lib/api';
import type { LeadershipMember, LeadershipRole } from '@/lib/types';
import { CanvasCard, DarkCard } from '@/features/leadership/LeadershipCards';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';

// Same senior-role definition /leadership uses — kept in sync so About's
// leadership spotlight and the full directory always agree on titles.
const SENIOR_ROLES: LeadershipRole[] = [
  'senior_pastor',
  'associate_pastor',
  'reverend',
];
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about The Wisdom Church — a Spirit-filled church in Lagos committed to raising complete believers.',
  openGraph: {
    title: 'About Us | The Wisdom Church',
    description:
      'Learn about The Wisdom Church vision, leadership, and culture.',
    url: 'https://wisdomchurchhq.org/about',
    images: [{ url: 'https://wisdomchurchhq.org/og-image.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | The Wisdom Church',
    description:
      'Learn about The Wisdom Church vision, leadership, and culture.',
    images: ['https://wisdomchurchhq.org/og-image.webp'],
  },
  alternates: { canonical: '/about' },
};

const serviceInfo = [
  {
    label: SERVICE_INFO.sunday.label,
    value: `Every ${SERVICE_INFO.sunday.day}`,
    detail: `${SERVICE_INFO.sunday.time} ${SERVICE_INFO.sunday.timezone}`,
  },
  {
    label: SERVICE_INFO.dailyPrayer.label,
    value: SERVICE_INFO.dailyPrayer.days,
    detail: `${SERVICE_INFO.dailyPrayer.time} ${SERVICE_INFO.dailyPrayer.timezone}`,
  },
  {
    label: 'Location',
    value: SERVICE_INFO.venue.name,
    detail: `${SERVICE_INFO.venue.area}, ${SERVICE_INFO.venue.locality}`,
  },
] as const;

const pillars = [
  {
    title: 'Presence-driven worship',
    body: 'We gather to host the presence of God with reverence, expectation, and joy.',
  },
  {
    title: 'Word-shaped discipleship',
    body: 'Teaching is practical and biblical, aimed at forming complete believers.',
  },
  {
    title: 'People-first community',
    body: 'Hospitality, accountability, and care are central to how we build family.',
  },
  {
    title: 'Excellence with integrity',
    body: 'We steward people and service moments with clarity, order, and consistency.',
  },
] as const;

export default async function AboutPage() {
  const allLeaders = await apiClient
    .listLeadership()
    .catch(() => [] as LeadershipMember[]);
  const leaders = allLeaders
    .filter(l => SENIOR_ROLES.includes(l.role))
    .slice(0, 2);

  return (
    <main className="min-h-screen">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      {/* ── 1. Page hero ─────────────────────────────────────── */}
      <PageHero
        eyebrow="About Wisdom Church"
        title="Raising complete believers."
        subtitle="A Spirit-filled community built on Word, worship, and intentional discipleship."
        compact
      />

      {/* ── 2. Service info strip — canvas ───────────────────── */}
      <section className="overflow-hidden min-w-0 border-b border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <div className="grid grid-cols-1 divide-y divide-[var(--app-ink)]/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {serviceInfo.map(item => (
              <div
                key={item.label}
                className="flex flex-col gap-1 px-6 py-7 sm:px-8 sm:py-8"
              >
                <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  {item.label}
                </p>
                <p className="mt-0.5 font-headline text-[1.3rem] font-normal leading-snug text-[var(--app-ink)]">
                  {item.value}
                </p>
                <p className="mt-0.5 font-ui text-[0.76rem] text-[var(--app-ink)]/48">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. Editorial identity split — dark ───────────────── */}
      <Section
        padding="none"
        className="relative overflow-hidden bg-[var(--app-dark)]"
      >
        <SectionGlow />
        <div className="grid lg:grid-cols-[1fr_1fr] lg:min-h-[580px]">
          {/* Text column */}
          <ScrollFadeIn className="flex flex-col justify-center gap-7 px-6 py-16 sm:px-10 lg:px-14 xl:px-18 order-2 lg:order-1">
            <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Who we are
            </p>
            <h2 className="font-headline text-[2rem] font-normal leading-[1.18] text-white sm:text-[2.5rem] lg:text-[3rem]">
              Building a church
              <br className="hidden sm:block" />
              where people
              <br className="hidden sm:block" />
              <em className="italic text-[var(--app-primary)]/90">
                grow in Christ.
              </em>
            </h2>
            <div className="h-px w-10 bg-[var(--app-primary)]/45" />
            <BodyMD className="max-w-sm leading-[1.85] text-white/60">
              The Wisdom Church is a trans-generational community in Lagos —
              committed to forming complete believers through sound teaching,
              worshipful community, and faithful pastoral care.
            </BodyMD>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href="/contact"
                className="inline-flex w-fit items-center gap-2 rounded-button bg-[var(--app-primary)] px-6 py-2.5 font-ui text-[0.77rem] font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:brightness-105"
              >
                Plan your visit
              </Link>
              <Link
                href="/ministries"
                className="inline-flex items-center gap-2 border border-white/18 px-5 py-2.5 font-ui text-[0.72rem] font-semibold text-white/65 transition duration-150 hover:border-[var(--app-primary)]/60 hover:text-[var(--app-primary)]"
              >
                Explore ministries →
              </Link>
            </div>
          </ScrollFadeIn>

          {/* Photo column */}
          <div className="relative h-72 order-1 lg:order-2 lg:h-auto">
            <Image
              quality={IMAGE_QUALITY}
              src={lader_1}
              alt="Wisdom Church congregation"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Gradient blends photo into the dark text column on desktop */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--app-dark)]/50 via-transparent to-[var(--app-dark)]/60 lg:bg-gradient-to-r lg:from-[var(--app-dark)] lg:via-[var(--app-dark)]/20 lg:to-transparent" />
          </div>
        </div>
      </Section>

      {/* ── 4. Culture pillars — editorial rows ──────────────── */}
      <section className="overflow-hidden min-w-0 border-y border-[var(--app-ink)]/8">
        {/* Section header */}
        <div className="bg-[var(--app-canvas)] px-6 py-10 lg:px-10">
          <Container size="xl">
            <ScrollFadeIn className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  Our culture
                </p>
                <H2 className="mt-2 max-w-sm font-headline text-[1.5rem] font-normal leading-snug text-[var(--app-ink)] sm:text-[1.75rem]">
                  What shapes everything we do.
                </H2>
              </div>
              <Link
                href="/ministries"
                className="hidden items-center gap-2 border border-[var(--app-ink)]/18 px-5 py-2.5 font-ui text-[0.72rem] font-semibold text-[var(--app-ink)]/55 transition duration-150 hover:border-[var(--app-primary)]/50 hover:text-[var(--app-primary)] sm:inline-flex"
              >
                Explore ministries →
              </Link>
            </ScrollFadeIn>
          </Container>
        </div>

        {/* Pillar rows — title left, body right, alternating warm bg */}
        <div className="divide-y divide-[var(--app-ink)]/8">
          {pillars.map((pillar, i) => (
            <ScrollFadeIn key={pillar.title} delay={i * 0.05}>
              <div
                className={
                  i % 2 === 0
                    ? 'bg-[var(--app-canvas)]'
                    : 'bg-[var(--app-canvas-2)]'
                }
              >
                <Container size="xl">
                  <div className="grid items-center gap-6 py-9 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:py-11">
                    {/* Title */}
                    <div className="flex items-start gap-5">
                      <div className="mt-[0.6rem] h-[1.5px] w-6 shrink-0 bg-[var(--app-primary)]/55" />
                      <p className="font-headline text-[1.3rem] font-normal leading-snug text-[var(--app-ink)] lg:text-[1.55rem]">
                        {pillar.title}
                      </p>
                    </div>

                    {/* Body */}
                    <p className="pl-11 font-ui text-[0.86rem] leading-[1.9] text-[var(--app-ink)]/70 lg:max-w-lg lg:pl-0">
                      {pillar.body}
                    </p>
                  </div>
                </Container>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* ── 5. Leadership ───────────────────────────────────── */}
      <section className="overflow-hidden min-w-0">
        {/* Leadership intro header — dark */}
        <ScrollFadeIn>
          <div className="relative bg-[var(--app-dark)] px-6 py-14 lg:py-18">
            <SectionGlow />
            <Container size="xl">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-lg">
                  <p className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                    Leadership
                  </p>
                  <h2 className="mt-3 font-headline text-[1.9rem] font-normal leading-[1.18] text-white sm:text-[2.4rem] lg:text-[2.8rem]">
                    The people who shepherd
                    <br className="hidden sm:block" />
                    <em className="italic text-[var(--app-primary)]/80">
                      {' '}
                      this church.
                    </em>
                  </h2>
                  <div className="mt-5 h-px w-10 bg-[var(--app-primary)]/40" />
                  <p className="mt-4 font-ui text-[0.88rem] leading-[1.85] text-white/50 max-w-sm">
                    Wisdom Church is led by pastors who believe that sound
                    teaching, faithful prayer, and genuine care build lasting
                    community.
                  </p>
                </div>
                <Link
                  href="/leadership"
                  className="hidden items-center gap-2 border border-white/18 px-5 py-2.5 font-ui text-[0.72rem] font-semibold text-white/65 transition duration-150 hover:border-[var(--app-primary)]/60 hover:text-[var(--app-primary)] lg:inline-flex"
                >
                  Meet the full team →
                </Link>
              </div>
            </Container>
          </div>
        </ScrollFadeIn>

        {/* 2-panel grid — canvas left, dark right. Same CanvasCard/DarkCard
            components /leadership uses, so this spotlight can never drift
            from the full directory. */}
        {leaders.length > 0 && (
          <div className="grid lg:grid-cols-2">
            <ScrollFadeIn>
              <CanvasCard leader={leaders[0]} />
            </ScrollFadeIn>
            {leaders[1] && (
              <ScrollFadeIn delay={0.08}>
                <DarkCard leader={leaders[1]} />
              </ScrollFadeIn>
            )}
          </div>
        )}

        {/* Mobile link — hidden on lg where header shows it */}
        <div className="border-t border-[var(--app-ink)]/8 bg-[var(--app-canvas)] px-6 py-5 lg:hidden">
          <Container size="xl">
            <Link
              href="/leadership"
              className="inline-flex items-center gap-2 border border-[var(--app-ink)]/18 px-5 py-2.5 font-ui text-[0.72rem] font-semibold text-[var(--app-ink)]/60 transition duration-150 hover:border-[var(--app-primary)]/50 hover:text-[var(--app-primary)]"
            >
              Meet the full team →
            </Link>
          </Container>
        </div>
      </section>

      {/* ── 6. CTA ──────────────────────────────────────────── */}
      <ScrollFadeIn>
        <section className="relative overflow-hidden min-w-0 border-t border-[var(--app-ink)]/8 bg-[var(--app-canvas)] py-20 lg:py-28">
          {/* Faint gold radial — warm glow, not visible, just warmth */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_100%,rgba(201,150,26,0.06),transparent)]" />

          <Container size="lg" className="relative">
            <div className="flex flex-col items-center gap-8 text-center">
              <p className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Visit Wisdom Church
              </p>

              <h2 className="font-headline text-[2.1rem] font-normal leading-[1.2] text-[var(--app-ink)] sm:text-[2.7rem] lg:text-[3.1rem]">
                Come and find your place
                <br className="hidden sm:block" /> in{' '}
                <em className="italic text-[var(--app-primary)]/75">
                  this community.
                </em>
              </h2>

              <div className="h-px w-12 bg-[var(--app-primary)]/40" />

              <p className="max-w-md font-ui text-[0.9rem] leading-[1.85] text-[var(--app-ink)]/52">
                Whether you are exploring faith for the first time or looking
                for a church home in Lagos — you are welcome here, exactly as
                you are.
              </p>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-ink)] px-8 py-3.5 font-ui text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white transition duration-150 hover:bg-[var(--app-primary)] hover:text-[var(--app-ink)]"
                >
                  Plan your visit
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 6h10M6 1l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link
                  href="/ministries"
                  className="inline-flex items-center justify-center gap-2 border border-[var(--app-ink)]/18 px-8 py-3.5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-ink)]/60 transition duration-150 hover:border-[var(--app-ink)]/35 hover:text-[var(--app-ink)]"
                >
                  Explore ministries
                </Link>
              </div>

              {/* Service times */}
              <p className="font-ui text-[0.72rem] tracking-[0.04em] text-[var(--app-ink)]/35">
                {SERVICE_INFO.sunday.day}s {SERVICE_INFO.sunday.time}{' '}
                &nbsp;·&nbsp; {SERVICE_INFO.dailyPrayer.label}{' '}
                {SERVICE_INFO.dailyPrayer.time} &nbsp;·&nbsp;{' '}
                {SERVICE_INFO.venue.short}
              </p>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
