import type { MinistryContent } from '@/features/ministries/MinistryPageTemplate';

export const PRAYER_MINISTRY_CONTENT: MinistryContent = {
  hero: {
    eyebrow: 'Prayer Ministry',
    title: 'A church that prays before it moves.',
    description:
      'A community giving itself to prayer — interceding for the church, the city, and one another, and keeping the altar burning.',
    image: '/Picflow/DSC06712-copy.webp',
  },
  primaryCta: { label: 'Join the prayer team', href: '/contact' },
  introduction: {
    label: 'The engine room',
    title: 'Prayer is not a programme here — it is the foundation.',
    body: 'The prayer ministry exists to keep the church anchored in the presence of God. We gather to intercede, to wait on the Lord, and to carry the burdens of the church and the world before Him — so that everything else the church does flows from time spent with God.',
    image: {
      src: '/Picflow/DSC00049-copy.webp',
      alt: 'Members in prayer at The Wisdom Church',
    },
    imageFrameClassName: 'aspect-[4/5] sm:aspect-[3/4]',
    imagePositionClassName: 'object-top',
  },
  pillars: {
    eyebrow: 'What guides us',
    title: 'Persistent. United. Spirit-led.',
    items: [
      {
        label: 'Our vision',
        title: 'A praying church that moves in step with the Spirit.',
        body: 'To see a congregation where prayer is constant, united, and expectant — where believers know how to seek God for themselves and for others.',
      },
      {
        label: 'Our mission',
        title: 'Intercede. Equip. Sustain.',
        body: 'To hold steady times of corporate prayer, teach believers to pray with understanding, and keep intercession going for the church, its leaders, and its mission.',
      },
    ],
  },
  leader: {
    label: 'Prayer Coordinator',
    title: 'Keeping the altar burning for the whole church.',
    body: 'Our team organises the rhythm of prayer — daily prayer, prayer chains, and intercession for specific needs — and helps every member grow in a personal life of prayer.',
    image: {
      src: '/Picflow/DSC00057-copy.webp',
      alt: 'A prayer ministry leader at The Wisdom Church',
    },
  },
  focus: {
    eyebrow: 'What shapes us',
    title: 'Persistence. Unity. Dependence.',
    items: [
      {
        title: 'Persistence',
        body: 'We keep praying — in season and out — trusting God who answers those who do not give up.',
      },
      {
        title: 'Unity',
        body: 'We pray together. Agreement in prayer is one of the clearest expressions of a healthy church.',
      },
      {
        title: 'Dependence',
        body: 'We lead with prayer because we believe nothing of lasting spiritual value happens without God.',
      },
    ],
  },
  activities: {
    eyebrow: 'What we do',
    title: 'Built to keep the church in the presence of God.',
    items: [
      {
        title: 'Daily Morning Prayer',
        description:
          'A steady daily gathering to start the day in prayer, declaration, and the Word — open to everyone.',
      },
      {
        title: 'Corporate Intercession',
        description:
          'Set times where the church prays together for the nation, the city, families, and the mission of the church.',
      },
      {
        title: 'Prayer Chains',
        description:
          'A network of intercessors who carry urgent and specific prayer needs between our gatherings.',
      },
      {
        title: 'Teaching on Prayer',
        description:
          'Practical teaching that helps believers build a consistent, confident personal prayer life.',
      },
    ],
  },
  conferenceVideo: {
    eyebrow: 'Incense',
    title: 'Join our prayer marathon.',
    description:
      'Incense is our prayer marathon — hours of worship, waiting on God, and intercession for the church and the nation. Everyone is welcome; come for an hour or stay for all of it.',
    schedule: 'Every third Saturday',
    ctaLabel: 'Notify me about the next Incense',
    notifySignup: true,
    notifyBlurb:
      'Leave your details and we will email you the date, time and venue before each Incense.',
    notifySource: 'incense-prayer-marathon',
    youtubeSrc: 'https://www.youtube.com/embed/Djma_c2pqMc',
    youtubeTitle: 'Incense — The Wisdom Church prayer marathon',
  },
  invitation: {
    label: 'There is a place for you at the altar',
    title: 'Come and pray with us.',
    body: 'Whether you are new to prayer or you have interceded for years, there is a place for you on this team.',
    primaryLabel: 'Join the prayer team',
    primaryHref: '/contact',
    secondaryLabel: 'See prayer times',
    secondaryHref: '/events/weekly',
  },
};
