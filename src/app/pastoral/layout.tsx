import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildHreflangAlternates } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Pastoral Care & Counseling',
  description:
    'Access pastoral support, counseling, prayer, and care pathways at The Wisdom Church.',
  openGraph: {
    title: 'Pastoral Care & Counseling | The Wisdom Church',
    description:
      'Access pastoral support, counseling, prayer, and care pathways at The Wisdom Church.',
    url: 'https://wisdomchurchhq.org/pastoral',
    images: [{ url: 'https://wisdomchurchhq.org/og-image.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pastoral Care & Counseling | The Wisdom Church',
    description: 'Access pastoral support, counseling, prayer, and care.',
    images: ['https://wisdomchurchhq.org/og-image.webp'],
  },
  alternates: {
    canonical: '/pastoral',
    languages: buildHreflangAlternates('/pastoral'),
  },
};

export default function PastoralLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
