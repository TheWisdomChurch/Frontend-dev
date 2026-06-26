'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from '@/lib/safe-motion';

import { Container, Section } from '@/shared/layout';
import apiClient from '@/lib/api';
import type { Testimonial as ApiTestimonial } from '@/lib/apiTypes';

type Quote = { id: string | number; text: string; name: string; role: string };

const FALLBACK_QUOTES: Quote[] = [
  {
    id: 'f1',
    text: 'This church gave me a family and a purpose. I came lost and found my assignment here.',
    name: 'Sarah O.',
    role: 'Member since 2021',
  },
  {
    id: 'f2',
    text: 'The Word taught here changed the way I see myself. I walked in broken and left whole.',
    name: 'Emmanuel A.',
    role: 'Wisdom House family',
  },
  {
    id: 'f3',
    text: "My marriage was restored here. God's Word became practical and powerful in my home.",
    name: 'Mr & Mrs Bello',
    role: 'Wisdom House family',
  },
];

function mapToQuote(t: ApiTestimonial): Quote {
  const name =
    t.fullName ||
    [t.firstName, t.lastName].filter(Boolean).join(' ').trim() ||
    'Anonymous';
  return {
    id: t.id,
    text: t.testimony,
    name: t.isAnonymous ? 'Anonymous' : name,
    role: t.isAnonymous ? 'Shared anonymously' : 'Wisdom House family',
  };
}

const AUTO_ADVANCE_MS = 6000;

export default function HomeTestimonials() {
  const [quotes, setQuotes] = useState<Quote[]>(FALLBACK_QUOTES);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;
    const t = window.setTimeout(async () => {
      try {
        const data = await apiClient.listApprovedTestimonials?.();
        const arr: ApiTestimonial[] = Array.isArray(data) ? data : [];
        if (mounted && arr.length > 0) {
          setQuotes(arr.slice(0, 8).map(mapToQuote));
        }
      } catch {
        // keep fallback
      }
    }, 1200);
    return () => {
      mounted = false;
      window.clearTimeout(t);
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
      <Container size="xl" className="py-section-md">
        <div
          className="mx-auto max-w-[760px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Eyebrow */}
          <p className="mb-10 text-center text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Testimonies
          </p>

          {/* Quote area */}
          <div className="relative min-h-[220px]">
            {/* Decorative " */}
            <span
              className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 select-none font-headline text-[10rem] leading-none text-[var(--app-primary)] opacity-[0.07]"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            <AnimatePresence mode="wait">
              {q ? (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.36 }}
                  className="relative text-center"
                >
                  <blockquote
                    className="font-headline font-normal italic leading-[1.55] text-[var(--app-ink)]"
                    style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)' }}
                  >
                    &ldquo;{q.text}&rdquo;
                  </blockquote>

                  <div className="mt-7 flex items-center justify-center gap-3">
                    <span className="block h-[1.5px] w-8 bg-[var(--app-ink)]/20" />
                    <div className="text-center">
                      <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[var(--app-ink)]">
                        {q.name}
                      </p>
                      <p className="mt-0.5 text-[0.7rem] text-[var(--app-ink)]/45">
                        {q.role}
                      </p>
                    </div>
                    <span className="block h-[1.5px] w-8 bg-[var(--app-ink)]/20" />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--app-ink)]/15 text-[var(--app-ink)]/40 transition hover:border-[var(--app-ink)]/30 hover:text-[var(--app-ink)]/80"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? '20px' : '6px',
                    backgroundColor:
                      i === current ? 'var(--app-primary)' : 'var(--app-ink)',
                    opacity: i === current ? 1 : 0.18,
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--app-ink)]/15 text-[var(--app-ink)]/40 transition hover:border-[var(--app-ink)]/30 hover:text-[var(--app-ink)]/80"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Share link */}
          <div className="mt-8 text-center">
            <Link
              href="/forms/share-testimony"
              className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-[var(--app-primary)] transition hover:gap-2.5"
            >
              Share your story →
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
