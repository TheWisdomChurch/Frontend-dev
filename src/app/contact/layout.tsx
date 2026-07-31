import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact & Service Times',
  description:
    'Plan your visit to The Wisdom Church in Lagos. Get service times, directions, phone, and email contact details.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
