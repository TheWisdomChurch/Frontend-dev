import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';

export const metadata: Metadata = {
  title: 'Pastoral Care — Wisdom Church',
  description:
    'Pastoral counseling and prayer support at The Wisdom Church. Confidential, caring, and always available.',
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
    cta: 'Request a counseling session',
    dark: false,
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
    cta: 'Submit a prayer request',
    dark: true,
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
        subtitle="Pastoral counseling and dedicated prayer — find where to start, and we will take it from there."
        compact
      />

      {/* ── 2. Statement — dark ──────────────────────────────── */}
      <section className="border-b border-white/8 bg-[var(--app-dark)]">
        <Container size="xl">
          <ScrollFadeIn className="flex flex-col gap-8 py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
            <div className="max-w-xl">
              <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Pastoral support
              </p>
              <h2 className="mt-3 font-headline text-[1.8rem] font-normal leading-snug text-white sm:text-[2.3rem]">
                You do not need to figure out
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  where to start.
                </em>
              </h2>
              <p className="mt-5 max-w-md font-ui text-[0.85rem] leading-[2] text-white/48">
                Choose a care pathway below and we will make sure your request
                reaches the right person on our team.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 self-start border border-white/20 px-7 py-3.5 font-ui text-[0.72rem] font-semibold text-white/55 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] lg:self-auto"
            >
              Request support <Arrow />
            </Link>
          </ScrollFadeIn>
        </Container>
      </section>

      {/* ── 3. Care services — full editorial sections ────────── */}
      {services.map(svc => (
        <ScrollFadeIn key={svc.id}>
          <section
            className={`border-b ${
              svc.dark
                ? 'border-white/8 bg-[var(--app-dark)]'
                : 'border-[var(--app-ink)]/8 bg-[var(--app-canvas)]'
            }`}
          >
            <Container size="xl">
              <div className="grid gap-12 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:py-24">
                {/* Left — title + description */}
                <div className="flex flex-col justify-center">
                  <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                    Pastoral care
                  </p>
                  <div className="mt-4 h-[1.5px] w-10 bg-[var(--app-primary)]/50" />
                  <h2
                    className={`mt-5 font-headline text-[2rem] font-normal leading-snug lg:text-[2.4rem] ${
                      svc.dark ? 'text-white' : 'text-[var(--app-ink)]'
                    }`}
                  >
                    {svc.title}
                  </h2>
                  <p
                    className={`mt-5 max-w-md font-ui text-[0.88rem] leading-[2] ${
                      svc.dark ? 'text-white/50' : 'text-[var(--app-ink)]/55'
                    }`}
                  >
                    {svc.description}
                  </p>
                  <div className="mt-8">
                    <Link
                      href="/contact"
                      className={[
                        'inline-flex items-center gap-2 border px-6 py-3 font-ui text-[0.72rem] font-semibold transition duration-150',
                        svc.dark
                          ? 'border-white/18 text-white/50 hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
                          : 'border-[var(--app-ink)]/18 text-[var(--app-ink)]/50 hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]',
                      ].join(' ')}
                    >
                      {svc.cta} <Arrow />
                    </Link>
                  </div>
                </div>

                {/* Right — detail list */}
                <div className="flex flex-col justify-center">
                  <ul className="space-y-6">
                    {svc.details.map(detail => (
                      <li key={detail} className="flex items-start gap-5">
                        <div
                          className={`mt-[0.6rem] h-[1.5px] w-5 shrink-0 ${
                            svc.dark
                              ? 'bg-[var(--app-primary)]/40'
                              : 'bg-[var(--app-primary)]/50'
                          }`}
                        />
                        <span
                          className={`font-ui text-[0.88rem] leading-[1.85] ${
                            svc.dark
                              ? 'text-white/60'
                              : 'text-[var(--app-ink)]/62'
                          }`}
                        >
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Container>
          </section>
        </ScrollFadeIn>
      ))}

      {/* ── 4. Confidentiality — canvas-2 ────────────────────── */}
      <ScrollFadeIn>
        <section className="bg-[var(--app-canvas-2)] py-16 lg:py-20">
          <Container size="xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-24">
              <div className="lg:max-w-sm">
                <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  Handled with care
                </p>
                <h2 className="mt-3 font-headline text-[1.5rem] font-normal leading-snug text-[var(--app-ink)] sm:text-[1.85rem]">
                  Everything you share is treated with discretion.
                </h2>
              </div>
              <div className="flex-1">
                <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/45" />
                <p className="mt-5 font-ui text-[0.87rem] leading-[2] text-[var(--app-ink)]/55">
                  Pastoral care works best when people can speak openly.
                  Sensitive matters are handled by our pastoral team with
                  maturity, confidentiality, and respect for the person
                  involved. You will always know the next step.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>

      {/* ── 5. CTA — dark ────────────────────────────────────── */}
      <ScrollFadeIn>
        <section className="bg-[var(--app-dark)] py-20 lg:py-28">
          <Container size="lg">
            <div className="flex flex-col items-center gap-7 text-center">
              <p className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Reach out
              </p>
              <h2 className="font-headline text-[1.9rem] font-normal leading-snug text-white sm:text-[2.5rem]">
                You do not have to carry this
                <em className="italic text-[var(--app-primary)]/80"> alone.</em>
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/40" />
              <p className="max-w-md font-ui text-[0.85rem] leading-[2] text-white/45">
                Reach out through the contact page and tell us what you need. We
                will make sure it gets to the right person on our team.
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
                  className="inline-flex items-center justify-center gap-2 border border-white/18 px-8 py-3.5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white/50 transition hover:border-white/35 hover:text-white"
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
