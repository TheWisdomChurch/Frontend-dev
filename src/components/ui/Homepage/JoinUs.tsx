'use client';

import Image from 'next/image';
import { Workforce_bg } from '@/components/assets';
import { H2, BaseText, BodyLG, BodyMD, BodySM } from '@/components/text'; // ← Fixed imports
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
        overlayOpacity={65}
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
              className="leading-tight text-center"
              style={{ color: '#FFFFFF' }}
              useThemeColor={false}
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
                useThemeColor={false}
              >
                Workforce
              </BaseText>
            </H2>

            <BodyLG
              className="max-w-2xl text-center leading-relaxed px-2"
              style={{ color: '#E5E7EB' }}
              useThemeColor={false}
            >
              "Each of you should use whatever gift you have received to serve
              others, as faithful stewards of God's grace in its various forms."
              – 1 Peter 4:10
            </BodyLG>
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
                      className="text-center mb-2 sm:mb-3"
                      style={{ color: '#FFFFFF' }}
                      useThemeColor={false}
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
                        className="mb-2 sm:mb-3"
                        style={{ color: '#FFFFFF' }}
                        useThemeColor={false}
                      >
                        {photo.title}
                      </BaseText>

                      <BodyMD
                        className="text-center mb-3 sm:mb-4 leading-relaxed max-w-xs line-clamp-3"
                        style={{ color: '#E5E7EB' }}
                        useThemeColor={false}
                      >
                        Discover how you can contribute to our ministry through{' '}
                        {photo.title.toLowerCase()}. Join us in making a
                        difference in our community.
                      </BodyMD>

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
                        <span className="font-medium">Learn More</span>
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

                <BodySM
                  className="px-2 text-center max-w-[160px]"
                  style={{ color: '#E5E7EB' }}
                  useThemeColor={false}
                >
                  Choose Your Department
                </BodySM>

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
                        className="text-center mb-1 text-white"
                        useThemeColor={false}
                      >
                        {photo.title}
                      </BaseText>

                      <BodySM
                        className="text-center mb-2 leading-relaxed line-clamp-2"
                        style={{ color: '#E5E7EB' }}
                        useThemeColor={false}
                      >
                        Discover how you can contribute to our ministry through{' '}
                        {photo.title.toLowerCase()}.
                      </BodySM>

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
                          <span>Learn More</span>
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
