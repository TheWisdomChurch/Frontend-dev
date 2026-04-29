'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarHeart,
  CheckCircle2,
  HeartHandshake,
  LifeBuoy,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
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
    shortTitle: 'Counseling',
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
    shortTitle: 'Prayer',
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
    shortTitle: 'Crisis',
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
    shortTitle: 'Life Events',
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

const careValues = [
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

      <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(215,187,117,0.14),transparent_32%),radial-gradient(circle_at_86%_8%,rgba(255,255,255,0.07),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(215,187,117,0.08),transparent_36%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />
        </div>

        <Container size="xl" className="relative z-10 space-y-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d7bb75]/25 bg-[#d7bb75]/10 px-3 py-1.5 text-[#d7bb75]">
                <Sparkles className="h-3.5 w-3.5" />
                <p className="text-[10px] font-bold uppercase tracking-[0.24em]">
                  Care pathways
                </p>
              </div>

              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Choose the type of support that matches your current need.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                Every care request is different. Select a pathway below so the
                right ministry response becomes clearer and easier to begin.
              </p>
            </div>

            <a
              href="/contact"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#d7bb75] px-5 py-3 text-sm font-bold text-black shadow-[0_16px_40px_rgba(215,187,117,0.18)] transition hover:scale-[1.01] hover:bg-[#ead69d]"
            >
              Request support
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.42fr_0.58fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-3 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {services.map(service => {
                  const Icon = service.icon;
                  const active = activeTab === service.id;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setActiveTab(service.id)}
                      className={`group rounded-[1.35rem] border p-4 text-left transition duration-300 ${
                        active
                          ? 'border-[#d7bb75]/45 bg-[#d7bb75]/12 shadow-[0_16px_45px_rgba(0,0,0,0.24)]'
                          : 'border-white/8 bg-black/20 hover:border-white/16 hover:bg-white/[0.055]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
                            active
                              ? 'bg-[#d7bb75] text-black'
                              : 'bg-white/[0.06] text-[#d7bb75] group-hover:bg-white/[0.1]'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-white">
                            {service.shortTitle}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/52">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(0,0,0,0.28))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d7bb75]/10 blur-3xl" />

              <div className="relative z-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                <div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#d7bb75]/20 bg-[#d7bb75]/12 text-[#d7bb75]">
                    <SelectedIcon className="h-7 w-7" />
                  </div>

                  <p className="mt-6 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#d7bb75]">
                    Care focus
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {selectedService.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/68 sm:text-base">
                    {selectedService.description}
                  </p>
                </div>

                <div className="grid gap-3">
                  {selectedService.features.map((feature, index) => (
                    <div
                      key={feature}
                      className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-black/24 px-4 py-4 text-sm leading-6 text-white/72 transition duration-300 hover:border-[#d7bb75]/25 hover:bg-black/34"
                      style={{ transitionDelay: `${index * 45}ms` }}
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d7bb75]/14 text-[#d7bb75]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section
        padding="lg"
        className="relative overflow-hidden border-y border-white/10 bg-[#080808]"
      >
        <Container size="xl" className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#d7bb75]">
              Care values
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Clear, compassionate, and appropriately bounded pastoral support.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              Pastoral care works best when people understand the process,
              confidentiality is respected, and each request has a responsible
              next step.
            </p>
          </div>

          <FeatureGrid items={careValues} columns={4} />
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
