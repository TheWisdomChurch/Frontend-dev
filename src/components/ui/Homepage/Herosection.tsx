/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { H1 } from '@/components/text';
import { Button } from '@/components/utils';
import { ChevronDown } from 'lucide-react';
import { useHeroSection } from '@/components/utils/hooks/useHeroSection';

interface Slide {
  title: string;
  subtitle?: string;
  description?: string;
  image: {
    src: string;
    alt?: string;
  };
}

interface HeroSectionProps {
  // Single slide mode
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;

  // Multi-slide mode
  slides?: Slide[];

  // Common props
  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  showScrollIndicator?: boolean;
  showSlideIndicators?: boolean;
}

const HeroSection = ({
  // Single slide props
  title,
  subtitle,
  description,
  backgroundImage,

  // Multi-slide props
  slides,

  // Common props
  showButtons = true,
  primaryButtonText = 'Join Us This Sunday',
  secondaryButtonText = 'Watch Live Stream',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  showScrollIndicator = true,
  showSlideIndicators = true,
}: HeroSectionProps) => {
  // Use the hook for multi-slide functionality
  const {
    currentSlide,
    isScrolled,
    heroRef,
    contentRef,
    titleRef,
    subtitleRef,
    descriptionRef,
    buttonsRef,
    indicatorsRef,
    scrollIndicatorRef,
    colorScheme,
    scrollToNextSection,
    handleHoverEnter,
    handleHoverLeave,
    goToSlide,
    addToSlidesRef,
    addToIndicatorsRef,
  } = useHeroSection();

  // Determine if we're in multi-slide mode
  const isMultiSlide = Boolean(slides && slides.length > 0);

  // Get current slide data based on mode
  const currentSlideData = isMultiSlide
    ? slides![currentSlide]
    : {
        title: title!,
        subtitle,
        description,
        image: {
          src: backgroundImage!,
          alt: title,
        },
      };

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: isMultiSlide ? '120vh' : '100vh' }}
    >
      {/* Background Images */}
      {isMultiSlide ? (
        // Multi-slide mode - uses hook's slide management
        slides!.map((slide, index) => (
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
                alt={slide.image.alt || slide.title}
                className="
                  w-full h-full 
                  object-cover 
                  object-center 
                  lg:object-[center_top] 
                  xl:object-[center_center] 
                  scale-105 lg:scale-100
                "
                style={{
                  maxHeight: '120vh',
                }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/70" />
              <div className="absolute inset-0 bg-[#001910]/40 mix-blend-overlay" />
            </div>
          </div>
        ))
      ) : (
        // Single slide mode
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
      )}

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
              {currentSlideData.title}
            </H1>

            {/* Primary Color Divider Line - Only show if subtitle exists */}
            {currentSlideData.subtitle && (
              <div
                className="divider-line h-1 w-20 mx-auto mb-6 rounded-full transform origin-center"
                style={{ backgroundColor: colorScheme.primary }}
              ></div>
            )}

            {/* Primary Color Subtitle - Only show if subtitle exists */}
            {currentSlideData.subtitle && (
              <h2
                ref={subtitleRef}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6 leading-tight"
                style={{ color: colorScheme.primary }}
              >
                {currentSlideData.subtitle}
              </h2>
            )}

            {/* Description - Only show if description exists */}
            {currentSlideData.description && (
              <p
                ref={descriptionRef}
                className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto mb-8 leading-relaxed sm:leading-loose"
              >
                {currentSlideData.description}
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

      {/* Slide Indicators - Only show for multi-slide mode */}
      {isMultiSlide && showSlideIndicators && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center space-y-2">
          {slides!.map((_, index) => (
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
      )}

      {/* Scroll Indicator - Only show if showScrollIndicator is true */}
      {showScrollIndicator && (
        <>
          {/* Desktop Scroll Indicator */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden sm:block cursor-pointer group"
            onClick={scrollToNextSection}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            <div className="flex flex-col items-center">
              <ChevronDown
                className="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:translate-y-1"
                style={{ color: colorScheme.primary }}
              />
              <ChevronDown
                className="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:translate-y-1 -mt-[6px] delay-75"
                style={{ color: colorScheme.primary }}
              />
            </div>
          </div>

          {/* Mobile Scroll Indicator */}
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 sm:hidden cursor-pointer"
            onClick={scrollToNextSection}
          >
            <div className="flex flex-col items-center animate-bounce">
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
