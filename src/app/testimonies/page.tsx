'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import SectionGlow from '@/shared/ui/SectionGlow';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import apiClient from '@/lib/api';
import type { Testimonial as ApiTestimonial } from '@/lib/apiTypes';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo';
import Arrow from '@/shared/ui/icons/Arrow';

/* ── Types ──────────────────────────────────────────────── */

type UiTestimony = {
  id: number | string;
  name: string;
  quote: string;
  isAnonymous: boolean;
};

function mapTestimony(item: ApiTestimonial): UiTestimony {
  const name =
    item.fullName ||
    [item.firstName, item.lastName].filter(Boolean).join(' ').trim() ||
    'Anonymous';
  return {
    id: item.id,
    name,
    quote: item.testimony,
    isAnonymous: !!item.isAnonymous,
  };
}

/* ── Share URL ──────────────────────────────────────────── */

const FORM_BASE =
  process.env.NEXT_PUBLIC_TESTIMONIAL_FORM_URL || '/forms/share-testimony';

// window.location.origin is stable for the component's lifetime, so this
// is read as a one-shot external snapshot rather than synced via effect.
function subscribeNever() {
  return () => {};
}
function getShareUrlSnapshot() {
  try {
    const returnTo = `${window.location.origin}/testimonies?testimonial_submitted=1`;
    const url = new URL(FORM_BASE, window.location.origin);
    url.searchParams.set('return_to', returnTo);
    url.searchParams.set('return_delay_ms', '1800');
    return url.toString();
  } catch {
    return FORM_BASE;
  }
}
function getShareUrlServerSnapshot() {
  return FORM_BASE;
}

/* ── Quote mark ─────────────────────────────────────────── */

function OpenQuote({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`font-headline font-normal leading-none select-none ${className}`}
    >
      &ldquo;
    </span>
  );
}

/* ── Page ───────────────────────────────────────────────── */

