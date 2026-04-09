/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CalendarClock, MapPin, PlayCircle, ChevronDown } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';

import { useTheme } from '../../contexts/ThemeContext';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';
import { H1, H2 } from '../../text';
import CustomButton from '../../utils/buttons/CustomButton';
import { Section, Container } from '../../layout';
import type { ColorScheme } from '../../colors/colorScheme';

import { useHeroContent, type HeroSlide } from '@/hooks/useHeroContent';
import { renderTitle, renderSubtitle } from '@/components/utils/heroTextUtil';
import { useWaveTextAnimation } from '@/components/utils/hooks/mainHeroHooks/useWaveText';
import type { YouTubeVideo } from '@/lib/types';

// Register GSAP plugins once on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/* Types (simplified for backend structure)
----------------------------------------------------------------------------- */

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

/**
 * Normalize slide.image for Next/Image
 */
function normalizeImage(
  image: any,
  fallbackAlt = 'Slide image'
): {
  src: string;
  alt: string;
  objectPosition?: string;
} {
  if (typeof image === 'string') {
    return { src: image, alt: fallbackAlt };
  }

  if (isStaticImageData(image)) {
    return { src: image.src, alt: fallbackAlt };
  }

  if (typeof image === 'object' && 'src' in image) {
    const src =
      typeof image.src === 'string' ? image.src : image.src?.src || '';
    return {
      src: src || '/images/placeholder.jpg',
      alt: image.alt || fallbackAlt,
      objectPosition: image.objectPosition,
    };
  }

  return { src: '/images/placeholder.jpg', alt: fallbackAlt };
}

/* Props
----------------------------------------------------------------------------- */
interface HeroSectionProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  showWaveText?: boolean;
  colorScheme?: ColorScheme;
  slides?: HeroSlide[]; // Backend-driven slides
}

