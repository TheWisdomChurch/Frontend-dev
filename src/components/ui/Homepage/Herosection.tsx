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
      className="relative w-full overflow-hidden hero-section"
    >
      {/* Background Images */}
      {isMultiSlide ? (
        // Multi-slide mode - uses hook's slide management
        slides!.map((slide, index) => (
          <div
            key={index}
            ref={el => addToSlidesRef(el, index)}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out hero-section ${
              index === currentSlide
                ? 'opacity-100 z-10'
                : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <div className="relative w-full h-full hero-section">
              <img
                src={slide.image.src}
                alt={slide.image.alt || slide.title}
                className="
                  w-full h-full 
                  object-cover 
                  object-center
                  md:object-center
                  lg:object-center
                  xl:object-center
                  scale-100
                  hero-section
                "
              />
              {/* Enhanced Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
            </div>
          </div>
        ))
      ) : (
        // Single slide mode
        <div className="absolute inset-0 hero-section">
          <div className="relative w-full h-full hero-section">
            <img
              src={backgroundImage}
              alt={title}
              className="
                w-full h-full 
                object-cover 
                object-center
                md:object-center
                lg:object-center
                xl:object-center
                scale-100
                hero-section
              "
            />
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
          </div>
        </div>
      )}

      {/* Content - Centered in the container */}
      <div
        ref={contentRef}
        className="relative z-20 h-full flex items-center justify-center px-4 hero-section"
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center" style={{ color: colorScheme.text }}>
            {/* Main Title - Reduced mobile size */}
            <H1
              ref={titleRef}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4 leading-tight tracking-tight"
              style={{ color: colorScheme.white }}
            >
              {currentSlideData.title}
            </H1>

            {/* Primary Color Divider Line - Only show if subtitle exists */}
            {currentSlideData.subtitle && (
              <div
                className="divider-line h-0.5 xs:h-1 w-16 xs:w-20 mx-auto mb-4 sm:mb-6 rounded-full transform origin-center"
                style={{ backgroundColor: colorScheme.primary }}
              ></div>
            )}

            {/* Primary Color Subtitle - Only show if subtitle exists */}
            {currentSlideData.subtitle && (
              <h2
                ref={subtitleRef}
                className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-4 sm:mb-6 leading-tight"
                style={{ color: colorScheme.primary }}
              >
                {currentSlideData.subtitle}
              </h2>
            )}

            {/* Description - Only show if description exists */}
            {currentSlideData.description && (
              <p
                ref={descriptionRef}
                className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed sm:leading-loose"
              >
                {currentSlideData.description}
              </p>
            )}

            {/* Buttons - Only show if showButtons is true */}
            {showButtons && (
              <div
                ref={buttonsRef}
                className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-4 justify-center items-center w-full xs:w-auto"
              >
                {/* Primary Button - Reduced mobile width */}
                <Button
                  variant="primary"
                  size="lg"
                  elevated={true}
                  curvature="lg"
                  className="w-4/5 xs:w-full sm:w-auto text-sm xs:text-base px-4 xs:px-6 py-2 xs:py-3"
                  onClick={onPrimaryButtonClick}
                >
                  {primaryButtonText}
                </Button>

                {/* Secondary Button - Reduced mobile width */}
                <Button
                  variant="outline"
                  size="lg"
                  curvature="lg"
                  className="w-4/5 xs:w-full sm:w-auto text-sm xs:text-base px-4 xs:px-6 py-2 xs:py-3"
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
        <div className="absolute right-4 xs:right-6 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center space-y-1 xs:space-y-2">
          {slides!.map((_, index) => (
            <button
              key={index}
              ref={el => addToIndicatorsRef(el, index)}
              onClick={() => goToSlide(index)}
              className={`relative w-1 h-1 xs:w-1 xs:h-1 rounded-full overflow-hidden transition-all duration-500 ease-out hover:scale-110 ${
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
            className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 hidden sm:block cursor-pointer group"
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
            className="absolute bottom-3 xs:bottom-4 left-1/2 transform -translate-x-1/2 z-30 sm:hidden cursor-pointer"
            onClick={scrollToNextSection}
          >
            <div className="flex flex-col items-center animate-bounce">
              <ChevronDown
                className="w-4 h-4 xs:w-5 xs:h-5"
                style={{ color: colorScheme.primary }}
              />
              <ChevronDown
                className="w-4 h-4 xs:w-5 xs:h-5 -mt-[4px] xs:-mt-[5px]"
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
