import type { MinistryContent } from '@/features/ministries/MinistryPageTemplate';

// NOTE: outreach-specific photography is not available yet — the images below
// are placeholders from the general library. Swap them once outreach photos land.

export const OUTREACH_MINISTRY_CONTENT: MinistryContent = {
  hero: {
    eyebrow: 'Outreach & Missions',
    title: 'Taking the church beyond the walls.',
    description:
      'Practical expressions of compassion, service, and gospel witness in the communities around us.',
    image: '/images/supernatural-service.webp',
  },
  primaryCta: { label: 'Join outreach', href: '/contact' },
  introduction: {
    label: 'Faith beyond our walls',
    title: 'The compassion of Christ and the wisdom to serve people well.',
    body: 'This ministry exists to meet practical needs, strengthen human dignity, and create meaningful opportunities for the church to serve its city with love and clarity. Mission is not occasional here — it is part of how Wisdom Church lives.',
    image: {
      src: '/Picflow/DSC00019 copy.webp',
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
    label: 'Outreach Lead',
    title: 'Helping the church serve its neighbours with consistency.',
    body: 'Our team plans, prepares, and carries out outreach with humility and care — so that every initiative treats people with dignity and reflects Christ clearly.',
    image: {
      src: '/Picflow/DSC00009 copy.webp',
      alt: 'An outreach ministry leader at The Wisdom Church',
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
    title: 'Ready to serve beyond the walls?',
    body: 'Reach out and we will connect you to the next outreach initiative or community service opportunity.',
    primaryLabel: 'Join outreach',
    primaryHref: '/contact',
    secondaryLabel: 'See weekly services',
    secondaryHref: '/events/weekly',
  },
};
