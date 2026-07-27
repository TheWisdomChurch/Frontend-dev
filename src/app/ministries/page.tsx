import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import SectionGlow from '@/shared/ui/SectionGlow';
import { IMAGE_QUALITY } from '@/shared/constants';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo';

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

/* ── Ministries ───────────────────────────────────────── */
const ministries = [
  {
    title: 'Youth Ministry',
    tagline: 'A generation on fire.',
    description:
      'A vibrant discipleship space for teenagers and young adults to grow in faith, leadership, and community.',
    badge: 'Ages 13 – 25',
    href: '/ministries/youth',
    image: '/images/conference-2025.webp',
    overlay:
      'linear-gradient(to top, rgba(28,10,2,0.97) 0%, rgba(7,6,10,0.65) 50%, rgba(7,6,10,0.38) 100%)',
  },
  {
    title: "Women's Ministry",
    tagline: 'Women who lead with purpose.',
    description:
      'A strengthening community for women to grow in scripture, prayer, fellowship, and purposeful service.',
    badge: 'Community',
    href: '/ministries/women',
    image: '/images/christmas-eve.webp',
    overlay:
      'linear-gradient(to top, rgba(28,6,14,0.97) 0%, rgba(7,6,10,0.65) 50%, rgba(7,6,10,0.38) 100%)',
  },
  {
    title: "Men's Ministry",
    tagline: 'Men of integrity and strength.',
    description:
      'A clear discipleship path for men who want to grow in integrity, leadership, and service at home and in church.',
    badge: 'Brotherhood',
    href: '/ministries/men',
    image: '/images/supernatural-service.webp',
    overlay:
      'linear-gradient(to top, rgba(4,10,28,0.97) 0%, rgba(7,6,10,0.65) 50%, rgba(7,6,10,0.38) 100%)',
  },
  {
    title: "Children's Ministry",
    tagline: 'Where little ones meet Jesus.',
    description:
      'A safe and joyful environment where children encounter Jesus through age-appropriate teaching and care.',
    badge: 'Nursery – Pre-teens',
    href: '/ministries/children',
    image: '/images/easter-service.webp',
    overlay:
      'linear-gradient(to top, rgba(30,14,2,0.97) 0%, rgba(7,6,10,0.65) 50%, rgba(7,6,10,0.38) 100%)',
  },
  {
    title: 'Outreach & Missions',
    tagline: 'Taking the church beyond the walls.',
    description:
      "Practical expressions of God's love through service, evangelism, relief, and community development.",
    badge: 'Impact',
    href: '/ministries/outreach',
    image: '/images/conference-2025.webp',
    overlay:
      'linear-gradient(to top, rgba(4,20,10,0.97) 0%, rgba(7,6,10,0.65) 50%, rgba(7,6,10,0.38) 100%)',
  },
] as const;

// Pastoral Care is intentionally not part of the grid above — it's a
// top-level /pastoral page, not a /ministries/* page, so it gets its own
// distinct callout instead of implying a URL taxonomy that doesn't exist.

/* ── Connection pillars ───────────────────────────────── */
const connection = [
  {
    verb: 'Visit',
    body: 'Show up to any gathering. No prior knowledge, no commitment required — just come.',
    href: '/contact?topic=visit',
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
    href: '/about',
    cta: 'Our story',
  },
] as const;

