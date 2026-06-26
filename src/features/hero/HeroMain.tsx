/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  CalendarClock,
  ChevronDown,
  MapPin,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';

import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import { H1, H2, BodyMD, BodySM, Caption, Eyebrow } from '@/shared/text';
import { Button } from '@/shared/utils/buttons';
import { Section, Container } from '@/shared/layout';

import { useHeroContent, type HeroSlide } from '@/hooks/useHeroContent';
import { renderTitle, renderSubtitle } from '@/shared/utils/heroTextUtil';
import { useWaveTextAnimation } from '@/shared/utils/hooks/mainHeroHooks/useWaveText';
import type { YouTubeVideo } from '@/lib/types';
import { resolveConfiguredApiOrigin } from '@/lib/apiOrigin';

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
  date: 'Mar 21 - 23',
  time: 'Morning Session • Evening Session',
  location: 'Honors Gardens, Alasia opposite Dominion City Headquarters',
  ctaLabel: 'Reserve a seat',
  ctaTarget: '#programs',
};

const FALLBACK_SLIDE = {
  id: 'fallback-hero-slide',
  type: 'hero',
  title: 'Welcome to The Wisdom Church',
  subtitle: 'Equipped and empowered for greatness',
  description:
    'A Spirit-filled family helping believers grow in faith, purpose, and community.',
  image: '/images/lader.jpeg', // ← Changed to your image
  upcoming: FALLBACK_UPCOMING,
} as unknown as HeroSlide;

interface HeroSectionProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  showWaveText?: boolean;
  slides?: HeroSlide[];
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

function normalizeImage(
  image: unknown,
  fallbackAlt = 'Slide image'
): {
  src: string;
  alt: string;
  objectPosition?: string;
} {
  if (typeof image === 'string' && image.trim()) {
    return { src: image, alt: fallbackAlt };
  }

  if (isStaticImageData(image)) {
    return { src: image.src, alt: fallbackAlt };
  }

  if (typeof image === 'object' && image !== null && 'src' in image) {
    const typedImage = image as {
      src?: string | StaticImageData;
      alt?: string;
      objectPosition?: string;
    };

    const src =
      typeof typedImage.src === 'string'
        ? typedImage.src
        : typedImage.src?.src || '';

    return {
      src: src || '/images/placeholder.webp',
      alt: typedImage.alt || fallbackAlt,
      objectPosition: typedImage.objectPosition,
    };
  }

  return { src: '/images/placeholder.webp', alt: fallbackAlt };
}

function getVideoId(video: YouTubeVideo): string {
  return (
    String((video as any).id || '').trim() ||
    String((video as any).videoId || '').trim()
  );
}

function getVideoThumbnail(video: YouTubeVideo): string {
  return (
    String((video as any).thumbnail || '').trim() ||
    String((video as any)?.thumbnails?.medium?.url || '').trim() ||
    String((video as any)?.thumbnails?.default?.url || '').trim() ||
    '/images/placeholder.webp'
  );
}

