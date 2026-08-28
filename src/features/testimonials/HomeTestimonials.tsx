'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  EditorialContainer,
  EditorialEmptyState,
  EditorialHeader,
  EditorialSection,
  editorialActionClass,
} from '@/shared/ui/editorial';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion';
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
          ? 'border-[color-mix(in_srgb,var(--app-primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)]'
          : 'border-[color-mix(in_srgb,var(--app-ink)_10%,transparent)] bg-[color-mix(in_srgb,var(--app-ink)_2%,transparent)] hover:border-[color-mix(in_srgb,var(--app-ink)_20%,transparent)] hover:bg-[color-mix(in_srgb,var(--app-ink)_4%,transparent)]'
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
              : 'bg-[color-mix(in_srgb,var(--app-ink)_10%,transparent)] text-[color-mix(in_srgb,var(--app-ink)_55%,transparent)]'
          }`}
        >
          {initialsOf(quote.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-ui text-sm leading-6 text-[color-mix(in_srgb,var(--app-ink)_70%,transparent)]">
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
                  : 'text-[color-mix(in_srgb,var(--app-ink)_35%,transparent)] group-hover:translate-x-1 group-hover:text-[color-mix(in_srgb,var(--app-ink)_60%,transparent)]'
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
    <EditorialSection tone="muted">
      <EditorialContainer>
        <div
          className="grid gap-8 md:gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-6 xl:gap-x-20"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Intro column */}
          <EditorialHeader
            eyebrow="Testimonies"
            title="Real stories,"
            accent="real breakthroughs."
            description="Hear how God is moving through worship, healing, and everyday faithfulness in the Wisdom Church community."
            className="max-w-xl lg:sticky lg:top-28 lg:col-start-1 lg:row-start-1"
          />

          {/* Testimony content */}
          {loading ? (
            <div
              className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px] lg:col-start-2 lg:row-start-1 lg:row-span-2"
              aria-hidden="true"
            >
              <div className="min-h-[340px] animate-pulse border border-[color-mix(in_srgb,var(--app-ink)_10%,transparent)] bg-[color-mix(in_srgb,var(--app-ink)_3%,transparent)]" />
              <div className="hidden flex-col gap-3 md:flex">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="h-24 animate-pulse border border-[color-mix(in_srgb,var(--app-ink)_10%,transparent)] bg-[color-mix(in_srgb,var(--app-ink)_3%,transparent)]"
                  />
                ))}
              </div>
            </div>
          ) : !q ? (
            <EditorialEmptyState
              title="Testimonies coming soon."
              description="Be the first to share your story."
              className="lg:col-start-2 lg:row-start-1 lg:row-span-2"
              action={
                <Link
                  href="/forms/share-testimony"
                  className={editorialActionClass.primary}
                >
                  Share your story <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px] lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <article className="relative flex min-h-[340px] flex-col overflow-hidden border border-[color-mix(in_srgb,var(--app-ink)_10%,transparent)] bg-white p-6 sm:p-8">
                <span
                  className="pointer-events-none absolute -right-2 -top-10 select-none font-headline text-[9rem] leading-none text-[var(--app-primary)] opacity-[0.08]"
                  aria-hidden="true"
                >
                  &rdquo;
                </span>

                {/* flex-1 + justify-center: a short quote centers in the
                    available space instead of pinning to the top and
                    leaving a dead gap above the footer. */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={q.id}
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
                    className="relative flex flex-1 flex-col justify-center"
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

                <div className="relative mt-8 flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--app-ink)_10%,transparent)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--app-primary)_15%,transparent)] font-ui text-sm font-bold text-[var(--app-primary)] ring-1 ring-[color-mix(in_srgb,var(--app-primary)_25%,transparent)]">
                      {initialsOf(q.name)}
                    </span>
                    <div>
                      <p className="font-ui text-sm font-semibold text-[var(--app-ink)]">
                        {q.name}
                      </p>
                      <p className="mt-0.5 font-ui text-xs text-[color-mix(in_srgb,var(--app-ink)_45%,transparent)]">
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
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--app-ink)_10%,transparent)] text-[color-mix(in_srgb,var(--app-ink)_55%,transparent)] transition hover:border-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] hover:text-[var(--app-primary)]"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={next}
                          aria-label="Next testimony"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--app-ink)_10%,transparent)] text-[color-mix(in_srgb,var(--app-ink)_55%,transparent)] transition hover:border-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] hover:text-[var(--app-primary)]"
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

          {q ? (
            <motion.div
              variants={staggerItem}
              initial="hidden"
              whileInView="show"
              viewport={staggerViewport}
              className="flex flex-wrap items-center gap-3 lg:col-start-1 lg:row-start-2 lg:self-end"
            >
              <Link
                href="/forms/share-testimony"
                className="inline-flex h-11 items-center gap-2 rounded-button border border-[color-mix(in_srgb,var(--app-ink)_15%,transparent)] px-5 font-ui text-xs font-bold text-[color-mix(in_srgb,var(--app-ink)_65%,transparent)] transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
              >
                Share your story
              </Link>
              <Link
                href="/testimonies"
                className="inline-flex h-11 items-center gap-2 px-3 font-ui text-xs font-bold text-[color-mix(in_srgb,var(--app-ink)_50%,transparent)] transition hover:text-[var(--app-ink)]"
              >
                View all stories <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ) : null}
        </div>
      </EditorialContainer>
    </EditorialSection>
  );
}
