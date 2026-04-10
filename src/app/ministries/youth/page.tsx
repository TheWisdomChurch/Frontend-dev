import {
  BookOpenCheck,
  CalendarDays,
  HeartHandshake,
  Sparkles,
  Users,
} from 'lucide-react';

import MinistryDetailPage from '@/shared/components/site/MinistryDetailPage';

const config = {
  hero: {
    title:
      'A youth ministry built for conviction, community, and confident Christian living.',
    subtitle:
      'Our youth ministry helps teenagers and young adults grow in scripture, build healthy friendships, and develop a confident life of faith.',
    note: 'We want young people to encounter Jesus clearly, think biblically, and become stable disciples who can lead with wisdom in their generation.',
    chips: ['Ages 13-25', 'Discipleship', 'Leadership', 'Community'],
  },
  stats: [
    {
      label: 'Age focus',
      value: 'Teenagers and young adults',
      detail:
        'Designed for a stage of life where identity, conviction, and direction matter deeply.',
      icon: Users,
    },
    {
      label: 'Core rhythm',
      value: 'Teaching and community',
      detail:
        'Gatherings are structured around scripture, worship, conversation, and connection.',
      icon: BookOpenCheck,
    },
    {
      label: 'Leadership aim',
      value: 'Grounded young leaders',
      detail:
        'We want young people to grow into service, responsibility, and spiritual maturity.',
      icon: Sparkles,
    },
    {
      label: 'Connection flow',
      value: 'Weekly engagement',
      detail:
        'The ministry works best when young people stay connected beyond one event or service.',
      icon: CalendarDays,
    },
  ],
  mission: {
    eyebrow: 'Youth mission',
    title:
      'Young people need more than energy. They need formation, truth, and healthy community.',
    description:
      'The youth ministry exists to help young people build a strong spiritual foundation early, ask honest questions, and develop a life of faith that is steady under pressure.',
    points: [
      'Create a safe environment for spiritual growth and real conversation.',
      'Teach biblical truth in a way that is practical and intellectually honest.',
      'Help young people build friendships that reinforce healthy discipleship.',
      'Develop leadership, responsibility, and a heart for service.',
    ],
    panelTitle: 'What young people often need most',
    panelBody:
      'Clarity, belonging, and guidance matter in this season of life. The ministry is designed to give all three in a church context that takes growth seriously.',
    panelItems: [
      'Clear biblical teaching',
      'Consistent community touchpoints',
      'Trusted leaders and mentors',
      'Real opportunities to serve',
    ],
  },
  programs: [
    {
      title: 'Scripture-centered gatherings',
      description:
        'Teaching moments designed to connect faith with pressure points young people actually face.',
      icon: BookOpenCheck,
    },
    {
      title: 'Community and conversations',
      description:
        'Space for fellowship, friendship, accountability, and honest questions without performance.',
      icon: Users,
    },
    {
      title: 'Prayer and worship moments',
      description:
        'Times set aside for spiritual encounter, worship response, and growing in personal devotion.',
      icon: Sparkles,
    },
    {
      title: 'Leadership development',
      description:
        'Practical responsibility that helps young people move from attendance into service and ownership.',
      icon: HeartHandshake,
    },
  ],
  pathways: [
    {
      title: 'Start by attending consistently',
      description:
        'Come often enough to understand the culture, hear the teaching emphasis, and begin building trust.',
    },
    {
      title: 'Meet leaders and peers',
      description:
        'Healthy connection matters. We want young people known by name, not only counted in attendance.',
    },
    {
      title: 'Join a discipleship rhythm',
      description:
        'Move from inspiration alone into regular learning, prayer, accountability, and growth.',
    },
    {
      title: 'Step into service',
      description:
        'As maturity grows, young people should find practical ways to contribute and lead well.',
    },
  ],
  cta: {
    title:
      'If you are ready to connect with the youth ministry, start the conversation here.',
    description:
      'We can help you or your family understand the youth pathway and what the first next step should look like.',
    primaryHref: '/contact',
    primaryLabel: 'Join the youth ministry',
    secondaryHref: '/events/upcoming',
    secondaryLabel: 'See upcoming events',
  },
};

export default function YouthPage() {
  return <MinistryDetailPage config={config} />;
}
