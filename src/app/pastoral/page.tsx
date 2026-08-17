import Link from 'next/link';
import { Suspense } from 'react';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import PastoralCareForm from '@/shared/ui/forms/eventsForm/PastoralCare';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo';
import Arrow from '@/shared/ui/icons/Arrow';

// Metadata for this route lives in pastoral/layout.tsx — a single source
// of truth for title/description/canonical/OG/twitter instead of two
// partially-overlapping exports.

export default function PastoralPage() {
  return (
    <main className="min-h-screen">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Pastoral Care', path: '/pastoral' },
        ])}
      />

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <PageHero
        eyebrow="Pastoral Care"
        title="Care is always available here."
        subtitle="Prayer, confidential counseling, or booking a minister for your event — pick what you need below and we'll take it from there."
        compact
      />

      {/* ── 2. Pastoral care form — prayer, counseling & event
             booking, all in one place, no redirects ─────────── */}
      <Suspense fallback={null}>
        <PastoralCareForm />
      </Suspense>

      {/* ── 3. Confidentiality — canvas-2 ────────────────────── */}
      <ScrollFadeIn>
        <section className="overflow-hidden min-w-0 bg-[var(--app-canvas-2)] py-16 lg:py-20">
          <Container size="xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-24">
              <div className="lg:max-w-sm">
                <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  Handled with care
                </p>
                <h2 className="mt-3 font-headline text-heading-md font-normal leading-snug text-[var(--app-ink)] sm:text-heading-md">
                  Everything you share is treated with discretion.
                </h2>
              </div>
              <div className="flex-1">
                <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/45" />
                <p className="mt-5 font-ui text-body-sm leading-[2] text-[var(--app-ink)]/70">
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

      {/* ── 4. CTA — dark ────────────────────────────────────── */}
      <ScrollFadeIn>
        <section className="relative overflow-hidden min-w-0 bg-[var(--app-dark)] py-20 lg:py-28">
          <Container size="lg">
            <div className="flex flex-col items-center gap-7 text-center">
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Prefer to reach us directly?
              </p>
              <h2 className="font-headline text-heading-md font-normal leading-snug text-white sm:text-heading-lg">
                You do not have to carry this
                <em className="italic text-[var(--app-primary)]/80"> alone.</em>
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/40" />
              <p className="max-w-md font-ui text-body-sm leading-[2] text-white/70">
                If the form above doesn&apos;t fit what you need, reach our team
                directly and we will make sure it gets to the right person.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-label font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition hover:brightness-105"
                >
                  Contact us <Arrow />
                </Link>
                <Link
                  href="/events/weekly"
                  className="inline-flex items-center justify-center gap-2 border border-white/18 px-8 py-3.5 font-ui text-label font-semibold uppercase tracking-[0.14em] text-white/50 transition hover:border-white/35 hover:text-white"
                >
                  View service times <Arrow />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
