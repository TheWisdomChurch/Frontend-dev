import Link from 'next/link';
import {
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Clock3,
  List,
  MapPin,
  Sparkles,
  SunMedium,
} from 'lucide-react';

import { cn } from '@/lib/cn';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { Media } from '@/shared/ui/Media';
import { EventCalendarStrip } from '@/features/events/EventCalendarStrip';
import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import JsonLd from '@/shared/seo/JsonLd';
import { buildEventSchema, buildBreadcrumbSchema } from '@/lib/seo';
import Arrow from '@/shared/ui/icons/Arrow';
import {
  formatEventDateParts as formatDate,
  formatEventTime as formatTime,
  getEventTimestamp as getTimestamp,
  getRelativeEventLabel,
  groupEventsByHorizon,
  isUpcomingEvent as isUpcoming,
  type EventHorizon,
} from '@/shared/utils/eventDate';
import {
  Container,
  CtaLink,
  Page,
  Panel,
  Section,
  SectionHeader,
  interactiveCardClass,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';

/* ── Utilities ──────────────────────────────────────────── */

function registerHref(event: EventPublic): string | null {
  if (event.registerLink) return event.registerLink;
  if (event.formSlug) return `/forms/${event.formSlug}`;
  return null;
}

type DateParts = ReturnType<typeof formatDate>;

/* ── Static weekly data ─────────────────────────────────── */

const WEEKLY = [
  {
    day: SERVICE_INFO.sunday.day,
    time: SERVICE_INFO.sunday.time,
    name: 'Sunday Worship Service',
    description:
      'Spirit-filled corporate worship, prayer, and the preached Word.',
    icon: SunMedium,
  },
  {
    day: SERVICE_INFO.dailyPrayer.daysShort,
    time: SERVICE_INFO.dailyPrayer.time,
    name: 'Daily Morning Prayer',
    description: 'Start the day in prayer, declaration, and the Word.',
    icon: CalendarClock,
  },
] as const;

const BROWSE = [
  {
    href: '/events/weekly',
    label: 'Weekly Services',
    hint: 'Our regular rhythm of gathering',
    icon: CalendarDays,
  },
  {
    href: '/events/calendar',
    label: 'Calendar View',
    hint: 'Everything, month by month',
    icon: CalendarRange,
  },
  {
    href: '/events/upcoming',
    label: 'Upcoming Events',
    hint: 'The full list of what is ahead',
    icon: List,
  },
] as const;

/* ── Shared pieces ──────────────────────────────────────── */

function DateBadge({
  date,
  size = 'sm',
}: {
  date: DateParts;
  size?: 'sm' | 'lg';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-1.5 rounded-badge bg-[var(--app-primary)] font-ui font-bold uppercase tracking-[0.16em] text-[var(--app-ink)]',
        size === 'lg' ? 'px-3 py-1.5 text-eyebrow' : 'px-2.5 py-1 text-eyebrow'
      )}
    >
      <span
        className={cn(
          'font-semibold leading-none',
          size === 'lg' ? 'text-body-md' : 'text-body-sm'
        )}
      >
        {date.day}
      </span>
      {date.month}
    </span>
  );
}

function DatePlate({ date, large }: { date: DateParts; large?: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 bg-[var(--app-dark-2)]">
      <span className="font-ui text-caption font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
        {date.month}
      </span>
      <span
        className={cn(
          'font-ui font-medium leading-none text-[var(--app-text)]',
          large ? 'text-display-md' : 'text-display-sm'
        )}
      >
        {date.day}
      </span>
    </div>
  );
}

function RelativeBadge({
  event,
  onImage = false,
}: {
  event: EventPublic;
  onImage?: boolean;
}) {
  const label = getRelativeEventLabel(event);
  if (!label) return null;
  const live = label === 'Happening now';
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-badge px-2.5 py-0.5 font-ui text-eyebrow font-bold uppercase tracking-[0.14em]',
        onImage
          ? 'bg-[var(--app-primary)] text-[var(--app-ink)]'
          : 'border border-[var(--app-primary)]/40 bg-[var(--app-primary)]/10 text-[var(--app-primary-dark)]'
      )}
    >
      {live ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current motion-safe:animate-pulse" />
      ) : null}
      {label}
    </span>
  );
}

