import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildPageMetadata } from '@/lib/seo';

const RESOURCES_TITLE = 'Resources — Sermons, Media & Store';
const RESOURCES_DESCRIPTION =
  'Access sermons, live broadcasts, publications, and church resources designed for spiritual growth.';

// Next.js only carries a parent's title.template one level automatically —
// once this layout sets its own plain-string title, descendants two levels
// deep (sermons, blogs, publications, store) would silently lose the
// site-wide "| The Wisdom Church" suffix unless this re-declares the
// template explicitly for them to inherit.
export const metadata: Metadata = {
  ...buildPageMetadata({
    title: RESOURCES_TITLE,
    description: RESOURCES_DESCRIPTION,
    path: '/resources',
  }),
  title: {
    template: '%s | The Wisdom Church',
    default: RESOURCES_TITLE,
  },
};

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
