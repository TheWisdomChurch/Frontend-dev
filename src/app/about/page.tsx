/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { WisdomeHouseLogo, Banner_1 } from '@/components/assets';
import { Section, Container, GridboxLayout, FlexboxLayout } from '@/components/layout';
import { H2, H3, BodySM, BodyMD, Caption } from '@/components/text';
import { missionStatement } from '@/lib/data';
import { useTheme } from '@/components/contexts/ThemeContext';
import { BaseModal } from '@/components/modal/Base';

export default function AboutUsPage() {
  const { colorScheme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setShowWelcome(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* About hero */}
      <Section padding="none" className="relative overflow-hidden bg-[#030303]" perf="none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.07) 0%, transparent 35%), radial-gradient(circle at 82% 12%, rgba(255,255,255,0.06) 0%, transparent 32%), radial-gradient(circle at 55% 90%, rgba(255,255,255,0.05) 0%, transparent 40%)',
            filter: 'blur(70px)',
          }}
        />
        <Container
          size="xl"
          className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center px-4 sm:px-6 md:px-8 lg:px-12 py-16 lg:py-24"
        >
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 w-fit backdrop-blur">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/15 bg-black/60">
                <Image src={WisdomeHouseLogo} alt="The Wisdom House" fill className="object-contain p-1.5" />
              </div>
              <Caption className="text-white/80 uppercase tracking-[0.22em] text-[11px]">
                The Wisdom House Church
              </Caption>
            </div>

            <div className="space-y-4">
              <H2 className="text-3xl sm:text-4xl md:text-[2.7rem] lg:text-[3rem] font-black text-white leading-tight">
                About Us
              </H2>
              <H3 className="text-xl sm:text-2xl lg:text-3xl font-semibold" style={{ color: colorScheme.primary }}>
                A trans-generational movement of greatness
              </H3>
              <BodyMD className="text-white/85 leading-relaxed text-base sm:text-lg">
                Discover the heart, identity, and purpose of The Wisdom House Church — a vibrant, Spirit-filled family
                raising complete believers.
              </BodyMD>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
              {[
                { label: 'Founded', value: 'Lagos, Nigeria' },
                { label: 'Focus', value: 'Wisdom & Power' },
                { label: 'Culture', value: 'Excellence in Love' },
                { label: 'Reach', value: 'Generations & Nations' },
              ].map(item => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 space-y-1"
                  style={{ boxShadow: `0 10px 30px ${colorScheme.opacity.primary10}` }}
                >
                  <Caption className="text-white/60">{item.label}</Caption>
                  <BodySM className="text-white font-semibold">{item.value}</BodySM>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full">
            <div className="absolute -top-8 -left-8 h-28 w-28 rounded-full blur-3xl opacity-50" style={{ background: colorScheme.primary }} />
            <div className="rounded-3xl border border-white/12 bg-white/5 backdrop-blur-xl p-6 sm:p-8 space-y-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <H3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                Welcome to a house of wisdom, presence, and power.
              </H3>
              <BodySM className="text-white/75 leading-relaxed">
                We’re called to raise complete believers—rooted in Christ, empowered by His Spirit, and released to impact
                nations. Explore our story, mission, and culture below.
              </BodySM>
              <div className="flex flex-wrap gap-2">
                {['Word & Power', 'Excellence', 'Generations', 'Nations'].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: colorScheme.opacity.primary10,
                      color: colorScheme.primary,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

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

      {/* Welcome modal on About */}
      <BaseModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        title="Welcome to The Wisdom House"
        subtitle="Learn our story, vision, and culture."
        maxWidth="max-w-lg"
        showHandle
        forceBottomSheet
      >
        <div className="space-y-4 text-white/80">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-2xl overflow-hidden border border-white/15 bg-black/70">
              <Image src={WisdomeHouseLogo} alt="The Wisdom House" fill className="object-contain p-2" />
            </div>
            <div>
              <BodySM className="text-white font-semibold">The Wisdom House Church</BodySM>
              <Caption className="text-white/60">About Us • Lagos, Nigeria</Caption>
            </div>
          </div>
          <BodyMD className="text-white/80 leading-relaxed">
            Dive into our vision, mission, and the culture that shapes our global church family. We’re glad you’re here.
          </BodyMD>
          <div className="flex justify-end">
            <button
              onClick={() => setShowWelcome(false)}
              className="rounded-xl px-4 py-2 bg-white text-black font-semibold text-sm hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
