'use client';

import { useMemo } from 'react';
import { type StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Media } from '@/shared/ui/Media';
import { BaseModal } from '@/shared/ui/modals/Base';
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
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
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
  const showEyebrow = title && title.trim() !== headline.trim();

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      maxWidth="max-w-md"
      forceBottomSheet
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 border border-[var(--app-primary)]/25 bg-[var(--app-primary)]/8 px-3 py-1.5 font-ui text-eyebrow font-bold uppercase tracking-[0.16em] text-[var(--app-primary)]"
        >
          <BadgeIcon className="h-3.5 w-3.5" />
          {badgeLabel}
          {liveIndicator && (
            <span className="relative ml-0.5 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--app-primary)] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--app-primary)]" />
            </span>
          )}
        </motion.div>

        {/* Visual — real image or icon-forward block */}
        {(imageSrc || IconFallback) && (
          <motion.div
            variants={itemVariants}
            className="relative aspect-[16/9] overflow-hidden border border-white/10 bg-white/[0.04]"
          >
            {imageSrc ? (
              <Media
                src={imageSrc}
                alt={title}
                frameClassName="bg-transparent"
                sizes="(max-width: 480px) 100vw, 420px"
              />
            ) : IconFallback ? (
              <div className="flex h-full w-full items-center justify-center">
                <IconFallback className="h-12 w-12 text-[var(--app-primary)]/70" />
              </div>
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        )}

        {/* Heading */}
        <motion.div variants={itemVariants}>
          {showEyebrow && (
            <p className="font-ui text-caption font-semibold uppercase tracking-[0.12em] text-white/40">
              {title}
            </p>
          )}
          <h3 className="mt-1.5 font-headline text-heading-sm font-normal leading-snug text-white">
            {headline}
          </h3>
          <p className="mt-2.5 font-ui text-body-sm leading-[1.75] text-white/62">
            {description}
          </p>
        </motion.div>

        {/* Meta */}
        {meta.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-x-5 gap-y-2.5 border-t border-white/[0.07] pt-4"
          >
            {meta.map(({ icon: MetaIcon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 font-ui text-label text-white/60"
              >
                <MetaIcon className="h-3.5 w-3.5 flex-none text-[var(--app-primary)]" />
                {label}
              </div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div variants={itemVariants} className="space-y-3 pt-1">
          <MotionButton
            variant="primary"
            onClick={onPrimaryAction}
            disabled={primaryCtaDisabled}
            whileHover={primaryCtaDisabled ? undefined : { scale: 1.01 }}
            whileTap={primaryCtaDisabled ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className="h-12 w-full font-ui text-body-sm font-bold"
          >
            {primaryCtaLabel}
          </MotionButton>

          {(note || secondaryCtaLabel) && (
            <div className="flex items-center justify-between gap-3 font-ui text-label text-white/40">
              {note && <span>{note}</span>}
              {secondaryCtaLabel && onSecondaryAction && (
                <button
                  type="button"
                  onClick={onSecondaryAction}
                  className="font-semibold text-white/45 underline-offset-4 transition hover:text-white hover:underline"
                >
                  {secondaryCtaLabel}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </BaseModal>
  );
}
