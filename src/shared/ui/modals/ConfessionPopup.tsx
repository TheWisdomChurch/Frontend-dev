'use client';

import Image from 'next/image';
import { IMAGE_QUALITY } from '@/shared/constants';
import { ArrowLeft, BookOpen } from 'lucide-react';

import { BaseModal } from '@/shared/ui/modals/Base';
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
  delay = 10000,
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

  const confessionParagraphs = fullConfessionText
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <BaseModal
      isOpen={isVisible}
      onClose={handleClose}
      maxWidth="max-w-lg"
      showCloseButton={false}
      forceBottomSheet
    >
      {currentStep === 'welcome' ? (
        <div className="space-y-6 pb-1">
          {/* Brand row */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-black/40">
              <Image
                quality={IMAGE_QUALITY}
                src={WisdomeHouseLogo}
                alt="The Wisdom Church"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                The Wisdom Church
              </p>
              <p className="font-ui text-[0.68rem] text-white/35">
                Lagos · Nigeria
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="ml-auto grid h-8 w-8 place-items-center border border-white/10 bg-white/[0.04] text-white/40 transition hover:text-white/80"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                className="h-3.5 w-3.5"
              >
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <span className="block h-px w-full bg-white/[0.07]" />

          {/* Headline */}
          <div>
            <h3 className="font-headline text-[1.5rem] font-normal leading-[1.2] text-white">
              {welcomeTitle}
            </h3>
            <p className="mt-4 font-ui text-[0.86rem] leading-[1.9] text-white/68">
              {welcomeMessage}
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={showConfession}
              className="inline-flex h-11 items-center justify-center gap-2 border border-white/12 bg-white/[0.04] font-ui text-[0.78rem] font-semibold text-white/65 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              Read Confession
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-11 items-center justify-center bg-[var(--app-primary)] font-ui text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 pb-1">
          {/* Motto */}
          <blockquote
            className="pl-4"
            // eslint-disable-next-line no-restricted-syntax
            style={{ borderLeft: '2px solid var(--app-primary)' }}
          >
            <p className="font-headline text-[1rem] font-normal italic leading-[1.75] text-white/70">
              &ldquo;{motto}&rdquo;
            </p>
          </blockquote>

          {/* Confession text */}
          <div className="max-h-[44svh] space-y-4 overflow-y-auto border border-white/[0.07] bg-black/25 p-5">
            {confessionParagraphs.map((paragraph, index) => (
              <p
                key={`${paragraph.slice(0, 24)}-${index}`}
                className="font-ui text-[0.84rem] leading-[1.9] text-white/75"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={showWelcome}
              className="inline-flex h-11 items-center justify-center gap-2 border border-white/12 bg-white/[0.04] font-ui text-[0.78rem] font-semibold text-white/65 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              Back
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-11 items-center justify-center bg-[var(--app-primary)] font-ui text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
            >
              I Believe It
            </button>
          </div>

          <p className="text-center font-ui text-[0.62rem] uppercase tracking-[0.16em] text-white/22">
            This confession appears periodically — revisit any time.
          </p>
        </div>
      )}
    </BaseModal>
  );
}
