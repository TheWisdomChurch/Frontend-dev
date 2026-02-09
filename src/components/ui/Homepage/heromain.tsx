/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CalendarClock, MapPin, PlayCircle, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';
import { H1, H2 } from '../../text';
import CustomButton from '../../utils/buttons/CustomButton';
import { Section, Container } from '../../layout';
import { ColorScheme } from '../../colors/colorScheme';
import { defaultSlides } from '@/lib/data';
import { renderTitle,  renderSubtitle } from '@/components/utils/heroTextUtil';
import { useWaveTextAnimation } from '@/components/utils/hooks/mainHeroHooks/useWaveText';
import type { YouTubeVideo } from '@/lib/types';
import Image from 'next/image';

// Register GSAP plugins once on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/** Slide type inferred from your data */
type Slide = (typeof defaultSlides)[number];

interface HeroSectionProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  showWaveText?: boolean;
  colorScheme?: ColorScheme;
  slides?: Slide[];
}

/** Normalize slide image input to Next/Image src + alt */
function normalizeImage(
  image: any,
  fallbackAlt: string
): { src: string | StaticImageData; alt: string } {
  // string URL
  if (typeof image === 'string') {
    return { src: image, alt: fallbackAlt };
  }

  // Next static import: has `src` and other props
  if (image && typeof image === 'object' && typeof image.src === 'string') {
    // if your object also contains alt, use it
    return { src: image as StaticImageData, alt: image.alt || fallbackAlt };
  }

  // custom shape {src, alt}
  if (image && typeof image === 'object' && 'src' in image) {
    return { src: (image as any).src, alt: (image as any).alt || fallbackAlt };
  }

  // last resort
  return { src: '/images/placeholder.jpg', alt: fallbackAlt };
}

