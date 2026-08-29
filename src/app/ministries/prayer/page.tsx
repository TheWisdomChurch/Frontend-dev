import type { Metadata } from 'next';

import MinistryPageTemplate from '@/features/ministries/MinistryPageTemplate';
import { PRAYER_MINISTRY_CONTENT as content } from '@/content/prayerMinistry';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Prayer Ministry',
  description:
    'A praying church — interceding for the church, the city, and one another, and keeping the altar burning. Part of The Wisdom Church, Lagos.',
  path: '/ministries/prayer',
});

export default function PrayerMinistryPage() {
  return <MinistryPageTemplate content={content} />;
}
