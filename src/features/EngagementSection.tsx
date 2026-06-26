'use client';

import { Heart, Users2, Volume2, Zap } from 'lucide-react';
import { Container, Section } from '@/shared/layout';
import { H2, H3, BodyMD, BodySM, Caption } from '@/shared/text';

const features = [
  {
    icon: Volume2,
    title: 'Inspiring Messages',
    description: 'Powerful teachings that transform lives and strengthen faith',
    cta: 'Listen Now',
    href: '/resources/sermons',
  },
  {
    icon: Users2,
    title: 'Community',
    description:
      'Join our vibrant family of believers across online and in-person',
    cta: 'Join Us',
    href: '#join',
  },
  {
    icon: Heart,
    title: 'Service Opportunities',
    description: 'Discover ways to use your gifts and make a real impact',
    cta: 'Serve with Us',
    href: '#join',
  },
  {
    icon: Zap,
    title: 'Spiritual Growth',
    description:
      'Resources, events, and mentorship to deepen your faith journey',
    cta: 'Explore Resources',
    href: '/resources',
  },
];

export default function EngagementSection() {
  return (
    <Section
      padding="lg"
      className="bg-[var(--app-dark-2)] py-12 sm:py-16 md:py-20"
    >
      <Container size="xl" className="space-y-12">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Caption className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-primary)]">
            Why Choose Us
          </Caption>
          <H2 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Experience the Power of Faith
          </H2>
          <BodyMD className="mx-auto max-w-2xl text-base text-white/70 sm:text-lg">
            Whether you're seeking spiritual growth, community connection, or
            ways to serve others, we've got something meaningful for you.
          </BodyMD>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:from-white/[0.08] hover:to-white/[0.05]"
              >
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[var(--app-primary)]/[0.12] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--app-primary)]/20 bg-[var(--app-primary)]/[0.09] transition-all duration-300 group-hover:scale-110">
                    <IconComponent className="h-6 w-6 text-[var(--app-primary)]" />
                  </div>

                  <div className="space-y-2">
                    <H3 className="text-xl font-bold text-white">
                      {feature.title}
                    </H3>
                    <BodySM className="leading-relaxed text-white/60">
                      {feature.description}
                    </BodySM>
                  </div>

                  <a
                    href={feature.href}
                    className="group/cta inline-flex items-center gap-2 py-2 text-sm font-semibold text-[var(--app-primary)] transition-all duration-300"
                  >
                    {feature.cta}
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
          <a
            href="/about"
            className="rounded-xl bg-[var(--app-primary)] px-8 py-4 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[var(--app-primary-light)]"
          >
            Learn More About Us
          </a>
          <a
            href="#join"
            className="rounded-xl border-2 border-[var(--app-primary)]/50 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/10"
          >
            Get Involved
          </a>
        </div>
      </Container>
    </Section>
  );
}
