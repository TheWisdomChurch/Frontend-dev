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
      'A women’s ministry built for spiritual strength, community, and purpose-filled living.',
    subtitle:
      'This ministry exists to help women grow in scripture, prayer, relationships, and practical discipleship across every season of life.',
    note: 'The goal is not just fellowship but formation: stable women who know the Word, encourage one another, and serve from a place of maturity.',
    chips: ['Prayer', 'Bible study', 'Community', 'Service'],
  },
  stats: [
    {
      label: 'Community focus',
      value: 'Women across life stages',
      detail:
        'The ministry is structured to serve women with different responsibilities, pressures, and seasons.',
      icon: Users,
    },
    {
      label: 'Spiritual emphasis',
      value: 'Prayer and scripture',
      detail:
        'Growth is built through biblical teaching, shared prayer, and consistent encouragement.',
      icon: BookOpenCheck,
    },
    {
      label: 'Culture',
      value: 'Warmth and accountability',
      detail:
        'We want sisterhood that is both welcoming and spiritually serious.',
      icon: HeartHandshake,
    },
    {
      label: 'Rhythm',
      value: 'Consistent gatherings',
      detail:
        'The ministry stays effective when women can return to steady fellowship and follow-through.',
      icon: CalendarDays,
    },
  ],
  mission: {
    eyebrow: 'Women’s mission',
    title:
      'Women flourish best where biblical formation and genuine support work together.',
    description:
      'This ministry creates space for women to deepen their walk with God, carry one another through real life, and grow into stronger service, leadership, and witness.',
    points: [
      'Build confidence in prayer, scripture, and spiritual discipline.',
      'Strengthen women through meaningful relationships and pastoral connection.',
      'Support healthy growth in family life, work life, and church service.',
      'Develop women who can mentor, disciple, and lead with wisdom.',
    ],
    panelTitle: 'What women often need from ministry',
    panelBody:
      'Clear biblical direction, community support, and a trusted environment for growth often matter more than simply having another event on the calendar.',
    panelItems: [
      'Scripture-led encouragement',
      'Space for honest prayer',
      'Supportive relationships',
      'Practical service pathways',
    ],
  },
  programs: [
    {
      title: 'Bible study circles',
      description:
        'Focused spaces to understand scripture, ask questions, and apply truth with maturity.',
      icon: BookOpenCheck,
    },
    {
      title: 'Prayer gatherings',
      description:
        'Shared prayer moments that strengthen women spiritually and deepen dependence on God.',
      icon: Sparkles,
    },
    {
      title: 'Mentorship and support',
      description:
        'Relationships that help women grow through counsel, shared wisdom, and real encouragement.',
      icon: HeartHandshake,
    },
    {
      title: 'Service and leadership opportunities',
      description:
        'Clear ways to contribute in ministry life and develop stable responsibility over time.',
      icon: Users,
    },
  ],
  pathways: [
    {
      title: 'Attend and observe the rhythm',
      description:
        'Start by showing up consistently and learning how the ministry relates, prays, and grows together.',
    },
    {
      title: 'Build relationships intentionally',
      description:
        'Healthy ministry life grows through real connection, not just attendance at events.',
    },
    {
      title: 'Join spiritual growth moments',
      description:
        'Move into prayer, study, and discipleship rhythms that build depth beyond inspiration.',
    },
    {
      title: 'Serve where your gifts fit',
      description:
        'As clarity grows, step into practical service or mentoring responsibility where appropriate.',
    },
  ],
  cta: {
    title:
      'If you want to join the women’s ministry, we can help you connect clearly.',
    description:
      'Reach out and we will guide you into the right starting point for fellowship, growth, and service.',
    primaryHref: '/contact',
    primaryLabel: 'Join the women’s ministry',
    secondaryHref: '/pastoral',
    secondaryLabel: 'Explore pastoral care',
  },
};

export default function WomenPage() {
  return <MinistryDetailPage config={config} />;
}
