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
