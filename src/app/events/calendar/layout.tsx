import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

// events/calendar/page.tsx is a Client Component (needs interactive
// filtering/state) and can't export its own `metadata`, so it inherits
// this layout's — otherwise it would fall through to events/layout.tsx
// and wrongly self-canonicalize to /events.
export const metadata: Metadata = buildPageMetadata({
  title: 'Events Calendar',
  description:
    'Browse the full calendar of upcoming services, programs, and special gatherings at The Wisdom Church.',
  path: '/events/calendar',
});

export default function EventsCalendarLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
