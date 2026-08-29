import type { EventPublic } from '@/lib/apiTypes';

export const UNKNOWN_EVENT_TIMESTAMP = Number.MAX_SAFE_INTEGER;

export function getEventTimestamp(event: EventPublic): number {
  const candidates = [
    event.startAt,
    event.date ? `${event.date}T${event.time ?? '00:00'}` : undefined,
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const timestamp = new Date(candidate).getTime();
    if (!Number.isNaN(timestamp)) return timestamp;
  }
  return UNKNOWN_EVENT_TIMESTAMP;
}

export function isUpcomingEvent(event: EventPublic, now = Date.now()): boolean {
  return getEventTimestamp(event) >= now;
}

export function formatEventDateParts(
  event: EventPublic,
  weekday: 'short' | 'long' = 'long'
): { month: string; day: string; full: string } {
  const timestamp = getEventTimestamp(event);
  if (timestamp === UNKNOWN_EVENT_TIMESTAMP) {
    return { month: '—', day: '—', full: 'Date to be announced' };
  }
  const date = new Date(timestamp);
  return {
    month: date.toLocaleString('en', { month: 'short' }).toUpperCase(),
    day: String(date.getDate()),
    full: date.toLocaleString('en', {
      weekday,
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (value: number) => {
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};

/**
 * A short human label for how soon an event is — "Happening now", "Today",
 * "Tomorrow", or the weekday name if it lands later this week. `null` once it
 * is more than a week out (the section headers carry the horizon by then).
 */
export function getRelativeEventLabel(
  event: EventPublic,
  now = Date.now()
): string | null {
  const start = getEventTimestamp(event);
  if (start === UNKNOWN_EVENT_TIMESTAMP) return null;

  const endRaw = event.endAt ? new Date(event.endAt).getTime() : start;
  const end = Number.isNaN(endRaw) ? start : endRaw;
  if (now >= start && now <= end) return 'Happening now';

  const dayDiff = Math.round((startOfDay(start) - startOfDay(now)) / DAY_MS);
  if (dayDiff < 0) return null;
  if (dayDiff === 0) return 'Today';
  if (dayDiff === 1) return 'Tomorrow';
  if (dayDiff < 7) {
    return new Date(start).toLocaleDateString('en', { weekday: 'long' });
  }
  return null;
}

export type EventHorizon = 'week' | 'month' | 'later';

export function getEventHorizon(
  event: EventPublic,
  now = Date.now()
): EventHorizon {
  const ts = getEventTimestamp(event);
  if (ts < now + 7 * DAY_MS) return 'week';
  if (ts < now + 31 * DAY_MS) return 'month';
  return 'later';
}

/**
 * Split an already-sorted list of upcoming events into "this week", "this
 * month", and "later" buckets — purely derived from each event's date, so the
 * hub reorganises itself as time passes with no manual curation.
 */
export function groupEventsByHorizon(
  events: readonly EventPublic[],
  now = Date.now()
): Record<EventHorizon, EventPublic[]> {
  const buckets: Record<EventHorizon, EventPublic[]> = {
    week: [],
    month: [],
    later: [],
  };
  for (const event of events) buckets[getEventHorizon(event, now)].push(event);
  return buckets;
}

export function formatEventTime(event: EventPublic): string {
  if (event.startAt) {
    const date = new Date(event.startAt);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString('en', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }
  return event.time ?? '';
}
