import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Testimonies — Lives Transformed',
  description:
    'Read faith-building testimonies of healing, restoration, and transformation from The Wisdom Church community.',
  path: '/testimonies',
});

export default function TestimoniesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
