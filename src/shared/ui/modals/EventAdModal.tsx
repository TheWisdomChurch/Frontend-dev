'use client';

import { useMemo } from 'react';
import { type StaticImageData } from 'next/image';
import { Calendar, Clock, MapPin } from 'lucide-react';
import PromoAdModal, {
  type PromoAdModalMetaItem,
} from '@/shared/ui/modals/PromoAdModal';

type EventAdConfig = {
  id: string;
  title: string;
  headline: string;
  description: string;
  startAt?: string;
  endAt?: string;
  time?: string;
  location?: string;
  image?: StaticImageData | string;
  registerUrl: string;
  ctaLabel?: string;
  note?: string;
};

type Props = {
  event: EventAdConfig;
  open: boolean;
  onClose: () => void;
  onRemindLater?: () => void;
};

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatDateRange = (startAt?: string, endAt?: string) => {
  if (!startAt) return '';
  if (!endAt) return formatDate(startAt);

  const start = new Date(startAt);
  const end = new Date(endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return formatDate(startAt);
  }

  const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
  const startDay = start.toLocaleDateString('en-US', { day: 'numeric' });
  const endDay = end.toLocaleDateString('en-US', { day: 'numeric' });
  const year = end.toLocaleDateString('en-US', { year: 'numeric' });

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
};

export default function EventAdModal({
  event,
  open,
  onClose,
  onRemindLater,
}: Props) {
  const safeEvent = {
    title: event?.title || 'Special Event',
    headline: event?.headline || 'Register now',
    description: event?.description || 'Join us for this special event.',
    startAt: event?.startAt,
    endAt: event?.endAt,
    time: event?.time,
    location: event?.location,
    image: event?.image,
    registerUrl: event?.registerUrl || '',
    ctaLabel: event?.ctaLabel || 'Register now',
    note: event?.note || 'Registration takes less than 2 minutes.',
  };

  const dateRange = useMemo(
    () => formatDateRange(safeEvent.startAt, safeEvent.endAt),
    [safeEvent.startAt, safeEvent.endAt]
  );

  const registerUrl = useMemo(() => {
    if (!safeEvent.registerUrl) return '';

    if (typeof window === 'undefined') {
      return safeEvent.registerUrl;
    }

    try {
      const url = new URL(safeEvent.registerUrl);
      url.searchParams.set('redirect', window.location.href);
      return url.toString();
    } catch {
      return safeEvent.registerUrl;
    }
  }, [safeEvent.registerUrl]);

  const meta = useMemo(() => {
    const items: PromoAdModalMetaItem[] = [];
    if (dateRange) items.push({ icon: Calendar, label: dateRange });
    if (safeEvent.time) items.push({ icon: Clock, label: safeEvent.time });
    if (safeEvent.location)
      items.push({ icon: MapPin, label: safeEvent.location });
    return items;
  }, [dateRange, safeEvent.time, safeEvent.location]);

  const handleRegister = () => {
    if (!registerUrl) return;
    window.location.assign(registerUrl);
  };

  return (
    <PromoAdModal
      open={open}
      onClose={onClose}
      onSecondaryAction={onRemindLater}
      badgeLabel="Conference Registration"
      liveIndicator
      title={safeEvent.title}
      headline={safeEvent.headline}
      description={safeEvent.description}
      image={safeEvent.image}
      meta={meta}
      primaryCtaLabel={safeEvent.ctaLabel}
      onPrimaryAction={handleRegister}
      primaryCtaDisabled={!registerUrl}
      secondaryCtaLabel={onRemindLater ? 'Remind me later' : undefined}
      note={safeEvent.note}
    />
  );
}
