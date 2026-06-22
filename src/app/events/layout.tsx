import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Events & Programs',
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
  alternates: { canonical: '/events' },
};

export default function EventsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
