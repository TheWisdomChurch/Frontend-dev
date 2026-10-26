import type { EventPublic } from '@/lib/apiTypes';

export function getEventDetailHref(eventId: string): string {
  return `/events/${encodeURIComponent(eventId)}`;
}

export function getEventRegistrationHref(event: EventPublic): string | null {
  const link = event.registerLink?.trim();
  if (link) {
    if (link.startsWith('/') && !link.startsWith('//')) return link;

    try {
      const url = new URL(link);
      if (url.protocol === 'https:' || url.protocol === 'http:') return link;
    } catch {
      // Fall through to the associated public form when a CMS link is invalid.
    }
  }

  return event.formSlug
    ? `/forms/${encodeURIComponent(event.formSlug)}`
    : null;
}
