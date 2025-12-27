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
  layoutType?: 'staggered' | 'centered' | 'mobile';
  index?: number;
}

/* --------------------------------------------
   REUSABLE CARD COMPONENT - OPTIMIZED FOR STAGGERED LAYOUT
--------------------------------------------- */
function PersonCard({
  item,
  colorScheme,
  mainAccentColor,
  addToRefs,
  isMobileOrTablet = false,
  isActive = false,
  layoutType = 'centered',
  index = 0,
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

  // Get sizes based on layout type
  const getSizes = () => {
    switch (layoutType) {
      case 'staggered':
        return {
          imageSize: 'w-20 h-20', // Slightly larger for staggered
          cardHeight: 'min-h-[280px]',
          titleSize: 'text-base',
          roleSize: 'text-xs',
          descriptionSize: 'text-xs',
          padding: 'p-5',
        };
      case 'mobile':
        return {
          imageSize: 'w-20 h-20',
          cardHeight: 'min-h-[280px]',
          titleSize: 'text-base',
          roleSize: 'text-sm',
          descriptionSize: 'text-xs',
          padding: 'p-4',
        };
      default: // centered
        return {
          imageSize: 'w-16 h-16',
          cardHeight: 'min-h-[260px]',
          titleSize: 'text-sm',
          roleSize: 'text-xs',
          descriptionSize: 'text-xs',
          padding: 'p-4',
        };
    }
  };

  const sizes = getSizes();

  // Calculate stagger offset for desktop/tablet
  const getStaggerOffset = () => {
    if (layoutType !== 'staggered') return {};
    
    // Create a zigzag pattern: every 3 cards repeat pattern
    const patternIndex = index % 3;
    let staggerStyle = {};
    
    switch (patternIndex) {
      case 0: // First in group - normal
        staggerStyle = {
          marginTop: '0',
          marginLeft: '0',
        };
        break;
      case 1: // Second in group - offset down
        staggerStyle = {
          marginTop: '1.5rem',
          marginLeft: '-0.5rem',
        };
        break;
      case 2: // Third in group - offset up
        staggerStyle = {
          marginTop: '-1rem',
          marginLeft: '0.5rem',
        };
        break;
    }
    
    return staggerStyle;
  };

  const staggerOffset = getStaggerOffset();

  return (
    <div
      ref={element => {
        cardRef.current = element;
        handleRef(element);
      }}
      className={`group transition-all duration-300 hover:-translate-y-1 ${
        layoutType === 'mobile' ? 'flex-shrink-0' : 'w-full h-full'
      } ${layoutType === 'staggered' ? 'relative z-10' : ''}`}
      style={
        layoutType === 'mobile'
          ? {
              width: '280px',
              transform: isActive
                ? 'scale(1) translateY(0)'
                : 'scale(0.9) translateY(5px)',
              opacity: isActive ? 1 : 0.5,
              zIndex: isActive ? 20 : 1,
              margin: '0 8px',
            }
          : layoutType === 'staggered'
          ? {
              ...staggerOffset,
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }
          : {}
      }
    >
      <div
        className={`bg-white rounded-xl ${sizes.padding} transition-all duration-300 border relative overflow-hidden flex flex-col h-full ${sizes.cardHeight} ${
          isActive ? 'shadow-lg border-gray-300' : 'shadow-md border-gray-200'
        } ${
          layoutType === 'staggered'
            ? 'hover:shadow-xl hover:border-gray-300 hover:scale-[1.02]'
            : ''
        }`}
        style={
          layoutType === 'staggered'
            ? {
                background: 'linear-gradient(135deg, #FFFFFF, #F8FAFC)',
                boxShadow: `0 8px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px ${colorScheme.primary}10`,
              }
            : {}
        }
      >
        {/* Gradient border effect on hover */}
        {layoutType === 'staggered' && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"
            style={{
              background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark || colorScheme.primary})`,
              transform: 'scale(1.02)',
            }}
          />
        )}

        {/* Hover background */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.primary}05, ${colorScheme.primaryDark}02)`,
          }}
        />

        {/* Image container */}
        <div className={`flex justify-center mb-4 flex-shrink-0 relative z-10`}>
          <div className="relative">
            <div
              className={`relative ${sizes.imageSize} rounded-full overflow-hidden transform transition-all duration-300 group-hover:scale-105`}
              style={{
                boxShadow: `0 0 0 2px ${colorScheme.primary}1A, 0 0 0 4px white, 0 8px 25px ${colorScheme.primary}15`,
              }}
            >
              <Image
                src={item.image}
                alt={`${item.name} - ${item.role}`}
                width={layoutType === 'staggered' ? 80 : layoutType === 'mobile' ? 80 : 64}
                height={layoutType === 'staggered' ? 80 : layoutType === 'mobile' ? 80 : 64}
                sizes={
                  layoutType === 'staggered'
                    ? '80px'
                    : layoutType === 'mobile'
                    ? '(max-width: 1024px) 80px, 64px'
                    : '64px'
                }
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNGRjVGODUiIHJ4PSI0MCIvPjwvc3ZnPg=="
                onError={e => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Role badge */}
            <div
              className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full font-semibold whitespace-nowrap z-10 transition-all duration-300`}
              style={{
                backgroundColor: isActive ? colorScheme.primary : '#F1F5F9',
                color: isActive ? '#000000' : '#64748B',
                border: isActive
                  ? `1px solid ${colorScheme.primary}30`
                  : '1px solid #E2E8F0',
                minWidth: '90px',
                fontSize: sizes.roleSize,
                letterSpacing: '0.2px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {item.role}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-grow justify-start relative z-10 text-center`}>
          <div className="mb-3">
            <SmallText
              weight="bold"
              style={{ color: mainAccentColor }}
              useThemeColor={false}
              className={`${sizes.titleSize} mb-1 line-clamp-1`}
            >
              {item.name}
            </SmallText>
            {item.title && (
              <Caption
                className="text-gray-500 font-medium mb-2"
                useThemeColor={false}
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.3px',
                  lineHeight: '1.2',
                }}
              >
                {item.title}
              </Caption>
            )}
          </div>

          {item.description && (
            <div>
              <Caption
                className="text-gray-600 line-clamp-3 leading-relaxed"
                useThemeColor={false}
                style={{
                  fontSize: sizes.descriptionSize,
                  lineHeight: '1.4',
                }}
              >
                {item.description}
              </Caption>
            </div>
          )}
        </div>

        {/* Floating accent on staggered cards */}
        {layoutType === 'staggered' && (
          <div
            className="absolute top-0 right-0 w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, ${colorScheme.primary}20, transparent 70%)`,
              transform: 'translate(25%, -25%)',
            }}
          />
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------
   SEE MORE CARD - OPTIMIZED
