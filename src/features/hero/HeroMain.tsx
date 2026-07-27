/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { gsap } from 'gsap';
import { ArrowRight, CalendarDays, PlayCircle } from 'lucide-react';

import { Section, Container } from '@/shared/layout';
import SectionGlow from '@/shared/ui/SectionGlow';
import { lader as laderImg } from '@/shared/assets';
import { useHeroContent, type HeroSlide } from '@/hooks/useHeroContent';
import { resolveConfiguredApiOrigin } from '@/lib/apiOrigin';
import type { YouTubeVideo } from '@/lib/types';
import { IMAGE_QUALITY } from '@/shared/constants';

const API_ORIGIN = resolveConfiguredApiOrigin();
const SERMONS_ENDPOINT = `${API_ORIGIN}/api/v1/sermons?sort=newest`;

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
      src: src || null,
      alt: t.alt || fallbackAlt,
      objectPosition: t.objectPosition,
    };
  }
  return { src: null, alt: fallbackAlt };
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

  // setCurrentSlide is reserved for future slide-navigation controls (dots/arrows).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestVideo, setLatestVideo] = useState<YouTubeVideo | null>(null);

  const safeSlides = useMemo<HeroSlide[]>(() => {
    const source = externalSlides || backendSlides;
    return Array.isArray(source) ? source.filter(Boolean) : [];
  }, [externalSlides, backendSlides]);

  // Clamped at render time (instead of synced via effect) so an out-of-range
  // index — e.g. safeSlides shrinking after currentSlide was set — never
  // points past the end of the array.
  const activeSlideIndex = Math.max(
    0,
    Math.min(currentSlide, safeSlides.length - 1)
  );
  const slide = safeSlides[activeSlideIndex];

  // GSAP entry animation — per-line clip reveal + stagger
  useEffect(() => {
    if (!heroRef.current) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const titleLines = gsap.utils.toArray(
        '[data-hero-line]',
        heroRef.current!
      ) as HTMLElement[];

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Eyebrow: fade + slide down
      tl.fromTo(
        eyebrowRef.current,
        { y: -20, opacity: 0, letterSpacing: '0.5em' },
        {
          y: 0,
          opacity: 1,
          letterSpacing: '0.22em',
          duration: 0.9,
          ease: 'expo.out',
        }
      )
        // Title lines: clip reveal from bottom, staggered
        .fromTo(
          titleLines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.13,
            ease: 'power4.out',
          },
          '-=0.55'
        )
        // Gold rule: draw from left
        .fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: 'expo.out' },
          '-=0.35'
        )
        // Body: fade up
        .fromTo(
          bodyRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.4'
        )
        // CTAs: fade up
        .fromTo(
          ctaRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, [currentSlide]);

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
  const eyebrow = content?.eyebrow ?? 'Welcome Home';
  const titleLines = (
    content?.title ?? String((slide as any)?.title || 'The Wisdom Church')
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
    : 'https://www.youtube.com/@wisdomhousehq';

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
      {/* ── Default background image (lader.jpeg) ─────────────── */}
      {!content?.bgImage && (
        <div className="absolute inset-0 z-[5] overflow-hidden">
          <Image
            src={laderImg}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={IMAGE_QUALITY}
            className="object-cover animate-[kenburns_18s_ease-in-out_infinite_alternate]"
            // eslint-disable-next-line no-restricted-syntax
            style={{ objectPosition: 'center 30%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/58 to-black/22" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-transparent to-black/68" />
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
            quality={IMAGE_QUALITY}
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
          const img = normalizeImage(
            (s as any).image,
            (s as any)?.title || `Slide ${i + 1}`
          );
          return (
            <div
              key={(s as any)?.id || i}
              className={[
                'absolute inset-0 transition-all duration-700 ease-out',
                i === activeSlideIndex ? 'z-10 opacity-100' : 'z-0 opacity-0',
              ].join(' ')}
            >
              <div
                className="relative h-full w-full"
                data-parallax-global="0.18"
              >
                {img.src ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    quality={IMAGE_QUALITY}
                    className="object-cover"
                    // eslint-disable-next-line no-restricted-syntax
                    style={{
                      objectPosition: img.objectPosition || 'center 28%',
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-[var(--app-dark-2)]" />
                )}
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
        <div className="relative max-w-[640px]">
          <SectionGlow />
          {/* Eyebrow — elastic bounce entry + continuous gentle float */}
          <p
            ref={eyebrowRef}
            className="mb-6 inline-block text-caption font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]"
          >
            {eyebrow}
          </p>

          {/* Headline — bold italic, per-line clip reveal */}
          <h1
            ref={titleRef}
            className="font-headline font-bold italic leading-[0.95] tracking-[-0.025em] text-white"
            // eslint-disable-next-line no-restricted-syntax
            style={{ fontSize: 'var(--type-display-lg)' }}
          >
            {titleLines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <span data-hero-line className="block">
                  {line}
                </span>
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
            className="mt-6 max-w-[420px] font-ui text-body-lg leading-[1.75] text-white/70 sm:text-heading-sm"
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
                className="group relative inline-flex h-12 items-center gap-2.5 bg-[var(--app-primary)] px-7 text-body-sm font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
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
                className="group inline-flex h-12 items-center gap-2.5 border border-white/25 bg-white/[0.08] px-7 text-body-sm font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm transition hover:bg-white/[0.14] active:scale-[0.98]"
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
                className="group inline-flex h-12 items-center gap-2.5 border border-white/25 bg-white/[0.08] px-7 text-body-sm font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm transition hover:bg-white/[0.14] active:scale-[0.98]"
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
