'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Button } from '../utils';
import { BaseText, BricolageText, H2, P } from '@/components/text';
import { PlayfairText } from '../text/FontText';
import { useTheme } from '@/components/contexts/ThemeContext';
import { confessionContent } from '@/lib/data';
import { WisdomeHouseLogo } from '../assets';
import { Church, Hand, TrendingUp } from 'lucide-react';

interface ProfessionalPopupProps {
  onClose: () => void;
  delay?: number;
}

type ModalStep = 'confession' | 'welcome';

export default function ProfessionalPopup({
  onClose,
  delay = 2000,
}: ProfessionalPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalStep>('welcome');
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { colorScheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    const lastSeenDate = localStorage.getItem('popupLastSeen');
    const today = new Date().toDateString();

    if (!hasSeenPopup || lastSeenDate !== today) {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(showTimer);
    }
  }, [delay]);

  useEffect(() => {
    if (isVisible && modalRef.current) {
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline();
      tl.fromTo(
        modalRef.current,
        {
          opacity: 0,
          scale: 0.95,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const animateStepTransition = (newStep: ModalStep) => {
    if (!contentRef.current) return;

    const tl = gsap.timeline();

    tl.to(contentRef.current, {
      opacity: 0,
      x: -30,
      duration: 0.3,
      ease: 'power2.inOut',
    })
      .add(() => {
        setCurrentStep(newStep);
      })
      .fromTo(
        contentRef.current,
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        }
      );
  };

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 30,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setIsVisible(false);
          localStorage.setItem('hasSeenPopup', 'true');
          localStorage.setItem('popupLastSeen', new Date().toDateString());
          setTimeout(() => {
            onClose();
          }, 300);
        },
      });
    } else {
      setIsVisible(false);
      localStorage.setItem('hasSeenPopup', 'true');
      localStorage.setItem('popupLastSeen', new Date().toDateString());
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const showConfession = () => {
    animateStepTransition('confession');
  };

  const showWelcome = () => {
    animateStepTransition('welcome');
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6 transition-all duration-500 ${
        isVisible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: isVisible ? 'blur(20px)' : 'blur(0px)',
        WebkitBackdropFilter: isVisible ? 'blur(20px)' : 'blur(0px)',
      }}
      onClick={handleBackdropClick}
    >
      {/* Wider Responsive Modal Container - Using CSS classes for responsive width */}
      <div
        ref={modalRef}
        className="relative rounded-xl w-full mx-auto overflow-hidden popup-modal-container"
        style={{
          backgroundColor: colorScheme.black,
          border: `1px solid ${colorScheme.primary}30`,
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(247, 222, 18, 0.1)
          `,
          maxHeight: '90vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-xl z-20"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <div
            className="h-full transition-all duration-700 ease-out rounded-t-xl"
            style={{
              width: currentStep === 'welcome' ? '50%' : '100%',
              background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.primaryLight})`,
            }}
          />
        </div>

        {/* Responsive Close Button */}
        <div className="relative w-full">
          <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="z-[100] rounded-full p-2 sm:p-3 md:p-4 transform hover:scale-110 transition-all duration-200 shadow-lg"
              curvature="full"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: `2px solid ${colorScheme.primary}`,
                color: colorScheme.primary,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Content Area with increased padding for wider screens */}
        <div
          ref={contentRef}
          className="p-4 sm:p-5 md:p-6 lg:p-8 transition-all duration-300 h-full overflow-y-auto"
        >
          {/* Step 1: Welcome (First Step) */}
          {currentStep === 'welcome' && (
            <div className="text-center h-full flex flex-col">
              <div className="flex-shrink-0 mb-4 sm:mb-6 md:mb-8 mt-6 sm:mt-10 md:mt-12">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-5 border overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(247, 222, 18, 0.1)',
                    borderColor: colorScheme.primary,
                  }}
                >
                  <Image
                    src={WisdomeHouseLogo}
                    alt="The Wisdom House Church Logo"
                    width={40}
                    height={40}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain"
                  />
                </div>

                <H2
                  as="h2"
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-3 md:mb-4 tracking-tight leading-tight"
                  style={{ color: colorScheme.white }}
                >
                  Welcome to{' '}
                  <BaseText
                    fontFamily="playfair"
                    style={{
                      fontStyle: 'italic',
                      color: colorScheme.primary,
                      display: 'inline',
                      fontSize: 'inherit',
                      lineHeight: 'inherit',
                    }}
                  >
                    The Wisdom House Church
                  </BaseText>
                </H2>

                <div
                  className="w-12 sm:w-16 md:w-20 lg:w-24 h-0.5 mx-auto rounded-full mb-3 sm:mb-4 md:mb-5"
                  style={{
                    background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.primaryLight})`,
                  }}
                />
              </div>

              <div className="flex-1 overflow-y-auto mb-4 sm:mb-6 md:mb-8">
                <BricolageText
                  as="p"
                  className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-md md:max-w-lg mx-auto mb-4 sm:mb-6 md:mb-8 font-light opacity-90 text-center px-2"
                  style={{ color: colorScheme.white }}
                  weight="light"
                >
                  We're delighted to have you visit our{' '}
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
                    online Community
                  </BaseText>
                  .
                </BricolageText>

                {/* Wider Mini Boxes with Lucide Icons */}
                <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 px-2">
                  {[
                    {
                      icon: (
                        <Church className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black" />
                      ),
                      title: 'Worship',
                    },
                    {
                      icon: (
                        <Hand className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black" />
                      ),
                      title: 'Pray',
                    },
                    {
                      icon: (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black" />
                      ),
                      title: 'Grow',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="text-center p-2 sm:p-3 md:p-4 rounded-lg border transition-all duration-300 hover:scale-105 flex-1 min-w-0 max-w-20 sm:max-w-24 md:max-w-28 lg:max-w-32"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(247, 222, 18, 0.3)',
                      }}
                    >
                      <div
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3 border"
                        style={{
                          background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                          borderColor: colorScheme.white,
                        }}
                      >
                        {item.icon}
                      </div>
                      <BricolageText
                        as="h3"
                        className="font-bold text-xs sm:text-sm md:text-base truncate"
                        weight="semibold"
                        style={{ color: colorScheme.white }}
                      >
                        {item.title}
                      </BricolageText>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation - Wider buttons for desktop */}
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center px-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={showConfession}
                  className="font-bold transition-all duration-300 transform hover:scale-105 border w-full sm:w-auto md:min-w-[140px] text-sm sm:text-base md:text-lg"
                  curvature="xl"
                  style={{
                    borderColor: colorScheme.primary,
                    color: colorScheme.white,
                    backgroundColor: 'rgba(247, 222, 18, 0.05)',
                  }}
                >
                  Our Confession
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleClose}
                  className="font-bold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto md:min-w-[140px] text-sm sm:text-base md:text-lg"
                  curvature="xl"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                    color: colorScheme.black,
                  }}
                >
                  Explore Site
                </Button>
              </div>

              <BricolageText
                as="p"
                className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-md md:max-w-lg mx-auto pt-4 sm:pt-6 md:pt-8 mb-4 sm:mb-6 md:mb-8 font-light opacity-90 text-center px-2"
                style={{ color: colorScheme.white }}
                weight="light"
              >
                Begin your journey{' '}
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
                  with us today.
                </BaseText>
              </BricolageText>
            </div>
          )}

          {/* Step 2: Confession (Second Step) */}
          {currentStep === 'confession' && (
            <div className="text-center h-full flex flex-col">
              {/* Header */}
              <div className="flex-shrink-0 mb-4 sm:mb-6 md:mb-8">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-5 border"
                  style={{
                    backgroundColor: 'rgba(247, 222, 18, 0.1)',
                    borderColor: colorScheme.primary,
                  }}
                >
                  <span
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                    style={{ color: colorScheme.primary }}
                  >
                    📖
                  </span>
                </div>

                <BricolageText
                  as="p"
                  className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-md md:max-w-lg mx-auto pt-4 sm:pt-6 md:pt-8 mb-4 sm:mb-6 md:mb-8 font-light opacity-90 text-center px-2"
                  style={{ color: colorScheme.white }}
                  weight="light"
                >
                  Our{' '}
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
                    Confession
                  </BaseText>
                </BricolageText>

                <div
                  className="w-12 sm:w-16 md:w-20 lg:w-24 h-0.5 mx-auto rounded-full mb-3 sm:mb-4 md:mb-5"
                  style={{
                    background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.primaryLight})`,
                  }}
                />
              </div>

              {/* Content - Wider for desktop */}
              <div className="flex-1 overflow-y-auto mb-4 sm:mb-6 md:mb-8 px-2">
                <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto">
                  <PlayfairText
                    as="p"
                    className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-6 md:mb-8 italic text-center"
                    style={{ color: colorScheme.white }}
                    weight="light"
                  >
                    "We Begin to Prosper,
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
                      We continue to prosper,
                    </BaseText>
                    Until we become very prosperous."
                  </PlayfairText>

                  <div
                    className="rounded-lg p-3 sm:p-4 md:p-6 border max-h-40 sm:max-h-56 md:max-h-64 overflow-y-auto"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(247, 222, 18, 0.3)',
                    }}
                  >
                    <PlayfairText
                      as="div"
                      className="leading-relaxed space-y-2 sm:space-y-3 md:space-y-4 text-justify text-xs sm:text-sm md:text-base"
                      style={{ color: colorScheme.white }}
                      weight="regular"
                    >
                      {confessionContent
                        .split('\n\n')
                        .map((paragraph, index) => (
                          <P
                            key={index}
                            className="mb-2 sm:mb-3 md:mb-4 last:mb-0 opacity-90"
                          >
                            {paragraph}
                          </P>
                        ))}
                    </PlayfairText>
                  </div>
                </div>
              </div>

              {/* Navigation - Wider buttons for desktop */}
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center px-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={showWelcome}
                  leftIcon={
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  }
                  className="font-bold transition-all duration-300 transform hover:scale-105 border w-full sm:w-auto md:min-w-[140px] text-sm sm:text-base md:text-lg"
                  curvature="xl"
                  style={{
                    borderColor: colorScheme.primary,
                    color: colorScheme.white,
                    backgroundColor: 'rgba(247, 222, 18, 0.05)',
                  }}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleClose}
                  className="font-bold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto md:min-w-[140px] text-sm sm:text-base md:text-lg"
                  curvature="xl"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                    color: colorScheme.black,
                  }}
                >
                  Explore Site
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
