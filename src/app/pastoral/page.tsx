'use client';

import { useMemo, useState } from 'react';
import {
  CalendarHeart,
  HeartHandshake,
  LifeBuoy,
  MessageCircleHeart,
  ShieldCheck,
} from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import {
  ActionBanner,
  FeatureGrid,
  StatStrip,
} from '@/shared/components/site/PublicPageBlocks';

const services = [
  {
    id: 'counseling',
    title: 'Pastoral Counseling',
    description:
      'A guided conversation space for spiritual questions, family pressure, grief, transitions, and personal challenges.',
    icon: MessageCircleHeart,
    features: [
      'One-on-one pastoral conversations',
      'Biblical guidance with practical clarity',
      'Confidential handling of personal matters',
      'Thoughtful follow-up where needed',
    ],
  },
  {
    id: 'prayer',
    title: 'Prayer Support',
    description:
      'Submit requests and receive dedicated prayer support from a team that understands both urgency and discretion.',
    icon: HeartHandshake,
    features: [
      'Prayer for personal and family needs',
      'Support during spiritual pressure or uncertainty',
      'Follow-up where a response is needed',
      'Connection to broader church care when appropriate',
    ],
  },
  {
    id: 'crisis',
    title: 'Crisis Care',
    description:
      'Support during moments that require prompt pastoral attention, stability, and human presence.',
    icon: LifeBuoy,
    features: [
      'Pastoral presence in urgent situations',
      'Care during grief, loss, or intense transition',
      'Short-term stabilization and support',
      'Referral guidance when specialist support is required',
    ],
  },
  {
    id: 'life-events',
    title: 'Life Events',
    description:
      'Pastoral support for weddings, family milestones, and seasons that require intentional spiritual guidance.',
    icon: CalendarHeart,
    features: [
      'Marriage and pre-marital guidance',
      'Family milestone support',
      'Spiritual preparation for major transitions',
      'A clearer process for church-related requests',
    ],
  },
] as const;

const stats = [
  {
    label: 'Care approach',
    value: 'Pastoral and personal',
    detail:
      'Support is designed to feel human, prayerful, and responsibly handled.',
    icon: HeartHandshake,
  },
  {
    label: 'Response type',
    value: 'Guidance and prayer',
    detail:
      'We aim to respond with clarity and direct requests to the right part of the church team.',
    icon: MessageCircleHeart,
  },
  {
    label: 'Confidentiality',
    value: 'Handled with care',
    detail:
      'Sensitive issues are treated with discretion and pastoral maturity.',
    icon: ShieldCheck,
  },
  {
    label: 'Entry point',
    value: 'Simple next step',
    detail:
      'You do not need to guess where to start. This page is designed to make contact clear.',
    icon: LifeBuoy,
  },
];

export default function PastoralPage() {
  const [activeTab, setActiveTab] =
    useState<(typeof services)[number]['id']>('counseling');

  const selectedService = useMemo(
    () => services.find(service => service.id === activeTab) ?? services[0],
    [activeTab]
  );

  const SelectedIcon = selectedService.icon;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Pastoral care should feel accessible, prayerful, and responsibly structured."
        subtitle="If you need guidance, prayer, crisis support, or help navigating a major life moment, this page is your starting point."
        note="We want people to know where care lives in the church and how to reach it without confusion or pressure."
        chips={['Counseling', 'Prayer support', 'Crisis care', 'Life events']}
      />

      <StatStrip items={stats} />

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              Care pathways
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Choose the type of support that matches your current need.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {services.map(service => (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveTab(service.id)}
                className="rounded-full border px-4 py-2 text-sm font-medium transition"
                style={
                  activeTab === service.id
                    ? {
                        borderColor: 'transparent',
                        color: '#050505',
                        background: 'linear-gradient(135deg, #d7bb75, #f0deaa)',
                      }
                    : {
                        borderColor: 'rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.72)',
                        background: 'rgba(255,255,255,0.03)',
                      }
                }
              >
                {service.title}
              </button>
            ))}
          </div>

          <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(155deg,rgba(255,255,255,0.08),rgba(0,0,0,0.24))] p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <SelectedIcon className="h-6 w-6 text-[#d7bb75]" />
              </div>
              <p className="mt-6 text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
                Care focus
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                {selectedService.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-white/68">
                {selectedService.description}
              </p>
            </div>

            <div className="grid gap-3">
              {selectedService.features.map(feature => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="lg" className="border-y border-white/10 bg-[#080808]">
        <Container size="xl" className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              Care values
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Pastoral support works best when it is clear, compassionate, and
              appropriately bounded.
            </h2>
          </div>
          <FeatureGrid
            items={[
              {
                title: 'Accessible entry points',
                description:
                  'People should know exactly where to reach out when they need help, prayer, or a conversation.',
                icon: HeartHandshake,
              },
              {
                title: 'Confidential handling',
                description:
                  'Sensitive issues must be treated with discretion, maturity, and respect for the person involved.',
                icon: ShieldCheck,
              },
              {
                title: 'Prayer with wisdom',
                description:
                  'We do not separate care from prayer, but we also do not approach complex needs carelessly.',
                icon: MessageCircleHeart,
              },
              {
                title: 'Clear next steps',
                description:
                  'Where follow-up, referral, or ministry support is needed, people should know what happens next.',
                icon: CalendarHeart,
              },
            ]}
            columns={4}
          />
        </Container>
      </Section>

      <ActionBanner
        eyebrow="Request support"
        title="If you need prayer or a pastoral conversation, start with the contact page and tell us what you need."
        description="We will route your request carefully and help you move toward the right support path."
        primaryHref="/contact"
        primaryLabel="Request support"
        secondaryHref="/events"
        secondaryLabel="View service times"
      />
    </div>
  );
}
