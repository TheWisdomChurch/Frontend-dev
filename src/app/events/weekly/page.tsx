import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';

export const metadata: Metadata = {
  title: 'Weekly Services — Wisdom Church',
  description:
    'Join us every Sunday at 9:00 AM and Thursday at 6:00 PM at Honor Gardens, Lekki-Epe Expressway, Lagos.',
};

const services = [
  {
    day: 'Sunday',
    time: '9:00 AM',
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
    day: 'Thursday',
    time: '6:00 PM',
    name: 'Midweek Power Service',
    description:
      'A mid-week reset — deep prayer, focused teaching, and meaningful fellowship with the community.',
    details: [
      'Runs approximately 90 minutes',
      'Open to all ages',
      'Great entry point for first-timers',
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

export default function WeeklyPage() {
  return (
    <main className="min-h-screen">
      <PageHero
        eyebrow="Weekly Services"
        title="We gather. Every week."
        subtitle="Two services a week — Sunday morning and Thursday evening — both open to everyone."
        compact
      />

      {/* Service panels */}
      <section className="bg-[var(--app-canvas)]">
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
                      <p className="font-headline text-[3.5rem] font-normal leading-none text-[var(--app-ink)] lg:text-[4.5rem]">
                        {svc.day}
                      </p>
                      <p className="font-ui text-[1rem] font-bold text-[var(--app-primary)]">
                        {svc.time}
                      </p>
                    </div>
                    <div className="mt-6 h-[1.5px] w-10 bg-[var(--app-primary)]/50" />
                    <p className="mt-5 font-headline text-[1.3rem] font-normal text-[var(--app-ink)]">
                      {svc.name}
                    </p>
                    <p className="mt-3 font-ui text-[0.85rem] leading-[1.9] text-[var(--app-ink)]/70 max-w-sm">
                      {svc.description}
                    </p>
                  </div>

                  {/* Right — detail bullets + cta */}
                  <div className="flex flex-col gap-6 lg:pt-4">
                    <ul className="space-y-3">
                      {svc.details.map(d => (
                        <li key={d} className="flex items-start gap-3">
                          <div className="mt-[0.55rem] h-[1.5px] w-4 shrink-0 bg-[var(--app-primary)]/55" />
                          <span className="font-ui text-[0.83rem] leading-[1.8] text-[var(--app-ink)]/72">
                            {d}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="font-ui text-[0.78rem] text-[var(--app-ink)]/55">
                      Honor Gardens, opposite Dominion Church HQ,
                      <br />
                      Alasia bus stop, Lekki-Epe Expressway, Lagos
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 self-start border border-[var(--app-ink)]/18 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
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
        <section className="bg-[var(--app-dark)] py-16 lg:py-20">
          <Container size="lg">
            <div className="flex flex-col items-center gap-7 text-center">
              <p className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                First time?
              </p>
              <h2 className="font-headline text-[1.9rem] font-normal leading-snug text-white sm:text-[2.4rem]">
                Walk in. You belong here.
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/40" />
              <p className="max-w-md font-ui text-[0.85rem] leading-[1.9] text-white/70">
                No pressure, no expectations — just come and experience the
                community. Our welcome team will be right there when you arrive.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition hover:brightness-105"
                >
                  Let us know you're coming <Arrow />
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 border border-white/18 px-8 py-3.5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white/55 transition hover:border-white/35 hover:text-white"
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
