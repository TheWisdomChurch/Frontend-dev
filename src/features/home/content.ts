import type { StaticImageData } from 'next/image';
import { Bishop, Img_1, lader, lader_1 } from '@/shared/assets';

export type HomeImage = {
  src: StaticImageData | string;
  alt: string;
  position: string;
};

export const HOME_COPY = {
  hero: {
    eyebrow: 'Welcome to The Wisdom Church',
    title: 'Raising complete believers for a life of impact',
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
    title: 'Sundays are better together.',
  },
  pastor: {
    eyebrow: 'Our senior pastor',
    title: 'Bishop Gabriel Ayilara',
    description:
      'A teacher and spiritual leader committed to raising complete believers through the wisdom of God, practical faith, and the transforming power of the Holy Spirit.',
  },
  community: {
    eyebrow: 'Find your people',
    title: "We don't do life alone.",
    description:
      'Build meaningful relationships, grow in faith, and discover where you belong in a community that feels like home.',
  },
} as const;

export const HOME_BELIEFS = [
  {
    number: '01',
    title: 'The Word',
    body: "We receive and apply God's Word until it becomes visible in how we live.",
    image: '/Picflow Images Jul 31 (2)/DSC06877 copy.webp',
    imageAlt: 'Members studying scripture together at The Wisdom Church',
  },
  {
    number: '02',
    title: 'Prayer',
    body: 'We are a praying people, deeply connected to the power and presence of God.',
    image: '/Picflow Images Jul 31 (2)/DSC06712 copy.webp',
    imageAlt: 'A member deep in prayer at The Wisdom Church',
  },
  {
    number: '03',
    title: 'Worship',
    body: 'We worship wholeheartedly and make room for lives to be renewed.',
    image: '/Picflow Images Jul 31 (2)/DSC00019 copy.webp',
    imageAlt: 'Worship on stage at The Wisdom Church',
  },
  {
    number: '04',
    title: 'Community',
    body: 'We grow together, serve one another, and carry our faith into everyday life.',
    image: '/Picflow Images Jul 31 (2)/DSC06902 copy.webp',
    imageAlt: 'Members embracing in fellowship at The Wisdom Church',
  },
] as const;

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
    src: lader_1,
    alt: 'Worship at The Wisdom Church',
    position: 'object-[center_24%]',
  },
  pastor: {
    src: Bishop,
    alt: 'Bishop Gabriel Ayilara, Senior Pastor',
    position: 'object-bottom',
  },
  community: {
    src: '/Picflow Images Jul 31 (2)/DSC00026 copy.webp',
    alt: 'Women gathered at a Wisdom Church community event',
    position: 'object-center',
  },
} satisfies Record<string, HomeImage>;
