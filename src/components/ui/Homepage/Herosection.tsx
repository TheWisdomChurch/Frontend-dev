'use client';

import { H1, H2, BodyXL } from '@/components/text';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { ChevronDown, Play, Calendar, Users, Sparkles } from 'lucide-react';
import { useHeroSection } from '@/components/utils/hooks/useHeroSection';
import Image from 'next/image';
import { useEffect, useState, useMemo, useCallback } from 'react';
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
    buttonsRef,
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
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isMultiSlide = Boolean(slides && slides.length > 0);
  const isDarkMode = colorScheme.pageBackground === '#000000';

  const currentSlideData = useMemo(() => {
    return isMultiSlide
      ? slides![currentSlide]
      : {
          title: title!,
          subtitle,
          description,
          image: { src: backgroundImage!, alt: title },
          // stats: [
          //   { label: 'Service Times', value: 'Sundays 9AM' },
          //   { label: 'Live Stream', value: 'Watch Online' },
          //   { label: 'Community', value: 'All Are Welcome' }
          // ]
        };
  }, [isMultiSlide, slides, currentSlide, title, subtitle, description, backgroundImage]);

  // Enhanced color scheme with gradients
  const titleColor = isDarkMode ? '#FFFFFF' : colorScheme.primary;
  const subtitleColor = isDarkMode ? colorScheme.primary : '#FFFFFF';
  const descriptionColor = '#FFFFFF';

  // DRAMATICALLY INCREASED HEIGHTS for maximum image visibility
  const heroClasses = useMemo(() => {
    const base = getHeroClasses();
    return {
      ...base,
      container: `${base.container} min-h-[100vh] md:min-h-[105vh] lg:min-h-[110vh]`,
    };
  }, [getHeroClasses]);

  // Generate blur placeholder for Image component
  const generateBlurDataURL = useMemo(() => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTI4MCA3MjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTAgMGgxMjgwdjcyMEgweiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzBfODQ3KSIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8wXzg0NyIgeDE9IjAiIHkxPSIwIiB4Mj0iMTI4MCIgeTI9IjcyMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMwMDAwMDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDAwMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=';
  }, []);

  // Optimized Image props with subtle parallax effect
  const imageProps = useMemo(() => ({
    fill: true,
    sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 95vw, 90vw",
    quality: 80,
    placeholder: "blur" as const,
    blurDataURL: generateBlurDataURL,
    className: "object-cover",
    style: {
      objectFit: 'cover' as const,
      objectPosition: 'center' as const,
    }
  }), [generateBlurDataURL]);

  // Handle button hover with enhanced effects
  const handleButtonHover = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isClient) return;
    e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
    e.currentTarget.style.boxShadow = `0 25px 50px rgba(${parseInt(colorScheme.primary.slice(1, 3), 16)}, ${parseInt(colorScheme.primary.slice(3, 5), 16)}, ${parseInt(colorScheme.primary.slice(5, 7), 16)}, 0.4)`;
  }, [isClient, colorScheme.primary]);

  const handleButtonLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isClient) return;
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.25)';
  }, [isClient]);

 

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden hero-section"
    >
      {/* Enhanced Background */}
      {isMultiSlide ? (
        slides!.map((slide, index) => (
          <div
            key={index}
            ref={el => addToSlidesRef(el, index)}
            className={`absolute inset-0 transition-all duration-1500 ease-out ${
              index === currentSlide 
                ? 'opacity-100 z-10' 
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.image.src}
                alt={slide.image.alt || slide.title}
                loading={index === 0 ? 'eager' : 'lazy'}
                {...imageProps}
              />

            {/* Enhanced gradient overlay - optimized for taller heights */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/97 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/90 to-transparent" />
            <div className="hero-animated" />
            
            {/* Subtle animated particles overlay */}
            <div className="absolute inset-0 opacity-[0.12]">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full animate-float"
                    style={{
                      width: `${Math.random() * 6 + 2}px`,
                      height: `${Math.random() * 6 + 2}px`,
                      background: colorScheme.primary,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${Math.random() * 10 + 10}s`
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
            <Image
              src={backgroundImage!}
              alt={title || 'Hero background'}
              loading="lazy"
              {...imageProps}
            />
            
            {/* Enhanced gradient overlay for taller layout */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/97 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/90 to-transparent" />
            <div className="hero-animated" />
            
            {/* Subtle animated particles */}
            <div className="absolute inset-0 opacity-[0.12]">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-float"
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    background: colorScheme.primary,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 10 + 10}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Content with EXTREME height for maximum impact */}
      <div
        ref={contentRef}
        className={`relative z-20 h-full flex flex-col justify-center ${heroClasses.container} pt-16 md:pt-24 lg:pt-32 xl:pt-40`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Decorative elements - spaced for taller layout */}
          <div className="flex justify-center mb-8 md:mb-12 lg:mb-16 xl:mb-20">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: colorScheme.primary }} />
              <div className="w-12 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${colorScheme.primary}00, ${colorScheme.primary}, ${colorScheme.primary}00)` }} />
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: colorScheme.primary, animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Main Title - Dramatic and centered */}
          <div className="mb-10 md:mb-14 lg:mb-18 xl:mb-24">
            <H1
              ref={titleRef}
              className={`${hero.spacing.titleBottom} leading-none tracking-tighter text-center`}
              style={{
                background: `linear-gradient(135deg, ${titleColor} 0%, ${isDarkMode ? colorScheme.white : colorScheme.primary}cc 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 8px 40px rgba(0, 0, 0, 0.8)',
                filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.8))',
                letterSpacing: '-0.02em',
              }}
              useThemeColor={false}
            >
              <span className={`hero-title-glow ${heroClasses.title} block`}>
                {currentSlideData.title}
              </span>
            </H1>
          </div>

          {/* Enhanced Divider with glow effect */}
          {currentSlideData.subtitle && (
            <div className="flex flex-col items-center mb-12 md:mb-16 lg:mb-20 xl:mb-24">
              <div
                className="h-1 w-24 md:w-32 lg:w-40 mb-6 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, transparent, ${colorScheme.primary}, transparent)`,
                  boxShadow: `0 0 40px ${colorScheme.primary}80`
                }}
              />
            </div>
          )}

          {/* Subtitle with enhanced styling for taller layout */}
          {currentSlideData.subtitle && (
            <div className="mb-12 md:mb-16 lg:mb-20 xl:mb-24">
              <H2
                ref={subtitleRef}
                className={`${hero.spacing.subtitleBottom} text-center font-medium`}
                style={{
                  color: subtitleColor,
                  textShadow: '0 4px 30px rgba(0, 0, 0, 0.9)',
                  letterSpacing: '0.03em',
                  fontWeight: 500,
                }}
                useThemeColor={false}
              >
                <span className={`${heroClasses.subtitle} block`}>
                  {currentSlideData.subtitle}
                </span>
              </H2>
            </div>
          )}

          {/* Description with enhanced layout for taller hero */}
          {currentSlideData.description && (
            <div className="mb-14 md:mb-18 lg:mb-22 xl:mb-28">
              <BodyXL
                ref={descriptionRef}
                className={`max-w-3xl mx-auto ${hero.spacing.descriptionBottom} leading-relaxed text-center`}
                style={{
                  color: descriptionColor,
                  textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
                useThemeColor={false}
              >
                <span className={`${heroClasses.description} block`}>
                  {currentSlideData.description}
                </span>
              </BodyXL>
            </div>
          )}

          {/* Stats Section - Spaced for taller layout */}
       
        </div>
      </div>

      {/* Enhanced Slide Indicators - Positioned lower for taller layout */}
      {isMultiSlide && showSlideIndicators && (
        <div className="absolute bottom-12 md:bottom-16 lg:bottom-20 left-1/2 -translate-x-1/2 z-30 flex gap-4 md:gap-5">
          {slides!.map((_, index) => (
            <button
              key={index}
              ref={el => addToIndicatorsRef(el, index)}
              onClick={() => goToSlide(index)}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-500 group-hover:scale-150 backdrop-blur-md"
                style={{
                  backgroundColor:
                    index === currentSlide
                      ? colorScheme.primary
                      : `${colorScheme.white}20`,
                  border: `2px solid ${index === currentSlide ? colorScheme.primary : colorScheme.white}40`,
                  boxShadow: index === currentSlide ? `0 0 25px ${colorScheme.primary}` : `0 0 10px ${colorScheme.white}20`
                }}
              />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-top-12">
                <div className="bg-gradient-to-b from-black/90 to-black/80 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap border border-white/10">
                  Slide {index + 1}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Enhanced Scroll Indicator - Positioned for tall layout */}
      {showScrollIndicator && (
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 cursor-pointer group"
          onClick={scrollToNextSection}
          onMouseEnter={handleHoverEnter}
          onMouseLeave={handleHoverLeave}
        >
          <div className="flex flex-col items-center">
            <div className="mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:mb-4 text-base text-white/90 font-medium tracking-wide">
              Discover More
            </div>
            <div className="relative">
              <div className="absolute inset-0 animate-ping opacity-30">
                <ChevronDown
                  className="w-8 h-8 md:w-10 md:h-10"
                  style={{ color: colorScheme.primary }}
                />
              </div>
              <ChevronDown
                className="w-8 h-8 md:w-10 md:h-10 relative transition-all duration-700 group-hover:scale-125 group-hover:translate-y-3 animate-bounce-slow"
                style={{ 
                  color: colorScheme.primary,
                  filter: `drop-shadow(0 6px 15px ${colorScheme.primary}60)`
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
