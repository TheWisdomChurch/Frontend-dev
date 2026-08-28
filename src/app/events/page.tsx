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
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';

import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { Media } from '@/shared/ui/Media';
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
  isUpcomingEvent as isUpcoming,
} from '@/shared/utils/eventDate';
import {
  Container,
  Page,
  SectionHeader,
  CtaLink,
  Panel,
  Section,
  interactiveCardClass,
} from '@/shared/ui/layout';

/* ── Utilities ──────────────────────────────────────────── */

// Kept outside the component body so the impure Date.now() read happens at
// call time (each request), not as a value captured during render.
function registerHref(event: EventPublic): string | null {
  if (event.registerLink) return event.registerLink;
  if (event.formSlug) return `/forms/${event.formSlug}`;
  return null;
}

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

/* ── Event card ─────────────────────────────────────────── */

function EventCard({ event }: { event: EventPublic }) {
  const date = formatDate(event);
  const time = formatTime(event);
  const href = registerHref(event);
  const imgSrc = event.bannerUrl ?? event.imageUrl ?? null;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-card border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] ${interactiveCardClass}`}
    >
      {/* Image / date block */}
      <div className="relative aspect-video overflow-hidden bg-[var(--app-dark-2)]">
        {imgSrc ? (
          <Media
            src={imgSrc}
            alt={event.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-[center_22%] sm:object-center transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          /* No-image: bold date display */
          <div className="flex h-full flex-col items-center justify-center gap-1">
            <span className="font-ui text-caption font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              {date.month}
            </span>
            <span className="font-ui text-display-sm font-medium leading-none text-white/90">
              {date.day}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-dark)]/70 via-transparent to-transparent" />

        {/* Date badge — only when there's an image */}
        {imgSrc && (
          <div className="absolute bottom-3 left-4 flex items-baseline gap-2">
            <span className="font-ui text-heading-md font-semibold leading-none text-white">
              {date.day}
            </span>
            <span className="font-ui text-eyebrow font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
              {date.month}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5 pt-4">
        <h3 className="font-ui text-heading-sm font-semibold leading-snug text-white line-clamp-2 transition duration-200 group-hover:text-[var(--app-primary)]/90">
          {event.title}
        </h3>

        {event.description && (
          <p className="font-ui text-body-sm leading-[1.8] text-white/65 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="mt-auto space-y-1.5 border-t border-white/8 pt-4">
          {time && (
            <p className="font-ui text-label font-semibold text-white/55">
              {date.full} · {time}
            </p>
          )}
          {event.location && (
            <p className="font-ui text-label text-white/38 line-clamp-1">
              {event.location}
            </p>
          )}
        </div>

        {href ? (
          <a
            href={href}
            className="group/action mt-2 inline-flex items-center gap-2 self-start rounded-button border border-[var(--app-primary)]/40 px-5 py-2.5 font-ui text-label font-semibold text-[var(--app-primary)] transition duration-200 hover:bg-[var(--app-primary)] hover:text-[var(--app-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
          >
            Register{' '}
            <Arrow className="transition-transform group-hover/action:translate-x-1" />
          </a>
        ) : (
          <span className="mt-2 inline-flex items-center gap-2 self-start rounded-button border border-white/12 px-5 py-2.5 font-ui text-label font-semibold text-white/35">
            Free entry
          </span>
        )}
      </div>
    </article>
  );
}

/* ── Empty state ────────────────────────────────────────── */

function EmptyState() {
  return (
    <ScrollFadeIn>
      <Panel
        tone="dark"
        interactive
        className="group flex flex-col items-center gap-5 p-6 text-center hover:bg-white/[0.05] sm:p-10 lg:p-12"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--app-primary)]/25 bg-[var(--app-primary)]/10 text-[var(--app-primary)] transition duration-300 group-hover:scale-105 group-hover:bg-[var(--app-primary)] group-hover:text-[var(--app-ink)]">
          <CalendarClock className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="font-ui text-heading-md font-semibold text-white">
          Events are on their way.
        </h3>
        <p className="max-w-sm font-ui text-body-sm leading-[1.85] text-white/65">
          Nothing is scheduled right now. In the meantime, join us for Sunday
          Worship and Daily Prayer, Monday through Friday.
        </p>
        <PlanVisitTrigger className="mt-1">Plan a visit</PlanVisitTrigger>
      </Panel>
    </ScrollFadeIn>
  );
}

/* ── Page ───────────────────────────────────────────────── */

export default async function EventsPage() {
  const rawEvents = await apiClient
    .listEvents()
    .catch(() => [] as EventPublic[]);
  const events = [...rawEvents]
    .filter(isUpcoming)
    .sort((a, b) => getTimestamp(a) - getTimestamp(b));

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
        eyebrow="Events & Programs"
        title="What's happening at Wisdom Church."
        subtitle="Weekly services, special gatherings, and everything in between."
        compact
      />

      {/* ── 1.5 Sub-nav — other ways to browse events ────────── */}
      <Section compact tone="canvas">
        <Container>
          <nav
            aria-label="Events sections"
            className="flex flex-wrap gap-2 py-5"
          >
            {[
              {
                href: '/events/weekly',
                label: 'Weekly Services',
                icon: CalendarDays,
              },
              {
                href: '/events/calendar',
                label: 'Calendar View',
                icon: CalendarRange,
              },
              {
                href: '/events/upcoming',
                label: 'Upcoming Events',
                icon: List,
              },
            ].map((item, index) => {
              const NavIcon = item.icon;
              return (
                <ScrollFadeIn
                  key={item.href}
                  delay={index * 0.06}
                  y={12}
                  className="flex-1 sm:min-w-52 sm:flex-none"
                >
                  <Link
                    href={item.href}
                    className="group flex min-h-12 w-full items-center justify-between gap-4 rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 font-ui text-label font-bold text-[var(--app-ink)] transition duration-200 motion-safe:hover:-translate-y-0.5 hover:border-[var(--app-primary)] hover:shadow-md"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-button bg-[var(--app-primary-10)] text-[var(--app-primary-dark)] transition group-hover:bg-[var(--app-primary)] group-hover:text-[var(--app-ink)]">
                        <NavIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      {item.label}
                    </span>
                    <Arrow className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </ScrollFadeIn>
              );
            })}
          </nav>
        </Container>
      </Section>

      {/* ── 2. Weekly rhythm — canvas, always present ────────── */}
      <Section tone="canvas">
        <Container>
          <ScrollFadeIn>
            <SectionHeader
              eyebrow="Weekly rhythm"
              title="We gather every week."
              accent="Come as you are."
            />
          </ScrollFadeIn>

          {/* Two service panels */}
          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2">
            {WEEKLY.map((svc, i) => {
              const ServiceIcon = svc.icon;
              return (
                <ScrollFadeIn key={svc.day} delay={i * 0.09} className="h-full">
                  <div
                    className={`group flex h-full flex-col gap-5 rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-5 sm:p-7 lg:p-8 ${interactiveCardClass}`}
                  >
                    {/* Day + time */}
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

                    {/* Gold rule */}
                    <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/50" />

                    {/* Service info */}
                    <div className="space-y-1.5">
                      <p className="font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
                        {svc.name}
                      </p>
                      <p className="font-ui text-body-sm leading-[1.8] text-[var(--app-ink)]/65">
                        {svc.description}
                      </p>
                      <p className="flex items-start gap-2 font-ui text-label leading-relaxed text-[var(--app-ink)]/55">
                        <MapPin
                          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--app-primary-dark)]"
                          aria-hidden="true"
                        />
                        <span>{SERVICE_INFO.venue.full}</span>
                      </p>
                    </div>

                    {/* CTA */}
                    <PlanVisitTrigger className="mt-auto self-start border-[var(--app-border)] bg-transparent text-[var(--app-ink)] hover:border-[var(--app-primary)] hover:bg-[var(--app-primary)]">
                      Plan a visit
                    </PlanVisitTrigger>
                  </div>
                </ScrollFadeIn>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ── 3. Upcoming events — dark, API-driven ────────────── */}
      <Section tone="dark">
        <Container>
          {/* Header */}
          <ScrollFadeIn className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Upcoming events"
              title="Special gatherings & programs."
              tone="dark"
              size="sm"
            />
            {events.length > 0 && (
              <span className="inline-flex items-center gap-2 self-start rounded-badge border border-white/12 px-4 py-2 font-ui text-label font-semibold text-white/55 sm:self-auto">
                <Sparkles className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                {events.length} event{events.length !== 1 ? 's' : ''}
              </span>
            )}
          </ScrollFadeIn>

          {/* Content */}
          {events.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => (
                <ScrollFadeIn key={event.id} delay={i * 0.05}>
                  <EventCard event={event} />
                </ScrollFadeIn>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* ── 4. CTA strip ─────────────────────────────────────── */}
      <Section compact tone="dark" className="bg-[var(--app-dark-2)]">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-ui text-heading-sm font-semibold text-white">
                Have a question about an event?
              </p>
              <p className="mt-1 font-ui text-body-sm text-white/55">
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
