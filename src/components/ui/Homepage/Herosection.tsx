'use client';

import Image from 'next/image';
import { useEffect, useMemo, useCallback, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { H1, H2, BodyXL } from '@/components/text';
import { useHeroSection } from '@/components/utils/hooks/useHeroSection';
import { useResponsive } from '@/components/utils/hooks/useResponsive';

interface Slide {
  title: string;
  subtitle?: string;
  description?: string;
  image: { src: string; alt?: string };
  stats?: { label: string; value: string }[];
}

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  slides?: Slide[];
  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  showScrollIndicator?: boolean;
  showSlideIndicators?: boolean;
  showStats?: boolean;
}

const HeroSection = ({
  title,
  subtitle,
  description,
  backgroundImage,
  slides,
  showButtons = true,
  primaryButtonText = 'Join Us This Sunday',
  secondaryButtonText = 'Watch Live Stream',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  showScrollIndicator = true,
  showSlideIndicators = true,
  showStats = true,
}: HeroSectionProps) => {
  const {
    currentSlide,
    heroRef,
    contentRef,
    titleRef,
    subtitleRef,
    descriptionRef,
    scrollIndicatorRef,
    colorScheme,
    scrollToNextSection,
    handleHoverEnter,
    handleHoverLeave,
    goToSlide,
    addToSlidesRef,
    addToIndicatorsRef,
  } = useHeroSection();

  const [isClient, setIsClient] = useState(false);
  const { hero, getHeroClasses } = useResponsive();

  useEffect(() => setIsClient(true), []);

  const isMultiSlide = Boolean(slides && slides.length > 0);

  const currentSlideData = useMemo(() => {
    if (isMultiSlide) return slides![currentSlide];
    return {
      title: title || '',
      subtitle,
      description,
      image: { src: backgroundImage || '', alt: title || 'Hero background' },
    };
  }, [isMultiSlide, slides, currentSlide, title, subtitle, description, backgroundImage]);

  // ✅ Mobile-friendly heights (your old 90vh→120vh was the main reason images looked “off” on phones)
  const heroClasses = useMemo(() => {
    const base = getHeroClasses();
    return {
      ...base,
      container: `${base.container} min-h-[78vh] sm:min-h-[86vh] md:min-h-[92vh] lg:min-h-[100vh]`,
    };
  }, [getHeroClasses]);

  // ✅ Safer blur placeholder (and stable)
  const blurDataURL = useMemo(() => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTI4MCA3MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMDAwIi8+PC9zdmc+';
  }, []);

  // ✅ Better object position on mobile so faces don’t get chopped badly
  const imageStyle = useMemo(
    () => ({
      objectFit: 'cover' as const,
      objectPosition: 'center 25%' as const, // mobile-friendly crop
    }),
    []
  );

  const imageProps = useMemo(
    () => ({
      fill: true,
      sizes: '100vw',
      quality: 90,
      placeholder: 'blur' as const,
      blurDataURL,
      className: 'object-cover',
      style: imageStyle,
      priority: true, // hero should be priority
    }),
    [blurDataURL, imageStyle]
  );

  // ✅ Stable particle positions (your old Math.random() on every render causes “jumping” and bad mobile feel)
  const particles = useMemo(() => {
    if (!isClient) return [];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
  }, [isClient]);

  const primary = colorScheme.primary;

  // ✅ Improved overlays: cleaner on mobile, less “muddy”, still deep on desktop
  const Overlay = () => (
    <>
      {/* Mobile: stronger bottom gradient so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 sm:from-black/90 sm:via-black/35 sm:to-black/5" />
      {/* Subtle top shade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60 sm:from-black/35 sm:to-black/55" />
      {/* Bottom “floor” for tall text blocks */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] sm:h-[34%] bg-gradient-to-t from-black via-black/85 to-transparent" />
      {/* Slight vignette for nicer edge falloff */}
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 180px rgba(0,0,0,0.65)' }} />
    </>
  );

  return (
    <section ref={heroRef} className="relative w-full overflow-hidden hero-section">
      {/* BACKGROUND */}
      {isMultiSlide ? (
        slides!.map((slide, index) => (
          <div
            key={index}
            ref={(el) => addToSlidesRef(el, index)}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.image.src}
                alt={slide.image.alt || slide.title}
                loading={index === 0 ? 'eager' : 'lazy'}
                {...imageProps}
              />

              <Overlay />

              {/* particles (lighter + stable) */}
              <div className="absolute inset-0 opacity-[0.10]">
                {particles.map((p) => (
                  <div
                    key={p.id}
                    className="absolute rounded-full animate-float"
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      background: primary,
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
        ))
      ) : (
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {currentSlideData.image.src ? (
              <Image
                src={currentSlideData.image.src}
                alt={currentSlideData.image.alt || currentSlideData.title || 'Hero background'}
                loading="eager"
                {...imageProps}
              />
            ) : (
              // fallback if backgroundImage is missing
              <div className="absolute inset-0 bg-black" />
            )}

            <Overlay />

            <div className="absolute inset-0 opacity-[0.10]">
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute rounded-full animate-float"
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    background: primary,
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
      )}

      {/* CONTENT */}
      <div
        ref={contentRef}
        className={`relative z-20 h-full flex flex-col justify-center ${heroClasses.container} pt-16 sm:pt-20 md:pt-24 lg:pt-28`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top decor */}
          <div className="flex justify-center mb-7 sm:mb-9 md:mb-12">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: primary }} />
              <div
                className="w-10 sm:w-12 h-1 rounded-full"
                style={{ background: `linear-gradient(90deg, ${primary}00, ${primary}, ${primary}00)` }}
              />
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ background: primary, animationDelay: '0.5s' }}
              />
            </div>
          </div>

          {/* TITLE */}
          <div className="mb-7 sm:mb-10 md:mb-12">
            <H1
              ref={titleRef}
              className={`${hero.spacing.titleBottom} leading-[0.95] tracking-tighter text-center`}
              style={{
                background: `linear-gradient(135deg, #FFFFFF 0%, ${primary}cc 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 6px 28px rgba(0,0,0,0.75)',
                filter: 'drop-shadow(0 10px 26px rgba(0,0,0,0.75))',
                letterSpacing: '-0.02em',
              }}
              useThemeColor={false}
            >
              <span className={`${getHeroClasses().title} block`}>{currentSlideData.title}</span>
            </H1>
          </div>

          {/* SUBTITLE */}
          {currentSlideData.subtitle ? (
            <div className="flex flex-col items-center mb-7 sm:mb-10 md:mb-12">
              <div
                className="h-1 w-20 sm:w-28 md:w-32 mb-5 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${primary}, transparent)`,
                  boxShadow: `0 0 30px ${primary}66`,
                }}
              />
              <H2
                ref={subtitleRef}
                className={`${hero.spacing.subtitleBottom} text-center font-medium`}
                style={{
                  color: '#FFFFFF',
                  textShadow: '0 3px 22px rgba(0,0,0,0.85)',
                  letterSpacing: '0.03em',
                }}
                useThemeColor={false}
              >
                <span className={`${getHeroClasses().subtitle} block`}>{currentSlideData.subtitle}</span>
              </H2>
            </div>
          ) : null}

          {/* DESCRIPTION */}
          {currentSlideData.description ? (
            <div className="mb-10 sm:mb-12 md:mb-14">
              <BodyXL
                ref={descriptionRef}
                className={`max-w-3xl mx-auto ${hero.spacing.descriptionBottom} leading-relaxed text-center`}
                style={{
                  color: 'rgba(255,255,255,0.88)',
                  textShadow: '0 2px 16px rgba(0,0,0,0.8)',
                  fontSize: 'clamp(1.05rem, 2.2vw, 1.5rem)',
                  lineHeight: 1.75,
                  fontWeight: 300,
                }}
                useThemeColor={false}
              >
                <span className={`${getHeroClasses().description} block`}>{currentSlideData.description}</span>
              </BodyXL>
            </div>
          ) : null}

          {/* You had buttons in props but not rendered here; keeping your structure untouched.
              If you want them added back, say so and I’ll wire them cleanly. */}
        </div>
      </div>

      {/* SLIDE INDICATORS */}
      {isMultiSlide && showSlideIndicators && (
        <div className="absolute bottom-12 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3 sm:gap-4">
          {slides!.map((_, index) => (
            <button
              key={index}
              ref={(el) => addToIndicatorsRef(el, index)}
              onClick={() => goToSlide(index)}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            >
              <div
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 group-hover:scale-125 backdrop-blur-md"
                style={{
                  backgroundColor: index === currentSlide ? primary : 'rgba(255,255,255,0.18)',
                  border: `2px solid ${index === currentSlide ? primary : 'rgba(255,255,255,0.35)'}`,
                  boxShadow: index === currentSlide ? `0 0 18px ${primary}` : '0 0 8px rgba(255,255,255,0.15)',
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* SCROLL INDICATOR */}
      {showScrollIndicator && (
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 cursor-pointer group"
          onClick={scrollToNextSection}
          onMouseEnter={handleHoverEnter}
          onMouseLeave={handleHoverLeave}
        >
          <div className="flex flex-col items-center">
            <div className="mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm text-white/90 font-medium tracking-wide">
              Discover More
            </div>
            <div className="relative">
              <div className="absolute inset-0 animate-ping opacity-25">
                <ChevronDown className="w-8 h-8" style={{ color: primary }} />
              </div>
              <ChevronDown
                className="w-8 h-8 relative transition-all duration-500 group-hover:scale-110 group-hover:translate-y-1"
                style={{ color: primary, filter: `drop-shadow(0 6px 14px ${primary}55)` }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
