/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { OnlinegivingOptions } from '@/lib/data';
import { useTheme } from '@/components/contexts/ThemeContext';
import GivingModal from '@/components/modal/GivingModal';
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';
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

  useIntersectionObserver(setIsVisible, sectionRef);

  return (
    <>
      <Section
        ref={sectionRef}
        padding="none"
        fullHeight={false}
        className="overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }} // White section background (as requested)
      >
        <Container size="xl" className="relative z-10 py-12 sm:py-16 lg:py-20">
          {/* Header */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="sm"
            className="text-center mb-10 sm:mb-12 lg:mb-16 px-4"
          >
            <div className="mb-4">
              <Image
                src={WisdomeHouseLogo}
                alt="Wisdom House Church Logo"
                width={64}
                height={64}
                className="mx-auto"
              />
            </div>

            <H2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              style={{ color: '#000000' }} // Always bold black
            >
              Online Giving
            </H2>

            <LightText
              className="max-w-2xl text-base sm:text-lg md:text-xl text-center leading-relaxed mt-4 px-4 opacity-90"
              style={{ color: '#1a1a1a' }}
            >
              Your generosity helps us continue to spread the Gospel and serve
              our community. Choose how you would like to give today.
            </LightText>
          </FlexboxLayout>

          {/* Desktop Grid - Black Cards */}
          <div className="hidden lg:block">
            <GridboxLayout columns={3} gap="xl" className="w-full mb-16">
              {OnlinegivingOptions.map((option, index) => (
                <div
                  key={option.title}
                  className={`transition-all duration-700 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-3 bg-black border border-gray-800">
                    <div
                      className="p-8 text-center"
                      style={{
                        backgroundColor: colorScheme.primary,
                        color: '#000000',
                      }}
                    >
                      <BaseText
                        fontFamily="bricolage"
                        weight="bold"
                        className="text-2xl"
                      >
                        {option.title}
                      </BaseText>
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <LightText className="text-gray-300 text-center leading-relaxed text-lg mb-8">
                        {option.description}
                      </LightText>
                      <Button
                        onClick={() => handleGiveNow(option)}
                        variant="primary"
                        size="lg"
                        curvature="full"
                        elevated={true}
                        className="w-full py-4 text-lg font-bold"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: '#000000',
                        }}
                        onMouseEnter={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.primaryLight;
                        }}
                        onMouseLeave={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.primary;
                        }}
                      >
                        Give Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </GridboxLayout>
          </div>

          {/* Mobile & Tablet - Black Cards */}
          <div className="lg:hidden px-4">
            <FlexboxLayout direction="column" gap="md">
              <FlexboxLayout justify="between" align="center" className="mb-6">
                <button
                  onClick={scrollLeft}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-gray-600 hover:bg-white/30 transition"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <LightText className="text-sm font-medium text-gray-400">
                  Scroll to explore
                </LightText>

                <button
                  onClick={scrollRight}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-gray-600 hover:bg-white/30 transition"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </FlexboxLayout>

              <div
                ref={scrollContainerRef}
                className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
              >
                {OnlinegivingOptions.map(option => (
                  <div
                    key={option.title}
                    className="flex-shrink-0 w-72 snap-center"
                  >
                    <div className="rounded-2xl overflow-hidden shadow-2xl bg-black border border-gray-800 h-full flex flex-col">
                      <div
                        className="p-6 text-center"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: '#000000',
                        }}
                      >
                        <BaseText
                          fontFamily="bricolage"
                          weight="bold"
                          className="text-xl"
                        >
                          {option.title}
                        </BaseText>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <LightText className="text-gray-300 text-center leading-relaxed text-base mb-6">
                          {option.description}
                        </LightText>
                        <Button
                          onClick={() => handleGiveNow(option)}
                          variant="primary"
                          size="md"
                          curvature="full"
                          elevated={true}
                          className="w-full py-3 text-base font-bold"
                          style={{
                            backgroundColor: colorScheme.primary,
                            color: '#000000',
                          }}
                          onMouseEnter={(e: any) =>
                            (e.currentTarget.style.backgroundColor =
                              colorScheme.primaryLight)
                          }
                          onMouseLeave={(e: any) =>
                            (e.currentTarget.style.backgroundColor =
                              colorScheme.primary)
                          }
                        >
                          Give Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex-shrink-0 w-4" />
              </div>
            </FlexboxLayout>
          </div>

          {/* Other Ways to Give - Black Background */}
          <div
            className={`mt-16 lg:mt-20 transition-all duration-1000 delay-300 px-4 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="max-w-3xl mx-auto bg-black rounded-2xl p-8 lg:p-12 border border-gray-800 text-center">
              <BaseText
                fontFamily="bricolage"
                weight="bold"
                className="text-2xl lg:text-3xl mb-4 text-white"
              >
                Other Ways to Give
              </BaseText>

              <LightText className="text-gray-300 text-base lg:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                You can also give by mail, in person during our services, or set
                up recurring donations. For more information about giving
                options, please contact our Admin.
              </LightText>

              <FlexboxLayout justify="center" gap="md" className="flex-wrap">
                <Button
                  onClick={handleContactCall}
                  variant="primary"
                  size="md"
                  curvature="full"
                  elevated={true}
                  leftIcon={<Phone className="w-4 h-4" />}
                  className="px-6 py-3 text-base font-bold hover:scale-105 transition"
                  style={{
                    backgroundColor: colorScheme.primary,
                    color: '#000000',
                  }}
                >
                  Contact Us
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  curvature="full"
                  className="px-6 py-3 text-base border-2"
                  style={{
                    borderColor: colorScheme.primary,
                    color: '#FFFFFF',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.backgroundColor = colorScheme.primary;
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  Learn More
                </Button>
              </FlexboxLayout>
            </div>
          </div>
        </Container>
      </Section>

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
