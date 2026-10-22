'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Filter,
  HeartHandshake,
  MessageSquarePlus,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import apiClient from '@/lib/api';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { Container, Page, Section, SectionEmpty } from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';
import { cn } from '@/lib/cn';
import {
  initialsOf,
  mapApiTestimonial,
  type TestimonialItem,
} from '@/features/testimonials/testimonialsData';
import { TestimonialModal } from '@/features/testimonials/TestimonialModal';

/* ── Share URL Helpers ──────────────────────────────────────────── */

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

const CATEGORIES = [
  'All Stories',
  'Breakthrough & Career',
  'Divine Healing',
  'Family & Restoration',
  'Supernatural Grace',
  'Academic Favor',
] as const;

export default function TestimoniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [testimonies, setTestimonies] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<string>('All Stories');
  const [activeModalTestimony, setActiveModalTestimony] =
    useState<TestimonialItem | null>(null);

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
        const arr = Array.isArray(items) ? items : [];
        setTestimonies(arr.map(mapApiTestimonial));
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

  const filtered = useMemo(() => {
    if (selectedCategory === 'All Stories') return testimonies;
    return testimonies.filter(t => t.category === selectedCategory);
  }, [testimonies, selectedCategory]);

  const featured = testimonies[0] ?? null;

  return (
    <>
      <Page tone="surface" className="bg-[var(--app-surface)]">
        <JsonLd
          data={buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Testimonies', path: '/testimonies' },
          ])}
        />

        {/* ── 1. Hero ────────────────────────────────────────── */}
        <SiteHero
          backgroundImage="/Picflow/DSC00058-copy.webp"
          imagePositionClassName="object-[center_35%]"
          eyebrow="Answered Prayers & Praise Reports"
          title="Stories of faith, healing, and supernatural change."
          subtitle="Real accounts from The Wisdom Church community — declaring God's unwavering faithfulness, miraculous healing, and open doors."
        />

        {/* ── 2. Trust Reassurance Bar ────────────────────────── */}
        <div className="border-y border-[var(--app-border)] bg-[var(--app-canvas-2)]/60 py-4.5">
          <Container>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-center">
              <div className="inline-flex items-center gap-2 font-ui text-xs font-semibold text-[var(--app-ink)]">
                <ShieldCheck className="h-4 w-4 text-[var(--app-primary)]" />
                <span>100% Verified Church Accounts</span>
              </div>
              <div className="inline-flex items-center gap-2 font-ui text-xs font-semibold text-[var(--app-ink)]">
                <Users className="h-4 w-4 text-[var(--app-primary)]" />
                <span>Fellowships, Families & Workforce</span>
              </div>
              <div className="inline-flex items-center gap-2 font-ui text-xs font-semibold text-[var(--app-ink)]">
                <Sparkles className="h-4 w-4 text-[var(--app-primary)]" />
                <span>Updated Weekly Praise Reports</span>
              </div>
            </div>
          </Container>
        </div>

        {/* ── 3. Category Filter & Header ─────────────────────── */}
        <Section tone="surface" className="py-12 sm:py-16">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--app-border)] pb-8 mb-10">
              <div>
                <span className="font-ui text-xs font-bold uppercase tracking-wider text-[var(--app-primary)]">
                  Browse by Category
                </span>
                <h2 className="mt-2 font-headline text-heading-lg sm:text-heading-xl font-bold text-[var(--app-ink)]">
                  Testimonies of His goodness
                </h2>
                <p className="mt-2 font-ui text-body-sm text-[var(--app-subtle)] max-w-xl">
                  Filter through verified praise reports or share your own
                  testimony to encourage the body of Christ.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={shareUrl}
                  className={cn(
                    buttonClass('primary', 'md'),
                    'gap-2 shadow-sm'
                  )}
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  <span>Share your story</span>
                </Link>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
              <Filter className="h-4 w-4 text-[var(--app-subtle)] shrink-0 ml-1 mr-2" />
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === 'All Stories'
                    ? testimonies.length
                    : testimonies.filter(t => t.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 font-ui text-xs font-semibold whitespace-nowrap transition-all duration-200',
                      isSelected
                        ? 'bg-[var(--app-primary)] text-black shadow-sm ring-2 ring-[var(--app-primary)]/30'
                        : 'border border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-subtle)] hover:border-[var(--app-primary)]/40 hover:text-[var(--app-ink)]'
                    )}
                  >
                    <span>{cat}</span>
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                        isSelected
                          ? 'bg-black/20 text-black'
                          : 'bg-[var(--app-canvas-2)] text-[var(--app-subtle)]'
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── 4. Spotlight Card (Shown when All Stories is selected) ── */}
            {selectedCategory === 'All Stories' && featured && (
              <div className="mt-8 mb-12">
                <div className="relative overflow-hidden rounded-3xl border border-[var(--app-primary)]/30 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,color-mix(in_srgb,var(--app-primary-10)_75%,transparent)_0%,transparent_75%),var(--app-canvas)] p-8 sm:p-12 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--app-border)]/70 pb-5 mb-6">
                    <div className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--app-primary)]/30 bg-[color-mix(in_srgb,var(--app-primary)_12%,transparent)] px-3.5 py-1 font-ui text-xs font-semibold text-[var(--app-primary)]">
                        <Sparkles className="h-3 w-3" />
                        Featured Spotlight
                      </span>
                      <span className="font-ui text-xs font-medium text-[var(--app-subtle)]">
                        {featured.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveModalTestimony(featured)}
                      className="inline-flex items-center gap-1.5 font-ui text-xs font-semibold text-[var(--app-primary)] hover:underline"
                    >
                      <span>Read complete account</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <Quote className="h-10 w-10 text-[var(--app-primary)] opacity-80 mb-4" />
                  <blockquote className="font-headline text-xl sm:text-2xl lg:text-3xl font-normal leading-relaxed text-[var(--app-ink)] max-w-4xl">
                    &ldquo;{featured.quote}&rdquo;
                  </blockquote>

                  <div className="mt-8 flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)] font-ui text-base font-bold text-black shadow-md">
                      {initialsOf(featured.name)}
                    </span>
                    <div>
                      <p className="font-ui text-base font-bold text-[var(--app-ink)]">
                        {featured.name}
                      </p>
                      <p className="font-ui text-xs text-[var(--app-subtle)]">
                        {featured.role}{' '}
                        {featured.date ? `· ${featured.date}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 5. Main Testimonies Grid ────────────────────── */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-3xl border border-[var(--app-border)] bg-[var(--app-canvas-2)]"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <SectionEmpty
                title="No testimonies in this category yet."
                description="Be the first to share how God intervened and made a way in this area."
                action={
                  <Link href={shareUrl} className={buttonClass('primary')}>
                    Share your testimony <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                }
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item, index) => (
                  <ScrollFadeIn key={item.id} delay={index * 0.04}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveModalTestimony(item)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveModalTestimony(item);
                        }
                      }}
                      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-canvas)] p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--app-primary)] hover:shadow-xl cursor-pointer"
                    >
                      {/* Top Meta */}
                      <div>
                        <div className="flex items-center justify-between gap-2 border-b border-[var(--app-border)]/60 pb-3.5 mb-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--app-primary)]/20 bg-[color-mix(in_srgb,var(--app-primary)_8%,transparent)] px-2.5 py-0.5 font-ui text-[11px] font-semibold text-[var(--app-primary)]">
                            {item.category}
                          </span>
                          <span className="inline-flex items-center gap-1 font-ui text-[11px] text-[var(--app-subtle)]">
                            <CheckCircle2 className="h-3 w-3 text-[var(--status-success)]" />
                            Verified
                          </span>
                        </div>

                        <Quote className="h-6 w-6 text-[var(--app-primary)] opacity-70 mb-3" />
                        <p className="font-ui text-body-md font-normal leading-relaxed text-[var(--app-ink)] line-clamp-4">
                          &ldquo;{item.quote}&rdquo;
                        </p>

                        <div className="mt-4">
                          <span className="inline-flex items-center gap-1 font-ui text-xs font-semibold text-[var(--app-primary)] group-hover:underline">
                            <span>Read full story</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>

                      {/* Author Info */}
                      <div className="mt-6 flex items-center gap-3.5 border-t border-[var(--app-border)]/60 pt-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--app-canvas-2)] font-ui text-xs font-bold text-[var(--app-ink)] border border-[var(--app-border)] group-hover:border-[var(--app-primary)] group-hover:text-[var(--app-primary)] transition-colors">
                          {initialsOf(item.name)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-ui text-sm font-bold text-[var(--app-ink)]">
                            {item.name}
                          </p>
                          <p className="truncate font-ui text-xs text-[var(--app-subtle)]">
                            {item.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
            )}
          </Container>
        </Section>

        {/* ── 6. Editorial CTA Section ──────────────────────── */}
        <Section
          tone="dark"
          className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--app-primary)_15%,transparent)_0%,transparent_65%),var(--app-dark)] py-20 sm:py-28"
        >
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-ui text-xs font-semibold text-[var(--app-primary)] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Declare His Deeds
              </span>

              <h2 className="mt-6 font-headline text-heading-xl sm:text-heading-2xl font-bold tracking-tight text-white">
                If God has moved in your life,{' '}
                <span className="text-[var(--app-primary)]">
                  someone needs to hear it.
                </span>
              </h2>

              <p className="mt-4 font-ui text-body-md sm:text-body-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
                Testimonies overcome the enemy and stir radical faith in those
                who are still waiting, believing, and praying for their
                breakthrough. Your story has divine purpose.
              </p>

              {/* Action Buttons Cluster */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={shareUrl}
                  className={cn(
                    buttonClass('primary', 'lg'),
                    'gap-2 shadow-lg'
                  )}
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  <span>Submit your testimony</span>
                </Link>

                <Link
                  href="/pastoral"
                  className={cn(
                    buttonClass('outline', 'lg'),
                    'gap-2 text-white border-white/20'
                  )}
                >
                  <HeartHandshake className="h-4 w-4" />
                  <span>Request pastoral prayer</span>
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </Page>

      {/* Read Full Testimony Modal */}
      <TestimonialModal
        testimony={activeModalTestimony}
        isOpen={Boolean(activeModalTestimony)}
        onClose={() => setActiveModalTestimony(null)}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.replace('/testimonies');
        }}
        title="Testimony submitted"
        message="Thank you! Your testimony has been received and will be published upon pastoral team verification."
        actionLabel="Continue"
      />
    </>
  );
}