function EventMeta({ event }: { event: EventPublic }) {
  const date = formatDate(event);
  const time = formatTime(event);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-ui text-label font-semibold">
      <span className="text-[var(--app-primary-dark)]">{date.full}</span>
      {time ? <span className="text-[var(--app-muted)]">{time}</span> : null}
      {event.location ? (
        <span className="inline-flex items-center gap-1.5 text-[var(--app-subtle)]">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {event.location}
        </span>
      ) : null}
    </div>
  );
}

/* ── Featured (next) event ──────────────────────────────── */

function EventFeature({ event }: { event: EventPublic }) {
  const href = registerHref(event);
  const image = event.bannerUrl ?? event.imageUrl ?? null;
  const date = formatDate(event);
  const relative = getRelativeEventLabel(event);

  return (
    <article className="group grid overflow-hidden rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] lg:grid-cols-[1.15fr_1fr]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--app-dark-2)] lg:aspect-auto lg:min-h-[26rem]">
        {image ? (
          <Media
            src={image}
            alt={event.title}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <DatePlate date={date} large />
        )}
        <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-badge bg-[var(--app-primary)] px-3 py-1 font-ui text-eyebrow font-bold uppercase tracking-[0.18em] text-[var(--app-ink)]">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {relative ?? 'Next up'}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-6 sm:p-8 lg:p-10">
        <EventMeta event={event} />
        <h3 className="font-ui text-heading-lg font-semibold leading-snug text-[var(--app-text)]">
          {event.title}
        </h3>
        {event.description ? (
          <p className="font-ui text-body-md leading-[1.8] text-[var(--app-muted)] line-clamp-4">
            {event.description}
          </p>
        ) : null}
        <div className="mt-auto pt-2">
          {href ? (
            <a href={href} className={buttonClass('primary')}>
              Register <Arrow />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-button border border-[var(--app-border)] px-5 py-2.5 font-ui text-label font-semibold text-[var(--app-subtle)]">
              Free entry — just come
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Event card ─────────────────────────────────────────── */

function EventCard({ event }: { event: EventPublic }) {
  const date = formatDate(event);
  const time = formatTime(event);
  const href = registerHref(event);
  const image = event.bannerUrl ?? event.imageUrl ?? null;

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-card border border-[var(--app-border)] bg-[var(--app-surface)]',
        interactiveCardClass
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--app-dark-2)]">
        {image ? (
          <>
            <Media
              src={image}
              alt={event.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="transition duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--app-dark),transparent_58%)] opacity-80" />
          </>
        ) : (
          <DatePlate date={date} />
        )}
        <span className="absolute left-4 top-4">
          <DateBadge date={date} />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <RelativeBadge event={event} />
        <h3 className="font-ui text-heading-sm font-semibold leading-snug text-[var(--app-text)] line-clamp-2 transition duration-200 group-hover:text-[var(--app-primary-dark)]">
          {event.title}
        </h3>
        {event.description ? (
          <p className="font-ui text-body-sm leading-[1.75] text-[var(--app-muted)] line-clamp-2">
            {event.description}
          </p>
        ) : null}

        <div className="mt-auto space-y-1.5 border-t border-[var(--app-border)] pt-4">
          <p className="font-ui text-label font-semibold text-[var(--app-muted)]">
            {time ? `${date.full} · ${time}` : date.full}
          </p>
          {event.location ? (
            <p className="font-ui text-label text-[var(--app-subtle)] line-clamp-1">
              {event.location}
            </p>
          ) : null}
        </div>

        {href ? (
          <a
            href={href}
            className={buttonClass('outline', 'sm', 'mt-1 self-start')}
          >
            Register <Arrow />
          </a>
        ) : (
          <span className="mt-1 self-start font-ui text-label font-semibold text-[var(--app-subtle)]">
            Free entry — just come
          </span>
        )}
      </div>
    </article>
  );
}

/* ── Empty state ────────────────────────────────────────── */

function EmptyState() {
  return (
    <Panel
      tone="dark"
      interactive
      className="group flex flex-col items-center gap-5 p-8 text-center hover:bg-[var(--app-surface-2)] sm:p-12"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--app-primary)]/25 bg-[var(--app-primary)]/10 text-[var(--app-primary)] transition duration-300 group-hover:scale-105 group-hover:bg-[var(--app-primary)] group-hover:text-[var(--app-ink)]">
        <CalendarClock className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="font-ui text-heading-md font-semibold text-[var(--app-text)]">
        Events are on their way.
      </h3>
      <p className="max-w-sm font-ui text-body-sm leading-[1.85] text-[var(--app-muted)]">
        Nothing is scheduled right now. In the meantime, join us for Sunday
        Worship and Daily Prayer, Monday through Friday.
      </p>
      <PlanVisitTrigger className="mt-1">Plan a visit</PlanVisitTrigger>
    </Panel>
  );
}

