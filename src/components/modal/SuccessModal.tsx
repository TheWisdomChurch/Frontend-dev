'use client';

import { BaseModal } from './Base';
import { CheckCircle } from 'lucide-react';
import type { SuccessModalProps } from '@/lib/types';

export const SuccessModal = ({
  isOpen,
  onClose,
  title = 'Submission successful',
  message = 'Your information has been received. Thank you!',
  actionLabel = 'Done',
}: SuccessModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle className="h-8 w-8 text-emerald-400" />
        </div>
        <p className="text-sm text-white/80 leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg bg-emerald-500/90 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-500"
        >
          {actionLabel}
        </button>
      </div>
    </BaseModal>
  );
};