--------------------------------------------- */
function SeeMoreCard({
  colorScheme,
  onClick,
  isActive = false,
  layoutType = 'mobile',
}: {
  colorScheme: any;
  onClick: () => void;
  isActive?: boolean;
  layoutType?: 'staggered' | 'mobile';
}) {
  const iconSize = layoutType === 'staggered' ? 'w-20 h-20' : 'w-16 h-16';
  const iconInnerSize = layoutType === 'staggered' ? 'w-10 h-10' : 'w-8 h-8';

  return (
    <div
      className={`cursor-pointer transition-all duration-300 ${
        layoutType === 'mobile'
          ? `flex-shrink-0 ${isActive ? 'scale-100 opacity-100 z-20' : 'scale-90 opacity-50'}`
          : 'w-full h-full'
      }`}
      style={
        layoutType === 'mobile'
          ? {
              width: '280px',
              margin: '0 8px',
            }
          : {}
      }
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div
        className={`bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 border-2 border-dashed relative overflow-hidden flex flex-col h-full items-center justify-center min-h-[280px]`}
        style={
          isActive || layoutType === 'staggered'
            ? {
                borderColor: colorScheme.primary,
                background: `linear-gradient(135deg, ${colorScheme.primary}08, #FFFFFF)`,
                boxShadow: `0 8px 30px ${colorScheme.primary}15, 0 0 0 1px ${colorScheme.primary}20`,
              }
            : {
                borderColor: '#CBD5E1',
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
              }
        }
      >
        {/* Hover background */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.primary}15, ${colorScheme.primaryDark}08)`,
          }}
        />

        {/* Icon */}
        <div className="relative mb-4">
          <div
            className={`${iconSize} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110`}
            style={{
              backgroundColor: `${colorScheme.primary}15`,
              border: `2px dashed ${colorScheme.primary}30`,
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
            className={`${layoutType === 'staggered' ? 'text-lg' : 'text-base'} mb-2`}
          >
            View All Members
          </SmallText>
          <Caption
            className="text-gray-600 mb-4"
            useThemeColor={false}
            style={{
              fontSize: '0.75rem',
              lineHeight: '1.3',
            }}
          >
            Explore complete leadership team
          </Caption>

          <div
            className="px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
            style={{
              backgroundColor: colorScheme.primary,
              color: '#000000',
              boxShadow: `0 4px 12px ${colorScheme.primary}30`,
            }}
          >
            View All
            <ArrowRight className="w-3 h-3 ml-2 inline-block" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------
   MAIN COMPONENT - STAGGERED LAYOUT
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

  // Viewport detection
  useEffect(() => {
    const checkViewport = () => {
      const isTabletOrMobile = window.innerWidth < 1024;
      setIsMobileOrTablet(isTabletOrMobile);

      if (isTabletOrMobile && sliderContainerRef.current) {
        setSliderWidth(sliderContainerRef.current.offsetWidth);
      }
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Update slider width
  useEffect(() => {
    if (isMobileOrTablet && sliderContainerRef.current) {
      setSliderWidth(sliderContainerRef.current.offsetWidth);
    }
  }, [isMobileOrTablet]);

  const isDarkMode = colorScheme.pageBackground === '#000000';
  const mainAccentColor = isDarkMode ? colorScheme.primary : '#000000';

  // Get data
  const currentData = pastorsData;

  // For mobile: show 2 cards + "See More" card
  const sliderCards = currentData.slice(0, 2);
  const totalSliderSlides = sliderCards.length + 1;

  // For tablet & desktop: show first 4 cards in staggered layout
  const tabletDesktopPastors = pastorsData.slice(0, 4);

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
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-purple-50 to-transparent rounded-full blur-3xl opacity-30"></div>
      </div>

      <Container size="xl" className="relative z-10">
        {/* Optimized Header Section */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="sm"
          className="text-center pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8"
        >
          <div className="relative">
            <H3
              ref={headingRef}
              className="leading-tight relative text-2xl sm:text-3xl lg:text-4xl"
              style={{ color: mainAccentColor }}
              useThemeColor={false}
              weight="black"
              smWeight="black"
            >
              Church Leadership
            </H3>
            <div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full"
              style={{
                backgroundColor: colorScheme.primary,
                boxShadow: `0 2px 8px ${colorScheme.primary}30`,
              }}
            />
          </div>
          <Caption
            ref={descriptionRef}
            className="max-w-xl sm:max-w-2xl mx-auto leading-relaxed text-gray-600 mt-4 px-4 text-sm sm:text-base font-light"
            useThemeColor={false}
          >
            Meet our dedicated pastoral team guiding our community with wisdom, compassion, and spiritual direction.
          </Caption>
        </FlexboxLayout>

        <div ref={contentRef}>
          {/* Mobile View */}
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
                </H4>
              </div>

              {/* Mobile Card Slider */}
              <div className="relative mb-8">
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-gray-200 hover:shadow-2xl transition-all duration-300 active:scale-95"
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-gray-200 hover:shadow-2xl transition-all duration-300 active:scale-95"
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
                        layoutType="mobile"
                      />
                    ))}

                    {/* "See More" Card */}
                    <SeeMoreCard
                      colorScheme={colorScheme}
                      onClick={handleMobileSeeMore}
                      isActive={currentSlide === sliderCards.length}
                      layoutType="mobile"
                    />
                  </div>
                </div>

                {/* Slide Indicators */}
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
            /* Tablet & Desktop View with STAGGERED Layout */
            <div className="w-full">
              {/* Pastoral Leaders Section */}
              <div className="w-full mb-12 lg:mb-16">
                {/* Section Title */}
                <FlexboxLayout
                  direction="column"
                  align="center"
                  className="mb-10 lg:mb-12"
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
                    className="w-32 h-1 rounded-full"
                    style={{
                      backgroundColor: colorScheme.primary,
                      boxShadow: `0 2px 8px ${colorScheme.primary}30`,
                    }}
                  />
                </FlexboxLayout>

                {/* Staggered Cards Layout - 4 cards in a unique arrangement */}
                <div className="relative w-full">
                  <div className="relative max-w-6xl mx-auto">
                    {/* Row 1: 3 cards staggered */}
                    <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8 mb-6 lg:mb-8">
                      {/* Card 1 - Left aligned, normal position */}
                      <div className="w-full lg:w-1/3">
                        <PersonCard
                          item={tabletDesktopPastors[0]}
                          colorScheme={colorScheme}
                          mainAccentColor={mainAccentColor}
                          addToRefs={addToRefs}
                          layoutType="staggered"
                          index={0}
                        />
                      </div>
                      
                      {/* Card 2 - Center, slightly offset down */}
                      <div className="w-full lg:w-1/3 lg:mt-8">
                        <PersonCard
                          item={tabletDesktopPastors[1]}
                          colorScheme={colorScheme}
                          mainAccentColor={mainAccentColor}
                          addToRefs={addToRefs}
                          layoutType="staggered"
                          index={1}
                        />
                      </div>
                      
                      {/* Card 3 - Right aligned, slightly offset up */}
                      <div className="w-full lg:w-1/3 lg:-mt-4">
                        <PersonCard
                          item={tabletDesktopPastors[2]}
                          colorScheme={colorScheme}
                          mainAccentColor={mainAccentColor}
                          addToRefs={addToRefs}
                          layoutType="staggered"
                          index={2}
                        />
                      </div>
                    </div>
                    
                    {/* Row 2: 2 cards centered with See More */}
                    <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8">
                      {/* Card 4 - Left aligned, See More next to it */}
                      <div className="w-full lg:w-2/3">
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                          {/* Card 4 */}
                          <div className="w-full lg:w-1/2">
                            <PersonCard
                              item={tabletDesktopPastors[3]}
                              colorScheme={colorScheme}
                              mainAccentColor={mainAccentColor}
                              addToRefs={addToRefs}
                              layoutType="staggered"
                              index={3}
                            />
                          </div>
                          
                          {/* See More Card */}
                          {/* <div className="w-full lg:w-1/2 lg:mt-6">
                            <SeeMoreCard
                              colorScheme={colorScheme}
                              onClick={handleSeeMore}
                              layoutType="staggered"
                            />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop See More Button - Centered */}
              <FlexboxLayout
                justify="center"
                className="pt-6 lg:pt-8 pb-8 lg:pb-12"
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