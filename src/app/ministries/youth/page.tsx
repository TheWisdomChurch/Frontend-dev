import type { Metadata } from 'next';

import MinistryPageTemplate, {
  type MinistryPageConfig,
} from '@/features/ministries/MinistryPageTemplate';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Youth Ministry',
  description:
    'A youth ministry built for conviction, community, and confident Christian living for ages 13–25. Part of The Wisdom Church, Lagos.',
  path: '/ministries/youth',
});

const config: MinistryPageConfig = {
  hero: {
    eyebrow: 'Youth Ministry · Ages 13 – 25',
    title: 'A generation on fire for God.',
    subtitle:
      'Building young people who know what they believe, why they believe it, and how to live it — confidently.',
    backgroundImage: '/images/conference-2025.webp',
  },
  mission: {
    dark: true,
    heading: {
      lead: 'Young people need more than energy.',
      accent: ' They need formation, truth, and healthy community.',
    },
    body: 'The youth ministry exists to help young people build a strong spiritual foundation early, ask honest questions, and develop a life of faith that is steady under pressure. Clarity, belonging, and real guidance — this is what this ministry is built to give.',
  },
  activities: {
    dark: false,
    heading: {
      lead: 'Built for young people who want to',
      accent: ' grow, lead, and belong.',
    },
    items: [
      {
        title: 'Scripture-Centred Gatherings',
        description:
          'Teaching moments that connect faith with the real pressure points young people face — not surface-level, but honest and grounded.',
      },
      {
        title: 'Community & Conversation',
        description:
          'Space for friendship, accountability, and honest questions without performance — where young people can be known and belong.',
      },
      {
        title: 'Prayer & Worship',
        description:
          'Times set apart for spiritual encounter, worship response, and growing in the kind of personal devotion that lasts.',
      },
      {
        title: 'Leadership Development',
        description:
          'Practical responsibility that helps young people move from simply attending into real service, ownership, and ministry.',
      },
    ],
  },
  values: {
    dark: true,
    heading: {
      lead: 'The values at the heart of',
      accent: ' this generation.',
    },
    items: [
      {
        title: 'Truth',
        body: 'Biblical teaching that is honest, practical, and strong enough to hold young people through real life — not just Sunday.',
      },
      {
        title: 'Community',
        body: 'Friendships and relationships that reinforce healthy discipleship. Young people grow better together than alone.',
      },
      {
        title: 'Conviction',
        body: 'A generation that knows what they believe and why — confident, grounded, and able to lead in their time.',
      },
    ],
  },
  cta: {
    dark: false,
    heading: {
      lead: 'Ready to be part of',
      accent: ' this generation?',
    },
    body: 'Reach out and we will help you or your family understand the youth ministry and what the first step should look like.',
    primaryLabel: 'Join the youth ministry',
    primaryHref: '/contact',
    secondaryLabel: 'See weekly services',
    secondaryHref: '/events/weekly',
  },
};

export default function YouthMinistryPage() {
  return <MinistryPageTemplate config={config} />;
}
