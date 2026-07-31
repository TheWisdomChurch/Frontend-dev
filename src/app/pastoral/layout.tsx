import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

// Single source of truth for /pastoral — page.tsx used to also export a
// partial `metadata` (title+description only), which silently won the
// <title> tag while this layout's openGraph/twitter kept showing a
// different title. Consolidated here so every surface agrees.
export const metadata: Metadata = buildPageMetadata({
  title: 'Pastoral Care',
  description:
    'Pastoral counseling and prayer support at The Wisdom Church. Confidential, caring, and always available.',
  path: '/pastoral',
});

export default function PastoralLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
