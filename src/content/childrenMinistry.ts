import type { MinistryContent } from '@/features/ministries/MinistryPageTemplate';

// Photos: real children's-ministry photos — `children-hero` (a child in her
// Sunday best) is the hero, `children-group` (the class at the church banner)
// is the intro, and `child` / `child2` round out the gallery. The leader is the
// ministry director, Mrs Mojisola Oladejo (`children-convener`).

export const CHILDREN_MINISTRY_CONTENT: MinistryContent = {
  hero: {
    eyebrow: "Children's Ministry",
    title: 'Nurturing wise, excellent, Godly leaders for Christ.',
    description:
      'Every child known, taught the truth, and equipped to transform their world for Christ — from nursery through the pre-teen years.',
    image: '/Picflow/children-hero.webp',
    imagePosition: 'object-[center_18%]',
  },
  primaryCta: { label: 'Register your child', href: '#register-child' },
  introduction: {
    label: 'A place built for children',
    title: 'Deep roots. Clear thinking. Real growth.',
    body: 'We believe every child has the potential to make a lasting impact. So we partner with families to cultivate deep spiritual roots, intellectual clarity, and a commitment to personal growth — embedding faith and character into everything we do.',
    image: {
      src: '/Picflow/children-group.webp',
      alt: "The children's class at The Wisdom Church",
    },
  },
  pillars: {
    eyebrow: 'What guides us',
    title: 'Rooted in faith. Built for impact.',
    items: [
      {
        label: 'Our vision',
        title: 'Children who know God early and grow up sure of His love.',
        body: 'To see every child form a real, age-appropriate faith in a place they feel safe, known, and glad to return to each week — a foundation that holds well into their teenage years and beyond.',
      },
      {
        label: 'Our mission',
        title: 'Partnering with families to raise Godly leaders.',
        body: 'To partner with families to cultivate deep spiritual roots, intellectual clarity, and a commitment to personal growth. By embedding faith and character into everything we do, we are actively equipping a generation of Godly, wise, and excellent leaders to positively transform their world for Christ.',
      },
    ],
  },
  leader: {
    label: "Children's Ministry Director",
    title: 'Led by Mrs Mojisola Oladejo.',
    body: 'Mrs Mojisola Oladejo leads a team built around safety and warmth — trained leaders who know each child by name, teach the Bible with joy, and keep parents informed and confident every time they come in.',
    image: {
      src: '/Picflow/children-convener.webp',
      alt: "Mrs Mojisola Oladejo, Children's Ministry Director at The Wisdom Church",
    },
  },
  focus: {
    eyebrow: 'What we build',
    title: 'Godly character. Wisdom. Excellence.',
    items: [
      {
        title: 'Godly Character',
        body: 'Anchoring hearts in faith, biblical truth, and Christ-like love.',
      },
      {
        title: 'Wisdom',
        body: 'Developing critical thinking, sound judgment, and life-ready discernment.',
      },
      {
        title: 'Excellence',
        body: 'Inspiring children to give their absolute best in academics, talents, and service to God.',
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
    primaryLabel: 'Register your child',
    primaryHref: '#register-child',
    secondaryLabel: 'See service times',
    secondaryHref: '/events/weekly',
  },
};
