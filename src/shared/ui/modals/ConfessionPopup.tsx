'use client';

import Image from 'next/image';
import {
  ArrowLeft,
  BookOpen,
  Church,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import { BaseModal } from '@/shared/ui/modals/Base';
import CustomButton from '@/shared/utils/buttons/CustomButton';
import { BaseText, BodyMD, Caption, H3 } from '@/shared/text';
import { PlayfairText } from '@/shared/text/FontText';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { confessionContent } from '@/lib/data';
import { WisdomeHouseLogo } from '@/shared/assets';
import { useWelcomeModal } from '@/shared/utils/hooks/Useconfession';

interface WelcomeModalProps {
  onClose: () => void;
  delay?: number;
  content?: {
    welcomeTitle?: string;
    welcomeMessage?: string;
    confessionText?: string;
    motto?: string;
  };
}

const FALLBACK_PRIMARY = '#F7DE12';
const FALLBACK_PRIMARY_DARK = '#C7A600';

export default function ConfessionPopup({
  onClose,
  delay = 2400,
  content,
}: WelcomeModalProps) {
  const theme = useTheme();
  const colorScheme = theme?.colorScheme;
  const primary = colorScheme?.primary || FALLBACK_PRIMARY;
  const primaryDark = colorScheme?.primaryDark || FALLBACK_PRIMARY_DARK;

  const {
    isVisible,
    currentStep,
    mounted,
    handleClose,
    showConfession,
    showWelcome,
  } = useWelcomeModal({ delay, onClose });

  if (!mounted || !isVisible) return null;

  const welcomeTitle = content?.welcomeTitle || 'Welcome Home';
  const welcomeMessage =
    content?.welcomeMessage ||
    'You are in a place of worship, truth, and transformation. Before you continue, take a moment with our confession and align your words with faith.';
  const motto =
    content?.motto ||
    'We begin to prosper, we continue to prosper, until we become very prosperous.';
  const fullConfessionText = content?.confessionText || confessionContent;

  return (
    <BaseModal
      isOpen={isVisible}
      onClose={handleClose}
      title={currentStep === 'welcome' ? welcomeTitle : 'Our Confession'}
      subtitle={
        currentStep === 'welcome'
          ? 'A short stop before you continue exploring.'
          : 'Speak this over your week with bold faith.'
      }
      maxWidth="max-w-2xl"
    >
      {currentStep === 'welcome' ? (
        <div className="space-y-5 text-white">
          <div className="rounded-2xl border border-white/20 bg-black/45 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
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
            <BodyMD className="leading-relaxed text-white/90">
              {welcomeMessage}
            </BodyMD>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Church, label: 'Worship' },
              { icon: HeartHandshake, label: 'Community' },
              { icon: Sparkles, label: 'Growth' },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-4 text-center"
              >
                <div
                  className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: `${primary}24` }}
                >
                  <item.icon className="h-4 w-4" style={{ color: primary }} />
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
                borderColor: `${primary}66`,
                color: '#FFFFFF',
                backgroundColor: `${primary}08`,
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
                background: `linear-gradient(135deg, ${primary}, ${primaryDark})`,
                color: '#FFFFFF',
              }}
            >
              Continue
            </CustomButton>
          </div>
        </div>
      ) : (
        <div className="space-y-5 text-white">
          <div className="rounded-2xl border border-white/20 bg-black/55 p-5">
            <PlayfairText
              as="p"
              className="text-center text-sm italic leading-relaxed sm:text-base"
              style={{ color: '#ffffff' }}
              weight="regular"
            >
              {motto}
            </PlayfairText>
          </div>

          <div className="max-h-[44vh] space-y-3 overflow-y-auto rounded-2xl border border-white/15 bg-white/[0.06] p-4">
            {fullConfessionText
              .split('\n\n')
              .map(paragraph => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, index) => (
                <BodyMD
                  key={`${paragraph.slice(0, 20)}-${index}`}
                  className="leading-relaxed text-white/90"
                >
                  {paragraph}
                </BodyMD>
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
                borderColor: `${primary}66`,
                color: '#FFFFFF',
                backgroundColor: `${primary}08`,
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
                background: `linear-gradient(135deg, ${primary}, ${primaryDark})`,
                color: '#FFFFFF',
              }}
            >
              I Believe It
            </CustomButton>
          </div>

          <BaseText className="text-center text-xs text-white/70">
            This confession appears periodically and can always be revisited.
          </BaseText>
        </div>
      )}
    </BaseModal>
  );
}
