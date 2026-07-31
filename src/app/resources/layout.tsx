import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Next.js only carries a parent's title.template one level automatically —
// once this layout sets its own plain-string title, descendants two levels
// deep (sermons, blogs, publications, store) would silently lose the
// site-wide "| The Wisdom Church" suffix unless this re-declares the
// template explicitly for them to inherit.
export const metadata: Metadata = {
  title: {
    template: '%s | The Wisdom Church',
    default: 'Resources — Sermons, Media & Store',
  },
  description:
    'Access sermons, live broadcasts, publications, and church resources designed for spiritual growth.',
  openGraph: {
    title: 'Resources — Sermons, Media & Store | The Wisdom Church',
    description:
      'Access sermons, live broadcasts, publications, and church resources designed for spiritual growth.',
    url: 'https://wisdomchurchhq.org/resources',
    images: [{ url: 'https://wisdomchurchhq.org/og-image.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resources | The Wisdom Church',
    description: 'Sermons, media, publications and church resources.',
    images: ['https://wisdomchurchhq.org/og-image.webp'],
  },
  alternates: { canonical: '/resources' },
};

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
