import type { MinistryContent } from '@/features/ministries/MinistryPageTemplate';

// NOTE: images are from the church library; swap for evangelism-specific photos
// as they land.

export const EVANGELISM_MINISTRY_CONTENT: MinistryContent = {
  hero: {
    eyebrow: 'Evangelism',
    title: 'Taking the good news beyond the walls.',
    description:
      'Sharing the gospel with clarity and courage, and expressing the love of Christ through practical care in the communities around us.',
    image: '/Picflow/DSC00007-copy.webp',
  },
  primaryCta: { label: 'Join the evangelism team', href: '/contact' },
  introduction: {
    label: 'Faith beyond our walls',
    title: 'The compassion of Christ and the wisdom to serve people well.',
    body: 'This ministry exists to meet practical needs, strengthen human dignity, and create meaningful opportunities for the church to serve its city with love and clarity. Mission is not occasional here — it is part of how Wisdom Church lives.',
    image: {
      src: '/Picflow/Conv_3.webp',
      alt: 'The Wisdom Church community serving together',
    },
  },
  pillars: {
    eyebrow: 'What guides us',
    title: 'Serving the city with love and clarity.',
    items: [
      {
        label: 'Our vision',
        title: 'A church known in its city for practical, gospel-shaped love.',
        body: 'To see the love of Christ expressed consistently through service that protects dignity, meets real needs, and opens the door to the gospel.',
      },
      {
        label: 'Our mission',
        title: 'Serve. Witness. Mobilise. Sustain.',
        body: 'To organise the church to meet practical needs well, share the gospel with courage and clarity, and keep mission a steady part of church life rather than an occasional event.',
      },
    ],
  },
  leader: {
    label: 'Evangelism Lead',
    title: 'Helping the church witness to its city with consistency.',
    body: 'Our team plans, prepares, and carries out evangelism and outreach with humility and care — so that every initiative treats people with dignity and points clearly to Christ.',
    image: {
      src: '/Picflow/DSC00009-copy.webp',
      alt: 'An evangelism ministry leader at The Wisdom Church',
    },
  },
  focus: {
    eyebrow: 'What shapes us',
    title: 'Compassion. Humility. Mission.',
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
  activities: {
    eyebrow: 'What we do',
    title: 'Built for those who want to serve beyond Sunday.',
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
  invitation: {
    label: 'Get involved',
    title: 'Ready to carry the good news beyond the walls?',
    body: 'Reach out and we will connect you to the next evangelism or community outreach opportunity.',
    primaryLabel: 'Join the evangelism team',
    primaryHref: '/contact',
    secondaryLabel: 'See weekly services',
    secondaryHref: '/events/weekly',
  },
};
