// app/ministries/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import { Children_head, Dept_1, Dept_2, Dept_3, Dept_4 } from '@/shared/assets';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { H2, H3, BodyLG, BodyMD, Caption } from '@/shared/text';
import {
  Container,
  Section,
  PageSection,
  FlexboxLayout,
  Gridbox,
} from '@/shared/layout';
import PageHero from '@/features/hero/PageHero';
import { Ministries } from '@/lib/data';
import CustomButton from '@/shared/utils/buttons/CustomButton';

gsap.registerPlugin(ScrollTrigger);

type MinistryVisual = {
  image: StaticImageData;
  objectPosition?: string;
  glow: string;
};

const MINISTRY_VISUALS: MinistryVisual[] = [
  {
    image: Children_head,
    objectPosition: 'center 18%',
    glow: 'radial-gradient(circle at 84% 18%, rgba(251, 191, 36, 0.28) 0%, transparent 52%)',
  },
  {
    image: Dept_1,
    glow: 'radial-gradient(circle at 78% 22%, rgba(245, 158, 11, 0.24) 0%, transparent 56%)',
  },
  {
    image: Dept_2,
    glow: 'radial-gradient(circle at 82% 18%, rgba(234, 179, 8, 0.24) 0%, transparent 56%)',
  },
  {
    image: Dept_3,
    glow: 'radial-gradient(circle at 78% 20%, rgba(251, 146, 60, 0.24) 0%, transparent 56%)',
  },
  {
    image: Dept_4,
    glow: 'radial-gradient(circle at 82% 20%, rgba(253, 224, 71, 0.24) 0%, transparent 56%)',
  },
];

const INVOLVEMENT_STEPS = [
  {
    title: 'Explore Ministries',
    description:
      'Browse the ministries that resonate with your season and interests.',
  },
  {
    title: 'Connect With a Leader',
    description:
      'Ask questions and learn how each team serves the church and community.',
  },
  {
    title: 'Start Serving',
    description:
      'Join a team and begin serving with purpose and accountability.',
  },
];

