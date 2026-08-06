'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { AnimatePresence, motion } from '@/lib/safe-motion';

import { Container, Section } from '@/shared/layout';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion/staggerReveal';
import apiClient from '@/lib/api';
import type { Testimonial as ApiTestimonial } from '@/lib/apiTypes';

type TestimonyQuote = {
  id: string | number;
  text: string;
  name: string;
  role: string;
};

function mapToQuote(t: ApiTestimonial): TestimonyQuote {
  const name =
    t.fullName ||
    [t.firstName, t.lastName].filter(Boolean).join(' ').trim() ||
    'Anonymous';
  return {
    id: t.id,
    text: t.testimony,
    name: t.isAnonymous ? 'Anonymous' : name,
    role: t.isAnonymous ? 'Shared anonymously' : 'Wisdom Church community',
  };
}

function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase() || '—';
}

const AUTO_ADVANCE_MS = 7000;

function TestimonyThumb({
  quote,
  active,
  onClick,
}: {
  quote: TestimonyQuote;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full overflow-hidden border p-4 text-left transition-all duration-300 ${
        active
          ? 'border-[var(--app-primary)]/45 bg-[var(--app-primary)]/10'
          : 'border-[var(--app-ink)]/10 bg-[var(--app-ink)]/[0.02] hover:border-[var(--app-ink)]/20 hover:bg-[var(--app-ink)]/[0.04]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-[2px] bg-[var(--app-primary)] transition-transform duration-300 ${
          active ? 'scale-y-100' : 'scale-y-0'
        }`}
      />
      <div className="flex items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-ui text-[11px] font-bold transition-colors duration-300 ${
            active
              ? 'bg-[var(--app-primary)] text-black'
              : 'bg-[var(--app-ink)]/10 text-[var(--app-ink)]/55'
          }`}
        >
          {initialsOf(quote.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-ui text-sm leading-6 text-[var(--app-ink)]/70">
            {quote.text}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="truncate font-ui text-sm font-semibold text-[var(--app-ink)]">
              {quote.name}
            </span>
            <ArrowRight
              className={`h-4 w-4 shrink-0 transition ${
                active
                  ? 'text-[var(--app-primary)]'
                  : 'text-[var(--app-ink)]/35 group-hover:translate-x-1 group-hover:text-[var(--app-ink)]/60'
              }`}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

export default function HomeTestimonials() {
  const [quotes, setQuotes] = useState<TestimonyQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadTestimonials = async () => {
      try {
        const data = await apiClient.listApprovedTestimonials();
        const arr: ApiTestimonial[] = Array.isArray(data) ? data : [];
        if (mounted) {
          setQuotes(arr.slice(0, 8).map(mapToQuote));
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    };
    void loadTestimonials();
    return () => {
      mounted = false;
    };
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setCurrent((i + quotes.length) % quotes.length);
    },
    [quotes.length]
  );

  const prev = useCallback(() => goTo(current - 1), [goTo, current]);
  const next = useCallback(() => goTo(current + 1), [goTo, current]);

  // Auto advance
  useEffect(() => {
    if (isPaused || quotes.length <= 1) return;
    timerRef.current = setInterval(() => goTo(current + 1), AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, isPaused, goTo, quotes.length]);

  const q = quotes[current];

  return (
    <Section padding="none" className="bg-[var(--app-canvas-2)]">
      <Container size="2xl" className="py-16 sm:py-20 lg:py-24">
        <div
          className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Intro column */}
          <div data-gsap="reveal" className="max-w-xl lg:sticky lg:top-28">
            <p className="font-ui text-xs font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Testimonies
            </p>
            <h2
              className="mt-5 font-sans font-black uppercase leading-[0.92] tracking-[-0.045em] text-[var(--app-ink)]"
              // eslint-disable-next-line no-restricted-syntax
              style={{ fontSize: 'var(--type-display-md)' }}
            >
              Real stories,
              <br />
              <span className="text-[var(--app-primary)]">real</span>{' '}
              breakthroughs.
            </h2>

            <p className="mt-8 max-w-md font-ui text-base leading-7 text-[var(--app-ink)]/60">
              Hear how God is moving through worship, healing, and everyday
              faithfulness in the Wisdom Church community.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/forms/share-testimony"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--app-ink)]/15 px-5 font-ui text-xs font-bold text-[var(--app-ink)]/65 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
              >
                Share your story
              </Link>
              <Link
                href="/testimonies"
                className="inline-flex h-11 items-center gap-2 px-3 font-ui text-xs font-bold text-[var(--app-ink)]/50 transition hover:text-[var(--app-ink)]"
              >
                View all stories <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Testimony content */}
          {loading ? (
            <div
              className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px]"
              aria-hidden="true"
            >
              <div className="min-h-[340px] animate-pulse border border-[var(--app-ink)]/10 bg-[var(--app-ink)]/[0.03]" />
              <div className="hidden flex-col gap-3 md:flex">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="h-24 animate-pulse border border-[var(--app-ink)]/10 bg-[var(--app-ink)]/[0.03]"
                  />
                ))}
              </div>
            </div>
          ) : !q ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center gap-3 border border-[var(--app-ink)]/10 px-6 text-center">
              <p
                className="font-headline font-normal italic text-[var(--app-ink)]/70"
                // eslint-disable-next-line no-restricted-syntax
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}
              >
                Testimonies coming soon.
              </p>
              <p className="font-ui text-sm text-[var(--app-ink)]/50">
                Be the first to share your story.
              </p>
              <Link
                href="/forms/share-testimony"
                className="mt-2 inline-flex h-11 items-center gap-2 bg-[var(--app-primary)] px-6 font-ui text-xs font-bold uppercase tracking-[0.1em] text-black transition hover:bg-[var(--app-primary-light)]"
              >
                Share your story
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px]">
              <article className="relative flex min-h-[340px] flex-col justify-between overflow-hidden border border-[var(--app-ink)]/10 bg-white p-6 sm:p-8">
                <span
                  className="pointer-events-none absolute -right-2 -top-10 select-none font-headline text-[9rem] leading-none text-[var(--app-primary)] opacity-[0.08]"
                  aria-hidden="true"
                >
                  &rdquo;
                </span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={q.id}
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
                    className="relative"
                  >
                    <motion.div variants={staggerItem}>
                      <Quote className="h-7 w-7 text-[var(--app-primary)]" />
                    </motion.div>
                    <motion.blockquote
                      variants={staggerItem}
                      className="mt-6 line-clamp-5 font-headline text-xl font-normal italic leading-[1.5] text-[var(--app-ink)] sm:text-2xl"
                    >
                      &ldquo;{q.text}&rdquo;
                    </motion.blockquote>
                  </motion.div>
                </AnimatePresence>

                <div className="relative mt-8 flex flex-col gap-4 border-t border-[var(--app-ink)]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)]/15 font-ui text-sm font-bold text-[var(--app-primary)] ring-1 ring-[var(--app-primary)]/25">
                      {initialsOf(q.name)}
                    </span>
                    <div>
                      <p className="font-ui text-sm font-semibold text-[var(--app-ink)]">
                        {q.name}
                      </p>
                      <p className="mt-0.5 font-ui text-xs text-[var(--app-ink)]/45">
                        {q.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {quotes.length > 1 && (
                      <div className="hidden items-center gap-1.5 sm:flex">
                        {quotes.map((quote, i) => (
                          <span
                            key={quote.id}
                            className="h-1.5 rounded-full transition-all duration-300"
                            // eslint-disable-next-line no-restricted-syntax
                            style={{
                              width: i === current ? '20px' : '6px',
                              backgroundColor:
                                i === current
                                  ? 'var(--app-primary)'
                                  : 'var(--app-ink)',
                              opacity: i === current ? 1 : 0.18,
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {quotes.length > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={prev}
                          aria-label="Previous testimony"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--app-ink)]/10 text-[var(--app-ink)]/55 transition hover:border-[var(--app-primary)]/40 hover:text-[var(--app-primary)]"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={next}
                          aria-label="Next testimony"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--app-ink)]/10 text-[var(--app-ink)]/55 transition hover:border-[var(--app-primary)]/40 hover:text-[var(--app-primary)]"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>

              {quotes.length > 1 && (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={staggerViewport}
                  className="flex gap-2 overflow-x-auto pb-1 md:max-h-[340px] md:flex-col md:overflow-y-auto md:overflow-x-hidden"
                >
                  {quotes.map((quote, i) => (
                    <motion.div
                      key={quote.id}
                      variants={staggerItem}
                      className="min-w-[220px] md:min-w-0"
                    >
                      <TestimonyThumb
                        quote={quote}
                        active={i === current}
                        onClick={() => goTo(i)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
