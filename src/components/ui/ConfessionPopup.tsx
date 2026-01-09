'use client';

import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, Church, Hand, TrendingUp, ArrowLeft } from 'lucide-react';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { BaseText, BricolageText, H2, P } from '@/components/text';
import { PlayfairText } from '../text/FontText';
import { useTheme } from '@/components/contexts/ThemeContext';
import { confessionContent } from '@/lib/data';
import { WisdomeHouseLogo } from '../assets';
import { useWelcomeModal } from '../utils/hooks/Useconfession';


interface WelcomeModalProps {
  onClose: () => void;
  delay?: number;
}

export default function WelcomeModal({ onClose, delay = 2000 }: WelcomeModalProps) {
  const { colorScheme } = useTheme();
  const {
    isVisible,
    currentStep,
    mounted,
    modalRef,
    contentRef,
    handleClose,
    showConfession,
    showWelcome,
  } = useWelcomeModal({ delay, onClose });

  if (!mounted || !isVisible) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative rounded-2xl w-full max-w-lg mx-auto overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colorScheme.black,
          border: `1px solid ${colorScheme.primary}20`,
          maxHeight: '85vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Indicator */}
        <div
          className="absolute top-0 left-0 right-0 h-1 z-20"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: currentStep === 'welcome' ? '50%' : '100%',
              background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.primaryLight})`,
            }}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            border: `1px solid ${colorScheme.primary}`,
            color: colorScheme.primary,
          }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Area */}
        <div
          ref={contentRef}
          className="p-6 sm:p-8 overflow-y-auto"
          style={{ maxHeight: 'calc(85vh - 1rem)' }}
        >
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="space-y-6">
              {/* Logo & Title */}
              <div className="text-center space-y-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2"
                  style={{
                    backgroundColor: `${colorScheme.primary}10`,
                    borderColor: colorScheme.primary,
                  }}
                >
                  <Image
                    src={WisdomeHouseLogo}
                    alt="The Wisdom House Church"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                </div>

                <div>
                  <H2
                    as="h2"
                    className="text-2xl sm:text-3xl font-bold mb-2 leading-tight"
                    style={{ color: colorScheme.white }}
                  >
                    Welcome to{' '}
                    <BaseText
                      fontFamily="playfair"
                      style={{
                        fontStyle: 'italic',
                        color: colorScheme.primary,
                        display: 'inline',
                      }}
                    >
                      The Wisdom Church
                    </BaseText>
                  </H2>

                  <div
                    className="w-16 h-0.5 mx-auto rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.primaryLight})`,
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <BricolageText
                as="p"
                className="text-sm sm:text-base leading-relaxed text-center opacity-90"
                style={{ color: colorScheme.white }}
                weight="light"
              >
                We're delighted to have you in our{' '}
                <BaseText
                  weight="medium"
                  fontFamily="playfair"
                  style={{
                    fontStyle: 'italic',
                    color: colorScheme.primary,
                    display: 'inline',
                  }}
                >
                  online community
                </BaseText>
                .
              </BricolageText>

              {/* Feature Cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Church, title: 'Worship' },
                  { icon: Hand, title: 'Pray' },
                  { icon: TrendingUp, title: 'Grow' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-3 rounded-lg border transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: `${colorScheme.primary}30`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                      }}
                    >
                      <item.icon className="w-5 h-5 text-black" />
                    </div>
                    <BricolageText
                      as="p"
                      className="font-semibold text-xs"
                      style={{ color: colorScheme.white }}
                    >
                      {item.title}
                    </BricolageText>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={showConfession}
                  className="flex-1 font-semibold transition-all duration-300 hover:scale-105 text-sm"
                  curvature="lg"
                  style={{
                    borderColor: colorScheme.primary,
                    color: colorScheme.white,
                    backgroundColor: `${colorScheme.primary}05`,
                  }}
                >
                  Our Confession
                </CustomButton>

                <CustomButton
                  variant="primary"
                  size="sm"
                  onClick={handleClose}
                  className="flex-1 font-semibold transition-all duration-300 hover:scale-105 text-sm"
                  curvature="lg"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                    color: colorScheme.black,
                  }}
                >
                  Explore Site
                </CustomButton>
              </div>

              {/* Footer Text */}
              <BricolageText
                as="p"
                className="text-xs sm:text-sm text-center opacity-75 pt-2"
                style={{ color: colorScheme.white }}
                weight="light"
              >
                Begin your journey{' '}
                <BaseText
                  weight="medium"
                  fontFamily="playfair"
                  style={{
                    fontStyle: 'italic',
                    color: colorScheme.primary,
                    display: 'inline',
                  }}
                >
                  with us today
                </BaseText>
                .
              </BricolageText>
            </div>
          )}

          {/* Confession Step */}
          {currentStep === 'confession' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2"
                  style={{
                    backgroundColor: `${colorScheme.primary}10`,
                    borderColor: colorScheme.primary,
                  }}
                >
                  <span className="text-3xl">📖</span>
                </div>

                <div>
                  <BricolageText
                    as="h3"
                    className="text-xl sm:text-2xl font-bold mb-2"
                    style={{ color: colorScheme.white }}
                  >
                    Our{' '}
                    <BaseText
                      fontFamily="playfair"
                      style={{
                        fontStyle: 'italic',
                        color: colorScheme.primary,
                        display: 'inline',
                      }}
                    >
                      Confession
                    </BaseText>
                  </BricolageText>

                  <div
                    className="w-16 h-0.5 mx-auto rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.primaryLight})`,
                    }}
                  />
                </div>
              </div>

              {/* Quote */}
              <PlayfairText
                as="p"
                className="text-sm sm:text-base leading-relaxed text-center italic"
                style={{ color: colorScheme.white }}
                weight="light"
              >
                "We Begin to Prosper,{' '}
                <BaseText
                  weight="medium"
                  fontFamily="playfair"
                  style={{
                    fontStyle: 'italic',
                    color: colorScheme.primary,
                    display: 'inline',
                  }}
                >
                  We continue to prosper
                </BaseText>
                , Until we become very prosperous."
              </PlayfairText>

              {/* Confession Content */}
              <div
                className="rounded-lg p-4 border max-h-48 overflow-y-auto"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderColor: `${colorScheme.primary}20`,
                }}
              >
                <PlayfairText
                  as="div"
                  className="text-xs sm:text-sm leading-relaxed space-y-3 text-justify"
                  style={{ color: colorScheme.white }}
                  weight="regular"
                >
                  {confessionContent.split('\n\n').map((paragraph, index) => (
                    <P key={index} className="opacity-90">
                      {paragraph}
                    </P>
                  ))}
                </PlayfairText>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={showWelcome}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="flex-1 font-semibold transition-all duration-300 hover:scale-105 text-sm"
                  curvature="lg"
                  style={{
                    borderColor: colorScheme.primary,
                    color: colorScheme.white,
                    backgroundColor: `${colorScheme.primary}05`,
                  }}
                >
                  Back
                </CustomButton>

                <CustomButton
                  variant="primary"
                  size="sm"
                  onClick={handleClose}
                  className="flex-1 font-semibold transition-all duration-300 hover:scale-105 text-sm"
                  curvature="lg"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                    color: colorScheme.black,
                  }}
                >
                  Explore Site
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}