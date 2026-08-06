import type { Metadata } from 'next';

import MinistryPageTemplate, {
  type MinistryPageConfig,
} from '@/features/ministries/MinistryPageTemplate';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: "Men's Ministry",
  description:
    "A men's ministry built on integrity, biblical brotherhood, and leadership that serves. Part of The Wisdom Church, Lagos.",
  path: '/ministries/men',
});

const config: MinistryPageConfig = {
  hero: {
    eyebrow: "Men's Ministry",
    title: 'Men of integrity. Men of purpose.',
    subtitle:
      'A community where men grow in faith, accountability, and the kind of strength that leads — at home, in church, and beyond.',
  },
  conference: {
    eyebrow: "Men's Conference · Wisdom Church",
    heading: { lead: 'Iron sharpens', accent: ' iron.' },
    description:
      'A gathering of men coming together in the Word, worship, and honest brotherhood. Watch the full conference session below.',
    youtubeSrc: 'https://www.youtube.com/embed/eSAvP3h0ASY',
    youtubeTitle: "Wisdom Church Men's Conference",
    ctaLabel: 'Stay updated on next event',
  },
  mission: {
    dark: false,
    heading: {
      lead: 'Men need a context where',
      accent: ' truth, challenge, and brotherhood',
      tail: ' work together.',
    },
    body: 'This ministry exists to help men develop biblical strength, spiritual discipline, and the kind of maturity that produces faithful leadership in every area of life. We want men who are clear in conviction, stable in character, and genuinely accountable in community.',
  },
  activities: {
    dark: true,
    heading: {
      lead: 'Built for men who want to',
      accent: ' grow and lead well.',
    },
    items: [
      {
        title: 'Brotherhood Gatherings',
        description:
          'Meetings that build real trust — spiritually honest conversations, shared prayer, and men committed to one another.',
      },
      {
        title: 'Biblical Formation',
        description:
          'Teaching and discussion shaped to build conviction, scriptural clarity, and the kind of wisdom that holds under pressure.',
      },
      {
        title: 'Leadership Development',
        description:
          'Intentional growth toward dependability — at home, in church, and in every area where men are called to lead.',
      },
      {
        title: 'Accountability Culture',
        description:
          'A community where honesty is normal, correction is welcomed, and long-term spiritual consistency is the standard.',
      },
    ],
  },
  values: {
    dark: false,
    heading: {
      lead: 'The values that define',
      accent: ' every man in this ministry.',
    },
    items: [
      {
        title: 'Integrity',
        body: 'Character built in private that holds consistently in public — at home, at work, and in the church.',
      },
      {
        title: 'Brotherhood',
        body: 'Men who challenge, trust, and walk honestly with each other. Not surface level — real accountability.',
      },
      {
        title: 'Leadership',
        body: 'The natural outworking of mature faith — serving faithfully and leading well wherever God has placed you.',
      },
    ],
  },
  cta: {
    dark: true,
    heading: {
      lead: 'Step into a brotherhood',
      accent: ' built to last.',
    },
    body: 'Reach out and we will connect you to the right entry point — brotherhood, formation, or service.',
    primaryLabel: 'Join the brotherhood',
    primaryHref: '/contact',
    secondaryLabel: 'See weekly services',
    secondaryHref: '/events/weekly',
  },
};

export default function MenMinistryPage() {
  return <MinistryPageTemplate config={config} />;
}
