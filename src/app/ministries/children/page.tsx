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
      'A children’s ministry designed for safety, joy, and strong early discipleship.',
    subtitle:
      'The children’s ministry helps young hearts encounter Jesus through age-appropriate teaching, consistent care, and engaging church experiences.',
    note: 'We want parents to trust the environment and children to leave each gathering with a deeper awareness of God’s love and truth.',
    chips: ['Children', 'Safe care', 'Bible teaching', 'Family support'],
  },
  stats: [
    {
      label: 'Primary focus',
      value: 'Children and families',
      detail:
        'The ministry serves children while helping parents feel confident in the church environment.',
      icon: Users,
    },
    {
      label: 'Spiritual base',
      value: 'Bible-centered learning',
      detail:
        'Children are introduced to scripture and Christian truth in accessible ways.',
      icon: BookOpenCheck,
    },
    {
      label: 'Care standard',
      value: 'Safe and welcoming',
      detail:
        'Environment, supervision, and communication should help families feel at ease.',
      icon: HeartHandshake,
    },
    {
      label: 'Ministry rhythm',
      value: 'Consistent weekly care',
      detail:
        'Children benefit most where teaching and support are steady and age-aware.',
      icon: CalendarDays,
    },
  ],
  mission: {
    eyebrow: 'Children’s mission',
    title:
      'Children should experience church as a place of safety, joy, truth, and belonging.',
    description:
      'The children’s ministry exists to help young people know God early, feel cared for in church, and build spiritual foundations that support long-term growth.',
    points: [
      'Teach biblical truth in engaging and age-appropriate ways.',
      'Create an environment that feels safe, warm, and structured.',
      'Support families by reinforcing faith formation from an early age.',
      'Help children enjoy church while taking God seriously.',
    ],
    panelTitle: 'What families usually need',
    panelBody:
      'Parents often need a ministry they can trust, and children need a space that is both joyful and spiritually meaningful. The ministry aims to provide both.',
    panelItems: [
      'Safe and supervised environments',
      'Clear communication with families',
      'Joyful learning moments',
      'A consistent church rhythm for children',
    ],
  },
  programs: [
    {
      title: 'Bible teaching sessions',
      description:
        'Scripture-centered moments designed to help children understand God’s truth at their level.',
      icon: BookOpenCheck,
    },
    {
      title: 'Worship and response',
      description:
        'Age-aware worship experiences that help children engage church life with joy and reverence.',
      icon: Sparkles,
    },
    {
      title: 'Caring supervision',
      description:
        'Leaders and volunteers who create a warm environment and take practical safety seriously.',
      icon: HeartHandshake,
    },
    {
      title: 'Family support touchpoints',
      description:
        'A ministry posture that helps parents feel informed, supported, and connected.',
      icon: Users,
    },
  ],
  pathways: [
    {
      title: 'Bring your child consistently',
      description:
        'Regular attendance helps children grow familiar with the environment, leaders, and spiritual rhythm.',
    },
    {
      title: 'Meet the ministry team',
      description:
        'Parents should feel able to know the people serving their children and understand the environment.',
    },
    {
      title: 'Build a home-and-church rhythm',
      description:
        'Children grow best when church teaching and family conversation work together.',
    },
    {
      title: 'Stay connected as your child grows',
      description:
        'The ministry should continue helping children transition well into later stages of church life.',
    },
  ],
  cta: {
    title:
      'If you want to connect your child to the children’s ministry, reach out here.',
    description:
      'We can help your family understand what to expect and how to settle into the ministry environment.',
    primaryHref: '/contact',
    primaryLabel: 'Connect my family',
    secondaryHref: '/events',
    secondaryLabel: 'See church schedule',
  },
};

export default function ChildrenPage() {
  return <MinistryDetailPage config={config} />;
}
