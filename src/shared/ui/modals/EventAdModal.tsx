'use client';

import { useMemo } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { Calendar, MapPin, Clock, Sparkles } from 'lucide-react';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { BaseModal } from '@/shared/ui/modals/Base';
import { Button } from '@/shared/utils/buttons';
import { BodySM, BodyMD } from '@/shared/text';

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

const FALLBACK_PRIMARY = '#F7DE12';
const FALLBACK_PRIMARY_DARK = '#C7A600';

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
  const theme = useTheme();
  const colorScheme = theme?.colorScheme;
  const primary = colorScheme?.primary || FALLBACK_PRIMARY;
  const primaryDark = colorScheme?.primaryDark || FALLBACK_PRIMARY_DARK;

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

  const handleRegister = () => {
    if (!registerUrl) return;
    window.location.assign(registerUrl);
  };

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      title={safeEvent.title}
      maxWidth="max-w-4xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
            <Sparkles className="h-3.5 w-3.5" style={{ color: primary }} />
            Conference Registration
          </div>

          {safeEvent.image && (
            <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10 sm:h-52">
              <Image
                src={safeEvent.image}
                alt={safeEvent.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 620px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            </div>
          )}

          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <BodySM className="leading-relaxed text-white/75">
              {safeEvent.description}
            </BodySM>

            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              {dateRange && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" style={{ color: primary }} />
                  <span>{dateRange}</span>
                </div>
              )}

              {safeEvent.time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: primary }} />
                  <span>{safeEvent.time}</span>
                </div>
              )}

              {safeEvent.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: primary }} />
                  <span>{safeEvent.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 sm:p-6">
          <div className="space-y-2">
            <BodyMD className="font-semibold text-white">
              {safeEvent.headline}
            </BodyMD>
            <BodySM className="text-white/70">
              If you have not registered for WPC 2026, secure your seat now.
            </BodySM>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            curvature="lg"
            onClick={handleRegister}
            className="w-full"
            style={{
              background: `linear-gradient(135deg, ${primary}, ${primaryDark})`,
              color: '#FFFFFF',
            }}
          >
            {safeEvent.ctaLabel}
          </Button>

          <div className="flex items-center justify-between text-[11px] text-white/50">
            <span>{safeEvent.note}</span>
            {onRemindLater && (
              <button
                type="button"
                onClick={onRemindLater}
                className="text-white/60 underline-offset-4 hover:text-white hover:underline"
              >
                Remind me later
              </button>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
