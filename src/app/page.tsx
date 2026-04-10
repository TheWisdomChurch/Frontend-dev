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

import SliderHero from '@/features/hero/SliderHero';
import { missionStatement } from '@/lib/data';
import { Container, Section } from '@/shared/layout';
import { BodyMD, Caption, H3 } from '@/shared/text';

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
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-deep)',
        color: 'var(--color-text-primary)',
      }}
    >
      <SliderHero />

      {/* Quick Guides Section */}
      <Section
        padding="lg"
        className="relative overflow-hidden border-y"
        style={{
          borderColor: 'var(--color-border-light)',
          backgroundColor: 'var(--color-bg-dark)',
        }}
      >
        <Container size="xl" className="grid gap-5 lg:grid-cols-3">
          {quickGuides.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl p-6 sm:p-7"
                style={{
                  backgroundColor: 'rgba(215, 187, 117, 0.06)',
                  border: '1px solid var(--color-border-light)',
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: 'rgba(215, 187, 117, 0.15)',
                      border: '1px solid var(--color-border-light)',
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: 'var(--color-gold)' }}
                    />
                  </div>
                  <p
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {item.label}
                  </p>
                </div>
                <p
                  className="text-lg font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {item.value}
                </p>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {item.detail}
                </p>
              </div>
            );
          })}
        </Container>
      </Section>

      {/* Mission & Values Section */}
      <Section
        padding="lg"
        className="relative overflow-hidden border-b"
        style={{
          borderColor: 'var(--color-border-light)',
          backgroundColor: 'var(--color-bg-darker)',
        }}
      >
        <Container size="xl" className="space-y-12 sm:space-y-16">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-5">
              <p
                className="text-sm uppercase tracking-widest font-semibold"
                style={{ color: 'var(--color-gold)' }}
              >
                Who We Are
              </p>
              <h2
                className="font-serif leading-tight"
                style={{
                  fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                  color: 'var(--color-text-primary)',
                }}
              >
                A House of Wisdom, Power, Excellence & Care
              </h2>
              <p
                className="max-w-2xl text-base leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {missionStatement}
              </p>
            </div>

            {/* Promise Pillars */}
            <div className="grid gap-5 sm:grid-cols-3">
              {promisePillars.map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl p-6 sm:p-7"
                    style={{
                      backgroundColor: 'rgba(215, 187, 117, 0.06)',
                      border: '1px solid var(--color-border-light)',
                    }}
                  >
                    <div
                      className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: 'rgba(215, 187, 117, 0.15)',
                        border: '1px solid var(--color-border-light)',
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: 'var(--color-gold)' }}
                      />
                    </div>
                    <p
                      className="text-base font-semibold leading-tight mb-2"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* First Visit Info */}
          <div
            className="rounded-2xl p-8 sm:p-10 lg:p-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
            style={{
              backgroundColor: 'rgba(215, 187, 117, 0.08)',
              border: '1px solid var(--color-border-light)',
            }}
          >
            <div className="space-y-4">
              <p
                className="text-sm uppercase tracking-widest font-semibold"
                style={{ color: 'var(--color-gold)' }}
              >
                First-Time Guests
              </p>
              <p
                className="max-w-2xl text-lg sm:text-xl leading-tight font-serif"
                style={{ color: 'var(--color-text-primary)' }}
              >
                A church website should remove uncertainty. It should help you
                know what the house is like before you ever arrive.
              </p>
            </div>
            <div className="grid gap-3">
              {firstVisitSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-lg px-4 py-3 text-sm"
                  style={{
                    backgroundColor: 'rgba(215, 187, 117, 0.1)',
                    border: '1px solid var(--color-border-light)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps Grid */}
          <div className="grid gap-5 lg:grid-cols-4">
            {nextPaths.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:border-opacity-100 hover:shadow-lg"
                  style={{
                    backgroundColor: 'rgba(215, 187, 117, 0.06)',
                    border: '1px solid var(--color-border-light)',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(215, 187, 117, 0.12)';
                    e.currentTarget.style.borderColor = 'var(--color-gold)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(215, 187, 117, 0.06)';
                    e.currentTarget.style.borderColor =
                      'var(--color-border-light)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: 'rgba(215, 187, 117, 0.15)',
                      border: '1px solid var(--color-border-light)',
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: 'var(--color-gold)' }}
                    />
                  </div>
                  <p
                    className="text-lg font-semibold leading-tight"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {item.description}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition group-hover:gap-3"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Main Content Sections */}
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
