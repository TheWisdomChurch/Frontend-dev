'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';

function toDateKey(event: EventPublic): string | null {
  if (event.startAt) {
    const d = new Date(event.startAt);
    if (!Number.isNaN(d.getTime())) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  }

  const raw = event.date?.trim();
  if (!raw) return null;
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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

    const load = async () => {
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

    load();
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
    const slots: Array<{ dateKey: string | null; day: number | null; count: number }> = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      slots.push({ dateKey: null, day: null, count: 0 });
    }

    const countMap = new Map<string, number>();
    for (const [key, list] of grouped) {
      countMap.set(key, list.length);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      slots.push({
        dateKey,
        day,
        count: countMap.get(dateKey) ?? 0,
      });
    }

    return slots;
  }, [currentYear, currentMonthIndex, daysInMonth, firstWeekday, grouped]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Events calendar</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              {monthStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </h1>
          </div>

          <Link
            href="/events"
            className="rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-neutral-200 transition hover:bg-neutral-900"
          >
            Back to events
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarSlots.map((slot, index) => (
                <div
                  key={`${slot.dateKey || 'empty'}-${index}`}
                  className="min-h-[76px] rounded-2xl border border-neutral-800 bg-neutral-900/60 p-2"
                >
                  {slot.day ? (
                    <>
                      <p className="text-sm font-semibold">{slot.day}</p>
                      {slot.count > 0 ? (
                        <p className="mt-2 inline-flex rounded-full bg-amber-300 px-2 py-0.5 text-[11px] font-semibold text-neutral-900">
                          {slot.count} event{slot.count > 1 ? 's' : ''}
                        </p>
                      ) : (
                        <p className="mt-2 text-[11px] text-neutral-500">No event</p>
                      )}
                    </>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5">
              <h2 className="text-lg font-bold">Upcoming timeline</h2>
              {grouped.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-400">No published events available.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {grouped.map(([dateKey, list]) => (
                    <div key={dateKey} className="rounded-2xl border border-neutral-800 p-4">
                      <p className="text-sm font-semibold text-amber-300">{formatDateKeyLabel(dateKey)}</p>
                      <ul className="mt-2 space-y-2">
                        {list.map((event) => (
                          <li key={event.id} className="text-sm text-neutral-200">
                            <span className="font-semibold">{event.title}</span>
                            <span className="text-neutral-400"> • {event.location || 'Venue TBA'}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
