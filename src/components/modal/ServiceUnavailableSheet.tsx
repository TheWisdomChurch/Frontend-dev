'use client';

import { useMemo } from 'react';
import { Sparkles, Clock, X } from 'lucide-react';
import { BaseModal } from '@/components/modal/Base';
import { useTheme } from '@/components/contexts/ThemeContext';
import CustomButton from '@/components/utils/buttons/CustomButton';
import type { ServiceUnavailableSheetProps } from '@/lib/types';

export default function ServiceUnavailableSheet({
  isOpen,
  onClose,
  title = 'Service not available yet',
  message = 'We are polishing this experience for production. Please check back soon.',
  actionLabel = 'Got it',
}: ServiceUnavailableSheetProps) {
  const { colorScheme } = useTheme();

  const accent = useMemo(
    () => colorScheme.primary || '#facc15',
    [colorScheme.primary]
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      showHandle
      showCloseButton={false}
      forceBottomSheet
      maxWidth="max-w-xl"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 via-black/80 to-black/90 p-6 text-white">
        <div className="absolute -top-24 right-0 h-48 w-48 rounded-full blur-3xl opacity-30"
          style={{ background: accent }}
        />
        <div className="absolute -bottom-24 left-0 h-40 w-40 rounded-full blur-3xl opacity-20"
          style={{ background: '#ffffff' }}
        />

        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase">
            <Sparkles className="h-3.5 w-3.5" style={{ color: accent }} />
            Heads up
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 hover:text-white transition"
            aria-label="Close modal"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-white/60">
          <Clock className="h-4 w-4" />
          <span>We will reopen this shortly. Thanks for your patience.</span>
        </div>

        <div className="mt-6">
          <CustomButton
            variant="primary"
            size="sm"
            curvature="full"
            className="w-full text-black font-semibold py-3"
            style={{ background: accent }}
            onClick={onClose}
          >
            {actionLabel}
          </CustomButton>
        </div>
      </div>
    </BaseModal>
  );
}
