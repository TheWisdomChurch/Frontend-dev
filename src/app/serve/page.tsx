import type { Metadata } from 'next';

import JoinUs from '@/features/events/JoinUs';
import PageHero from '@/features/hero/PageHero';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Serve at The Wisdom Church',
  description:
    'Use your gifts, join a ministry team, and serve people alongside the Wisdom Church family.',
  path: '/serve',
});

export default function ServePage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Serve"
        title="Use your gifts. Build with purpose."
        subtitle="Find a team, learn what serving involves, and take your next step with clear guidance from a team leader."
      />
      <JoinUs />
    </>
  );
}
