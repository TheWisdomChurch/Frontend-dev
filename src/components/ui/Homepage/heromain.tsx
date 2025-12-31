/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { H1, H2, BodyMD } from '../../text';
import CustomButton from '../../utils/buttons/CustomButton';
import { Section, Container } from '../../layout';
import { darkShades, lightShades, ColorScheme } from '../../colors/colorScheme';
import { defaultSlides } from '@/lib/data';
import { renderTitle,  renderSubtitle } from '@/components/utils/heroTextUtil';
import { useAutoSlide } from '@/components/utils/hooks/mainHeroHooks/useAutoSlide';
import { useHeroAnimation } from '@/components/utils/hooks/mainHeroHooks/useheroAnimation';
import { useSlideAnimation } from '@/components/utils/hooks/mainHeroHooks/useSlideAnimation';
import { useWaveTextAnimation } from '@/components/utils/hooks/mainHeroHooks/useWaveText';

// Type guard helper for image objects
const isSimpleImage = (image: any): image is { src: string; alt?: string } => {
  return (
    typeof image === 'object' && 'src' in image && typeof image.src === 'string'
  );
};

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

interface HeroSectionProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  showWaveText?: boolean;
  colorScheme?: ColorScheme;
  slides?: typeof defaultSlides;
}

const HeroSection = ({
  primaryButtonText = 'Join Our Community',
  secondaryButtonText = 'Watch Live Stream',
  onPrimaryButtonClick = () => console.log('Primary button clicked'),
  onSecondaryButtonClick = () => console.log('Secondary button clicked'),
  showWaveText = true,
  colorScheme: externalColorScheme,
  slides = defaultSlides,
}: HeroSectionProps) => {
  const themeContext = useTheme();
  const theme = (themeContext as any)?.theme ?? 'light';
  const colorScheme =
    externalColorScheme || (theme === 'dark' ? darkShades : lightShades);

  // Create refs
  const heroRef = useRef<HTMLDivElement>(null!);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null!);
  const subtitleRef = useRef<HTMLHeadingElement>(null!);
  const descriptionRef = useRef<HTMLParagraphElement>(null!);
  const buttonsRef = useRef<HTMLDivElement>(null!);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null!);
  const waveTextRef = useRef<HTMLDivElement>(null!);

  // State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Derived values
  const slidesLength = slides.length;
  const isMultiSlide = slidesLength > 1;
  const currentSlideData = slides[currentSlide];

  // Animation functions
  const animateContentEntrance = useCallback((): gsap.core.Timeline => {
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      0
    );

    tl.fromTo(
      subtitleRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      0.3
    );

    if (descriptionRef.current) {
      tl.fromTo(
        descriptionRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.5
      );
    }

    if (buttonsRef.current?.children) {
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

    const targets = [];
    targets.push(titleRef.current);
    targets.push(subtitleRef.current);

    if (descriptionRef.current) {
      targets.push(descriptionRef.current);
    }

    if (buttonsRef.current?.children) {
      targets.push(...Array.from(buttonsRef.current.children));
    }

    if (targets.length > 0) {
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

  // Use hooks with non-nullable refs
  const { cleanupAnimations } = useHeroAnimation(
    heroRef,
    scrollIndicatorRef,
    animateContentEntrance
  );

  const { animateSlideTransition } = useSlideAnimation(
    isAnimating,
    currentSlide,
    setIsAnimating,
    setCurrentSlide,
    slidesRef,
    animateContentExit,
    animateContentEntrance
  );

  useAutoSlide(
    isMultiSlide,
    isAnimating,
    currentSlide,
    slidesLength,
    animateSlideTransition
  );

  useWaveTextAnimation(waveTextRef, showWaveText, colorScheme);

  // Scroll to next section
  const scrollToNextSection = useCallback(() => {
    const nextSection = heroRef.current?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Slide change on indicator click
  const goToSlide = useCallback(
    (index: number) => {
      if (!isAnimating && index !== currentSlide && isMultiSlide) {
        animateSlideTransition(index);
      }
    },
    [isAnimating, currentSlide, animateSlideTransition, isMultiSlide]
  );

  // Cleanup on unmount
  useEffect(() => {
    return cleanupAnimations;
  }, [cleanupAnimations]);

  const addToSlidesRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      if (el) {
        slidesRef.current[index] = el;
      }
    },
    []
  );

  return (
    <Section
      ref={heroRef}
      padding="none"
      fullHeight={true}
      className="relative w-full min-h-screen overflow-hidden bg-black"
    >
      {/* Background Slides - FIXED: Proper image handling */}
      {slides.map((slide, index) => (
        <div
          key={index}
          ref={el => addToSlidesRef(el, index)}
          className={`absolute inset-0 transition-all duration-800 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="relative w-full h-full">
            {/* Handle both StaticImageData and simple object types */}
            {isSimpleImage(slide.image) ? (
              <img
                src={slide.image.src}
                alt={slide.image.alt || slide.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={slide.image.src}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          </div>
        </div>
      ))}

      {/* Hero Content */}
      <Container
        size="xl"
        className="relative z-20 h-screen flex items-center justify-center px-4 sm:px-5 md:px-6 lg:px-8"
      >
        <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto text-center">
          {/* Wave of Greatness Text */}
          {showWaveText && (
            <div className="mb-2 sm:mb-3 md:mb-4 lg:mb-5 relative">
              <div
                ref={waveTextRef}
                className="flex justify-center items-center"
                style={{ opacity: 0.95 }}
              >
                {'THE WAVE OF GREATNESS'.split('').map((char, index) => (
                  <span
                    key={index}
                    className="wave-char inline-block will-change-transform"
                    style={{
                      fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
                      fontFamily:
                        "'Bricolage Grotesque', 'Segoe UI', system-ui, sans-serif",
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
                      textShadow: `
                        0 0 8px ${colorScheme.opacity.primary40},
                        0 0 12px ${colorScheme.opacity.primary20},
                        0 1px 2px rgba(0,0,0,0.7)
                      `,
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

          {/* Main Title */}
          <H1
            ref={titleRef}
            className="mb-3 sm:mb-4 md:mb-5 leading-tight tracking-tight font-black"
            style={{
              color: '#FFFFFF',
              textShadow:
                '0 2px 10px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(0, 0, 0, 0.6)',
            }}
            useThemeColor={false}
          >
            <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl block px-2">
              {renderTitle(currentSlideData.title, colorScheme)}
            </span>
          </H1>

          {/* Divider Line */}
          <div
            className="h-0.5 w-14 sm:w-18 md:w-22 lg:w-24 mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 rounded-full"
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
              className="mb-4 sm:mb-5 md:mb-6 lg:mb-7"
              style={{
                color: colorScheme.primary,
                textShadow:
                  '0 1px 6px rgba(0, 0, 0, 0.8), 0 2px 12px rgba(0, 0, 0, 0.6)',
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
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-center items-center"
          >
            <CustomButton
              variant="primary"
              size="lg"
              curvature="xl"
              elevated={true}
              onClick={onPrimaryButtonClick}
              className="group relative overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full sm:w-auto"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                color: colorScheme.buttonText || '#000000',
                boxShadow: `0 4px 15px ${colorScheme.opacity.primary25}`,
              }}
            >
              <span className="text-sm sm:text-base md:text-lg font-medium px-6 sm:px-8">
                {primaryButtonText}
              </span>
            </CustomButton>

            <CustomButton
              variant="outline"
              size="lg"
              curvature="xl"
              onClick={onSecondaryButtonClick}
              style={{
                borderColor: 'rgba(255, 255, 255, 0.4)',
                borderWidth: '1.5px',
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }}
              className="hover:border-primary/80 hover:bg-white/10 transition-all duration-200 w-full sm:w-auto"
            >
              <span className="text-sm sm:text-base md:text-lg font-medium px-6 sm:px-8">
                {secondaryButtonText}
              </span>
            </CustomButton>
          </div>
        </div>
      </Container>

      {/* Slide Indicators */}
      {isMultiSlide && (
        <div className="absolute right-1.5 sm:right-2 md:right-2.5 lg:right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1 sm:gap-1.5 md:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-200 focus:outline-none hover:scale-110"
              style={{
                backgroundColor:
                  index === currentSlide
                    ? colorScheme.primary
                    : 'rgba(255, 255, 255, 0.2)',
                boxShadow:
                  index === currentSlide
                    ? `0 0 5px ${colorScheme.primary}`
                    : 'none',
                transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)',
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
  scrollIndicatorRef: React.RefObject<HTMLDivElement>;
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
      className="absolute bottom-4 sm:bottom-5 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-30 hidden sm:block cursor-pointer"
      onClick={scrollToNextSection}
      aria-label="Scroll to next section"
    >
      <div className="flex flex-col items-center">
        <ChevronDown
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-bounce"
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
      className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 sm:hidden cursor-pointer"
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
