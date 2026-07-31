import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Leadership Team',
  description:
    'Meet the pastoral and ministry leadership team guiding The Wisdom Church with prayer, care, and biblical conviction.',
  path: '/leadership',
});

export default function LeadershipLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
