'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  HeartHandshake,
  MapPin,
  Radio,
  Sparkles,
  Users,
} from 'lucide-react';

import HeroMain from '@/features/hero/HeroMain';
import { missionStatement } from '@/lib/data';
import { Container, Section } from '@/shared/layout';
import { BodyMD, Caption, H3 } from '@/shared/text';
import { useTheme } from '@/shared/contexts/ThemeContext';

const WhatWeDo = dynamic(() => import('@/features/WhatWeDo'), {
  ssr: true,
  loading: () => null,
});

const EventsShowcase = dynamic(
  () => import('@/features/events/EventsShowcase'),
  {
    ssr: false,
    loading: () => null,
  }
);

const SeniorPastor = dynamic(
  () => import('@/features/leadership/SeniorPastor'),
  {
    ssr: true,
    loading: () => null,
  }
);

const EngagementSection = dynamic(
  () => import('@/features/EngagementSection'),
  {
    ssr: true,
    loading: () => null,
  }
);

const Testimonials = dynamic(
  () => import('@/features/testimonials/Testimonials'),
  {
    ssr: true,
    loading: () => null,
  }
);

const ResourceSection = dynamic(() => import('@/features/resources/Resource'), {
  ssr: true,
  loading: () => null,
});

const JoinWisdomHouse = dynamic(() => import('@/features/events/JoinUs'), {
  ssr: true,
  loading: () => null,
});

const quickGuides = [
  {
    label: 'Sunday Worship',
    value: '9:00 AM',
    detail: 'Spirit-filled worship, prayer, and biblical teaching.',
    icon: Radio,
  },
  {
    label: 'Midweek Service',
    value: 'Thursday · 6:00 PM',
    detail:
      'A focused church rhythm for Word, prayer, and spiritual refreshing.',
    icon: CalendarDays,
  },
  {
    label: 'Location',
    value: 'Honor Gardens, Lekki-Epe',
    detail: 'Opposite Dominion City, Alasia Bus Stop, Lagos.',
    icon: MapPin,
  },
];

const promisePillars = [
  {
    title: 'Presence-driven worship',
    description:
      'We make space for worship, prayer, and reverence without losing clarity or direction.',
    icon: Sparkles,
  },
  {
    title: 'Practical biblical teaching',
    description:
      'Messages are designed to strengthen conviction, character, and everyday obedience.',
    icon: BookOpenCheck,
  },
  {
    title: 'Authentic community',
    description:
      'Church life is structured to help families, students, and professionals truly belong.',
    icon: Users,
  },
];

const firstVisitSteps = [
  'Know where we meet and what time to arrive.',
  'Understand the feel of the service before you come.',
  'See how ministries, care, and community life are structured.',
  'Take one clear next step after your first visit.',
];

const nextPaths = [
  {
    title: 'Plan your first visit',
    description:
      'Get directions, contact details, and help with what to expect on your first Sunday.',
    href: '/contact',
    icon: MapPin,
  },
  {
    title: 'Explore ministries',
    description:
      'Find a clear place for growth, discipleship, and service across every generation.',
    href: '/ministries',
    icon: Users,
  },
  {
    title: 'Catch up on sermons',
    description:
      'Watch recent messages and follow the current teaching emphasis of the house.',
    href: '/resources/sermons',
    icon: BookOpenCheck,
  },
  {
    title: 'Share life with us',
    description:
      'Reach out for prayer, pastoral care, or a conversation about getting connected.',
    href: '/pastoral',
    icon: HeartHandshake,
  },
];

export default function Home() {
  const { colorScheme } = useTheme();
  const primary = colorScheme.primary || '#d9b35f';
  const primaryGlow = colorScheme.opacity.primary10 || 'rgba(217,179,95,0.1)';

  return (
    <div className="bg-[#050505] text-white">
      <HeroMain
        primaryButtonText="Plan Your Visit"
        secondaryButtonText="Watch a Message"
        onPrimaryButtonClick={() => {
          window.location.href = '/contact';
        }}
        onSecondaryButtonClick={() => {
          window.location.href = '/resources/sermons';
        }}
      />

      <Section
        padding="md"
        className="relative overflow-hidden border-y border-white/10 bg-[#070707]"
      >
        <Container size="xl" className="grid gap-3 sm:grid-cols-3">
          {quickGuides.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-white/12 bg-black/30 p-4 backdrop-blur-md"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10"
                    style={{ backgroundColor: primaryGlow }}
                  >
                    <Icon className="h-4 w-4" style={{ color: primary }} />
                  </div>
                  <Caption className="text-[0.62rem] uppercase tracking-[0.18em] text-white/60">
                    {item.label}
                  </Caption>
                </div>
                <p className="text-sm font-semibold text-white sm:text-base">
                  {item.value}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/65">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </Container>
      </Section>

      <Section
        padding="lg"
        className="relative overflow-hidden border-b border-white/10 bg-[#080808]"
      >
        <Container size="xl" className="space-y-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              <Caption
                className="uppercase tracking-[0.2em] text-[0.62rem]"
                style={{ color: primary }}
              >
                Who we are
              </Caption>
              <H3 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                A house of wisdom, power, excellence, and care.
              </H3>
              <BodyMD className="max-w-2xl text-base leading-relaxed text-white/70">
                {missionStatement}
              </BodyMD>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {promisePillars.map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div
                      className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10"
                      style={{ backgroundColor: primaryGlow }}
                    >
                      <Icon className="h-5 w-5" style={{ color: primary }} />
                    </div>
                    <p className="text-base font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/66">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(0,0,0,0.22))] p-5 sm:grid-cols-[1.1fr_0.9fr] sm:p-7">
            <div className="space-y-3">
              <Caption className="text-[0.62rem] uppercase tracking-[0.18em] text-white/55">
                First-time guests
              </Caption>
              <p className="max-w-2xl text-lg font-semibold leading-snug text-white sm:text-xl">
                A church website should remove uncertainty. It should help you
                know what the house is like before you ever arrive.
              </p>
            </div>
            <div className="grid gap-2">
              {firstVisitSteps.map(step => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/72"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {nextPaths.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10"
                    style={{ backgroundColor: primaryGlow }}
                  >
                    <Icon className="h-5 w-5" style={{ color: primary }} />
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/66">
                    {item.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#d7bb75]">
                    Open page
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <WhatWeDo />
      <EventsShowcase />
      <SeniorPastor />
      <EngagementSection />
      <Testimonials />
      <ResourceSection />

      <div id="join">
        <JoinWisdomHouse />
      </div>
    </div>
  );
}
