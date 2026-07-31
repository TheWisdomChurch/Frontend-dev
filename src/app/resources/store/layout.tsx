import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

// resources/store/page.tsx is a Client Component (cart/filter state) and
// can't export its own `metadata` — without this layout it inherits
// resources/layout.tsx and wrongly self-canonicalizes to /resources.
export const metadata: Metadata = buildPageMetadata({
  title: 'Wisdom Church Store',
  description:
    'Shop faith-inspired clothing, accessories, and ministry essentials from The Wisdom Church store.',
  path: '/resources/store',
});

export default function StoreLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
