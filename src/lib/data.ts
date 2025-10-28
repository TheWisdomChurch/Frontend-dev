import { NavLink, Leader, Sermon, Ministry, ExtendedNavLink } from './types';

import { hero_bg_1, hero_bg_2, hero_bg_3 } from '@/components/assets';

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
      { label: 'Children Ministry', href: '/ministries/children' },
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
  { name: 'Pastor John Doe', role: 'Lead Pastor', imageId: 'leader-1' },
  { name: 'Jane Smith', role: 'Youth Pastor', imageId: 'leader-2' },
  { name: 'Emily White', role: 'Worship Leader', imageId: 'leader-3' },
  { name: 'Michael Brown', role: 'Outreach Director', imageId: 'leader-4' },
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
