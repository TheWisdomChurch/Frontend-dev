import Link from 'next/link';

import { cn } from '@/lib/cn';
import type { EventPublic } from '@/lib/apiTypes';
import {
  getEventTimestamp,
  UNKNOWN_EVENT_TIMESTAMP,
} from '@/shared/utils/eventDate';
import { Eyebrow } from '@/shared/ui/layout';
import Arrow from '@/shared/ui/icons/Arrow';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Glanceable month strip, auto-built from the same events feed as the full
 * calendar page. Display-only — it renders the current month, dots the days
 * that have something on, highlights today, and links through to the full
 * calendar. Re-renders per request, so "today" is always accurate.
 */
export function EventCalendarStrip({
  events,
}: {
  events: readonly EventPublic[];
}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventDays = new Set<number>();
  let monthCount = 0;
  for (const event of events) {
    const ts = getEventTimestamp(event);
    if (ts === UNKNOWN_EVENT_TIMESTAMP) continue;
    const date = new Date(ts);
    if (date.getFullYear() === year && date.getMonth() === month) {
      eventDays.add(date.getDate());
      monthCount += 1;
    }
  }

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-5 sm:p-6">
      <div className="flex items-baseline justify-between">
        <Eyebrow>{MONTHS[month]}</Eyebrow>
        <span className="font-ui text-label font-semibold text-[var(--app-subtle)]">
          {year}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((label, i) => (
          <span
            key={i}
            className="pb-1 font-ui text-eyebrow font-bold uppercase text-[var(--app-subtle)]"
          >
            {label}
          </span>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <span key={i} aria-hidden="true" />;
          const isToday = day === today;
          const hasEvent = eventDays.has(day);
          return (
            <span
              key={i}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-md font-ui text-label',
                isToday &&
                  'bg-[var(--app-primary)] font-bold text-[var(--app-ink)]',
                !isToday && hasEvent && 'font-semibold text-[var(--app-text)]',
                !isToday && !hasEvent && 'text-[var(--app-subtle)]'
              )}
            >
              {day}
              {hasEvent && !isToday ? (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--app-primary)]" />
              ) : null}
            </span>
          );
        })}
      </div>

      <Link
        href="/events/calendar"
        className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--app-border)] pt-4 font-ui text-label font-semibold text-[var(--app-muted)] transition hover:text-[var(--app-primary-dark)]"
      >
        {monthCount > 0
          ? `${monthCount} event${monthCount !== 1 ? 's' : ''} this month`
          : 'Open the full calendar'}
        <Arrow />
      </Link>
    </div>
  );
}

export default EventCalendarStrip;