/* ── Arrow ────────────────────────────────────────────── */
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
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Ministries', path: '/ministries' },
        ])}
      />

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <PageHero
        eyebrow="Ministries"
        title="Every generation has a place here."
        subtitle="Ministries built to make discipleship practical, relational, and responsive to real life."
        compact
      />

      {/* ── 2. Intro — canvas ────────────────────────────────── */}
      <section className="overflow-hidden min-w-0 border-b border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <ScrollFadeIn className="flex flex-col gap-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:py-16">
            <div className="max-w-2xl">
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Ministry at Wisdom Church
              </p>
              <h2 className="mt-3 font-headline text-heading-md font-normal leading-snug text-[var(--app-ink)] sm:text-heading-lg">
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
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 self-start border border-[var(--app-ink)]/18 px-6 py-3 font-ui text-label font-semibold text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] lg:self-auto"
            >
              Get connected <Arrow />
            </Link>
          </ScrollFadeIn>
        </Container>
      </section>

      {/* ── 3. Ministry image cards ───────────────────────────── */}
      <section className="relative overflow-hidden min-w-0 bg-[var(--app-dark)] py-14 lg:py-18">
        <SectionGlow />
        <Container size="xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.map((ministry, i) => (
              <ScrollFadeIn key={ministry.title} delay={i * 0.07}>
                <Link
                  href={ministry.href}
                  className="group relative flex aspect-[4/5] min-h-[440px] w-full flex-col overflow-hidden sm:aspect-[3/4] lg:aspect-auto lg:min-h-[520px]"
                >
                  {/* Background image */}
                  <Image
                    src={ministry.image}
                    alt={ministry.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={IMAGE_QUALITY}
                    className="object-cover object-[center_20%] sm:object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />

                  {/* Atmospheric colour overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
                    // eslint-disable-next-line no-restricted-syntax
                    style={{ background: ministry.overlay }}
                  />

                  {/* Card content */}
                  <div className="relative z-10 flex h-full flex-col p-7 lg:p-8">
                    {/* Badge — top */}
                    <span className="self-start border border-white/20 px-3.5 py-1.5 font-ui text-eyebrow font-bold uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm transition-colors duration-200 group-hover:border-[var(--app-primary)]/60 group-hover:text-[var(--app-primary)]">
                      {ministry.badge}
                    </span>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Content — anchored to bottom */}
                    <div>
                      {/* Gold rule */}
                      <div className="mb-4 h-[1.5px] w-8 bg-[var(--app-primary)]/60 transition-all duration-300 group-hover:w-14 group-hover:bg-[var(--app-primary)]" />

                      {/* Tagline */}
                      <p className="mb-2 font-ui text-label font-semibold uppercase tracking-[0.16em] text-[var(--app-primary)]">
                        {ministry.tagline}
                      </p>

                      {/* Title */}
                      <h3 className="font-headline text-heading-md font-normal leading-snug text-white lg:text-heading-lg">
                        {ministry.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 font-ui text-body-sm leading-[1.9] text-white/72">
                        {ministry.description}
                      </p>

                      {/* CTA — always visible, prominent */}
                      <div className="mt-6 flex items-center justify-between">
                        <span className="inline-flex items-center gap-2.5 bg-[var(--app-primary)] px-5 py-2.5 font-ui text-label font-bold uppercase tracking-[0.12em] text-[var(--app-ink)] transition-all duration-200 group-hover:brightness-110">
                          Explore ministry
                          <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3.5 Pastoral Care — distinct callout, not a ministry tile ── */}
      <section className="overflow-hidden min-w-0 border-y border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)]">
        <Container size="xl">
          <div className="flex flex-col items-start gap-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-14">
            <div className="flex items-start gap-5">
              <div className="grid h-12 w-12 flex-none place-items-center border border-[var(--app-primary)]/25 bg-[var(--app-primary)]/[0.08] text-[var(--app-primary)]">
                <Heart className="h-5 w-5" />
              </div>
              <div className="max-w-xl">
                <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  Beyond ministries — care &amp; support
                </p>
                <h3 className="mt-2 font-headline text-heading-sm font-normal leading-snug text-[var(--app-ink)] sm:text-heading-md">
                  Need counseling, prayer, or help with a life moment?
                </h3>
                <p className="mt-2 font-ui text-body-sm leading-[1.85] text-[var(--app-ink)]/65">
                  Pastoral Care isn&apos;t a ministry team to join — it&apos;s
                  our support structure for prayer, confidential counseling, and
                  life transitions, whenever you need it.
                </p>
              </div>
            </div>
            <Link
              href="/pastoral"
              className="inline-flex shrink-0 items-center gap-2 self-start border border-[var(--app-ink)]/18 px-6 py-3 font-ui text-label font-semibold text-[var(--app-ink)]/55 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
            >
              Visit Pastoral Care <Arrow />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── 4. How to connect — canvas ───────────────────────── */}
      <section className="overflow-hidden min-w-0 border-y border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <ScrollFadeIn>
            <div className="border-b border-[var(--app-ink)]/8 py-12 lg:py-16">
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Getting connected
              </p>
              <h2 className="mt-3 max-w-lg font-headline text-heading-md font-normal leading-snug text-[var(--app-ink)] sm:text-heading-lg">
                Finding your place is
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  simpler than you think.
                </em>
              </h2>
            </div>
          </ScrollFadeIn>
        </Container>

        <div className="grid grid-cols-1 divide-y divide-[var(--app-ink)]/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {connection.map((col, i) => (
            <ScrollFadeIn key={col.verb} delay={i * 0.09}>
              <div className="flex flex-col px-8 py-12 lg:px-10 lg:py-16">
                <div className="mb-7 h-[1.5px] w-8 bg-[var(--app-primary)]/55" />
                <p className="font-headline text-display-sm font-normal leading-none text-[var(--app-ink)] lg:text-display-sm">
                  {col.verb}
                </p>
                <p className="mt-5 font-ui text-body-sm leading-[1.9] text-[var(--app-ink)]/68">
                  {col.body}
                </p>
                <Link
                  href={col.href}
                  className="mt-8 inline-flex items-center gap-2.5 self-start border border-[var(--app-ink)]/18 px-5 py-2.5 font-ui text-label font-semibold text-[var(--app-ink)]/50 transition duration-150 hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                >
                  {col.cta}
                  <Arrow />
                </Link>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* ── 5. CTA — dark ────────────────────────────────────── */}
      <ScrollFadeIn>
        <section className="relative overflow-hidden min-w-0 bg-[var(--app-dark)] py-20 lg:py-28">
          <SectionGlow />
          <Container size="lg">
            <div className="flex flex-col items-center gap-7 text-center">
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Take a next step
              </p>
              <h2 className="font-headline text-heading-lg font-normal leading-[1.2] text-white sm:text-heading-lg lg:text-display-sm">
                Ready to find your
                <br className="hidden sm:block" />{' '}
                <em className="italic text-[var(--app-primary)]/80">
                  place to belong?
                </em>
              </h2>
              <div className="h-px w-12 bg-[var(--app-primary)]/40" />
              <p className="max-w-md font-ui text-body-sm leading-[1.9] text-white/70">
                Tell us where you are in your faith journey and we will help you
                find the right ministry community or service opportunity.
              </p>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-label font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition duration-150 hover:brightness-105"
                >
                  Get connected <Arrow />
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 border border-white/18 px-8 py-3.5 font-ui text-label font-semibold uppercase tracking-[0.14em] text-white/55 transition duration-150 hover:border-white/35 hover:text-white"
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
