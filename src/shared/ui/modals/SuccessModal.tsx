'use client';

import { CheckCircle2 } from 'lucide-react';
import { BaseModal, modalStyles } from './Base';
import type { SuccessModalProps } from '@/lib/types';

export function SuccessModal({
  isOpen,
  onClose,
  title = 'Submission successful',
  message = 'Your information has been received. Thank you!',
  actionLabel = 'Done',
}: SuccessModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      showCloseButton={false}
      forceBottomSheet
    >
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-7 text-white/65">{message}</p>

        <button
          type="button"
          onClick={onClose}
          className={`${modalStyles.primaryButton} mt-7`}
        >
          {actionLabel}
        </button>
      </div>
    </BaseModal>
  );
}
