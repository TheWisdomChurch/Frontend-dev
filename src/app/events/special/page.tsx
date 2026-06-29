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
    return { month: '—', day: '—', year: '—', full: 'TBA' };
  const d = new Date(t);
  return {
    month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()),
    year: String(d.getFullYear()),
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

export default function SpecialEventsPage() {
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    apiClient
      .listEvents()
      .then(items => {
        if (!live) return;
        setEvents([...items].sort((a, b) => getTimestamp(a) - getTimestamp(b)));
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
        eyebrow="Special Events"
        title="Conferences, concerts &amp; programs."
        subtitle="Exceptional gatherings designed to shape, strengthen, and celebrate the community."
        compact
      />

      <section className="bg-[var(--app-dark)] py-16 lg:py-20">
        <Container size="xl">
          <ScrollFadeIn className="mb-12">
            <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Special programs
            </p>
            <h2 className="mt-2 font-headline text-[1.6rem] font-normal text-white sm:text-[2rem]">
              Exceptional gatherings &amp; landmark events.
            </h2>
          </ScrollFadeIn>

          {loading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="h-[300px] animate-pulse border border-white/8 bg-white/[0.03]"
                />
              ))}
            </div>
          )}

          {!loading && events.length === 0 && (
            <ScrollFadeIn>
              <div className="flex flex-col items-center gap-5 border border-white/8 bg-white/[0.03] px-8 py-16 text-center">
                <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/50" />
                <h3 className="font-headline text-[1.4rem] font-normal text-white">
                  Special events coming soon.
                </h3>
                <p className="max-w-sm font-ui text-[0.82rem] leading-[1.85] text-white/45">
                  We host conferences and special programs throughout the year.
                  Follow us to stay updated.
                </p>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 border border-white/18 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-white/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                >
                  See all events <Arrow />
                </Link>
              </div>
            </ScrollFadeIn>
          )}

          {!loading && events.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => {
                const date = formatDate(event);
                const href =
                  event.registerLink ??
                  (event.formSlug ? `/forms/${event.formSlug}` : null);
                const imgSrc = event.bannerUrl ?? event.imageUrl ?? null;

                return (
                  <ScrollFadeIn key={event.id} delay={i * 0.05}>
                    <article className="group flex flex-col overflow-hidden border border-white/10 bg-white/[0.03] transition duration-300 hover:border-[var(--app-primary)]/40">
                      {/* Image / date block */}
                      <div className="relative h-[200px] overflow-hidden bg-[var(--app-dark-2)]">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={event.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center">
                            <span className="font-ui text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                              {date.month}
                            </span>
                            <span className="font-headline text-[4rem] font-normal leading-none text-white/90">
                              {date.day}
                            </span>
                            <span className="font-ui text-[0.7rem] text-white/35">
                              {date.year}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-dark)]/75 via-transparent to-transparent" />
                        {imgSrc && (
                          <div className="absolute bottom-3 left-4">
                            <span className="font-ui text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
                              {date.month} {date.day}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <h3 className="font-headline text-[1.1rem] font-normal leading-snug text-white transition group-hover:text-[var(--app-primary)]/90 line-clamp-2">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="font-ui text-[0.8rem] leading-[1.8] text-white/42 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        {event.location && (
                          <p className="font-ui text-[0.74rem] text-white/35 line-clamp-1">
                            {event.location}
                          </p>
                        )}
                        <div className="mt-auto pt-3">
                          {href ? (
                            <a
                              href={href}
                              className="inline-flex items-center gap-2 border border-[var(--app-primary)]/40 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-[var(--app-primary)] transition hover:bg-[var(--app-primary)] hover:text-[var(--app-ink)]"
                            >
                              Register <Arrow />
                            </a>
                          ) : (
                            <span className="inline-flex items-center border border-white/12 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-white/30">
                              Free entry
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
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
