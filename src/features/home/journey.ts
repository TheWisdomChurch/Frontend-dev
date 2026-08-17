export const HOME_NEXT_STEPS = [
  {
    title: 'Watch a message',
    description: 'Grow through recent sermons and biblical teaching.',
    href: '/resources/sermons',
    icon: 'watch',
  },
  {
    title: 'Find your ministry',
    description: 'Meet people in the same season of life and faith.',
    href: '/ministries',
    icon: 'ministries',
  },
  {
    title: 'Get connected',
    description: 'Ask a question, request prayer, or speak with our team.',
    href: '/contact',
    icon: 'connect',
  },
] as const;

export const HOME_SECONDARY_STEPS = [
  { title: 'Join a serve team', href: '/serve' },
  { title: 'Give online', href: '/giving' },
  { title: 'Request pastoral care', href: '/pastoral' },
] as const;
