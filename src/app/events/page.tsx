'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarClock,
  CalendarPlus,
  Loader2,
  MapPin,
} from 'lucide-react';

import { EventBannerDesktop } from '@/shared/assets';
import PageHero from '@/features/hero/PageHero';
import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';

function getEventTimestamp(event: EventPublic): number {
  if (event.startAt) {
    const timestamp = new Date(event.startAt).getTime();
    if (!Number.isNaN(timestamp)) return timestamp;
  }

  if (event.date) {
    const timestamp = new Date(
      `${event.date}T${event.time || '00:00'}`
    ).getTime();
    if (!Number.isNaN(timestamp)) return timestamp;
  }

  return Number.MAX_SAFE_INTEGER;
}

function sortEvents(items: EventPublic[]): EventPublic[] {
  return [...items].sort((a, b) => getEventTimestamp(a) - getEventTimestamp(b));
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

function getRegisterHref(event: EventPublic): string | null {
  if (event.registerLink) return event.registerLink;
  if (event.formSlug) return `/forms/${event.formSlug}`;
  return null;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadEvents = async () => {
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

    loadEvents();

    return () => {
      mounted = false;
    };
  }, []);

  const upcomingCount = useMemo(() => {
    const now = Date.now();

    return events.filter(event => {
      const timestamp = getEventTimestamp(event);
      return timestamp === Number.MAX_SAFE_INTEGER || timestamp >= now;
    }).length;
  }, [events]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Events & Programs"
        subtitle="Explore upcoming church events, weekly programs, and special gatherings."
        description="Stay connected with the latest published events from The Wisdom Church calendar."
        compact
      />

      <section className="relative overflow-hidden bg-[#050505] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(247,222,18,0.12),transparent_28%),radial-gradient(circle_at_90%_18%,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,#050505_0%,#080808_50%,#050505_100%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 sm:rounded-[2rem] sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
                Wisdom Church Calendar
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Events & Programs
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
                Published events from the admin portal appear here
                automatically. Check dates, venues, and registration links.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-black/30 px-5 text-sm font-semibold text-white/75">
                {upcomingCount} upcoming
              </span>

              <Link
                href="/events/calendar"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#f7de12] px-5 text-sm font-extrabold text-black shadow-lg shadow-[#f7de12]/20 transition hover:-translate-y-0.5 hover:bg-[#ffe93d]"
              >
                Open calendar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[340px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.035]">
              <Loader2 className="h-9 w-9 animate-spin text-[#f7de12]" />
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/25 sm:p-10">
              <CalendarPlus className="mx-auto h-12 w-12 text-[#f7de12]" />
              <h2 className="mt-5 text-xl font-semibold text-white">
                No published events yet.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/60">
                Create and publish an event in the admin portal to display it on
                this page.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map(event => {
                const registerHref = getRegisterHref(event);
                const imageSrc =
                  event.bannerUrl || event.imageUrl || EventBannerDesktop.src;

                return (
                  <article
                    key={event.id}
                    className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/25 transition duration-300 hover:-translate-y-1 hover:border-[#f7de12]/35 sm:rounded-[1.75rem]"
                  >
                    <div className="relative h-52 w-full overflow-hidden bg-black">
                      <img
                        src={imageSrc}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </div>

                    <div className="space-y-4 p-5">
                      <h2 className="line-clamp-2 text-lg font-semibold leading-tight text-white">
                        {event.title}
                      </h2>

                      <p className="line-clamp-3 text-sm leading-6 text-white/62">
                        {event.description || 'Join us for this gathering.'}
                      </p>

                      <div className="space-y-2 border-t border-white/10 pt-4">
                        <p className="flex items-start gap-2 text-sm leading-6 text-white/72">
                          <CalendarClock className="mt-0.5 h-4 w-4 flex-none text-[#f7de12]" />
                          <span>{formatWhen(event)}</span>
                        </p>

                        <p className="flex items-start gap-2 text-sm leading-6 text-white/55">
                          <MapPin className="mt-0.5 h-4 w-4 flex-none text-white/35" />
                          <span className="line-clamp-1">
                            {event.location || 'Venue to be announced'}
                          </span>
                        </p>
                      </div>

                      {registerHref ? (
                        <a
                          href={registerHref}
                          className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-black transition hover:bg-[#f7de12]"
                        >
                          Register
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
