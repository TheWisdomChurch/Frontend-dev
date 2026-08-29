import type { MinistryContent } from '@/features/ministries/MinistryPageTemplate';

// NOTE: youth-specific photography is not available yet — the images below are
// placeholders drawn from the general library. Swap `image` / `conference.images`
// once the youth photos land; the copy and structure are final.

export const YOUTH_MINISTRY_CONTENT: MinistryContent = {
  hero: {
    eyebrow: 'Youth Ministry · Ages 13 – 25',
    title: 'A generation on fire for God.',
    description:
      'Building young people who know what they believe, why they believe it, and how to live it — confidently.',
    image: '/images/conference-2025.webp',
  },
  primaryCta: { label: 'Join the youth ministry', href: '/contact' },
  introduction: {
    label: 'A community with purpose',
    title: 'Formation, truth, and healthy community — not just energy.',
    body: 'The youth ministry exists to help young people build a strong spiritual foundation early, ask honest questions, and develop a life of faith that is steady under pressure. Clarity, belonging, and real guidance — this is what this ministry is built to give.',
    image: {
      src: '/Picflow/DSC00268 copy.webp',
      alt: 'Young people worshipping together at The Wisdom Church',
    },
  },
  pillars: {
    eyebrow: 'What guides us',
    title: 'Grounded in Scripture. Growing in community.',
    items: [
      {
        label: 'Our vision',
        title: 'A generation confident in Christ and clear in conviction.',
        body: 'To see young people rooted in the Word, secure in their identity, and equipped to lead faithfully in their schools, homes, and future.',
      },
      {
        label: 'Our mission',
        title: 'Teach. Disciple. Belong. Send.',
        body: 'To give young people honest teaching, real friendship, and the guidance they need to build a faith that lasts well beyond their teenage years.',
      },
    ],
  },
  leader: {
    label: 'Ministry Lead',
    title: 'Walking with young people through the questions that matter.',
    body: 'At the heart of this ministry is a commitment to know each young person, take their questions seriously, and help them move from simply attending into real ownership of their faith.',
    image: {
      src: '/Picflow/DSC00122 copy.webp',
      alt: 'A youth ministry leader at The Wisdom Church',
    },
  },
  focus: {
    eyebrow: 'What shapes us',
    title: 'Truth. Community. Conviction.',
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
  activities: {
    eyebrow: 'What we do',
    title: 'Built for young people who want to grow, lead, and belong.',
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
  conference: {
    eyebrow: 'When we gather',
    title: 'A glimpse of young people learning and growing together.',
    description:
      'Our gatherings create room for honest conversation, worship, and the kind of friendship that keeps faith steady. These moments capture the community we are building.',
    images: [
      {
        src: '/Picflow/conv_1.webp',
        alt: 'Young people gathered at a Wisdom Church youth gathering',
      },
      {
        src: '/Picflow/Conv_2.webp',
        alt: 'Worship at a Wisdom Church youth gathering',
      },
      {
        src: '/Picflow/Conv_3.webp',
        alt: 'A speaker addressing young people at Wisdom Church',
      },
      {
        src: '/Picflow/Conv_4.webp',
        alt: 'Young people in conversation at Wisdom Church',
      },
    ],
  },
  invitation: {
    label: 'Ready to be part of this generation?',
    title: 'Know what you believe. Live it with confidence.',
    body: 'Reach out and we will help you or your family understand the youth ministry and what the first step should look like.',
    primaryLabel: 'Join the youth ministry',
    primaryHref: '/contact',
    secondaryLabel: 'See weekly services',
    secondaryHref: '/events/weekly',
  },
};
