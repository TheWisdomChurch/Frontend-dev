'use client';

import { useMemo, useRef, useState } from 'react';
import {
  Calendar,
  CalendarPlus,
  Check,
  Clock,
  Loader2,
  MapPin,
  Share2,
} from 'lucide-react';
import { addHours, format } from 'date-fns';
import toast from 'react-hot-toast';

import { BaseModal, modalStyles } from './Base';
import { Caption, BodySM } from '@/shared/text';
import { Button } from '@/shared/utils/buttons';
import type { EventDetailsModalProps } from '@/lib/types';

function parseEventTime(timeString?: string): {
  hours: number;
  minutes: number;
} {
  if (!timeString) return { hours: 9, minutes: 0 };

  const match = timeString.match(/(\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i);
  if (!match) return { hours: 9, minutes: 0 };

  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const period = match[3]?.toLowerCase();

  if (period === 'pm' && hour < 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;

  return { hours: hour, minutes: minute };
}

function sanitizeCalendarText(value?: string): string {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function formatIcsDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function safeFileName(value: string): string {
  return value
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onRegister,
  isLoading = false,
}: EventDetailsModalProps) {
  const [addedToCalendar, setAddedToCalendar] = useState(false);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const registerButtonRef = useRef<HTMLButtonElement>(null);

  const startDate = useMemo(
    () => new Date(event.start_date),
    [event.start_date]
  );

  const formattedDate = useMemo(() => {
    if (Number.isNaN(startDate.getTime())) return 'Date to be announced';

    return format(startDate, 'EEEE, MMMM dd, yyyy');
  }, [startDate]);

  const eventDateRange = useMemo(() => {
    const start = new Date(event.start_date);
    const end = event.end_date ? new Date(event.end_date) : null;

    if (Number.isNaN(start.getTime())) return 'Date to be announced';

    if (end && !Number.isNaN(end.getTime())) {
      return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
    }

    return format(start, 'MMMM dd, yyyy');
  }, [event.end_date, event.start_date]);

  const createEventDates = () => {
    const eventStart = new Date(event.start_date);
    const { hours, minutes } = parseEventTime(event.time);

    if (Number.isNaN(eventStart.getTime())) {
      const fallback = new Date();
      fallback.setHours(hours, minutes, 0, 0);

      return {
        startDate: fallback,
        endDate: addHours(fallback, 2),
      };
    }

    eventStart.setHours(hours, minutes, 0, 0);

    const eventEnd = event.end_date
      ? new Date(event.end_date)
      : addHours(eventStart, 2);

    if (event.end_date && !Number.isNaN(eventEnd.getTime())) {
      eventEnd.setHours(hours + 2, minutes, 0, 0);
      return { startDate: eventStart, endDate: eventEnd };
    }

    return {
      startDate: eventStart,
      endDate: addHours(eventStart, 2),
    };
  };

  const handleAddToCalendar = async () => {
    try {
      setIsAddingToCalendar(true);

      const { startDate: calendarStart, endDate: calendarEnd } =
        createEventDates();

      const host =
        typeof window !== 'undefined'
          ? window.location.hostname
          : 'wisdomchurch';

      const icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'PRODID:-//The Wisdom Church//Events//EN',
        'BEGIN:VEVENT',
        `UID:${sanitizeCalendarText(event.id)}@${host}`,
        `DTSTAMP:${formatIcsDate(new Date())}`,
        `DTSTART:${formatIcsDate(calendarStart)}`,
        `DTEND:${formatIcsDate(calendarEnd)}`,
        `SUMMARY:${sanitizeCalendarText(event.title)}`,
        `DESCRIPTION:${sanitizeCalendarText(event.description || 'Church Event')}`,
        `LOCATION:${sanitizeCalendarText(event.location || 'Venue to be announced')}`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        `DESCRIPTION:${sanitizeCalendarText(`Reminder: ${event.title}`)}`,
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icalContent], {
        type: 'text/calendar;charset=utf-8',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `${safeFileName(event.title || 'wisdom-event')}.ics`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      window.setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 150);

      setAddedToCalendar(true);
      toast.success('Calendar event downloaded.');
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      toast.error('Failed to create calendar event.');
    } finally {
      setIsAddingToCalendar(false);
    }
  };

  const handleShare = async () => {
    const shareText =
      `${event.title}\n📅 ${formattedDate} at ${event.time || 'Time TBA'}\n📍 ${
        event.location || 'Venue TBA'
      }\n\n${event.description || ''}`.trim();

    try {
      setIsSharing(true);

      const shareData = {
        title: event.title,
        text: shareText,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      };

      if (
        typeof navigator !== 'undefined' &&
        navigator.share &&
        navigator.canShare?.(shareData)
      ) {
        await navigator.share(shareData);
        toast.success('Event shared.');
        return;
      }

      await navigator.clipboard.writeText(shareText);
      toast.success('Event details copied.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        toast.error('Unable to share event.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleRegister = async () => {
    if (!onRegister) return;

    try {
      setIsRegistering(true);
      await onRegister();
    } catch {
      toast.error('Registration failed.');
    } finally {
      setIsRegistering(false);
    }
  };

  const disabled =
    isLoading || isAddingToCalendar || isSharing || isRegistering;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      subtitle={event.type}
      maxWidth="max-w-2xl"
      isLoading={isLoading}
      loadingText="Loading event..."
      preventClose={isLoading}
      forceBottomSheet
      initialFocusRef={
        onRegister
          ? (registerButtonRef as React.RefObject<HTMLElement>)
          : undefined
      }
    >
      <div className="space-y-5">
        {event.image_url ? (
          <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/35">
            <img
              src={event.image_url}
              alt={event.title}
              className="h-44 w-full object-cover sm:h-56"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}

        <section className="overflow-hidden min-w-0 rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
          <p className={modalStyles.sectionTitle}>Event details</p>

          <div className="mt-4 grid gap-3 text-sm leading-6 text-white/72">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
              <Calendar className="mt-0.5 h-4 w-4 flex-none text-[var(--app-primary)]" />
              <div className="min-w-0">
                <Caption className="text-white/40">Date</Caption>
                <BodySM weight="semibold" className="mt-1 text-white">
                  {eventDateRange}
                </BodySM>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
              <Clock className="mt-0.5 h-4 w-4 flex-none text-[var(--app-primary)]" />
              <div className="min-w-0">
                <Caption className="text-white/40">Time</Caption>
                <BodySM weight="semibold" className="mt-1 text-white">
                  {event.time || 'Time to be announced'}
                </BodySM>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-[var(--app-primary)]" />
              <div className="min-w-0">
                <Caption className="text-white/40">Location</Caption>
                <BodySM
                  weight="semibold"
                  className="mt-1 break-words text-white"
                >
                  {event.location || 'Venue to be announced'}
                </BodySM>
              </div>
            </div>
          </div>
        </section>

        {event.description ? (
          <section className="overflow-hidden min-w-0 rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <p className={modalStyles.sectionTitle}>About this event</p>
            <BodySM className="mt-3 text-white/65">{event.description}</BodySM>
          </section>
        ) : null}

        <section className="overflow-hidden min-w-0 space-y-3">
          {onRegister ? (
            <Button
              ref={registerButtonRef}
              type="button"
              variant="primary"
              size="md"
              curvature="full"
              onClick={handleRegister}
              disabled={disabled}
              className="w-full"
            >
              {isRegistering ? (
                <span className="inline-flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </span>
              ) : (
                'Register Now'
              )}
            </Button>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Button
              type="button"
              variant="ghost"
              size="md"
              curvature="full"
              onClick={handleAddToCalendar}
              disabled={disabled}
              className="w-full border border-white/12 bg-white/[0.04]"
              title="Add to calendar"
            >
              {isAddingToCalendar ? (
                <span className="inline-flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : addedToCalendar ? (
                <span className="inline-flex items-center justify-center">
                  <Check className="mr-2 h-4 w-4" />
                  Calendar Downloaded
                </span>
              ) : (
                <span className="inline-flex items-center justify-center">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Add to Calendar
                </span>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              curvature="full"
              onClick={handleShare}
              disabled={disabled}
              className="min-h-12 border border-white/12 bg-white/[0.04] px-5 text-white/82"
              title="Share event"
              aria-label="Share event"
            >
              {isSharing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Caption className="text-center text-white/45">
            The .ics file works with Apple Calendar, Google Calendar, Outlook,
            and most calendar apps.
          </Caption>
        </section>
      </div>
    </BaseModal>
  );
}
