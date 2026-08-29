import type { Metadata } from 'next';

import MinistryPageTemplate from '@/features/ministries/MinistryPageTemplate';
import { MEN_MINISTRY_CONTENT as content } from '@/content/menMinistry';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: "Men's Ministry",
  description:
    "A men's ministry built on integrity, biblical brotherhood, and leadership that serves. Part of The Wisdom Church, Lagos.",
  path: '/ministries/men',
});

export default function MenMinistryPage() {
  return <MinistryPageTemplate content={content} />;
}
