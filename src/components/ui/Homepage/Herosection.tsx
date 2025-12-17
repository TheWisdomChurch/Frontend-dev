'use client';

import { H1, H2, BodyXL } from '@/components/text';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { ChevronDown } from 'lucide-react';
import { useHeroSection } from '@/components/utils/hooks/useHeroSection';
import Image from 'next/image';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useResponsive } from '@/components/utils/hooks/useResponsive';


interface Slide {
  title: string;
  subtitle?: string;
  description?: string;
  image: { src: string; alt?: string };
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
        };
  }, [isMultiSlide, slides, currentSlide, title, subtitle, description, backgroundImage]);

  // Smart colors based on your exact request
  const titleColor = isDarkMode ? '#FFFFFF' : colorScheme.primary;
  const subtitleColor = isDarkMode ? colorScheme.primary : '#FFFFFF';
  const descriptionColor = '#FFFFFF';

  // Get combined classes
  const heroClasses = useMemo(() => getHeroClasses(), [getHeroClasses]);

  // Generate blur placeholder for Image component
  const generateBlurDataURL = useMemo(() => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTI4MCA3MjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTAgMGgxMjgwdjcyMEgweiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzBfODQ3KSIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8wXzg0NyIgeDE9IjAiIHkxPSIwIiB4Mj0iMTI4MCIgeTI9IjcyMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMwMDAwMDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDAwMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=';
  }, []);

  // Optimized Image props
  const imageProps = useMemo(() => ({
    fill: true,
    sizes: "100vw",
    quality: 85,
    placeholder: "blur" as const,
    blurDataURL: generateBlurDataURL,
    className: "object-cover",
    style: {
      objectFit: 'cover' as const,
      objectPosition: 'center' as const,
    }
  }), [generateBlurDataURL]);

  // Handle button hover with client check
  const handleButtonHover = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isClient) return;
    e.currentTarget.style.backgroundColor = colorScheme.primary;
    e.currentTarget.style.color = '#000000';
  }, [isClient, colorScheme.primary]);

  const handleButtonLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isClient) return;
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = '#FFFFFF';
  }, [isClient]);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden hero-section min-h-[50vh] xs:min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]"
    >
      {/* Background Slides */}
      {isMultiSlide ? (
        slides!.map((slide, index) => (
          <div
            key={index}
            ref={el => addToSlidesRef(el, index)}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.image.src}
                alt={slide.image.alt || slide.title}
                priority={index === 0}
                {...imageProps}
              />

              {/* Optimized gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </div>
          </div>
        ))
      ) : (
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <Image
              src={backgroundImage!}
              alt={title || 'Hero background'}
              priority={true}
              {...imageProps}
            />
            
            {/* Optimized gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div
        ref={contentRef}
        className={`relative z-20 h-full flex items-center justify-center ${heroClasses.container}`}
      >
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Main Title - Mobile-first responsive */}
          <H1
            ref={titleRef}
            className={`${hero.spacing.titleBottom} leading-tight tracking-tight`}
            style={{
              color: titleColor,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
            }}
            useThemeColor={false}
          >
            <span className={`${heroClasses.title} block`}>
              {currentSlideData.title}
            </span>
          </H1>

          {/* Divider */}
          {currentSlideData.subtitle && (
            <div
              className="h-0.5 w-12 xs:w-14 sm:w-16 md:w-20 mx-auto mb-3 xs:mb-4 sm:mb-5 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          )}

          {/* Subtitle */}
          {currentSlideData.subtitle && (
            <H2
              ref={subtitleRef}
              className={`${hero.spacing.subtitleBottom}`}
              style={{
                color: subtitleColor,
                textShadow: '0 1px 8px rgba(0, 0, 0, 0.8)',
              }}
              useThemeColor={false}
            >
              <span className={`${heroClasses.subtitle} block`}>
                {currentSlideData.subtitle}
              </span>
            </H2>
          )}

          {/* Description */}
          {currentSlideData.description && (
            <BodyXL
              ref={descriptionRef}
              className={`max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto ${hero.spacing.descriptionBottom} leading-relaxed`}
              style={{
                color: descriptionColor,
                textShadow: '0 1px 6px rgba(0, 0, 0, 0.7)',
              }}
              useThemeColor={false}
            >
              <span className={`${heroClasses.description} block`}>
                {currentSlideData.description}
              </span>
            </BodyXL>
          )}

          {/* Buttons */}
          {showButtons && (
            <div
              ref={buttonsRef}
              className={`flex flex-col xs:flex-row ${hero.spacing.buttonsGap} justify-center items-center`}
            >
              <CustomButton
                variant="primary"
                size="lg"
                elevated={true}
                curvature="lg"
                className={`${heroClasses.button} font-semibold hover:scale-105 transition-transform duration-200`}
                onClick={onPrimaryButtonClick}
              >
                {primaryButtonText}
              </CustomButton>

              <CustomButton
                variant="outline"
                size="lg"
                curvature="lg"
                className={`${heroClasses.button} font-semibold border transition-all duration-200`}
                style={{
                  borderColor: colorScheme.primary,
                  color: '#FFFFFF',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                onClick={onSecondaryButtonClick}
              >
                {secondaryButtonText}
              </CustomButton>
            </div>
          )}
        </div>
      </div>

      {/* Slide Indicators */}
      {isMultiSlide && showSlideIndicators && (
        <div className="absolute right-2 xs:right-3 sm:right-4 md:right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
          {slides!.map((_, index) => (
            <button
              key={index}
              ref={el => addToIndicatorsRef(el, index)}
              onClick={() => goToSlide(index)}
              className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-200 hover:scale-125"
              style={{
                backgroundColor:
                  index === currentSlide
                    ? colorScheme.primary
                    : `${colorScheme.white}50`,
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-3 xs:bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
          onClick={scrollToNextSection}
          onMouseEnter={handleHoverEnter}
          onMouseLeave={handleHoverLeave}
        >
          <div className="flex flex-col items-center animate-bounce">
            <ChevronDown
              className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-primary drop-shadow-lg"
              style={{ color: colorScheme.primary }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;