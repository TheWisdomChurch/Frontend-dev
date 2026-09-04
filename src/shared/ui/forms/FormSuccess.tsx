'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';

import { buttonClass } from '@/shared/ui/button';
import { BaseModal } from '@/shared/ui/modals/Modal';

/* ============================================================================
   FormSuccess — the confirmation sheet shown after a public form is submitted.
============================================================================ */

export interface FormSuccessProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  message: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function FormSuccess({
  open,
  onClose,
  title,
  subtitle,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: FormSuccessProps) {
  const reduceMotion = useReducedMotion();

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      tone="light"
      maxWidth="max-w-md"
      showCloseButton={false}
      forceBottomSheet
      ariaLabel={title}
    >
      <div className="text-center">
        <motion.div
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color-mix(in_srgb,var(--status-success)_14%,transparent)] text-[var(--status-success)]"
        >
          <Check className="h-8 w-8" aria-hidden="true" />
        </motion.div>

        <h2 className="mt-5 font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1.5 font-ui text-body-sm text-[var(--app-muted)]">
            {subtitle}
          </p>
        ) : null}

        <p className="mt-3 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
          {message}
        </p>

        <div className="mt-7 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onPrimary}
            className={buttonClass('primary', 'md', 'w-full')}
          >
            {primaryLabel}
          </button>
          {secondaryLabel && onSecondary ? (
            <button
              type="button"
              onClick={onSecondary}
              className={buttonClass('ghost', 'md', 'w-full')}
            >
              {secondaryLabel}
            </button>
          ) : null}
        </div>
      </div>
    </BaseModal>
  );
}
