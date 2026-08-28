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

import { WhatWeDo_3, Deacon_1, wisdomShirt_1 } from '@/shared/assets';
import type { YouTubeVideo } from '@/domain/media/types';
import { mediaApi } from '@/domain/media/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import { IMAGE_QUALITY } from '@/shared/constants';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { Media } from '@/shared/ui/Media';
import { Container, SectionHeader, Section } from '@/shared/ui/layout';
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
    <div>
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <SectionHeader
          eyebrow="Explore"
          title="You can do"
          accent="more"
          size="sm"
        />

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
          <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 xl:gap-20">
            <div>
              <SectionHeader
                eyebrow="Latest Message"
                title="Hear the"
                accent="Word."
                tone="dark"
              />

              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="rounded-badge border border-white/12 bg-white/[0.045] px-4 py-2 font-ui text-label font-semibold text-white/68">
                  {SERVICE_INFO.sunday.day}s · {SERVICE_INFO.sunday.time}
                </span>
                <span className="rounded-badge border border-white/12 bg-white/[0.045] px-4 py-2 font-ui text-label font-semibold text-white/68">
                  {SERVICE_INFO.dailyPrayer.label} ·{' '}
                  {SERVICE_INFO.dailyPrayer.time}
                </span>
              </div>

              <div className="mt-10 min-h-28 border-l border-[var(--app-primary)]/60 pl-6">
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
                    <p className="mt-3 font-ui text-body-sm text-white/52">
                      The Wisdom Church
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-headline text-heading-md font-semibold !text-white">
                      Message coming soon
                    </h3>
                    <p className="mt-3 max-w-md font-ui text-body-sm leading-7 text-white/52">
                      Our latest teaching will appear here as soon as it is
                      published.
                    </p>
                  </>
                )}
              </div>

              <Link
                href="/resources/sermons"
                className={buttonClass('primary', 'md', 'mt-9')}
              >
                Explore sermons <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div
              data-gsap="reveal"
              className="relative aspect-video w-full overflow-hidden rounded-image border border-white/12 bg-white/[0.035] shadow-2xl shadow-black/30"
            >
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-7 w-7 animate-spin text-[var(--app-primary)]" />
                  <p className="font-ui text-label text-white/48">
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
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--app-primary)]/35 bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
                    <PlayCircle className="h-7 w-7" />
                  </span>
                  <p className="mt-6 font-headline text-heading-sm font-semibold !text-white">
                    Latest message coming soon
                  </p>
                  <p className="mt-2 max-w-sm font-ui text-body-sm leading-7 text-white/48">
                    Explore previous sermons while the newest teaching is being
                    prepared.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-section-sm">
        <ResourceCarousel />
      </Container>
    </Section>
  );
}
