import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Testimonies — Lives Transformed',
  description:
    'Read faith-building testimonies of healing, restoration, and transformation from The Wisdom Church community.',
  openGraph: {
    title: 'Testimonies — Lives Transformed | The Wisdom Church',
    description:
      'Read faith-building testimonies of healing, restoration, and transformation from The Wisdom Church community.',
    url: 'https://wisdomchurchhq.org/testimonies',
    images: [{ url: 'https://wisdomchurchhq.org/og-image.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testimonies | The Wisdom Church',
    description: 'Testimonies of healing, restoration, and transformation.',
    images: ['https://wisdomchurchhq.org/og-image.webp'],
  },
  alternates: { canonical: '/testimonies' },
};

export default function TestimoniesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
