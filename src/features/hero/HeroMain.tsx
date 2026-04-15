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
  const { slides: backendSlides } = useHeroContent();

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

  // Cinematic text reveal
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

      // Keep the wave badge subtly alive after entrance.
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
      className="relative w-full min-h-[90vh] md:min-h-[95vh] lg:min-h-[100vh] overflow-hidden bg-black"
    >
      {/* Background Slides (✅ fixed alt typing + src normalization) */}
      {slideList.map((slide, index) => {
        const img = normalizeImage(
          slide.image,
          (slide as any)?.title || `Slide ${index + 1}`
        );

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-800 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="relative w-full h-full" data-parallax="0.25">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={80}
                className="object-cover"
                style={{
                  // if your custom object provides objectPosition use it; else default
                  objectPosition:
                    img.objectPosition ||
                    (isSimpleImage(slide.image) ? 'center' : 'center 28%'),
                }}
              />

              {/* overlays */}
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

      {/* Hero Content */}
      <Container
        size="xl"
        className="relative z-20 min-h-[90vh] md:min-h-[95vh] lg:min-h-[100vh] flex items-center px-4 sm:px-6 md:px-8 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16"
      >
        <div className="w-full flex flex-col gap-6 sm:gap-8 lg:gap-10 items-center sm:items-start max-w-6xl">
          {/* Wave label */}
          {showWaveText && (
            <div className="w-full flex justify-start mt-8 sm:mt-10 lg:mt-12 mb-5 sm:mb-7 md:mb-8 lg:mb-9">
              <div
                ref={waveTextRef}
                className="relative inline-flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full border border-white/15 bg-white/8 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                style={{ opacity: 0.97 }}
              >
                <span
                  className="h-2 w-2 rounded-full shadow-[0_0_12px_currentColor]"
                  style={{ backgroundColor: colorScheme.primary }}
                />
                <span
                  className="flex items-center gap-2 uppercase tracking-[0.16em] font-medium text-[0.62rem] sm:text-[0.7rem] md:text-[0.78rem] leading-tight"
                  style={{
                    color: '#fff',
                    textShadow: `0 2px 10px rgba(0,0,0,0.45)`,
                  }}
                >
                  <span
                    className="inline-block text-transparent bg-clip-text"
                    style={{
                      backgroundImage: `linear-gradient(120deg, ${colorScheme.primaryLight} 0%, #ffffff 35%, ${colorScheme.primary} 70%, ${colorScheme.primaryDark} 100%)`,
                      WebkitBackgroundClip: 'text',
                    }}
                  >
                    THE WAVE OF GREATNESS
                  </span>
                </span>
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.35)`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Title block */}
          <div className="relative flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7 w-full max-w-5xl text-center sm:text-left">
            <H1
              ref={titleRef}
              className="leading-tight tracking-tight font-medium text-center sm:text-left"
              style={{
                color: '#FFFFFF',
                textShadow:
                  '0 2px 10px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(0, 0, 0, 0.6)',
              }}
              useThemeColor={false}
            >
              <span className="text-xl xs:text-[1.9rem] sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl block leading-[1.15]">
                {renderTitle((currentSlideData as any)?.title, colorScheme)}
              </span>
            </H1>

            <div
              className="h-px w-16 sm:w-20 md:w-24 lg:w-28 rounded-full"
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
                <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[1.35rem] block leading-[1.3]">
                  {renderSubtitle((currentSlideData as any)?.subtitle)}
                </span>
              </H2>
            ) : null}

            <p
              ref={descriptionRef}
              className="text-[12px] sm:text-sm md:text-base text-white/80 leading-relaxed max-w-2xl"
            >
              {(currentSlideData as any)?.description ||
                'A Spirit-filled family helping believers grow in faith, purpose, and community — equipped and empowered for greatness.'}
            </p>

            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center sm:justify-start items-center pt-1"
            >
              <CustomButton
                variant="primary"
                size="md"
                curvature="xl"
                elevated
                onClick={handlePrimaryClick}
                className="group relative overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3"
                style={{
                  background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                  color: '#FFFFFF',
                  boxShadow: `0 4px 15px ${colorScheme.opacity.primary25}`,
                }}
              >
                <span className="text-xs sm:text-sm font-medium tracking-wide">
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
                className="hover:border-primary/80 hover:bg-white/10 transition-all duration-200 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3"
              >
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  {secondaryButtonText}
                </span>
              </CustomButton>
            </div>
          </div>

          {/* Cards */}
          <div
            ref={cardsRef}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-5"
          >
            <div
              className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-4 sm:p-5 flex flex-col gap-3"
              data-parallax="0.12"
              data-gsap="reveal"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-2xl flex items-center justify-center border border-white/30"
                  style={{ background: colorScheme.primary }}
                >
                  <CalendarClock className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-white/70 font-medium">
                    {upcoming.label}
                  </p>
                  <p className="text-sm text-white font-medium">
                    {upcoming.title}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-[12px] text-white/85">
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

              <div>
                <CustomButton
                  size="sm"
                  curvature="full"
                  elevated
                  onClick={handleUpcomingCta}
                  className="px-4 py-2 text-[11px] font-medium border border-white/20 hover:scale-[1.02]"
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
              className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-4 sm:p-5 flex flex-col gap-4"
              data-parallax="0.18"
              data-gsap="reveal"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl border border-white/20 flex items-center justify-center shrink-0">
                  <PlayCircle className="w-5 h-5 text-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-[13px] text-white font-medium">
                    Watch live stream
                  </p>
                  <p className="text-[10px] text-white/60">
                    Latest message from YouTube
                  </p>
                </div>
              </div>

              {latestVideo ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
                  <div className="relative h-20 w-full sm:w-32 rounded-xl overflow-hidden border border-white/15 bg-black/60">
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
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <PlayCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[13px] font-medium line-clamp-2">
                      {latestVideo.title}
                    </p>
                    <p className="text-white/60 text-[11px]">
                      Tap to watch now
                    </p>
                  </div>

                  <a
                    href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-medium hover:scale-[1.04] transition shadow-lg self-start sm:self-auto"
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
                  className="px-4 py-2 text-[11px] text-white border border-white/40 hover:border-primary/80 hover:bg-white/10 self-start"
                >
                  {videoLoading ? 'Loading…' : 'Watch'}
                </CustomButton>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Slide Indicators */}
      {slideList.length > 1 && (
        <div className="absolute bottom-11 sm:bottom-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-2.5 py-1.5 backdrop-blur-md">
          {slideList.map((_, index) => (
            <button
              key={index}
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
