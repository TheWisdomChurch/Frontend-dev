'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, MapPin, ArrowUpRight } from 'lucide-react';

import { EventBannerDesktop } from '@/shared/assets';
import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { cn } from '@/lib/cn';
import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';

function sortEvents(items: EventPublic[]): EventPublic[] {
  return [...items].sort((a, b) => {
    const aDate = a.startAt
      ? new Date(a.startAt).getTime()
      : Number.MAX_SAFE_INTEGER;
    const bDate = b.startAt
      ? new Date(b.startAt).getTime()
      : Number.MAX_SAFE_INTEGER;
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
  const { colorScheme } = useTheme();
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
    return events.filter(event => {
      if (!event.startAt) return true;
      const ts = new Date(event.startAt).getTime();
      return Number.isNaN(ts) || ts >= now;
    }).length;
  }, [events]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Events & Programs"
        subtitle="Gatherings that shape your week and strengthen your faith."
        note="Live updates from your admin dashboard. Publish once and it appears here instantly."
        backgroundImage={EventBannerDesktop.src}
        chips={[
          `${upcomingCount} Upcoming`,
          'Live Updates',
          'Community',
          'Worship',
        ]}
        compact
      />

      <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage:
              'radial-gradient(circle at 50% 30%, black 35%, transparent 90%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 30%, black 35%, transparent 90%)',
          }}
        />
        <Container size="xl" className="relative z-10 space-y-6 sm:space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 fade-up">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                Wisdom House
              </p>
              <h2 className="text-xl sm:text-2xl font-semibold">
                Upcoming moments
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm text-white/70">
                {upcomingCount} upcoming
              </span>
              <Link
                href="/events/calendar"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition"
                style={{
                  background: colorScheme.primaryGradient,
                  color: colorScheme.onPrimary,
                }}
              >
                Open calendar <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[3px]" />
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <p className="text-lg font-semibold">No published events yet.</p>
              <p className="mt-2 text-sm text-white/60">
                Create and publish an event in admin to display it here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map(event => (
                <article
                  key={event.id}
                  className={cn(
                    'group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition',
                    'hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)] fade-up'
                  )}
                >
                  <div className="relative h-44 w-full bg-black/40">
                    <img
                      src={
                        event.bannerUrl ||
                        event.imageUrl ||
                        EventBannerDesktop.src
                      }
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>

                  <div className="space-y-3 p-5">
                    <h3 className="line-clamp-2 text-base sm:text-lg font-semibold">
                      {event.title}
                    </h3>
                    <p className="line-clamp-3 text-xs sm:text-sm text-white/70">
                      {event.description || 'Join us for this gathering.'}
                    </p>

                    <div className="space-y-2 text-xs sm:text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-white/60" />
                        <span>{formatWhen(event)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-white/60" />
                        <span className="line-clamp-1">
                          {event.location || 'Venue to be announced'}
                        </span>
                      </div>
                    </div>

                    {(event.registerLink || event.formSlug) && (
                      <a
                        href={event.registerLink || `/forms/${event.formSlug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Register <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
