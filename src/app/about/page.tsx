/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { hero_bg_3, Banner_1 } from '@/components/assets';
import { Section, Container, GridboxLayout, FlexboxLayout } from '@/components/layout';
import { H2, H3, BodySM, BodyMD, Caption } from '@/components/text';
import { missionStatement } from '@/lib/data';
import { useTheme } from '@/components/contexts/ThemeContext';

export default function AboutUsPage() {
  const { colorScheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#050505]">
      <HeroSection
        title="About Us"
        subtitle="A trans-generational movement of greatness"
        description="Discover the heart, identity, and purpose of The Wisdom House Church — a vibrant, Spirit-filled family raising complete believers."
        backgroundImage={hero_bg_3.src}
        showButtons={false}
        showScrollIndicator={false}
      />

      {/* Who we are */}
      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-8 items-center">
            <div className="space-y-4">
              <Caption className="uppercase tracking-[0.2em] text-xs" style={{ color: colorScheme.primary }}>
                Who we are
              </Caption>
              <H2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                A house of light, transformation, and greatness.
              </H2>
              <BodyMD className="text-white/75 leading-relaxed">
                The Wisdom House is a Spirit-filled assembly committed to raising complete believers—men, women, and children—rooted in Christ, empowered by His wisdom, and established in faith. We are a trans-generational movement pursuing obedience and excellence in every facet of life.
              </BodyMD>
              <GridboxLayout columns={2} gap="md" responsive={{ xs: 2, md: 2, lg: 2 }}>
                {[
                  { label: 'Core', value: 'Obedience & service' },
                  { label: 'Focus', value: 'Word & Power' },
                  { label: 'Reach', value: 'Generations & nations' },
                  { label: 'Culture', value: 'Excellence & love' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-3"
                    style={{ boxShadow: `0 10px 30px ${colorScheme.opacity.primary10}` }}
                  >
                    <Caption className="text-white/60">{item.label}</Caption>
                    <BodySM className="text-white font-medium">{item.value}</BodySM>
                  </div>
                ))}
              </GridboxLayout>
            </div>

            <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <Image
                src={Banner_1}
                alt="Worship at The Wisdom House Church"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Vision / Mission */}
      <Section padding="lg" className="bg-[#0b0b0b]">
        <Container size="xl" className="space-y-10">
          <div className="text-center space-y-2">
            <Caption className="uppercase tracking-[0.2em] text-xs" style={{ color: colorScheme.primary }}>
              Vision & mission
            </Caption>
            <H3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Making many great by the wisdom and power of God
            </H3>
          </div>

          <GridboxLayout columns={2} gap="lg" responsive={{ xs: 1, md: 2 }}>
            <div className="rounded-2xl border border-white/12 bg-white/5 p-6 space-y-3 shadow-lg">
              <Caption className="text-white/70">Our Vision</Caption>
              <BodyMD className="text-white/80 leading-relaxed">
                To equip a people with the Wisdom and Power of God, for their establishment in the faith and for manifesting greatness in every facet of life.
              </BodyMD>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/5 p-6 space-y-3 shadow-lg">
              <Caption className="text-white/70">Our Mission</Caption>
              <BodyMD className="text-white/80 leading-relaxed">
                {missionStatement}
              </BodyMD>
            </div>
          </GridboxLayout>
        </Container>
      </Section>

      {/* Culture & pillars */}
      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="sm"
            className="text-center"
          >
            <Caption className="uppercase tracking-[0.2em] text-xs" style={{ color: colorScheme.primary }}>
              Our culture
            </Caption>
            <H3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              How we live, serve, and grow
            </H3>
          </FlexboxLayout>

          <GridboxLayout columns={3} gap="md" responsive={{ xs: 1, md: 3 }}>
            {[
              {
                title: 'Presence-driven',
                desc: 'Spirit-led worship, prayer, and obedience at the core of every gathering.',
              },
              {
                title: 'Word-centered',
                desc: 'Practical, transforming teaching that builds complete believers.',
              },
              {
                title: 'People-first',
                desc: 'Authentic community, hospitality, and service across every generation.',
              },
            ].map(item => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2 shadow-lg"
                style={{ boxShadow: `0 12px 30px ${colorScheme.opacity.primary10}` }}
              >
                <BodySM className="text-white font-semibold">{item.title}</BodySM>
                <Caption className="text-white/70 leading-relaxed">{item.desc}</Caption>
              </div>
            ))}
          </GridboxLayout>
        </Container>
      </Section>

      {/* Newsletter / stay in the flow */}
      <Section padding="lg" className="bg-[#0b0b0b]">
        <Container size="lg" className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <Caption className="uppercase tracking-[0.2em] text-xs" style={{ color: colorScheme.primary }}>
                  Stay connected
                </Caption>
                <H3 className="text-2xl font-bold text-white leading-tight">
                  Subscribe for updates, events, and live notifications.
                </H3>
                <BodySM className="text-white/70">
                  Be the first to know about services, conferences, and new resources.
                </BodySM>
              </div>
              <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  className="flex-1 min-w-[220px] rounded-xl bg-black/50 border border-white/15 px-3 py-3 text-sm text-white outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:scale-[1.02] transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