export default function HeroSection({
  primaryButtonText = 'Join Our Community',
  secondaryButtonText = 'Watch Live Stream',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  showWaveText = true,
  slides: externalSlides,
}: HeroSectionProps) {
  const { open } = useServiceUnavailable();
  const { slides: backendSlides } = useHeroContent();

  const heroRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const waveTextRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const [latestVideo, setLatestVideo] = useState<YouTubeVideo | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isCompactMobile, setIsCompactMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const safeSlides = useMemo<HeroSlide[]>(() => {
    const source = externalSlides || backendSlides;
    const validSlides = Array.isArray(source) ? source.filter(Boolean) : [];

    return validSlides.length > 0 ? validSlides : [FALLBACK_SLIDE];
  }, [externalSlides, backendSlides]);

  const currentSlideData = safeSlides[currentSlide] ?? safeSlides[0];
  const upcoming = (currentSlideData as any)?.upcoming ?? FALLBACK_UPCOMING;

  useWaveTextAnimation(
    waveTextRef as React.RefObject<HTMLDivElement>,
    showWaveText
  );

  useEffect(() => {
    setCurrentSlide(prev => Math.min(prev, safeSlides.length - 1));
  }, [safeSlides.length]);

  useEffect(() => {
    const handleResize = () => setIsCompactMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-rotation intentionally disabled — user controls slide navigation

  const handleUnavailable = useCallback(
    (title?: string, message?: string) => {
      open({
        title: title || 'Service not available yet',
        message:
          message ||
          'We are polishing this experience for production. Please check back soon.',
        actionLabel: 'Okay, thanks',
      });
    },
    [open]
  );

  const scrollToNextSection = useCallback(() => {
    const nextSection = heroRef.current?.nextElementSibling;

    if (nextSection instanceof HTMLElement) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleUpcomingCta = useCallback(() => {
    const target = upcoming?.ctaTarget;

    if (!target || typeof target !== 'string') {
      handleUnavailable('Reservations opening soon');
      return;
    }

    if (target.startsWith('#')) {
      const element = document.getElementById(target.slice(1));

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      handleUnavailable('Reservations opening soon');
      return;
    }

    window.location.href = target;
  }, [handleUnavailable, upcoming]);

  const handlePrimaryClick = useCallback(() => {
    if (onPrimaryButtonClick) {
      onPrimaryButtonClick();
      return;
    }

    handleUnavailable('Join our community');
  }, [handleUnavailable, onPrimaryButtonClick]);

  const handleSecondaryClick = useCallback(() => {
    if (onSecondaryButtonClick) {
      onSecondaryButtonClick();
      return;
    }

    handleUnavailable('Live stream coming soon');
  }, [handleUnavailable, onSecondaryButtonClick]);

  useEffect(() => {
    let mounted = true;

    const fetchLatest = async () => {
      setVideoLoading(true);

      try {
        const res = await fetch(SERMONS_ENDPOINT, {
          method: 'GET',
          cache: 'no-store',
          credentials: 'omit',
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) return;

        const payload = await res.json();
        const data: YouTubeVideo[] = payload?.data ?? payload;

        if (mounted && Array.isArray(data) && data.length > 0) {
          setLatestVideo(data[0]);
        }
      } catch (err) {
        console.warn('Hero latest video fetch failed', err);
      } finally {
        if (mounted) setVideoLoading(false);
      }
    };

    fetchLatest();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const parallaxElements = gsap.utils.toArray(
        '[data-parallax]'
      ) as HTMLElement[];

      parallaxElements.forEach(element => {
        const speed = Number(element.dataset.parallax ?? 0.14);

        gsap.to(element, {
          yPercent: speed * 16,
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

  useEffect(() => {
    if (!heroRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline
        .fromTo(
          waveTextRef.current,
          { y: 14, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6 }
        )
        .fromTo(
          titleRef.current,
          { y: 28, opacity: 0, filter: 'blur(8px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.75 },
          '-=0.28'
        )
        .fromTo(
          subtitleRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          '-=0.36'
        )
        .fromTo(
          descriptionRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.32'
        )
        .fromTo(
          buttonsRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.28'
        )
        .fromTo(
          cardsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.62 },
          '-=0.16'
        )
        .fromTo(
          scrollIndicatorRef.current,
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          '-=0.28'
        );

      gsap.to(waveTextRef.current, {
        y: 4,
        duration: 2.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }, heroRef);

    return () => ctx.revert();
  }, [currentSlide]);

  return (
    <Section
      ref={heroRef}
      padding="none"
      fullHeight={false}
      perf="none"
      className="relative min-h-screen w-full overflow-hidden bg-[#030303]"
    >
      {safeSlides.map((slide, index) => {
        const slideImage = normalizeImage(
          (slide as any).image,
          (slide as any)?.title || `Slide ${index + 1}`
        );

        const isActive = index === currentSlide;

        return (
          <div
            key={(slide as any)?.id || index}
            className={[
              'absolute inset-0 transition-all duration-700 ease-out',
              isActive
                ? 'z-10 scale-100 opacity-100'
                : 'z-0 scale-[1.02] opacity-0',
            ].join(' ')}
          >
            <div className="relative h-full w-full" data-parallax="0.2">
              <Image
                src={slideImage.src}
                alt={slideImage.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={88}
                className="object-cover"
                // eslint-disable-next-line no-restricted-syntax
                style={{
                  objectPosition: slideImage.objectPosition || 'center 28%',
                }}
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(201,150,26,0.14),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(255,255,255,0.07),transparent_32%)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/18 to-black/70" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/28 to-black/10 lg:from-black/70 lg:via-black/20 lg:to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[rgba(201,150,26,0.08)] to-transparent" />
            </div>
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute left-[-8%] top-[22%] h-80 w-80 rounded-full bg-[var(--app-primary)]/[0.18] blur-[80px] sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute bottom-[-8%] right-[-4%] h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute bottom-[12%] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[var(--app-primary)]/[0.06] blur-[60px]" />
      </div>

      <Container
        size="xl"
        className="relative z-20 flex min-h-screen items-center px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-24 lg:px-10 lg:pb-36 lg:pt-28"
      >
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 xl:gap-16">
          <div className="flex w-full flex-col items-center text-center sm:items-start sm:text-left">
            {showWaveText ? (
              <div className="mb-4 flex w-full justify-center sm:justify-start">
                <div
                  ref={waveTextRef}
                  className="inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/[0.08] px-3 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-4"
                >
                  <span className="h-2 w-2 flex-none rounded-full bg-[var(--app-primary)] shadow-[0_0_18px_currentColor]" />
                  <span className="truncate bg-[linear-gradient(120deg,var(--app-primary-light),#ffffff_42%,var(--app-primary))] bg-clip-text text-[0.62rem] font-bold uppercase tracking-[0.2em] text-transparent sm:text-[0.7rem]">
                    The Wave of Greatness
                  </span>
                  <Sparkles className="h-3.5 w-3.5 flex-none text-[var(--app-primary)]" />
                </div>
              </div>
            ) : null}

            <div className="relative max-w-4xl">
              <H1
                ref={titleRef}
                className="hero-title-shadow font-semibold leading-[0.98] tracking-[-0.052em]"
                useThemeColor={false}
              >
                <span className="block text-[2.1rem] sm:text-[3.2rem] md:text-[3.8rem] lg:text-[4.8rem] xl:text-[5.6rem]">
                  {renderTitle((currentSlideData as any)?.title)}
                </span>
              </H1>

              <div className="mx-auto mt-5 h-px w-20 rounded-full bg-gradient-to-r from-transparent via-[var(--app-primary)] to-transparent shadow-[0_0_20px_rgba(201,150,26,0.40)] sm:mx-0 sm:w-28" />

              {(currentSlideData as any)?.subtitle ? (
                <H2
                  ref={subtitleRef}
                  className="mt-6 font-medium text-[var(--app-primary)] [text-shadow:0_3px_16px_rgba(0,0,0,0.80),0_0_28px_rgba(201,150,26,0.12)]"
                  useThemeColor={false}
                  weight="medium"
                >
                  <span className="block text-sm leading-relaxed sm:text-base md:text-lg lg:text-xl">
                    {renderSubtitle((currentSlideData as any)?.subtitle)}
                  </span>
                </H2>
              ) : null}

              <BodyMD
                ref={descriptionRef}
                className="mx-auto mt-6 max-w-3xl text-white/75 sm:mx-0"
              >
                {isCompactMobile
                  ? 'A Spirit-filled family helping believers grow in faith and purpose.'
                  : (currentSlideData as any)?.description ||
                    'A Spirit-filled family helping believers grow in faith, purpose, and community — equipped and empowered for greatness.'}
              </BodyMD>

              <div
                ref={buttonsRef}
                className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:justify-start"
              >
                <Button
                  variant="primary"
                  size="md"
                  curvature="full"
                  elevated
                  onClick={handlePrimaryClick}
                  className="group w-full bg-[linear-gradient(135deg,var(--app-primary)_0%,var(--app-primary-dark)_100%)] px-8 py-3.5 text-sm font-bold text-[#111111] shadow-[0_20px_50px_rgba(201,150,26,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.96] sm:w-auto"
                >
                  <span className="inline-flex items-center gap-2">
                    {primaryButtonText}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  curvature="full"
                  onClick={handleSecondaryClick}
                  className="group w-full border border-white/30 bg-white/[0.10] px-8 py-3.5 text-sm font-bold text-white shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.16] hover:border-white/40 sm:w-auto"
                >
                  <span className="inline-flex items-center gap-2">
                    <PlayCircle className="h-4 w-4" />
                    {secondaryButtonText}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <div
            ref={cardsRef}
            className="grid w-full gap-5 md:grid-cols-2 lg:grid-cols-1"
          >
            <div className="group relative overflow-hidden rounded-xl border border-white/18 bg-white/[0.09] p-5 backdrop-blur-xl transition duration-300 hover:bg-white/[0.13] hover:border-white/25 sm:p-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--app-primary)] to-transparent" />

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--app-primary),var(--app-primary-dark))] shadow-lg">
                  <CalendarClock className="h-5 w-5 text-black" />
                </div>

                <div className="min-w-0">
                  <Eyebrow className="text-white/60">{upcoming.label}</Eyebrow>
                  <BodyMD weight="semibold" className="mt-1 text-white">
                    {upcoming.title}
                  </BodyMD>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-white/78">
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-4 w-4 shrink-0 text-[var(--app-primary)]" />
                  <span>
                    {upcoming.date} • {upcoming.time}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-[var(--app-primary)]" />
                  <span className="line-clamp-2">{upcoming.location}</span>
                </div>
              </div>

              <Button
                size="sm"
                curvature="full"
                elevated
                onClick={handleUpcomingCta}
                className="mt-6 bg-[linear-gradient(135deg,var(--app-primary)_0%,var(--app-primary-dark)_100%)] px-6 py-2.5 text-xs font-bold text-[#111111] shadow-[0_8px_24px_rgba(201,150,26,0.20)] transition-all duration-300 hover:scale-[1.04] hover:shadow-lg active:scale-[0.97]"
              >
                <span className="inline-flex items-center gap-2">
                  {upcoming.ctaLabel ?? 'Reserve a seat'}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-white/14 bg-black/50 p-5 backdrop-blur-xl transition duration-300 hover:bg-black/60 hover:border-white/22 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.08]">
                  <PlayCircle className="h-6 w-6 text-white" />
                </div>

                <div>
                  <BodyMD weight="semibold" className="text-white">
                    Watch live stream
                  </BodyMD>
                  <Caption className="mt-1 text-white/55">
                    Latest message from YouTube
                  </Caption>
                </div>
              </div>

              {latestVideo ? (
                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-white/15 bg-black sm:h-24 sm:w-36 sm:shrink-0">
                    <img
                      src={getVideoThumbnail(latestVideo)}
                      alt={latestVideo.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                      <PlayCircle className="h-7 w-7 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <BodySM
                      weight="semibold"
                      className="line-clamp-2 text-white"
                    >
                      {latestVideo.title}
                    </BodySM>

                    {getVideoId(latestVideo) ? (
                      <a
                        href={`https://www.youtube.com/watch?v=${getVideoId(
                          latestVideo
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--app-primary),var(--app-primary-dark))] px-4 py-2 text-xs font-bold text-[#111111] transition hover:scale-[1.03]"
                      >
                        Play now <PlayCircle className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  curvature="full"
                  onClick={handleSecondaryClick}
                  className="mt-5 border border-white/30 bg-white/[0.06] px-5 py-2.5 text-xs font-bold text-white hover:bg-white/[0.12]"
                >
                  {videoLoading ? 'Loading…' : 'Watch'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>

      {safeSlides.length > 1 ? (
        <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3 py-2 backdrop-blur-2xl sm:bottom-14">
          {safeSlides.map((slide, index) => (
            <Button
              key={(slide as any)?.id || index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              variant="ghost"
              className={`rounded-full p-0 transition-all duration-300 ease-out ${
                currentSlide === index
                  ? 'bg-[var(--app-primary)] shadow-[0_0_18px_rgba(201,150,26,0.40)]'
                  : 'bg-white/30'
              }`}
              // eslint-disable-next-line no-restricted-syntax
              style={{
                width: currentSlide === index ? '26px' : '7px',
                height: '7px',
                minHeight: '7px',
              }}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index}
            />
          ))}
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto h-px w-[min(94%,1280px)] rounded-full bg-gradient-to-r from-transparent via-[var(--app-primary)] to-transparent opacity-95 shadow-[0_0_18px_rgba(201,150,26,0.40)]" />
      </div>

      <ScrollIndicators
        scrollIndicatorRef={scrollIndicatorRef}
        scrollToNextSection={scrollToNextSection}
      />
    </Section>
  );
}

interface ScrollIndicatorsProps {
  scrollIndicatorRef: React.RefObject<HTMLDivElement | null>;
  scrollToNextSection: () => void;
}

function ScrollIndicators({
  scrollIndicatorRef,
  scrollToNextSection,
}: ScrollIndicatorsProps) {
  return (
    <>
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-2 left-1/2 z-30 hidden -translate-x-1/2 cursor-pointer sm:block"
        onClick={scrollToNextSection}
        aria-label="Scroll to next section"
        role="button"
        tabIndex={0}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            scrollToNextSection();
          }
        }}
      >
        <div className="flex flex-col items-center">
          <ChevronDown className="h-6 w-6 animate-bounce text-[var(--app-primary)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]" />
          <span className="mt-1 text-[0.62rem] font-bold tracking-[0.2em] text-white/55">
            SCROLL
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute bottom-1 left-1/2 z-30 -translate-x-1/2 cursor-pointer pb-1 sm:hidden"
        onClick={scrollToNextSection}
        aria-label="Scroll to next section"
      >
        <ChevronDown className="h-4 w-4 animate-bounce text-[var(--app-primary)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
      </Button>
    </>
  );
}
