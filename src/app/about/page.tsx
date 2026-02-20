/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { WisdomeHouseLogo } from '@/components/assets';
import { Section, Container, GridboxLayout, FlexboxLayout } from '@/components/layout';
import { H2, H3, BodySM, BodyMD, Caption } from '@/components/text';
import PageHero from '@/components/ui/PageHero';
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
      <PageHero
        title="About Us"
        subtitle="A trans-generational movement of greatness"
        note="Discover the heart, identity, and purpose of The Wisdom House Church — a vibrant, Spirit-filled family raising complete believers."
        chips={['Word & Power', 'Excellence', 'Generations', 'Nations']}
      />

      {/* Who we are */}
      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            <div className="space-y-3 order-2 lg:order-1 fade-up">
              <Caption className="uppercase tracking-[0.2em] text-[11px]" style={{ color: colorScheme.primary }}>
                Who we are
              </Caption>
              <H2 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
                A house of light, transformation, and greatness.
              </H2>
              <BodyMD className="text-white/75 leading-relaxed text-[15px] sm:text-base">
                The Wisdom House is a Spirit-filled assembly committed to raising complete believers—men, women, and children—rooted in Christ, empowered by His wisdom, and established in faith. We are a trans-generational movement pursuing obedience and excellence in every facet of life.
              </BodyMD>
              <GridboxLayout columns={2} gap="sm" responsive={{ xs: 1, sm: 2, md: 2, lg: 2 }}>
                {[
                  { label: 'Core', value: 'Obedience & service' },
                  { label: 'Focus', value: 'Word & Power' },
                  { label: 'Culture', value: 'Excellence & love' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    style={{ boxShadow: `0 10px 24px ${colorScheme.opacity.primary10}` }}
                  >
                    <Caption className="text-white/60 text-[11px]">{item.label}</Caption>
                    <BodySM className="text-white font-medium text-xs sm:text-[13px] leading-tight">
                      {item.value}
                    </BodySM>
                  </div>
                ))}
              </GridboxLayout>
            </div>

            <div className="relative w-full max-w-[520px] mx-auto order-1 lg:order-2 fade-up" style={{ animationDelay: '80ms' }}>
              <div
                className="relative mx-auto aspect-square w-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-black/40 to-black/60 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
                style={{ boxShadow: `0 24px 70px ${colorScheme.opacity.primary10}` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.08),transparent_42%)] blur-3xl" />

                <div className="absolute inset-6 rounded-full border border-white/15 animate-spin" style={{ animationDuration: '18s' }} />
                <div className="absolute inset-3 rounded-full border border-white/10 animate-pulse" style={{ animationDuration: '5s' }} />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-xl flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
                    style={{ boxShadow: `0 16px 48px ${colorScheme.opacity.primary10}` }}
                  >
                    <div className="absolute -inset-3 rounded-3xl bg-[conic-gradient(from_120deg,rgba(255,255,255,0.12),transparent,rgba(255,255,255,0.1))] animate-spin" style={{ animationDuration: '24s' }} />
                    <Image
                      src={WisdomeHouseLogo}
                      alt="The Wisdom House logo"
                      fill
                      className="object-contain p-4 drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
                      sizes="(max-width: 1024px) 45vw, 380px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Vision / Mission */}
      <Section padding="lg" className="bg-[#0b0b0b]">
        <Container size="xl" className="space-y-10">
          <div className="text-center space-y-2 fade-up">
            <Caption className="uppercase tracking-[0.2em] text-xs" style={{ color: colorScheme.primary }}>
              Vision & mission
            </Caption>
            <H3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Making many great by the wisdom and power of God
            </H3>
          </div>

          <GridboxLayout columns={2} gap="lg" responsive={{ xs: 1, md: 2 }}>
            <div className="rounded-2xl border border-white/12 bg-white/5 p-6 space-y-3 shadow-lg fade-up">
              <Caption className="text-white/70">Our Vision</Caption>
              <BodyMD className="text-white/80 leading-relaxed">
                To equip a people with the Wisdom and Power of God, for their establishment in the faith and for manifesting greatness in every facet of life.
              </BodyMD>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/5 p-6 space-y-3 shadow-lg fade-up" style={{ animationDelay: '90ms' }}>
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
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2 shadow-lg fade-up"
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
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7 shadow-2xl fade-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="space-y-1.5">
                <Caption className="uppercase tracking-[0.18em] text-[11px]" style={{ color: colorScheme.primary }}>
                  Stay connected
                </Caption>
                <H3 className="text-xl sm:text-2xl font-semibold text-white leading-snug">
                  Subscribe for updates, events, and live notifications.
                </H3>
                <BodySM className="text-white/70 text-[14px] sm:text-sm">
                  Be the first to know about services, conferences, and new resources.
                </BodySM>
              </div>
              <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto max-w-xl sm:max-w-none">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  className="flex-1 w-full sm:min-w-[240px] rounded-lg bg-black/60 border border-white/20 px-3.5 py-2.5 text-sm text-white/90 placeholder:text-white/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-sm shadow-[0_10px_30px_rgba(255,255,255,0.08)] hover:scale-[1.02] active:scale-[0.99] transition"
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
