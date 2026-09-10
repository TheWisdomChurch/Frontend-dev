import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact & Service Times',
  description:
    'Plan your visit to The Wisdom Church in Lagos. Sunday service times, directions to Honor Gardens, phone, email, and prayer requests.',
  path: '/contact',
  keywords: [
    'The Wisdom Church contact',
    'Wisdom Church Lagos address',
    'Wisdom Church service time',
    'church near me Lagos',
    'Honor Gardens Lagos',
    'plan a visit Wisdom Church',
    'church directions Lagos',
  ],
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
