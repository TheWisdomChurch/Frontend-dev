// components/ui/Homepage/Herosection.tsx
'use client';

import { H1, H2, BodyXL } from '@/components/text';
import { Button } from '@/components/utils';
import { ChevronDown } from 'lucide-react';
import { useHeroSection } from '@/components/utils/hooks/useHeroSection';

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

  const isMultiSlide = Boolean(slides && slides.length > 0);
  const isDarkMode = colorScheme.pageBackground === '#000000';

  const currentSlideData = isMultiSlide
    ? slides![currentSlide]
    : {
        title: title!,
        subtitle,
        description,
        image: { src: backgroundImage!, alt: title },
      };

  // Smart colors based on your exact request
  const titleColor = isDarkMode ? '#FFFFFF' : colorScheme.primary; // White (dark) / Yellow (light)
  const subtitleColor = isDarkMode ? colorScheme.primary : '#FFFFFF'; // Yellow (dark) / White (light)
  const descriptionColor = '#FFFFFF'; // Always pure white (your "twirk")

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden hero-section"
    >
      {/* Background Slides */}
      {isMultiSlide ? (
        slides!.map((slide, index) => (
          <div
            key={index}
            ref={el => addToSlidesRef(el, index)}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={slide.image.src}
                alt={slide.image.alt || slide.title}
                className="w-full h-full object-cover"
              />

              {/* Enhanced gradient overlay for better text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)'
                    : 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
                }}
              />
              {/* Strong vertical gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              {/* Additional center gradient for focus */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
            </div>
          </div>
        ))
      ) : (
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <img
              src={backgroundImage}
              alt={title}
              className="w-full h-full object-cover"
            />
            {/* Enhanced gradient overlay for better text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
              }}
            />
            {/* Strong vertical gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            {/* Additional center gradient for focus */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div
        ref={contentRef}
        className="relative z-20 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto text-center">
          {/* Main Title - Fully Responsive */}
          <H1
            ref={titleRef}
            className="mb-3 sm:mb-4 leading-tight tracking-tight"
            style={{
              color: titleColor,
              textShadow: '0 6px 30px rgba(0, 0, 0, 0.9)',
            }}
            useThemeColor={false}
          >
            <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl block">
              {currentSlideData.title}
            </span>
          </H1>

          {/* Yellow/White Divider */}
          {currentSlideData.subtitle && (
            <div
              className="h-1 w-16 sm:w-20 md:w-24 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          )}

          {/* Subtitle – Your special twirk */}
          {currentSlideData.subtitle && (
            <H2
              ref={subtitleRef}
              className="mb-6 sm:mb-7 md:mb-8"
              style={{
                color: subtitleColor,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
              }}
              useThemeColor={false}
            >
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl block">
                {currentSlideData.subtitle}
              </span>
            </H2>
          )}

          {/* Description – Always pure white */}
          {currentSlideData.description && (
            <BodyXL
              ref={descriptionRef}
              className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed"
              style={{
                color: descriptionColor,
                textShadow: '0 3px 15px rgba(0, 0, 0, 0.8)',
              }}
              useThemeColor={false}
            >
              <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl block">
                {currentSlideData.description}
              </span>
            </BodyXL>
          )}

          {/* Buttons */}
          {showButtons && (
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 justify-center items-center"
            >
              <Button
                variant="primary"
                size="lg"
                elevated={true}
                curvature="lg"
                className="px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 font-bold hover:scale-105 transition text-sm sm:text-base md:text-lg"
                onClick={onPrimaryButtonClick}
              >
                {primaryButtonText}
              </Button>

              <Button
                variant="outline"
                size="lg"
                curvature="lg"
                className="px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 font-bold border-2 sm:border-3 transition-all duration-300 text-sm sm:text-base md:text-lg"
                style={{
                  borderColor: colorScheme.primary,
                  color: isDarkMode ? '#FFFFFF' : '#FFFFFF',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = colorScheme.primary;
                  e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onClick={onSecondaryButtonClick}
              >
                {secondaryButtonText}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Indicators & Scroll */}
      {isMultiSlide && showSlideIndicators && (
        <div className="absolute right-3 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 sm:gap-3 md:gap-4">
          {slides!.map((_, index) => (
            <button
              key={index}
              ref={el => addToIndicatorsRef(el, index)}
              onClick={() => goToSlide(index)}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full transition-all hover:scale-150"
              style={{
                backgroundColor:
                  index === currentSlide
                    ? colorScheme.primary
                    : `${colorScheme.white}50`,
                boxShadow:
                  index === currentSlide
                    ? `0 0 10px ${colorScheme.primary}`
                    : 'none',
              }}
            />
          ))}
        </div>
      )}

      {showScrollIndicator && (
        <>
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-30 hidden sm:block cursor-pointer group"
            onClick={scrollToNextSection}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            <div className="flex flex-col items-center animate-bounce">
              <ChevronDown
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 drop-shadow-2xl"
                style={{ color: colorScheme.primary }}
              />
              <ChevronDown
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 -mt-3 sm:-mt-4 drop-shadow-2xl"
                style={{ color: colorScheme.primary }}
              />
            </div>
          </div>
          <div
            className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 sm:hidden cursor-pointer"
            onClick={scrollToNextSection}
          >
            <div className="flex flex-col items-center animate-bounce">
              <ChevronDown
                className="w-5 h-5 drop-shadow-2xl"
                style={{ color: colorScheme.primary }}
              />
              <ChevronDown
                className="w-5 h-5 -mt-2 drop-shadow-2xl"
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
