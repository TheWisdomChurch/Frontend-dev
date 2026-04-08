'use client';

import { useMemo } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { Calendar, MapPin, Clock, Sparkles } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { BaseModal } from '@/components/modal/Base';
import { Button } from '@/components/utils/buttons';
import { BodySM, BodyMD } from '@/components/text';

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
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return formatDate(startAt);

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
  const { colorScheme } = useTheme();
  const dateRange = useMemo(
    () => formatDateRange(event.startAt, event.endAt),
    [event.startAt, event.endAt]
  );

  const registerUrl = useMemo(() => {
    if (!event.registerUrl) return '';
    if (typeof window === 'undefined') return event.registerUrl;

    try {
      const url = new URL(event.registerUrl);
      url.searchParams.set('redirect', window.location.href);
      return url.toString();
    } catch (error) {
      return event.registerUrl;
    }
  }, [event.registerUrl]);

  const handleRegister = () => {
    if (!registerUrl) return;
    window.location.assign(registerUrl);
  };

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      title={event.title}
      maxWidth="max-w-4xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
            <Sparkles
              className="h-3.5 w-3.5"
              style={{ color: colorScheme.primary }}
            />
            Conference Registration
          </div>

          {event.image && (
            <div className="relative h-40 sm:h-52 overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 620px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <BodySM className="text-white/75 leading-relaxed">
              {event.description}
            </BodySM>

            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              {dateRange && (
                <div className="flex items-center gap-2">
                  <Calendar
                    className="h-4 w-4"
                    style={{ color: colorScheme.primary }}
                  />
                  <span>{dateRange}</span>
                </div>
              )}
              {event.time && (
                <div className="flex items-center gap-2">
                  <Clock
                    className="h-4 w-4"
                    style={{ color: colorScheme.primary }}
                  />
                  <span>{event.time}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin
                    className="h-4 w-4"
                    style={{ color: colorScheme.primary }}
                  />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 sm:p-6 space-y-4">
          <div className="space-y-2">
            <BodyMD className="text-white font-semibold">
              {event.headline}
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
              background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
              color: '#FFFFFF',
            }}
          >
            {event.ctaLabel ?? 'Register now'}
          </Button>

          <div className="flex items-center justify-between text-[11px] text-white/50">
            <span>
              {event.note ?? 'Registration takes less than 2 minutes.'}
            </span>
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
