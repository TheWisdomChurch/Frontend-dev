'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';
import Arrow from '@/shared/ui/icons/Arrow';

function getTimestamp(event: EventPublic): number {
  if (event.startAt) {
    const t = new Date(event.startAt).getTime();
    if (!Number.isNaN(t)) return t;
  }
  if (event.date) {
    const t = new Date(`${event.date}T${event.time ?? '00:00'}`).getTime();
    if (!Number.isNaN(t)) return t;
  }
  return Number.MAX_SAFE_INTEGER;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

export default function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    apiClient
      .listEvents()
      .then(items => {
        if (live) setEvents(items);
      })
      .catch(() => {
        if (live) setEvents([]);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  /* Build calendar grid */
  const { cells, eventsByDay } = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cellArr: (number | null)[] = [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    // pad to complete last row
    while (cellArr.length % 7 !== 0) cellArr.push(null);

    const byDay: Record<number, EventPublic[]> = {};
    for (const ev of events) {
      const t = getTimestamp(ev);
      if (t === Number.MAX_SAFE_INTEGER) continue;
      const d = new Date(t);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        const day = d.getDate();
        byDay[day] = [...(byDay[day] ?? []), ev];
      }
    }
    return { cells: cellArr, eventsByDay: byDay };
  }, [viewYear, viewMonth, events]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(y => y - 1);
      setViewMonth(11);
    } else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(y => y + 1);
      setViewMonth(0);
    } else setViewMonth(m => m + 1);
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  /* Events in this month for list view */
  const monthEvents = useMemo(
    () =>
      events
        .filter(ev => {
          const t = getTimestamp(ev);
          if (t === Number.MAX_SAFE_INTEGER) return false;
          const d = new Date(t);
          return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
        })
        .sort((a, b) => getTimestamp(a) - getTimestamp(b)),
    [events, viewYear, viewMonth]
  );

  return (
    <main className="min-h-screen">
      <PageHero
        eyebrow="Church Calendar"
        title="Every event, every month."
        subtitle="Browse the full calendar of services, programs, and special gatherings."
        compact
      />

      <section className="overflow-hidden min-w-0 bg-[var(--app-canvas)] py-14 lg:py-18">
        <Container size="xl">
          {/* Month navigation */}
          <ScrollFadeIn className="mb-10 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-10 w-10 items-center justify-center border border-[var(--app-ink)]/14 text-[var(--app-ink)]/45 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
              aria-label="Previous month"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M8 1L3 6l5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="text-center">
              <p className="font-headline text-heading-md font-normal text-[var(--app-ink)]">
                {MONTHS[viewMonth]}
              </p>
              <p className="font-ui text-label font-semibold text-[var(--app-ink)]/60">
                {viewYear}
              </p>
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-10 w-10 items-center justify-center border border-[var(--app-ink)]/14 text-[var(--app-ink)]/45 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
              aria-label="Next month"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M4 1l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </ScrollFadeIn>

          {/* Calendar grid */}
          <ScrollFadeIn>
            <div className="border border-[var(--app-ink)]/10">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-[var(--app-ink)]/10">
                {DAYS.map(d => (
                  <div
                    key={d}
                    className="py-2.5 text-center font-ui text-eyebrow font-bold uppercase tracking-[0.14em] text-[var(--app-ink)]/60"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              {Array.from({ length: cells.length / 7 }, (_, w) => (
                <div
                  key={w}
                  className="grid grid-cols-7 border-b border-[var(--app-ink)]/8 last:border-b-0"
                >
                  {cells.slice(w * 7, w * 7 + 7).map((day, j) => {
                    const hasEvents =
                      day !== null && eventsByDay[day]?.length > 0;
                    return (
                      <div
                        key={j}
                        className={[
                          'relative min-h-[56px] border-r border-[var(--app-ink)]/8 last:border-r-0 p-2 lg:min-h-[72px] lg:p-3',
                          day === null
                            ? 'bg-[var(--app-canvas-2)]'
                            : 'bg-[var(--app-canvas)]',
                          isToday(day!) ? 'bg-[var(--app-primary)]/[0.06]' : '',
                        ].join(' ')}
                      >
                        {day !== null && (
                          <>
                            <span
                              className={[
                                'font-ui text-label font-semibold',
                                isToday(day)
                                  ? 'text-[var(--app-primary)]'
                                  : 'text-[var(--app-ink)]/50',
                              ].join(' ')}
                            >
                              {day}
                            </span>
                            {hasEvents && (
                              <div className="mt-1 flex flex-col gap-0.5">
                                {eventsByDay[day].slice(0, 2).map(ev => (
                                  <span
                                    key={ev.id}
                                    className="block truncate rounded-[2px] bg-[var(--app-primary)]/15 px-1 py-0.5 font-ui text-eyebrow text-[var(--app-primary)] leading-tight"
                                  >
                                    {ev.title}
                                  </span>
                                ))}
                                {eventsByDay[day].length > 2 && (
                                  <span className="font-ui text-eyebrow text-[var(--app-ink)]/60">
                                    +{eventsByDay[day].length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </ScrollFadeIn>

          {/* This month event list */}
          {!loading && monthEvents.length > 0 && (
            <ScrollFadeIn className="mt-12">
              <p className="mb-5 font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Events this month
              </p>
              <div className="divide-y divide-[var(--app-ink)]/8 border-y border-[var(--app-ink)]/8">
                {monthEvents.map(ev => {
                  const t = getTimestamp(ev);
                  const d = new Date(t);
                  const href =
                    ev.registerLink ??
                    (ev.formSlug ? `/forms/${ev.formSlug}` : null);
                  return (
                    <div key={ev.id} className="flex items-center gap-6 py-5">
                      <div className="w-14 shrink-0 text-right">
                        <p className="font-headline text-heading-md font-normal leading-none text-[var(--app-ink)]">
                          {d.getDate()}
                        </p>
                        <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.14em] text-[var(--app-primary)]">
                          {d
                            .toLocaleString('en', { month: 'short' })
                            .toUpperCase()}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-headline text-body-lg font-normal text-[var(--app-ink)] truncate">
                          {ev.title}
                        </p>
                        {ev.location && (
                          <p className="font-ui text-label text-[var(--app-ink)]/60 truncate">
                            {ev.location}
                          </p>
                        )}
                      </div>
                      {href && (
                        <a
                          href={href}
                          className="shrink-0 inline-flex items-center gap-2 border border-[var(--app-primary)]/35 px-4 py-2 font-ui text-caption font-semibold text-[var(--app-primary)] transition hover:bg-[var(--app-primary)] hover:text-[var(--app-ink)]"
                        >
                          Register <Arrow />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollFadeIn>
          )}

          {!loading && monthEvents.length === 0 && (
            <ScrollFadeIn className="mt-10">
              <p className="font-ui text-body-sm text-[var(--app-ink)]/60 text-center py-6">
                No events scheduled for {MONTHS[viewMonth]}. Navigate to another
                month or{' '}
                <Link
                  href="/events"
                  className="text-[var(--app-primary)] underline underline-offset-2"
                >
                  view all events.
                </Link>
              </p>
            </ScrollFadeIn>
          )}
        </Container>
      </section>
    </main>
  );
}
