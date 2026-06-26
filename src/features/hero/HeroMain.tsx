/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
}: {
  slides?: HeroSlide[];
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

  // Clamp active index when slides shrink
  useEffect(() => {
    setCurrentSlide(prev => Math.min(prev, safeSlides.length - 1));
  }, [safeSlides.length]);

  // GSAP entry animation
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
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      )
        .fromTo(
          titleRef.current,
          { y: 36, opacity: 0, filter: 'blur(6px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8 },
          '-=0.3'
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
        );
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

  // Fetch latest sermon video for bottom bar
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

  const titleLines = String((slide as any)?.title || 'The Wave\nof Greatness')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  return (
    <Section
      ref={heroRef}
      padding="none"
      fullHeight={false}
      perf="none"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#030303]"
    >
      {/* ── Cinematic video background ─────────────────────────── */}
      <div className="absolute inset-0 z-[5]">
        <video
          src="/videos/videoBg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center 30%' }}
          aria-hidden="true"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/65" />
      </div>

      {/* ── Slide images (from API — layer over video when active) ── */}
      {safeSlides.map((s, i) => {
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
          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            className="mb-6 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]"
          >
            Wisdom Church · Lagos
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
            className="mt-6 max-w-[420px] text-[1rem] leading-[1.75] text-white/70 sm:text-[1.05rem]"
          >
            {(slide as any)?.description ||
              'A Spirit-filled community equipped and empowered for greatness.'}
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/events/weekly"
              className="inline-flex h-12 items-center gap-2 bg-[var(--app-primary)] px-7 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-[#0d0a06] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Plan a visit
            </Link>

            {latestVideo && (
              <a
                href={`https://www.youtube.com/watch?v=${(latestVideo as any).id || ''}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 border border-white/25 bg-white/[0.08] px-7 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm transition hover:bg-white/[0.14] active:scale-[0.98]"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                <span className="mr-1 h-2 w-2 flex-none rounded-full bg-[var(--app-primary)]" />
                Watch a message
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
