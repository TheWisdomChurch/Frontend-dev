/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gift,
  HeartHandshake,
  Loader2,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { useTheme } from '@/shared/contexts/ThemeContext';
import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import GivingModal from '@/shared/ui/modals/GivingModal';
import { useOnlineGiving } from '@/shared/utils/hooks/Onlinegiving';
import {
  handleContactCall,
  useIntersectionObserver,
} from '@/shared/utils/functionUtils/contactUtils';

import apiClient from '@/lib/api';
import type { GivingOption } from '@/lib/types';

import { H2, BaseText, BodySM, Caption, H3 } from '@/shared/text';
import Button from '@/shared/utils/buttons/CustomButton';
import { Section, Container } from '@/shared/layout';
import { WisdomeHouseLogo } from '@/shared/assets';

type Particle = {
  id: number;
  size: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
};

const CARD_SHELL =
  'giving-card group relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.065] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-2xl transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.09] sm:p-6';

const CARD_TITLE = 'text-[0.95rem] font-semibold leading-snug text-white';
const CARD_DESC = 'text-[0.82rem] leading-relaxed text-white/68';

const CARD_BUTTON =
  'h-10 w-full border border-white/18 bg-white/[0.07] text-[12px] font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-white/[0.12]';

function GivingCard({
  option,
  index,
  isVisible,
  colorScheme,
  onGive,
  setCardRef,
  onHover,
  onLeave,
}: {
  option: GivingOption;
  index: number;
  isVisible: boolean;
  colorScheme: any;
  onGive: (option: GivingOption) => void;
  setCardRef?: (el: HTMLDivElement | null, index: number) => void;
  onHover?: (index: number) => void;
  onLeave?: (index: number) => void;
}) {
  return (
    <div
      ref={el => setCardRef?.(el, index)}
      className={`${CARD_SHELL} ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
      onMouseEnter={() => onHover?.(index)}
      onMouseLeave={() => onLeave?.(index)}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-80"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent, ${colorScheme.primary}, transparent)`,
        }}
      />

      <div
        className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `${colorScheme.primary}22`, opacity: 0.45 }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primary}cc 100%)`,
          }}
        >
          <Gift className="h-5 w-5 text-black" />
        </div>

        <BaseText
          weight="semibold"
          className={CARD_TITLE}
          useThemeColor={false}
        >
          {option.title}
        </BaseText>

        <Caption
          className={`${CARD_DESC} mt-3 line-clamp-4 flex-1`}
          useThemeColor={false}
        >
          {option.description}
        </Caption>

        <div className="mt-6">
          <Button
            onClick={() => onGive(option)}
            variant="ghost"
            size="sm"
            curvature="full"
            className={CARD_BUTTON}
          >
            <span className="inline-flex items-center justify-center gap-2">
              Make contribution
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OnlineGiving() {
  const { colorScheme } = useTheme();
  const { open } = useServiceUnavailable();

  const [givingOptions, setGivingOptions] = useState<GivingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);

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
  } = useOnlineGiving(givingOptions.length);

  useIntersectionObserver(setIsVisible, sectionRef);

  useEffect(() => {
    setParticles(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        size: Math.random() * 90 + 48,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: i * 0.45,
        duration: Math.random() * 9 + 14,
      }))
    );
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadOptions = async () => {
      try {
        setLoading(true);
        const options = await apiClient.listGivingOptions();

        if (mounted) {
          setGivingOptions(Array.isArray(options) ? options : []);
        }
      } catch {
        if (mounted) setGivingOptions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadOptions();

    return () => {
      mounted = false;
    };
  }, []);

  const addCardRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      cardsRef.current[index] = el;
    },
    [cardsRef]
  );

  const handleGiveNowWithTracking = useCallback(
    async (option: GivingOption) => {
      handleGiveNow(option);

      try {
        await apiClient.submitGivingIntent({
          title: option.title,
          description: option.description,
          sourceChannel: 'frontend:web:online-giving',
          metadata: {
            page: 'home',
            component: 'OnlineGiving',
          },
        });
      } catch {
        // Non-blocking analytics/intention tracking.
      }
    },
    [handleGiveNow]
  );

  return (
    <>
      <style jsx global>{`
        @keyframes givingFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -14px, 0);
          }
        }

        .giving-float {
          animation: givingFloat 16s ease-in-out infinite;
        }

        .giving-perspective {
          perspective: 1200px;
        }

        .giving-preserve-3d {
          transform-style: preserve-3d;
        }

        .giving-backface-hidden {
          backface-visibility: hidden;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .giving-card,
          .giving-float {
            animation: none !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <Section
        ref={sectionRef}
        padding="none"
        fullHeight={false}
        className="relative overflow-hidden bg-[#050505]"
      >
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                'radial-gradient(circle at 18% 18%, rgba(247,222,18,0.12), transparent 32%), radial-gradient(circle at 82% 22%, rgba(255,255,255,0.08), transparent 30%), radial-gradient(circle at 50% 100%, rgba(247,222,18,0.08), transparent 38%)',
            }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-30" />

          {particles.map(particle => (
            <div
              key={particle.id}
              className="giving-float absolute rounded-full"
              style={{
                background: `radial-gradient(circle, ${colorScheme.primary}30, transparent 70%)`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                filter: 'blur(24px)',
                opacity: 0.12,
              }}
            />
          ))}
        </div>

        {!isMobile && (
          <div
            className="pointer-events-none absolute z-[1] rounded-full transition-opacity duration-300"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              width: '440px',
              height: '440px',
              background: `radial-gradient(circle, ${colorScheme.primary}18 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
              opacity: isHovered !== null ? 0.45 : 0.12,
              filter: 'blur(46px)',
            }}
          />
        )}

        <Container size="xl" className="relative z-10 py-14 sm:py-18 lg:py-20">
          <div className="mx-auto mb-10 max-w-3xl px-4 text-center sm:mb-12">
            <div className="relative mx-auto mb-5 h-16 w-16">
              <div className="h-16 w-16 overflow-hidden rounded-full border border-white/15 bg-white/10 p-1 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <Image
                  src={WisdomeHouseLogo}
                  alt="Wisdom House Church Logo"
                  width={64}
                  height={64}
                  className="h-full w-full rounded-full object-cover"
                  priority={false}
                />
              </div>
              <div
                className="absolute -inset-3 rounded-full border opacity-30"
                style={{ borderColor: colorScheme.primary }}
              />
            </div>

            <div
              className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
              style={{
                borderColor: `${colorScheme.primary}33`,
                background: `${colorScheme.primary}12`,
                color: colorScheme.primary,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                Worship through generosity
              </span>
            </div>

            <H2
              className="text-[1.8rem] font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl"
              useThemeColor={false}
            >
              Online Giving
            </H2>

            <BodySM
              className="mx-auto mt-4 max-w-xl text-center text-[0.9rem] leading-7 text-white/68 sm:text-base"
              useThemeColor={false}
            >
              As each has purposed in his heart, let him give not grudgingly or
              under compulsion.
              <br />
              <span className="text-white/85">
                God loves a cheerful giver. 2 Corinthians 9:7
              </span>
            </BodySM>
          </div>

          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white/75">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading giving options…
              </div>
            </div>
          ) : givingOptions.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl">
              <Gift
                className="mx-auto h-8 w-8"
                style={{ color: colorScheme.primary }}
              />
              <H3
                className="mt-4 text-lg font-semibold text-white"
                useThemeColor={false}
              >
                Giving options are being prepared
              </H3>
              <Caption
                className="mt-2 text-sm leading-6 text-white/60"
                useThemeColor={false}
              >
                Our online giving channels will appear here once they are
                published from the admin portal.
              </Caption>
            </div>
          ) : (
            <>
              <div className="hidden lg:block">
                <div className="mb-6 flex items-center justify-between px-4">
                  <button
                    type="button"
                    onClick={previousCard}
                    className="rounded-full border border-white/15 bg-white/[0.08] p-3 text-white backdrop-blur-xl transition hover:bg-white/[0.14]"
                    aria-label="Previous giving option"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <BodySM
                    className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-white/48"
                    useThemeColor={false}
                  >
                    Slide to explore
                  </BodySM>

                  <button
                    type="button"
                    onClick={nextCard}
                    className="rounded-full border border-white/15 bg-white/[0.08] p-3 text-white backdrop-blur-xl transition hover:bg-white/[0.14]"
                    aria-label="Next giving option"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="giving-perspective relative h-[420px] w-full overflow-hidden">
                  <div className="giving-preserve-3d relative flex h-full w-full items-center justify-center">
                    {givingOptions.map((option, index) => {
                      const offset = index - currentIndex;
                      const absOffset = Math.abs(offset);

                      if (absOffset > 3) return null;

                      const translateX = offset * 245;
                      const rotateY = offset * -34;
                      const translateZ = -absOffset * 135;
                      const scale = Math.max(0.72, 1 - absOffset * 0.16);

                      return (
                        <div
                          key={`${option.title}-${index}`}
                          ref={el => addCardRef(el, index)}
                          className={`giving-preserve-3d giving-backface-hidden absolute transition-all duration-500 ease-out ${
                            isVisible ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{
                            width: '292px',
                            zIndex: 20 - absOffset,
                            opacity: absOffset > 2 ? 0.42 : 1,
                            transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                            transitionDelay: `${index * 90}ms`,
                          }}
                          onMouseEnter={() => handleCardHover(index)}
                          onMouseLeave={() => handleCardLeave(index)}
                        >
                          <div
                            onClick={() => handleGiveNowWithTracking(option)}
                          >
                            <GivingCard
                              option={option}
                              index={index}
                              isVisible
                              colorScheme={colorScheme}
                              onGive={handleGiveNowWithTracking}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="hidden md:grid md:grid-cols-2 md:gap-5 lg:hidden">
                {givingOptions.map((option, index) => (
                  <GivingCard
                    key={`${option.title}-${index}`}
                    option={option}
                    index={index}
                    isVisible={isVisible}
                    colorScheme={colorScheme}
                    onGive={handleGiveNowWithTracking}
                    setCardRef={addCardRef}
                    onHover={handleCardHover}
                    onLeave={handleCardLeave}
                  />
                ))}
              </div>

              <div className="md:hidden">
                <div className="mb-5 flex items-center justify-between px-4">
                  <button
                    type="button"
                    onClick={scrollLeft}
                    className="rounded-full border border-white/15 bg-white/[0.08] p-3 text-white backdrop-blur-xl transition hover:bg-white/[0.14]"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <BodySM
                    className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/48"
                    useThemeColor={false}
                  >
                    Scroll to explore
                  </BodySM>

                  <button
                    type="button"
                    onClick={scrollRight}
                    className="rounded-full border border-white/15 bg-white/[0.08] p-3 text-white backdrop-blur-xl transition hover:bg-white/[0.14]"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div
                  ref={scrollContainerRef}
                  className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6"
                >
                  {givingOptions.map((option, index) => (
                    <div
                      key={`${option.title}-${index}`}
                      className="w-[82vw] max-w-[320px] shrink-0 snap-center"
                    >
                      <GivingCard
                        option={option}
                        index={index}
                        isVisible={isVisible}
                        colorScheme={colorScheme}
                        onGive={handleGiveNowWithTracking}
                      />
                    </div>
                  ))}
                  <div className="w-2 shrink-0" />
                </div>
              </div>
            </>
          )}

          <div
            className={`mt-10 px-4 transition-all duration-700 sm:mt-12 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-7">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: `${colorScheme.primary}18`,
                  color: colorScheme.primary,
                }}
              >
                <HeartHandshake className="h-6 w-6" />
              </div>

              <H3
                className="mt-4 text-center text-[1.15rem] font-semibold text-white"
                useThemeColor={false}
              >
                Other Ways to Give
              </H3>

              <Caption
                className="mx-auto mt-3 max-w-lg text-[0.85rem] leading-6 text-white/65 sm:text-sm"
                useThemeColor={false}
              >
                Give by mail, in person during services, or set up recurring
                donations. Contact our Admin for more options.
              </Caption>

              <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  onClick={handleContactCall}
                  variant="primary"
                  size="sm"
                  curvature="full"
                  leftIcon={<Phone className="h-4 w-4" />}
                  className="h-11 w-full px-4 text-[0.82rem] font-semibold transition hover:scale-[1.01] sm:text-sm"
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
                  leftIcon={<ShieldCheck className="h-4 w-4" />}
                  className="h-11 w-full border px-4 text-[0.82rem] font-semibold text-white transition hover:bg-white/10 sm:text-sm"
                  style={{
                    borderColor: `${colorScheme.primary}88`,
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
              </div>
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
