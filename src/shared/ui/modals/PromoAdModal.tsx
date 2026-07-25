'use client';

import { useMemo } from 'react';
import { type StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Media } from '@/shared/ui/Media';
import { BaseModal } from '@/shared/ui/modals/Base';
import { H3, BodySM, Caption } from '@/shared/text';
import { Button } from '@/shared/utils/buttons';

const MotionButton = motion(Button);

export interface PromoAdModalMetaItem {
  icon: LucideIcon;
  label: string;
}

export interface PromoAdModalProps {
  open: boolean;
  onClose: () => void;
  onSecondaryAction?: () => void;
  badgeLabel: string;
  badgeIcon?: LucideIcon;
  liveIndicator?: boolean;
  title: string;
  headline: string;
  description: string;
  image?: StaticImageData | string;
  iconFallback?: LucideIcon;
  meta?: PromoAdModalMetaItem[];
  primaryCtaLabel: string;
  onPrimaryAction: () => void;
  primaryCtaDisabled?: boolean;
  secondaryCtaLabel?: string;
  note?: string;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
};

export default function PromoAdModal({
  open,
  onClose,
  onSecondaryAction,
  badgeLabel,
  badgeIcon: BadgeIcon = Sparkles,
  liveIndicator = false,
  title,
  headline,
  description,
  image,
  iconFallback: IconFallback,
  meta = [],
  primaryCtaLabel,
  onPrimaryAction,
  primaryCtaDisabled = false,
  secondaryCtaLabel,
  note,
}: PromoAdModalProps) {
  const imageSrc = useMemo(() => image, [image]);

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      title={title}
      maxWidth="max-w-4xl"
      forceBottomSheet
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:space-y-0"
      >
        {/* Left Column */}
        <div className="space-y-4">
          <motion.div
            variants={itemVariants}
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[var(--app-primary)]/20 bg-black/25 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]"
          >
            <BadgeIcon className="h-3.5 w-3.5" />
            {badgeLabel}
            {liveIndicator && (
              <span className="relative ml-0.5 flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--app-primary)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--app-primary)]" />
              </span>
            )}
          </motion.div>

          {/* Hero visual — real image or icon-forward gradient block */}
          <motion.div
            variants={itemVariants}
            className="relative h-44 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.04] sm:h-52"
          >
            {/* Ambient glow */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[var(--app-primary)]/25 blur-3xl"
              animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.12, 1] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {imageSrc ? (
              <Media
                src={imageSrc}
                alt={title}
                frameClassName="bg-transparent"
                sizes="(max-width: 1024px) 100vw, 620px"
                priority
              />
            ) : IconFallback ? (
              <div className="relative flex h-full w-full items-center justify-center">
                <IconFallback className="h-16 w-16 text-[var(--app-primary)]/70" />
              </div>
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </motion.div>

          {/* Description & Details Card */}
          <motion.div
            variants={itemVariants}
            className="space-y-4 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6"
          >
            <BodySM className="italic text-white/78">{description}</BodySM>

            {meta.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {meta.map(({ icon: MetaIcon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-[var(--app-primary)]/20 bg-black/25 text-[var(--app-primary)]">
                      <MetaIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-white/80">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column (CTA) */}
        <motion.div
          variants={itemVariants}
          className="space-y-4 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6"
        >
          <div className="space-y-2">
            <Caption className="text-white/45">{badgeLabel}</Caption>
            <H3 className="text-white">{headline}</H3>
          </div>

          <MotionButton
            variant="primary"
            onClick={onPrimaryAction}
            disabled={primaryCtaDisabled}
            whileHover={primaryCtaDisabled ? undefined : { scale: 1.015 }}
            whileTap={primaryCtaDisabled ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className="w-full py-3.5 text-lg font-bold"
          >
            {primaryCtaLabel}
          </MotionButton>

          {(note || secondaryCtaLabel) && (
            <div className="flex items-center justify-between text-xs text-white/40">
              {note && <span>{note}</span>}
              {secondaryCtaLabel && onSecondaryAction && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={onSecondaryAction}
                  className="text-xs text-white/40 underline-offset-4 hover:text-white hover:underline"
                >
                  {secondaryCtaLabel}
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </BaseModal>
  );
}
