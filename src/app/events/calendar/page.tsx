'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';
import Arrow from '@/shared/ui/icons/Arrow';
import { getEventTimestamp as getTimestamp } from '@/shared/utils/eventDate';
import {
  Container,
  Eyebrow,
  Page,
  Section,
  SectionEmpty,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';

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
    <Page>
      <SiteHero
        backgroundImage="/Picflow/DSC00048 copy.webp"
        eyebrow="Church Calendar"
        title="Every event, every month."
        subtitle="Browse the full calendar of services, programs, and special gatherings."
      />

      <Section tone="canvas">
        <Container>
          {/* Month navigation */}
          <ScrollFadeIn className="mb-10 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className={buttonClass('outline', 'icon')}
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
              <p className="font-ui text-heading-md font-semibold text-[var(--app-ink)]">
                {MONTHS[viewMonth]}
              </p>
              <p className="font-ui text-label font-semibold text-[var(--app-muted)]">
                {viewYear}
              </p>
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className={buttonClass('outline', 'icon')}
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
            <p className="mb-3 font-ui text-caption text-[var(--app-subtle)] md:hidden">
              Swipe horizontally to see the full week.
            </p>
            <div
              className="overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin]"
              role="region"
              aria-label="Monthly event calendar"
              tabIndex={0}
            >
              <div className="min-w-[42rem] border border-[var(--app-border)] md:min-w-0">
                {/* Day headers */}
                <div className="grid grid-cols-7 border-b border-[var(--app-border)]">
                  {DAYS.map(d => (
                    <div
                      key={d}
                      className="py-2.5 text-center font-ui text-eyebrow font-bold uppercase tracking-[0.14em] text-[var(--app-muted)]"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Weeks */}
                {Array.from({ length: cells.length / 7 }, (_, w) => (
                  <div
                    key={w}
                    className="grid grid-cols-7 border-b border-[var(--app-border)] last:border-b-0"
                  >
                    {cells.slice(w * 7, w * 7 + 7).map((day, j) => {
                      const hasEvents =
                        day !== null && eventsByDay[day]?.length > 0;
                      return (
                        <div
                          key={j}
                          className={[
                            'relative min-h-[56px] border-r border-[var(--app-border)] last:border-r-0 p-2 lg:min-h-[72px] lg:p-3',
                            day === null
                              ? 'bg-[var(--app-canvas-2)]'
                              : 'bg-[var(--app-canvas)]',
                            isToday(day!)
                              ? 'bg-[color-mix(in_srgb,var(--app-primary)_6%,transparent)]'
                              : '',
                          ].join(' ')}
                        >
                          {day !== null && (
                            <>
                              <span
                                className={[
                                  'font-ui text-label font-semibold',
                                  isToday(day)
                                    ? 'text-[var(--app-primary)]'
                                    : 'text-[var(--app-subtle)]',
                                ].join(' ')}
                              >
                                {day}
                              </span>
                              {hasEvents && (
                                <div className="mt-1 flex flex-col gap-0.5">
                                  {eventsByDay[day].slice(0, 2).map(ev => (
                                    <span
                                      key={ev.id}
                                      className="block truncate rounded-[2px] bg-[color-mix(in_srgb,var(--app-primary)_15%,transparent)] px-1 py-0.5 font-ui text-eyebrow text-[var(--app-primary)] leading-tight"
                                    >
                                      {ev.title}
                                    </span>
                                  ))}
                                  {eventsByDay[day].length > 2 && (
                                    <span className="font-ui text-eyebrow text-[var(--app-muted)]">
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
            </div>
          </ScrollFadeIn>

          {/* This month event list */}
          {!loading && monthEvents.length > 0 && (
            <ScrollFadeIn className="mt-12">
              <Eyebrow className="mb-5">Events this month</Eyebrow>
              <div className="divide-y divide-[var(--app-border)] border-y border-[var(--app-border)]">
                {monthEvents.map(ev => {
                  const t = getTimestamp(ev);
                  const d = new Date(t);
                  const href =
                    ev.registerLink ??
                    (ev.formSlug ? `/forms/${ev.formSlug}` : null);
                  return (
                    <div key={ev.id} className="flex items-center gap-6 py-5">
                      <div className="w-14 shrink-0 text-right">
                        <p className="font-ui text-heading-md font-semibold leading-none text-[var(--app-ink)]">
                          {d.getDate()}
                        </p>
                        <Eyebrow>
                          {d
                            .toLocaleString('en', { month: 'short' })
                            .toUpperCase()}
                        </Eyebrow>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-ui text-body-lg font-semibold text-[var(--app-ink)] truncate">
                          {ev.title}
                        </p>
                        {ev.location && (
                          <p className="font-ui text-label text-[var(--app-muted)] truncate">
                            {ev.location}
                          </p>
                        )}
                      </div>
                      {href && (
                        <a
                          href={href}
                          className={buttonClass('outline', 'sm', 'shrink-0')}
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
            <div className="mt-10">
              <SectionEmpty
                title={`No events scheduled for ${MONTHS[viewMonth]}.`}
                description="Navigate to another month or view all upcoming events."
                action={
                  <Link href="/events" className={buttonClass('outline', 'sm')}>
                    View all events
                  </Link>
                }
              />
              <p className="sr-only">
                No events scheduled for {MONTHS[viewMonth]}. Navigate to another
                month or{' '}
                <Link
                  href="/events"
                  className="text-[var(--app-primary)] underline underline-offset-2"
                >
                  view all events.
                </Link>
              </p>
            </div>
          )}
        </Container>
      </Section>
    </Page>
  );
}
