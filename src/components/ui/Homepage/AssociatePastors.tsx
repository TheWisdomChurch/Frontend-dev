/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { pastorsData } from '@/lib/data';
import { H3, H4, SmallText, Caption } from '@/components/text';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import { useAssociatePastors } from '@/components/utils/hooks/useAssociate';
import {
  ArrowRight,
  Sparkles,
  Users,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';

/* --------------------------------------------
   TYPE DEFINITIONS
--------------------------------------------- */
interface PersonCardProps {
  item: any;
  colorScheme: any;
  mainAccentColor: string;
  addToRefs?: (ref: HTMLDivElement) => void;
  isMobileOrTablet?: boolean;
  isActive?: boolean;
}

/* --------------------------------------------
   REUSABLE CARD COMPONENT — COMPACT FOR DESKTOP
--------------------------------------------- */
function PersonCard({
  item,
  colorScheme,
  mainAccentColor,
  addToRefs,
  isMobileOrTablet = false,
  isActive = false,
}: PersonCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (element && addToRefs) {
        addToRefs(element);
      }
    },
    [addToRefs]
  );

  // Adjust sizes based on screen - COMPACT for desktop
  const cardWidth = isMobileOrTablet ? '280px' : '100%';
  const imageSize = isMobileOrTablet ? 'w-24 h-24' : 'w-20 h-20'; // Smaller on desktop
  const cardHeight = isMobileOrTablet ? 'min-h-[320px]' : 'min-h-[300px]'; // Shorter on desktop
  const textSize = isMobileOrTablet ? 'text-lg' : 'text-base';
  const descriptionSize = isMobileOrTablet ? 'text-13px' : 'text-xs';

  return (
    <div
      ref={element => {
        cardRef.current = element;
        handleRef(element);
      }}
      className={`group ${isMobileOrTablet ? 'flex-shrink-0' : 'w-full h-full'} transition-all duration-500`}
      style={
        isMobileOrTablet
          ? {
              width: cardWidth,
              transform: isActive
                ? 'scale(1) translateY(0)'
                : 'scale(0.85) translateY(5px)',
              opacity: isActive ? 1 : 0.4,
              zIndex: isActive ? 20 : 1,
              margin: '0 8px',
            }
          : {}
      }
    >
      <div
        className={`bg-white rounded-xl p-4 transition-all duration-500 hover:-translate-y-1 border relative overflow-hidden flex flex-col h-full ${cardHeight} ${isActive ? 'shadow-lg border-gray-300' : 'shadow-sm border-gray-200'}`}
        style={
          isActive && isMobileOrTablet
            ? {
                boxShadow: `0 15px 35px -5px ${colorScheme.primary}15, 0 10px 20px -10px ${colorScheme.primary}10`,
                background: 'linear-gradient(135deg, #FFFFFF, #FAFBFC)',
              }
            : {}
        }
      >
        {/* Active Card Gradient Background */}
        {isMobileOrTablet && isActive && (
          <div
            className="absolute inset-0 opacity-100 rounded-xl transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${colorScheme.primary}08, ${colorScheme.primaryDark}03)`,
            }}
          />
        )}

        {/* Subtle Background on Hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.primary}10, ${colorScheme.primaryDark}05)`,
          }}
        />

        {/* Centered Circular Image - More compact for desktop */}
        <div className="flex justify-center mb-4 flex-shrink-0 relative z-10">
          <div className="relative">
            <div
              className={`relative ${imageSize} rounded-full overflow-hidden transform transition-all duration-500 ${isActive ? 'group-hover:scale-105' : ''}`}
              style={{
                boxShadow:
                  isActive && isMobileOrTablet
                    ? `0 0 0 2px ${colorScheme.primary}, 0 0 0 4px white, 0 8px 25px ${colorScheme.primary}20`
                    : `0 0 0 2px ${isMobileOrTablet ? '#F3F4F6' : colorScheme.primary + '1A'}, 0 0 0 4px white`,
              }}
            >
              <Image
                src={item.image}
                alt={`${item.name} - ${item.role}`}
                width={isMobileOrTablet ? 96 : 80}
                height={isMobileOrTablet ? 96 : 80}
                sizes={
                  isMobileOrTablet ? '(max-width: 1024px) 96px, 80px' : '80px'
                }
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNGRjVGODUiIHJ4PSI0MCIvPjwvc3ZnPg=="
                onError={e => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  console.warn(`Image failed to load: ${item.image}`);
                }}
              />
            </div>

            {/* Role Badge - More compact */}
            <div
              className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full font-semibold whitespace-nowrap z-10 transition-all duration-500 ${isActive ? 'shadow-sm' : ''}`}
              style={{
                backgroundColor: isActive ? colorScheme.primary : '#F1F5F9',
                color: isActive ? '#000000' : '#64748B',
                border: isActive
                  ? `1px solid ${colorScheme.primary}30`
                  : '1px solid #E2E8F0',
                minWidth: isMobileOrTablet ? '100px' : '90px',
                fontSize: isMobileOrTablet ? '11px' : '10px',
                letterSpacing: '0.2px',
              }}
            >
              {item.role}
            </div>
          </div>
        </div>

        {/* Name & Description - More compact spacing */}
        <div className="text-center pt-2 relative z-10 flex flex-col flex-grow justify-start">
          <div className="mb-2">
            <SmallText
              weight="bold"
              style={{ color: isActive ? mainAccentColor : '#1E293B' }}
              useThemeColor={false}
              className={`${textSize} mb-1 transition-colors duration-300 line-clamp-1`}
            >
              {item.name}
            </SmallText>
            {item.title && (
              <Caption
                className="text-gray-500 font-medium transition-all duration-300 mb-1"
                useThemeColor={false}
                style={{
                  fontSize: isMobileOrTablet ? '11px' : '10px',
                  letterSpacing: '0.3px',
                }}
              >
                {item.title}
              </Caption>
            )}
          </div>

          {item.description && (
            <div className="px-1">
              <Caption
                className="transition-all duration-300 line-clamp-3 leading-snug flex items-center justify-center"
                useThemeColor={false}
                style={{
                  color: isActive ? '#475569' : '#64748B',
                  fontSize: descriptionSize,
                  lineHeight: '1.4',
                }}
              >
                {item.description}
              </Caption>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------
   SEE MORE CARD (Mobile & Tablet Only)
--------------------------------------------- */
function SeeMoreCard({
  colorScheme,
  onClick,
  isActive = false,
  isMobileOrTablet = true,
}: {
  colorScheme: any;
  onClick: () => void;
  isActive?: boolean;
  isMobileOrTablet?: boolean;
}) {
  const cardWidth = isMobileOrTablet ? '280px' : 'auto';
  const iconSize = isMobileOrTablet ? 'w-20 h-20' : 'w-16 h-16';
  const iconInnerSize = isMobileOrTablet ? 'w-10 h-10' : 'w-8 h-8';
  const cardHeight = isMobileOrTablet ? 'min-h-[320px]' : 'min-h-[300px]';

  return (
    <div
      className={`flex-shrink-0 cursor-pointer transition-all duration-500 ${isActive ? 'scale-100 opacity-100 z-20' : 'scale-85 opacity-40'}`}
      style={{
        width: cardWidth,
        margin: isMobileOrTablet ? '0 8px' : '0',
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div
        className={`bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 transition-all duration-500 hover:-translate-y-1 border-2 border-dashed relative overflow-hidden flex flex-col h-full items-center justify-center ${cardHeight}`}
        style={
          isActive
            ? {
                borderColor: colorScheme.primary,
                background: `linear-gradient(135deg, ${colorScheme.primary}10, #FFFFFF)`,
                boxShadow: `0 15px 35px -5px ${colorScheme.primary}15`,
              }
            : {
                borderColor: '#CBD5E1',
                background: 'linear-gradient(135deg, #F8FAFC, #FFFFFF)',
              }
        }
      >
        {/* Animated background */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.primary}15, ${colorScheme.primaryDark}08)`,
          }}
        />

        {/* Icon */}
        <div className="relative mb-4">
          <div
            className={`${iconSize} rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110`}
            style={{
              backgroundColor: `${colorScheme.primary}20`,
              border: `2px solid ${colorScheme.primary}30`,
            }}
          >
            <MoreHorizontal
              className={iconInnerSize}
              style={{ color: colorScheme.primary }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center relative z-10 px-3">
          <SmallText
            weight="bold"
            style={{ color: colorScheme.primary }}
            useThemeColor={false}
            className={`${isMobileOrTablet ? 'text-lg' : 'text-base'} mb-2`}
          >
            View All Members
          </SmallText>
          <Caption
            className="text-gray-600 mb-4 text-sm leading-relaxed text-center"
            useThemeColor={false}
            style={{
              lineHeight: '1.4',
              fontSize: isMobileOrTablet ? '13px' : '12px',
            }}
          >
            Explore complete leadership team
          </Caption>

          <div
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
            style={{
              backgroundColor: colorScheme.primary,
              color: '#000000',
              boxShadow: `0 2px 8px ${colorScheme.primary}30`,
            }}
          >
            View All
            <ArrowRight className="w-3 h-3 ml-1.5 inline-block" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------
   MAIN COMPONENT - Fixed Desktop Layout (4 cards)
--------------------------------------------- */
export default function AssociatePastors() {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const {
    sectionRef,
    contentRef,
    headingRef,
    descriptionRef,
    addSectionHeaderRef,
    addToRefs,
  } = useAssociatePastors();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  // Card dimensions for calculation
  const CARD_WIDTH = 280;
  const CARD_MARGIN = 8;
  const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;

  // Check for mobile & tablet (up to 1024px)
  useEffect(() => {
    const checkViewport = () => {
      const isTabletOrMobile = window.innerWidth < 1024;
      setIsMobileOrTablet(isTabletOrMobile);

      if (isTabletOrMobile && sliderContainerRef.current) {
        const width = sliderContainerRef.current.offsetWidth;
        setSliderWidth(width);
      }
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Update slider width
  useEffect(() => {
    if (isMobileOrTablet && sliderContainerRef.current) {
      const width = sliderContainerRef.current.offsetWidth;
      setSliderWidth(width);
    }
  }, [isMobileOrTablet]);

  const isDarkMode = colorScheme.pageBackground === '#000000';
  const mainAccentColor = isDarkMode ? colorScheme.primary : '#000000';

  // Get pastoral leaders data only
  const currentData = pastorsData;

  // For mobile & tablet: show 2 cards + "See More" card
  const sliderCards = currentData.slice(0, 2);
  const totalSliderSlides = sliderCards.length + 1;

  // For desktop: show first 4 cards
  const desktopPastors = pastorsData.slice(0, 4);

  // Calculate translateX for centering
  const calculateTranslateX = useCallback(() => {
    if (!isMobileOrTablet || !sliderWidth) return 'translateX(0px)';

    const slidePosition = currentSlide * CARD_TOTAL_WIDTH;
    const offset = (sliderWidth - CARD_WIDTH) / 2;
    const translateX = -slidePosition + offset;

    return `translateX(${translateX}px)`;
  }, [currentSlide, isMobileOrTablet, sliderWidth]);

  // Handle routing
  const handleSeeMore = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      router.push('/leadership');
    },
    [router]
  );

  const handleMobileSeeMore = useCallback(() => {
    router.push('/leadership');
  }, [router]);

  // Navigation for slider
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => {
      const next = prev + 1;
      return next >= totalSliderSlides ? 0 : next;
    });
  }, [totalSliderSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => {
      const next = prev - 1;
      return next < 0 ? totalSliderSlides - 1 : next;
    });
  }, [totalSliderSlides]);

  // Handle slide indicator click
  const handleSlideClick = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  return (
    <Section
      ref={sectionRef}
      padding="lg"
      fullHeight={false}
      style={{ backgroundColor: '#FFFFFF' }}
      className="relative overflow-hidden bg-white"
    >
      <Container size="xl" className="relative z-10">
        {/* Header Section */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="md"
          className="text-center pt-8 sm:pt-12 lg:pt-16 pb-4 sm:pb-6 lg:pb-8"
        >
          <div className="relative">
            <H3
              ref={headingRef}
              className="leading-tight relative text-xl sm:text-2xl lg:text-4xl"
              style={{ color: mainAccentColor }}
              useThemeColor={false}
              weight="black"
              smWeight="black"
            >
              Church Leadership
            </H3>
          </div>
          <Caption
            ref={descriptionRef}
            className="max-w-2xl sm:max-w-3xl mx-auto leading-relaxed text-gray-600 mt-2 sm:mt-4 px-4 text-sm sm:text-lg font-light"
            useThemeColor={false}
          >
            Meet our dedicated pastoral team guiding our community with wisdom, compassion, and spiritual direction.
          </Caption>
        </FlexboxLayout>

        <div ref={contentRef}>
          {/* Mobile & Tablet View */}
          {isMobileOrTablet ? (
            <div className="mb-8">
              {/* Active Section Title */}
              <div className="relative flex justify-center mb-8">
                <H4
                  ref={addSectionHeaderRef}
                  className="text-center relative inline-block text-xl font-bold"
                  style={{ color: mainAccentColor }}
                  useThemeColor={false}
                  weight="bold"
                  smWeight="extrabold"
                >
                  Pastoral Team
                  <div
                    className="absolute -bottom-2 left-0 w-full h-1 transition-all duration-500 rounded-full"
                    style={{
                      backgroundColor: colorScheme.primary,
                      boxShadow: `0 2px 8px ${colorScheme.primary}30`,
                    }}
                  />
                </H4>
              </div>

              {/* Mobile & Tablet Card Slider */}
              <div className="relative mb-8">
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-gray-300 hover:shadow-2xl transition-all duration-300 active:scale-95"
                  style={{
                    color: colorScheme.primary,
                    boxShadow: `0 8px 25px rgba(0,0,0,0.15)`,
                  }}
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-gray-300 hover:shadow-2xl transition-all duration-300 active:scale-95"
                  style={{
                    color: colorScheme.primary,
                    boxShadow: `0 8px 25px rgba(0,0,0,0.15)`,
                  }}
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Slider Container */}
                <div ref={sliderContainerRef} className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: calculateTranslateX(),
                      width: 'fit-content',
                      willChange: 'transform',
                    }}
                  >
                    {/* Display cards */}
                    {sliderCards.map((item, index) => (
                      <PersonCard
                        key={`slider-${item.name}-${index}`}
                        item={item}
                        colorScheme={colorScheme}
                        mainAccentColor={mainAccentColor}
                        addToRefs={addToRefs}
                        isMobileOrTablet={true}
                        isActive={index === currentSlide}
                      />
                    ))}

                    {/* "See More" Card */}
                    <SeeMoreCard
                      colorScheme={colorScheme}
                      onClick={handleMobileSeeMore}
                      isActive={currentSlide === sliderCards.length}
                      isMobileOrTablet={true}
                    />
                  </div>
                </div>

                {/* Enhanced Slide Indicators */}
                <div className="flex justify-center mt-10 gap-3">
                  {Array.from({ length: totalSliderSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlideClick(index)}
                      className={`h-2 rounded-full transition-all duration-300 hover:scale-125 active:scale-95 ${
                        index === currentSlide
                          ? 'w-10 scale-125'
                          : 'w-3 bg-gray-300 hover:bg-gray-400'
                      }`}
                      style={{
                        backgroundColor:
                          index === currentSlide
                            ? colorScheme.primary
                            : '#D1D5DB',
                        boxShadow:
                          index === currentSlide
                            ? `0 3px 10px ${colorScheme.primary}40`
                            : 'none',
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Desktop View */
            <div className="w-full">
              {/* Pastoral Leaders Section - 4 Cards */}
              <div className="w-full mb-12 lg:mb-16">
                {/* Section Title - Centered */}
                <FlexboxLayout
                  direction="column"
                  align="center"
                  className="mb-8 lg:mb-12"
                >
                  <H4
                    ref={addSectionHeaderRef}
                    className="text-center text-2xl lg:text-3xl font-bold mb-4"
                    style={{ color: mainAccentColor }}
                    useThemeColor={false}
                    weight="bold"
                    smWeight="extrabold"
                  >
                    Pastoral Team
                  </H4>
                  <div
                    className="w-24 h-1 rounded-full"
                    style={{
                      backgroundColor: colorScheme.primary,
                      boxShadow: `0 2px 8px ${colorScheme.primary}30`,
                    }}
                  />
                </FlexboxLayout>

                {/* Grid with 4 cards - Centered layout */}
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-6xl">
                    <GridboxLayout
                      columns={4}
                      gap="lg"
                      responsive={{
                        sm: 1,
                        md: 2,
                        lg: 4,
                        xl: 4,
                      }}
                      className="w-full"
                    >
                      {desktopPastors.map((item, index) => (
                        <div
                          key={`desktop-pastor-${item.name}-${index}`}
                          className="h-full"
                        >
                          <PersonCard
                            item={item}
                            colorScheme={colorScheme}
                            mainAccentColor={mainAccentColor}
                            addToRefs={addToRefs}
                            isMobileOrTablet={false}
                          />
                        </div>
                      ))}
                    </GridboxLayout>
                  </div>
                </div>
              </div>

              {/* Desktop See More Button - Centered */}
              <FlexboxLayout
                justify="center"
                className="pt-4 lg:pt-8 pb-8 lg:pb-16"
              >
                <div className="relative group">
                  <CustomButton
                    onClick={handleSeeMore}
                    variant="primary"
                    size="lg"
                    curvature="xl"
                    elevated={false}
                    leftIcon={
                      <Users className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                    }
                    rightIcon={
                      <Sparkles className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:rotate-180" />
                    }
                    className="group relative px-8 py-3 text-base font-bold transition-all duration-300 border-0 hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark || colorScheme.primary})`,
                      color: '#000000',
                      boxShadow: `0 6px 20px ${colorScheme.primary}30`,
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Meet All Leaders
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${colorScheme.primary}90, ${colorScheme.primaryDark || colorScheme.primary}90)`,
                      }}
                    />
                  </CustomButton>
                </div>
              </FlexboxLayout>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}