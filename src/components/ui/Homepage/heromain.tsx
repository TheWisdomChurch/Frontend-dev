/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image, { type StaticImageData } from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CalendarClock, MapPin, ChevronDown } from 'lucide-react';

import { useTheme } from '../../contexts/ThemeContext';
import { H1, H2 } from '../../text';
import CustomButton from '../../utils/buttons/CustomButton';
import { Section, Container } from '../../layout';
import type { ColorScheme } from '../../colors/colorScheme';

import { defaultSlides } from '@/lib/data';
import { renderTitle, renderSubtitle } from '@/components/utils/heroTextUtil';
import { useAutoSlide } from '@/components/utils/hooks/mainHeroHooks/useAutoSlide';
import { useHeroAnimation } from '@/components/utils/hooks/mainHeroHooks/useheroAnimation';
import { useSlideAnimation } from '@/components/utils/hooks/mainHeroHooks/useSlideAnimation';
import { useWaveTextAnimation } from '@/components/utils/hooks/mainHeroHooks/useWaveText';

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
  slides = defaultSlides as Slide[],
}: HeroSectionProps) => {
  const { colorScheme: themeColors } = useTheme();
  const colorScheme = externalColorScheme || themeColors;

  // Refs (nullable-safe)
  const heroRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const waveTextRef = useRef<HTMLDivElement | null>(null);

  // State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Derived
  const slidesLength = slides.length;
  const isMultiSlide = slidesLength > 1;
  const safeIndex = Math.min(currentSlide, Math.max(0, slidesLength - 1));
  const currentSlideData = slides[safeIndex];

  const fallbackUpcoming = useMemo(
    () => ({
      label: 'Upcoming',
      title: 'Wisdom Power Conference 26',
      date: 'Mar 21 - 23',
      time: 'Morning session 9:00 AM WAT & Evening Session 5:00 PM',
      location: 'Honors Gardens, Alasia opposite Dominion City Headquarters',
      ctaLabel: 'Reserve a seat',
      ctaTarget: '#programs',
    }),
    []
  );

  const upcoming = currentSlideData?.upcoming ?? fallbackUpcoming;

  /** MOBILE FIXES:
   * - avoid h-screen on iOS Safari causing jumpy layout
   * - use min-heights that look good on mobile (no 118vh on phones)
   */
  const sectionClassName =
    'relative w-full overflow-hidden bg-black min-h-[86vh] sm:min-h-[92vh] md:min-h-[102vh] lg:min-h-[110vh]';

  /** Enhanced gradient overlays that behave better on mobile */
  const Overlay = useCallback(() => {
    return (
      <>
        {/* Mobile-first: stronger bottom fade for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 sm:from-black/90 sm:via-black/40 sm:to-black/10" />
        {/* subtle top shading */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55 sm:from-black/35 sm:to-black/50" />
        {/* side vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35" />
        {/* inner vignette */}
        <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 180px rgba(0,0,0,0.65)' }} />
      </>
    );
  }, []);

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

  const animateContentExit = useCallback((): gsap.core.Timeline => {
    const tl = gsap.timeline();

    const targets: Element[] = [];
    if (titleRef.current) targets.push(titleRef.current);
    if (subtitleRef.current) targets.push(subtitleRef.current);
    if (descriptionRef.current) targets.push(descriptionRef.current);

    if (buttonsRef.current?.children?.length) {
      targets.push(...Array.from(buttonsRef.current.children));
    }

    if (targets.length) {
      tl.to(targets, {
        y: -10,
        opacity: 0,
        duration: 0.4,
        stagger: 0.03,
        ease: 'power2.in',
      });
    }

    return tl;
  }, []);

  // Hooks (your existing animation architecture)
  const { cleanupAnimations } = useHeroAnimation(
    heroRef as any,
    scrollIndicatorRef as any,
    animateContentEntrance
  );

  const { animateSlideTransition } = useSlideAnimation(
    isAnimating,
    safeIndex,
    setIsAnimating,
    setCurrentSlide,
    slidesRef,
    animateContentExit,
    animateContentEntrance
  );

  useAutoSlide(isMultiSlide, isAnimating, safeIndex, slidesLength, animateSlideTransition);
  useWaveTextAnimation(waveTextRef as any, showWaveText, colorScheme);

  const scrollToNextSection = useCallback(() => {
    const nextSection = heroRef.current?.nextElementSibling;
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (!isAnimating && index !== safeIndex && isMultiSlide) {
        animateSlideTransition(index);
      }
    },
    [isAnimating, safeIndex, animateSlideTransition, isMultiSlide]
  );

  const handleUpcomingCta = useCallback(() => {
    if (!upcoming.ctaTarget) return;

    if (upcoming.ctaTarget.startsWith('#')) {
      const target = document.getElementById(upcoming.ctaTarget.slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.location.href = upcoming.ctaTarget;
  }, [upcoming.ctaTarget]);

  useEffect(() => cleanupAnimations, [cleanupAnimations]);

  const addToSlidesRef = useCallback((el: HTMLDivElement | null, index: number) => {
    slidesRef.current[index] = el;
  }, []);

  // Stable particle positions for nicer mobile rendering (optional)
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 12,
    }));
  }, []);

  return (
    <Section ref={heroRef as any} padding="none" fullHeight={false} className={sectionClassName}>
      {/* Background Slides (responsive + correct gradients) */}
      {slides.map((slide, index) => {
        const img = normalizeImage(slide.image, slide.title);

        return (
          <div
            key={index}
            ref={(el) => addToSlidesRef(el, index)}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === safeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="relative w-full h-full">
              {/* ✅ Use Next/Image for better mobile rendering */}
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
                style={{
                  // ✅ mobile-friendly crop
                  objectPosition: 'center 28%',
                }}
              />

              {/* ✅ fixed overlays */}
              <Overlay />

              {/* subtle particles (optional) */}
              <div className="absolute inset-0 opacity-[0.10]">
                {particles.map((p) => (
                  <span
                    key={p.id}
                    className="absolute rounded-full animate-float"
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      background: colorScheme.primary,
                      top: `${p.top}%`,
                      left: `${p.left}%`,
                      animationDelay: `${p.delay}s`,
                      animationDuration: `${p.duration}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Hero Content */}
      <Container
        size="xl"
        className="relative z-20 flex items-center justify-center px-4 sm:px-5 md:px-6 lg:px-8 py-16 sm:py-20 md:py-24"
      >
        <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto text-center">
          {/* Wave Text */}
          {showWaveText && (
            <div className="mb-2 sm:mb-3 md:mb-4 lg:mb-5 relative">
              <div ref={waveTextRef} className="flex justify-center items-center" style={{ opacity: 0.95 }}>
                {'THE WAVE OF GREATNESS'.split('').map((char, index) => (
                  <span
                    key={index}
                    className="wave-char inline-block will-change-transform"
                    style={{
                      fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
                      fontFamily: "'Bricolage Grotesque', 'Segoe UI', system-ui, sans-serif",
                      fontWeight: 700,
                      color: 'transparent',
                      backgroundImage: `linear-gradient(
                        135deg,
                        ${colorScheme.primaryLight} 0%,
                        #FFFFFF 30%,
                        ${colorScheme.primary} 60%,
                        ${colorScheme.primaryDark} 100%
                      )`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      textShadow: `0 0 8px ${colorScheme.opacity.primary40},
                                   0 0 12px ${colorScheme.opacity.primary20},
                                   0 1px 2px rgba(0,0,0,0.7)`,
                      padding: '0 0.03em',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      lineHeight: '1.2',
                      WebkitTextStroke: `0.2px ${colorScheme.primaryDark}`,
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <H1
            ref={titleRef as any}
            className="mb-3 sm:mb-4 md:mb-5 leading-tight tracking-tight font-black"
            style={{
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.6)',
            }}
            useThemeColor={false}
          >
            <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl block px-2">
              {renderTitle(currentSlideData.title, colorScheme)}
            </span>
          </H1>

          {/* Divider */}
          <div
            className="h-0.5 w-14 sm:w-18 md:w-22 lg:w-24 mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 rounded-full"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent, ${colorScheme.primary}, transparent)`,
              boxShadow: `0 0 12px ${colorScheme.opacity.primary30}`,
            }}
          />

          {/* Subtitle */}
          {currentSlideData.subtitle && (
            <H2
              ref={subtitleRef as any}
              className="mb-4 sm:mb-5 md:mb-6 lg:mb-7"
              style={{
                color: colorScheme.primary,
                textShadow: '0 1px 6px rgba(0,0,0,0.8), 0 2px 12px rgba(0,0,0,0.6)',
              }}
              useThemeColor={false}
              weight="bold"
              smWeight="extrabold"
            >
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl block">
                {renderSubtitle(currentSlideData.subtitle)}
              </span>
            </H2>
          )}

          {/* Buttons */}
          <div
            ref={buttonsRef as any}
            className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 justify-center items-center px-3 sm:px-0"
          >
            <CustomButton
              variant="primary"
              size="md"
              curvature="xl"
              elevated
              onClick={onPrimaryButtonClick}
              className="group relative overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                color: colorScheme.buttonText || '#000000',
                boxShadow: `0 4px 15px ${colorScheme.opacity.primary25}`,
              }}
            >
              <span className="text-sm sm:text-base md:text-lg font-medium">{primaryButtonText}</span>
            </CustomButton>

            <CustomButton
              variant="outline"
              size="md"
              curvature="xl"
              onClick={onSecondaryButtonClick}
              style={{
                borderColor: 'rgba(255, 255, 255, 0.4)',
                borderWidth: '1.5px',
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }}
              className="hover:border-primary/80 hover:bg-white/10 transition-all duration-200 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3"
            >
              <span className="text-sm sm:text-base md:text-lg font-medium">{secondaryButtonText}</span>
            </CustomButton>
          </div>
        </div>
      </Container>

      {/* Floating info rail (mobile-safe) */}
      <div className="absolute inset-x-0 bottom-3 sm:bottom-4 lg:bottom-5 z-30 px-4">
        <div className="mx-auto max-w-5xl grid grid-cols-1 gap-2.5 items-center">
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-2xl flex items-center justify-center border border-white/30"
                style={{ background: colorScheme.primary }}
              >
                <CalendarClock className="w-5 h-5 text-black" />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-[0.14em] text-white/70 font-semibold">{upcoming.label}</p>
                <p className="text-sm sm:text-base text-white font-semibold">
                  {upcoming.title} - {upcoming.date} - {upcoming.time}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                <MapPin className="w-4 h-4" />
                <span>{upcoming.location}</span>
              </div>
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
        </div>
      </div>

      {/* Slide Indicators */}
      {isMultiSlide && (
        <div className="absolute right-2 sm:right-2.5 lg:right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5 md:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              type="button"
              className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-200 focus:outline-none hover:scale-110"
              style={{
                backgroundColor: index === safeIndex ? colorScheme.primary : 'rgba(255, 255, 255, 0.22)',
                boxShadow: index === safeIndex ? `0 0 6px ${colorScheme.primary}` : 'none',
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
