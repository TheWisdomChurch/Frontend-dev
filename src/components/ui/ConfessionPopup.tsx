'use client';

import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, Church, Hand, TrendingUp, Sparkles, ArrowLeft } from 'lucide-react';
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, rgba(247,222,18,0.12), transparent 40%), rgba(0,0,0,0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative rounded-3xl w-full max-w-2xl mx-auto overflow-hidden shadow-2xl border border-white/10"
        style={{
          background: 'linear-gradient(145deg, rgba(6,6,6,0.9), rgba(0,0,0,0.7))',
          maxHeight: '85vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 z-20 bg-white/10">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: currentStep === 'welcome' ? '50%' : '100%',
              background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.primaryLight})`,
            }}
          />
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20 bg-white/5 text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          ref={contentRef}
          className="p-6 sm:p-8 overflow-y-auto"
          style={{ maxHeight: 'calc(85vh - 1rem)' }}
        >
          {currentStep === 'welcome' && (
            <div className="space-y-6">
              <div className="text-center space-y-5">
                <div className="relative w-18 h-18 mx-auto rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
                  <Image
                    src={WisdomeHouseLogo}
                    alt="The Wisdom House Church"
                    width={56}
                    height={56}
                    className="object-contain"
                  />
                  <Sparkles className="absolute -right-4 -top-3 h-8 w-8 text-amber-300/60" />
                </div>

                <div>
                  <H2
                    as="h2"
                    className="text-3xl sm:text-4xl font-black mb-3 leading-tight text-white"
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
                      The Wisdom House
                    </BaseText>
                  </H2>
                  <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto">
                    You are stepping into a house of faith, worship, and
                    miracles. Take a moment to speak life over your week.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Church, title: 'Worship' },
                  { icon: Hand, title: 'Pray' },
                  { icon: TrendingUp, title: 'Grow' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderColor: `${colorScheme.primary}25`,
                      boxShadow: `0 10px 30px ${colorScheme.opacity.primary15}`,
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-2"
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

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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

          {currentStep === 'confession' && (
            <div className="space-y-6">
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

              <div
                className="relative bg-black/50 border border-white/15 rounded-2xl p-5 sm:p-6 text-white text-sm sm:text-base leading-relaxed space-y-3 max-h-[320px] overflow-y-auto shadow-inner"
              >
                <div className="absolute -left-2 -top-2 h-10 w-10 rounded-full bg-white/5 blur-xl" />
                <div className="absolute -right-4 -bottom-4 h-12 w-12 rounded-full bg-amber-400/10 blur-2xl" />
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
