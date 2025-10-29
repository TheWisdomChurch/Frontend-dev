/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookOpen, DollarSign, Heart, Users } from 'lucide-react';
import { NavLink, Leader, Sermon, Ministry, ExtendedNavLink } from './types';

import {
  WhatWeDo_3,
  hero_bg_1,
  hero_bg_2,
  hero_bg_3,
  Whatwedo_1,
  Associate_1,
  Associate_2,
  Whatwedo_2,
  Dept_1,
  Dept_2,
  Dept_3,
  Dept_4,
  Whatwedo_4,
} from '@/components/assets';

export const slides = [
  {
    image: hero_bg_1,
    title: 'We Are Transformed',
    subtitle: "Experience God's Transforming Power",
    description:
      'Welcome to The Wisdom House Church where lives are transformed through faith, community, and divine guidance.',
  },
  {
    image: hero_bg_2,
    title: 'Growing In Faith',
    subtitle: 'Deepen Your Spiritual Journey',
    description:
      'Join our vibrant community as we grow together in faith, love, and service to others.',
  },
  {
    image: hero_bg_3,
    title: 'Building Community',
    subtitle: 'Connect With Believers',
    description:
      'Experience the warmth of genuine fellowship and build lasting relationships in Christ.',
  },
];

// Extended navigation links with icons and dropdowns
export const extendedNavLinks: ExtendedNavLink[] = [
  {
    label: 'Home',
    href: '/',
    icon: 'Home',
    isActive: true,
  },
  {
    label: 'About',
    href: '/about',
    icon: 'Users',
    dropdown: [
      { label: 'Our Story', href: '/about/story' },
      { label: 'Our Beliefs', href: '/about/beliefs' },
      { label: 'Leadership', href: '/about/leadership' },
      { label: 'Mission & Vision', href: '/about/mission' },
    ],
  },
  {
    label: 'Ministries',
    href: '/ministries',
    icon: 'Users',
    dropdown: [
      { label: 'Children Ministry', href: '/ministries/children' }, // ✅ FIXED
      { label: 'Youth Ministry', href: '/ministries/youth' },
      { label: 'Women Ministry', href: '/ministries/women' },
      { label: 'Men Ministry', href: '/ministries/men' },
      { label: 'Outreach', href: '/ministries/outreach' },
    ],
  },
  {
    label: 'Events',
    href: '/events',
    icon: 'Calendar',
    dropdown: [
      { label: 'Upcoming Events', href: '/events/upcoming' },
      { label: 'Weekly Services', href: '/events/services' },
      { label: 'Special Events', href: '/events/special' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    icon: 'BookOpen',
    dropdown: [
      { label: 'Sermons', href: '/resources/sermons' },
      { label: 'Blog', href: '/resources/blog' },
      { label: 'Publications', href: '/resources/publications' },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: 'Phone',
  },
];

// Keep your existing data
export const navLinks: NavLink[] = [
  { href: '#sermons', label: 'Sermons' },
  { href: '#livestream', label: 'Livestream' },
  { href: '#ministries', label: 'Ministries' },
  { href: '#community', label: 'Community' },
  { href: '/generate', label: 'Generate' },
];

export const leaders: Leader[] = [
  { name: 'Rev. Victor Jimba', role: 'Resident Pastor', imageId: 'leader-1' },
  {
    name: 'Pastor Kenny Ayilara',
    role: 'Assistant Pastor',
    imageId: 'leader-2',
  },
  {
    name: 'Deacon Adeyemi ',
    role: 'Head Service Preparatory Unit',
    imageId: 'leader-3',
  },
  { name: 'Deacon Bamidele ', role: 'Head Technical', imageId: 'leader-4' },
];

export const sermons: Sermon[] = [
  {
    title: 'Faith Over Fear',
    preacher: 'Pastor John Doe',
    date: 'July 14, 2024',
    imageId: 'sermon-1',
    videoId: 'dQw4w9WgXcQ',
  },
  {
    title: 'The Power of Grace',
    preacher: 'Pastor John Doe',
    date: 'July 7, 2024',
    imageId: 'sermon-2',
    videoId: '3tmd-ClafbY',
  },
  {
    title: 'Living a Purpose-Driven Life',
    preacher: 'Guest Speaker',
    date: 'June 30, 2024',
    imageId: 'sermon-3',
    videoId: '6-x1g_c1g4o',
  },
];

export const ministries: Ministry[] = [
  {
    name: 'Kids Ministry',
    description: 'Fun and faith for the next generation.',
    imageId: 'ministry-1',
  },
  {
    name: 'Youth Group',
    description: 'Connecting teens with God and each other.',
    imageId: 'ministry-2',
  },
  {
    name: 'Worship Team',
    description: 'Leading the congregation in praise.',
    imageId: 'ministry-3',
  },
  {
    name: 'Community Outreach',
    description: 'Serving our city with love and action.',
    imageId: 'ministry-4',
  },
];

export const youtubeLivestreams: { current: string; previous: string[] } = {
  current: 'jfKfPfyJRdk',
  previous: ['3tmd-ClafbY', '6-x1g_c1g4o', 'dQw4w9WgXcQ'],
};

// What we do
// data.ts
export interface ServiceBox {
  id: number;
  title: string;
  description: string;
  image: any;
  imageAlt: string;
  gradient?: string;
  imageOpacity?: number;
}

export const whatWeDoData: ServiceBox[] = [
  {
    id: 1,
    title: 'we put the word to work',
    description:
      "We actively apply God's Word in our daily lives, transforming biblical teachings into practical actions that impact our community and deepen our faith journey.",
    image: Whatwedo_4,
    imageAlt: 'Worship service',
  },
  {
    id: 2,
    title: 'We Believe in the power of prayer',
    description:
      "Through fervent prayer, we connect with God's divine power, witnessing miraculous transformations and spiritual breakthroughs in our lives and community.",
    image: Whatwedo_2,
    imageAlt: 'Prayer gathering',
    gradient: 'from-purple-900 to-purple-700',
    imageOpacity: 60,
  },
  {
    id: 3,
    title: 'We Worship',
    description:
      'In heartfelt worship, we glorify God through song, praise, and devotion, creating an atmosphere where His presence transforms hearts and renews spirits.',
    image: Whatwedo_1,
    imageAlt: 'Community service',
  },
  {
    id: 4,
    title: 'We Hear the Word',
    description:
      "We diligently study and receive God's Word, allowing scripture to guide our decisions, shape our character, and illuminate our path forward.",
    image: WhatWeDo_3,
    imageAlt: 'Youth gathering',
    gradient: 'from-blue-900 to-blue-700',
    imageOpacity: 60,
  },
];

export const missionStatement =
  'At The Wisdom Church, we are committed to spreading the Gospel and empowering believers through the Word of God and the Holy Spirit. Our mission is to create a community where faith thrives and transformation is possible.';

export const pastors = [
  {
    name: 'Rev. Victor Jimba',
    role: 'Resident Pastor',
    image: Associate_2,
  },
  {
    name: 'Deacon Adeyemi ',
    role: 'Associate Pastor',
    image: Associate_1,
  },
  {
    name: 'Deacon Bamidele',
    role: 'Associate Pastor',
    image: Associate_1,
  },
];
export const photos = [
  {
    title: 'Media Department',
    image: Dept_3,
    link: '#',
  },
  {
    title: 'ServicePreparatory Unit',
    image: Dept_2,
    link: '#',
  },
  {
    title: 'Music(WaveCityMusic)',
    image: Dept_1,
    link: '#',
  },
  {
    title: 'Prayer/Intercessory Unit',
    image: Whatwedo_2,
    link: '#',
  },
  {
    title: 'Protocol/Ushering Department',
    image: Dept_4,
    link: '#',
  },
];

export const givingOptions = [
  {
    title: 'Tithes & Offerings',
    description:
      'Support the ongoing ministry and mission of The Lighthouse Church',
    icon: DollarSign,
    color: 'from-green-600 to-green-700',
  },
  {
    title: 'Building Fund',
    description: 'Help us expand our facilities to reach more people',
    icon: Heart,
    color: 'from-blue-600 to-blue-700',
  },
  {
    title: 'Missions & Outreach',
    description: 'Support our global mission efforts and community programs',
    icon: Users,
    color: 'from-purple-600 to-purple-700',
  },
  {
    title: 'Youth & Education',
    description: 'Invest in the next generation through our youth programs',
    icon: BookOpen,
    color: 'from-orange-600 to-orange-700',
  },
];
