'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { hero_bg_1 } from '@/components/assets';
import { useTheme } from '@/components/contexts/ThemeContext';
import { Section, Container } from '@/components/layout';
import { BodyMD, BodySM, H2, H3, Caption } from '@/components/text';
import PageHero from '@/components/features/hero/PageHero';

const MenPage = () => {
  const { colorScheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Men's Ministry"
        subtitle="Building Godly Men"
        note="Equipping men to lead with integrity, serve with purpose, and grow in their faith through fellowship and biblical teaching."
        backgroundImage={hero_bg_1.src}
        chips={[
          'Iron Sharpens Iron',
          'Weekly Gatherings',
          'Annual Events',
          'Upcoming Events',
        ]}
      />

      <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            maskImage:
              'radial-gradient(circle at 50% 30%, black 40%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 30%, black 40%, transparent 92%)',
          }}
        />
        <Container size="xl" className="relative z-10 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
              style={{ backgroundColor: colorScheme.primary }}
            >
              Join Men's Group
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
                'linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.2) 100%)',
              boxShadow: '0 18px 44px rgba(0,0,0,0.34)',
            }}
          >
            <H2 className="text-xl sm:text-2xl font-semibold mb-2 leading-tight">
              Iron Sharpens Iron
            </H2>
            <BodyMD className="text-white/70 text-sm sm:text-base leading-relaxed">
              As iron sharpens iron, so one man sharpens another. - Proverbs
              27:17
            </BodyMD>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-start">
            <section
              className="rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 42%, rgba(0,0,0,0.18) 100%)',
              }}
            >
              <H3 className="text-base sm:text-lg font-semibold mb-4">
                Weekly Gatherings
              </H3>
              <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4 sm:p-5">
                  <BodySM className="text-sm sm:text-[15px] font-semibold mb-1 text-white">
                    Saturday Morning Breakfast
                  </BodySM>
                  <BodySM className="text-white/65 text-xs sm:text-sm mb-2 leading-relaxed">
                    Fellowship and Bible study over breakfast
                  </BodySM>
                  <Caption
                    className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: colorScheme.primary }}
                  >
                    Saturdays 8:00 AM
                  </Caption>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/30 p-4 sm:p-5">
                  <BodySM className="text-sm sm:text-[15px] font-semibold mb-1 text-white">
                    Monday Night Study
                  </BodySM>
                  <BodySM className="text-white/65 text-xs sm:text-sm mb-2 leading-relaxed">
                    In-depth Bible study and discussion
                  </BodySM>
                  <Caption
                    className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: colorScheme.primary }}
                  >
                    Mondays 7:00 PM
                  </Caption>
                </div>
              </div>
            </section>

            <section
              className="rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 46%, rgba(0,0,0,0.18) 100%)',
              }}
            >
              <H3 className="text-base sm:text-lg font-semibold mb-4">
                Annual Events
              </H3>
              <div className="space-y-2.5">
                {[
                  "Men's Retreat - Spring",
                  'Father-Son Campout - Summer',
                  'Service Projects - Quarterly',
                  'Sports Events - Monthly',
                ].map(event => (
                  <div
                    key={event}
                    className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
                  >
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: colorScheme.primary }}
                    />
                    <span className="text-white/75 text-xs sm:text-sm leading-relaxed">
                      {event}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default MenPage;
