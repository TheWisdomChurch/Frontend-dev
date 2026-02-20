'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { EventBannerDesktop } from '@/components/assets';
import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';

function sortEvents(items: EventPublic[]): EventPublic[] {
  return [...items].sort((a, b) => {
    const aDate = a.startAt ? new Date(a.startAt).getTime() : Number.MAX_SAFE_INTEGER;
    const bDate = b.startAt ? new Date(b.startAt).getTime() : Number.MAX_SAFE_INTEGER;
    return aDate - bDate;
  });
}

function formatWhen(event: EventPublic): string {
  if (event.startAt) {
    const date = new Date(event.startAt);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  const date = event.date?.trim();
  const time = event.time?.trim();
  if (date && time) return `${date} • ${time}`;
  if (date) return date;
  if (time) return time;
  return 'Date to be announced';
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const items = await apiClient.listEvents();
        if (mounted) setEvents(sortEvents(items));
      } catch (error) {
        console.error('Failed to load events', error);
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

  const upcomingCount = useMemo(() => {
    const now = Date.now();
    return events.filter((event) => {
      if (!event.startAt) return true;
      const ts = new Date(event.startAt).getTime();
      return Number.isNaN(ts) || ts >= now;
    }).length;
  }, [events]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 fade-up">
            <div>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-amber-300">
              Wisdom House
            </p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Events & Programs</h1>
            <p className="mt-3 max-w-2xl text-sm text-neutral-300 sm:text-base">
              Live data from your backend. Publish in admin, and it appears here automatically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <span className="w-full sm:w-auto text-center rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-300">
              {upcomingCount} upcoming
            </span>
            <Link
              href="/events/calendar"
              className="w-full sm:w-auto text-center rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-amber-200"
            >
              Open calendar
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-10 text-center">
            <p className="text-lg font-semibold">No published events yet.</p>
            <p className="mt-2 text-sm text-neutral-400">
              Create and publish an event in admin to display it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/70 fade-up"
              >
                <div className="relative h-44 w-full bg-neutral-900">
                  <img
                    src={event.bannerUrl || event.imageUrl || EventBannerDesktop.src}
                    alt={event.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-3 p-5">
                  <h2 className="line-clamp-2 text-lg font-bold">{event.title}</h2>
                  <p className="line-clamp-3 text-sm text-neutral-300">
                    {event.description || 'Join us for this gathering.'}
                  </p>
                  <p className="text-sm text-amber-300">{formatWhen(event)}</p>
                  <p className="line-clamp-1 text-sm text-neutral-400">
                    {event.location || 'Venue to be announced'}
                  </p>

                  {(event.registerLink || event.formSlug) && (
                    <a
                      href={event.registerLink || `/forms/${event.formSlug}`}
                      className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
                    >
                      Register
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
