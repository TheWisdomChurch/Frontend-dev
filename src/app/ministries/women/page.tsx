import type { Metadata } from 'next';

import MinistryPageTemplate, {
  type MinistryPageConfig,
} from '@/features/ministries/MinistryPageTemplate';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: "Women's Ministry",
  description:
    "A women's ministry built for spiritual growth, genuine community, and purpose-filled living at every stage of life. Part of The Wisdom Church, Lagos.",
  path: '/ministries/women',
});

const config: MinistryPageConfig = {
  hero: {
    eyebrow: "Women's Ministry",
    title: 'Women who grow with grace. Women who lead with purpose.',
    subtitle:
      'A community built for women at every stage of life — rooted in scripture, prayer, and genuine sisterhood.',
  },
  conference: {
    eyebrow: "Flourish · Women's Conference 2025",
    heading: { lead: 'Rooted. Rising.', accent: ' Flourishing.' },
    description:
      "Flourish is the Wisdom Church Women's Conference — a gathering where women come together in worship, the Word, and honest community to celebrate what God is doing in and through their lives. This year's conference was a moment of breakthrough, renewal, and real conversation about growing as a woman of God in every season. If you missed it, watch the full session below.",
    youtubeSrc: 'https://www.youtube.com/embed/St-kiKLelUU',
    youtubeTitle: "Flourish — Wisdom Church Women's Conference 2025",
    ctaLabel: 'Stay updated on next conference',
  },
  mission: {
    dark: false,
    heading: {
      lead: 'Women flourish best where',
      accent: ' biblical formation and genuine support',
      tail: ' work together.',
    },
    body: 'This ministry creates space for women to deepen their walk with God, carry one another through real life, and grow into stronger service, leadership, and witness. Spiritual depth and community warmth are not opposites here — they belong together.',
  },
  activities: {
    dark: true,
    heading: {
      lead: 'Built for women who want to',
      accent: ' go deeper and grow further.',
    },
    items: [
      {
        title: 'Bible Study Circles',
        description:
          'Focused spaces to understand scripture, ask honest questions, and apply truth with maturity — not just read it.',
      },
      {
        title: 'Prayer Gatherings',
        description:
          'Shared prayer moments that strengthen women spiritually and deepen a genuine dependence on God together.',
      },
      {
        title: 'Mentorship & Support',
        description:
          'Relationships that help women grow through counsel, shared wisdom, and real encouragement across seasons.',
      },
      {
        title: 'Service & Leadership',
        description:
          'Clear pathways to contribute in church life and develop steady responsibility in ministry over time.',
      },
    ],
  },
  values: {
    dark: false,
    heading: {
      lead: 'The values that define',
      accent: ' every woman in this ministry.',
    },
    items: [
      {
        title: 'Faith',
        body: 'A ministry rooted in the Word and sustained by prayer — not events, not performance, just genuine growth.',
      },
      {
        title: 'Sisterhood',
        body: 'Real relationships that carry women through every season honestly — not surface-level, but truly present.',
      },
      {
        title: 'Purpose',
        body: 'Growing into who God created you to be — in your home, your work, your service, and your community.',
      },
    ],
  },
  cta: {
    dark: true,
    heading: {
      lead: 'Step into a sisterhood',
      accent: ' that walks with you.',
    },
    body: 'Reach out and we will help you find the right starting point — whether that is fellowship, prayer, Bible study, or service.',
    primaryLabel: 'Join the sisterhood',
    primaryHref: '/contact',
    secondaryLabel: 'See service times',
    secondaryHref: '/events/weekly',
  },
};

export default function WomenMinistryPage() {
  return <MinistryPageTemplate config={config} />;
}
