/* eslint-disable @typescript-eslint/no-explicit-any */
// HeroSection.tsx - Complete with optimized Wave of Greatness
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { H1, H2, BodyMD, BaseText } from '../text';
import CustomButton from '../utils/CustomButton';
import { Section, Container } from '../layout';
import { darkShades, lightShades, ColorScheme } from '../colors/colorScheme';
import { hero_bg_1, hero_bg_2, hero_bg_3 } from '../assets';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

interface Slide {
  title: string;
  subtitle: string;
  description?: string;
  image: { src: string; alt?: string };
}

interface HeroSectionProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  showWaveText?: boolean;
  colorScheme?: ColorScheme;
}

const HeroSection = ({
  primaryButtonText = 'Join Our Community',
  secondaryButtonText = 'Watch Live Stream',
  onPrimaryButtonClick = () => console.log('Primary button clicked'),
  onSecondaryButtonClick = () => console.log('Secondary button clicked'),
  showWaveText = true,
  colorScheme: externalColorScheme,
}: HeroSectionProps) => {
  // Default slides
  const defaultSlides: Slide[] = [
    {
      title: 'Welcome to The Wisdom House Church',
      subtitle: "Experience God's Transforming Power",
      description:
        'Where lives are transformed through faith, community, and divine guidance.',
      image: {
        src: hero_bg_1.src,
        alt: "Experience God's Transforming Power",
      },
    },
    {
      title: 'Join Our Vibrant Community',
      subtitle: 'Deepen Your Spiritual Journey',
      description: 'Grow together in faith, love, and service to others.',
      image: {
        src: hero_bg_2.src,
        alt: 'Deepen Your Spiritual Journey',
      },
    },
    {
      title: 'Build Lasting Relationships',
      subtitle: 'Connect With Believers',
      description: 'Experience genuine fellowship and relationships in Christ.',
      image: {
        src: hero_bg_3.src,
        alt: 'Connect With Believers',
      },
    },
  ];

  const themeContext = useTheme();
  const theme = (themeContext as any)?.theme ?? 'light';
  const colorScheme =
    externalColorScheme || (theme === 'dark' ? darkShades : lightShades);

  const heroRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const waveTextRef = useRef<HTMLDivElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slidesToUse = defaultSlides;
  const slidesLength = slidesToUse.length;
  const isMultiSlide = slidesLength > 1;

  // Helper function to render title with special formatting for "Wisdom House Church"
  const renderTitle = (title: string) => {
    if (title.includes('Wisdom House Church')) {
      const parts = title.split('Wisdom House Church');
      return (
        <>
          {parts[0]}
          <BaseText
            fontFamily="playfair"
            className="italic inline-block"
            style={{
              color: colorScheme.primary,
              fontSize: 'inherit',
              lineHeight: 'inherit',
              textShadow: `0 0 20px ${colorScheme.opacity.primary40}`,
            }}
          >
            Wisdom House
          </BaseText>{' '}
          Church{parts[1]}
        </>
      );
    } else if (title.includes('Vibrant Community')) {
      const parts = title.split('Vibrant Community');
      return (
        <>
          {parts[0]}
          <BaseText
            fontFamily="playfair"
            className="italic inline-block"
            style={{
              color: colorScheme.primary,
              fontSize: 'inherit',
              lineHeight: 'inherit',
              textShadow: `0 0 20px ${colorScheme.opacity.primary40}`,
            }}
          >
            Vibrant Community
          </BaseText>
          {parts[1]}
        </>
      );
    } else if (title.includes('Lasting Relationships')) {
      const parts = title.split('Lasting Relationships');
      return (
        <>
          {parts[0]}
          <BaseText
            fontFamily="playfair"
            className="italic inline-block"
            style={{
              color: colorScheme.primary,
              fontSize: 'inherit',
              lineHeight: 'inherit',
              textShadow: `0 0 20px ${colorScheme.opacity.primary40}`,
            }}
          >
            Lasting Relationships
          </BaseText>
          {parts[1]}
        </>
      );
    }

    // Default formatting for other titles
    return title;
  };

  // Helper function to render subtitle with special formatting
  const renderSubtitle = (subtitle: string) => {
    if (subtitle.includes("God's Transforming Power")) {
      const parts = subtitle.split("God's Transforming Power");
      return (
        <>
          {parts[0]}
          <BaseText
            fontFamily="playfair"
            className="italic inline-block"
            style={{
              color: '#FFFFFF',
              fontSize: 'inherit',
              lineHeight: 'inherit',
            }}
          >
            God's
          </BaseText>{' '}
          Transforming Power{parts[1]}
        </>
      );
    } else if (subtitle.includes('Spiritual Journey')) {
      const parts = subtitle.split('Spiritual Journey');
      return (
        <>
          {parts[0]}
          <BaseText
            fontFamily="playfair"
            className="italic inline-block"
            style={{
              color: '#FFFFFF',
              fontSize: 'inherit',
              lineHeight: 'inherit',
            }}
          >
            Spiritual Journey
          </BaseText>
          {parts[1]}
        </>
      );
    } else if (subtitle.includes('Connect With Believers')) {
      return (
        <>
          <BaseText
            fontFamily="playfair"
            className="italic inline-block"
            style={{
              color: '#FFFFFF',
              fontSize: 'inherit',
              lineHeight: 'inherit',
            }}
          >
            Connect With Believers
          </BaseText>
        </>
      );
    }

    // Default formatting for other subtitles
    return subtitle;
  };

  // Clean animations
  const cleanupAnimations = useCallback(() => {
    gsap.killTweensOf('.slide');
    gsap.killTweensOf('.slide-content');
    gsap.killTweensOf('.wave-char');
    gsap.killTweensOf('.scroll-indicator');
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, []);

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

  // Wave of Greatness Animation - Optimized
  useEffect(() => {
    if (!waveTextRef.current || !showWaveText) return;

    const text = waveTextRef.current;
    const chars = text.querySelectorAll('.wave-char');

    // Reset all characters
    gsap.set(chars, {
      y: 0,
      opacity: 0,
      scale: 1,
    });

    // Create a clean wave animation
    const waveAnimation = gsap.timeline({
      repeat: -1,
      repeatDelay: 6,
      paused: false,
    });

    // Simple wave effect with better visibility
    chars.forEach((char, i) => {
      waveAnimation.fromTo(
        char,
        {
          y: 15,
          opacity: 0,
          scale: 0.7,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.3)',
          delay: i * 0.04,
        },
        i * 0.04
      );
    });

    // Subtle continuous effect
    waveAnimation.to(
      chars,
      {
        y: i => Math.sin(i * 0.5 + waveAnimation.time()) * 1,
        duration: 3,
        ease: 'sine.inOut',
      },
      '-=0.2'
    );

    // Fade out
    waveAnimation.to(chars, {
      y: -10,
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.in',
      stagger: 0.015,
      delay: 2,
    });

    return () => {
      waveAnimation.kill();
    };
  }, [showWaveText]);

  // Animate content entrance
  const animateContentEntrance = useCallback(() => {
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

    if (buttonsRef.current && buttonsRef.current.children) {
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

  // Animate content exit
  const animateContentExit = useCallback(() => {
    const tl = gsap.timeline();

    const targets = [];
    if (titleRef.current) targets.push(titleRef.current);
    if (subtitleRef.current) targets.push(subtitleRef.current);
    if (descriptionRef.current) targets.push(descriptionRef.current);
    if (buttonsRef.current && buttonsRef.current.children) {
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

  // Animate slide transition
  const animateSlideTransition = useCallback(
    async (nextIndex: number) => {
      if (isAnimating || nextIndex === currentSlide) return;

      setIsAnimating(true);

      const currentSlideEl = slidesRef.current[currentSlide];
      const nextSlideEl = slidesRef.current[nextIndex];

      if (!currentSlideEl || !nextSlideEl) {
        setIsAnimating(false);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
        },
      });

      tl.add(animateContentExit())
        .to(
          currentSlideEl,
          {
            scale: 1.02,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        )
        .fromTo(
          nextSlideEl,
          { scale: 0.98, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        )
        .call(
          () => {
            setCurrentSlide(nextIndex);
          },
          undefined,
          0.5
        )
        .add(animateContentEntrance(), 0.6);

      return tl;
    },
    [currentSlide, isAnimating, animateContentExit, animateContentEntrance]
  );

  // Initialize animations
  useEffect(() => {
    let ctx: gsap.Context;

    if (heroRef.current) {
      ctx = gsap.context(() => {
        // Initial hero entrance
        gsap.fromTo(
          heroRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          }
        );

        // Initial content animation
        animateContentEntrance();

        // Scroll indicator animation
        if (scrollIndicatorRef.current) {
          gsap.fromTo(
            scrollIndicatorRef.current,
            { y: -5, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: 1.2,
              ease: 'power2.out',
            }
          );

          const bounceAnimation = gsap.to(scrollIndicatorRef.current, {
            y: 5,
            duration: 1.2,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
          });

          return () => bounceAnimation.kill();
        }
      }, heroRef);
    }

    return () => {
      if (ctx) ctx.revert();
      cleanupAnimations();
    };
  }, [animateContentEntrance, cleanupAnimations]);

  // Auto slide with interaction reset
  useEffect(() => {
    if (!isMultiSlide) return;

    let autoSlideInterval: NodeJS.Timeout;
    let lastInteractionTime = Date.now();
    const AUTO_SLIDE_DELAY = 10000;
    const INTERACTION_TIMEOUT = 3000;

    const resetTimer = () => {
      lastInteractionTime = Date.now();
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        if (
          !isAnimating &&
          Date.now() - lastInteractionTime > INTERACTION_TIMEOUT
        ) {
          const nextSlide = (currentSlide + 1) % slidesLength;
          animateSlideTransition(nextSlide);
        }
      }, AUTO_SLIDE_DELAY);
    };

    startAutoSlide();

    const handleInteraction = () => resetTimer();
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      clearInterval(autoSlideInterval);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [
    currentSlide,
    isAnimating,
    slidesLength,
    animateSlideTransition,
    isMultiSlide,
  ]);

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

  const currentSlideData = slidesToUse[currentSlide];

  return (
    <Section
      ref={heroRef}
      padding="none"
      fullHeight={true}
      className="relative w-full min-h-screen overflow-hidden bg-black"
    >
      {/* Background Slides */}
      {slidesToUse.map((slide, index) => (
        <div
          key={index}
          ref={el => addToSlidesRef(el, index)}
          className={`absolute inset-0 transition-all duration-800 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="relative w-full h-full">
            {slide.image.src && (
              <img
                src={slide.image.src}
                alt={slide.image.alt || slide.title}
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
        <div
          ref={contentRef}
          className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto text-center"
        >
          {/* Wave of Greatness Text - Optimized for visibility and responsiveness */}
          {showWaveText && (
            <div className="mb-2 sm:mb-3 md:mb-4 lg:mb-5 relative">
              <div
                ref={waveTextRef}
                className="flex justify-center items-center"
                style={{
                  opacity: 0.95,
                }}
              >
                {'THE WAVE OF GREATNESS'.split('').map((char, index) => (
                  <span
                    key={index}
                    className="wave-char inline-block will-change-transform"
                    style={{
                      // Optimized responsive font sizing - better than original but not too big
                      fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
                      fontFamily:
                        "'Bricolage Grotesque', 'Segoe UI', system-ui, sans-serif",
                      fontWeight: 700, // Slightly bolder for better visibility
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
                      // Enhanced text shadow for better visibility
                      textShadow: `
                        0 0 8px ${colorScheme.opacity.primary40},
                        0 0 12px ${colorScheme.opacity.primary20},
                        0 1px 2px rgba(0,0,0,0.7)
                      `,
                      padding: '0 0.03em',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      lineHeight: '1.2',
                      // Add subtle stroke for better visibility
                      WebkitTextStroke: `0.2px ${colorScheme.primaryDark}`,
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main Title - Now dynamic per slide */}
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
              {renderTitle(currentSlideData.title)}
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

          {/* Subtitle - Dynamic per slide */}
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

          {/* Description - Dynamic per slide */}
          {currentSlideData.description && (
            <BodyMD
              ref={descriptionRef}
              className="mb-6 sm:mb-7 md:mb-8 lg:mb-10 max-w-2xl lg:max-w-3xl mx-auto"
              style={{
                color: '#F8FAFC',
                textShadow: '0 1px 5px rgba(0, 0, 0, 0.8)',
                opacity: 0.95,
              }}
              useThemeColor={false}
              weight="regular" // Changed from "normal" to "regular"
              smWeight="medium"
            >
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl block px-3">
                {currentSlideData.description}
              </span>
            </BodyMD>
          )}
          {/* Buttons - Properly responsive */}
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
              size="lg" // Choose one size that works well across all devices
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
          {slidesToUse.map((_, index) => (
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

      {/* Scroll Indicator */}
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

      {/* Mobile Scroll Indicator */}
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
    </Section>
  );
};

export default HeroSection;
