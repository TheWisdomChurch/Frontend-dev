import type { Metadata } from 'next';

import OnlineGiving from '@/features/events/OnlineGiving';
import PageHero from '@/features/hero/PageHero';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Give Online',
  description:
    'Support the work of The Wisdom Church through secure giving options and verified account information.',
  path: '/giving',
});

export default function GivingPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Generosity"
        title="Give with purpose."
        subtitle="Your generosity helps build people, strengthen ministry, and extend the work of the church."
      />
      <OnlineGiving />
    </>
  );
}
