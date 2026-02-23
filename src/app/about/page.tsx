/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { WisdomeHouseLogo } from '@/components/assets';
import { Section, Container } from '@/components/layout';
import { H2, H3, BodySM, BodyMD, Caption } from '@/components/text';
import PageHero from '@/components/ui/PageHero';
import { missionStatement } from '@/lib/data';
import { useTheme } from '@/components/contexts/ThemeContext';
import { BaseModal } from '@/components/modal/Base';

export default function AboutUsPage() {
  const { colorScheme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(true);

  const identityStats = [
    { label: 'Mandate', value: 'Raise complete believers' },
    { label: 'Method', value: 'Wisdom + Power of God' },
    { label: 'Outcome', value: 'Established greatness' },
    { label: 'Posture', value: 'Obedience & excellence' },
  ];

  const formationJourney = [
    {
      step: '01',
      title: 'Encounter',
      text: 'People meet Jesus, experience His presence, and begin a life of transformation.',
    },
    {
      step: '02',
      title: 'Equipping',
      text: 'Scriptural teaching, discipleship, and training build strength for everyday life.',
    },
    {
      step: '03',
      title: 'Expression',
      text: 'Believers serve with excellence in church, family, career, and society.',
    },
    {
      step: '04',
      title: 'Establishment',
      text: 'Greatness becomes visible through consistency, character, and kingdom impact.',
    },
  ];

  const cultureCodes = [
    {
      title: 'Presence First',
      note: 'Prayer, worship, and sensitivity to the Holy Spirit shape how we gather.',
      span: 'lg:col-span-2',
    },
    {
      title: 'Word-built People',
      note: 'We teach with clarity and apply truth to real-life decisions and growth.',
    },
    {
      title: 'Excellence Without Noise',
      note: 'Strong systems, clean execution, and intentional service define our culture.',
    },
    {
      title: 'Family Across Generations',
      note: 'Children, youth, adults, and elders are all seen, taught, and empowered.',
    },
    {
      title: 'Mission Beyond Walls',
      note: 'We carry the gospel into communities, careers, and nations.',
      span: 'lg:col-span-2',
    },
  ];

  const houseRhythms = [
    'Spirit-led worship and prayer',
    'Practical, transformative teaching',
    'Discipleship and leadership development',
    'Service teams and kingdom community',
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

      {/* About architecture / identity */}
      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4 sm:gap-5 lg:gap-6">
            <div
              className="relative overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-6 lg:p-8"
              style={{
                background:
                  'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 38%, rgba(0,0,0,0.28) 100%)',
                boxShadow: `0 28px 80px ${colorScheme.opacity.black50}`,
              }}
            >
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background: `radial-gradient(circle at 12% 14%, ${colorScheme.opacity.primary20} 0%, transparent 42%), radial-gradient(circle at 88% 82%, ${colorScheme.opacity.primary10} 0%, transparent 45%)`,
                }}
              />

              <div className="relative space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Caption
                    className="uppercase tracking-[0.2em] text-[11px]"
                    style={{ color: colorScheme.primary }}
                  >
                    Who we are
                  </Caption>
                  <span className="h-px w-12 bg-white/20" />
                  <span className="text-[10px] sm:text-xs text-white/60 uppercase tracking-[0.16em]">
                    Kingdom Family
                  </span>
                </div>

                <H2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold text-white leading-[1.08] text-balance">
                  A house of wisdom, power, and disciplined transformation.
                </H2>

                <BodyMD className="text-white/75 leading-relaxed text-[15px] sm:text-base max-w-2xl">
                  The Wisdom House is a Spirit-filled assembly raising complete
                  believers—men, women, and children—rooted in Christ, empowered
                  by His wisdom, and established in faith. We build people for
                  visible greatness through doctrine, discipleship, service, and
                  the power of God.
                </BodyMD>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {identityStats.map((item, idx) => (
                    <div
                      key={item.label}
                      className="relative rounded-2xl border border-white/10 bg-black/35 px-4 py-3"
                      style={{
                        boxShadow:
                          idx % 2 === 0
                            ? `0 10px 26px ${colorScheme.opacity.primary10}`
                            : `0 10px 26px ${colorScheme.opacity.black20}`,
                      }}
                    >
                      <Caption className="text-white/55 text-[10px] sm:text-[11px] uppercase tracking-[0.16em]">
                        {item.label}
                      </Caption>
                      <p className="mt-1 text-sm sm:text-[15px] text-white font-medium leading-tight">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="relative rounded-2xl border border-white/10 bg-white/5 px-4 py-4 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full w-1"
                    style={{ backgroundColor: colorScheme.primary }}
                  />
                  <p className="text-white text-sm sm:text-base font-semibold leading-snug pl-2">
                    “Making many great by the wisdom and power of God.”
                  </p>
                  <p className="mt-1 pl-2 text-white/60 text-xs sm:text-sm">
                    This is not branding language for us—it is our operating
                    conviction.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 sm:gap-5">
              <div
                className="relative overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-6"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.56) 0%, rgba(255,255,255,0.04) 100%)',
                }}
              >
                <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_70%_18%,rgba(255,255,255,0.09),transparent_45%)]" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Caption
                        className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px]"
                        style={{ color: colorScheme.primary }}
                      >
                        The House Seal
                      </Caption>
                      <p className="mt-1 text-white/75 text-xs sm:text-sm">
                        Identity, doctrine, and culture working together.
                      </p>
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

                  <div className="mt-5 relative h-28 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 20% 50%, ${colorScheme.opacity.primary20} 0%, transparent 38%), radial-gradient(circle at 82% 40%, rgba(255,255,255,0.14) 0%, transparent 40%)`,
                      }}
                    />
                    <div
                      className="absolute left-3 right-3 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.55), rgba(255,255,255,0.2))',
                      }}
                    />
                    <div
                      className="absolute left-8 top-1/2 h-[2px] w-24 sm:w-28 -translate-y-1/2 rotate-[22deg]"
                      style={{ backgroundColor: colorScheme.primary }}
                    />
                    <div
                      className="absolute right-6 top-1/2 h-[2px] w-20 sm:w-24 -translate-y-1/2 -rotate-[18deg]"
                      style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-white/70">
                        Wisdom
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-white/70">
                        Power
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="rounded-3xl border border-white/10 p-5 sm:p-6"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                }}
              >
                <div className="space-y-3">
                  <Caption
                    className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px]"
                    style={{ color: colorScheme.primary }}
                  >
                    House rhythms
                  </Caption>

                  <div className="space-y-2.5">
                    {houseRhythms.map((item, idx) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 px-3 py-2.5"
                      >
                        <span
                          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-black"
                          style={{ backgroundColor: colorScheme.primary }}
                        >
                          {idx + 1}
                        </span>
                        <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Vision / Mission architecture */}
      <Section padding="lg" className="bg-[#0a0a0a]">
        <Container size="xl" className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-5 lg:gap-7 items-start">
            <div className="space-y-4">
              <Caption
                className="uppercase tracking-[0.2em] text-[11px]"
                style={{ color: colorScheme.primary }}
              >
                Vision & mission
              </Caption>
              <H3 className="text-2xl sm:text-3xl font-semibold text-white leading-tight text-balance">
                We build people intentionally, not casually.
              </H3>
              <BodyMD className="text-white/70 leading-relaxed">
                Our structure is designed to move people from encounter to
                establishment through clear teaching, community, and practical
                kingdom expression.
              </BodyMD>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-white/80">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: colorScheme.primary }}
                  />
                  <span className="text-sm font-medium">
                    Formation pipeline
                  </span>
                </div>
                <div className="space-y-2">
                  {formationJourney.map(item => (
                    <div
                      key={item.step}
                      className="grid grid-cols-[auto_1fr] gap-3"
                    >
                      <span className="text-[11px] text-white/45 font-semibold pt-0.5">
                        {item.step}
                      </span>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium">
                          {item.title}
                        </p>
                        <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div
                className="relative overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-6 lg:p-7"
                style={{
                  background:
                    'linear-gradient(175deg, rgba(255,255,255,0.06), rgba(0,0,0,0.24))',
                }}
              >
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    background: `radial-gradient(circle at 90% 8%, ${colorScheme.opacity.primary20} 0%, transparent 40%)`,
                  }}
                />
                <div className="relative space-y-3">
                  <Caption className="text-white/60 uppercase tracking-[0.16em] text-[10px]">
                    Our Vision
                  </Caption>
                  <H3 className="text-xl sm:text-2xl font-semibold text-white leading-snug">
                    Equip people with the Wisdom and Power of God.
                  </H3>
                  <BodyMD className="text-white/75 leading-relaxed">
                    To equip a people with the Wisdom and Power of God, for
                    their establishment in the faith and for manifesting
                    greatness in every facet of life.
                  </BodyMD>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-4">
                <div
                  className="rounded-3xl border border-white/10 p-5 sm:p-6 space-y-3"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                  }}
                >
                  <Caption className="text-white/60 uppercase tracking-[0.16em] text-[10px]">
                    Our Mission
                  </Caption>
                  <BodyMD className="text-white/78 leading-relaxed text-[15px] sm:text-base">
                    {missionStatement}
                  </BodyMD>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-4 sm:p-5">
                  <Caption
                    className="uppercase tracking-[0.16em] text-[10px] sm:text-[11px]"
                    style={{ color: colorScheme.primary }}
                  >
                    Strategic outcome
                  </Caption>
                  <div className="mt-3 space-y-2.5">
                    {[
                      'Strong faith foundation',
                      'Mature Christian character',
                      'Service-driven leadership',
                      'Visible kingdom impact',
                    ].map((line, idx) => (
                      <div
                        key={line}
                        className="rounded-xl border border-white/8 bg-white/5 px-3 py-2"
                      >
                        <p className="text-white/85 text-xs sm:text-sm leading-snug">
                          <span className="text-white/45 mr-2">{idx + 1}.</span>
                          {line}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Culture codes / bento */}
      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-5 sm:space-y-7">
          <div className="space-y-2 text-center">
            <Caption
              className="uppercase tracking-[0.2em] text-[11px]"
              style={{ color: colorScheme.primary }}
            >
              Culture code
            </Caption>
            <H3 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
              How we live, serve, and grow together
            </H3>
            <BodySM className="text-white/65 max-w-2xl mx-auto">
              We are intentional about atmosphere, doctrine, systems, and
              people.
            </BodySM>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cultureCodes.map(item => (
              <div
                key={item.title}
                className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_14px_30px_rgba(0,0,0,0.25)] ${item.span ?? ''}`}
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
                    {item.note}
                  </Caption>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Connection / newsletter */}
      <Section padding="lg" className="bg-[#090909]">
        <Container size="xl">
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-7 lg:p-8"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.28) 55%, rgba(255,255,255,0.03) 100%)',
              boxShadow: `0 24px 60px ${colorScheme.opacity.black50}`,
            }}
          >
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background: `radial-gradient(circle at 12% 20%, ${colorScheme.opacity.primary20} 0%, transparent 38%), radial-gradient(circle at 85% 14%, rgba(255,255,255,0.08) 0%, transparent 35%)`,
              }}
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 lg:gap-8 items-end">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Caption
                    className="uppercase tracking-[0.18em] text-[11px]"
                    style={{ color: colorScheme.primary }}
                  >
                    Stay connected
                  </Caption>
                  <H3 className="text-xl sm:text-2xl lg:text-[1.9rem] font-semibold text-white leading-snug text-balance">
                    Get updates on services, conferences, and ministry
                    resources.
                  </H3>
                  <BodySM className="text-white/70 text-sm sm:text-base max-w-2xl">
                    Join our mailing list for event alerts, live reminders, and
                    church updates.
                  </BodySM>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5">
                  {['Events', 'Live Stream', 'Resources', 'Conferences'].map(
                    item => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75 text-center"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
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
                  <p className="mt-2 px-1 text-[11px] sm:text-xs text-white/55">
                    We send helpful updates only. No spam.
                  </p>
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
