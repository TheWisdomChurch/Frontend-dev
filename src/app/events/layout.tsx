import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildHreflangAlternates } from '@/lib/seo';

// Re-declares the site-wide title template — see resources/layout.tsx for
// why: without this, weekly/calendar/upcoming (two levels below root) would
// silently lose the "| The Wisdom Church" suffix.
export const metadata: Metadata = {
  title: {
    template: '%s | The Wisdom Church',
    default: 'Events & Programs',
  },
  description:
    'Explore upcoming church events, weekly programs, and special gatherings at The Wisdom Church.',
  openGraph: {
    title: 'Events & Programs | The Wisdom Church',
    description:
      'Explore upcoming church events, weekly programs, and special gatherings at The Wisdom Church.',
    url: 'https://wisdomchurchhq.org/events',
    images: [{ url: 'https://wisdomchurchhq.org/og-image.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events & Programs | The Wisdom Church',
    description: 'Explore upcoming church events and special gatherings.',
    images: ['https://wisdomchurchhq.org/og-image.webp'],
  },
  alternates: {
    canonical: '/events',
    languages: buildHreflangAlternates('/events'),
  },
};

export default function EventsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
