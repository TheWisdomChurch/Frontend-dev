import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';

export const metadata: Metadata = {
  title: 'Pastoral Care — Wisdom Church',
  description:
    'Pastoral counseling, prayer support, crisis care, and life event guidance at The Wisdom Church.',
};

/* ── Care services ──────────────────────────────────────── */

const services = [
  {
    id: 'counseling',
    title: 'Pastoral Counseling',
    description:
      'A guided conversation for spiritual questions, family pressure, grief, major transitions, and personal challenges. Handled with confidentiality and pastoral maturity.',
    details: [
      'One-on-one pastoral conversations',
      'Biblical guidance with practical clarity',
      'Confidential handling of personal matters',
      'Thoughtful follow-up where needed',
    ],
  },
  {
    id: 'prayer',
    title: 'Prayer Support',
    description:
      'Submit a request and receive dedicated prayer from a team that understands both urgency and discretion. You are not alone in what you are carrying.',
    details: [
      'Prayer for personal and family needs',
      'Support during spiritual pressure or uncertainty',
      'Follow-up where a response is needed',
      'Connection to broader church care when appropriate',
    ],
  },
  {
    id: 'crisis',
    title: 'Crisis Care',
    description:
      'Support during moments that require prompt pastoral attention — grief, sudden loss, or intense life disruption. We show up with presence, not formulas.',
    details: [
      'Pastoral presence in urgent situations',
      'Care during grief, loss, or intense transition',
      'Short-term stabilisation and support',
      'Referral guidance when specialist support is required',
    ],
  },
  {
    id: 'life-events',
    title: 'Life Events',
    description:
      'Pastoral support for weddings, naming ceremonies, family milestones, and the seasons that require intentional spiritual guidance and preparation.',
    details: [
      'Marriage and pre-marital guidance',
      'Family milestone support',
      'Spiritual preparation for major transitions',
      'A clear process for church-related requests',
    ],
  },
] as const;

/* ── Arrow ──────────────────────────────────────────────── */

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

/* ── Page ───────────────────────────────────────────────── */

export default function PastoralPage() {
  return (
    <main className="min-h-screen">
      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <PageHero
        eyebrow="Pastoral Care"
        title="Care is always available here."
        subtitle="Guidance, prayer, crisis support, and life event care — find where to start."
        compact
      />

      {/* ── 2. Statement — dark ──────────────────────────────── */}
      <section className="border-b border-white/8 bg-[var(--app-dark)]">
        <Container size="xl">
          <ScrollFadeIn className="flex flex-col gap-8 py-14 lg:flex-row lg:items-end lg:justify-between lg:py-18">
            <div className="max-w-lg">
              <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Pastoral support
              </p>
              <h2 className="mt-3 font-headline text-[1.7rem] font-normal leading-snug text-white sm:text-[2.2rem]">
                You do not need to figure out
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  where to start.
                </em>
              </h2>
              <p className="mt-4 font-ui text-[0.85rem] leading-[1.9] text-white/50">
                Choose a care pathway below and we will make sure your request
                reaches the right person on our team.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 self-start border border-white/20 px-6 py-3 font-ui text-[0.72rem] font-semibold text-white/55 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] lg:self-auto"
            >
              Request support <Arrow />
            </Link>
          </ScrollFadeIn>
        </Container>
      </section>

      {/* ── 3. Care pathways — alternating editorial rows ────── */}
      <section className="border-b border-[var(--app-ink)]/8">
        <div className="divide-y divide-[var(--app-ink)]/8">
          {services.map((svc, i) => {
            const isDark = i % 2 !== 0;
            return (
              <ScrollFadeIn key={svc.id} delay={i * 0.05}>
                <div
                  className={
                    isDark ? 'bg-[var(--app-dark)]' : 'bg-[var(--app-canvas)]'
                  }
                >
                  <Container size="xl">
                    <div className="grid gap-8 py-12 lg:grid-cols-2 lg:gap-20 lg:py-14">
                      {/* Left — title + description */}
                      <div>
                        <div className="mb-4 h-[1.5px] w-8 bg-[var(--app-primary)]/55" />
                        <h3
                          className={`font-headline text-[1.5rem] font-normal leading-snug lg:text-[1.75rem] ${isDark ? 'text-white' : 'text-[var(--app-ink)]'}`}
                        >
                          {svc.title}
                        </h3>
                        <p
                          className={`mt-4 font-ui text-[0.84rem] leading-[1.9] ${isDark ? 'text-white/52' : 'text-[var(--app-ink)]/55'}`}
                        >
                          {svc.description}
                        </p>
                      </div>

                      {/* Right — detail list */}
                      <div className="flex flex-col justify-center gap-4">
                        {svc.details.map(detail => (
                          <div key={detail} className="flex items-start gap-4">
                            <div
                              className={`mt-[0.55rem] h-[1.5px] w-5 shrink-0 ${isDark ? 'bg-[var(--app-primary)]/45' : 'bg-[var(--app-primary)]/50'}`}
                            />
                            <span
                              className={`font-ui text-[0.83rem] leading-[1.8] ${isDark ? 'text-white/55' : 'text-[var(--app-ink)]/58'}`}
                            >
                              {detail}
                            </span>
                          </div>
                        ))}
                        <div className="pt-2">
                          <Link
                            href="/contact"
                            className={[
                              'inline-flex items-center gap-2 border px-5 py-2.5 font-ui text-[0.7rem] font-semibold transition duration-150',
                              isDark
                                ? 'border-white/18 text-white/50 hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
                                : 'border-[var(--app-ink)]/18 text-[var(--app-ink)]/50 hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]',
                            ].join(' ')}
                          >
                            Request {svc.title.split(' ')[0].toLowerCase()}{' '}
                            support <Arrow />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Container>
                </div>
              </ScrollFadeIn>
            );
          })}
        </div>
      </section>

      {/* ── 4. Confidentiality note — canvas ─────────────────── */}
      <ScrollFadeIn>
        <section className="bg-[var(--app-canvas-2)] py-14 lg:py-16">
          <Container size="xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-20">
              <div className="max-w-lg">
                <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  Handled with care
                </p>
                <h2 className="mt-3 font-headline text-[1.5rem] font-normal leading-snug text-[var(--app-ink)] sm:text-[1.8rem]">
                  Everything you share is treated with discretion.
                </h2>
              </div>
              <p className="flex-1 font-ui text-[0.85rem] leading-[1.9] text-[var(--app-ink)]/55">
                Pastoral care works best when people can speak openly. Sensitive
                matters are handled by our pastoral team with maturity,
                confidentiality, and respect for the person involved. You will
                always know the next step.
              </p>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>

      {/* ── 5. CTA — dark ────────────────────────────────────── */}
      <ScrollFadeIn>
        <section className="bg-[var(--app-dark)] py-20 lg:py-24">
          <Container size="lg">
            <div className="flex flex-col items-center gap-7 text-center">
              <p className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Reach out
              </p>
              <h2 className="font-headline text-[1.9rem] font-normal leading-snug text-white sm:text-[2.4rem]">
                You do not have to carry this
                <em className="italic text-[var(--app-primary)]/80"> alone.</em>
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/40" />
              <p className="max-w-md font-ui text-[0.85rem] leading-[1.9] text-white/48">
                Reach out through the contact page and tell us what you need. We
                will make sure it gets to the right part of the team.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition hover:brightness-105"
                >
                  Request support <Arrow />
                </Link>
                <Link
                  href="/events/weekly"
                  className="inline-flex items-center justify-center gap-2 border border-white/18 px-8 py-3.5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white/55 transition hover:border-white/35 hover:text-white"
                >
                  View service times
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
