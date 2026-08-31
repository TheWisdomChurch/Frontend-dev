import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/shared/constants/contactInfo';

export const SITE_URL = 'https://wisdomchurchhq.org';
export const SITE_NAME = 'The Wisdom Church';
export const SITE_ALT_NAME = 'Wisdom House';
export const SITE_TAGLINE = 'Experience God’s transforming power';
export const SITE_DESCRIPTION =
  'The Wisdom Church (Wisdom House) is a vibrant, Spirit-filled church in Lekki-Epe, Lagos, Nigeria — where lives are transformed through worship, sound biblical teaching, prayer, and authentic community. Join us in person or online this Sunday.';

// The church brand mark, used for the Organization `logo` in structured data
// and as the shared social preview image. The user asked for this exact file.
export const SITE_LOGO = `${SITE_URL}/OIP.webp`;
export const DEFAULT_OG_IMAGE = SITE_LOGO;

// Stable @id anchors so every JSON-LD graph points at the same entities.
export const ORG_ID = `${SITE_URL}/#church`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

// Site-wide focus keywords. Page keywords are merged on top of these.
export const SITE_KEYWORDS = [
  'The Wisdom Church',
  'Wisdom House',
  'Wisdom House HQ',
  'church in Lagos',
  'church in Lekki',
  'Lekki-Epe church',
  'Spirit-filled church Lagos',
  'Pentecostal church Nigeria',
  'Sunday service Lagos',
  'online church service',
  'biblical teaching',
  'sermons Lagos',
  'prayer meeting Lagos',
  'Christian community Lagos',
];

export function canonicalUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return SITE_URL;
  return `${SITE_URL}${normalized}`;
}

// Google prefers E.164 for `telephone`. The stored number is the local
// Nigerian format ("0706 999 5333").
const INTL_PHONE = `+234${CONTACT_INFO.phone.replace(/\D/g, '').replace(/^0/, '')}`;

const VENUE_ADDRESS = {
  '@type': 'PostalAddress' as const,
  streetAddress: `${SERVICE_INFO.venue.name}, ${SERVICE_INFO.venue.streetAddress}`,
  addressLocality: SERVICE_INFO.venue.locality,
  addressRegion: 'Lagos',
  addressCountry: SERVICE_INFO.venue.country,
};

const VENUE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  SERVICE_INFO.venue.full
)}`;

/**
 * The church as a single rich entity — Church + Place + LocalBusiness signals
 * Google uses for the Knowledge Panel, local pack, and "church near me".
 * Emitted once, in the root layout.
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Church', 'PlaceOfWorship'],
    '@id': ORG_ID,
    name: SITE_NAME,
    alternateName: [SITE_ALT_NAME, 'Wisdom House HQ'],
    legalName: SITE_NAME,
    slogan: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: SITE_LOGO,
      width: 638,
      height: 630,
      caption: `${SITE_NAME} logo`,
    },
    image: SITE_LOGO,
    telephone: INTL_PHONE,
    email: CONTACT_INFO.email,
    address: VENUE_ADDRESS,
    hasMap: VENUE_MAP_URL,
    areaServed: [
      { '@type': 'City', name: 'Lagos' },
      { '@type': 'Country', name: 'Nigeria' },
    ],
    knowsLanguage: ['en'],
    isAccessibleForFree: true,
    publicAccess: true,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: INTL_PHONE,
      email: CONTACT_INFO.email,
      areaServed: 'NG',
      availableLanguage: ['English'],
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'https://schema.org/Sunday',
        opens: '09:00',
        closes: '12:00',
        description: SERVICE_INFO.sunday.label,
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'https://schema.org/Monday',
          'https://schema.org/Tuesday',
          'https://schema.org/Wednesday',
          'https://schema.org/Thursday',
          'https://schema.org/Friday',
        ],
        opens: '07:00',
        closes: '08:00',
        description: SERVICE_INFO.dailyPrayer.label,
      },
    ],
    sameAs: [
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.youtube,
      SOCIAL_LINKS.x,
    ],
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/resources?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

interface VideoSchemaInput {
  name: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  viewCount?: string;
}

// ISO-8601 duration for schema.org — accepts "12:34", "1:02:03" or a value
// that is already an ISO string, and returns undefined for anything unparseable
// so Google never sees a malformed duration.
function toIsoDuration(value?: string): string | undefined {
  if (!value) return undefined;
  if (/^P/i.test(value.trim())) return value.trim();
  const parts = value.split(':').map(n => Number(n));
  if (
    parts.some(n => Number.isNaN(n)) ||
    parts.length < 2 ||
    parts.length > 3
  ) {
    return undefined;
  }
  const [h, m, s] = parts.length === 3 ? parts : [0, parts[0], parts[1]];
  const iso = `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s ? `${s}S` : ''}`;
  return iso === 'PT' ? 'PT0S' : iso;
}

// schema.org/VideoObject for a sermon — makes messages eligible for Google
// video rich results and video indexing. Emitted as an ItemList on the
// sermons page for the most recent messages.
export function buildVideoSchema(video: VideoSchemaInput) {
  const digits = video.viewCount?.replace(/\D/g, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description || video.name,
    thumbnailUrl: video.thumbnailUrl ? [video.thumbnailUrl] : undefined,
    uploadDate: video.uploadDate,
    duration: toIsoDuration(video.duration),
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    publisher: { '@id': ORG_ID },
    ...(digits
      ? {
          interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/WatchAction',
            userInteractionCount: Number(digits),
          },
        }
      : {}),
  };
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  /** Page-specific focus keywords — merged on top of SITE_KEYWORDS. */
  keywords?: string[];
  /** Page-specific OG/Twitter image (absolute or root-relative). Falls back to
   *  the brand mark. */
  image?: string;
  imageAlt?: string;
  ogType?: 'website' | 'article' | 'profile';
  /** Keep the page out of the index (thin/utility/transactional pages). */
  noindex?: boolean;
  /** For ogType 'article' — publication + author metadata. */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
  };
}

function absoluteImage(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  return `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
}

