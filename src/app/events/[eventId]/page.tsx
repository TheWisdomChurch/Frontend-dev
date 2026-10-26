import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
} from 'lucide-react';

import { apiClient, isApiError } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';
import {
  getEventDetailHref,
  getEventRegistrationHref,
} from '@/features/events/eventLinks';
import {
  buildBreadcrumbSchema,
  buildEventSchema,
  buildPageMetadata,
} from '@/lib/seo';
import {
  formatEventDateParts,
  formatEventTime,
  getEventTimestamp,
  UNKNOWN_EVENT_TIMESTAMP,
} from '@/shared/utils/eventDate';
import JsonLd from '@/shared/seo/JsonLd';
import { Media } from '@/shared/ui/Media';
import { Container, CtaLink, Page, Section } from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';

type EventRouteProps = { params: Promise<{ eventId: string }> };

async function loadEvent(eventId: string): Promise<EventPublic | null> {
  try {
    return await apiClient.getEvent(eventId);
  } catch (error) {
    if (isApiError(error) && error.statusCode === 404) return null;
    throw error;
  }
}

export async function generateMetadata({
  params,
}: EventRouteProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await loadEvent(eventId);

  if (!event) {
    return buildPageMetadata({
      title: 'Event details',
      description:
        'View event details and registration information at The Wisdom Church.',
      path: getEventDetailHref(eventId),
    });
  }

  return buildPageMetadata({
    title: event.title,
    description:
      event.description ??
      `Event details for ${event.title} at The Wisdom Church.`,
    path: getEventDetailHref(event.id),
    image: event.bannerUrl ?? event.imageUrl,
  });
}

export default async function EventDetailPage({ params }: EventRouteProps) {
  const { eventId } = await params;
  const event = await loadEvent(eventId);
  if (!event) notFound();

  const dateParts = formatEventDateParts(event);
  const eventTime = formatEventTime(event);
  const eventTimestamp = getEventTimestamp(event);
  const registration = getEventRegistrationHref(event);
  const image = event.bannerUrl ?? event.imageUrl;

  return (
    <Page tone="surface" className="bg-[var(--app-dark)] text-[var(--app-text)]">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          { name: event.title, path: getEventDetailHref(event.id) },
        ])}
      />
      {eventTimestamp !== UNKNOWN_EVENT_TIMESTAMP ? (
        <JsonLd data={buildEventSchema(event)} />
      ) : null}

      <Section
        tone="dark"
        className="relative isolate overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_80%_55%_at_50%_10%,color-mix(in_srgb,var(--app-primary)_18%,transparent)_0%,transparent_70%),var(--app-dark)] py-12 text-white sm:py-20 lg:py-28"
      >
        <Container>
          <Link
            href="/events"
            className="mb-9 inline-flex items-center gap-2 font-ui text-sm font-semibold text-white/70 transition-colors hover:text-[var(--app-primary-light)]"
          >
            <ArrowLeft className="h-4 w-4" />
            All events
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-[var(--app-primary-light)]">
                Events &amp; programs
              </p>
              <h1 className="mt-4 font-headline text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>
              {event.description ? (
                <p className="mt-6 max-w-2xl font-ui text-base leading-8 text-white/75 sm:text-lg">
                  {event.description}
                </p>
              ) : null}

              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <dt className="flex items-center gap-2 font-ui text-xs font-bold uppercase tracking-wider text-white/55">
                    <CalendarDays className="h-4 w-4 text-[var(--app-primary-light)]" />
                    Date
                  </dt>
                  <dd className="mt-2 font-ui text-sm font-semibold text-white">
                    {dateParts.full}
                  </dd>
                </div>
                {eventTime ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <dt className="flex items-center gap-2 font-ui text-xs font-bold uppercase tracking-wider text-white/55">
                      <Clock3 className="h-4 w-4 text-[var(--app-primary-light)]" />
                      Time
                    </dt>
                    <dd className="mt-2 font-ui text-sm font-semibold text-white">
                      {eventTime} WAT
                    </dd>
                  </div>
                ) : null}
                {event.location ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:col-span-2">
                    <dt className="flex items-center gap-2 font-ui text-xs font-bold uppercase tracking-wider text-white/55">
                      <MapPin className="h-4 w-4 text-[var(--app-primary-light)]" />
                      Location
                    </dt>
                    <dd className="mt-2 font-ui text-sm font-semibold text-white">
                      {event.location}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {registration ? (
                <a
                  href={registration}
                  className={buttonClass('primary', 'md', 'mt-8')}
                >
                  Register for this event <ArrowRight />
                </a>
              ) : (
                <p className="mt-8 font-ui text-sm text-white/65">
                  Registration details will be shared soon.
                </p>
              )}
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-[var(--app-dark-2)] shadow-2xl">
              {image ? (
                <Media
                  src={image}
                  alt={event.title}
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--app-primary)_20%,transparent),transparent_70%)] p-8 text-center font-headline text-3xl font-bold text-white/80">
                  {event.title}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <Section
        tone="canvas"
        className="bg-[var(--app-canvas-2)] py-12 sm:py-16"
      >
        <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold text-[var(--app-text)]">
              Planning to join us?
            </h2>
            <p className="mt-2 font-ui text-sm leading-7 text-[var(--app-muted)]">
              Review the details above and save your place for {event.title}.
            </p>
          </div>
          {registration ? (
            <a
              href={registration}
              className={buttonClass('dark', 'md', 'shrink-0')}
            >
              Register now <ArrowRight />
            </a>
          ) : (
            <CtaLink href="/contact" variant="outline">
              Ask us a question <ArrowRight />
            </CtaLink>
          )}
        </Container>
      </Section>
    </Page>
  );
}
