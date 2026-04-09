/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { WisdomeHouseLogo } from '@/shared/assets';
import { Section, Container } from '@/shared/layout';
import { H2, H3, BodySM, BodyMD, Caption } from '@/shared/text';
import PageHero from '@/features/hero/PageHero';
import { missionStatement } from '@/lib/data';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { BaseModal } from '@/shared/ui/modals/Base';

export default function AboutUsPage() {
  const { colorScheme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(true);

  const houseSummary = [
    { label: 'Core', value: 'Obedience & service' },
    { label: 'Focus', value: 'Word & Power' },
    { label: 'Culture', value: 'Excellence & love' },
  ];

  const culturePillars = [
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
  ];

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
        variant="about"
      />

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-4 sm:gap-5 lg:gap-6">
            <div
              className="relative overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-6 lg:p-8"
              style={{
                background:
                  'linear-gradient(155deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.26) 100%)',
                boxShadow: `0 26px 70px ${colorScheme.opacity.black50}`,
              }}
            >
              <div
                className="absolute inset-0 opacity-75"
                style={{
                  background: `radial-gradient(circle at 10% 12%, ${colorScheme.opacity.primary20} 0%, transparent 40%), radial-gradient(circle at 90% 85%, ${colorScheme.opacity.primary10} 0%, transparent 45%)`,
                }}
              />

              <div className="relative space-y-4 sm:space-y-5">
                <Caption
                  className="uppercase tracking-[0.2em] text-[11px]"
                  style={{ color: colorScheme.primary }}
                >
                  Who we are
                </Caption>

                <H2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-semibold text-white leading-[1.08] text-balance">
                  A house of light, transformation, and greatness.
                </H2>

                <BodyMD className="text-white/75 leading-relaxed text-[15px] sm:text-base max-w-2xl">
                  The Wisdom House is a Spirit-filled assembly committed to
                  raising complete believers—men, women, and children—rooted in
                  Christ, empowered by His wisdom, and established in faith. We
                  are a trans-generational movement pursuing obedience and
                  excellence in every facet of life.
                </BodyMD>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                  {houseSummary.map((item, idx) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
                      style={{
                        boxShadow:
                          idx === 1
                            ? `0 10px 24px ${colorScheme.opacity.primary10}`
                            : `0 10px 24px ${colorScheme.opacity.black20}`,
                      }}
                    >
                      <Caption className="text-white/55 text-[10px] sm:text-[11px] uppercase tracking-[0.16em]">
                        {item.label}
                      </Caption>
                      <p className="mt-1 text-white font-medium text-sm leading-tight">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 sm:gap-5">
              <div
                className="relative overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-6"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.30))',
                  boxShadow: `0 22px 50px ${colorScheme.opacity.black50}`,
                }}
              >
                <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_75%_18%,rgba(255,255,255,0.1),transparent_45%)]" />

                <div className="relative flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <BodySM className="text-white font-semibold">
                        The Wisdom House Church
                      </BodySM>
                      <Caption className="text-white/60">
                        A trans-generational movement of greatness
                      </Caption>
                    </div>
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden border border-white/15 bg-black/60 shrink-0">
                      <Image
                        src={WisdomeHouseLogo}
                        alt="The Wisdom House logo"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </div>

                  <div className="relative h-28 sm:h-32 rounded-2xl overflow-hidden border border-white/10 bg-black/35">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 20% 45%, ${colorScheme.opacity.primary20} 0%, transparent 38%), radial-gradient(circle at 82% 38%, rgba(255,255,255,0.12) 0%, transparent 42%)`,
                      }}
                    />
                    <div
                      className="absolute inset-x-4 top-1/2 h-[1px] -translate-y-1/2"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.55), rgba(255,255,255,0.18))',
                      }}
                    />
                    <div
                      className="absolute left-8 top-1/2 h-[2px] w-24 sm:w-28 -translate-y-1/2 rotate-[20deg]"
                      style={{ backgroundColor: colorScheme.primary }}
                    />
                    <div
                      className="absolute right-6 top-1/2 h-[2px] w-20 sm:w-24 -translate-y-1/2 -rotate-[16deg]"
                      style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="grid grid-cols-2 gap-2.5">
                  {['Word & Power', 'Excellence', 'Generations', 'Nations'].map(
                    chip => (
                      <div
                        key={chip}
                        className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-center"
                      >
                        <p className="text-white/85 text-xs sm:text-sm font-medium leading-tight">
                          {chip}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="lg" className="bg-[#0a0a0a]">
        <Container size="xl" className="space-y-5 sm:space-y-7">
          <div className="space-y-2 text-center">
            <Caption
              className="uppercase tracking-[0.2em] text-xs"
              style={{ color: colorScheme.primary }}
            >
              Vision & mission
            </Caption>
            <H3 className="text-2xl sm:text-3xl font-semibold text-white leading-tight text-balance">
              Making many great by the wisdom and power of God
            </H3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 sm:gap-5">
            <div
              className="relative overflow-hidden rounded-3xl border border-white/12 p-5 sm:p-6 lg:p-7"
              style={{
                background:
                  'linear-gradient(175deg, rgba(255,255,255,0.05), rgba(0,0,0,0.22))',
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-[1px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${colorScheme.primary}, transparent)`,
                }}
              />
              <div className="space-y-3">
                <Caption className="text-white/65 uppercase tracking-[0.16em] text-[10px] sm:text-[11px]">
                  Our Vision
                </Caption>
                <BodyMD className="text-white/80 leading-relaxed">
                  To equip a people with the Wisdom and Power of God, for their
                  establishment in the faith and for manifesting greatness in
                  every facet of life.
                </BodyMD>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-3xl border border-white/12 p-5 sm:p-6 lg:p-7"
              style={{
                background:
                  'linear-gradient(175deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
              }}
            >
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: `radial-gradient(circle at 88% 10%, ${colorScheme.opacity.primary20} 0%, transparent 42%)`,
                }}
              />
              <div className="relative space-y-3">
                <Caption className="text-white/65 uppercase tracking-[0.16em] text-[10px] sm:text-[11px]">
                  Our Mission
                </Caption>
                <BodyMD className="text-white/80 leading-relaxed">
                  {missionStatement}
                </BodyMD>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-5 sm:space-y-7">
          <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-4 sm:gap-5 lg:gap-6 items-start">
            <div
              className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 lg:p-7"
              style={{
                boxShadow: `0 20px 50px ${colorScheme.opacity.black50}`,
              }}
            >
              <div className="space-y-3">
                <Caption
                  className="uppercase tracking-[0.2em] text-xs"
                  style={{ color: colorScheme.primary }}
                >
                  Our culture
                </Caption>
                <H3 className="text-2xl sm:text-3xl font-semibold text-white leading-tight text-balance">
                  How we live, serve, and grow
                </H3>
                <BodySM className="text-white/70 text-sm sm:text-base leading-relaxed">
                  Word & Power • Excellence • Generations • Nations
                </BodySM>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/15 bg-black/60">
                    <Image
                      src={WisdomeHouseLogo}
                      alt="The Wisdom House"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <BodySM className="text-white font-semibold">
                      The Wisdom House Church
                    </BodySM>
                    <Caption className="text-white/60">
                      About Us • Lagos, Nigeria
                    </Caption>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {culturePillars.map((item, idx) => (
                <div
                  key={item.title}
                  className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_14px_30px_rgba(0,0,0,0.25)] ${idx === 0 ? 'md:col-span-2 xl:col-span-1' : ''}`}
                  style={{
                    boxShadow:
                      idx === 1
                        ? `0 14px 30px ${colorScheme.opacity.primary10}`
                        : '0 14px 30px rgba(0,0,0,0.25)',
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[1px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${colorScheme.primary}, transparent)`,
                    }}
                  />
                  <div className="space-y-2">
                    <BodySM className="text-white font-semibold text-sm sm:text-base">
                      {item.title}
                    </BodySM>
                    <Caption className="text-white/70 leading-relaxed text-xs sm:text-sm">
                      {item.desc}
                    </Caption>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="lg" className="bg-[#090909]">
        <Container size="xl">
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-7 lg:p-8"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.28) 60%, rgba(255,255,255,0.03) 100%)',
              boxShadow: `0 24px 60px ${colorScheme.opacity.black50}`,
            }}
          >
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background: `radial-gradient(circle at 12% 18%, ${colorScheme.opacity.primary20} 0%, transparent 40%), radial-gradient(circle at 88% 16%, rgba(255,255,255,0.08) 0%, transparent 38%)`,
              }}
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 lg:gap-7 items-end">
              <div className="space-y-1.5">
                <Caption
                  className="uppercase tracking-[0.18em] text-[11px]"
                  style={{ color: colorScheme.primary }}
                >
                  Stay connected
                </Caption>
                <H3 className="text-xl sm:text-2xl font-semibold text-white leading-snug text-balance">
                  Subscribe for updates, events, and live notifications.
                </H3>
                <BodySM className="text-white/70 text-[14px] sm:text-sm max-w-2xl">
                  Be the first to know about services, conferences, and new
                  resources.
                </BodySM>
              </div>

              <div className="w-full lg:w-auto lg:min-w-[420px]">
                <form className="rounded-2xl border border-white/10 bg-black/35 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      placeholder="Your email"
                      className="flex-1 w-full rounded-xl bg-black/60 border border-white/20 px-3.5 py-3 text-sm text-white/90 placeholder:text-white/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                    />
                    <button
                      type="submit"
                      className="rounded-xl px-4 py-3 text-sm font-semibold min-w-[132px] transition hover:brightness-110 active:scale-[0.99]"
                      style={{
                        backgroundColor: colorScheme.primary,
                        color: colorScheme.textInverted,
                      }}
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
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
              <Image
                src={WisdomeHouseLogo}
                alt="The Wisdom House"
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <BodySM className="text-white font-semibold">
                The Wisdom House Church
              </BodySM>
              <Caption className="text-white/60">
                About Us • Lagos, Nigeria
              </Caption>
            </div>
          </div>
          <BodyMD className="text-white/80 leading-relaxed">
            Dive into our vision, mission, and the culture that shapes our
            global church family. We’re glad you’re here.
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
