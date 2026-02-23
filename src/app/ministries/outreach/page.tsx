'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { hero_bg_2 } from '@/components/assets';
import { useTheme } from '@/components/contexts/ThemeContext';
import { Section, Container } from '@/components/layout';
import { BodyMD, BodySM, H2, H3 } from '@/components/text';
import PageHero from '@/components/ui/PageHero';

const OutreachPage = () => {
  const { colorScheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Outreach Ministry"
        subtitle="Serving Our Community, Sharing God's Love"
        note="Extending the love of Christ beyond our walls through practical service, community partnerships, and mission opportunities."
        backgroundImage={hero_bg_2.src}
        chips={[
          'Making a Difference Together',
          'Local Outreach',
          'Global Missions',
          'Upcoming Projects',
        ]}
      />

      <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
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
              Volunteer Opportunities
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Upcoming Projects
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div
            className="rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6 lg:p-7"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 44%, rgba(0,0,0,0.2) 100%)',
              boxShadow: '0 18px 44px rgba(0,0,0,0.34)',
            }}
          >
            <H2 className="text-xl sm:text-2xl font-semibold mb-2 leading-tight">
              Making a Difference Together
            </H2>
            <BodyMD className="text-white/70 text-sm sm:text-base leading-relaxed">
              Local and global opportunities to serve and share the Gospel
            </BodyMD>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {[
              {
                title: 'Local Outreach',
                projects: [
                  'Monthly Food Distribution',
                  'Homeless Shelter Meals',
                  'School Supply Drives',
                  'Community Clean-up Days',
                ],
              },
              {
                title: 'Global Missions',
                projects: [
                  'Annual Mission Trips',
                  'International Orphan Support',
                  'Clean Water Projects',
                  'Bible Distribution',
                ],
              },
            ].map(category => (
              <section
                key={category.title}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6"
                style={{
                  background:
                    'linear-gradient(150deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 45%, rgba(0,0,0,0.18) 100%)',
                  boxShadow: '0 14px 34px rgba(0,0,0,0.26)',
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-px opacity-75"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${colorScheme.primary}55 50%, transparent 100%)`,
                  }}
                />
                <H3 className="text-center text-base sm:text-lg font-semibold mb-4 leading-tight">
                  {category.title}
                </H3>
                <ul className="space-y-2.5">
                  {category.projects.map(project => (
                    <li
                      key={project}
                      className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: colorScheme.primary }}
                      />
                      <BodySM className="text-white/75 text-xs sm:text-sm leading-relaxed">
                        {project}
                      </BodySM>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default OutreachPage;
