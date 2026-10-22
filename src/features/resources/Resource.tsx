'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  Loader2,
  PlayCircle,
  ShoppingBag,
  Users,
} from 'lucide-react';

import { WhatWeDo_3, Deacon_1, wisdomShirt_1 } from '@/shared/assets';
import type { YouTubeVideo } from '@/domain/media/types';
import { mediaApi } from '@/domain/media/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { Media } from '@/shared/ui/Media';
import { Container, Section, SectionHeader } from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';
import { decodeHtmlEntities } from '@/shared/utils/functionUtils/decodeHtmlEntities';
import { cleanSermonTitle } from '@/shared/utils/functionUtils/cleanSermonTitle';

const fetchLatestSermons = (signal: AbortSignal) =>
  mediaApi.listSermons({ sort: 'newest', limit: 1, signal });

const ALL_RESOURCES = [
  {
    title: 'Sermons',
    label: 'Messages',
    desc: 'Watch and listen to messages straight from the church.',
    href: '/resources/sermons',
    cta: 'Browse sermons',
    img: WhatWeDo_3,
    icon: BookOpen,
  },
  {
    title: 'Pastoral Care',
    label: 'Support',
    desc: 'Reach out for prayer, counselling, and pastoral guidance.',
    href: '/pastoral',
    cta: 'Request care',
    img: Deacon_1,
    icon: Heart,
  },
  {
    title: 'Store',
    label: 'Resources',
    desc: 'Books, materials, and resources to deepen your faith.',
    href: '/resources/store',
    cta: 'Visit store',
    img: wisdomShirt_1,
    icon: ShoppingBag,
  },
  {
    title: 'Ministries',
    label: 'Departments',
    desc: 'Find your place in one of our active church ministries.',
    href: '/ministries',
    cta: 'Explore ministries',
    img: WhatWeDo_3,
    icon: Users,
  },
];

/* ── Resource Carousel component with Tracker Animation ── */

function ResourceCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>('[data-res-card]');
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
        : Math.min(ALL_RESOURCES.length - 1, activeIndex + 1);
    scrollToIndex(nextIndex);
  };

  // Automated tracker animation: auto-advances smoothly every 4s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % ALL_RESOURCES.length;
        scrollToIndex(next);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, scrollToIndex]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>('[data-res-card]');
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
    <div className="relative">
      {/* Tracker Shell */}
      <div className="relative rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)]/95 p-4 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-xl">
        {/* Ambient gold glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_srgb,var(--app-primary)_20%,transparent)_0%,transparent_70%)]"
        />

        {/* Header & Controls Bar */}
        <div className="mb-4 flex items-center justify-between border-b border-[var(--app-border)] pb-3 sm:mb-5 sm:pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--app-primary)]" />
            <span className="font-ui text-caption font-bold uppercase tracking-wider text-[var(--app-primary-dark)]">
              Explore Track
            </span>
            <span className="hidden sm:inline-block font-ui text-caption text-[var(--app-muted)]">
              ·
            </span>
            <span className="hidden sm:inline-block font-ui text-caption font-medium text-[var(--app-subtle)]">
              Pathway {activeIndex + 1} of {ALL_RESOURCES.length}
            </span>
          </div>

          {/* Navigation arrow controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => scrollStep('left')}
              disabled={activeIndex === 0}
              aria-label="Previous resource"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-text)] transition-all hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)] disabled:pointer-events-none disabled:opacity-25"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollStep('right')}
              disabled={activeIndex === ALL_RESOURCES.length - 1}
              aria-label="Next resource"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-text)] transition-all hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)] disabled:pointer-events-none disabled:opacity-25"
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
          {ALL_RESOURCES.map((item, i) => {
            const Icon = item.icon;
            const isActive = activeIndex === i;

            return (
              <Link
                key={item.title}
                data-res-card
                href={item.href}
                onClick={() => scrollToIndex(i)}
                className={cn(
                  'group relative flex w-[84vw] max-w-[340px] shrink-0 snap-start flex-col justify-between rounded-2xl border p-5 sm:p-6 text-left transition-all duration-300 sm:w-[320px] lg:w-[calc(25%-0.95rem)] min-h-[220px]',
                  isActive
                    ? 'border-[var(--app-primary)] bg-gradient-to-b from-[var(--app-primary-10)] via-[var(--app-surface)] to-[var(--app-primary-10)] shadow-xl ring-1 ring-[var(--app-primary)]/50 scale-100 opacity-100 z-10'
                    : 'border-[var(--app-border)] bg-[var(--app-canvas)] shadow-xs scale-[0.98] opacity-90 hover:opacity-100 hover:scale-100 hover:border-[var(--app-primary)]/60 hover:bg-[var(--app-surface)]'
                )}
              >
                {/* Top Row: Icon badge + top-right arrow */}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300',
                      isActive
                        ? 'border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_20%,transparent)] text-[var(--app-primary-dark)] shadow-sm'
                        : 'border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)] group-hover:border-[var(--app-primary)] group-hover:text-[var(--app-primary-dark)]'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                      isActive
                        ? 'text-[var(--app-primary-dark)]'
                        : 'text-[var(--app-subtle)] group-hover:text-[var(--app-primary-dark)]'
                    )}
                  >
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                {/* Middle: Title & Description */}
                <div className="mt-4 space-y-1.5 flex-1">
                  <span className="inline-block font-ui text-[11px] font-bold uppercase tracking-wider text-[var(--app-primary-dark)]">
                    {item.label}
                  </span>
                  <h3 className="font-headline text-heading-sm font-semibold tracking-tight text-[var(--app-text)] transition-colors group-hover:text-[var(--app-primary-dark)]">
                    {item.title}
                  </h3>
                  <p className="font-ui text-caption leading-relaxed text-[var(--app-muted)] line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom: Action pill with animated arrow */}
                <div className="mt-4 border-t border-[var(--app-border)] pt-3 flex items-center justify-between">
                  <span className="font-ui text-caption font-bold text-[var(--app-primary-dark)] transition-all duration-200 group-hover:translate-x-0.5">
                    {item.cta}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[var(--app-primary-dark)] transition-transform duration-200 group-hover:translate-x-1.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ResourceSection() {
  const [shouldFetch, setShouldFetch] = useState(false);

  const sermonsQuery = useApiQuery<YouTubeVideo[]>(fetchLatestSermons, {
    enabled: shouldFetch,
  });
  const recentVideo = sermonsQuery.data?.[0] ?? null;
  const recentVideoTitle = recentVideo
    ? cleanSermonTitle(decodeHtmlEntities(recentVideo.title))
    : '';
  const loading = !shouldFetch || sermonsQuery.isLoading;
  const sectionRef = useRef<HTMLElement | null>(null);

  // Lazy-load only when in viewport
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setShouldFetch(true), 1600);
    return () => window.clearTimeout(t);
  }, []);

  const thumb =
    recentVideo?.thumbnail || recentVideo?.thumbnails?.medium?.url || null;
  const videoUrl = recentVideo?.id
    ? `https://www.youtube.com/watch?v=${recentVideo.id}`
    : null;

  return (
    <Section ref={sectionRef} id="resources" tone="surface" flush>
      <div className="relative overflow-hidden bg-[var(--app-dark)]">
        <Container className="relative py-section-sm">
          <div className="grid items-center gap-10 sm:gap-12 md:gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 xl:gap-20">
            <div className="contents lg:block lg:min-w-0">
              <div className="order-1 min-w-0 lg:order-none">
                <SectionHeader
                  eyebrow="Latest Message"
                  title="Hear the"
                  accent="Word."
                  tone="dark"
                />

                <div className="mt-8 flex flex-wrap gap-2.5">
                  <span className="rounded-badge border border-[var(--app-border)] bg-white/[0.045] px-4 py-2 font-ui text-label font-semibold text-[var(--app-muted)]">
                    {SERVICE_INFO.sunday.day}s · {SERVICE_INFO.sunday.time}
                  </span>
                  <span className="rounded-badge border border-[var(--app-border)] bg-white/[0.045] px-4 py-2 font-ui text-label font-semibold text-[var(--app-muted)]">
                    {SERVICE_INFO.dailyPrayer.label} ·{' '}
                    {SERVICE_INFO.dailyPrayer.time}
                  </span>
                </div>

                <div className="mt-10 min-h-28 border-l border-[color-mix(in_srgb,var(--app-primary)_60%,transparent)] pl-6">
                  {loading ? (
                    <div
                      className="space-y-4"
                      aria-label="Loading latest message"
                    >
                      <div className="h-7 w-4/5 animate-pulse rounded bg-white/10" />
                      <div className="h-4 w-2/5 animate-pulse rounded bg-white/[0.06]" />
                    </div>
                  ) : recentVideo ? (
                    <>
                      <h3 className="line-clamp-3 font-headline text-heading-lg font-semibold leading-tight !text-white">
                        {recentVideoTitle}
                      </h3>
                      <p className="mt-3 font-ui text-body-sm text-[var(--app-subtle)]">
                        The Wisdom Church
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-headline text-heading-md font-semibold !text-white">
                        Message coming soon
                      </h3>
                      <p className="mt-3 max-w-md font-ui text-body-sm leading-7 text-[var(--app-subtle)]">
                        Our latest teaching will appear here as soon as it is
                        published.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="order-3 lg:order-none lg:mt-9">
                <Link
                  href="/resources/sermons"
                  className={buttonClass('primary', 'md')}
                >
                  Explore sermons <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div
              data-gsap="reveal"
              className="order-2 relative aspect-video w-full overflow-hidden rounded-image border border-[var(--app-border)] bg-white/[0.035] shadow-2xl shadow-black/30 lg:order-none"
            >
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-7 w-7 animate-spin text-[var(--app-primary)]" />
                  <p className="font-ui text-label text-[var(--app-subtle)]">
                    Preparing the latest message…
                  </p>
                </div>
              ) : recentVideo ? (
                <>
                  {thumb ? (
                    <Media
                      src={thumb}
                      alt={recentVideoTitle}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-center"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-white/[0.04]" />
                  )}
                  <div className="absolute inset-0 bg-black/35" />
                  {videoUrl ? (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group absolute inset-0 flex items-center justify-center"
                      aria-label={`Watch ${recentVideoTitle}`}
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--app-primary)] text-black shadow-2xl transition duration-300 group-hover:scale-105 group-hover:bg-[var(--app-primary-light)]">
                        <PlayCircle className="h-7 w-7" />
                      </span>
                    </a>
                  ) : null}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--app-primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] text-[var(--app-primary)]">
                    <PlayCircle className="h-7 w-7" />
                  </span>
                  <p className="mt-6 font-headline text-heading-sm font-semibold !text-white">
                    Latest message coming soon
                  </p>
                  <p className="mt-2 max-w-sm font-ui text-body-sm leading-7 text-[var(--app-subtle)]">
                    Explore previous sermons while the newest teaching is being
                    prepared.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container className="pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="mb-8 sm:mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-primary)]/30 bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] px-3.5 py-1 text-xs font-semibold text-[var(--app-primary)] mb-3.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-primary)]" />
            <span>Pathways & Ministries</span>
          </div>
          <h2 className="font-headline text-heading-xl sm:text-heading-2xl font-bold tracking-tight text-[var(--app-ink)]">
            Explore our church,{' '}
            <span className="text-[var(--app-primary)]">find your path.</span>
          </h2>
          <p className="mt-3.5 font-ui text-body-md sm:text-body-lg text-[var(--app-subtle)] leading-relaxed">
            Whether you want to listen to life-transforming sermons, receive
            dedicated pastoral care, equip your spiritual walk with store
            resources, or connect with active ministries to serve — explore the
            pathways prepared for you.
          </p>
        </div>
        <ResourceCarousel />
      </Container>
    </Section>
  );
}
