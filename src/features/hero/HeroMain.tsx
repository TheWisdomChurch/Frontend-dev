/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CalendarDays, PlayCircle } from 'lucide-react';

import { Section, Container } from '@/shared/layout';
import { useHeroContent, type HeroSlide } from '@/hooks/useHeroContent';
import { resolveConfiguredApiOrigin } from '@/lib/apiOrigin';
import type { YouTubeVideo } from '@/lib/types';

if (
  typeof window !== 'undefined' &&
  typeof gsap.registerPlugin === 'function'
) {
  gsap.registerPlugin(ScrollTrigger);
}

const API_ORIGIN = resolveConfiguredApiOrigin();
const SERMONS_ENDPOINT = `${API_ORIGIN}/api/v1/sermons?sort=newest`;

const FALLBACK_UPCOMING = {
  label: 'Upcoming',
  title: 'Wisdom Power Conference 26',
  date: 'Mar 21 – 23, 2026',
  ctaLabel: 'Reserve a seat',
  ctaTarget: '#programs',
};

const FALLBACK_SLIDE = {
  id: 'fallback-hero-slide',
  type: 'hero',
  title: 'The Wave\nof Greatness',
  subtitle: '',
  description:
    "A Spirit-filled community — equipped, empowered, and raised to carry God's glory.",
  image: '/images/lader.jpeg',
  upcoming: FALLBACK_UPCOMING,
} as unknown as HeroSlide;

/* ── Page content override (for inner pages) ─────────── */
export interface HeroPageContent {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string; external?: boolean };
  bgImage?: string;
}

function isStaticImageData(value: unknown): value is StaticImageData {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as StaticImageData).src === 'string' &&
    'height' in value &&
    'width' in value
  );
}

function normalizeImage(image: unknown, fallbackAlt = 'Slide image') {
  if (typeof image === 'string' && image.trim()) {
    return { src: image, alt: fallbackAlt };
  }
  if (isStaticImageData(image)) {
    return { src: image.src, alt: fallbackAlt };
  }
  if (typeof image === 'object' && image !== null && 'src' in image) {
    const t = image as {
      src?: string | StaticImageData;
      alt?: string;
      objectPosition?: string;
    };
    const src = typeof t.src === 'string' ? t.src : t.src?.src || '';
    return {
      src: src || '/images/placeholder.webp',
      alt: t.alt || fallbackAlt,
      objectPosition: t.objectPosition,
    };
  }
  return { src: '/images/placeholder.webp', alt: fallbackAlt };
}

