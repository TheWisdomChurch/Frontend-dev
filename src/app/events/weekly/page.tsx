import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import SectionGlow from '@/shared/ui/SectionGlow';
import JsonLd from '@/shared/seo/JsonLd';
import { buildRecurringEventSchema } from '@/lib/seo';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';

export const metadata: Metadata = {
  title: 'Weekly Services — Wisdom Church',
  description: `Join us every ${SERVICE_INFO.sunday.day} at ${SERVICE_INFO.sunday.time} and for ${SERVICE_INFO.dailyPrayer.label}, ${SERVICE_INFO.dailyPrayer.days} at ${SERVICE_INFO.dailyPrayer.time}, at ${SERVICE_INFO.venue.full}.`,
};

const services = [
  {
    day: SERVICE_INFO.sunday.day,
    time: SERVICE_INFO.sunday.time,
    name: 'Sunday Worship Service',
    description:
      'Our flagship gathering — Spirit-filled worship, corporate prayer, and the preached Word. All are welcome.',
    details: [
      "Children's Church runs simultaneously for ages 3–12",
      'Doors open from 8:30 AM',
      'Dress code: Smart casual or formal',
    ],
  },
  {
    day: SERVICE_INFO.dailyPrayer.daysShort,
    time: SERVICE_INFO.dailyPrayer.time,
    name: 'Daily Morning Prayer',
    description:
      'Start every weekday in prayer, declaration, and the Word — a solid foundation before the day begins.',
    details: [
      'Runs approximately 45 minutes',
      'Open to all ages',
      'Join in person or via livestream',
    ],
  },
] as const;

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

const RECURRING_SCHEMAS = [
  buildRecurringEventSchema({
    name: 'Sunday Worship Service',
    description:
      'Our flagship gathering — Spirit-filled worship, corporate prayer, and the preached Word.',
    dayOfWeek: ['https://schema.org/Sunday'],
    startTime: '09:00',
  }),
  buildRecurringEventSchema({
    name: 'Daily Morning Prayer',
    description:
      'Start every weekday in prayer, declaration, and the Word — a solid foundation before the day begins.',
    dayOfWeek: [
      'https://schema.org/Monday',
      'https://schema.org/Tuesday',
      'https://schema.org/Wednesday',
      'https://schema.org/Thursday',
      'https://schema.org/Friday',
    ],
    startTime: '07:00',
  }),
];

export default function WeeklyPage() {
  return (
    <main className="min-h-screen">
      {RECURRING_SCHEMAS.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}

      <PageHero
        eyebrow="Weekly Services"
        title="We gather. Every week."
        subtitle="Sunday morning worship, and Daily Prayer every weekday morning — all open to everyone."
        compact
      />

      {/* Service panels */}
      <section className="overflow-hidden min-w-0 bg-[var(--app-canvas)]">
        <Container size="xl">
          <div className="divide-y divide-[var(--app-ink)]/8 border-b border-[var(--app-ink)]/8 py-14 lg:py-18">
            {services.map((svc, i) => (
              <ScrollFadeIn key={svc.day} delay={i * 0.08}>
                <div
                  className={`grid gap-10 py-12 lg:grid-cols-2 lg:gap-20 lg:py-14 ${i === 0 ? 'pt-0' : ''}`}
                >
                  {/* Left — day + time */}
                  <div>
                    <div className="flex items-baseline gap-5">
                      <p className="font-headline text-display-sm font-normal leading-none text-[var(--app-ink)] lg:text-display-md">
                        {svc.day}
                      </p>
                      <p className="font-ui text-body-lg font-bold text-[var(--app-primary)]">
                        {svc.time}
                      </p>
                    </div>
                    <div className="mt-6 h-[1.5px] w-10 bg-[var(--app-primary)]/50" />
                    <p className="mt-5 font-headline text-heading-sm font-normal text-[var(--app-ink)]">
                      {svc.name}
                    </p>
                    <p className="mt-3 font-ui text-body-sm leading-[1.9] text-[var(--app-ink)]/70 max-w-sm">
                      {svc.description}
                    </p>
                  </div>

                  {/* Right — detail bullets + cta */}
                  <div className="flex flex-col gap-6 lg:pt-4">
                    <ul className="space-y-3">
                      {svc.details.map(d => (
                        <li key={d} className="flex items-start gap-3">
                          <div className="mt-[0.55rem] h-[1.5px] w-4 shrink-0 bg-[var(--app-primary)]/55" />
                          <span className="font-ui text-body-sm leading-[1.8] text-[var(--app-ink)]/72">
                            {d}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="font-ui text-label text-[var(--app-ink)]/55">
                      {SERVICE_INFO.venue.name},{' '}
                      {SERVICE_INFO.venue.streetAddress}
                      ,<br />
                      {SERVICE_INFO.venue.locality}
                    </p>
                    <Link
                      href="/contact?topic=visit"
                      className="inline-flex items-center gap-2 self-start border border-[var(--app-ink)]/18 px-5 py-2.5 font-ui text-label font-semibold text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                    >
                      Plan your visit <Arrow />
                    </Link>
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA dark */}
      <ScrollFadeIn>
        <section className="relative overflow-hidden min-w-0 bg-[var(--app-dark)] py-16 lg:py-20">
          <SectionGlow />
          <Container size="lg">
            <div className="flex flex-col items-center gap-7 text-center">
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                First time?
              </p>
              <h2 className="font-headline text-heading-md font-normal leading-snug text-white sm:text-heading-lg">
                Walk in. You belong here.
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/40" />
              <p className="max-w-md font-ui text-body-sm leading-[1.9] text-white/70">
                No pressure, no expectations — just come and experience the
                community. Our welcome team will be right there when you arrive.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-label font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition hover:brightness-105"
                >
                  Let us know you're coming <Arrow />
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 border border-white/18 px-8 py-3.5 font-ui text-label font-semibold uppercase tracking-[0.14em] text-white/55 transition hover:border-white/35 hover:text-white"
                >
                  See all events
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
