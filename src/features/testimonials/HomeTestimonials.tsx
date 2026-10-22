'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquarePlus,
  Quote,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Container, Section } from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';
import apiClient from '@/lib/api';
import type { Testimonial as ApiTestimonial } from '@/lib/apiTypes';
import { cn } from '@/lib/cn';
import {
  initialsOf,
  mapApiTestimonial,
  type TestimonialItem,
} from './testimonialsData';
import { TestimonialModal } from './TestimonialModal';

const AUTO_ADVANCE_MS = 14000;

export default function HomeTestimonials() {
  const [quotes, setQuotes] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [modalTestimony, setModalTestimony] = useState<TestimonialItem | null>(
    null
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeThumbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadTestimonials = async () => {
      try {
        const data = await apiClient.listApprovedTestimonials();
        const arr: ApiTestimonial[] = Array.isArray(data) ? data : [];
        if (mounted) {
          setQuotes(arr.map(mapApiTestimonial));
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setQuotes([]);
          setLoading(false);
        }
      }
    };
    void loadTestimonials();
    return () => {
      mounted = false;
    };
  }, []);

  const goTo = useCallback(
    (i: number, fromUser = false) => {
      if (fromUser) setUserInteracted(true);
      const total = quotes.length;
      if (total === 0) {
        setCurrent(0);
        return;
      }
      setCurrent((i + total) % total);
    },
    [quotes.length]
  );

  const prev = useCallback(() => goTo(current - 1, true), [goTo, current]);
  const next = useCallback(() => goTo(current + 1, true), [goTo, current]);

  // Non-intrusive auto-advance that pauses on hover or after user interaction
  useEffect(() => {
    if (isPaused || userInteracted || quotes.length <= 1) return;
    timerRef.current = setInterval(() => {
      goTo(current + 1, false);
    }, AUTO_ADVANCE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, isPaused, userInteracted, goTo, quotes.length]);

  // Scroll active mobile thumbnail into view smoothly
  useEffect(() => {
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [current]);

  // Loading skeleton
  if (loading) {
    return (
      <Section tone="surface" className="py-16 sm:py-24 lg:py-28">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10 sm:mb-14">
            <div className="max-w-xl">
              <div className="h-6 w-44 rounded-full bg-[var(--app-canvas-2)] animate-pulse mb-3" />
              <div className="h-9 w-80 sm:w-96 rounded-xl bg-[var(--app-canvas-2)] animate-pulse" />
              <div className="mt-3 h-5 w-full max-w-md rounded-lg bg-[var(--app-canvas-2)] animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-11 w-36 rounded-full bg-[var(--app-canvas-2)] animate-pulse" />
              <div className="h-11 w-36 rounded-full bg-[var(--app-canvas-2)] animate-pulse" />
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7 h-[420px] rounded-3xl bg-[var(--app-canvas-2)] animate-pulse" />
            <div className="lg:col-span-5 space-y-3.5">
              <div className="h-28 rounded-2xl bg-[var(--app-canvas-2)] animate-pulse" />
              <div className="h-28 rounded-2xl bg-[var(--app-canvas-2)] animate-pulse" />
              <div className="h-28 rounded-2xl bg-[var(--app-canvas-2)] animate-pulse" />
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  // If backend has 0 approved testimonials, return null (zero mock data)
  if (quotes.length === 0) {
    return null;
  }

  const activeQuote = quotes[current] ?? quotes[0];
  const isQuoteLong = (activeQuote?.quote?.length ?? 0) > 260;

  return (
    <>
      <Section
        id="testimonies"
        tone="surface"
        className="relative overflow-hidden bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,color-mix(in_srgb,var(--app-primary-10)_75%,transparent)_0%,transparent_70%),var(--app-surface)] py-16 sm:py-24 lg:py-28"
      >
        <Container>
          {/* Header Row */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10 sm:mb-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-primary)]/30 bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] px-3.5 py-1 text-xs font-semibold text-[var(--app-primary)] mb-3.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--app-primary)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--app-primary)]" />
                </span>
                <span>Praise Reports & Breakthroughs</span>
              </div>
              <h2 className="font-headline text-heading-xl sm:text-heading-2xl font-bold tracking-tight text-[var(--app-ink)]">
                Real stories,{' '}
                <span className="text-[var(--app-primary)]">
                  real breakthroughs.
                </span>
              </h2>
              <p className="mt-3.5 font-ui text-body-md sm:text-body-lg text-[var(--app-subtle)] leading-relaxed">
                Discover how God is actively answering prayers, bringing
                healing, restoring hope, and opening supernatural doors in our
                church family.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/forms/share-testimony"
                className={cn(buttonClass('primary', 'md'), 'gap-2 shadow-sm')}
              >
                <MessageSquarePlus className="h-4 w-4" />
                <span>Share your story</span>
              </Link>
              <Link
                href="/testimonies"
                className={cn(buttonClass('outline', 'md'), 'gap-2')}
              >
                <span>Explore all stories</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Main Stage Grid (Balanced 7/5 Desktop Split) */}
          <div
            className="grid gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-10 items-stretch"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* ── Left 7 Cols: The Prominent Spotlight Card ── */}
            <div className="lg:col-span-7 flex flex-col min-w-0">
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-canvas)] p-6 sm:p-8 lg:p-10 shadow-xl">
                {/* Subtle Watermark Quote */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-2 select-none font-headline text-[10rem] sm:text-[13rem] font-bold leading-none text-[var(--app-primary)]/5"
                >
                  &rdquo;
                </div>

                {/* Top Meta */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--app-border)]/70 pb-4 sm:pb-5">
                    <div className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--app-primary)]/30 bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] px-3 py-1 font-ui text-xs font-semibold text-[var(--app-primary)]">
                        <Sparkles className="h-3 w-3" />
                        {activeQuote.category}
                      </span>
                      <span className="inline-flex items-center gap-1 font-ui text-xs font-medium text-[var(--app-subtle)]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--status-success)]" />
                        Verified Account
                      </span>
                    </div>

                    {/* Numeric Counter */}
                    <div className="font-ui text-xs font-bold tracking-widest text-[var(--app-subtle)]">
                      <span className="text-[var(--app-primary)]">
                        {String(current + 1).padStart(2, '0')}
                      </span>{' '}
                      / {String(quotes.length).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Smooth Cross-Fade Quote Area */}
                  <div className="relative my-6 sm:my-8 min-h-[160px] sm:min-h-[190px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeQuote.id}
                        initial={{ opacity: 0, scale: 0.995 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.995 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                      >
                        <Quote className="h-8 w-8 text-[var(--app-primary)] opacity-85 mb-3.5 sm:mb-4" />
                        <blockquote className="font-headline text-lg sm:text-xl lg:text-2xl font-normal leading-relaxed text-[var(--app-ink)]">
                          &ldquo;
                          {isQuoteLong
                            ? `${activeQuote.quote.slice(0, 240).trim()}…`
                            : activeQuote.quote}
                          &rdquo;
                        </blockquote>

                        {isQuoteLong && (
                          <button
                            type="button"
                            onClick={() => setModalTestimony(activeQuote)}
                            className="mt-4 inline-flex items-center gap-1.5 font-ui text-xs sm:text-sm font-semibold text-[var(--app-primary)] hover:underline"
                          >
                            <span>Read full testimony</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Card Bottom: Author Info & Circular Controls (NO BIG DOTS) */}
                <div className="relative mt-auto border-t border-[var(--app-border)]/70 pt-5 sm:pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)] font-ui text-xs sm:text-sm font-bold text-black shadow-md ring-2 ring-white/20">
                        {initialsOf(activeQuote.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-ui text-sm sm:text-base font-bold text-[var(--app-ink)]">
                          {activeQuote.name}
                        </p>
                        <p className="truncate font-ui text-xs text-[var(--app-subtle)]">
                          {activeQuote.role}
                        </p>
                      </div>
                    </div>

                    {/* Circular Navigation Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={prev}
                        aria-label="Previous testimony"
                        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-subtle)] transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] hover:shadow-sm"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        aria-label="Next testimony"
                        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-subtle)] transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] hover:shadow-sm"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right 5 Cols: Community Praise Reports Deck ── */}
            <div className="lg:col-span-5 flex flex-col justify-between min-w-0 lg:rounded-3xl lg:border lg:border-[var(--app-border)] lg:bg-[var(--app-canvas)] lg:p-6 sm:lg:p-7 xl:lg:p-8 lg:shadow-xl">
              <div className="flex flex-col h-full justify-between">
                <div>
                  {/* Deck Title Bar */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[var(--app-border)]/70">
                    <span className="font-ui text-xs font-bold uppercase tracking-wider text-[var(--app-subtle)]">
                      Community Praise Reports
                    </span>
                    <span className="font-ui text-xs text-[var(--app-primary)] font-semibold">
                      {quotes.length} Verified{' '}
                      {quotes.length === 1 ? 'Report' : 'Reports'}
                    </span>
                  </div>

                  {/* ── Desktop Deck: Scrollable & Proportionally Fitted ── */}
                  <div className="hidden lg:flex flex-col gap-3 max-h-[380px] xl:max-h-[410px] overflow-y-auto pr-1.5 scrollbar-thin">
                    {quotes.map((quote, idx) => {
                      const isActive = idx === current;
                      return (
                        <div
                          key={quote.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => goTo(idx, true)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              goTo(idx, true);
                            }
                          }}
                          className={cn(
                            'group relative block w-full rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer',
                            isActive
                              ? 'border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] shadow-sm ring-1 ring-[var(--app-primary)]/40 border-l-4 border-l-[var(--app-primary)]'
                              : 'border-[var(--app-border)] bg-[var(--app-canvas-2)]/60 hover:border-[var(--app-primary)]/40 hover:bg-[var(--app-canvas-2)]'
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={cn(
                                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-ui text-xs font-bold transition-colors',
                                  isActive
                                    ? 'bg-[var(--app-primary)] text-black font-extrabold shadow-sm'
                                    : 'bg-[var(--app-canvas-2)] text-[var(--app-subtle)] border border-[var(--app-border)]'
                                )}
                              >
                                {initialsOf(quote.name)}
                              </span>
                              <div className="min-w-0">
                                <p className="font-ui text-sm font-bold text-[var(--app-ink)] truncate">
                                  {quote.name}
                                </p>
                                <span className="font-ui text-[11px] text-[var(--app-primary)] font-semibold">
                                  {quote.category}
                                </span>
                              </div>
                            </div>

                            {isActive ? (
                              <span className="shrink-0 rounded-full bg-[var(--app-primary)]/20 px-2.5 py-0.5 text-[10px] font-bold text-[var(--app-primary)]">
                                In Spotlight
                              </span>
                            ) : (
                              <span className="shrink-0 font-ui text-xs font-semibold text-[var(--app-subtle)] group-hover:text-[var(--app-primary)] transition-colors">
                                View →
                              </span>
                            )}
                          </div>

                          <p className="mt-2.5 font-ui text-xs sm:text-sm text-[var(--app-subtle)] leading-relaxed line-clamp-2">
                            &ldquo;{quote.quote}&rdquo;
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Mobile & Tablet Deck: Horizontal Snap Slider ── */}
                  <div className="lg:hidden flex gap-3 overflow-x-auto pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x scrollbar-none">
                    {quotes.map((quote, idx) => {
                      const isActive = idx === current;
                      return (
                        <div
                          key={quote.id}
                          ref={isActive ? activeThumbRef : null}
                          role="button"
                          tabIndex={0}
                          onClick={() => goTo(idx, true)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              goTo(idx, true);
                            }
                          }}
                          className={cn(
                            'w-[270px] sm:w-[300px] shrink-0 snap-center rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer',
                            isActive
                              ? 'border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_8%,transparent)] shadow-sm ring-1 ring-[var(--app-primary)]/40 border-l-4 border-l-[var(--app-primary)]'
                              : 'border-[var(--app-border)] bg-[var(--app-canvas)] hover:border-[var(--app-primary)]/40'
                          )}
                        >
                          <div className="flex items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={cn(
                                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-ui text-xs font-bold',
                                  isActive
                                    ? 'bg-[var(--app-primary)] text-black'
                                    : 'bg-[var(--app-canvas-2)] text-[var(--app-subtle)] border border-[var(--app-border)]'
                                )}
                              >
                                {initialsOf(quote.name)}
                              </span>
                              <div className="min-w-0">
                                <p className="font-ui text-xs sm:text-sm font-bold text-[var(--app-ink)] truncate">
                                  {quote.name}
                                </p>
                                <span className="font-ui text-[10px] text-[var(--app-primary)] font-semibold">
                                  {quote.category}
                                </span>
                              </div>
                            </div>

                            {isActive && (
                              <span className="shrink-0 rounded-full bg-[var(--app-primary)]/20 px-2 py-0.5 text-[9px] font-bold text-[var(--app-primary)]">
                                Active
                              </span>
                            )}
                          </div>

                          <p className="mt-2 font-ui text-xs text-[var(--app-subtle)] leading-relaxed line-clamp-2">
                            &ldquo;{quote.quote}&rdquo;
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Quick Action Note */}
                <div className="mt-4 sm:mt-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-solid)]/40 p-3.5 sm:p-4 text-center">
                  <p className="font-ui text-xs text-[var(--app-subtle)] leading-relaxed">
                    Have an answered prayer to declare?{' '}
                    <Link
                      href="/forms/share-testimony"
                      className="font-bold text-[var(--app-primary)] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Submit your testimony</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Read Full Testimony Modal */}
      <TestimonialModal
        testimony={modalTestimony}
        isOpen={Boolean(modalTestimony)}
        onClose={() => setModalTestimony(null)}
      />
    </>
  );
}