export default function MinistryPage() {
  const { colorScheme } = useTheme();
  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const revealNodes = gsap.utils.toArray('[data-reveal]') as HTMLElement[];
      revealNodes.forEach((node, index) => {
        gsap.fromTo(
          node,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            delay: index * 0.04,
            scrollTrigger: { trigger: node, start: 'top 88%' },
          }
        );
      });

      (gsap.utils.toArray('[data-stagger-group]') as HTMLElement[]).forEach(
        (group: HTMLElement) => {
          const items = group.querySelectorAll<HTMLElement>(
            '[data-stagger-item]'
          );
          if (!items.length) return;

          gsap.fromTo(
            items,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: { trigger: group, start: 'top 84%' },
            }
          );
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Our Ministries"
        subtitle="One family. Many expressions of faith."
        note="Discover a place to belong, grow, serve, and become everything God has called you to be."
        chips={[
          `Ministries: ${Ministries.length}`,
          'Focus: Word & Power',
          'Culture: Excellence & Love',
          'Family: All Generations',
        ]}
      />

      <Section
        padding="lg"
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, #050505 0%, #090909 42%, #060606 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            maskImage:
              'radial-gradient(circle at 50% 40%, black 35%, transparent 90%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 40%, black 35%, transparent 90%)',
          }}
        />
        <div
          className="pointer-events-none absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: `${colorScheme.primary}22` }}
        />

        <Container size="xl">
          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[0.94fr_1.06fr] gap-5 sm:gap-6 lg:gap-7 items-start">
            <div className="xl:sticky xl:top-24 space-y-5 sm:space-y-6">
              <div
                data-reveal
                className="rounded-[1.35rem] sm:rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6 lg:p-7 backdrop-blur-xl"
                style={{
                  boxShadow: '0 18px 48px rgba(0,0,0,0.32)',
                }}
              >
                <H2 className="text-2xl sm:text-3xl lg:text-[2rem] font-semibold mb-3 leading-tight">
                  Find Your Place
                </H2>
                <BodyLG className="text-white/70 text-sm sm:text-base leading-relaxed font-normal">
                  Every ministry is designed to help you connect deeply with God
                  and others — no matter your age or stage of life.
                </BodyLG>

                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                  {[
                    `Ministries: ${Ministries.length}`,
                    'Focus: Word & Power',
                    'Culture: Excellence & Love',
                    'Family: All Generations',
                  ].map(chip => (
                    <div
                      key={chip}
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
                    >
                      <Caption className="text-[11px] sm:text-xs text-white/80 leading-relaxed">
                        {chip}
                      </Caption>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
              data-stagger-group
            >
              {Ministries.map((ministry, i) => {
                const visual = MINISTRY_VISUALS[i % MINISTRY_VISUALS.length];
                const isFeatured = i === 0;

                return (
                  <Link
                    href={ministry.path}
                    key={ministry.path}
                    data-stagger-item
                    className={`group block ${isFeatured ? 'md:col-span-2' : ''}`}
                  >
                    <article
                      className={`relative isolate overflow-hidden rounded-[1.35rem] sm:rounded-[1.6rem] border border-white/10 transition-all duration-500 hover:-translate-y-1 active:translate-y-0 ${
                        isFeatured
                          ? 'min-h-[260px] sm:min-h-[300px]'
                          : 'min-h-[230px] sm:min-h-[250px]'
                      }`}
                      style={{
                        boxShadow: '0 18px 42px rgba(0,0,0,0.35)',
                        background:
                          'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 42%, rgba(0,0,0,0.2) 100%)',
                      }}
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={visual.image}
                          alt={ministry.title}
                          fill
                          sizes={
                            isFeatured
                              ? '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 60vw'
                              : '(max-width: 768px) 100vw, 50vw'
                          }
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          style={{
                            objectPosition: visual.objectPosition ?? 'center',
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90" />
                        <div
                          className="absolute inset-0 opacity-90"
                          style={{ background: visual.glow }}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_88%,rgba(255,255,255,0.12),transparent_38%)]" />
                      </div>

                      <div
                        className="absolute -right-10 top-7 h-20 w-40 rotate-[24deg] rounded-full blur-2xl"
                        style={{ background: `${colorScheme.primary}2a` }}
                      />
                      <div
                        className="absolute right-4 top-5 h-px w-20 rotate-[18deg] opacity-70"
                        style={{ backgroundColor: colorScheme.primary }}
                      />

                      <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 lg:p-7">
                        <div className="flex items-center justify-between gap-3">
                          <div className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur">
                            <Caption className="text-[10px] sm:text-[11px] tracking-[0.2em] text-white/80">
                              {String(i + 1).padStart(2, '0')}
                            </Caption>
                          </div>
                          <div
                            className="h-2.5 w-2.5 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.06)]"
                            style={{ backgroundColor: colorScheme.primary }}
                          />
                        </div>

                        <div className="mt-auto">
                          <H3
                            className={`font-semibold text-white leading-tight ${
                              isFeatured
                                ? 'text-xl sm:text-2xl mb-2'
                                : 'text-lg sm:text-xl mb-2'
                            }`}
                          >
                            {ministry.title}
                          </H3>

                          <BodyMD
                            className="text-sm sm:text-[15px] font-medium mb-2.5 leading-snug"
                            style={{ color: colorScheme.primary }}
                          >
                            {ministry.subtitle}
                          </BodyMD>

                          <Caption className="text-white/75 text-xs sm:text-sm leading-relaxed max-w-[42ch]">
                            {ministry.description}
                          </Caption>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <span
                              className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em]"
                              style={{ color: colorScheme.primary }}
                            >
                              Learn More
                            </span>
                            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/35 backdrop-blur transition-transform duration-300 group-hover:translate-x-0.5">
                              <ChevronRight
                                size={15}
                                style={{ color: colorScheme.primary }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-10 sm:mt-12" data-reveal>
            <div
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-6 lg:p-7"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.16) 100%)',
                boxShadow: `0 20px 50px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.02) inset`,
              }}
            >
              <div
                className="absolute inset-y-0 right-0 w-1/2 opacity-80"
                style={{
                  background: `radial-gradient(circle at 80% 50%, ${colorScheme.primary}24 0%, transparent 70%)`,
                }}
              />
              <div className="relative flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                  <H2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 leading-tight">
                    There's a Place for You Here
                  </H2>
                  <BodyLG className="text-white/75 text-sm sm:text-base font-normal leading-relaxed">
                    No matter where you are in your faith journey — you belong
                    at The Wisdom House.
                  </BodyLG>
                </div>
                <div
                  className="hidden sm:block h-10 w-px bg-white/10"
                  aria-hidden="true"
                />
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colorScheme.primary }}
                  />
                  <Caption className="text-xs sm:text-sm text-white/70">
                    {`Ministries: ${Ministries.length}`}
                  </Caption>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
          }}
        />
        <Container size="xl">
          <div className="text-center mb-7 sm:mb-8" data-reveal>
            <H2 className="text-2xl sm:text-3xl font-semibold mb-3">
              How to Get Involved
            </H2>
            <BodyLG className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              A simple path to help you connect, serve, and grow with others.
            </BodyLG>
          </div>

          <div className="relative max-w-6xl mx-auto" data-stagger-group>
            <div className="hidden md:block absolute left-[16.66%] right-[16.66%] top-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {INVOLVEMENT_STEPS.map((step, index) => (
                <div
                  key={step.title}
                  data-stagger-item
                  className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 14px 36px rgba(0,0,0,0.26)',
                  }}
                >
                  <div
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-sm font-semibold"
                    style={{ color: colorScheme.primary }}
                  >
                    {index + 1}
                  </div>
                  <BodyMD className="text-base sm:text-lg font-semibold mb-2 leading-tight">
                    {step.title}
                  </BodyMD>
                  <Caption className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    {step.description}
                  </Caption>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 sm:mt-10 text-center" data-reveal>
            <CustomButton
              variant="primary"
              size="md"
              curvature="full"
              onClick={() => (window.location.href = '/contact')}
              className="px-6 sm:px-7 py-3 text-sm font-semibold text-black shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
              }}
            >
              Talk to a Leader
            </CustomButton>
          </div>
        </Container>
      </Section>
    </div>
  );
}
