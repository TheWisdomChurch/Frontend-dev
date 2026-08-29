import type { StaticImageData } from 'next/image';
import {
  Bishop,
  Deacon_2,
  Deacon_2_wide,
  Img_1,
  lader,
  WhatWeDo_3,
} from '@/shared/assets';

export type HomeImage = {
  src: StaticImageData | string;
  alt: string;
  position: string;
  desktopSrc?: StaticImageData | string;
  /** 'contain' for graphics whose own text/edges must never be cropped
   * (e.g. a finished promotional collage) — defaults to 'cover'. */
  fit?: 'cover' | 'contain';
};

export const HOME_COPY = {
  actions: {
    watchLive: 'Watch live',
    planVisit: 'Plan your visit',
    discoverStory: 'Discover our story',
    joinCommunity: 'Join our community',
    planFirstVisit: 'Plan your first visit',
    meetLeadership: 'Meet our leadership',
    connect: 'Connect with us',
  },
  hero: {
    eyebrow: 'Welcome home to The Wisdom Church',
    titleLead: 'Raising ',
    titleAccent: 'Believers',
    titleTail: ' for a life of Impact',
    description:
      'A Spirit-filled family where the Word works, prayer is a lifestyle, and every believer is equipped for greatness.',
  },
  welcome: {
    eyebrow: 'Welcome home',
    title: 'More than a church.',
    accent: 'We are family.',
    description:
      'The Wisdom Church is a community of believers growing through sound teaching, fervent prayer, wholehearted worship, and genuine relationships. Here, faith becomes practical and every person has room to flourish.',
  },
  identity: {
    eyebrow: 'Who we are',
    title: 'We raise believers,',
    accent: 'not just members.',
    description:
      'Our faith is expressed through four simple commitments that shape everything we do.',
  },
  service: {
    eyebrow: 'Worship with us',
    title: 'Sundays are',
    accent: 'better together.',
  },
  pastor: {
    eyebrow: 'Our senior pastor',
    title: 'Bishop',
    accent: 'Gabriel Ayilara',
    description:
      'A teacher and spiritual leader committed to raising complete believers through the wisdom of God, practical faith, and the transforming power of the Holy Spirit.',
  },
  community: {
    eyebrow: 'Find your people',
    title: "We don't do",
    accent: 'life alone.',
    description:
      'Build meaningful relationships, grow in faith, and discover where you belong in a community that feels like home.',
  },
  cellFellowship: {
    eyebrow: 'Cell Fellowship',
    title: 'There is a Cell Fellowship',
    accent: 'center near you.',
    description:
      'Taking the gospel to your community. Our Cell Fellowship centers are where church becomes a weekly rhythm close to home — the Word, prayer, and genuine care among neighbours.',
    points: [
      {
        title: 'Close to home',
        body: 'Centers meet in homes and neighbourhoods across the city, so fellowship fits your week.',
      },
      {
        title: 'The Word, together',
        body: 'Each center studies Scripture, prays, and helps one another apply faith to everyday life.',
      },
      {
        title: 'Known and cared for',
        body: 'A smaller setting where people are known by name, supported, and encouraged to grow.',
      },
    ],
  },
} as const;

export const HOME_BELIEFS: {
  title: string;
  body: string;
  image: StaticImageData | string;
  imageAlt: string;
  imagePosition: string;
  layoutClass: string;
  parallaxDepth: number;
}[] = [
  {
    title: 'The Word',
    body: "We live by God's Word and put our faith into action.",
    image: WhatWeDo_3,
    imageAlt: 'A pastor teaching from the pulpit at The Wisdom Church',
    imagePosition: 'object-[30%_center]',
    layoutClass: 'lg:col-span-7',
    parallaxDepth: 0.1,
  },
  {
    title: 'Prayer',
    body: "We seek God's presence and power through faithful prayer.",
    image: '/Picflow/DSC06712-copy.webp',
    imageAlt: 'A member deep in prayer at The Wisdom Church',
    imagePosition: 'object-center',
    layoutClass: 'lg:col-span-5',
    parallaxDepth: 0.16,
  },
  {
    title: 'Worship',
    body: 'We worship wholeheartedly and make room for renewed lives.',
    image: '/Picflow/DSC00019-copy.webp',
    imageAlt: 'Worship on stage at The Wisdom Church',
    imagePosition: 'object-[center_18%]',
    layoutClass: 'lg:col-span-5',
    parallaxDepth: 0.13,
  },
  {
    title: 'Community',
    body: 'We grow together, serve one another, and share life.',
    image: '/Picflow/DSC00268-copy.webp',
    imageAlt: 'Members embracing in fellowship at The Wisdom Church',
    imagePosition: 'object-center',
    layoutClass: 'lg:col-span-7',
    parallaxDepth: 0.18,
  },
];

export const HOME_IMAGES = {
  hero: {
    src: lader,
    alt: 'The Wisdom Church worship service',
    position: 'object-[center_32%]',
  },
  welcome: {
    src: Img_1,
    alt: 'A worshipper at The Wisdom Church',
    position: 'object-[center_28%]',
  },
  service: {
    src: Deacon_2,
    desktopSrc: Deacon_2_wide,
    alt: 'A member in prayer at The Wisdom Church',
    position: 'object-[40%_45%]',
  },
  pastor: {
    src: Bishop,
    alt: 'Bishop Gabriel Ayilara, Senior Pastor',
    position: 'object-bottom',
  },
  community: {
    src: '/images/worship-service-community-generated-v3.png',
    alt: 'Wisdom Church leaders ministering together',
    position: 'object-center',
  },
} satisfies Record<string, HomeImage>;

export const HOME_COMMUNITY_GALLERY = [
  {
    src: '/Picflow/DSC00054-copy.webp',
    alt: 'A mother and child at The Wisdom Church',
    position: 'object-[center_32%]',
    unoptimized: true,
  },
  {
    src: '/images/worship-service-community-generated-v3.png',
    alt: 'Worshippers sharing a service at The Wisdom Church',
    position: 'object-center',
    unoptimized: false,
  },
  {
    src: '/Picflow/DSC00268-copy.webp',
    alt: 'A volunteer serving during worship',
    position: 'object-[52%_center]',
    unoptimized: false,
  },
] as const;
