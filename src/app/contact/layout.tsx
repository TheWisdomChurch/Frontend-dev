import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact & Service Times',
  description:
    'Plan your visit to The Wisdom Church (Wisdom House) in Lekki-Epe, Lagos. Sunday service times, directions to Honor Gardens, phone, email, and prayer requests.',
  path: '/contact',
  keywords: [
    'The Wisdom Church contact',
    'Wisdom House Lagos address',
    'Wisdom Church service time',
    'church near me Lekki',
    'Honor Gardens Lekki-Epe',
    'plan a visit Wisdom Church',
    'church directions Lagos',
  ],
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
