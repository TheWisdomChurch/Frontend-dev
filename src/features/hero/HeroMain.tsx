/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CalendarClock, MapPin, PlayCircle, ChevronDown } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';

import { useTheme } from '@/shared/contexts/ThemeContext';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import { H1, H2 } from '@/shared/text';
import CustomButton from '@/shared/utils/buttons/CustomButton';
import { Section, Container } from '@/shared/layout';
import type { ColorScheme } from '@/shared/colors/colorScheme';

import { useHeroContent, type HeroSlide } from '@/hooks/useHeroContent';
import { renderTitle, renderSubtitle } from '@/shared/utils/heroTextUtil';
import { useWaveTextAnimation } from '@/shared/utils/hooks/mainHeroHooks/useWaveText';
import type { YouTubeVideo } from '@/lib/types';
import { resolveConfiguredApiOrigin } from '@/lib/apiOrigin';

if (
  typeof window !== 'undefined' &&
  typeof gsap.registerPlugin === 'function'
) {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const FALLBACK_COLOR_SCHEME: ColorScheme = {
  primary: '#F7DE12',
  primaryLight: '#FFF3A3',
  primaryDark: '#C7A600',
  secondary: '#FFFFFF',
  background: '#050505',
  surface: '#111111',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  border: '#2A2A2A',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  opacity: {
    primary05: 'rgba(247,222,18,0.05)',
    primary10: 'rgba(247,222,18,0.10)',
    primary15: 'rgba(247,222,18,0.15)',
    primary20: 'rgba(247,222,18,0.20)',
    primary25: 'rgba(247,222,18,0.25)',
    primary30: 'rgba(247,222,18,0.30)',
    primary40: 'rgba(247,222,18,0.40)',
    primary50: 'rgba(247,222,18,0.50)',
    black10: 'rgba(0,0,0,0.10)',
    black20: 'rgba(0,0,0,0.20)',
    black30: 'rgba(0,0,0,0.30)',
    black40: 'rgba(0,0,0,0.40)',
    black50: 'rgba(0,0,0,0.50)',
    white10: 'rgba(255,255,255,0.10)',
    white20: 'rgba(255,255,255,0.20)',
    white30: 'rgba(255,255,255,0.30)',
  },
};

const API_ORIGIN = resolveConfiguredApiOrigin();

const SERMONS_ENDPOINT = `${API_ORIGIN}/api/v1/sermons?sort=newest`;

function isStaticImageData(x: any): x is StaticImageData {
  return (
    !!x &&
    typeof x === 'object' &&
    typeof x.src === 'string' &&
    'height' in x &&
    'width' in x
  );
}

function isSimpleImage(image: any): boolean {
  return typeof image === 'string' || isStaticImageData(image);
}

function normalizeImage(
  image: any,
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
    const src =
      typeof image.src === 'string' ? image.src : image.src?.src || '';

    return {
      src: src || '/images/placeholder.webp',
      alt: image.alt || fallbackAlt,
      objectPosition: image.objectPosition,
    };
  }

  return { src: '/images/placeholder.webp', alt: fallbackAlt };
}

interface HeroSectionProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  showWaveText?: boolean;
  colorScheme?: ColorScheme;
  slides?: HeroSlide[];
}