const HORIZON_META: { key: EventHorizon; label: string }[] = [
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
  { key: 'later', label: 'On the horizon' },
];

/* ── Page ───────────────────────────────────────────────── */

export default async function EventsPage() {
  const rawEvents = await apiClient
    .listEvents()
    .catch(() => [] as EventPublic[]);
  const events = [...rawEvents]
    .filter(isUpcoming)
    .sort((a, b) => getTimestamp(a) - getTimestamp(b));

  const [featured, ...rest] = events;
  const groups = groupEventsByHorizon(rest);

  return (
    <Page>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
        ])}
      />
      {events
        .filter(event => Boolean(event.startAt))
        .map(event => (
          <JsonLd key={event.id} data={buildEventSchema(event)} />
        ))}

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <SiteHero
        backgroundImage="/Picflow/DSC00039 copy.webp"
        eyebrow="Events & Programs"
        title="What's happening at Wisdom Church."
        subtitle="Weekly services, special gatherings, and everything in between."
      />

      {/* ── 2. Ways to browse ────────────────────────────────── */}
      <Section compact tone="canvas">
        <Container>
          <nav aria-label="Browse events" className="grid gap-3 sm:grid-cols-3">
            {BROWSE.map((item, index) => {
              const NavIcon = item.icon;
              return (
                <ScrollFadeIn key={item.href} delay={index * 0.06} y={12}>
                  <Link
                    href={item.href}
                    className="group flex h-full items-center gap-4 rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-4 transition duration-200 motion-safe:hover:-translate-y-0.5 hover:border-[var(--app-primary)] hover:shadow-md sm:p-5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-[var(--app-primary-10)] text-[var(--app-primary-dark)] transition group-hover:bg-[var(--app-primary)] group-hover:text-[var(--app-ink)]">
                      <NavIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-ui text-body-md font-semibold text-[var(--app-ink)]">
                        {item.label}
                      </span>
                      <span className="block font-ui text-label text-[var(--app-muted)]">
                        {item.hint}
                      </span>
                    </span>
                    <Arrow className="shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                </ScrollFadeIn>
              );
            })}
          </nav>
        </Container>
      </Section>

      {/* ── 3. Weekly rhythm ─────────────────────────────────── */}
      <Section tone="canvas">
        <Container>
          <ScrollFadeIn>
            <SectionHeader
              eyebrow="Weekly rhythm"
              title="We gather every week."
              accent="Come as you are."
            />
          </ScrollFadeIn>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {WEEKLY.map((svc, i) => {
              const ServiceIcon = svc.icon;
              return (
                <ScrollFadeIn key={svc.day} delay={i * 0.09} className="h-full">
                  <div
                    className={cn(
                      'group flex h-full flex-col gap-5 rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8',
                      interactiveCardClass
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-ui text-heading-lg font-semibold leading-none text-[var(--app-ink)]">
                          {svc.day}
                        </p>
                        <p className="mt-2 flex items-center gap-2 font-ui text-body-sm font-bold text-[var(--app-primary-dark)]">
                          <Clock3 className="h-4 w-4" aria-hidden="true" />
                          {svc.time}
                        </p>
                      </div>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-button bg-[var(--app-primary-10)] text-[var(--app-primary-dark)] transition duration-300 group-hover:scale-105 group-hover:bg-[var(--app-primary)] group-hover:text-[var(--app-ink)]">
                        <ServiceIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/50" />

                    <div className="space-y-1.5">
                      <p className="font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
                        {svc.name}
                      </p>
                      <p className="font-ui text-body-sm leading-[1.8] text-[var(--app-muted)]">
                        {svc.description}
                      </p>
                      <p className="flex items-start gap-2 font-ui text-label leading-relaxed text-[var(--app-subtle)]">
                        <MapPin
                          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--app-primary-dark)]"
                          aria-hidden="true"
                        />
                        <span>{SERVICE_INFO.venue.full}</span>
                      </p>
                    </div>

                    <PlanVisitTrigger
                      variant="outline"
                      className="mt-auto self-start"
                    >
                      Plan a visit
                    </PlanVisitTrigger>
                  </div>
                </ScrollFadeIn>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ── 4. Upcoming events ───────────────────────────────── */}
      <Section tone="dark">
        <Container>
          <ScrollFadeIn className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Upcoming events"
              title="Special gatherings & programs."
              tone="dark"
              size="sm"
            />
            {events.length > 0 ? (
              <span className="inline-flex items-center gap-2 self-start rounded-badge border border-[var(--app-border)] px-4 py-2 font-ui text-label font-semibold text-[var(--app-muted)] sm:self-auto">
                <Sparkles className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                {events.length} event{events.length !== 1 ? 's' : ''} ahead
              </span>
            ) : null}
          </ScrollFadeIn>

          {events.length === 0 ? (
            <ScrollFadeIn>
              <EmptyState />
            </ScrollFadeIn>
          ) : (
            <div className="space-y-10">
              {featured ? (
                <ScrollFadeIn>
                  <EventFeature event={featured} />
                </ScrollFadeIn>
              ) : null}

              <div className="grid gap-8 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-12">
                <ScrollFadeIn className="lg:sticky lg:top-28 lg:self-start">
                  <EventCalendarStrip events={rawEvents} />
                </ScrollFadeIn>

                <div className="space-y-10">
                  {rest.length === 0 ? (
                    <p className="font-ui text-body-sm leading-[1.8] text-[var(--app-muted)]">
                      That&apos;s the only thing on the calendar right now.{' '}
                      <Link
                        href="/events/calendar"
                        className="text-[var(--app-primary-dark)] underline underline-offset-2"
                      >
                        Browse the full calendar
                      </Link>{' '}
                      for the months ahead.
                    </p>
                  ) : (
                    HORIZON_META.map(({ key, label }) => {
                      const items = groups[key];
                      if (items.length === 0) return null;
                      return (
                        <div key={key}>
                          <div className="flex items-baseline gap-3 border-b border-[var(--app-border)] pb-3">
                            <h3 className="font-ui text-heading-sm font-semibold text-[var(--app-text)]">
                              {label}
                            </h3>
                            <span className="font-ui text-label font-semibold text-[var(--app-subtle)]">
                              {items.length}
                            </span>
                          </div>
                          <div className="mt-5 grid gap-5 sm:grid-cols-2">
                            {items.map((event, i) => (
                              <ScrollFadeIn key={event.id} delay={i * 0.04}>
                                <EventCard event={event} />
                              </ScrollFadeIn>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* ── 5. CTA strip ─────────────────────────────────────── */}
      <Section compact tone="dark" className="bg-[var(--app-dark-2)]">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-ui text-heading-sm font-semibold text-[var(--app-text)]">
                Have a question about an event?
              </p>
              <p className="mt-1 font-ui text-body-sm text-[var(--app-muted)]">
                Our team is happy to help — reach out any time.
              </p>
            </div>
            <CtaLink href="/contact" variant="outline">
              Contact us <Arrow />
            </CtaLink>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
