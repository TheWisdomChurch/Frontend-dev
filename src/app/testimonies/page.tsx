'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import apiClient from '@/lib/api';
import type { Testimonial as ApiTestimonial } from '@/lib/apiTypes';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo';
import Arrow from '@/shared/ui/icons/Arrow';
import {
  Container,
  Eyebrow,
  Page,
  Panel,
  Section,
  SectionEmpty,
  SectionHeader,
  interactiveCardClass,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';
import { cn } from '@/lib/cn';

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

function displayName(t: UiTestimony) {
  return t.isAnonymous ? 'Anonymous member' : t.name;
}

function initial(t: UiTestimony) {
  return (t.isAnonymous ? 'A' : t.name.trim()[0] || 'W').toUpperCase();
}

/* ── Share URL ──────────────────────────────────────────── */

const FORM_BASE =
  process.env.NEXT_PUBLIC_TESTIMONIAL_FORM_URL || '/forms/share-testimony';

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

/* ── Quote glyph ────────────────────────────────────────── */

function QuoteGlyph({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block select-none font-ui font-black leading-[0.7]',
        className
      )}
    >
      &ldquo;
    </span>
  );
}

/* ── Testimony card ─────────────────────────────────────── */

function TestimonyCard({ testimony }: { testimony: UiTestimony }) {
  return (
    <Panel
      className={cn('flex h-full flex-col p-6 lg:p-7', interactiveCardClass)}
    >
      <QuoteGlyph className="mb-2 text-heading-lg text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)]" />
      <p className="font-ui text-body-md font-normal leading-[1.75] text-[var(--app-text)] line-clamp-6">
        {testimony.quote}
      </p>

      <div className="mt-auto flex items-center gap-3 border-t border-[var(--app-border)] pt-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary-10)] font-ui text-body-sm font-bold text-[var(--app-primary-dark)]">
          {initial(testimony)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-ui text-body-sm font-semibold text-[var(--app-text)]">
            {displayName(testimony)}
          </span>
          <span className="block font-ui text-caption text-[var(--app-subtle)]">
            Wisdom Church
          </span>
        </span>
      </div>
    </Panel>
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
      <Page>
        <JsonLd
          data={buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Testimonies', path: '/testimonies' },
          ])}
        />

        {/* ── 1. Hero ────────────────────────────────────────── */}
        <SiteHero
          backgroundImage="/Picflow/DSC00058-copy.webp"
          imagePositionClassName="object-center"
          eyebrow="Testimonies"
          title="Stories of faith, healing, and change."
          subtitle="Real accounts from the Wisdom Church community — God still moves."
        />

        {/* ── 2. Featured testimony ──────────────────────────── */}
        {!loading && featured ? (
          <Section tone="dark">
            <Container>
              <div className="relative mx-auto max-w-3xl text-center">
                <QuoteGlyph className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 text-[clamp(6rem,18vw,11rem)] text-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] sm:-top-12" />
                <p className="relative font-ui text-heading-md font-medium leading-[1.55] text-[var(--app-text)] sm:text-heading-lg">
                  {featured.quote}
                </p>
                <div className="relative mt-9 flex items-center justify-center gap-4">
                  <span className="h-px w-10 bg-[color-mix(in_srgb,var(--app-primary)_50%,transparent)]" />
                  <Eyebrow>{displayName(featured)}</Eyebrow>
                  <span className="h-px w-10 bg-[color-mix(in_srgb,var(--app-primary)_50%,transparent)]" />
                </div>
              </div>
            </Container>
          </Section>
        ) : null}

        {/* ── 3. Testimony grid ─────────────────────────────── */}
        <Section tone="canvas">
          <Container>
            <ScrollFadeIn className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeader
                eyebrow="Community stories"
                title="What God has done in our community."
                size="sm"
              />
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('outline', 'sm', 'shrink-0')}
              >
                Share your story <Arrow />
              </a>
            </ScrollFadeIn>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="h-52 animate-pulse rounded-card border border-[var(--app-border)] bg-[var(--app-canvas-2)]"
                  />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <SectionEmpty
                title="Stories are coming."
                description="Approved testimonies will appear here. Be the first to share what God has done in your life."
                action={
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass('dark')}
                  >
                    Share your story
                  </a>
                }
              />
            ) : rest.length > 0 ? (
              <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((testimony, i) => (
                  <ScrollFadeIn key={testimony.id} delay={i * 0.04}>
                    <TestimonyCard testimony={testimony} />
                  </ScrollFadeIn>
                ))}
              </div>
            ) : (
              <p className="font-ui text-body-sm text-[var(--app-muted)]">
                More stories are on the way.
              </p>
            )}
          </Container>
        </Section>

        {/* ── 4. CTA ────────────────────────────────────────── */}
        <Section tone="dark">
          <Container>
            <SectionHeader
              align="center"
              eyebrow="Share your story"
              title="If God has done something in your life,"
              accent="someone needs to hear it."
              description="Testimonies encourage the people who are still praying, still waiting, and still learning to trust. Your story matters."
              tone="dark"
              size="sm"
            />
            <div className="mt-8 flex justify-center">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('primary')}
              >
                Submit a testimony <Arrow />
              </a>
            </div>
          </Container>
        </Section>
      </Page>

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
