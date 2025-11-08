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

    // Use localStorage with a timestamp to show modal once per day
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    const lastSeenDate = localStorage.getItem('popupLastSeen');
    const today = new Date().toDateString();

    // Show modal only if never seen before or last seen was not today
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

      // Professional entrance animation
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
          // Mark as seen for today
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

  // FIXED: Allow backdrop click to close modal
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
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500 ${
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
      {/* Professional Modal Container - Properly Sized */}
      <div
        ref={modalRef}
        className="relative rounded-xl w-full mx-auto overflow-hidden"
        style={{
          backgroundColor: colorScheme.black,
          border: `1px solid ${colorScheme.primary}30`,
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(247, 222, 18, 0.1)
          `,
          maxHeight: '85vh',
          maxWidth: 'min(90vw, 500px)',
          width: '100%',
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

        {/* Professional Close Button - Top Right - OVERLAPPING POSITION */}
        <div className="relative w-full">
          <div className="absolute -top-3 -right-3 z-50">
            {' '}
            {/* ✅ Moves it outside the container */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="z-[100] rounded-full p-3 transform hover:scale-110 transition-all duration-200 shadow-lg"
              curvature="full"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: `2px solid ${colorScheme.primary}`,
                color: colorScheme.primary,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <svg
                className="w-5 h-5"
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

        {/* Content Area */}
        <div
          ref={contentRef}
          className="p-6 transition-all duration-300 h-full overflow-y-auto"
        >
          {/* Step 1: Welcome (First Step) */}
          {currentStep === 'welcome' && (
            <div className="text-center h-full flex flex-col">
              <div className="flex-shrink-0 mb-6 mt-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border overflow-hidden"
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
                    className="w-10 h-10 object-contain"
                  />
                </div>

                <H2
                  as="h2"
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-3 tracking-tight leading-tight"
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
                  className="w-16 h-0.5 mx-auto rounded-full mb-4"
                  style={{
                    background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.primaryLight})`,
                  }}
                />
              </div>

              <div className="flex-1 overflow-y-auto mb-6">
                <BricolageText
                  as="p"
                  className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-md mx-auto mb-6 font-light opacity-90 text-center"
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

                {/* Compact Mini Boxes with Lucide Icons */}
                <div className="flex justify-center gap-3 mb-6">
                  {[
                    {
                      icon: <Church className="w-4 h-4 text-black" />,
                      title: 'Worship',
                    },
                    {
                      icon: <Hand className="w-4 h-4 text-black" />,
                      title: 'Pray',
                    },
                    {
                      icon: <TrendingUp className="w-4 h-4 text-black" />,
                      title: 'Grow',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="text-center p-3 rounded-lg border transition-all duration-300 hover:scale-105 flex-1 min-w-0 max-w-24"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(247, 222, 18, 0.3)',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 border"
                        style={{
                          background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                          borderColor: colorScheme.white,
                        }}
                      >
                        {item.icon}
                      </div>
                      <BricolageText
                        as="h3"
                        className="font-bold text-xs truncate"
                        weight="semibold"
                        style={{ color: colorScheme.white }}
                      >
                        {item.title}
                      </BricolageText>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation - Two buttons side by side */}
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  variant="outline"
                  size="md"
                  onClick={showConfession}
                  className="font-bold transition-all duration-300 transform hover:scale-105 border w-full sm:w-auto"
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
                  size="md"
                  onClick={handleClose}
                  className="font-bold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  curvature="xl"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                    color: colorScheme.black,
                  }}
                >
                  Explore Site
                </Button>
              </div>

              <H2
                as="p"
                className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-md mx-auto pt-10 mb-6 font-light opacity-90 text-center"
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
              </H2>
            </div>
          )}

          {/* Step 2: Confession (Second Step) */}
          {currentStep === 'confession' && (
            <div className="text-center h-full flex flex-col">
              {/* Header */}
              <div className="flex-shrink-0 mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border"
                  style={{
                    backgroundColor: 'rgba(247, 222, 18, 0.1)',
                    borderColor: colorScheme.primary,
                  }}
                >
                  <span
                    className="text-2xl"
                    style={{ color: colorScheme.primary }}
                  >
                    📖
                  </span>
                </div>

                <H2
                  as="p"
                  className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-md mx-auto pt-10 mb-6 font-light opacity-90 text-center"
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
                </H2>

                <div
                  className="w-16 h-0.5 mx-auto rounded-full mb-4"
                  style={{
                    background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.primaryLight})`,
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto mb-6">
                <div className="max-w-md mx-auto">
                  <PlayfairText
                    as="p"
                    className="text-lg leading-relaxed mb-6 italic text-center"
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
                    className="rounded-lg p-4 border max-h-56 overflow-y-auto"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(247, 222, 18, 0.3)',
                    }}
                  >
                    <PlayfairText
                      as="div"
                      className="leading-relaxed space-y-3 text-justify text-sm"
                      style={{ color: colorScheme.white }}
                      weight="regular"
                    >
                      {confessionContent
                        .split('\n\n')
                        .map((paragraph, index) => (
                          <P key={index} className="mb-3 last:mb-0 opacity-90">
                            {paragraph}
                          </P>
                        ))}
                    </PlayfairText>
                  </div>
                </div>
              </div>

              {/* Navigation - Back to Welcome and Explore Site */}
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  variant="outline"
                  size="md"
                  onClick={showWelcome}
                  leftIcon={
                    <svg
                      className="w-4 h-4 mr-2"
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
                  className="font-bold transition-all duration-300 transform hover:scale-105 border w-full sm:w-auto"
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
                  size="md"
                  onClick={handleClose}
                  className="font-bold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
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
