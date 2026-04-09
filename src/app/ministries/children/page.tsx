'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { hero_bg_1 } from '@/components/assets';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  Container,
  Section,
  PageSection,
  FlexboxLayout,
  Gridbox,
} from '@/components/layout';
import { H2, H3, BodyMD, BodySM, Caption } from '@/components/text';
import PageHero from '@/components/features/hero/PageHero';

const CHILDREN_PROGRAMS = [
  {
    age: 'Ages 2-4',
    title: 'Little Explorers',
    description:
      'Simple Bible stories, songs, and play-based learning in a safe, nurturing environment.',
    activities: ['Bible Stories', 'Worship Songs', 'Creative Play'],
  },
  {
    age: 'Ages 5-7',
    title: 'Bible Adventurers',
    description:
      'Interactive lessons, crafts, and games that make Bible learning fun and memorable.',
    activities: ['Interactive Lessons', 'Arts & Crafts', 'Memory Verses'],
  },
  {
    age: 'Ages 8-12',
    title: 'Faith Builders',
    description:
      'Deeper Bible study, service projects, and building friendships centered on Christ.',
    activities: ['Bible Studies', 'Service Projects', 'Group Activities'],
  },
] as const;

const ChildrenPage = () => {
  const { colorScheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Children Ministry"
        subtitle="Nurturing Young Hearts in Faith"
        note="A safe and engaging environment where children discover God's love through fun activities, Bible stories, and age-appropriate teachings."
        backgroundImage={hero_bg_1.src}
        chips={[
          'Our Mission',
          'Service Times',
          'Programs by Age Group',
          'Children Ministry',
        ]}
      />

      <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
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
              Register Your Child
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Volunteer With Us
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4 sm:gap-5 lg:gap-6 items-start">
            <section
              className="rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6 lg:p-7"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.2) 100%)',
                boxShadow: '0 18px 44px rgba(0,0,0,0.34)',
              }}
            >
              <H2 className="text-xl sm:text-2xl font-semibold mb-2 leading-tight">
                Welcome to Our Children's Ministry!
              </H2>
              <BodyMD className="text-white/70 text-sm sm:text-base leading-relaxed mb-5">
                Where kids learn about Jesus in a way they can understand and
                enjoy
              </BodyMD>

              <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-5">
                <H3 className="text-base sm:text-lg font-semibold mb-3">
                  Our Mission
                </H3>
                <BodySM className="text-white/70 text-xs sm:text-sm leading-relaxed mb-3">
                  To partner with parents in laying a spiritual foundation that,
                  in God's timing, will lead a child into a personal
                  relationship with Jesus Christ.
                </BodySM>
                <BodySM className="text-white/70 text-xs sm:text-sm leading-relaxed">
                  We create engaging, age-appropriate environments where
                  children can learn biblical truths and discover how much God
                  loves them.
                </BodySM>
              </div>
            </section>

            <section
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6"
              style={{
                background:
                  'linear-gradient(150deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 46%, rgba(0,0,0,0.18) 100%)',
                boxShadow: '0 16px 36px rgba(0,0,0,0.28)',
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
                  Service Times
                </H3>
                <div className="space-y-3">
                  {[
                    { label: 'Sunday School', value: '10:30 AM' },
                    { label: "Children's Church", value: '9:00 AM & 11:00 AM' },
                    { label: 'Wednesday Nights', value: '7:00 PM' },
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
                        {item.value}
                      </Caption>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </Container>
      </Section>

      <Section padding="lg" className="relative overflow-hidden bg-[#070707]">
        <Container size="xl" className="space-y-5 sm:space-y-6">
          <div
            className="rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 48%, rgba(0,0,0,0.18) 100%)',
            }}
          >
            <H2 className="text-xl sm:text-2xl font-semibold text-center leading-tight">
              Programs by Age Group
            </H2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {CHILDREN_PROGRAMS.map(group => (
              <article
                key={group.title}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6"
                style={{
                  background:
                    'linear-gradient(150deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 46%, rgba(0,0,0,0.18) 100%)',
                  boxShadow: '0 14px 34px rgba(0,0,0,0.26)',
                }}
              >
                <div
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl font-semibold text-sm"
                  style={{
                    backgroundColor: `${colorScheme.primary}20`,
                    color: colorScheme.primary,
                    border: `1px solid ${colorScheme.primary}35`,
                  }}
                >
                  {group.age.split('-')[0].replace('Ages ', '')}
                </div>

                <Caption className="block text-[11px] sm:text-xs text-white/55 mb-1.5">
                  {group.age}
                </Caption>
                <H3 className="text-base sm:text-lg font-semibold mb-2 leading-tight">
                  {group.title}
                </H3>
                <BodySM className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4">
                  {group.description}
                </BodySM>

                <div className="space-y-2">
                  {group.activities.map(activity => (
                    <div
                      key={activity}
                      className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                    >
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: colorScheme.primary }}
                      />
                      <span className="text-white/75 text-[11px] sm:text-xs leading-relaxed">
                        {activity}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default ChildrenPage;
