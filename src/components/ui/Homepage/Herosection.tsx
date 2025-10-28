'use client';

import { useState, useEffect, SetStateAction, useRef } from 'react';
import { H1 } from '../../text';
import { slides } from '@/lib/data';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/layout/header';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/components/contexts/ThemeContext';
import { Button } from '../../utils/CustomButton';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Use your theme context
  const { colorScheme } = useTheme();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial animations on component mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial hero section entrance animation
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
        }
      );

      // Animate first slide content
      animateContentEntrance();

      // Animate scroll indicator with continuous bounce
      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { y: -10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 2,
            ease: 'power2.out',
          }
        );

        const bounceAnimation = gsap.to(scrollIndicatorRef.current, {
          y: 15,
          duration: 1.5,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
        });

        return () => bounceAnimation.kill();
      }
    });

    return () => ctx.revert();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (isTransitioning) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isTransitioning]);

  const animateContentEntrance = () => {
    const tl = gsap.timeline();

    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }

    const dividerLine = document.querySelector('.divider-line');
    if (dividerLine) {
      tl.fromTo(
        dividerLine,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (descriptionRef.current) {
      tl.fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (buttonsRef.current && buttonsRef.current.children) {
      tl.fromTo(
        buttonsRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
        },
        '-=0.2'
      );
    }

    return tl;
  };

  const animateContentExit = () => {
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
        y: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.in',
      });
    }

    return tl;
  };

  const animateSlideTransition = (nextIndex: number) => {
    return new Promise<void>(resolve => {
      const ctx = gsap.context(() => {
        const currentSlideEl = slidesRef.current[currentSlide];
        const nextSlideEl = slidesRef.current[nextIndex];

        if (!currentSlideEl || !nextSlideEl) {
          resolve();
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            setIsTransitioning(false);
            resolve();
          },
        });

        tl.call(() => setIsTransitioning(true))
          .add(animateContentExit())
          .to(
            currentSlideEl,
            {
              scale: 1.1,
              opacity: 0,
              duration: 1.2,
              ease: 'power2.inOut',
            },
            0
          )
          .fromTo(
            nextSlideEl,
            { scale: 1.1, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: 'power2.inOut',
            },
            0
          )
          .call(
            () => {
              setCurrentSlide(nextIndex);
            },
            undefined,
            0.6
          )
          .add(animateContentEntrance(), 0.8);
      });

      return () => ctx.revert();
    });
  };

  const nextSlide = async () => {
    if (isTransitioning) return;

    const nextIndex = (currentSlide + 1) % slides.length;
    await animateSlideTransition(nextIndex);
  };

  const goToSlide = async (index: SetStateAction<number>) => {
    if (isTransitioning || index === currentSlide) return;

    const clickedIndicator = indicatorsRef.current[index as number];
    if (clickedIndicator) {
      gsap.fromTo(
        clickedIndicator,
        { scale: 1 },
        {
          scale: 1.3,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        }
      );
    }

    await animateSlideTransition(index as number);
  };

  const addToSlidesRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      slidesRef.current[index] = el;
    }
  };

  const addToIndicatorsRef = (el: HTMLButtonElement | null, index: number) => {
    if (el) {
      indicatorsRef.current[index] = el;
    }
  };

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <Header />
      </div>

      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          ref={el => addToSlidesRef(el, index)}
          className={`absolute inset-0 ${
            index === currentSlide
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="relative w-full h-full">
            <img
              src={slide.image.src}
              alt={slide.title}
              className="
                w-full h-full 
                object-cover 
                object-center 
                lg:object-[center_top] 
                xl:object-[center_center] 
                scale-105 lg:scale-100
              "
              style={{
                maxHeight: '100vh',
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90" />
            <div className="absolute inset-0 bg-[#001910]/40 mix-blend-overlay" />
          </div>
        </div>
      ))}

      {/* Content - Centered in the container */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex items-center justify-center px-4"
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center" style={{ color: colorScheme.text }}>
            <H1
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 leading-tight tracking-tight"
            >
              {slides[currentSlide].title}
            </H1>

            {/* Primary Color Divider Line */}
            <div
              className="divider-line h-1 w-20 mx-auto mb-6 rounded-full transform origin-center"
              style={{ backgroundColor: colorScheme.primary }}
            ></div>

            {/* Primary Color Subtitle */}
            <h2
              ref={subtitleRef}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6 leading-tight"
              style={{ color: colorScheme.primary }}
            >
              {slides[currentSlide].subtitle}
            </h2>

            <p
              ref={descriptionRef}
              className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto mb-8 leading-relaxed sm:leading-loose"
            >
              {slides[currentSlide].description}
            </p>

            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            >
              {/* Primary Button - Uses primary variant with yellow background */}
              <Button
                variant="primary"
                size="lg"
                elevated={true}
                curvature="lg"
                className="w-full sm:w-auto"
              >
                Join Us This Sunday
              </Button>

              {/* Secondary Button - Uses outline variant with primary border */}
              <Button
                variant="outline"
                size="lg"
                curvature="lg"
                className="w-full sm:w-auto"
                style={{
                  borderColor: colorScheme.primary,
                  color: colorScheme.white,
                }}
                onMouseEnter={(e: {
                  currentTarget: {
                    style: { backgroundColor: string; color: string };
                  };
                }) => {
                  e.currentTarget.style.backgroundColor = colorScheme.white;
                  e.currentTarget.style.color = colorScheme.black;
                }}
                onMouseLeave={(e: {
                  currentTarget: {
                    style: { backgroundColor: string; color: string };
                  };
                }) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colorScheme.white;
                }}
              >
                Watch Live Stream
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center space-y-2">
        {slides.map((_, index) => (
          <button
            key={index}
            ref={el => addToIndicatorsRef(el, index)}
            onClick={() => goToSlide(index)}
            className={`relative w-1 h-1 rounded-full overflow-hidden transition-all duration-500 ease-out hover:scale-110 ${
              index === currentSlide ? 'scale-125' : ''
            }`}
            style={{
              backgroundColor:
                index === currentSlide
                  ? colorScheme.primary
                  : `${colorScheme.white}40`,
              boxShadow:
                index === currentSlide
                  ? `0 0 10px ${colorScheme.primary}70`
                  : 'none',
            }}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: `${colorScheme.primary}30` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden sm:block"
      >
        <div className="flex flex-col items-center">
          <ChevronDown
            className="w-6 h-6 animate-pulse"
            style={{ color: colorScheme.primary }}
          />
          <ChevronDown
            className="w-6 h-6 animate-pulse -mt-[6px]"
            style={{ color: colorScheme.primary }}
          />
        </div>
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 sm:hidden">
        <div className="animate-bounce flex flex-col items-center">
          <ChevronDown
            className="w-5 h-5"
            style={{ color: colorScheme.primary }}
          />
          <ChevronDown
            className="w-5 h-5 -mt-[5px]"
            style={{ color: colorScheme.primary }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
