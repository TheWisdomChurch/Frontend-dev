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
import { Section, Container, GridboxLayout, FlexboxLayout } from '@/components/layout';

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
        padding="xl"
        fullHeight={false}
        className="overflow-hidden"
      >
        <Container size="xl" className="relative z-10">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
            className="text-center mb-16"
          >
            <H2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-2 font-bold leading-tight text-center"
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
              className="max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-center leading-relaxed"
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
                lg: 3
              }}
            >
              {photos.map((photo, index) => (
                <div
                  key={photo.title}
                  ref={el => addToRefs(el, index)}
                  onMouseEnter={e => handleCardEnter(index, e)}
                  onMouseLeave={e => handleCardLeave(index, e)}
                  className="relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 cursor-pointer"
                  style={{
                    transform: 'translateY(0) scale(1)',
                  }}
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      className="object-cover"
                      style={{ transform: 'scale(1)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Main Content Section - Always Visible */}
                  <div className="p-6 bg-gradient-to-b from-white/5 to-transparent">
                    <BaseText
                      fontFamily="bricolage"
                      weight="bold"
                      className="text-lg mb-4 text-center"
                      style={{ color: colorScheme.white }}
                    >
                      {photo.title}
                    </BaseText>
                  </div>

                  {/* Hover Overlay Content */}
                  <div
                    className="card-content absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 opacity-0 translate-y-30"
                    style={{ pointerEvents: 'none' }}
                  >
                    <div className="text-center">
                      <BaseText
                        fontFamily="bricolage"
                        weight="bold"
                        className="text-xl mb-4"
                        style={{ color: colorScheme.white }}
                      >
                        {photo.title}
                      </BaseText>

                      <LightText
                        className="text-center mb-6 text-sm leading-relaxed max-w-xs"
                      >
                        Discover how you can contribute to our ministry through{' '}
                        {photo.title.toLowerCase()}. Join us in making a
                        difference in our community.
                      </LightText>

                      <Button
                        variant="primary"
                        size="md"
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
                        <span className="font-medium">Learn More</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </GridboxLayout>
          </div>

          {/* Mobile & Tablet Layout - Horizontal Scroll */}
          <div className="md:hidden">
            <FlexboxLayout
              direction="column"
              gap="md"
              className="relative"
            >
              {/* Scroll Navigation Buttons */}
              <FlexboxLayout
                justify="between"
                align="center"
                className="mb-6"
              >
                <button
                  onClick={scrollLeft}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 z-10"
                  style={{ color: colorScheme.white }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <LightText
                  className="text-sm font-medium px-4 text-center"
                >
                  Scroll to Choose Your Preferred Department
                </LightText>

                <button
                  onClick={scrollRight}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 z-10"
                  style={{ color: colorScheme.white }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </FlexboxLayout>

              {/* Horizontal Scroll Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {photos.map((photo, index) => (
                  <div
                    key={photo.title}
                    className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={photo.image}
                        alt={photo.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                      <BaseText
                        fontFamily="bricolage"
                        weight="bold"
                        className="text-lg mb-4 text-center"
                        style={{ color: colorScheme.white }}
                      >
                        {photo.title}
                      </BaseText>

                      <LightText
                        className="text-center mb-4 text-sm leading-relaxed"
                      >
                        Discover how you can contribute to our ministry through{' '}
                        {photo.title.toLowerCase()}.
                      </LightText>

                      <div className="flex justify-center">
                        <Button
                          variant="primary"
                          size="sm"
                          curvature="full"
                          className="inline-flex items-center justify-center gap-2 w-full"
                          style={{
                            backgroundColor: colorScheme.primary,
                            color: colorScheme.black,
                          }}
                          onClick={() => handleLearnMore(photo.title)}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add some extra space at the end for better scrolling */}
                <div className="flex-shrink-0 w-4" />
              </div>

              {/* Scroll Indicator */}
              <FlexboxLayout justify="center" gap="sm" className="mt-4">
                {photos.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full transition-all duration-300"
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

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}