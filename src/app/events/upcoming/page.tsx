'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';

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

function formatDate(event: EventPublic) {
  const t = getTimestamp(event);
  if (t === Number.MAX_SAFE_INTEGER)
    return { month: '—', day: '—', full: 'TBA' };
  const d = new Date(t);
  return {
    month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()),
    full: d.toLocaleString('en', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 6h10M6 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function UpcomingPage() {
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    const now = Date.now();
    apiClient
      .listEvents()
      .then(items => {
        if (!live) return;
        const upcoming = items
          .filter(e => getTimestamp(e) >= now)
          .sort((a, b) => getTimestamp(a) - getTimestamp(b));
        setEvents(upcoming);
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

  return (
    <main className="min-h-screen">
      <PageHero
        eyebrow="Upcoming Events"
        title="What's next at Wisdom Church."
        subtitle="Special gatherings, conferences, and programs coming up — plan ahead."
        compact
      />

      <section className="bg-[var(--app-canvas)] py-14 lg:py-18">
        <Container size="xl">
          <ScrollFadeIn className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Coming up
              </p>
              <h2 className="mt-2 font-headline text-[1.6rem] font-normal text-[var(--app-ink)] sm:text-[2rem]">
                Upcoming events &amp; programs.
              </h2>
            </div>
            {!loading && events.length > 0 && (
              <span className="inline-flex self-start items-center border border-[var(--app-ink)]/12 px-4 py-2 font-ui text-[0.72rem] font-semibold text-[var(--app-ink)]/45 sm:self-auto">
                {events.length} upcoming
              </span>
            )}
          </ScrollFadeIn>

          {loading && (
            <div className="space-y-4">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="h-24 animate-pulse border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)]"
                />
              ))}
            </div>
          )}

          {!loading && events.length === 0 && (
            <ScrollFadeIn>
              <div className="flex flex-col items-center gap-5 border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)] px-8 py-16 text-center">
                <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/50" />
                <h3 className="font-headline text-[1.4rem] font-normal text-[var(--app-ink)]">
                  Nothing scheduled yet.
                </h3>
                <p className="max-w-sm font-ui text-[0.82rem] leading-[1.85] text-[var(--app-ink)]/50">
                  Check back soon. In the meantime, join us every Sunday at 9:00
                  AM and Thursday at 6:00 PM.
                </p>
                <Link
                  href="/events/weekly"
                  className="inline-flex items-center gap-2 border border-[var(--app-ink)]/18 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                >
                  See weekly services <Arrow />
                </Link>
              </div>
            </ScrollFadeIn>
          )}

          {!loading && events.length > 0 && (
            /* Timeline list — date left, content right */
            <div className="divide-y divide-[var(--app-ink)]/8 border-y border-[var(--app-ink)]/8">
              {events.map((event, i) => {
                const date = formatDate(event);
                const href =
                  event.registerLink ??
                  (event.formSlug ? `/forms/${event.formSlug}` : null);
                return (
                  <ScrollFadeIn key={event.id} delay={i * 0.04}>
                    <div className="group grid items-start gap-6 py-8 lg:grid-cols-[120px_1fr_auto] lg:gap-10 lg:py-9">
                      {/* Date column */}
                      <div className="flex items-baseline gap-3 lg:flex-col lg:gap-1">
                        <p className="font-headline text-[2.2rem] font-normal leading-none text-[var(--app-ink)]">
                          {date.day}
                        </p>
                        <p className="font-ui text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
                          {date.month}
                        </p>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="font-headline text-[1.2rem] font-normal leading-snug text-[var(--app-ink)]">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="font-ui text-[0.82rem] leading-[1.8] text-[var(--app-ink)]/68 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        {event.location && (
                          <p className="font-ui text-[0.75rem] text-[var(--app-ink)]/38">
                            {event.location}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center">
                        {href ? (
                          <a
                            href={href}
                            className="inline-flex items-center gap-2 border border-[var(--app-primary)]/35 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-[var(--app-primary)] transition hover:bg-[var(--app-primary)] hover:text-[var(--app-ink)]"
                          >
                            Register <Arrow />
                          </a>
                        ) : (
                          <span className="inline-flex items-center border border-[var(--app-ink)]/10 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-[var(--app-ink)]/35">
                            Free entry
                          </span>
                        )}
                      </div>
                    </div>
                  </ScrollFadeIn>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
