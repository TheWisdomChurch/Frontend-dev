'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { IMAGE_QUALITY } from '@/shared/constants';
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';

import { BaseModal } from '@/shared/ui/modals/Base';
import { confessionContent } from '@/lib/data';
import { WisdomeHouseLogo } from '@/shared/assets';

type ModalStep = 'welcome' | 'confession' | 'complete';

interface ConfessionPopupProps {
  open: boolean;
  onClose: () => void;
  content?: {
    welcomeTitle?: string;
    welcomeMessage?: string;
    confessionText?: string;
    motto?: string;
  };
}

const stepVariants = {
  hidden: { opacity: 0, x: 16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const paragraphVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

function StepDots({ step }: { step: ModalStep }) {
  const index = step === 'confession' ? 1 : 0;
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {[0, 1].map(i => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === index ? 'w-6 bg-[var(--app-primary)]' : 'w-1.5 bg-white/18'
          }`}
        />
      ))}
    </div>
  );
}

export default function ConfessionPopup({
  open,
  onClose,
  content,
}: ConfessionPopupProps) {
  const [currentStep, setCurrentStep] = useState<ModalStep>('welcome');

  // Reset to the welcome step whenever the modal re-opens (adjusting state
  // during render, per React's guidance, rather than in an effect).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setCurrentStep('welcome');
  }

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

  const handleBelieve = () => {
    setCurrentStep('complete');
    window.setTimeout(onClose, 900);
  };

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      maxWidth="max-w-lg"
      showCloseButton={false}
      forceBottomSheet
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          {currentStep === 'complete' ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex flex-col items-center gap-4 py-10 text-center"
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 340, damping: 18 }}
                className="grid h-16 w-16 place-items-center rounded-full border border-[var(--app-primary)]/30 bg-[var(--app-primary)]/10 text-[var(--app-primary)]"
              >
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
              <p className="font-headline text-heading-sm font-normal text-white">
                Confession made. Amen.
              </p>
            </motion.div>
          ) : currentStep === 'welcome' ? (
            <motion.div
              key="welcome"
              variants={stepVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative space-y-6 pb-1"
            >
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
                  <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                    The Wisdom Church
                  </p>
                  <p className="font-ui text-caption text-white/35">
                    Lagos · Nigeria
                  </p>
                </div>

                {/* Close */}
                <button
                  type="button"
                  onClick={onClose}
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
                <StepDots step={currentStep} />
                <h3 className="mt-3 font-headline text-heading-md font-normal leading-[1.15] text-white">
                  {welcomeTitle}
                </h3>
                <p className="mt-4 font-ui text-body-sm leading-[1.9] text-white/68">
                  {welcomeMessage}
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('confession')}
                  className="inline-flex h-11 items-center justify-center gap-2 border border-white/12 bg-white/[0.04] font-ui text-label font-semibold text-white/65 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
                >
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  Read Confession
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 items-center justify-center bg-[var(--app-primary)] font-ui text-label font-bold uppercase tracking-[0.08em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confession"
              variants={stepVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative space-y-5 pb-1"
            >
              <StepDots step={currentStep} />

              {/* Motto with decorative quote mark */}
              <blockquote className="relative pl-4">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-1 -top-5 font-headline text-display-sm leading-none text-[var(--app-primary)]/18"
                >
                  &ldquo;
                </span>
                <span
                  className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[2px]"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ background: 'var(--app-primary)' }}
                />
                <p className="relative font-headline text-heading-sm font-normal italic leading-[1.7] text-white/85">
                  {motto}
                </p>
              </blockquote>

              {/* Confession text */}
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="max-h-[44svh] space-y-4 overflow-y-auto border border-white/[0.07] bg-black/25 p-5"
              >
                {confessionParagraphs.map((paragraph, index) => (
                  <motion.p
                    key={`${paragraph.slice(0, 24)}-${index}`}
                    variants={paragraphVariants}
                    className="font-ui text-body-sm leading-[1.9] text-white/75"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('welcome')}
                  className="inline-flex h-11 items-center justify-center gap-2 border border-white/12 bg-white/[0.04] font-ui text-label font-semibold text-white/65 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
                >
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleBelieve}
                  className="inline-flex h-11 items-center justify-center bg-[var(--app-primary)] font-ui text-label font-bold uppercase tracking-[0.08em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
                >
                  I Believe It
                </button>
              </div>

              <p className="text-center font-ui text-eyebrow uppercase tracking-[0.16em] text-white/45">
                This confession appears periodically — revisit any time.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseModal>
  );
}
