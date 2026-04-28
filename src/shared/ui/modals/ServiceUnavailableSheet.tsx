'use client';

import { Clock, Sparkles, X } from 'lucide-react';
import { BaseModal, modalStyles } from '@/shared/ui/modals/Base';
import type { ServiceUnavailableSheetProps } from '@/lib/types';

export default function ServiceUnavailableSheet({
  isOpen,
  onClose,
  title = 'Service not available yet',
  message = 'We are polishing this experience for production. Please check back soon.',
  actionLabel = 'Got it',
}: ServiceUnavailableSheetProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      showHandle
      showCloseButton={false}
      forceBottomSheet
      maxWidth="max-w-lg"
    >
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#f7de12]/15 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/75">
            <Sparkles className="h-3.5 w-3.5 text-[#f7de12]" />
            Heads up
          </div>

          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/60 transition hover:text-white"
            aria-label="Close modal"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mt-5">
          <h3 className="text-balance text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-white/65">{message}</p>
        </div>

        <div className="relative mt-5 flex gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white/58">
          <Clock className="mt-0.5 h-4 w-4 flex-none text-[#f7de12]" />
          <span>We will reopen this shortly. Thanks for your patience.</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`${modalStyles.primaryButton} mt-6`}
        >
          {actionLabel}
        </button>
      </div>
    </BaseModal>
  );
}
