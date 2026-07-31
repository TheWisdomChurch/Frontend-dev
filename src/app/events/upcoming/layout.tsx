import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

// events/upcoming/page.tsx is a Client Component and can't export its own
// `metadata` — without this layout it inherits events/layout.tsx and
// wrongly self-canonicalizes to /events.
export const metadata: Metadata = buildPageMetadata({
  title: 'Upcoming Events',
  description:
    "See what's coming up next at The Wisdom Church — services, programs, and special events happening soon.",
  path: '/events/upcoming',
});

export default function EventsUpcomingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
