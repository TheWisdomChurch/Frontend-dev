import type { MinistryContent } from '@/features/ministries/MinistryPageTemplate';

export const MEN_MINISTRY_CONTENT: MinistryContent = {
  hero: {
    eyebrow: "Men's Ministry",
    title: 'Men of integrity. Men of purpose.',
    description:
      'A community where men grow in faith, accountability, and the kind of strength that leads — at home, in church, and beyond.',
    image: '/Picflow/men1.webp',
  },
  primaryCta: { label: 'Join the brotherhood', href: '/contact' },
  introduction: {
    label: 'A brotherhood with purpose',
    title: 'Where truth, challenge, and brotherhood work together.',
    body: 'This ministry exists to help men develop biblical strength, spiritual discipline, and the kind of maturity that produces faithful leadership in every area of life. We want men who are clear in conviction, stable in character, and genuinely accountable in community.',
    image: {
      src: '/Picflow/men2.webp',
      alt: "Men in fellowship at The Wisdom Church men's gathering",
    },
  },
  pillars: {
    eyebrow: 'What guides us',
    title: 'Grounded in Christ. Accountable to one another.',
    items: [
      {
        label: 'Our vision',
        title: 'Men who lead well because they follow Christ first.',
        body: 'To raise men of conviction and character whose faith is steady under pressure and whose leadership serves the people around them.',
      },
      {
        label: 'Our mission',
        title: 'Form. Challenge. Support. Send.',
        body: 'To give men the teaching, brotherhood, and accountability they need to grow in spiritual discipline and lead faithfully at home, in church, and beyond.',
      },
    ],
  },
  leader: {
    label: 'Ministry Lead',
    title: 'Walking with men toward maturity, conviction, and service.',
    body: 'At the centre of this community is a commitment to help every man grow in the Word, build honest friendships, and carry responsibility well in every place God has placed him.',
    image: {
      src: '/Picflow/menleaders.webp',
      alt: "Leader of The Wisdom Church Men's Ministry",
    },
  },
  focus: {
    eyebrow: 'What shapes us',
    title: 'Integrity. Brotherhood. Leadership.',
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
  activities: {
    eyebrow: 'What we do',
    title: 'Built for men who want to grow and lead well.',
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
  conference: {
    eyebrow: "Men's Conference",
    title: 'Iron sharpens iron.',
    description:
      'A gathering of men coming together in the Word, worship, and honest brotherhood. A glimpse of what the ministry looks like when it gathers.',
    images: [
      {
        src: '/Picflow/men1.webp',
        alt: "Men gathered at The Wisdom Church men's conference",
      },
      {
        src: '/Picflow/men2.webp',
        alt: "Worship at The Wisdom Church men's conference",
      },
      {
        src: '/Picflow/men3.webp',
        alt: "A speaker at The Wisdom Church men's conference",
      },
      {
        src: '/Picflow/men5.webp',
        alt: "Men in prayer at The Wisdom Church men's conference",
      },
    ],
  },
  conferenceVideo: {
    eyebrow: 'Did you miss it?',
    title: 'Missed the last conference? Watch and be blessed.',
    description:
      'The full session from our last gathering — the Word, worship, and honest brotherhood.',
    youtubeSrc: 'https://www.youtube.com/embed/eSAvP3h0ASY',
    youtubeTitle: "Wisdom Church Men's Conference",
  },
  invitation: {
    label: 'Step into a brotherhood built to last',
    title: 'Grow in conviction. Lead with character. Serve with strength.',
    body: 'Reach out and we will connect you to the right entry point — brotherhood, formation, or service.',
    primaryLabel: 'Join the brotherhood',
    primaryHref: '/contact',
    secondaryLabel: 'See weekly services',
    secondaryHref: '/events/weekly',
  },
};
