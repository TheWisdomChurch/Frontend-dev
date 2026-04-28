'use client';

import Image from 'next/image';
import {
  ArrowLeft,
  BookOpen,
  Church,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';

import { BaseModal, modalStyles } from '@/shared/ui/modals/Base';
import { PlayfairText } from '@/shared/text/FontText';
import { BodyMD, Caption } from '@/shared/text';
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

export default function ConfessionPopup({
  onClose,
  delay = 2400,
  content,
}: WelcomeModalProps) {
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
      forceBottomSheet
    >
      {currentStep === 'welcome' ? (
        <div className="space-y-5">
          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-black/35">
                <Image
                  src={WisdomeHouseLogo}
                  alt="The Wisdom Church"
                  width={42}
                  height={42}
                  className="object-contain"
                />
              </div>

              <div className="min-w-0">
                <Caption className="uppercase tracking-[0.18em] text-[#f7de12]">
                  The Wisdom Church
                </Caption>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  We are Equipped and Empowered
                </h3>
              </div>
            </div>

            <BodyMD className="text-white/72">{welcomeMessage}</BodyMD>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Church, label: 'Worship' },
              { icon: HeartHandshake, label: 'Community' },
              { icon: Sparkles, label: 'Growth' },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-center"
              >
                <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-[#f7de12]/10">
                  <item.icon className="h-4 w-4 text-[#f7de12]" />
                </div>
                <Caption className="text-white/75">{item.label}</Caption>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={showConfession}
              className={modalStyles.ghostButton}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Read Confession
            </button>

            <button
              type="button"
              onClick={handleClose}
              className={modalStyles.primaryButton}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-[1.35rem] border border-white/10 bg-[#f7de12]/10 p-5">
            <PlayfairText
              as="p"
              className="text-center text-base italic leading-8 text-white"
              weight="regular"
            >
              {motto}
            </PlayfairText>
          </div>

          <div className="max-h-[46svh] space-y-4 overflow-y-auto rounded-[1.35rem] border border-white/10 bg-black/25 p-5">
            {fullConfessionText
              .split('\n\n')
              .map(paragraph => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, index) => (
                <BodyMD
                  key={`${paragraph.slice(0, 24)}-${index}`}
                  className="text-white/75"
                >
                  {paragraph}
                </BodyMD>
              ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={showWelcome}
              className={modalStyles.ghostButton}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleClose}
              className={modalStyles.primaryButton}
            >
              I Believe It
            </button>
          </div>

          <p className="text-center text-xs leading-5 text-white/45">
            This confession appears periodically and can always be revisited.
          </p>
        </div>
      )}
    </BaseModal>
  );
}
