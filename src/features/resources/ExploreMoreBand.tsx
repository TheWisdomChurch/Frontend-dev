'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { Container, Section, SectionHeader } from '@/shared/ui/layout';
import { cn } from '@/lib/cn';

const RESOURCES = [
  {
    id: 'res-media',
    title: 'Sermons & Messages',
    label: 'Media',
    desc: 'Watch, listen, and grow with life-transforming messages straight from the pulpit.',
    href: '/resources/sermons',
    cta: 'Browse sermons',
    icon: BookOpen,
  },
  {
    id: 'res-care',
    title: 'Pastoral Care & Prayer',
    label: 'Care',
    desc: 'Connect with shepherds ready to stand in faith with you and provide pastoral guidance.',
    href: '/pastoral',
    cta: 'Request care',
    icon: Heart,
  },
  {
    id: 'res-store',
    title: 'Wisdom Store & Materials',
    label: 'Store',
    desc: 'Equip your daily walk with books, devotional materials, and church resources.',
    href: '/resources/store',
    cta: 'Visit store',
    icon: ShoppingBag,
  },
  {
    id: 'res-community',
    title: 'Ministries & Workforce',
    label: 'Community',
    desc: 'Discover your divine gifts and find an active community where you can serve.',
    href: '/ministries',
    cta: 'Explore ministries',
    icon: Users,
  },
];

interface ExploreMoreBandProps {
  tone?: 'canvas' | 'dark' | 'brand';
  className?: string;
}

