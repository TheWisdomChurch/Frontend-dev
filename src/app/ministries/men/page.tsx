export const dynamic = 'force-dynamic';

import {
  BookOpenCheck,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

import MinistryDetailPage from '@/shared/components/site/MinistryDetailPage';

const config = {
  hero: {
    title:
      'A men’s ministry focused on integrity, discipleship, and responsible leadership.',
    subtitle:
      'The men’s ministry is designed to help men grow in spiritual discipline, brotherhood, and service at home, in church, and in public life.',
    note: 'We want men who are clear in conviction, stable in character, accountable in community, and dependable in service.',
    chips: ['Integrity', 'Brotherhood', 'Leadership', 'Service'],
  },
  stats: [
    {
      label: 'Formation goal',
      value: 'Godly men of integrity',
      detail:
        'The ministry focuses on character, responsibility, and spiritual steadiness.',
      icon: ShieldCheck,
    },
    {
      label: 'Growth pattern',
      value: 'Brotherhood and accountability',
      detail:
        'Men often grow best where challenge, encouragement, and honest relationships coexist.',
      icon: Users,
    },
    {
      label: 'Spiritual base',
      value: 'Scripture and prayer',
      detail:
        'The ministry aims to shape conviction before platform or visibility.',
      icon: BookOpenCheck,
    },
    {
      label: 'Practical rhythm',
      value: 'Consistent connection',
      detail:
        'Lasting change is built through regular engagement, not occasional inspiration.',
      icon: CalendarDays,
    },
  ],
  mission: {
    eyebrow: 'Men’s mission',
    title:
      'Men need a context where truth, challenge, and brotherhood work together.',
    description:
      'This ministry exists to help men develop biblical strength, spiritual discipline, and the kind of maturity that produces faithful leadership in every area of life.',
    points: [
      'Strengthen men in prayer, scripture, and practical obedience.',
      'Encourage accountability, honesty, and healthy brotherhood.',
      'Develop men who can lead with humility at home and in church.',
      'Create a service culture where responsibility is normal and meaningful.',
    ],
    panelTitle: 'What mature men need from ministry',
    panelBody:
      'Men often need a ministry environment that is both spiritually serious and relationally honest, where accountability is welcomed rather than avoided.',
    panelItems: [
      'Clear biblical direction',
      'Brotherhood with trust',
      'Practical leadership growth',
      'Steady service opportunities',
    ],
  },
  programs: [
    {
      title: 'Brotherhood gatherings',
      description:
        'Meetings that build trust, spiritual honesty, and relational strength among men.',
      icon: Users,
    },
    {
      title: 'Biblical formation',
      description:
        'Teaching and discussion aimed at building conviction, wisdom, and maturity.',
      icon: BookOpenCheck,
    },
    {
      title: 'Leadership growth',
      description:
        'Intentional opportunities to become more dependable in church, family, and work life.',
      icon: Sparkles,
    },
    {
      title: 'Accountability culture',
      description:
        'A ministry posture that encourages truthfulness, humility, and long-term spiritual consistency.',
      icon: ShieldCheck,
    },
  ],
  pathways: [
    {
      title: 'Show up consistently',
      description:
        'Brotherhood takes time. The first step is steady presence and openness to growth.',
    },
    {
      title: 'Build trusted relationships',
      description:
        'Healthy ministry among men grows where trust, honesty, and encouragement are possible.',
    },
    {
      title: 'Commit to formation',
      description:
        'Lean into the teaching, prayer, and accountability structures that help growth become durable.',
    },
    {
      title: 'Lead through service',
      description:
        'As maturity develops, responsibility should follow in meaningful and well-supported ways.',
    },
  ],
  cta: {
    title:
      'If you want to connect with the men’s ministry, start by reaching out here.',
    description:
      'We can help you find the right pathway into brotherhood, discipleship, and service.',
    primaryHref: '/contact',
    primaryLabel: 'Join the men’s ministry',
    secondaryHref: '/events/weekly',
    secondaryLabel: 'See weekly rhythm',
  },
};

export default function MenPage() {
  return <MinistryDetailPage config={config} />;
}
