'use client';

import { useCallback } from 'react';
import { EventRegistrationModal } from '@/components/modal/FormModal';
import type { WisdomPowerAdModalProps } from '@/lib/types';
import { EventBannerDesktop } from '@/components/assets';

const EVENT = {
  id: 'conference-2026',
  title: 'Wisdom Power Conference 2026',
  description:
    'Three days of powerful teachings, worship, and spiritual encounters.',
  image_url: EventBannerDesktop.src,
  start_date: '2026-03-20',
  end_date: '2026-03-22',
  time: '6:00 PM Daily',
  location: 'Honor Gardens opposite Dominion City, Alasia Bus stop',
  event_type: 'conference' as const,
};

export default function WisdomPowerAdModal({
  isOpen,
  onClose,
}: WisdomPowerAdModalProps) {
  const handleSubmit = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 900));
  }, []);

  return (
    <EventRegistrationModal
      event={EVENT}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      headline="Have you registered for Wisdom Power Conference 2026?"
      lead="Secure your seat for three days of worship, impartation, and encounters that shift your year. Registration takes less than two minutes."
      eyebrow="Conference registration"
      highlight="Limited seats"
      ctaNote="New here? This is the easiest way to save your spot."
    />
  );
}
