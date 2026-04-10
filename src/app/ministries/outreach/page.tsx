export const dynamic = 'force-dynamic';

import {
  CalendarDays,
  HeartHandshake,
  Megaphone,
  Sparkles,
  Users,
} from 'lucide-react';

import MinistryDetailPage from '@/shared/components/site/MinistryDetailPage';

const config = {
  hero: {
    title:
      'An outreach ministry that turns compassion into practical, visible service.',
    subtitle:
      'The outreach ministry expresses the love of Christ through evangelism, community support, and people-centered action beyond church walls.',
    note: 'We want outreach to be spiritually grounded, thoughtfully organized, and genuinely useful to the people and communities being served.',
    chips: ['Compassion', 'Community impact', 'Evangelism', 'Service'],
  },
  stats: [
    {
      label: 'Primary focus',
      value: 'Church beyond the walls',
      detail:
        'The ministry exists to carry practical love and gospel witness into the community.',
      icon: Megaphone,
    },
    {
      label: 'Service pattern',
      value: 'Compassion in action',
      detail:
        'Projects are meant to be prayerful, practical, and meaningful to real people.',
      icon: HeartHandshake,
    },
    {
      label: 'Volunteer need',
      value: 'People ready to serve',
      detail:
        'Outreach works best when members are available, teachable, and consistent.',
      icon: Users,
    },
    {
      label: 'Planning rhythm',
      value: 'Project-based engagement',
      detail:
        'Initiatives require communication, preparation, and dependable follow-through.',
      icon: CalendarDays,
    },
  ],
  mission: {
    eyebrow: 'Outreach mission',
    title:
      'Outreach should carry both the compassion of Christ and the wisdom to serve people well.',
    description:
      'This ministry exists to meet practical needs, strengthen human dignity, and create meaningful opportunities for the church to serve its city with love and clarity.',
    points: [
      'Demonstrate the gospel through visible acts of service and compassion.',
      'Respond to community needs with care, structure, and humility.',
      'Create opportunities for members to serve beyond internal church activities.',
      'Build a culture where mission is not occasional but part of normal church life.',
    ],
    panelTitle: 'What makes outreach effective',
    panelBody:
      'Impact grows when projects are planned well, volunteers are supported, and the ministry keeps people, not optics, at the center.',
    panelItems: [
      'Community-sensitive planning',
      'Volunteer coordination',
      'Prayerful service posture',
      'Clear follow-through after projects',
    ],
  },
  programs: [
    {
      title: 'Community support initiatives',
      description:
        'Projects focused on meeting practical needs and strengthening families and neighborhoods.',
      icon: HeartHandshake,
    },
    {
      title: 'Evangelism touchpoints',
      description:
        'Intentional moments of witness that combine compassion, clarity, and spiritual courage.',
      icon: Sparkles,
    },
    {
      title: 'Volunteer service teams',
      description:
        'Teams that organize, prepare, and execute outreach with consistency and humility.',
      icon: Users,
    },
    {
      title: 'Project-based mobilization',
      description:
        'Focused initiatives that help the church respond well to specific needs and moments.',
      icon: CalendarDays,
    },
  ],
  pathways: [
    {
      title: 'Start with availability',
      description:
        'Outreach begins with willingness to serve and openness to the needs of others.',
    },
    {
      title: 'Understand the project structure',
      description:
        'Serving well requires knowing the purpose, process, and expectations attached to each initiative.',
    },
    {
      title: 'Serve with humility and consistency',
      description:
        'The ministry works best when people show up prepared, teachable, and steady.',
    },
    {
      title: 'Stay engaged after the event',
      description:
        'Good outreach thinks beyond the day of service and considers ongoing care or follow-through.',
    },
  ],
  cta: {
    title:
      'If you want to serve through outreach, we can help you step in well.',
    description:
      'Reach out and we will guide you toward the next community service opportunity or ministry pathway.',
    primaryHref: '/contact',
    primaryLabel: 'Join outreach',
    secondaryHref: '/events/upcoming',
    secondaryLabel: 'See upcoming programs',
  },
};

export default function OutreachPage() {
  return <MinistryDetailPage config={config} />;
}
