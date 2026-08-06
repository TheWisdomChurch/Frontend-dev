import type { Metadata } from 'next';

import MinistryPageTemplate, {
  type MinistryPageConfig,
} from '@/features/ministries/MinistryPageTemplate';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Outreach & Missions',
  description:
    "Practical expressions of God's love through service, evangelism, and community development. Part of The Wisdom Church, Lagos.",
  path: '/ministries/outreach',
});

const config: MinistryPageConfig = {
  hero: {
    eyebrow: 'Outreach & Missions',
    title: 'Taking the church beyond the walls.',
    subtitle:
      'Practical expressions of compassion, service, and gospel witness in the communities around us.',
    backgroundImage: '/images/supernatural-service.webp',
  },
  mission: {
    dark: true,
    heading: {
      lead: 'Outreach should carry both the',
      accent: ' compassion of Christ',
      tail: ' and the wisdom to serve people well.',
    },
    body: 'This ministry exists to meet practical needs, strengthen human dignity, and create meaningful opportunities for the church to serve its city with love and clarity. Mission is not occasional here — it is part of how Wisdom Church lives.',
  },
  activities: {
    dark: false,
    heading: {
      lead: 'Built for those who want to',
      accent: ' serve beyond Sunday.',
    },
    items: [
      {
        title: 'Community Support',
        description:
          'Projects focused on meeting practical needs and strengthening families and neighbourhoods with care and dignity.',
      },
      {
        title: 'Evangelism',
        description:
          'Intentional moments of gospel witness that combine compassion, clarity, and spiritual courage beyond the church walls.',
      },
      {
        title: 'Volunteer Teams',
        description:
          'Teams that plan, prepare, and execute outreach initiatives with consistency, humility, and genuine care for people.',
      },
      {
        title: 'Project Mobilisation',
        description:
          'Focused initiatives that help the church respond well to specific community needs and meaningful moments.',
      },
    ],
  },
  values: {
    dark: true,
    heading: {
      lead: 'The values behind',
      accent: ' every initiative we run.',
    },
    items: [
      {
        title: 'Compassion',
        body: 'Meeting people where they are — with real help, genuine respect, and the love of Christ expressed practically.',
      },
      {
        title: 'Humility',
        body: 'Serving without agenda. Outreach works best when people come prepared to give, not to be seen.',
      },
      {
        title: 'Mission',
        body: 'Carrying the gospel beyond church walls — not occasionally, but as a natural part of how this church lives.',
      },
    ],
  },
  cta: {
    dark: false,
    eyebrow: 'Get involved',
    heading: {
      lead: 'Ready to serve',
      accent: ' beyond the walls?',
    },
    body: 'Reach out and we will connect you to the next outreach initiative or community service opportunity.',
    primaryLabel: 'Join outreach',
    primaryHref: '/contact',
    secondaryLabel: 'See weekly services',
    secondaryHref: '/events/weekly',
  },
};

export default function OutreachPage() {
  return <MinistryPageTemplate config={config} />;
}