export function ExploreMoreBand({
  tone = 'canvas',
  className,
}: ExploreMoreBandProps) {
  const isDark = tone === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(
      '[data-tracker-card]'
    );
    const targetCard = cards[index];
    if (targetCard) {
      const containerWidth = container.offsetWidth;
      const cardWidth = targetCard.offsetWidth;
      const cardLeft = targetCard.offsetLeft;
      const targetScroll = cardLeft - containerWidth / 2 + cardWidth / 2;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
    setActiveIndex(index);
  }, []);

  const scrollStep = (direction: 'left' | 'right') => {
    const nextIndex =
      direction === 'left'
        ? Math.max(0, activeIndex - 1)
        : Math.min(RESOURCES.length - 1, activeIndex + 1);
    scrollToIndex(nextIndex);
  };

  // Automated slider tracker effect: advances smoothly every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % RESOURCES.length;
        scrollToIndex(next);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, scrollToIndex]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(
      '[data-tracker-card]'
    );
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    setActiveIndex(closestIndex);
  };

  return (
    <Section
      tone={tone}
      className={cn('relative overflow-hidden py-18 sm:py-24', className)}
    >
      <Container>
        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Connect & Grow"
            title="You can do"
            accent="more."
            description="Explore our ministries, teachings, and care networks designed to nurture your walk with God."
            tone={isDark ? 'dark' : undefined}
          />

          <Link
            href="/resources"
            className={cn(
              'group hidden min-h-[44px] items-center gap-2 rounded-full border px-5 py-2 font-ui text-body-sm font-semibold shadow-sm transition sm:inline-flex',
              isDark
                ? 'border-white/15 bg-white/5 text-white hover:border-[var(--app-primary)] hover:text-[var(--app-primary-light)]'
                : 'border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)]'
            )}
          >
            <span>All resources</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ── Tracker Shell with Interactive Slider ─────────────────── */}
        <div className="mt-10 sm:mt-12">
          <div
            className={cn(
              'relative rounded-3xl border p-4 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-xl',
              isDark
                ? 'border-white/10 bg-[var(--app-dark-2)]/95'
                : 'border-[var(--app-border)] bg-[var(--app-surface)]/95'
            )}
          >
            {/* Ambient gold glow behind tracker */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_srgb,var(--app-primary)_20%,transparent)_0%,transparent_70%)]"
            />

            {/* Slider Top Bar: Header label + navigation arrow controls */}
            <div
              className={cn(
                'mb-4 flex items-center justify-between border-b pb-3 sm:mb-5 sm:pb-4',
                isDark ? 'border-white/10' : 'border-[var(--app-border)]'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--app-primary)]" />
                <span
                  className={cn(
                    'font-ui text-caption font-bold uppercase tracking-wider',
                    isDark
                      ? 'text-[var(--app-primary-light)]'
                      : 'text-[var(--app-primary-dark)]'
                  )}
                >
                  Resource Pathways
                </span>
                <span
                  className={cn(
                    'hidden sm:inline-block font-ui text-caption',
                    isDark ? 'text-white/30' : 'text-[var(--app-muted)]'
                  )}
                >
                  ·
                </span>
                <span
                  className={cn(
                    'hidden sm:inline-block font-ui text-caption font-medium',
                    isDark ? 'text-white/60' : 'text-[var(--app-subtle)]'
                  )}
                >
                  Step {activeIndex + 1} of {RESOURCES.length}
                </span>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => scrollStep('left')}
                  disabled={activeIndex === 0}
                  aria-label="Previous resource"
                  className={cn(
                    'flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all disabled:pointer-events-none disabled:opacity-25',
                    isDark
                      ? 'border-white/15 bg-white/5 text-white/80 hover:border-[var(--app-primary)]/50 hover:bg-white/10 hover:text-white'
                      : 'border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-text)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)]'
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollStep('right')}
                  disabled={activeIndex === RESOURCES.length - 1}
                  aria-label="Next resource"
                  className={cn(
                    'flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all disabled:pointer-events-none disabled:opacity-25',
                    isDark
                      ? 'border-white/15 bg-white/5 text-white/80 hover:border-[var(--app-primary)]/50 hover:bg-white/10 hover:text-white'
                      : 'border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-text)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)]'
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable / Slidable Track */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="flex gap-4 sm:gap-5 overflow-x-auto px-1 py-2 sm:py-3 scroll-smooth snap-x snap-mandatory no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {RESOURCES.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeIndex === idx;

                return (
                  <Link
                    key={item.id}
                    data-tracker-card
                    href={item.href}
                    onClick={() => scrollToIndex(idx)}
                    className={cn(
                      'group relative flex w-[84vw] max-w-[340px] shrink-0 snap-start flex-col justify-between rounded-2xl border p-5 sm:p-6 text-left transition-all duration-300 sm:w-[320px] lg:w-[calc(25%-0.95rem)] min-h-[220px]',
                      isDark
                        ? isActive
                          ? 'border-[var(--app-primary)] bg-gradient-to-b from-white/[0.14] via-white/[0.06] to-[var(--app-primary)]/15 shadow-2xl shadow-black/80 ring-1 ring-[var(--app-primary)]/60 scale-100 opacity-100 z-10'
                          : 'border-white/10 bg-white/[0.04] shadow-md scale-[0.98] opacity-85 hover:opacity-100 hover:scale-100 hover:border-[var(--app-primary)]/40 hover:bg-white/[0.08]'
                        : isActive
                          ? 'border-[var(--app-primary)] bg-gradient-to-b from-[var(--app-primary-10)] via-[var(--app-surface)] to-[var(--app-primary-10)] shadow-xl ring-1 ring-[var(--app-primary)]/50 scale-100 opacity-100 z-10'
                          : 'border-[var(--app-border)] bg-[var(--app-canvas)] shadow-xs scale-[0.98] opacity-90 hover:opacity-100 hover:scale-100 hover:border-[var(--app-primary)]/60 hover:bg-[var(--app-surface)]'
                    )}
                  >
                    {/* Top Row: Icon badge + top-right arrow */}
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300',
                          isDark
                            ? isActive
                              ? 'border-[var(--app-primary)]/70 bg-[var(--app-primary)]/20 text-[var(--app-primary-light)] shadow-[0_0_12px_color-mix(in_srgb,var(--app-primary)_30%,transparent)]'
                              : 'border-white/10 bg-[var(--app-dark)] text-white/80 group-hover:border-[var(--app-primary)]/50 group-hover:bg-[var(--app-primary)]/15 group-hover:text-[var(--app-primary-light)]'
                            : isActive
                              ? 'border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_20%,transparent)] text-[var(--app-primary-dark)] shadow-sm'
                              : 'border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)] group-hover:border-[var(--app-primary)] group-hover:text-[var(--app-primary-dark)]'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                          isDark
                            ? isActive
                              ? 'text-[var(--app-primary-light)]'
                              : 'text-white/40 group-hover:text-[var(--app-primary-light)]'
                            : isActive
                              ? 'text-[var(--app-primary-dark)]'
                              : 'text-[var(--app-subtle)] group-hover:text-[var(--app-primary-dark)]'
                        )}
                      >
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="mt-4 space-y-1.5 flex-1">
                      <span
                        className={cn(
                          'inline-block font-ui text-[11px] font-bold uppercase tracking-wider',
                          isDark
                            ? 'text-[var(--app-primary-light)]'
                            : 'text-[var(--app-primary-dark)]'
                        )}
                      >
                        {item.label}
                      </span>
                      <h3
                        className={cn(
                          'font-headline text-heading-sm font-semibold tracking-tight transition-colors',
                          isDark
                            ? 'text-white group-hover:text-[var(--app-primary-light)]'
                            : 'text-[var(--app-text)] group-hover:text-[var(--app-primary-dark)]'
                        )}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={cn(
                          'font-ui text-caption leading-relaxed line-clamp-2',
                          isDark ? 'text-white/75' : 'text-[var(--app-muted)]'
                        )}
                      >
                        {item.desc}
                      </p>
                    </div>

                    {/* Bottom: Action pill with animated arrow */}
                    <div
                      className={cn(
                        'mt-4 border-t pt-3 flex items-center justify-between',
                        isDark
                          ? 'border-white/10'
                          : 'border-[var(--app-border)]'
                      )}
                    >
                      <span
                        className={cn(
                          'font-ui text-caption font-bold transition-all duration-200 group-hover:translate-x-0.5',
                          isDark
                            ? 'text-[var(--app-primary-light)]'
                            : 'text-[var(--app-primary-dark)]'
                        )}
                      >
                        {item.cta}
                      </span>
                      <ArrowRight
                        className={cn(
                          'h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5',
                          isDark
                            ? 'text-[var(--app-primary-light)]'
                            : 'text-[var(--app-primary-dark)]'
                        )}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
