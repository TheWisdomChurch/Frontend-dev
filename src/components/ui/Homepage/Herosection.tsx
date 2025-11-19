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

              {/* Stronger overlay in light mode for white text visibility */}
              <div
                className="absolute inset-0"
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0.8))'
                    : 'linear-gradient(to bottom right, rgba(0,0,0,0.75), rgba(0,0,0,0.95))',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
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
            <div
              className="absolute inset-0"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0.8))'
                  : 'linear-gradient(to bottom right, rgba(0,0,0,0.75), rgba(0,0,0,0.95))',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div
        ref={contentRef}
        className="relative z-20 h-full flex items-center justify-center px-4"
      >
        <div className="w-full max-w-7xl mx-auto text-center">
          {/* Main Title */}
          <H1
            ref={titleRef}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 leading-tight tracking-tight"
            style={{
              color: titleColor,
              textShadow: '0 6px 30px rgba(0, 0, 0, 0.9)',
            }}
          >
            {currentSlideData.title}
          </H1>

          {/* Yellow/White Divider */}
          {currentSlideData.subtitle && (
            <div
              className="h-1 w-24 mx-auto mb-6 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          )}

          {/* Subtitle – Your special twirk */}
          {currentSlideData.subtitle && (
            <h2
              ref={subtitleRef}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8"
              style={{
                color: subtitleColor,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
              }}
            >
              {currentSlideData.subtitle}
            </h2>
          )}

          {/* Description – Always pure white */}
          {currentSlideData.description && (
            <p
              ref={descriptionRef}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto mb-12 leading-relaxed font-light"
              style={{
                color: descriptionColor,
                textShadow: '0 3px 15px rgba(0, 0, 0, 0.8)',
              }}
            >
              {currentSlideData.description}
            </p>
          )}

          {/* Buttons */}
          {showButtons && (
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button
                variant="primary"
                size="lg"
                elevated={true}
                curvature="lg"
                className="px-10 py-5 text-lg font-bold hover:scale-105 transition"
                onClick={onPrimaryButtonClick}
              >
                {primaryButtonText}
              </Button>

              <Button
                variant="outline"
                size="lg"
                curvature="lg"
                className="px-10 py-5 text-lg font-bold border-3 transition-all duration-300"
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

      {/* Indicators & Scroll – unchanged (already perfect) */}
      {isMultiSlide && showSlideIndicators && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
          {slides!.map((_, index) => (
            <button
              key={index}
              ref={el => addToIndicatorsRef(el, index)}
              onClick={() => goToSlide(index)}
              className="w-3 h-3 rounded-full transition-all hover:scale-150"
              style={{
                backgroundColor:
                  index === currentSlide
                    ? colorScheme.primary
                    : `${colorScheme.white}50`,
                boxShadow:
                  index === currentSlide
                    ? `0 0 15px ${colorScheme.primary}`
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
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden sm:block cursor-pointer group"
            onClick={scrollToNextSection}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            <div className="flex flex-col items-center animate-bounce">
              <ChevronDown
                className="w-10 h-10 drop-shadow-2xl"
                style={{ color: colorScheme.primary }}
              />
              <ChevronDown
                className="w-10 h-10 -mt-4 drop-shadow-2xl"
                style={{ color: colorScheme.primary }}
              />
            </div>
          </div>
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 sm:hidden"
            onClick={scrollToNextSection}
          >
            <ChevronDown
              className="w-8 h-8 animate-bounce"
              style={{ color: colorScheme.primary }}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;
