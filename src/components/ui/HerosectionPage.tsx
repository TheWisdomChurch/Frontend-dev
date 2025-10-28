'use client';

import { useState, useEffect, useRef } from 'react';
import { H1 } from '../text';

import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/components/contexts/ThemeContext';
import Button from '../utils/CustomButton';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage: string;
  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  showScrollIndicator?: boolean;
}

const HeroSection = ({
  title,
  subtitle,
  description,
  backgroundImage,
  showButtons = true,
  primaryButtonText = 'Join Us This Sunday',
  secondaryButtonText = 'Watch Live Stream',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  showScrollIndicator = true,
}: HeroSectionProps) => {
  const [, setIsScrolled] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
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

      // Animate content entrance
      animateContentEntrance();

      // Animate scroll indicator with continuous bounce
      if (scrollIndicatorRef.current && showScrollIndicator) {
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
    if (dividerLine && subtitle) {
      tl.fromTo(
        dividerLine,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      );
    }

    if (subtitleRef.current && subtitle) {
      tl.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (descriptionRef.current && description) {
      tl.fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (buttonsRef.current && buttonsRef.current.children && showButtons) {
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

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <img
            src={backgroundImage}
            alt={title}
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
              {title}
            </H1>

            {/* Primary Color Divider Line - Only show if subtitle exists */}
            {subtitle && (
              <div
                className="divider-line h-1 w-20 mx-auto mb-6 rounded-full transform origin-center"
                style={{ backgroundColor: colorScheme.primary }}
              ></div>
            )}

            {/* Primary Color Subtitle - Only show if subtitle exists */}
            {subtitle && (
              <h2
                ref={subtitleRef}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6 leading-tight"
                style={{ color: colorScheme.primary }}
              >
                {subtitle}
              </h2>
            )}

            {/* Description - Only show if description exists */}
            {description && (
              <p
                ref={descriptionRef}
                className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto mb-8 leading-relaxed sm:leading-loose"
              >
                {description}
              </p>
            )}

            {/* Buttons - Only show if showButtons is true */}
            {showButtons && (
              <div
                ref={buttonsRef}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
              >
                {/* Primary Button */}
                <Button
                  variant="primary"
                  size="lg"
                  elevated={true}
                  curvature="lg"
                  className="w-full sm:w-auto"
                  onClick={onPrimaryButtonClick}
                >
                  {primaryButtonText}
                </Button>

                {/* Secondary Button */}
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
                  onClick={onSecondaryButtonClick}
                >
                  {secondaryButtonText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Only show if showScrollIndicator is true */}
      {showScrollIndicator && (
        <>
          {/* Desktop Scroll Indicator */}
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
        </>
      )}
    </section>
  );
};

export default HeroSection;
