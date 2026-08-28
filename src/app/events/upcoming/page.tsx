'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import Arrow from '@/shared/ui/icons/Arrow';
import {
  formatEventDateParts as formatDate,
  getEventTimestamp as getTimestamp,
} from '@/shared/utils/eventDate';
import {
  Container,
  Eyebrow,
  Page,
  Section,
  SectionEmpty,
  SectionHeader,
  interactiveCardClass,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';

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
    <Page>
      <SiteHero
        backgroundImage="/Picflow/DSC00054 copy.webp"
        eyebrow="Upcoming Events"
        title="What's next at Wisdom Church."
        subtitle="Special gatherings, conferences, and programs coming up — plan ahead."
      />

      <Section tone="canvas">
        <Container>
          <ScrollFadeIn className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Coming up"
              title="Upcoming events & programs."
            />
            {!loading && events.length > 0 && (
              <span className="inline-flex self-start items-center border border-[var(--app-border)] px-4 py-2 font-ui text-label font-semibold text-[var(--app-subtle)] sm:self-auto">
                {events.length} upcoming
              </span>
            )}
          </ScrollFadeIn>

          {loading && (
            <div className="space-y-4">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="h-24 animate-pulse border border-[var(--app-border)] bg-[var(--app-canvas-2)]"
                />
              ))}
            </div>
          )}

          {!loading && events.length === 0 && (
            <div>
              <SectionEmpty
                title="Nothing scheduled yet."
                description={`Check back soon. In the meantime, join us every ${SERVICE_INFO.sunday.day} at ${SERVICE_INFO.sunday.time}, and for ${SERVICE_INFO.dailyPrayer.label} ${SERVICE_INFO.dailyPrayer.daysShort} at ${SERVICE_INFO.dailyPrayer.time}.`}
                action={
                  <Link href="/events/weekly" className={buttonClass('dark')}>
                    See weekly services
                  </Link>
                }
              />
            </div>
          )}

          {!loading && events.length > 0 && (
            /* Timeline list — date left, content right */
            <div className="grid gap-4">
              {events.map((event, i) => {
                const date = formatDate(event);
                const href =
                  event.registerLink ??
                  (event.formSlug ? `/forms/${event.formSlug}` : null);
                return (
                  <ScrollFadeIn key={event.id} delay={i * 0.04}>
                    <article
                      className={`group grid items-start gap-6 rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-5 sm:p-7 lg:grid-cols-[120px_1fr_auto] lg:gap-10 ${interactiveCardClass}`}
                    >
                      {/* Date column */}
                      <div className="flex items-baseline gap-3 lg:flex-col lg:gap-1">
                        <p className="font-ui text-heading-lg font-semibold leading-none text-[var(--app-ink)]">
                          {date.day}
                        </p>
                        <Eyebrow>{date.month}</Eyebrow>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="font-ui text-heading-sm font-semibold leading-snug text-[var(--app-ink)]">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="font-ui text-body-sm leading-[1.8] text-[var(--app-muted)] line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        {event.location && (
                          <p className="font-ui text-label text-[var(--app-muted)]">
                            {event.location}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center">
                        {href ? (
                          <a
                            href={href}
                            className="inline-flex items-center gap-2 border border-[var(--app-primary)]/35 px-5 py-2.5 font-ui text-label font-semibold text-[var(--app-primary)] transition hover:bg-[var(--app-primary)] hover:text-[var(--app-ink)]"
                          >
                            Register <Arrow />
                          </a>
                        ) : (
                          <span className="inline-flex items-center border border-[var(--app-border)] px-5 py-2.5 font-ui text-label font-semibold text-[var(--app-muted)]">
                            Free entry
                          </span>
                        )}
                      </div>
                    </article>
                  </ScrollFadeIn>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </Page>
  );
}
