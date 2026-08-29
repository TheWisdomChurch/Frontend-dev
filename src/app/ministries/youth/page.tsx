import type { Metadata } from 'next';

import MinistryPageTemplate from '@/features/ministries/MinistryPageTemplate';
import { YOUTH_MINISTRY_CONTENT as content } from '@/content/youthMinistry';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Youth Ministry',
  description:
    'A youth ministry built for conviction, community, and confident Christian living for ages 13–25. Part of The Wisdom Church, Lagos.',
  path: '/ministries/youth',
});

export default function YouthMinistryPage() {
  return <MinistryPageTemplate content={content} />;
}
