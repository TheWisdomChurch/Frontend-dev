import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Sermons & Messages',
  description:
    'Watch and listen to recent sermons and biblical teachings from The Wisdom Church.',
  openGraph: {
    title: 'Sermons & Messages | The Wisdom Church',
    description:
      'Watch and listen to recent sermons and biblical teachings from The Wisdom Church.',
    url: 'https://wisdomchurchhq.org/resources/sermons',
    images: [{ url: 'https://wisdomchurchhq.org/og-image.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sermons & Messages | The Wisdom Church',
    description: 'Watch and listen to recent sermons and biblical teachings.',
    images: ['https://wisdomchurchhq.org/og-image.webp'],
  },
  alternates: { canonical: '/resources/sermons' },
};

export default function SermonsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
