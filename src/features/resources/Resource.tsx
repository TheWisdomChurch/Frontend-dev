'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  Loader2,
  PlayCircle,
  ShoppingBag,
  Users,
} from 'lucide-react';

import { Container, Section } from '@/shared/layout';
import { WhatWeDo_3, Deacon_1, wisdomShirt_1 } from '@/shared/assets';
import type { YouTubeVideo } from '@/domain/media/types';
import { mediaApi } from '@/domain/media/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import { IMAGE_QUALITY } from '@/shared/constants';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { Media } from '@/shared/ui/Media';
import { decodeHtmlEntities } from '@/shared/utils/functionUtils/decodeHtmlEntities';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion/staggerReveal';

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

/* ── Resource Carousel component ────────────────────── */

function ResourceCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);

  const updateMax = () => {
    if (!trackRef.current?.parentElement) return;
    const max =
      trackRef.current.scrollWidth - trackRef.current.parentElement.clientWidth;
    setMaxTranslate(Math.max(0, max));
  };

  useEffect(() => {
    updateMax();
    window.addEventListener('resize', updateMax);
    return () => window.removeEventListener('resize', updateMax);
  }, []);

  const stepSize = () => {
    const card = trackRef.current?.children[0] as HTMLElement | undefined;
    if (!card) return 300;
    // gap-5 = 20px
    return card.offsetWidth + 20;
  };

  const prev = () => setTranslateX(p => Math.max(0, p - stepSize()));
  const next = () => setTranslateX(p => Math.min(maxTranslate, p + stepSize()));

  const canPrev = translateX > 0;
  const canNext = translateX < maxTranslate;

  return (
    <div className="mt-16 border-t border-[var(--app-ink)]/8 pt-14">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Explore
          </p>
          <h3 className="font-headline text-display-sm font-normal text-[var(--app-ink)]">
            You can do more
          </h3>
        </div>

        {/* Navigation arrows */}
        <div className="flex shrink-0 items-center gap-2">
          <motion.button
            type="button"
            onClick={prev}
            disabled={!canPrev}
            aria-label="Previous"
            whileHover={canPrev ? { scale: 1.08 } : undefined}
            whileTap={canPrev ? { scale: 0.94 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            className="flex h-10 w-10 items-center justify-center border border-[var(--app-ink)]/15 text-[var(--app-ink)]/60 transition-colors hover:border-[var(--app-ink)]/30 hover:text-[var(--app-ink)]/80 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <motion.button
            type="button"
            onClick={next}
            disabled={!canNext}
            aria-label="Next"
            whileHover={canNext ? { scale: 1.08 } : undefined}
            whileTap={canNext ? { scale: 0.94 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            className="flex h-10 w-10 items-center justify-center border border-[var(--app-ink)]/15 text-[var(--app-ink)]/60 transition-colors hover:border-[var(--app-ink)]/30 hover:text-[var(--app-ink)]/80 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Carousel track */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-5 transition-transform duration-500 ease-in-out"
          // eslint-disable-next-line no-restricted-syntax
          style={{ transform: `translateX(-${translateX}px)` }}
        >
          {ALL_RESOURCES.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative flex aspect-[4/5] min-h-[360px] w-full shrink-0 flex-col justify-end overflow-hidden sm:aspect-[3/4] sm:w-[calc(50%-0.625rem)] lg:aspect-[4/5] lg:w-[calc(33.333%-0.833rem)]"
              >
                {/* Background image — covers card fully, no gaps */}
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={IMAGE_QUALITY}
                  className="object-cover object-[center_20%] sm:object-center transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {/* Bottom-up gradient so text is readable, top stays bright */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />
                {/* Top vignette */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />

                {/* Icon chip — top right */}
                <div className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center bg-black/30 backdrop-blur-sm transition duration-300 group-hover:bg-[var(--app-primary)]/80">
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                  <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                    {item.label}
                  </p>
                  <p className="mt-1.5 font-headline text-heading-sm font-normal leading-snug text-white">
                    {item.title}
                  </p>
                  <p className="mt-1.5 font-ui text-label leading-[1.6] text-white/60">
                    {item.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-ui text-label font-semibold text-[var(--app-primary)] transition-all duration-200 group-hover:gap-2.5">
                    {item.cta}
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
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
    ? decodeHtmlEntities(recentVideo.title)
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
    <Section
      ref={sectionRef}
      id="resources"
      padding="none"
      className="bg-[var(--app-canvas)]"
    >
      <Container size="xl" className="py-section-md">
        {/* ── Section header ───────────────────────────────── */}
        <div className="mb-10">
          <p className="mb-3 text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Latest Message
          </p>
          <h2 className="font-headline text-display-sm font-normal text-[var(--app-ink)]">
            Hear the Word.
          </h2>
        </div>

        {/* ── Layout ───────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={staggerViewport}
          className="grid gap-8 lg:grid-cols-2 lg:items-start"
        >
          {/* Left — content */}
          <motion.div
            variants={staggerItem}
            className="order-1 flex flex-col lg:col-start-1 lg:row-start-1"
          >
            <p className="mb-3 text-caption font-bold uppercase tracking-[0.18em] text-[var(--app-ink)]/60">
              {SERVICE_INFO.sunday.day}s {SERVICE_INFO.sunday.time} ·{' '}
              {SERVICE_INFO.dailyPrayer.label} {SERVICE_INFO.dailyPrayer.time}
            </p>

            {loading ? (
              <div className="flex h-24 items-center gap-3 text-sm text-[var(--app-ink)]/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading latest message…
              </div>
            ) : recentVideo ? (
              <>
                <h3 className="line-clamp-3 font-headline text-heading-lg font-normal leading-snug text-[var(--app-ink)]">
                  {recentVideoTitle}
                </h3>
                <p className="mt-2 text-body-sm text-[var(--app-ink)]/50">
                  The Wisdom Church
                </p>
              </>
            ) : (
              <h3 className="font-headline text-heading-md font-normal text-[var(--app-ink)]/60">
                Message coming soon
              </h3>
            )}
          </motion.div>

          {/* Right — video thumbnail (spans both rows so the button below
              the left column lines up level with its bottom edge) */}
          <motion.div
            variants={staggerItem}
            className="order-2 relative aspect-video w-full overflow-hidden bg-[var(--app-ink)]/8 shadow-xl lg:col-start-2 lg:row-start-1 lg:row-span-2"
          >
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--app-ink)]/60" />
              </div>
            ) : recentVideo ? (
              <>
                {thumb ? (
                  <Media
                    src={thumb}
                    alt={recentVideoTitle}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-center"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--app-ink)]/8" />
                )}
                <div className="absolute inset-0 bg-black/20" />
                {videoUrl ? (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label={`Watch ${recentVideoTitle}`}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-2xl transition duration-300 hover:scale-[1.06] hover:bg-white">
                      <PlayCircle className="h-7 w-7 text-[var(--app-ink)]" />
                    </div>
                  </a>
                ) : null}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                <PlayCircle className="h-10 w-10 text-[var(--app-ink)]/60" />
                <p className="text-sm text-[var(--app-ink)]/60">
                  Latest message coming soon
                </p>
              </div>
            )}
          </motion.div>

          {/* Button — after the video on mobile/tablet, under the text
              column on desktop */}
          <motion.div
            variants={staggerItem}
            className="order-3 mt-2 lg:col-start-1 lg:row-start-2 lg:mt-0"
          >
            <Link
              href="/resources/sermons"
              className="inline-flex h-12 items-center gap-2 bg-[var(--app-primary)] px-7 text-body-sm font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
            >
              All sermons <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* ── You can do more ──────────────────────────────── */}
        <ResourceCarousel />
      </Container>
    </Section>
  );
}
