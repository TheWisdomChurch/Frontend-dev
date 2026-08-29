import type { Metadata } from 'next';

import MinistryPageTemplate from '@/features/ministries/MinistryPageTemplate';
import { OUTREACH_MINISTRY_CONTENT as content } from '@/content/outreachMinistry';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Outreach & Missions',
  description:
    "Practical expressions of God's love through service, evangelism, and community development. Part of The Wisdom Church, Lagos.",
  path: '/ministries/outreach',
});

export default function OutreachPage() {
  return <MinistryPageTemplate content={content} />;
}
