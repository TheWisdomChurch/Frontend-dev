import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildHreflangAlternates } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Leadership Team',
  description:
    'Meet the pastoral and ministry leadership team guiding The Wisdom Church with prayer, care, and biblical conviction.',
  openGraph: {
    title: 'Leadership Team | The Wisdom Church',
    description:
      'Meet the pastoral and ministry leadership team guiding The Wisdom Church with prayer, care, and biblical conviction.',
    url: 'https://wisdomchurchhq.org/leadership',
    images: [{ url: 'https://wisdomchurchhq.org/og-image.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leadership Team | The Wisdom Church',
    description: 'Meet the pastoral and ministry leadership team.',
    images: ['https://wisdomchurchhq.org/og-image.webp'],
  },
  alternates: {
    canonical: '/leadership',
    languages: buildHreflangAlternates('/leadership'),
  },
};

export default function LeadershipLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
