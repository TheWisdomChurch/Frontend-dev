'use client';

import { useMemo } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { Calendar, MapPin, Clock, Sparkles } from 'lucide-react';
import { BaseModal } from '@/shared/ui/modals/Base';

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
      <div className="space-y-6 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:space-y-0">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-primary)]/20 bg-black/25 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            Conference Registration
          </div>

          {/* Event Image */}
          {safeEvent.image && (
            <div className="relative h-44 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.04] sm:h-52">
              <Image
                src={safeEvent.image}
                alt={safeEvent.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 620px"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            </div>
          )}

          {/* Description & Details Card */}
          <div className="space-y-4 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <p className="text-sm italic leading-7 text-white/78">
              {safeEvent.description}
            </p>

            {/* Meta information */}
            <div className="flex flex-wrap gap-4">
              {dateRange && (
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-[var(--app-primary)]/20 bg-black/25 text-[var(--app-primary)]">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    {dateRange}
                  </span>
                </div>
              )}

              {safeEvent.time && (
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-[var(--app-primary)]/20 bg-black/25 text-[var(--app-primary)]">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    {safeEvent.time}
                  </span>
                </div>
              )}

              {safeEvent.location && (
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-[var(--app-primary)]/20 bg-black/25 text-[var(--app-primary)]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    {safeEvent.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Registration) */}
        <div className="space-y-4 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          <div className="space-y-2">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/45">
              Secure Your Spot
            </p>
            <h3 className="text-xl font-semibold tracking-tight text-white">
              {safeEvent.headline}
            </h3>
            <p className="text-sm leading-7 text-white/78">
              If you have not registered for WPC 2026, secure your seat now.
            </p>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={handleRegister}
            disabled={!registerUrl}
            className="w-full rounded-2xl bg-[var(--app-primary)] py-3.5 text-lg font-bold text-black shadow-lg shadow-[var(--app-primary)]/20 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {safeEvent.ctaLabel}
          </button>

          {/* Note & Remind Later */}
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>{safeEvent.note}</span>
            {onRemindLater && (
              <button
                type="button"
                onClick={onRemindLater}
                className="underline-offset-4 hover:text-white hover:underline"
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
