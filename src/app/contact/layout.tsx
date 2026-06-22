import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Contact & Service Times',
  description:
    'Plan your visit to The Wisdom Church in Lagos. Get service times, directions, phone, and email contact details.',
  openGraph: {
    title: 'Contact & Service Times | The Wisdom Church',
    description:
      'Plan your visit to The Wisdom Church in Lagos. Get service times, directions, phone, and email contact details.',
    url: 'https://wisdomchurchhq.org/contact',
    images: [{ url: 'https://wisdomchurchhq.org/og-image.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact & Service Times | The Wisdom Church',
    description: 'Plan your visit to The Wisdom Church in Lagos.',
    images: ['https://wisdomchurchhq.org/og-image.webp'],
  },
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
