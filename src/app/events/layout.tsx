import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

const EVENTS_TITLE = 'Events & Programs';
const EVENTS_DESCRIPTION =
  'Explore upcoming church events, weekly programs, and special gatherings at The Wisdom Church.';

// Re-declares the site-wide title template — see resources/layout.tsx for
// why: without this, weekly/calendar/upcoming (two levels below root) would
// silently lose the "| The Wisdom Church" suffix.
export const metadata: Metadata = {
  ...buildPageMetadata({
    title: EVENTS_TITLE,
    description: EVENTS_DESCRIPTION,
    path: '/events',
  }),
  title: {
    template: '%s | The Wisdom Church',
    default: EVENTS_TITLE,
  },
};

export default function EventsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