export default function TestimoniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [testimonies, setTestimonies] = useState<UiTestimony[]>([]);
  const [loading, setLoading] = useState(true);
  const shareUrl = useSyncExternalStore(
    subscribeNever,
    getShareUrlSnapshot,
    getShareUrlServerSnapshot
  );
  const [showSuccess, setShowSuccess] = useState(
    () => searchParams.get('testimonial_submitted') === '1'
  );

  /* Load testimonies */
  useEffect(() => {
    let live = true;
    apiClient
      .listApprovedTestimonials()
      .then(items => {
        if (!live) return;
        setTestimonies((Array.isArray(items) ? items : []).map(mapTestimony));
      })
      .catch(() => {
        if (live) setTestimonies([]);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  const visible = useMemo(() => testimonies.slice(0, 24), [testimonies]);
  const featured = visible[0] ?? null;
  const rest = visible.slice(1);

  return (
    <>
      <main className="min-h-screen">
        <JsonLd
          data={buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Testimonies', path: '/testimonies' },
          ])}
        />

        {/* ── 1. Hero ────────────────────────────────────────── */}
        <PageHero
          eyebrow="Testimonies"
          title="Stories of faith, healing, and change."
          subtitle="Real accounts from the Wisdom Church community — God still moves."
          compact
        />

        {/* ── 2. Featured testimony — dark ─────────────────── */}
        {!loading && featured && (
          <ScrollFadeIn>
            <section className="min-w-0 relative overflow-hidden border-b border-white/8 bg-[var(--app-dark)] py-20 lg:py-28">
              <SectionGlow />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(201,150,26,0.07),transparent)]" />
              <Container size="md" className="relative text-center">
                <OpenQuote className="text-display-lg text-[var(--app-primary)]/30 lg:text-display-xl" />
                <p className="mx-auto mt-2 max-w-2xl font-headline text-heading-sm font-normal leading-[1.65] text-white sm:text-heading-md lg:text-heading-md">
                  {featured.quote}
                </p>
                <div className="mx-auto mt-8 flex items-center justify-center gap-4">
                  <div className="h-px w-8 bg-[var(--app-primary)]/45" />
                  <p className="font-ui text-label font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
                    {featured.isAnonymous ? 'Anonymous member' : featured.name}
                  </p>
                  <div className="h-px w-8 bg-[var(--app-primary)]/45" />
                </div>
              </Container>
            </section>
          </ScrollFadeIn>
        )}

        {/* ── 3. Testimony grid — canvas ───────────────────── */}
        <section className="overflow-hidden min-w-0 bg-[var(--app-canvas)] py-16 lg:py-20">
          <Container size="xl">
            {/* Section header */}
            <ScrollFadeIn className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  Community stories
                </p>
                <h2 className="mt-2 font-headline text-heading-md font-normal text-[var(--app-ink)] sm:text-heading-lg">
                  What God has done in our community.
                </h2>
              </div>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 self-start border border-[var(--app-ink)]/18 px-5 py-2.5 font-ui text-label font-semibold text-[var(--app-ink)]/55 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] sm:self-auto"
              >
                Share your story <Arrow />
              </a>
            </ScrollFadeIn>

            {/* Loading */}
            {loading && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="h-48 animate-pulse border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)]"
                  />
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && visible.length === 0 && (
              <ScrollFadeIn>
                <div className="flex flex-col items-center gap-5 border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)] px-8 py-16 text-center">
                  <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/50" />
                  <h3 className="font-headline text-heading-sm font-normal text-[var(--app-ink)]">
                    Stories are coming.
                  </h3>
                  <p className="max-w-sm font-ui text-body-sm leading-[1.85] text-[var(--app-ink)]/50">
                    Approved testimonies will appear here. Be the first to share
                    what God has done in your life.
                  </p>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-[var(--app-ink)]/18 px-5 py-2.5 font-ui text-label font-semibold text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                  >
                    Share your story <Arrow />
                  </a>
                </div>
              </ScrollFadeIn>
            )}

            {/* Testimony cards */}
            {!loading && rest.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((testimony, i) => (
                  <ScrollFadeIn key={testimony.id} delay={i * 0.04}>
                    <article
                      className={`flex flex-col p-6 lg:p-7 ${i % 3 === 1 ? 'bg-[var(--app-canvas-2)]' : 'border border-[var(--app-ink)]/8 bg-[var(--app-canvas)]'}`}
                    >
                      {/* Quote mark */}
                      <OpenQuote className="mb-1 text-heading-lg text-[var(--app-primary)]/35" />
                      {/* Quote text */}
                      <p className="font-headline text-body-lg font-normal leading-[1.7] text-[var(--app-ink)] line-clamp-6">
                        {testimony.quote}
                      </p>
                      {/* Attribution */}
                      <div className="mt-5 border-t border-[var(--app-ink)]/8 pt-4">
                        <div className="h-[1.5px] w-5 bg-[var(--app-primary)]/45" />
                        <p className="mt-3 font-ui text-label font-bold uppercase tracking-[0.14em] text-[var(--app-ink)]/55">
                          {testimony.isAnonymous
                            ? 'Anonymous member'
                            : testimony.name}
                        </p>
                        <p className="mt-0.5 font-ui text-caption text-[var(--app-ink)]/60">
                          Wisdom Church
                        </p>
                      </div>
                    </article>
                  </ScrollFadeIn>
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* ── 4. CTA — dark ──────────────────────────────────── */}
        <ScrollFadeIn>
          <section className="relative overflow-hidden min-w-0 bg-[var(--app-dark)] py-20 lg:py-24">
            <SectionGlow />
            <Container size="lg">
              <div className="flex flex-col items-center gap-7 text-center">
                <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  Share your story
                </p>
                <h2 className="font-headline text-heading-md font-normal leading-snug text-white sm:text-heading-lg">
                  If God has done something in your life,
                  <em className="italic text-[var(--app-primary)]/80">
                    {' '}
                    someone needs to hear it.
                  </em>
                </h2>
                <div className="h-px w-10 bg-[var(--app-primary)]/40" />
                <p className="max-w-md font-ui text-body-sm leading-[1.9] text-white/70">
                  Testimonies encourage the people who are still praying, still
                  waiting, and still learning to trust. Your story matters.
                </p>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-label font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition hover:brightness-105"
                >
                  Submit a testimony <Arrow />
                </a>
              </div>
            </Container>
          </section>
        </ScrollFadeIn>
      </main>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.replace('/testimonies');
        }}
        title="Testimony submitted"
        message="Thank you. Your testimony has been received and is now in the admin approval queue."
        actionLabel="Continue"
      />
    </>
  );
}
