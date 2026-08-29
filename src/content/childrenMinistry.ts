import type { MinistryContent } from '@/features/ministries/MinistryPageTemplate';

// NOTE: children's-ministry photography is limited — hero and section images
// below are placeholders from the general library. The in-page carousel
// (ChildrenGallery, passed as `extra`) uses the real children's photos.

export const CHILDREN_MINISTRY_CONTENT: MinistryContent = {
  hero: {
    eyebrow: "Children's Ministry",
    title: 'Where little ones meet Jesus.',
    description:
      'Safe, joyful, and built around families — from nursery through pre-teen years.',
    image: '/images/easter-service.webp',
  },
  primaryCta: { label: 'Connect my family', href: '/contact' },
  introduction: {
    label: 'A place built for children',
    title: 'Church as a place of safety, joy, and truth.',
    body: "The children's ministry exists to help young people know God early, feel genuinely cared for at church, and build spiritual foundations that support growth well into their teenage years and beyond.",
    image: {
      src: '/Picflow/DSC00123 copy.webp',
      alt: 'Children being taught at The Wisdom Church',
    },
  },
  pillars: {
    eyebrow: 'What guides us',
    title: 'Known, cared for, and taught the truth.',
    items: [
      {
        label: 'Our vision',
        title: 'Children who know God early and grow up sure of His love.',
        body: 'To see every child form a real, age-appropriate faith in a place they feel safe, known, and glad to return to each week.',
      },
      {
        label: 'Our mission',
        title: 'Protect. Teach. Delight. Partner.',
        body: 'To care for children with trained, attentive leaders, teach the Bible clearly at their level, and keep families connected to what their children are learning.',
      },
    ],
  },
  leader: {
    label: 'Children’s Ministry Lead',
    title: 'Caring for every child by name, every week.',
    body: 'Our team is built around safety and warmth — trained leaders who know each child, teach with joy, and keep parents informed and confident every time they come in.',
    image: {
      src: '/Picflow/DSC00011 copy.webp',
      alt: "A children's ministry leader at The Wisdom Church",
    },
  },
  focus: {
    eyebrow: 'A word to parents',
    title: 'Safe. Joyful. Grounded.',
    items: [
      {
        title: 'Safe',
        body: 'Every child is supervised, known by name, and cared for in an environment parents can fully trust.',
      },
      {
        title: 'Joyful',
        body: 'We build experiences children actually look forward to — worship, stories, and moments they carry home.',
      },
      {
        title: 'Grounded',
        body: 'Biblical truth taught at the right level — not watered down, just made real and accessible for young hearts.',
      },
    ],
  },
  activities: {
    eyebrow: 'What we do',
    title: 'Programs built for consistent growth.',
    items: [
      {
        title: 'Bible Teaching',
        description:
          'Scripture brought to life at the right level — engaging, memorable, and built for young minds.',
      },
      {
        title: 'Worship & Response',
        description:
          'Music and worship moments that help children experience the presence of God with joy and openness.',
      },
      {
        title: 'Supervised Care',
        description:
          'Every child is known by name and watched by trained leaders who take safety and warmth seriously.',
      },
      {
        title: 'Family Connection',
        description:
          'Parents stay informed and connected to what their children are learning every time they come in.',
      },
    ],
  },
  invitation: {
    label: 'There is a place for your child',
    title: 'Connect your child to a community that cares.',
    body: 'Reach out and we will help your family understand what to expect, meet the team, and settle comfortably into the ministry.',
    primaryLabel: 'Connect my family',
    primaryHref: '/contact',
    secondaryLabel: 'See service times',
    secondaryHref: '/events/weekly',
  },
};
