import type { Metadata } from 'next';

import MinistryPageTemplate from '@/features/ministries/MinistryPageTemplate';
import { EVANGELISM_MINISTRY_CONTENT as content } from '@/content/evangelismMinistry';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Evangelism',
  description:
    'Sharing the gospel with clarity and courage, and serving our city with practical care. Part of The Wisdom Church, Lagos.',
  path: '/ministries/outreach',
});

export default function EvangelismMinistryPage() {
  return <MinistryPageTemplate content={content} />;
}
