export const SITE_URL = 'https://wisdomchurchhq.org';
export const SITE_NAME = 'The Wisdom Church';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;

export function canonicalUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return SITE_URL;
  return `${SITE_URL}${normalized}`;
}

interface EventSchemaInput {
  id: string;
  title: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  location?: string;
  imageUrl?: string;
  registerLink?: string | null;
}

// schema.org/Event — startDate is required by Google's rich-result
// validator, so events with no resolvable date are skipped by the caller
// rather than emitted with a fabricated one.
export function buildEventSchema(event: EventSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description || undefined,
    startDate: event.startAt,
    endDate: event.endAt || undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    image: event.imageUrl ? [event.imageUrl] : undefined,
    url: canonicalUrl(`/events/${event.id}`),
    location: {
      '@type': 'Place',
      name: event.location || 'Honor Gardens',
      address: {
        '@type': 'PostalAddress',
        streetAddress:
          'Honor Gardens, opposite Dominion City, Alasia, Lekki-Epe Expressway',
        addressLocality: 'Lagos',
        addressCountry: 'NG',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(event.registerLink
      ? {
          offers: {
            '@type': 'Offer',
            url: event.registerLink,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

interface RecurringEventSchemaInput {
  name: string;
  description?: string;
  dayOfWeek: string[];
  startTime: string;
}

// For fixed weekly services (no single startDate) — schema.org/Event
// requires a startDate even for recurring events, so this anchors to the
// next occurrence's date pattern via eventSchedule where supported, falling
// back to a plain recurring description otherwise.
export function buildRecurringEventSchema({
  name,
  description,
  dayOfWeek,
  startTime,
}: RecurringEventSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description: description || undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Honor Gardens',
      address: {
        '@type': 'PostalAddress',
        streetAddress:
          'Honor Gardens, opposite Dominion City, Alasia, Lekki-Epe Expressway',
        addressLocality: 'Lagos',
        addressCountry: 'NG',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    startTime,
    eventSchedule: {
      '@type': 'Schedule',
      byDay: dayOfWeek,
      startTime,
      repeatFrequency: 'P1W',
    },
  };
}

export interface BreadcrumbSchemaItem {
  name: string;
  path: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbSchemaItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

interface PersonSchemaInput {
  name: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  path?: string;
}

export function buildPersonSchema(person: PersonSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.role || undefined,
    description: person.bio || undefined,
    image: person.imageUrl || undefined,
    url: person.path ? canonicalUrl(person.path) : undefined,
    worksFor: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
