import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Sermons & Messages',
  description:
    'Watch and listen to recent sermons and biblical teachings from The Wisdom Church.',
  path: '/resources/sermons',
});

export default function SermonsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