const HeroSection = ({
  primaryButtonText = 'Join Our Community',
  secondaryButtonText = 'Watch Live Stream',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  showWaveText = true,
  colorScheme: externalColorScheme,
  slides: externalSlides,
}: HeroSectionProps) => {
  const theme = useTheme();
  const themeColors = theme?.colorScheme;
  const colorScheme =
    externalColorScheme || themeColors || FALLBACK_COLOR_SCHEME;

  const { open } = useServiceUnavailable();
  const { slides: backendSlides } = useHeroContent();

  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const waveTextRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [latestVideo, setLatestVideo] = useState<YouTubeVideo | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isCompactMobile, setIsCompactMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const onResize = () => {
      setIsCompactMobile(window.innerWidth < 768);
    };

    onResize();
    window.addEventListener('resize', onResize, { passive: true });

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const slideList: HeroSlide[] = useMemo(() => {
    const source = externalSlides || backendSlides;
    return Array.isArray(source) ? source.filter(Boolean) : [];
  }, [externalSlides, backendSlides]);

  const safeSlides: HeroSlide[] = useMemo(() => {
    if (slideList.length > 0) return slideList;

    return [
      {
        title: 'Welcome to The Wisdom Church',
        subtitle: 'Equipped and empowered for greatness',
        description:
          'A Spirit-filled family helping believers grow in faith, purpose, and community.',
        image: '/images/placeholder.webp',
      } as HeroSlide,
    ];
  }, [slideList]);

  const currentSlideData = safeSlides[currentSlide] ?? safeSlides[0];

  const fallbackUpcoming = {
    label: 'Upcoming',
    title: 'Wisdom Power Conference 26',
    date: 'Mar 21 - 23',
    time: 'Morning Session • Evening Session',
    location: 'Honors Gardens, Alasia opposite Dominion City Headquarters',
    ctaLabel: 'Reserve a seat',
    ctaTarget: '#programs',
  };

  const upcoming = (currentSlideData as any)?.upcoming ?? fallbackUpcoming;

  useWaveTextAnimation(waveTextRef, showWaveText, colorScheme);

  useEffect(() => {
    if (safeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % safeSlides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [safeSlides.length]);

  const scrollToNextSection = useCallback(() => {
    const nextSection = heroRef.current?.nextElementSibling;
    if (nextSection instanceof HTMLElement) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

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

  const handleUpcomingCta = useCallback(() => {
    if (!upcoming?.ctaTarget) {
      handleUnavailable('Reservations opening soon');
      return;
    }

    if (
      typeof upcoming.ctaTarget === 'string' &&
      upcoming.ctaTarget.startsWith('#')
    ) {
      const target = document.getElementById(upcoming.ctaTarget.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        handleUnavailable('Reservations opening soon');
      }
      return;
    }

    if (typeof upcoming.ctaTarget === 'string') {
      window.location.href = upcoming.ctaTarget;
      return;
    }

    handleUnavailable('Reservations opening soon');
  }, [upcoming, handleUnavailable]);

  const handlePrimaryClick = useCallback(() => {
    if (onPrimaryButtonClick) {
      onPrimaryButtonClick();
      return;
    }
    handleUnavailable('Join our community');
  }, [onPrimaryButtonClick, handleUnavailable]);

  const handleSecondaryClick = useCallback(() => {
    if (onSecondaryButtonClick) {
      onSecondaryButtonClick();
      return;
    }
    handleUnavailable('Live stream coming soon');
  }, [onSecondaryButtonClick, handleUnavailable]);

  useEffect(() => {
    let mounted = true;

    const fetchLatest = async () => {
      setVideoLoading(true);

      try {
        const res = await fetch(SERMONS_ENDPOINT, {
          method: 'GET',
          cache: 'no-store',
          credentials: 'omit',
          headers: {
            Accept: 'application/json',
          },
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

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const parallaxEls = gsap.utils.toArray(
        '[data-parallax]'
      ) as HTMLElement[];

      parallaxEls.forEach((el: HTMLElement) => {
        const speed = Number(el.dataset.parallax ?? 0.2);

        gsap.to(el, {
          yPercent: speed * 20,
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

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        waveTextRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
        .fromTo(
          titleRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.25'
        )
        .fromTo(
          subtitleRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.35'
        )
        .fromTo(
          descriptionRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.35'
        )
        .fromTo(
          buttonsRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          cardsRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.2'
        )
        .fromTo(
          scrollIndicatorRef.current,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45 },
          '-=0.25'
        );

      gsap.to(waveTextRef.current, {
        y: 5,
        duration: 1.8,
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
      className="relative w-full min-h-[82vh] overflow-hidden bg-black sm:min-h-[88vh] md:min-h-[95vh] lg:min-h-[100vh]"
    >
      {safeSlides.map((slide, index) => {
        const img = normalizeImage(
          slide.image,
          (slide as any)?.title || `Slide ${index + 1}`
        );

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-800 ease-in-out ${
              index === currentSlide ? 'z-10 opacity-100' : 'z-0 opacity-0'
            }`}
          >
            <div className="relative h-full w-full" data-parallax="0.25">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={80}
                className="object-cover"
                style={{
                  objectPosition:
                    img.objectPosition ||
                    (isSimpleImage(slide.image) ? 'center' : 'center 28%'),
                }}
              />

              <div
                className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/70 sm:from-black/60 sm:via-black/35 sm:to-black/60"
                data-parallax="0.15"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent sm:from-black/75 sm:via-black/45"
                data-parallax="0.1"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 sm:from-black/35 sm:to-black/35"
                data-parallax="0.08"
              />
              <div className="hero-matte absolute inset-0 opacity-30" />
            </div>
          </div>
        );
      })}

      <Container
        size="xl"
        className="relative z-20 flex min-h-[82vh] items-center px-4 pb-10 pt-8 sm:min-h-[88vh] sm:px-6 sm:pt-12 sm:pb-14 md:min-h-[95vh] md:px-8 lg:min-h-[100vh] lg:px-12 lg:pt-20"
      >
        <div className="flex w-full max-w-6xl flex-col items-center gap-5 sm:items-start sm:gap-8 lg:gap-10">
          {showWaveText && (
            <div className="mb-4 mt-2 flex w-full justify-center sm:mt-8 sm:mb-7 sm:justify-start md:mb-8 lg:mt-12 lg:mb-9">
              <div
                ref={waveTextRef}
                className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-2.5 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:gap-3 sm:px-4 sm:py-3"
                style={{ opacity: 0.97 }}
              >
                <span
                  className="h-2 w-2 rounded-full shadow-[0_0_12px_currentColor]"
                  style={{ backgroundColor: colorScheme.primary }}
                />
                <span
                  className="flex items-center gap-2 text-[0.56rem] font-medium uppercase leading-tight tracking-[0.12em] sm:text-[0.7rem] md:text-[0.78rem]"
                  style={{
                    color: '#fff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.45)',
                  }}
                >
                  <span
                    className="inline-block bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(120deg, ${colorScheme.primaryLight} 0%, #ffffff 35%, ${colorScheme.primary} 70%, ${colorScheme.primaryDark} 100%)`,
                      WebkitBackgroundClip: 'text',
                    }}
                  >
                    THE WAVE OF GREATNESS
                  </span>
                </span>
                <div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    boxShadow:
                      '0 0 0 1px rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.35)',
                  }}
                />
              </div>
            </div>
          )}

          <div className="relative flex w-full max-w-5xl flex-col gap-4 text-center sm:text-left sm:gap-5 md:gap-6 lg:gap-7">
            <H1
              ref={titleRef}
              className="text-center font-medium leading-tight tracking-tight sm:text-left"
              style={{
                color: '#FFFFFF',
                textShadow:
                  '0 2px 10px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(0, 0, 0, 0.6)',
              }}
              useThemeColor={false}
            >
              <span className="block text-xl leading-[1.15] xs:text-[1.9rem] sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl">
                {renderTitle((currentSlideData as any)?.title, colorScheme)}
              </span>
            </H1>

            <div
              className="h-px w-16 rounded-full sm:w-20 md:w-24 lg:w-28"
              style={{
                backgroundColor: colorScheme.primary,
                backgroundImage: `linear-gradient(90deg, transparent, ${colorScheme.primary}, transparent)`,
                boxShadow: `0 0 12px ${colorScheme.opacity.primary30}`,
              }}
            />

            {(currentSlideData as any)?.subtitle ? (
              <H2
                ref={subtitleRef}
                className="text-center sm:text-left"
                style={{
                  color: colorScheme.primary,
                  textShadow:
                    '0 1px 6px rgba(0, 0, 0, 0.8), 0 2px 12px rgba(0, 0, 0, 0.6)',
                }}
                useThemeColor={false}
                weight="medium"
                smWeight="semibold"
              >
                <span className="block text-[0.82rem] leading-[1.35] sm:text-base md:text-lg lg:text-xl xl:text-[1.35rem]">
                  {renderSubtitle((currentSlideData as any)?.subtitle)}
                </span>
              </H2>
            ) : null}

            <p
              ref={descriptionRef}
              className="hidden max-w-2xl text-[12px] leading-relaxed text-white/80 sm:block sm:text-sm md:text-base"
            >
              {(currentSlideData as any)?.description ||
                'A Spirit-filled family helping believers grow in faith, purpose, and community — equipped and empowered for greatness.'}
            </p>

            {isCompactMobile ? (
              <p className="mx-auto max-w-sm text-[12px] leading-relaxed text-white/85 sm:mx-0">
                A Spirit-filled family helping believers grow in faith and
                purpose.
              </p>
            ) : null}

            <div
              ref={buttonsRef}
              className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row sm:justify-start sm:gap-4 md:gap-5"
            >
              <CustomButton
                variant="primary"
                size="md"
                curvature="xl"
                elevated
                onClick={handlePrimaryClick}
                className="group relative w-full overflow-hidden px-4 py-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:px-6 sm:py-3"
                style={{
                  background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                  color: '#FFFFFF',
                  boxShadow: `0 4px 15px ${colorScheme.opacity.primary25}`,
                }}
              >
                <span className="text-xs font-medium tracking-wide sm:text-sm">
                  {primaryButtonText}
                </span>
              </CustomButton>

              <CustomButton
                variant="outline"
                size="md"
                curvature="xl"
                onClick={handleSecondaryClick}
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  borderWidth: '1.5px',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                }}
                className={`w-full px-4 py-2 transition-all duration-200 hover:border-primary/80 hover:bg-white/10 sm:w-auto sm:px-6 sm:py-3 ${
                  isCompactMobile ? 'hidden' : ''
                }`}
              >
                <span className="text-xs font-medium tracking-wide sm:text-sm">
                  {secondaryButtonText}
                </span>
              </CustomButton>

              {isCompactMobile ? (
                <button
                  type="button"
                  onClick={handleSecondaryClick}
                  className="text-[12px] text-white/85 underline underline-offset-4"
                >
                  {secondaryButtonText}
                </button>
              ) : null}
            </div>
          </div>

          <div
            ref={cardsRef}
            className="hidden w-full grid-cols-1 gap-3 md:grid md:grid-cols-2 md:gap-4 lg:gap-5"
          >
            <div
              className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-5"
              data-parallax="0.12"
              data-gsap="reveal"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/30"
                  style={{ background: colorScheme.primary }}
                >
                  <CalendarClock className="h-5 w-5 text-black" />
                </div>
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/70">
                    {upcoming.label}
                  </p>
                  <p className="text-sm font-medium text-white">
                    {upcoming.title}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-[12px] text-white/85">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  <span>
                    {upcoming.date} • {upcoming.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{upcoming.location}</span>
                </div>
              </div>

              <div>
                <CustomButton
                  size="sm"
                  curvature="full"
                  elevated
                  onClick={handleUpcomingCta}
                  className="border border-white/20 px-4 py-2 text-[11px] font-medium hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                    color: '#FFFFFF',
                  }}
                >
                  {upcoming.ctaLabel ?? 'Reserve a seat'}
                </CustomButton>
              </div>
            </div>

            <div
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:p-5"
              data-parallax="0.18"
              data-gsap="reveal"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/20">
                  <PlayCircle className="h-5 w-5 text-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-[13px] font-medium text-white">
                    Watch live stream
                  </p>
                  <p className="text-[10px] text-white/60">
                    Latest message from YouTube
                  </p>
                </div>
              </div>

              {latestVideo ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="relative h-20 w-full overflow-hidden rounded-xl border border-white/15 bg-black/60 sm:w-32">
                    <img
                      src={
                        latestVideo.thumbnail ||
                        (latestVideo as any)?.thumbnails?.medium?.url ||
                        (latestVideo as any)?.thumbnails?.default?.url ||
                        '/images/placeholder.webp'
                      }
                      alt={latestVideo.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                      <PlayCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[13px] font-medium text-white">
                      {latestVideo.title}
                    </p>
                    <p className="text-[11px] text-white/60">
                      Tap to watch now
                    </p>
                  </div>

                  <a
                    href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex self-start rounded-full px-4 py-2 text-[11px] font-medium shadow-lg transition hover:scale-[1.04] sm:self-auto"
                    style={{
                      background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                      color: '#FFFFFF',
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <PlayCircle className="h-4 w-4" /> Play
                    </span>
                  </a>
                </div>
              ) : (
                <CustomButton
                  variant="outline"
                  size="sm"
                  curvature="full"
                  onClick={handleSecondaryClick}
                  className="self-start border border-white/40 px-4 py-2 text-[11px] text-white hover:border-primary/80 hover:bg-white/10"
                >
                  {videoLoading ? 'Loading…' : 'Watch'}
                </CustomButton>
              )}
            </div>
          </div>

          {isCompactMobile ? (
            <div className="w-full space-y-3">
              <div className="w-full rounded-2xl border border-white/15 bg-black/45 px-4 py-3 text-center backdrop-blur-xl">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/65">
                  {upcoming.label}
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {upcoming.title}
                </p>
              </div>

              <div className="w-full rounded-2xl border border-white/10 bg-black/55 p-3 backdrop-blur-xl">
                <div className="mb-2 flex items-start gap-2">
                  <PlayCircle className="mt-0.5 h-4 w-4 text-white" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white">
                      Latest message from YouTube
                    </p>
                    <p className="text-[10px] text-white/65">
                      Tap to watch now
                    </p>
                  </div>
                </div>

                {latestVideo ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/15 bg-black/45 p-2.5"
                  >
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black/60">
                      <img
                        src={
                          latestVideo.thumbnail ||
                          (latestVideo as any)?.thumbnails?.medium?.url ||
                          (latestVideo as any)?.thumbnails?.default?.url ||
                          '/images/placeholder.webp'
                        }
                        alt={latestVideo.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                        <PlayCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="line-clamp-2 text-xs text-white/90">
                      {latestVideo.title}
                    </p>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleSecondaryClick}
                    className="w-full rounded-xl border border-white/25 px-3 py-2 text-xs text-white/90"
                  >
                    {videoLoading ? 'Loading latest message…' : 'Watch live'}
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </Container>

      {safeSlides.length > 1 && (
        <div className="absolute bottom-11 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-2.5 py-1.5 backdrop-blur-md sm:bottom-14">
          {safeSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className="rounded-full border border-white/25 transition-all duration-300 ease-out"
              style={{
                width: currentSlide === index ? '12px' : '4px',
                height: '4px',
                backgroundColor:
                  currentSlide === index
                    ? colorScheme.primary
                    : 'rgba(255,255,255,0.22)',
                boxShadow:
                  currentSlide === index
                    ? `0 0 8px ${colorScheme.opacity.primary30}`
                    : 'none',
              }}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index}
            />
          ))}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div
          className="mx-auto h-px w-[min(94%,1200px)] rounded-full opacity-90"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent 0%, ${colorScheme.primary} 50%, transparent 100%)`,
            boxShadow: `0 0 10px ${colorScheme.opacity.primary30}`,
          }}
        />
      </div>

      <ScrollIndicators
        scrollIndicatorRef={scrollIndicatorRef}
        scrollToNextSection={scrollToNextSection}
        colorScheme={colorScheme}
      />
    </Section>
  );
};

interface ScrollIndicatorsProps {
  scrollIndicatorRef: React.RefObject<HTMLDivElement | null>;
  scrollToNextSection: () => void;
  colorScheme: ColorScheme;
}

const ScrollIndicators = ({
  scrollIndicatorRef,
  scrollToNextSection,
  colorScheme,
}: ScrollIndicatorsProps) => (
  <>
    <div
      ref={scrollIndicatorRef}
      className="absolute bottom-0 left-1/2 z-30 hidden -translate-x-1/2 cursor-pointer sm:bottom-1.5 sm:block md:bottom-2"
      onClick={scrollToNextSection}
      aria-label="Scroll to next section"
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToNextSection();
        }
      }}
    >
      <div className="flex flex-col items-center">
        <ChevronDown
          className="h-5 w-5 animate-bounce md:h-6 md:w-6"
          style={{
            color: colorScheme.primary,
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
          }}
        />
        <span className="mt-1 text-xs font-medium tracking-wider text-white/60 sm:text-sm">
          SCROLL
        </span>
      </div>
    </div>

    <div
      className="absolute bottom-0 left-1/2 z-30 -translate-x-1/2 cursor-pointer pb-1 sm:hidden"
      onClick={scrollToNextSection}
      aria-label="Scroll to next section"
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToNextSection();
        }
      }}
    >
      <div className="flex flex-col items-center">
        <ChevronDown
          className="h-3.5 w-3.5 animate-bounce"
          style={{
            color: colorScheme.primary,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
          }}
        />
      </div>
    </div>
  </>
);

export default HeroSection;
