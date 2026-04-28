'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarClock, Loader2, MapPin } from 'lucide-react';

import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';
import PageHero from '@/features/hero/PageHero';

function toDateKey(event: EventPublic): string | null {
  if (event.startAt) {
    const date = new Date(event.startAt);

    if (!Number.isNaN(date.getTime())) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
      ).padStart(2, '0')}`;
    }
  }

  const raw = event.date?.trim();
  if (!raw) return null;

  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

function formatDateKeyLabel(key: string): string {
  const date = new Date(`${key}T00:00:00`);

  if (Number.isNaN(date.getTime())) return key;

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export default function EventsCalendarPage() {
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadEvents = async () => {
      try {
        const items = await apiClient.listEvents();
        if (mounted) setEvents(items);
      } catch (error) {
        console.error('Failed to load events calendar', error);
        if (mounted) setEvents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadEvents();

    return () => {
      mounted = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, EventPublic[]>();

    for (const event of events) {
      const key = toDateKey(event);
      if (!key) continue;

      const bucket = map.get(key) ?? [];
      bucket.push(event);
      map.set(key, bucket);
    }

    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [events]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const monthStart = new Date(currentYear, currentMonthIndex, 1);
  const monthEnd = new Date(currentYear, currentMonthIndex + 1, 0);
  const daysInMonth = monthEnd.getDate();
  const firstWeekday = monthStart.getDay();

  const calendarSlots = useMemo(() => {
    const slots: Array<{
      dateKey: string | null;
      day: number | null;
      count: number;
    }> = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      slots.push({ dateKey: null, day: null, count: 0 });
    }

    const countMap = new Map<string, number>();

    for (const [key, list] of grouped) {
      countMap.set(key, list.length);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;

      slots.push({
        dateKey,
        day,
        count: countMap.get(dateKey) ?? 0,
      });
    }

    return slots;
  }, [currentYear, currentMonthIndex, daysInMonth, firstWeekday, grouped]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Events Calendar"
        subtitle="All upcoming services and programs in one view."
        description="Plan ahead and reserve your spot."
        compact
      />

      <section className="relative overflow-hidden bg-[#050505] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(247,222,18,0.12),transparent_28%),linear-gradient(180deg,#050505_0%,#080808_52%,#050505_100%)]" />

        <div className="relative mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 sm:rounded-[2rem] sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
                Events calendar
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                {monthStart.toLocaleDateString(undefined, {
                  month: 'long',
                  year: 'numeric',
                })}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                View this month’s published events and upcoming timeline.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-black/30 px-5 text-sm font-bold text-white/80 transition hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to events
            </Link>
          </div>

          {loading ? (
            <div className="flex min-h-[340px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.035]">
              <Loader2 className="h-9 w-9 animate-spin text-[#f7de12]" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/25">
                <div className="min-w-[760px]">
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                      day => (
                        <div key={day} className="py-2">
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarSlots.map((slot, index) => (
                      <div
                        key={`${slot.dateKey || 'empty'}-${index}`}
                        className="min-h-[96px] rounded-2xl border border-white/10 bg-black/25 p-3"
                      >
                        {slot.day ? (
                          <>
                            <p className="text-sm font-semibold text-white">
                              {slot.day}
                            </p>

                            {slot.count > 0 ? (
                              <p className="mt-3 inline-flex rounded-full bg-[#f7de12] px-2.5 py-1 text-xs font-extrabold text-black">
                                {slot.count} event{slot.count > 1 ? 's' : ''}
                              </p>
                            ) : (
                              <p className="mt-3 text-xs text-white/35">
                                No event
                              </p>
                            )}
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 sm:rounded-[2rem] sm:p-6">
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-5 w-5 text-[#f7de12]" />
                  <h2 className="text-xl font-semibold text-white">
                    Upcoming timeline
                  </h2>
                </div>

                {grouped.length === 0 ? (
                  <p className="mt-4 text-sm leading-7 text-white/55">
                    No published events available.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {grouped.map(([dateKey, list]) => (
                      <article
                        key={dateKey}
                        className="rounded-2xl border border-white/10 bg-black/25 p-4"
                      >
                        <p className="text-sm font-bold text-[#f7de12]">
                          {formatDateKeyLabel(dateKey)}
                        </p>

                        <ul className="mt-3 space-y-3">
                          {list.map(event => (
                            <li
                              key={event.id}
                              className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                            >
                              <p className="font-semibold text-white">
                                {event.title}
                              </p>

                              <p className="mt-1 flex items-center gap-2 text-sm text-white/50">
                                <MapPin className="h-4 w-4" />
                                {event.location || 'Venue TBA'}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
