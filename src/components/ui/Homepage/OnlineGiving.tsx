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
        padding="lg"
        fullHeight={false}
        className="overflow-hidden"
        style={{
          background: colorScheme.heading,
          color: colorScheme.textInverted,
        }}
      >
        <Container size="xl" className="relative z-10">
          {/* Header Section */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="text-center mb-12 sm:mb-16"
          >
            {/* Wisdom House Logo */}
            <div className="mb-4">
              <Image
                src={WisdomeHouseLogo}
                alt="Wisdom House Church Logo"
                width={80}
                height={80}
                className="mx-auto"
              />
            </div>

            <H2
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-center"
              style={{ color: colorScheme.black }}
            >
              Online Giving
            </H2>

            <LightText
              className="max-w-2xl text-sm sm:text-base md:text-lg text-center leading-relaxed px-4"
              style={{ color: colorScheme.buttonText }}
            >
              Your generosity helps us continue to spread the Gospel and serve
              our community. Choose how you would like to give today.
            </LightText>
          </FlexboxLayout>

          {/* Desktop Layout - Grid */}
          <div className="hidden lg:block">
            <GridboxLayout
              columns={3}
              gap="lg"
              responsive={{
                lg: 3,
              }}
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
                      className="rounded-2xl overflow-hidden shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border"
                      style={{
                        backgroundColor: colorScheme.body,
                        // borderColor: colorScheme.border,
                      }}
                    >
                      <div
                        className="p-6"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                        }}
                      >
                        {/* Wisdom House Logo instead of icon */}
                        <div className="mb-4 flex justify-center">
                          <Image
                            src={WisdomeHouseLogo}
                            alt="Wisdom House Church Logo"
                            width={40}
                            height={40}
                            className="mx-auto"
                          />
                        </div>
                        <BaseText
                          fontFamily="bricolage"
                          weight="bold"
                          className="text-xl mb-2 text-center"
                        >
                          {option.title}
                        </BaseText>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <LightText
                          className="mb-6 flex-1 text-center"
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
                          className="w-full mt-auto transition-all duration-300"
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
          <div className="lg:hidden">
            <FlexboxLayout direction="column" gap="md" className="relative">
              {/* Scroll Navigation Buttons */}
              <FlexboxLayout justify="between" align="center" className="mb-6">
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

                <LightText className="text-xs font-medium px-2 text-center max-w-[200px]">
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
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
              >
                {OnlinegivingOptions.map((option, index) => {
                  return (
                    <div
                      key={option.title}
                      className={`flex-shrink-0 w-64 transition-all duration-700 ${
                        isVisible
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-10'
                      }`}
                      style={{
                        transitionDelay: `${index * 100}ms`,
                      }}
                    >
                      <div
                        className="rounded-xl overflow-hidden shadow-xl transition-all duration-300 h-full flex flex-col border"
                        style={{
                          backgroundColor: colorScheme.body,
                          borderColor: colorScheme.border,
                        }}
                      >
                        <div
                          className="p-5"
                          style={{
                            backgroundColor: colorScheme.primary,
                            color: colorScheme.black,
                          }}
                        >
                          {/* Wisdom House Logo instead of icon */}
                          <div className="mb-3 flex justify-center">
                            <Image
                              src={WisdomeHouseLogo}
                              alt="Wisdom House Church Logo"
                              width={32}
                              height={32}
                              className="mx-auto"
                            />
                          </div>
                          <BaseText
                            fontFamily="bricolage"
                            weight="bold"
                            className="text-lg mb-2 text-center"
                          >
                            {option.title}
                          </BaseText>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <LightText
                            className="mb-4 flex-1 text-sm leading-relaxed text-center"
                            style={{ color: colorScheme.white }}
                          >
                            {option.description}
                          </LightText>
                          <Button
                            onClick={() => handleGiveNow(option)}
                            variant="primary"
                            size="sm"
                            curvature="full"
                            className="w-full mt-auto"
                            style={{
                              // backgroundColor: colorScheme.,
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
              <FlexboxLayout justify="center" gap="xs" className="mt-2">
                {OnlinegivingOptions.map((_, index) => (
                  <div
                    key={index}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: colorScheme.black + '50' }}
                  />
                ))}
              </FlexboxLayout>
            </FlexboxLayout>
          </div>

          {/* Other Ways to Give Section */}
          <div
            className={`mt-12 sm:mt-16 transition-all duration-1000 delay-500 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div
              className="rounded-2xl shadow-2xl p-6 sm:p-8 max-w-3xl mx-auto border"
              style={{
                backgroundColor: colorScheme.background,
                borderColor: colorScheme.border,
              }}
            >
              <FlexboxLayout
                direction="column"
                gap="md"
                className="text-center"
              >
                <BaseText
                  fontFamily="bricolage"
                  weight="bold"
                  className="text-xl sm:text-2xl"
                  style={{ color: colorScheme.heading }}
                >
                  Other Ways to Give
                </BaseText>

                <LightText
                  className="mb-4 sm:mb-6"
                  style={{ color: colorScheme.primary }}
                >
                  You can also give by mail, in person during our services, or
                  set up recurring donations. For more information about giving
                  options, please contact our Admin.
                </LightText>

                <FlexboxLayout justify="center" gap="sm" className="flex-wrap">
                  <Button
                    onClick={handleContactCall}
                    variant="primary"
                    size="md"
                    curvature="full"
                    elevated={true}
                    leftIcon={
                      <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                    }
                    className="transition-all duration-300 transform hover:scale-105"
                    style={{
                      backgroundColor: colorScheme.primary,
                      color: colorScheme.black,
                    }}
                  >
                    Contact Us
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    curvature="full"
                    className="transition-all duration-300"
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