/* ----------------------------------------------------------------------------
   Component
----------------------------------------------------------------------------- */
/* Component
----------------------------------------------------------------------------- */
const HeroSection = ({
  primaryButtonText = 'Join Our Community',
  secondaryButtonText = 'Watch Live Stream',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  showWaveText = true,
  colorScheme: externalColorScheme,
  slides: externalSlides,
}: HeroSectionProps) => {
  const { colorScheme: themeColors } = useTheme();
  const colorScheme = externalColorScheme || themeColors;
  const { open } = useServiceUnavailable();

  // Fetch backend hero content
  const { slides: backendSlides, loading: contentLoading } = useHeroContent();

  // Use external slides if provided, otherwise use backend slides
  const slidesToUse = externalSlides || backendSlides;

  // Refs
  const heroRef = useRef<HTMLDivElement>(null!);
  const titleRef = useRef<HTMLHeadingElement>(null!);
  const subtitleRef = useRef<HTMLHeadingElement>(null!);
  const descriptionRef = useRef<HTMLParagraphElement>(null!);
  const buttonsRef = useRef<HTMLDivElement>(null!);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null!);
  const waveTextRef = useRef<HTMLDivElement>(null!);
  const cardsRef = useRef<HTMLDivElement>(null!);

  const [latestVideo, setLatestVideo] = useState<YouTubeVideo | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideList: HeroSlide[] = useMemo(() => {
    return slidesToUse && slidesToUse.length > 0 ? slidesToUse : [];
  }, [slidesToUse]);

  const currentSlideData = slideList[currentSlide] ?? slideList[0];

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

  // wave text
  useWaveTextAnimation(waveTextRef, showWaveText, colorScheme);

  // Auto-rotate slides
  useEffect(() => {
    if (slideList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideList.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slideList.length]);

  const scrollToNextSection = useCallback(() => {
    const nextSection = heroRef.current?.nextElementSibling;
    if (nextSection)
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      else handleUnavailable('Reservations opening soon');
      return;
    }

    window.location.href = upcoming.ctaTarget;
  }, [upcoming, handleUnavailable]);

  const handlePrimaryClick = useCallback(() => {
    if (onPrimaryButtonClick) return onPrimaryButtonClick();
    handleUnavailable('Join our community');
  }, [onPrimaryButtonClick, handleUnavailable]);

  const handleSecondaryClick = useCallback(() => {
    if (onSecondaryButtonClick) return onSecondaryButtonClick();
    handleUnavailable('Live stream coming soon');
  }, [onSecondaryButtonClick, handleUnavailable]);

  // Pull newest YouTube video
  useEffect(() => {
    let mounted = true;

    const fetchLatest = async () => {
      setVideoLoading(true);
      try {
        const res = await fetch('/api/sermons?sort=newest', {
          cache: 'force-cache',
        });
        if (!res.ok) return;
        const data: YouTubeVideo[] = await res.json();
        if (mounted && data.length) setLatestVideo(data[0]);
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

  // Parallax layers inside hero
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

  const heroImage = normalizeImage(
    (currentSlideData as any)?.image,
    (currentSlideData as any)?.title || 'Hero image'
  );
  const heroDescription =
    (currentSlideData as any)?.description ||
    (currentSlideData as any)?.summary ||
    '';

  return (
    <Section
      ref={heroRef}
      padding="none"
      fullHeight={false}
      perf="none"
      className="relative w-full min-h-[78vh] sm:min-h-[90vh] md:min-h-[95vh] lg:min-h-[100vh] overflow-hidden bg-[#070707]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full blur-[120px] opacity-40"
          style={{
            background: `radial-gradient(circle, ${colorScheme.opacity.primary20}, transparent 65%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.85))]" />
      </div>

      <Container
        size="xl"
        className="relative z-20 min-h-[78vh] sm:min-h-[90vh] md:min-h-[95vh] lg:min-h-[100vh] flex items-center px-4 sm:px-6 md:px-8 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-16"
      >
        <div className="w-full space-y-6 sm:space-y-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
              {showWaveText && (
                <div className="flex justify-center sm:justify-start">
                  <div
                    ref={waveTextRef}
                    className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-3.5 py-2 text-[0.6rem] uppercase tracking-[0.18em] text-white/80"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: colorScheme.primary }}
                    />
                    The Wisdom Church
                  </div>
                </div>
              )}

              <H1
                ref={titleRef}
                className="leading-[1.12] tracking-tight font-medium"
                style={{
                  color: '#FFFFFF',
                  textShadow:
                    '0 10px 30px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.6)',
                }}
                useThemeColor={false}
              >
                <span className="block text-[1.65rem] xs:text-[1.9rem] sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.6rem]">
                  {renderTitle((currentSlideData as any)?.title, colorScheme)}
                </span>
              </H1>

              {(currentSlideData as any)?.subtitle ? (
                <H2
                  ref={subtitleRef}
                  className="text-center sm:text-left"
                  style={{
                    color: colorScheme.primary,
                    textShadow:
                      '0 1px 8px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.35)',
                  }}
                  useThemeColor={false}
                  weight="medium"
                  smWeight="semibold"
                >
                  <span className="block text-[0.9rem] sm:text-base md:text-lg lg:text-xl">
                    {renderSubtitle((currentSlideData as any)?.subtitle)}
                  </span>
                </H2>
              ) : null}

              {heroDescription ? (
                <p className="text-[0.86rem] sm:text-sm md:text-base text-white/70 leading-relaxed">
                  {heroDescription}
                </p>
              ) : null}

              <div
                ref={buttonsRef}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start"
              >
                <CustomButton
                  variant="primary"
                  size="md"
                  curvature="xl"
                  elevated
                  onClick={handlePrimaryClick}
                  className="w-full sm:w-auto px-5 py-2.5 text-[0.74rem] sm:text-sm font-medium tracking-wide"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                    color: '#FFFFFF',
                    boxShadow: `0 10px 26px ${colorScheme.opacity.primary25}`,
                  }}
                >
                  {primaryButtonText}
                </CustomButton>

                <CustomButton
                  variant="outline"
                  size="md"
                  curvature="xl"
                  onClick={handleSecondaryClick}
                  className="w-full sm:w-auto px-5 py-2.5 text-[0.74rem] sm:text-sm font-medium tracking-wide"
                  style={{
                    borderColor: 'rgba(255,255,255,0.35)',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                  }}
                >
                  {secondaryButtonText}
                </CustomButton>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-3xl overflow-hidden border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                  style={{
                    objectPosition: heroImage.objectPosition || 'center',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-0 border border-white/5" />
              </div>

              <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-white/15 bg-black/80 px-4 py-3 text-[0.72rem] sm:text-xs text-white/85 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-white/70" />
                    <span>{upcoming.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-white/70" />
                    <span className="line-clamp-1">{upcoming.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={cardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-5"
          >
            <div className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.16em] text-white/60">
                    {upcoming.label}
                  </p>
                  <p className="text-[0.92rem] sm:text-base text-white font-medium">
                    {upcoming.title}
                  </p>
                </div>
                <div
                  className="h-9 w-9 rounded-2xl flex items-center justify-center border border-white/30"
                  style={{ background: colorScheme.primary }}
                >
                  <CalendarClock className="w-4 h-4 text-black" />
                </div>
              </div>

              <div className="space-y-2 text-[0.72rem] sm:text-[12px] text-white/80">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4" />
                  <span>
                    {upcoming.date} • {upcoming.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{upcoming.location}</span>
                </div>
              </div>

              <CustomButton
                size="sm"
                curvature="full"
                elevated
                onClick={handleUpcomingCta}
                className="px-4 py-2 text-[0.72rem] sm:text-[11px] font-medium border border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                  color: '#FFFFFF',
                }}
              >
                {upcoming.ctaLabel ?? 'Reserve a seat'}
              </CustomButton>
            </div>

            <div className="rounded-2xl border border-white/12 bg-black/60 backdrop-blur-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-2xl border border-white/25 flex items-center justify-center shrink-0">
                  <PlayCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[0.92rem] sm:text-base text-white font-medium">
                    Watch the latest message
                  </p>
                  <p className="text-[0.7rem] sm:text-[11px] text-white/60">
                    YouTube & on-demand
                  </p>
                </div>
              </div>

              {latestVideo ? (
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-24 rounded-xl overflow-hidden border border-white/15">
                    <img
                      src={
                        latestVideo.thumbnail ||
                        (latestVideo as any)?.thumbnails?.medium?.url ||
                        (latestVideo as any)?.thumbnails?.default?.url ||
                        '/images/placeholder.jpg'
                      }
                      alt={latestVideo.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[0.8rem] sm:text-[12px] font-medium line-clamp-2">
                      {latestVideo.title}
                    </p>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-[0.7rem] sm:text-[11px] font-medium shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                      color: '#FFFFFF',
                    }}
                  >
                    <PlayCircle className="w-4 h-4" /> Play
                  </a>
                </div>
              ) : (
                <CustomButton
                  variant="outline"
                  size="sm"
                  curvature="full"
                  onClick={handleSecondaryClick}
                  className="px-4 py-2 text-[0.7rem] sm:text-[11px] text-white border border-white/40"
                >
                  {videoLoading ? 'Loading…' : 'Watch'}
                </CustomButton>
              )}
            </div>
          </div>
        </div>
      </Container>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div
          className="mx-auto h-px w-[min(94%,1200px)] rounded-full opacity-90"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent 0%, ${colorScheme.primary} 50%, transparent 100%)`,
            boxShadow: `0 0 10px ${colorScheme.opacity.primary30}`,
          }}
        />
      </div>

      {/* Scroll Indicators */}
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
      className="absolute bottom-0 sm:bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 z-30 hidden sm:block cursor-pointer"
      onClick={scrollToNextSection}
      aria-label="Scroll to next section"
    >
      <div className="flex flex-col items-center">
        <ChevronDown
          className="w-5 h-5 md:w-6 md:h-6 animate-bounce"
          style={{
            color: colorScheme.primary,
            filter: `drop-shadow(0 1px 3px rgba(0,0,0,0.5))`,
          }}
        />
        <span className="text-xs sm:text-sm mt-1 text-white/60 font-medium tracking-wider">
          SCROLL
        </span>
      </div>
    </div>

    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 sm:hidden cursor-pointer pb-1"
      onClick={scrollToNextSection}
      aria-label="Scroll to next section"
    >
      <div className="flex flex-col items-center">
        <ChevronDown
          className="w-3.5 h-3.5 animate-bounce"
          style={{
            color: colorScheme.primary,
            filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.5))`,
          }}
        />
      </div>
    </div>
  </>
);

export default HeroSection;
