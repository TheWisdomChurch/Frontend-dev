/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Image from 'next/image';
import { OnlinegivingOptions } from '@/lib/data';
import { useTheme } from '@/components/contexts/ThemeContext';
import GivingModal from '@/components/modal/GivingModal';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';
import { ChevronLeft, ChevronRight, Phone, Sparkles, Gift } from 'lucide-react';
import { useOnlineGiving } from '@/components/utils/hooks/Onlinegiving';
import {
  handleContactCall,
  useIntersectionObserver,
} from '@/components/utils/functionUtils/contactUtils';
import { H2, BaseText, BodySM, Caption, H3 } from '@/components/text';
import Button from '@/components/utils/buttons/CustomButton';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import { WisdomeHouseLogo } from '@/components/assets';
export default function OnlineGiving() {
  const { colorScheme } = useTheme();
  const { open } = useServiceUnavailable();
  const {
    isVisible,
    setIsVisible,
    selectedGivingOption,
    isModalOpen,
    isHovered,
    mousePosition,
    isMobile,
    sectionRef,
    scrollContainerRef,
    cardsRef,
    handleGiveNow,
    closeModal,
    scrollLeft,
    scrollRight,
    handleMouseMove,
    handleMouseLeave,
    handleCardHover,
    handleCardLeave,
    currentIndex,
    previousCard,
    nextCard,
  } = useOnlineGiving();
  useIntersectionObserver(setIsVisible, sectionRef);
  // Add ref to card
  const addCardRef = (el: HTMLDivElement | null, index: number) => {
    cardsRef.current[index] = el;
  };

  const cardShell =
    'giving-card rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 ease-out';
  const cardTitle = 'text-[15px] font-medium text-white';
  const cardDesc = 'text-[13px] text-white/70 leading-relaxed';
  const cardButton =
    'giving-cta w-full h-10 text-[12px] font-medium border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all duration-300';
  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
       
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
       
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
       
        .perspective-1000 {
          perspective: 1000px;
        }
       
        .preserve-3d {
          transform-style: preserve-3d;
        }
       
        .backface-hidden {
          backface-visibility: hidden;
        }

        @keyframes cardRise {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }

        .giving-card:hover {
          box-shadow: 0 24px 60px rgba(0,0,0,0.55);
          border-color: rgba(255,255,255,0.24);
        }

        .giving-card .giving-overlay {
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .giving-card:hover .giving-overlay {
          opacity: 1;
        }

        .giving-card:hover .giving-cta {
          border-color: rgba(255,255,255,0.35);
        }

        @media (prefers-reduced-motion: reduce) {
          .giving-card,
          .giving-card:hover {
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
      <Section
        ref={sectionRef}
        padding="none"
        fullHeight={false}
        className="overflow-hidden relative"
        style={{
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 40, 100, 0.1) 0%, transparent 50%)',
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          {/* Floating particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                background: `radial-gradient(circle, ${colorScheme.primary}30, transparent 70%)`,
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
                filter: 'blur(20px)',
                opacity: 0.1,
              }}
            />
          ))}
        </div>
        {/* Dynamic spotlight effect */}
        {!isMobile && (
          <div
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              width: '400px',
              height: '400px',
              background: `radial-gradient(circle, ${colorScheme.primary}15 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
              opacity: isHovered !== null ? 0.3 : 0.1,
              filter: 'blur(40px)',
            }}
          />
        )}
        <Container size="xl" className="relative z-10 py-10 sm:py-14 lg:py-16">
          {/* Header - Not too big but bold */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="sm"
            className="text-center mb-10 sm:mb-12 px-4"
          >
            {/* Logo with subtle animation */}
            <div className="mb-4 relative">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/20 shadow-xl mx-auto">
                <Image
                  src={WisdomeHouseLogo}
                  alt="Wisdom House Church Logo"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -inset-3 rounded-full border-2 border-primary/20 animate-ping opacity-20" />
            </div>
            {/* Title with gradient */}
            <H2
              className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight tracking-tight"
              style={{
                color: '#FFFFFF',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
              useThemeColor={false}
            >
              <span className="bg-gradient-to-r from-white via-white/90 to-white bg-clip-text text-transparent">
                Online Giving
              </span>
            </H2>
            {/* Subtitle */}
            <BodySM
              className="max-w-lg text-center leading-relaxed mt-3 px-4 opacity-90 text-sm sm:text-base"
              style={{ color: '#a0a0a0' }}
              useThemeColor={false}
            >
              “As each has purposed in his heart, let him give—not grudgingly or under compulsion—for God loves a cheerful giver.”
— 2 Corinthians 9:7
              <Gift className="w-4 h-4 inline-block ml-2 opacity-70" />
            </BodySM>
          </FlexboxLayout>
          {/* Desktop - Movie Premiere 3D Layout (Coverflow-style with zoom effect) */}
          <div className="hidden lg:block">
            <FlexboxLayout justify="between" align="center" className="mb-6 px-4">
              <button
                onClick={previousCard}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <BodySM
                className="font-medium text-sm"
                style={{ color: '#9ca3af' }}
                useThemeColor={false}
              >
                Slide to explore
              </BodySM>
              <button
                onClick={nextCard}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </FlexboxLayout>
            <div className="relative h-[400px] w-full overflow-hidden perspective-1000">
              <div className="w-full h-full flex items-center justify-center preserve-3d relative">
                {OnlinegivingOptions.map((option, index) => {
                  const offset = index - currentIndex;
                  const absOffset = Math.abs(offset);
                  const translateX = offset * 240;
                  const rotateY = offset * -40;
                  const translateZ = -absOffset * 150;
                  const scale = 1 - absOffset * 0.2;
                  if (absOffset > 3) return null; // Limit visible cards for performance
                  return (
                    <div
                      key={option.title}
                      ref={(el) => addCardRef(el, index)}
                      className={`absolute transition-all duration-500 ease-out preserve-3d backface-hidden ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        zIndex: 10 - absOffset,
                        opacity: scale > 0.4 ? 1 : 0,
                        width: '280px',
                        transitionDelay: `${index * 150}ms`,
                      }}
                      onMouseEnter={() => handleCardHover(index)}
                      onMouseLeave={() => handleCardLeave(index)}
                      onClick={() => handleGiveNow(option)}
                    >
                      {/* 3D Card */}
                      <div className="w-full h-80 relative preserve-3d cursor-pointer group">
                        {/* Card front */}
                        <div className={`absolute inset-0 ${cardShell} preserve-3d backface-hidden`}>
                          {/* Glow effect */}
                          <div className="absolute inset-0 rounded-2xl giving-overlay bg-black/50" />
                          {/* Content */}
                          <div className="relative z-10 h-full flex flex-col">
                            {/* Title with gradient */}
                            <div className="mb-4">
                              <div
                                className="inline-block px-4 py-2 rounded-full mb-3"
                                style={{
                                  background: `linear-gradient(135deg, ${colorScheme.primary}20, ${colorScheme.secondary}15)`,
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                <Sparkles className="w-4 h-4" style={{ color: colorScheme.primary }} />
                              </div>
                              <BaseText
                                weight="semibold"
                                className={`${cardTitle} mb-2`}
                                useThemeColor={false}
                              >
                                {option.title}
                              </BaseText>
                            </div>
                            {/* Description */}
                            <div className="flex-grow">
                              <Caption
                                className={`${cardDesc} line-clamp-3`}
                                useThemeColor={false}
                              >
                                {option.description}
                              </Caption>
                            </div>
                            {/* Button - Not too big */}
                            <div className="mt-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                curvature="lg"
                                className={cardButton}
                              >
                                Give Now
                              </Button>
                            </div>
                          </div>
                        </div>
                        {/* Card back glow */}
                        <div className="absolute inset-0 rounded-2xl transform rotate-y-180 backface-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: `linear-gradient(45deg, ${colorScheme.primary}15, ${colorScheme.secondary}10)`,
                            filter: 'blur(20px)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Tablet (768px - 1023px) - Modified Grid Layout */}
          <div className="hidden md:block lg:hidden">
            <GridboxLayout
              columns={2}
              gap="lg"
              className="w-full mb-12"
            >
              {OnlinegivingOptions.map((option, index) => (
                <div
                  key={option.title}
                  ref={(el) => addCardRef(el, index)}
                  className={`transition-all duration-700 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={() => handleCardLeave(index)}
                >
                  <div className={`${cardShell} relative h-full flex flex-col`}>
                    <div className="absolute inset-0 rounded-2xl giving-overlay bg-black/50" />
                    {/* Title */}
                    <div className="mb-4">
                      <BaseText
                        weight="semibold"
                        className={cardTitle}
                        useThemeColor={false}
                      >
                        {option.title}
                      </BaseText>
                    </div>
                    {/* Description */}
                    <div className="flex-grow mb-4">
                      <Caption
                        className={`${cardDesc} line-clamp-3`}
                        useThemeColor={false}
                      >
                        {option.description}
                      </Caption>
                    </div>
                    {/* Button */}
                    <Button
                      onClick={() => handleGiveNow(option)}
                      variant="ghost"
                      size="sm"
                      curvature="lg"
                      className={cardButton}
                    >
                      Give Now
                    </Button>
                  </div>
                </div>
              ))}
            </GridboxLayout>
          </div>
          {/* Mobile - Keep original but refined */}
          <div className="md:hidden px-4">
            <FlexboxLayout direction="column" gap="md">
              <FlexboxLayout justify="between" align="center" className="mb-6">
                <button
                  onClick={scrollLeft}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition"
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
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition"
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
                    <div className={`${cardShell} relative flex flex-col h-full`}>
                      <div className="absolute inset-0 rounded-2xl giving-overlay bg-black/50" />
                      {/* Title */}
                      <div className="mb-4">
                        <BaseText
                          weight="semibold"
                          className={cardTitle}
                          useThemeColor={false}
                        >
                          {option.title}
                        </BaseText>
                      </div>
                      {/* Description */}
                      <div className="flex-grow mb-4">
                        <Caption
                          className={`${cardDesc} line-clamp-3`}
                          useThemeColor={false}
                        >
                          {option.description}
                        </Caption>
                      </div>
                      {/* Button */}
                      <Button
                        onClick={() => handleGiveNow(option)}
                        variant="ghost"
                        size="sm"
                        curvature="lg"
                        className={cardButton}
                      >
                        Give Now
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex-shrink-0 w-4" />
              </div>
            </FlexboxLayout>
          </div>
          {/* Other Ways to Give - Refined */}
          <div
            className={`mt-10 sm:mt-12 transition-all duration-1000 delay-300 px-4 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="max-w-lg mx-auto bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10 text-center backdrop-blur-sm">
              <H3
                className="text-center mb-4 text-lg font-semibold"
                style={{ color: '#ffffff' }}
                useThemeColor={false}
              >
                Other Ways to Give
              </H3>
              <Caption
                className="mb-6 text-white/70 text-sm leading-relaxed"
                useThemeColor={false}
              >
                Give by mail, in person during services, or set up recurring donations.
                Contact our Admin for more options.
              </Caption>
              <FlexboxLayout
                justify="center"
                gap="md"
                className="flex-wrap"
              >
                <Button
                  onClick={handleContactCall}
                  variant="primary"
                  size="sm"
                  curvature="full"
                  leftIcon={<Phone className="w-4 h-4" />}
                  className="h-10 px-5 text-[12px] font-medium hover:scale-105 transition w-full sm:w-auto min-w-[150px]"
                  style={{
                    backgroundColor: colorScheme.primary,
                    color: '#000000',
                  }}
                >
                  Contact Us
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  curvature="full"
                  className="h-10 px-5 text-[12px] font-medium border text-sm hover:bg-white/10 transition w-full sm:w-auto min-w-[150px]"
                  style={{
                    borderColor: colorScheme.primary,
                    color: '#FFFFFF',
                  }}
                  onClick={() =>
                    open({
                      title: 'More ways to give',
                      message:
                        'Our expanded giving options are rolling out shortly. We appreciate your generosity.',
                      actionLabel: 'Sounds good',
                    })
                  }
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
