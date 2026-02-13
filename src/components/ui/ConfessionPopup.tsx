'use client';

import Image from 'next/image';
import { ArrowLeft, BookOpen, Church, HeartHandshake, Sparkles } from 'lucide-react';
import { BaseModal } from '@/components/modal/Base';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { BaseText, BodySM, Caption, H3 } from '@/components/text';
import { PlayfairText } from '@/components/text/FontText';
import { useTheme } from '@/components/contexts/ThemeContext';
import { confessionContent } from '@/lib/data';
import { WisdomeHouseLogo } from '@/components/assets';
import { useWelcomeModal } from '@/components/utils/hooks/Useconfession';

interface WelcomeModalProps {
  onClose: () => void;
  delay?: number;
}

export default function ConfessionPopup({ onClose, delay = 2400 }: WelcomeModalProps) {
  const { colorScheme } = useTheme();
  const {
    isVisible,
    currentStep,
    mounted,
    handleClose,
    showConfession,
    showWelcome,
  } = useWelcomeModal({ delay, onClose });

  if (!mounted || !isVisible) return null;

  return (
    <BaseModal
      isOpen={isVisible}
      onClose={handleClose}
      title={currentStep === 'welcome' ? 'Welcome Home' : 'Our Confession'}
      subtitle={
        currentStep === 'welcome'
          ? 'A short stop before you continue exploring.'
          : 'Speak this over your week with bold faith.'
      }
      maxWidth="max-w-2xl"
      forceBottomSheet
    >
      {currentStep === 'welcome' ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full border border-white/15 bg-black/40 p-3">
                <Image
                  src={WisdomeHouseLogo}
                  alt="The Wisdom Church"
                  width={42}
                  height={42}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <Caption className="uppercase tracking-[0.15em] text-white/60">
                  The Wisdom Church
                </Caption>
                <H3 className="text-white">We are Equipped and Empowered</H3>
              </div>
            </div>
            <BodySM className="leading-relaxed text-white/80">
              You are in a place of worship, truth, and transformation. Before you continue,
              take a moment with our confession and align your words with faith.
            </BodySM>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Church, label: 'Worship' },
              { icon: HeartHandshake, label: 'Community' },
              { icon: Sparkles, label: 'Growth' },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-4 text-center"
              >
                <div
                  className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: `${colorScheme.primary}24` }}
                >
                  <item.icon className="h-4 w-4" style={{ color: colorScheme.primary }} />
                </div>
                <Caption className="text-white/80">{item.label}</Caption>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CustomButton
              variant="outline"
              size="sm"
              curvature="full"
              onClick={showConfession}
              leftIcon={<BookOpen className="h-4 w-4" />}
              className="h-11 w-full text-sm font-medium"
              style={{
                borderColor: `${colorScheme.primary}66`,
                color: '#FFFFFF',
                backgroundColor: `${colorScheme.primary}08`,
              }}
            >
              Read Confession
            </CustomButton>
            <CustomButton
              variant="primary"
              size="sm"
              curvature="full"
              onClick={handleClose}
              className="h-11 w-full text-sm font-medium"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                color: colorScheme.black,
              }}
            >
              Continue
            </CustomButton>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/15 bg-black/35 p-5">
            <PlayfairText
              as="p"
              className="text-center text-sm italic leading-relaxed sm:text-base"
              style={{ color: '#ffffff' }}
              weight="regular"
            >
              We begin to prosper, we continue to prosper, until we become very prosperous.
            </PlayfairText>
          </div>

          <div className="max-h-[42vh] space-y-3 overflow-y-auto rounded-2xl border border-white/12 bg-white/[0.03] p-4">
            {confessionContent
              .split('\n\n')
              .map(paragraph => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, index) => (
                <BodySM key={`${paragraph.slice(0, 20)}-${index}`} className="leading-relaxed text-white/82">
                  {paragraph}
                </BodySM>
              ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CustomButton
              variant="outline"
              size="sm"
              curvature="full"
              onClick={showWelcome}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="h-11 w-full text-sm font-medium"
              style={{
                borderColor: `${colorScheme.primary}66`,
                color: '#FFFFFF',
                backgroundColor: `${colorScheme.primary}08`,
              }}
            >
              Back
            </CustomButton>
            <CustomButton
              variant="primary"
              size="sm"
              curvature="full"
              onClick={handleClose}
              className="h-11 w-full text-sm font-medium"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                color: colorScheme.black,
              }}
            >
              I Believe It
            </CustomButton>
          </div>

          <BaseText className="text-center text-xs text-white/55">
            This confession appears periodically and can always be revisited.
          </BaseText>
        </div>
      )}
    </BaseModal>
  );
}

