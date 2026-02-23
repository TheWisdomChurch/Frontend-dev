'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { hero_bg_2 } from '@/components/assets';
import { useTheme } from '@/components/contexts/ThemeContext';
import { Section, Container } from '@/components/layout';
import { BodyMD, BodySM, H2, H3, Caption } from '@/components/text';
import PageHero from '@/components/ui/PageHero';

const YouthPage = () => {
  const { colorScheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Youth Ministry"
        subtitle="Empowering the Next Generation"
        note="A dynamic space where teenagers can explore faith, build authentic relationships, and discover their purpose in Christ."
        backgroundImage={hero_bg_2.src}
        chips={['Ignite Youth Group', "What We're About", 'Weekly Schedule']}
      />

      <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            maskImage:
              'radial-gradient(circle at 50% 32%, black 40%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 32%, black 40%, transparent 92%)',
          }}
        />

        <Container size="xl" className="relative z-10 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
              style={{ backgroundColor: colorScheme.primary }}
            >
              Join Youth Group
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Upcoming Events
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div
            className="rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6 lg:p-7"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 44%, rgba(0,0,0,0.2) 100%)',
              boxShadow: '0 18px 46px rgba(0,0,0,0.34)',
            }}
          >
            <H2 className="text-xl sm:text-2xl font-semibold mb-2 leading-tight">
              Ignite Youth Group
            </H2>
            <BodyMD className="text-white/70 text-sm sm:text-base leading-relaxed">
              For students in 6th through 12th grade
            </BodyMD>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-start">
            <section
              className="rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6"
              style={{
                background:
                  'linear-gradient(150deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 45%, rgba(0,0,0,0.18) 100%)',
              }}
            >
              <H3 className="text-base sm:text-lg font-semibold mb-3">
                What We're About
              </H3>
              <BodyMD className="text-white/70 text-sm sm:text-base leading-relaxed mb-4">
                Our youth ministry creates a space where teenagers can be
                themselves, ask tough questions, and grow in their relationship
                with God. We're committed to helping students navigate the
                challenges of adolescence with biblical wisdom and supportive
                community.
              </BodyMD>
              <div className="space-y-2.5">
                {[
                  'Relevant biblical teaching',
                  'Authentic relationships',
                  'Fun events and activities',
                ].map(item => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: colorScheme.primary }}
                    />
                    <BodySM className="text-white/75 text-xs sm:text-sm">
                      {item}
                    </BodySM>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6"
              style={{
                background:
                  'linear-gradient(150deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 48%, rgba(0,0,0,0.18) 100%)',
              }}
            >
              <div
                className="absolute inset-0 opacity-75"
                style={{
                  background: `radial-gradient(circle at 88% 14%, ${colorScheme.primary}22 0%, transparent 46%)`,
                }}
              />
              <div className="relative">
                <H3 className="text-base sm:text-lg font-semibold mb-4">
                  Weekly Schedule
                </H3>
                <div className="space-y-3">
                  {[
                    { label: 'Wednesday Nights', time: '7:00 PM' },
                    { label: 'Sunday School', time: '10:30 AM' },
                    { label: 'Monthly Events', time: 'Various Times' },
                  ].map(item => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 px-3.5 py-3"
                    >
                      <BodySM className="text-white/80 text-xs sm:text-sm">
                        {item.label}
                      </BodySM>
                      <Caption
                        className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-right"
                        style={{ color: colorScheme.primary }}
                      >
                        {item.time}
                      </Caption>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default YouthPage;
