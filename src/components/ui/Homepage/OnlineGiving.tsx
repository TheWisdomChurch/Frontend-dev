/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { OnlinegivingOptions } from '@/lib/data';
import { useTheme } from '@/components/contexts/ThemeContext';
import GivingModal from '@/components/modal/GivingModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { useOnlineGiving } from '@/components/utils/hooks/Onlinegiving';
import {
  handleContactCall,
  useIntersectionObserver,
} from '@/components/utils/functionUtils/contactUtils';
import { H2, BaseText, LightText } from '@/components/text';
import Button from '@/components/utils/CustomButton';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import { WisdomeHouseLogo } from '@/components/assets';

export default function OnlineGiving() {
  const { colorScheme } = useTheme();

  const {
    isVisible,
    setIsVisible,
    selectedGivingOption,
    isModalOpen,
    sectionRef,
    scrollContainerRef,
    handleGiveNow,
    closeModal,
    scrollLeft,
    scrollRight,
  } = useOnlineGiving();

  // Use the intersection observer utility
  useIntersectionObserver(setIsVisible, sectionRef);

  return (
    <>
      <Section
        ref={sectionRef}
        background="dark"
        padding="none" // Remove section padding
        fullHeight={false}
        className="overflow-hidden"
        style={{
          background: colorScheme.heading,
          color: colorScheme.textInverted,
        }}
      >
        <Container
          size="xl"
          className="relative z-10 py-12 sm:py-16 lg:py-20"
          padding="none"
        >
          {/* Header Section */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="sm" // Reduced gap
            className="text-center mb-10 sm:mb-12 lg:mb-16 px-4" // Added horizontal padding
            padding="none"
          >
            {/* Wisdom House Logo */}
            <div className="mb-3 sm:mb-4">
              <Image
                src={WisdomeHouseLogo}
                alt="Wisdom House Church Logo"
                width={60}
                height={60}
                className="mx-auto"
              />
            </div>

            <H2
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center"
              style={{ color: colorScheme.black }}
            >
              Online Giving
            </H2>

            <LightText
              className="max-w-2xl text-sm xs:text-base sm:text-lg md:text-xl text-center leading-relaxed px-2"
              style={{ color: colorScheme.buttonText }}
            >
              Your generosity helps us continue to spread the Gospel and serve
              our community. Choose how you would like to give today.
            </LightText>
          </FlexboxLayout>

          {/* Desktop Layout - Grid */}
          <div className="hidden lg:block px-4 sm:px-6">
            <GridboxLayout
              columns={3}
              gap="lg"
              responsive={{
                lg: 3,
              }}
              className="w-full mb-12 lg:mb-16" // Added bottom margin
              padding="none"
            >
              {OnlinegivingOptions.map((option, index) => {
                return (
                  <div
                    key={option.title}
                    className={`transition-all duration-700 w-full ${
                      isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div
                      className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border"
                      style={{
                        backgroundColor: colorScheme.body,
                      }}
                    >
                      <div
                        className="p-4 sm:p-6"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                        }}
                      >
                        <BaseText
                          fontFamily="bricolage"
                          weight="bold"
                          className="text-lg sm:text-xl mb-2 text-center"
                        >
                          {option.title}
                        </BaseText>
                      </div>
                      <div className="p-4 sm:p-6 flex-1 flex flex-col">
                        <LightText
                          className="mb-4 sm:mb-6 flex-1 text-center text-sm sm:text-base"
                          style={{ color: colorScheme.white }}
                        >
                          {option.description}
                        </LightText>
                        <Button
                          onClick={() => handleGiveNow(option)}
                          variant="primary"
                          size="md"
                          curvature="full"
                          elevated={true}
                          className="w-full mt-auto transition-all duration-300 py-2 sm:py-3"
                          style={{
                            backgroundColor: colorScheme.primary,
                            borderColor: colorScheme.white,
                            color: colorScheme.white,
                          }}
                          onMouseEnter={(e: any) => {
                            e.currentTarget.style.backgroundColor =
                              colorScheme.primary;
                            e.currentTarget.style.color = colorScheme.black;
                          }}
                          onMouseLeave={(e: any) => {
                            e.currentTarget.style.backgroundColor =
                              colorScheme.primary;
                            e.currentTarget.style.color = colorScheme.black;
                          }}
                        >
                          Give Now
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </GridboxLayout>
          </div>

          {/* Mobile & Tablet Layout - Horizontal Scroll */}
          <div className="lg:hidden px-4">
            <FlexboxLayout
              direction="column"
              gap="sm"
              className="relative"
              padding="none"
            >
              {/* Scroll Navigation Buttons */}
              <FlexboxLayout
                justify="between"
                align="center"
                className="mb-4"
                padding="none"
              >
                <button
                  onClick={scrollLeft}
                  className="p-2 bg-white/10 backdrop-blur-md rounded-full border hover:bg-white/20 transition-all duration-300 z-10"
                  style={{
                    backgroundColor: colorScheme.primary + '30',
                    borderColor: colorScheme.primary,
                    color: colorScheme.textInverted,
                  }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                </button>

                <LightText className="text-xs font-medium px-2 text-center max-w-[160px]">
                  Scroll to explore giving options
                </LightText>

                <button
                  onClick={scrollRight}
                  className="p-2 bg-white/10 backdrop-blur-md rounded-full border hover:bg-white/20 transition-all duration-300 z-10"
                  style={{
                    backgroundColor: colorScheme.primary + '30',
                    borderColor: colorScheme.primary,
                    color: colorScheme.textInverted,
                  }}
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>
              </FlexboxLayout>

              {/* Horizontal Scroll Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide" // Reduced gap
              >
                {OnlinegivingOptions.map((option, index) => {
                  return (
                    <div
                      key={option.title}
                      className={`flex-shrink-0 w-56 transition-all duration-700 ${
                        isVisible
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-10'
                      }`}
                      style={{
                        transitionDelay: `${index * 100}ms`,
                      }}
                    >
                      <div
                        className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 h-full flex flex-col border"
                        style={{
                          backgroundColor: colorScheme.body,
                          borderColor: colorScheme.border,
                        }}
                      >
                        <div
                          className="p-3"
                          style={{
                            backgroundColor: colorScheme.primary,
                            color: colorScheme.black,
                          }}
                        >
                          <BaseText
                            fontFamily="bricolage"
                            weight="bold"
                            className="text-base mb-1 text-center"
                          >
                            {option.title}
                          </BaseText>
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                          <LightText
                            className="mb-3 flex-1 text-xs leading-relaxed text-center"
                            style={{ color: colorScheme.white }}
                          >
                            {option.description}
                          </LightText>
                          <Button
                            onClick={() => handleGiveNow(option)}
                            variant="primary"
                            size="sm"
                            curvature="full"
                            className="w-full mt-auto py-1.5"
                            style={{
                              color: colorScheme.black,
                              borderColor: colorScheme.primary,
                            }}
                          >
                            Give Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add some extra space at the end for better scrolling */}
                <div className="flex-shrink-0 w-2" />
              </div>

              {/* Scroll Indicator */}
              <FlexboxLayout
                justify="center"
                gap="xs"
                className="mt-2"
                padding="none"
              >
                {OnlinegivingOptions.map((_, index) => (
                  <div
                    key={index}
                    className="w-1 h-1 rounded-full transition-all duration-300"
                    style={{ backgroundColor: colorScheme.black + '50' }}
                  />
                ))}
              </FlexboxLayout>
            </FlexboxLayout>
          </div>

          {/* Other Ways to Give Section */}
          <div
            className={`mt-10 sm:mt-12 lg:mt-16 transition-all duration-1000 delay-500 px-4 sm:px-6 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div
              className="rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto border"
              style={{
                backgroundColor: colorScheme.background,
                borderColor: colorScheme.border,
              }}
            >
              <FlexboxLayout
                direction="column"
                gap="sm" // Reduced gap
                className="text-center"
                padding="none"
              >
                <BaseText
                  fontFamily="bricolage"
                  weight="bold"
                  className="text-lg sm:text-xl lg:text-2xl"
                  style={{ color: colorScheme.heading }}
                >
                  Other Ways to Give
                </BaseText>

                <LightText
                  className="mb-3 sm:mb-4 text-sm sm:text-base"
                  style={{ color: colorScheme.primary }}
                >
                  You can also give by mail, in person during our services, or
                  set up recurring donations. For more information about giving
                  options, please contact our Admin.
                </LightText>

                <FlexboxLayout
                  justify="center"
                  gap="xs"
                  className="flex-wrap"
                  padding="none"
                >
                  <Button
                    onClick={handleContactCall}
                    variant="primary"
                    size="sm"
                    curvature="full"
                    elevated={true}
                    leftIcon={
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="w-3 h-3 sm:w-4 sm:h-4"
                      />
                    }
                    className="transition-all duration-300 transform hover:scale-105 px-3 sm:px-4 py-2 text-xs sm:text-sm"
                    style={{
                      backgroundColor: colorScheme.primary,
                      color: colorScheme.black,
                    }}
                  >
                    Contact Us
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    curvature="full"
                    className="transition-all duration-300 px-3 sm:px-4 py-2 text-xs sm:text-sm"
                    style={{
                      borderColor: colorScheme.primary,
                      color: colorScheme.text,
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.backgroundColor = colorScheme.black;
                      e.currentTarget.style.color = colorScheme.white;
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colorScheme.text;
                    }}
                  >
                    Learn More
                  </Button>
                </FlexboxLayout>
              </FlexboxLayout>
            </div>
          </div>
        </Container>
      </Section>

      {/* Giving Modal */}
      {selectedGivingOption && (
        <GivingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          givingOption={selectedGivingOption}
        />
      )}
    </>
  );
}