export default function HeroSection({
  slides: externalSlides,
  content,
}: {
  slides?: HeroSlide[];
  content?: HeroPageContent;
}) {
  const { slides: backendSlides } = useHeroContent();

  const heroRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const ruleRef = useRef<HTMLSpanElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestVideo, setLatestVideo] = useState<YouTubeVideo | null>(null);

  const safeSlides = useMemo<HeroSlide[]>(() => {
    const source = externalSlides || backendSlides;
    const valid = Array.isArray(source) ? source.filter(Boolean) : [];
    return valid.length > 0 ? valid : [FALLBACK_SLIDE];
  }, [externalSlides, backendSlides]);

  const slide = safeSlides[currentSlide] ?? safeSlides[0];

  useEffect(() => {
    setCurrentSlide(prev => Math.min(prev, safeSlides.length - 1));
  }, [safeSlides.length]);

  // GSAP entry animation + continuous eyebrow float
  useEffect(() => {
    if (!heroRef.current) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        eyebrowRef.current,
        { y: -28, opacity: 0, scale: 0.88 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'elastic.out(1.2, 0.5)',
        }
      )
        .fromTo(
          titleRef.current,
          { y: 36, opacity: 0, filter: 'blur(6px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: 'expo.out' },
          '-=0.3'
        )
        .fromTo(
          bodyRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          '-=0.28'
        )
        .fromTo(
          ctaRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
        .call(() => {
          // Gentle continuous float after entry
          gsap.to(eyebrowRef.current, {
            y: -4,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
          });
        });
    }, heroRef);

    return () => ctx.revert();
  }, [currentSlide]);

  // GSAP parallax on background
  useEffect(() => {
    if (!heroRef.current) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      (gsap.utils.toArray('[data-parallax]') as HTMLElement[]).forEach(el => {
        gsap.to(el, {
          yPercent: Number(el.dataset.parallax ?? 0.14) * 16,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Fetch latest sermon video
  useEffect(() => {
    let mounted = true;
    fetch(SERMONS_ENDPOINT, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'omit',
      headers: { Accept: 'application/json' },
    })
      .then(r => (r.ok ? r.json() : null))
      .then(payload => {
        const data: YouTubeVideo[] = payload?.data ?? payload;
        if (mounted && Array.isArray(data) && data.length > 0)
          setLatestVideo(data[0]);
      })
      .catch(() => null);
    return () => {
      mounted = false;
    };
  }, []);

  // Resolve display content (content prop overrides dynamic slide)
  const eyebrow = content?.eyebrow ?? 'The Wave of Greatness';
  const titleLines = (
    content?.title ?? String((slide as any)?.title || 'The Wave\nof Greatness')
  )
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
  const description =
    content?.description ??
    ((slide as any)?.description ||
      'A Spirit-filled community equipped and empowered for greatness.');

  const watchHref = latestVideo
    ? `https://www.youtube.com/watch?v=${(latestVideo as any).id || ''}`
    : 'https://www.youtube.com/@wisdomchurchhq';

  const primaryCtaHref = content?.primaryCta?.href ?? '/events/weekly';
  const primaryCtaLabel = content?.primaryCta?.label ?? 'Plan a visit';

  const secondaryCtaHref = content?.secondaryCta?.href ?? watchHref;
  const secondaryCtaLabel = content?.secondaryCta?.label ?? 'Watch live';
  const secondaryCtaExternal =
    content?.secondaryCta?.external ?? !content?.secondaryCta?.href;

  return (
    <Section
      ref={heroRef}
      padding="none"
      fullHeight={false}
      perf="none"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#030303]"
    >
      {/* ── Video background (default, no bgImage) ────────────── */}
      {!content?.bgImage && (
        <div className="absolute inset-0 z-[5]">
          <video
            src="/videos/videoBg.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
            // eslint-disable-next-line no-restricted-syntax
            style={{ objectPosition: 'center 30%' }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/65" />
        </div>
      )}

      {/* ── Static image background (inner pages with bgImage) ─── */}
      {content?.bgImage && (
        <div className="absolute inset-0 z-[5]">
          <Image
            src={content.bgImage}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover"
            // eslint-disable-next-line no-restricted-syntax
            style={{ objectPosition: 'center 28%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/65" />
        </div>
      )}

      {/* ── API slide images (homepage only) ──────────────────── */}
      {!content &&
        safeSlides.map((s, i) => {
          const isFallback = (s as any)?.id === 'fallback-hero-slide';
          const img = normalizeImage(
            (s as any).image,
            (s as any)?.title || `Slide ${i + 1}`
          );
          if (isFallback) return null;
          return (
            <div
              key={(s as any)?.id || i}
              className={[
                'absolute inset-0 transition-all duration-700 ease-out',
                i === currentSlide ? 'z-10 opacity-100' : 'z-0 opacity-0',
              ].join(' ')}
            >
              <div className="relative h-full w-full" data-parallax="0.18">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  quality={90}
                  className="object-cover"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ objectPosition: img.objectPosition || 'center 28%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
              </div>
            </div>
          );
        })}

      {/* ── Main content ───────────────────────────────────────── */}
      <Container
        size="xl"
        className="relative z-20 flex min-h-[100svh] flex-col justify-center px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-10 lg:pb-28 lg:pt-36"
      >
        <div className="max-w-[640px]">
          {/* Eyebrow — elastic bounce entry + continuous gentle float */}
          <p
            ref={eyebrowRef}
            className="mb-6 inline-block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]"
          >
            {eyebrow}
          </p>

          {/* Headline */}
          <h1
            ref={titleRef}
            className="font-headline font-normal leading-[0.96] tracking-[-0.02em] text-white"
            // eslint-disable-next-line no-restricted-syntax
            style={{ fontSize: 'var(--type-display-lg)' }}
          >
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Gold rule */}
          <span
            ref={ruleRef}
            className="mt-7 block h-[2px] w-14 origin-left bg-[var(--app-primary)]"
            aria-hidden="true"
          />

          {/* Body */}
          <p
            ref={bodyRef}
            className="mt-6 max-w-[420px] font-ui text-[1rem] leading-[1.75] text-white/70 sm:text-[1.05rem]"
          >
            {description}
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="mt-9 flex flex-wrap items-center gap-4">
            {/* Primary — Plan a Visit with pulsing ring */}
            <div className="relative">
              <span
                className="pointer-events-none absolute -inset-1 animate-ping rounded-[calc(var(--radius-button)+4px)] bg-[var(--app-primary)]/22"
                // eslint-disable-next-line no-restricted-syntax
                style={{ animationDuration: '2.8s', animationDelay: '1s' }}
              />
              <Link
                href={primaryCtaHref}
                className="group relative inline-flex h-12 items-center gap-2.5 bg-[var(--app-primary)] px-7 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-[#0d0a06] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
                // eslint-disable-next-line no-restricted-syntax
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                <CalendarDays className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                {primaryCtaLabel}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Secondary — Watch Live (always visible) */}
            {secondaryCtaExternal ? (
              <a
                href={secondaryCtaHref}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-12 items-center gap-2.5 border border-white/25 bg-white/[0.08] px-7 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm transition hover:bg-white/[0.14] active:scale-[0.98]"
                // eslint-disable-next-line no-restricted-syntax
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                <span className="relative flex h-2.5 w-2.5 flex-none items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
                  <span className="relative h-2 w-2 rounded-full bg-red-500" />
                </span>
                {secondaryCtaLabel}
                <PlayCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </a>
            ) : (
              <Link
                href={secondaryCtaHref}
                className="group inline-flex h-12 items-center gap-2.5 border border-white/25 bg-white/[0.08] px-7 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm transition hover:bg-white/[0.14] active:scale-[0.98]"
                // eslint-disable-next-line no-restricted-syntax
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                <ArrowRight className="h-4 w-4" />
                {secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