// Standard OG/Twitter/canonical block for pages that only declared a bare
// title+description — fills the gap without repeating the domain/OG image
// inline in every page file.
// Single-locale site (English, served to both US and NG audiences) with no
// actual per-region content variants — hreflang is self-referencing for
// both declared locales plus x-default, never pointing at a different URL.
export function buildHreflangAlternates(path: string) {
  const url = canonicalUrl(path);
  return {
    'en-US': url,
    'en-NG': url,
    'x-default': url,
  };
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  image,
  imageAlt,
  ogType = 'website',
  noindex = false,
  article,
}: PageMetadataInput) {
  const ogImage = absoluteImage(image);
  const alt = imageAlt ?? `${title} — ${SITE_NAME}`;
  const mergedKeywords = Array.from(
    new Set([...(keywords ?? []), ...SITE_KEYWORDS])
  );
  const isCustom = ogImage !== DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: canonicalUrl(path),
      languages: buildHreflangAlternates(path),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url: canonicalUrl(path),
      siteName: SITE_NAME,
      images: [
        isCustom
          ? { url: ogImage, width: 1200, height: 630, alt }
          : { url: ogImage, width: 638, height: 630, alt },
      ],
      locale: 'en_US',
      type: ogType,
      ...(ogType === 'article' && article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: article.authors ?? [SITE_NAME],
          }
        : {}),
    },
    twitter: {
      card: isCustom ? ('summary_large_image' as const) : ('summary' as const),
      title,
      description,
      images: [{ url: ogImage, alt }],
    },
  };
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
    image: event.imageUrl ? [event.imageUrl] : [SITE_LOGO],
    url: canonicalUrl(`/events/${event.id}`),
    location: {
      '@type': 'Place',
      name: event.location || SERVICE_INFO.venue.name,
      address: VENUE_ADDRESS,
      hasMap: VENUE_MAP_URL,
    },
    organizer: {
      '@id': ORG_ID,
      '@type': 'Church',
      name: SITE_NAME,
      url: SITE_URL,
    },
    performer: { '@id': ORG_ID },
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
      name: SERVICE_INFO.venue.name,
      address: VENUE_ADDRESS,
      hasMap: VENUE_MAP_URL,
    },
    organizer: {
      '@id': ORG_ID,
      '@type': 'Church',
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

interface MinistrySchemaInput {
  name: string;
  description: string;
  path: string;
  image?: string;
  leader?: { name: string; role?: string; image?: string };
}

// A church ministry modelled as a department of the parent Organization, with
// its lead as a member. Emitted per ministry page for richer entity coverage.
export function buildMinistrySchema({
  name,
  description,
  path,
  image,
  leader,
}: MinistrySchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: `${SITE_NAME} — ${name}`,
    description,
    url: canonicalUrl(path),
    image: image ? absoluteImage(image) : SITE_LOGO,
    parentOrganization: {
      '@id': ORG_ID,
      '@type': 'Church',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(leader
      ? {
          member: {
            '@type': 'Person',
            name: leader.name,
            jobTitle: leader.role || undefined,
            image: leader.image ? absoluteImage(leader.image) : undefined,
            worksFor: { '@id': ORG_ID },
          },
        }
      : {}),
  };
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
      '@id': ORG_ID,
      '@type': 'Church',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