const HeroSection = ({
  primaryButtonText = 'Join Our Community',
  secondaryButtonText = 'Watch Live Stream',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  showWaveText = true,
  colorScheme: externalColorScheme,
  slides = defaultSlides,
}: HeroSectionProps) => {
  const { colorScheme: themeColors } = useTheme();
  const colorScheme = externalColorScheme || themeColors;
  const { open } = useServiceUnavailable();

  // Create refs
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

  // Simple slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideList = slides.length ? slides : defaultSlides;
  const currentSlideData = slideList[currentSlide] ?? defaultSlides[0];
  const fallbackUpcoming = {
    label: 'Upcoming',
    title: 'Wisdom Power Conference 26',
    date: 'Mar 21 - 23',
    time: 'Morning session 9:00 PM WAT & Evening Session 5:00 Pm',
    location: 'Honors Gardens, Alasia opposite Dominion City Headquarters',
    ctaLabel: 'Reserve a seat',
    ctaTarget: '#programs',
  };
  const upcoming = currentSlideData.upcoming ?? fallbackUpcoming;

  // Animation functions
  const animateContentEntrance = useCallback((): gsap.core.Timeline => {
    const tl = gsap.timeline();

    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        0
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.3
      );
    }

    if (descriptionRef.current) {
      tl.fromTo(
        descriptionRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.5
      );
    }

    if (buttonsRef.current?.children?.length) {
      tl.fromTo(
        buttonsRef.current.children,
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.4)',
        },
        0.7
      );
    }

    return tl;
  }, []);

  useWaveTextAnimation(waveTextRef, showWaveText, colorScheme);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideList.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slideList.length]);

  const scrollToNextSection = useCallback(() => {
    const nextSection = heroRef.current?.nextElementSibling;
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (!upcoming.ctaTarget) {
      handleUnavailable('Reservations opening soon');
      return;
    }
    if (upcoming.ctaTarget.startsWith('#')) {
      const target = document.getElementById(upcoming.ctaTarget.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        handleUnavailable('Reservations opening soon');
      }
      return;
    }
    if (upcoming.ctaTarget) {
      window.location.href = upcoming.ctaTarget;
    } else {
      handleUnavailable('Reservations opening soon');
    }
  }, [upcoming.ctaTarget, handleUnavailable]);

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

  // Pull newest YouTube video for hero card
  useEffect(() => {
    let mounted = true;
    const fetchLatest = async () => {
      setVideoLoading(true);
      try {
        const res = await fetch('/api/sermons?sort=newest', { cache: 'force-cache' });
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

  // Cleanup on unmount
  // No hero-level entrance animation; keep content visible instantly
  useEffect(() => {}, []);

  // Parallax layers inside hero
  useEffect(() => {
    if (!heroRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const parallaxEls = gsap.utils.toArray<HTMLElement>('[data-parallax]');
      parallaxEls.forEach((el) => {
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

  return (
    <Section
      ref={heroRef}
      padding="none"
      fullHeight={false}
      perf="none"
      className="relative w-full min-h-[100vh] md:min-h-[105vh] lg:min-h-[110vh] overflow-hidden bg-black"
    >
      {/* Background Slides - FIXED: Proper image handling */}
      {slideList.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-800 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="relative w-full h-full" data-parallax="0.25">
            {/* Handle both StaticImageData and simple object types */}
            <Image
              src={slide.image.src}
              alt={slide.image.alt || slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={80}
              className="object-cover"
              style={{ objectPosition: isSimpleImage(slide.image) ? 'center' : 'center 28%' }}
            />

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/60" data-parallax="0.15" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-transparent" data-parallax="0.1" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35" data-parallax="0.08" />
            <div className="hero-matte absolute inset-0 opacity-30" />
          </div>
        </div>
      ))}

      {/* Hero Content */}
      <Container
        size="xl"
        className="relative z-20 min-h-[100vh] md:min-h-[105vh] lg:min-h-[110vh] flex items-center px-4 sm:px-6 md:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20"
      >
        <div className="w-full flex flex-col gap-10 lg:gap-12 xl:gap-14 items-start max-w-6xl">
          {/* Wave of Greatness Text */}
          {showWaveText && (
            <div className="w-full flex justify-start mt-2 sm:mt-4 lg:mt-6 mb-6 sm:mb-8 md:mb-9 lg:mb-10">
              <div
                ref={waveTextRef}
                className="relative inline-flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                style={{ opacity: 0.97 }}
              >
                <span
                  className="h-2 w-2 rounded-full shadow-[0_0_12px_currentColor]"
                  style={{ backgroundColor: colorScheme.primary }}
                />
                <span
                  className="flex items-center gap-2 uppercase tracking-[0.18em] font-black text-[0.78rem] sm:text-[0.9rem] md:text-[1rem] leading-tight"
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

          {/* Main Title */}
          <div className="relative flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-9 w-full max-w-5xl">
            <H1
              ref={titleRef}
              className="leading-tight tracking-tight font-black text-left"
              style={{
                color: '#FFFFFF',
                textShadow:
                  '0 2px 10px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(0, 0, 0, 0.6)',
              }}
              useThemeColor={false}
            >
              <span className="text-3xl xs:text-[2.5rem] sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl block">
                {renderTitle(currentSlideData.title, colorScheme)}
              </span>
            </H1>

            {/* Divider Line */}
            <div
              className="h-0.5 w-20 sm:w-24 md:w-28 lg:w-32 rounded-full"
              style={{
                backgroundColor: colorScheme.primary,
                backgroundImage: `linear-gradient(90deg, transparent, ${colorScheme.primary}, transparent)`,
                boxShadow: `0 0 12px ${colorScheme.opacity.primary30}`,
              }}
            />

            {/* Subtitle */}
            {currentSlideData.subtitle && (
              <H2
                ref={subtitleRef}
                className="text-left"
                style={{
                  color: colorScheme.primary,
                  textShadow:
                    '0 1px 6px rgba(0, 0, 0, 0.8), 0 2px 12px rgba(0, 0, 0, 0.6)',
                }}
                useThemeColor={false}
                weight="bold"
                smWeight="extrabold"
              >
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[2.25rem] block">
                  {renderSubtitle(currentSlideData.subtitle)}
                </span>
              </H2>
            )}

            {/* Buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-start items-center pt-2"
            >
              <CustomButton
                variant="primary"
                size="md"
                curvature="xl"
                elevated={true}
                onClick={handlePrimaryClick}
                className="group relative overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full sm:w-auto px-5 py-2.5 sm:px-7 sm:py-3.5"
                style={{
                  background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                  color: colorScheme.buttonText || '#000000',
                  boxShadow: `0 4px 15px ${colorScheme.opacity.primary25}`,
                }}
              >
                <span className="text-sm sm:text-base md:text-lg font-semibold tracking-wide">
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
                className="hover:border-primary/80 hover:bg-white/10 transition-all duration-200 w-full sm:w-auto px-5 py-2.5 sm:px-7 sm:py-3.5"
              >
                <span className="text-sm sm:text-base md:text-lg font-semibold tracking-wide">
                  {secondaryButtonText}
                </span>
              </CustomButton>
            </div>
          </div>
          <div
            ref={cardsRef}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6"
          >
            <div
              className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-5 sm:p-6 flex flex-col gap-3"
              data-parallax="0.12"
              data-gsap="reveal"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-11 w-11 rounded-2xl flex items-center justify-center border border-white/30"
                  style={{ background: colorScheme.primary }}
                >
                  <CalendarClock className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70 font-semibold">
                    {upcoming.label}
                  </p>
                  <p className="text-lg text-white font-semibold">
                    {upcoming.title}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-white/85">
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
                  className="px-4 py-2 text-xs font-semibold bg-white text-black border border-white/30 hover:scale-[1.02]"
                >
                  {upcoming.ctaLabel ?? 'Reserve a seat'}
                </CustomButton>
              </div>
            </div>

            <div
              className="rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl p-5 sm:p-6 flex flex-col gap-4"
              data-parallax="0.18"
              data-gsap="reveal"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl border border-white/20 flex items-center justify-center shrink-0">
                  <PlayCircle className="w-5 h-5 text-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm text-white font-semibold">
                    Watch live stream
                  </p>
                  <p className="text-xs text-white/60">Latest message from YouTube</p>
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
                    <p className="text-white text-sm font-semibold line-clamp-2">
                      {latestVideo.title}
                    </p>
                    <p className="text-white/60 text-xs">Tap to watch now</p>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:scale-[1.04] transition shadow-lg self-start sm:self-auto"
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
                  className="px-4 py-2 text-xs text-white border border-white/40 hover:border-primary/80 hover:bg-white/10 self-start"
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
        <div className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
          {slideList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-200 ${
                currentSlide === index ? 'scale-110' : 'scale-90'
              }`}
              style={{
                backgroundColor:
                  currentSlide === index ? colorScheme.primary : 'rgba(255,255,255,0.3)',
                boxShadow:
                  currentSlide === index ? `0 0 6px ${colorScheme.primary}` : 'none',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicators */}
      <ScrollIndicators
        scrollIndicatorRef={scrollIndicatorRef}
        scrollToNextSection={scrollToNextSection}
        colorScheme={colorScheme}
      />
    </Section>
  );
};

// Extracted Scroll Indicators component
interface ScrollIndicatorsProps {
  scrollIndicatorRef: React.RefObject<HTMLDivElement | null>;
  scrollToNextSection: () => void;
  colorScheme: ColorScheme;
}

const ScrollIndicators = ({ scrollIndicatorRef, scrollToNextSection, colorScheme }: ScrollIndicatorsProps) => (
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
        <span className="text-xs sm:text-sm mt-1 text-white/60 font-medium tracking-wider">SCROLL</span>
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
