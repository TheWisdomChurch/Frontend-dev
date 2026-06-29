import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';

export const metadata: Metadata = {
  title: 'Ministries — Get Connected',
  description:
    'Discover ministries for men, women, youth, children, and outreach at The Wisdom Church. Find your place to serve and grow.',
  openGraph: {
    title: 'Ministries — Get Connected | The Wisdom Church',
    description:
      'Discover ministries for men, women, youth, children, and outreach.',
    url: 'https://wisdomchurchhq.org/ministries',
    images: [{ url: 'https://wisdomchurchhq.org/og-image.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ministries | The Wisdom Church',
    description:
      'Discover ministries for men, women, youth, children, and outreach.',
    images: ['https://wisdomchurchhq.org/og-image.webp'],
  },
  alternates: { canonical: '/ministries' },
};

/* ── Ministry panels — checkerboard dark / canvas ─────── */
const ministries = [
  {
    title: 'Youth Ministry',
    description:
      'A vibrant discipleship space for teenagers and young adults to grow in faith, leadership, and community.',
    badge: 'Ages 13 – 25',
    href: '/ministries/youth',
    dark: true,
  },
  {
    title: "Women's Ministry",
    description:
      'A strengthening community for women to grow in scripture, prayer, fellowship, and purposeful service.',
    badge: 'Community',
    href: '/ministries/women',
    dark: false,
  },
  {
    title: "Men's Ministry",
    description:
      'A clear discipleship path for men who want to grow in integrity, leadership, and service at home and in church.',
    badge: 'Brotherhood',
    href: '/ministries/men',
    dark: false,
  },
  {
    title: "Children's Ministry",
    description:
      'A safe and joyful environment where children encounter Jesus through age-appropriate teaching and care.',
    badge: 'Nursery – Pre-teens',
    href: '/ministries/children',
    dark: true,
  },
  {
    title: 'Outreach & Missions',
    description:
      "Practical expressions of God's love through service, evangelism, relief, and community development.",
    badge: 'Impact',
    href: '/ministries/outreach',
    dark: true,
  },
  {
    title: 'Pastoral Care',
    description:
      'Support structures for prayer, counseling, life transitions, family care, and spiritual guidance.',
    badge: 'Care',
    href: '/pastoral',
    dark: false,
  },
] as const;

/* ── Connection pillars ───────────────────────────────── */
const connection = [
  {
    verb: 'Visit',
    body: 'Show up to any gathering. No prior knowledge, no commitment required — just come.',
    href: '/contact',
    cta: 'Plan a visit',
  },
  {
    verb: 'Connect',
    body: 'Talk to our welcome team. Tell us where you are and we will help you find your fit.',
    href: '/contact',
    cta: 'Reach out',
  },
  {
    verb: 'Grow',
    body: 'Stay in, serve consistently, and build the relationships that last a lifetime.',
    href: '/ministries',
    cta: 'Explore ministry',
  },
] as const;

/* ── Arrow icon ────────────────────────────────────────── */
function Arrow({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 12 12"
      fill="none"
      className={className}
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

export default function MinistriesPage() {
  return (
    <main className="min-h-screen">
      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <PageHero
        eyebrow="Ministries"
        title="Every generation has a place here."
        subtitle="Ministries built to make discipleship practical, relational, and responsive to real life."
        compact
      />

      {/* ── 2. Intro — canvas ────────────────────────────────── */}
      <section className="border-b border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <ScrollFadeIn className="flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between sm:py-16">
            <div className="max-w-xl">
              <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Ministry at Wisdom Church
              </p>
              <h2 className="mt-3 font-headline text-[1.6rem] font-normal leading-snug text-[var(--app-ink)] sm:text-[1.9rem]">
                We exist to help every person find
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  where they belong{' '}
                </em>
                and
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  how they serve.
                </em>
              </h2>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-ui text-[0.7rem] font-semibold text-[var(--app-ink)]/45">
                Active ministries
              </p>
              <p className="mt-0.5 font-headline text-[2.6rem] font-normal leading-none text-[var(--app-ink)]">
                6
              </p>
            </div>
          </ScrollFadeIn>
        </Container>
      </section>

      {/* ── 3. Ministry panels — 2-col visual grid ───────────── */}
      <section>
        {/* Section label */}
        <div className="border-b border-[var(--app-ink)]/8 bg-[var(--app-canvas)] px-6 py-6 lg:px-10">
          <Container size="xl">
            <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Ministry areas
            </p>
          </Container>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 border-b border-[var(--app-ink)]/10 sm:grid-cols-2">
          {ministries.map((ministry, i) => {
            const isDark = ministry.dark;
            return (
              <ScrollFadeIn key={ministry.title} delay={i * 0.05}>
                <Link
                  href={ministry.href}
                  className={[
                    'group relative flex min-h-[420px] flex-col overflow-hidden p-8 lg:min-h-[460px] lg:p-11',
                    'border-b border-r border-[var(--app-ink)]/10',
                    isDark
                      ? 'bg-[var(--app-dark)]'
                      : 'bg-[var(--app-canvas-2)]',
                    'transition-colors duration-300',
                    isDark
                      ? 'hover:bg-[#100e13]'
                      : 'hover:bg-[var(--app-canvas)]',
                  ].join(' ')}
                >
                  {/* Ghost watermark — large first letter */}
                  <span
                    aria-hidden="true"
                    className={[
                      'pointer-events-none absolute -right-3 top-3 select-none font-headline text-[10rem] font-normal leading-none lg:text-[12rem]',
                      isDark
                        ? 'text-white/[0.04]'
                        : 'text-[var(--app-ink)]/[0.05]',
                    ].join(' ')}
                  >
                    {ministry.title[0]}
                  </span>

                  {/* Badge — top */}
                  <span
                    className={[
                      'relative z-10 self-start px-3.5 py-1.5 font-ui text-[0.6rem] uppercase tracking-[0.15em] transition duration-200',
                      isDark
                        ? 'border border-white/18 text-white/50 group-hover:border-[var(--app-primary)]/50 group-hover:text-[var(--app-primary)]'
                        : 'border border-[var(--app-ink)]/14 text-[var(--app-ink)]/42 group-hover:border-[var(--app-primary)]/45 group-hover:text-[var(--app-primary)]',
                    ].join(' ')}
                  >
                    {ministry.badge}
                  </span>

                  {/* Spacer */}
                  <div className="relative z-10 flex-1" />

                  {/* Content — anchored to bottom */}
                  <div className="relative z-10 mt-10">
                    {/* Gold rule */}
                    <div className="mb-5 h-[1.5px] w-8 bg-[var(--app-primary)]/50 transition-all duration-300 group-hover:w-14 group-hover:bg-[var(--app-primary)]/80" />

                    {/* Title */}
                    <h3
                      className={[
                        'font-headline text-[1.7rem] font-normal leading-snug transition duration-300 lg:text-[2rem]',
                        isDark
                          ? 'text-white group-hover:text-[var(--app-primary)]/90'
                          : 'text-[var(--app-ink)] group-hover:text-[var(--app-primary)]',
                      ].join(' ')}
                    >
                      {ministry.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={[
                        'mt-3.5 max-w-[22rem] font-ui text-[0.83rem] leading-[1.9]',
                        isDark ? 'text-white/48' : 'text-[var(--app-ink)]/50',
                      ].join(' ')}
                    >
                      {ministry.description}
                    </p>

                    {/* Explore button */}
                    <div className="mt-8">
                      <span
                        className={[
                          'inline-flex items-center gap-2.5 px-5 py-2.5 font-ui text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition duration-200',
                          isDark
                            ? 'border border-white/20 text-white/60 group-hover:border-[var(--app-primary)] group-hover:text-[var(--app-primary)]'
                            : 'border border-[var(--app-ink)]/18 text-[var(--app-ink)]/55 group-hover:border-[var(--app-primary)] group-hover:text-[var(--app-primary)]',
                        ].join(' ')}
                      >
                        Explore ministry
                        <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>

                  {/* Corner glow — dark panels */}
                  {isDark && (
                    <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-[var(--app-primary)]/[0.07] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
                  )}
                </Link>
              </ScrollFadeIn>
            );
          })}
        </div>
      </section>

      {/* ── 4. How to connect — dark, 3-col visual ───────────── */}
      <section className="border-y border-white/8 bg-[var(--app-dark)]">
        {/* Section headline */}
        <Container size="xl">
          <ScrollFadeIn>
            <div className="border-b border-white/8 py-12 lg:py-16">
              <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Getting connected
              </p>
              <h2 className="mt-3 max-w-lg font-headline text-[1.8rem] font-normal leading-snug text-white sm:text-[2.3rem]">
                Finding your place is
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  simpler than you think.
                </em>
              </h2>
            </div>
          </ScrollFadeIn>
        </Container>

        {/* 3 visual columns */}
        <div className="grid grid-cols-1 divide-y divide-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {connection.map((col, i) => (
            <ScrollFadeIn key={col.verb} delay={i * 0.09}>
              <div className="flex flex-col px-8 py-12 lg:px-10 lg:py-16">
                {/* Gold accent */}
                <div className="mb-7 h-[1.5px] w-8 bg-[var(--app-primary)]/55" />

                {/* Large Playfair verb */}
                <p className="font-headline text-[3rem] font-normal leading-none text-white lg:text-[3.5rem]">
                  {col.verb}
                </p>

                {/* Body */}
                <p className="mt-5 font-ui text-[0.84rem] leading-[1.9] text-white/48">
                  {col.body}
                </p>

                {/* Button */}
                <Link
                  href={col.href}
                  className="mt-8 inline-flex items-center gap-2.5 self-start border border-white/20 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-white/55 transition duration-150 hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                >
                  {col.cta}
                  <Arrow />
                </Link>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* ── 6. CTA — dark ────────────────────────────────────── */}
      <ScrollFadeIn>
        <section className="relative overflow-hidden bg-[var(--app-dark)] py-20 lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_0%,rgba(201,150,26,0.08),transparent)]" />
          <Container size="lg" className="relative">
            <div className="flex flex-col items-center gap-8 text-center">
              <p className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Take a next step
              </p>

              <h2 className="font-headline text-[2rem] font-normal leading-[1.2] text-white sm:text-[2.6rem] lg:text-[3rem]">
                Ready to find your
                <br className="hidden sm:block" />{' '}
                <em className="italic text-[var(--app-primary)]/80">
                  place to belong?
                </em>
              </h2>

              <div className="h-px w-12 bg-[var(--app-primary)]/40" />

              <p className="max-w-md font-ui text-[0.88rem] leading-[1.9] text-white/50">
                Tell us where you are in your faith journey and we will help you
                find the right ministry community or service opportunity.
              </p>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition duration-150 hover:brightness-105"
                >
                  Get connected
                  <Arrow />
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 border border-white/18 px-8 py-3.5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white/55 transition duration-150 hover:border-white/35 hover:text-white"
                >
                  See church rhythm
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
