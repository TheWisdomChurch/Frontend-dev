'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { hero_bg_3 } from '@/components/assets';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  Container,
  Section,
  PageSection,
  FlexboxLayout,
  Gridbox,
} from '@/components/layout';
import { BodyMD, BodySM, H2, H3, Caption } from '@/components/text';
import PageHero from '@/components/features/hero/PageHero';

const WomenPage = () => {
  const { colorScheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Women's Ministry"
        subtitle="Growing Together in Grace"
        note="A community of women supporting each other through Bible study, prayer, and fellowship as we journey together in faith."
        backgroundImage={hero_bg_3.src}
        chips={[
          'Women of Wisdom',
          'Bible Studies',
          'Prayer Groups',
          'Special Events',
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
              'radial-gradient(circle at 50% 30%, black 38%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 30%, black 38%, transparent 92%)',
          }}
        />

        <Container size="xl" className="relative z-10 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
              style={{ backgroundColor: colorScheme.primary }}
            >
              Join Our Next Study
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Events
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div
            className="rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6 lg:p-7"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 44%, rgba(0,0,0,0.2) 100%)',
              boxShadow: '0 18px 46px rgba(0,0,0,0.35)',
            }}
          >
            <H2 className="text-xl sm:text-2xl font-semibold mb-2 leading-tight">
              Women of Wisdom
            </H2>
            <BodyMD className="text-white/70 text-sm sm:text-base leading-relaxed">
              Connecting women of all ages and stages of life
            </BodyMD>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                title: 'Bible Studies',
                description:
                  "Weekly small group studies exploring God's Word together",
                day: 'Tuesdays 10:00 AM & 7:00 PM',
              },
              {
                title: 'Prayer Groups',
                description:
                  'Intimate gatherings for prayer and spiritual support',
                day: 'Thursdays 9:30 AM',
              },
              {
                title: 'Special Events',
                description:
                  'Retreats, conferences, and fellowship opportunities',
                day: 'Monthly Gatherings',
              },
            ].map(item => (
              <article
                key={item.title}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6"
                style={{
                  background:
                    'linear-gradient(150deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 45%, rgba(0,0,0,0.18) 100%)',
                  boxShadow: '0 14px 34px rgba(0,0,0,0.26)',
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-px opacity-80"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${colorScheme.primary}55 50%, transparent 100%)`,
                  }}
                />
                <H3 className="text-base sm:text-lg font-semibold mb-2 leading-tight">
                  {item.title}
                </H3>
                <BodySM className="text-white/70 text-xs sm:text-sm mb-3 leading-relaxed">
                  {item.description}
                </BodySM>
                <Caption
                  className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em]"
                  style={{ color: colorScheme.primary }}
                >
                  {item.day}
                </Caption>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default WomenPage;
