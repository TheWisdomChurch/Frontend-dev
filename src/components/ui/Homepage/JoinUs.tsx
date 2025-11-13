/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import Image from 'next/image';
import { Workforce_bg } from '@/components/assets';
import { H2, BaseText, LightText } from '@/components/text';
import { photos } from '@/lib/data';
import Button from '@/components/utils/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import { FormModal } from '@/components/modal/FormModal';
import { useJoinWisdomHouse } from '@/components/utils/hooks/useJoin';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';

export default function JoinWisdomHouse() {
  const { colorScheme } = useTheme();

  const {
    isVisible,
    selectedDepartment,
    showForm,
    sectionRef,
    scrollContainerRef,
    addToRefs,
    handleLearnMore,
    scrollLeft,
    scrollRight,
    handleCardEnter,
    handleCardLeave,
    setShowForm,
  } = useJoinWisdomHouse();

  return (
    <>
      <Section
        ref={sectionRef}
        background="image"
        customBackground={`url(${Workforce_bg.src})`}
        backgroundImage={Workforce_bg.src}
        overlay={true}
        overlayOpacity={80}
        padding="lg"
        fullHeight={false}
        className="overflow-hidden min-h-screen"
      >
        <Container size="xl" className="relative z-10">
          {/* Reduced spacing for mobile */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <H2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2 font-bold leading-tight text-center"
              style={{ color: colorScheme.white }}
            >
              Join Our{' '}
              <BaseText
                weight="regular"
                fontFamily="playfair"
                style={{
                  fontStyle: 'italic',
                  color: colorScheme.primary,
                  display: 'inline',
                  fontSize: 'inherit',
                  lineHeight: 'inherit',
                }}
              >
                Workforce
              </BaseText>
            </H2>

            <LightText
              className="max-w-2xl text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center leading-relaxed px-4"
              style={{ color: colorScheme.textSecondary }}
            >
              "Each of you should use whatever gift you have received to serve
              others, as faithful stewards of God's grace in its various forms."
              – 1 Peter 4:10
            </LightText>
          </FlexboxLayout>

          {/* Desktop Layout - Grid */}
          <div className="hidden md:block">
            <GridboxLayout
              columns={3}
              gap="lg"
              responsive={{
                md: 2,
                lg: 3,
              }}
            >
              {photos.map((photo, index) => (
                <div
                  key={photo.title}
                  ref={el => addToRefs(el, index)}
                  onMouseEnter={e => handleCardEnter(index, e)}
                  onMouseLeave={e => handleCardLeave(index, e)}
                  className="relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 cursor-pointer flex flex-col h-full card-hover"
                  style={{
                    transform: 'translateY(0) scale(1)',
                  }}
                >
                  {/* Image Container - Larger height for better visibility */}
                  <div className="relative h-56 md:h-72 lg:h-80 flex-shrink-0 overflow-hidden">
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      className="image-full-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>

                  {/* Main Content Section - Always Visible */}
                  <div className="p-4 sm:p-6 bg-gradient-to-b from-white/5 to-transparent flex-grow flex flex-col">
                    <BaseText
                      fontFamily="bricolage"
                      weight="bold"
                      className="text-base sm:text-lg mb-3 sm:mb-4 text-center"
                      style={{ color: colorScheme.white }}
                    >
                      {photo.title}
                    </BaseText>
                  </div>

                  {/* Hover Overlay Content */}
                  <div
                    className="card-hover-content absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 md:p-8"
                    style={{ pointerEvents: 'none' }}
                  >
                    <div className="text-center">
                      <BaseText
                        fontFamily="bricolage"
                        weight="bold"
                        className="text-lg sm:text-xl mb-3 sm:mb-4"
                        style={{ color: colorScheme.white }}
                      >
                        {photo.title}
                      </BaseText>

                      <LightText className="text-center mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed max-w-xs line-clamp-3">
                        Discover how you can contribute to our ministry through{' '}
                        {photo.title.toLowerCase()}. Join us in making a
                        difference in our community.
                      </LightText>

                      <Button
                        variant="primary"
                        size="sm"
                        curvature="full"
                        className="inline-flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                          pointerEvents: 'auto',
                        }}
                        onClick={() => handleLearnMore(photo.title)}
                        onMouseEnter={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.heading;
                        }}
                        onMouseLeave={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.primary;
                        }}
                      >
                        <span className="font-medium text-xs sm:text-sm">
                          Learn More
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </GridboxLayout>
          </div>

          {/* Mobile & Tablet Layout - Horizontal Scroll - COMPACT VERSION */}
          <div className="md:hidden">
            <FlexboxLayout direction="column" gap="sm" className="relative">
              {/* Scroll Navigation Buttons - More Compact */}
              <FlexboxLayout justify="between" align="center" className="mb-4">
                <button
                  onClick={scrollLeft}
                  className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 z-10"
                  style={{ color: colorScheme.white }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <LightText className="text-xs font-medium px-2 text-center max-w-[200px]">
                  Choose Your Department
                </LightText>

                <button
                  onClick={scrollRight}
                  className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 z-10"
                  style={{ color: colorScheme.white }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </FlexboxLayout>

              {/* Horizontal Scroll Container - More Compact Cards */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
              >
                {photos.map((photo, index) => (
                  <div
                    key={photo.title}
                    className="flex-shrink-0 w-64 bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-white/20 transition-all duration-300"
                  >
                    {/* Image Container - Larger height for better visibility */}
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={photo.image}
                        alt={photo.title}
                        fill
                        className="image-full-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        priority={index < 2}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>

                    {/* Content Section - More Compact */}
                    <div className="p-3">
                      <BaseText
                        fontFamily="bricolage"
                        weight="bold"
                        className="text-sm mb-2 text-center"
                        style={{ color: colorScheme.white }}
                      >
                        {photo.title}
                      </BaseText>

                      <LightText className="text-center mb-3 text-xs leading-relaxed line-clamp-2">
                        Discover how you can contribute to our ministry through{' '}
                        {photo.title.toLowerCase()}.
                      </LightText>

                      <div className="flex justify-center">
                        <Button
                          variant="primary"
                          size="xs"
                          curvature="full"
                          className="inline-flex items-center justify-center gap-1 w-full py-1"
                          style={{
                            backgroundColor: colorScheme.primary,
                            color: colorScheme.black,
                          }}
                          onClick={() => handleLearnMore(photo.title)}
                        >
                          <span className="text-xs">Learn More</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add some extra space at the end for better scrolling */}
                <div className="flex-shrink-0 w-2" />
              </div>

              {/* Compact Scroll Indicator */}
              <FlexboxLayout justify="center" gap="xs" className="mt-2">
                {photos.map((_, index) => (
                  <div
                    key={index}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: colorScheme.white + '30' }}
                  />
                ))}
              </FlexboxLayout>
            </FlexboxLayout>
          </div>
        </Container>
      </Section>

      {/* Form Modal */}
      <FormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        department={selectedDepartment || ''}
      />
    </>
  );
}
