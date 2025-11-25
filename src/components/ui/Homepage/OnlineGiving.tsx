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
import { H2, BaseText, BodySM, Caption, H3 } from '@/components/text';
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
        style={{ backgroundColor: '#FFFFFF' }}
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
              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg mx-auto">
                <Image
                  src={WisdomeHouseLogo}
                  alt="Wisdom House Church Logo"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <H2
              className="leading-tight"
              style={{ color: '#000000' }}
              useThemeColor={false}
            >
              Online Giving
            </H2>

            <BodySM
              className="max-w-2xl text-center leading-relaxed mt-4 px-4 opacity-90 text-sm sm:text-base"
              style={{ color: '#1a1a1a' }}
              useThemeColor={false}
            >
              Your generosity helps us continue to spread the Gospel and serve
              your community. Choose how you would like to give today.
            </BodySM>
          </FlexboxLayout>

          {/* Desktop Grid - Black Cards */}
          <div className="hidden lg:block">
            <GridboxLayout
              columns={3}
              gap="xl"
              className="w-full mb-16 items-stretch"
            >
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
                  <div className="bg-black backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-gray-800 relative overflow-hidden flex flex-col h-full">
                    {/* Animated Background Gradient */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${colorScheme.primary}08, ${colorScheme.primaryDark}05)`,
                      }}
                    />

                    {/* Floating Particles */}
                    <div className="absolute top-3 right-3 w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                    <div className="absolute bottom-3 left-3 w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping" />

                    {/* Title Section */}
                    <div
                      className="text-center rounded-t-2xl p-6 mb-4 flex-shrink-0"
                      style={{
                        backgroundColor: colorScheme.primary,
                        color: '#000000',
                      }}
                    >
                      <BaseText
                        fontFamily="bricolage"
                        weight="bold"
                        className="text-lg mb-2 transform group-hover:scale-105 transition-transform duration-200"
                        style={{ color: '#000000' }}
                        useThemeColor={false}
                      >
                        {option.title}
                      </BaseText>
                    </div>

                    {/* Description Section */}
                    <div className="text-center pt-2 relative z-10 flex flex-col flex-grow justify-start px-4">
                      <Caption
                        className="text-gray-300 opacity-90 px-1 transition-all duration-300 group-hover:opacity-100 line-clamp-3 leading-tight min-h-[3rem] flex items-center justify-center text-sm"
                        useThemeColor={false}
                      >
                        {option.description}
                      </Caption>
                    </div>

                    {/* Button Section */}
                    <div className="mt-6 flex-shrink-0 px-4">
                      <Button
                        onClick={() => handleGiveNow(option)}
                        variant="primary"
                        size="md"
                        curvature="xl"
                        className="w-full py-3 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-white/20 backdrop-blur-sm"
                        style={{
                          background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                          color: '#000000',
                        }}
                      >
                        Give Now
                      </Button>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

                <BodySM
                  className="font-medium text-sm"
                  style={{ color: '#9ca3af' }}
                  useThemeColor={false}
                >
                  Scroll to explore
                </BodySM>

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
                    <div className="bg-black backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-800 relative overflow-hidden flex flex-col h-full">
                      {/* Title Section */}
                      <div
                        className="text-center rounded-t-2xl p-5 mb-3"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: '#000000',
                        }}
                      >
                        <BaseText
                          fontFamily="bricolage"
                          weight="bold"
                          className="text-base mb-2"
                          style={{ color: '#000000' }}
                          useThemeColor={false}
                        >
                          {option.title}
                        </BaseText>
                      </div>

                      {/* Description Section */}
                      <div className="text-center pt-2 flex flex-col flex-grow justify-start px-3">
                        <Caption
                          className="text-gray-300 opacity-90 px-1 line-clamp-3 leading-tight min-h-[3rem] flex items-center justify-center text-xs"
                          useThemeColor={false}
                        >
                          {option.description}
                        </Caption>
                      </div>

                      {/* Button Section */}
                      <div className="mt-4 px-3">
                        <Button
                          onClick={() => handleGiveNow(option)}
                          variant="primary"
                          size="md"
                          curvature="xl"
                          className="w-full py-3 font-semibold text-sm"
                          style={{
                            background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                            color: '#000000',
                          }}
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
            className={`mt-12 lg:mt-16 transition-all duration-1000 delay-300 px-4 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="max-w-2xl mx-auto bg-black rounded-xl p-6 lg:p-8 border border-gray-800 text-center">
              <H3
                className="text-center mb-4"
                style={{ color: '#ffffff' }}
                useThemeColor={false}
                weight="bold"
                smWeight="extrabold"
              >
                Other Ways to Give
              </H3>

              {/** 🔥 Reduced line-height and tightened spacing */}
              <Caption
                className="mb-6 max-w-xl mx-auto text-gray-300 px-2"
                style={{ lineHeight: '1.3' }}
                useThemeColor={false}
              >
                You can also give by mail, in person during our services, or set
                up recurring donations. For more information about giving
                options, please contact our Admin.
              </Caption>

              {/** 🔥 Push all buttons downward by adding margin-top */}
              <FlexboxLayout
                justify="center"
                gap="md"
                className="flex-wrap mt-4"
              >
                <Button
                  onClick={handleContactCall}
                  variant="primary"
                  size="md"
                  curvature="full"
                  elevated={true}
                  leftIcon={<Phone className="w-4 h-4" />}
                  className="px-5 py-2.5 font-semibold hover:scale-105 transition text-sm"
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
                  className="px-5 py-2.5 border text-sm"
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
