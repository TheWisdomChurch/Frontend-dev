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
    // isVisible,
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
        backgroundImage={Workforce_bg.src}
        overlay={true}
        overlayOpacity={65} // ← Reduced from 80 → image more visible, text still readable
        fullHeight={false}
        className="overflow-hidden min-h-[600px] sm:min-h-[700px] lg:min-h-[800px]"
        padding="none"
      >
        {/* Lighter, more beautiful overlay */}
        <div className="absolute inset-0 bg-black/50 z-0" />

        <Container
          size="xl"
          className="relative z-10 py-12 sm:py-16 lg:py-20 h-full"
          padding="none"
        >
          {/* Header Section */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="sm"
            className="text-center mb-8 sm:mb-10 lg:mb-12 px-4"
            padding="none"
          >
            <H2
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center"
              style={{ color: '#FFFFFF' }} // Pure white — same as footer
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
              className="max-w-2xl text-sm xs:text-base sm:text-lg md:text-xl text-center leading-relaxed px-2"
              style={{ color: '#E5E7EB' }} // gray-200 — same visible light gray as footer
            >
              "Each of you should use whatever gift you have received to serve
              others, as faithful stewards of God's grace in its various forms."
              – 1 Peter 4:10
            </LightText>
          </FlexboxLayout>

          {/* Desktop Layout */}
          <div className="hidden md:block px-4 sm:px-6">
            <GridboxLayout
              columns={3}
              gap="md"
              responsive={{ md: 2, lg: 3 }}
              className="w-full"
              padding="none"
            >
              {photos.map((photo, index) => (
                <div
                  key={photo.title}
                  ref={el => addToRefs(el, index)}
                  onMouseEnter={e => handleCardEnter(index, e)}
                  onMouseLeave={e => handleCardLeave(index, e)}
                  className="relative bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-white/10 transition-all duration-300 cursor-pointer flex flex-col h-full card-hover"
                  style={{ transform: 'translateY(0) scale(1)' }}
                >
                  <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 flex-shrink-0 overflow-hidden">
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      className="image-full-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>

                  <div className="p-3 sm:p-4 bg-gradient-to-b from-white/5 to-transparent flex-grow flex flex-col">
                    <BaseText
                      fontFamily="bricolage"
                      weight="bold"
                      className="text-sm sm:text-base mb-2 sm:mb-3 text-center"
                      style={{ color: '#FFFFFF' }}
                    >
                      {photo.title}
                    </BaseText>
                  </div>

                  <div
                    className="card-hover-content absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-3 sm:p-4 md:p-6"
                    style={{ pointerEvents: 'none' }}
                  >
                    <div className="text-center">
                      <BaseText
                        fontFamily="bricolage"
                        weight="bold"
                        className="text-base sm:text-lg mb-2 sm:mb-3"
                        style={{ color: '#FFFFFF' }}
                      >
                        {photo.title}
                      </BaseText>

                      <LightText className="text-center mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed max-w-xs line-clamp-3 text-gray-200">
                        Discover how you can contribute to our ministry through{' '}
                        {photo.title.toLowerCase()}. Join us in making a
                        difference in our community.
                      </LightText>

                      <Button
                        variant="primary"
                        size="sm"
                        curvature="full"
                        className="inline-flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 px-3 py-2"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                          pointerEvents: 'auto',
                        }}
                        onClick={() => handleLearnMore(photo.title)}
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

          {/* Mobile & Tablet */}
          <div className="md:hidden px-4">
            <FlexboxLayout direction="column" gap="xs" className="relative">
              <FlexboxLayout justify="between" align="center" className="mb-3">
                <button
                  onClick={scrollLeft}
                  className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 z-10"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>

                <LightText className="text-xs font-medium px-2 text-center max-w-[160px] text-gray-300">
                  Choose Your Department
                </LightText>

                <button
                  onClick={scrollRight}
                  className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 z-10"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </FlexboxLayout>

              <div
                ref={scrollContainerRef}
                className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide"
              >
                {photos.map((photo, index) => (
                  <div
                    key={photo.title}
                    className="flex-shrink-0 w-56 bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-lg border border-white/20 transition-all duration-300"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={photo.image}
                        alt={photo.title}
                        fill
                        className="image-full-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        priority={index < 2}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    <div className="p-3">
                      <BaseText
                        fontFamily="bricolage"
                        weight="bold"
                        className="text-sm mb-1 text-center text-white"
                      >
                        {photo.title}
                      </BaseText>

                      <LightText className="text-center mb-2 text-xs leading-relaxed line-clamp-2 text-gray-300">
                        Discover how you can contribute to our ministry through{' '}
                        {photo.title.toLowerCase()}.
                      </LightText>

                      <div className="flex justify-center">
                        <Button
                          variant="primary"
                          size="xs"
                          curvature="full"
                          className="inline-flex items-center justify-center gap-1 w-full py-1 px-2"
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
                <div className="flex-shrink-0 w-2" />
              </div>

              <FlexboxLayout justify="center" gap="xs" className="mt-1">
                {photos.map((_, index) => (
                  <div
                    key={index}
                    className="w-1 h-1 rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#FFFFFF50' }}
                  />
                ))}
              </FlexboxLayout>
            </FlexboxLayout>
          </div>
        </Container>
      </Section>

      <FormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        department={selectedDepartment || ''}
      />
    </>
  );
}
