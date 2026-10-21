'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Container, Section, SectionHeader } from '@/shared/ui/layout';
import { ConnectCommunityCta } from '@/features/community/ConnectCommunityCta';
import { buttonClass } from '@/shared/ui/button';
import { cn } from '@/lib/cn';
import { IMAGE_QUALITY } from '@/shared/constants';

export interface CommunityPillar {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  images: {
    main: { src: string; alt: string; position: string };
    sub1: { src: string; alt: string; position: string };
    sub2: { src: string; alt: string; position: string };
  };
}

const PILLARS: readonly CommunityPillar[] = [
  {
    id: 'fellowships',
    number: '01',
    title: "Active Men's, Women's, and Youth Fellowships",
    category: 'Fellowships & Demographics',
    description:
      'Vibrant demographic communities for men, women, and energetic youth to build genuine godly friendships, sharpen one another in faith, and grow together.',
    badge: 'Men · Women · Youth Fellowships',
    images: {
      main: {
        src: '/Picflow/DSC00064-copy.webp',
        alt: 'Men and women worshiping and sharing fellowship at The Wisdom Church',
        position: 'object-[center_35%]',
      },
      sub1: {
        src: '/Picflow/women1.webp',
        alt: "Women's fellowship gathering at The Wisdom Church",
        position: 'object-[center_25%]',
      },
      sub2: {
        src: '/Picflow/men1.webp',
        alt: 'Men of Wisdom fellowship in discussion',
        position: 'object-[center_30%]',
      },
    },
  },
  {
    id: 'kingdom-kids',
    number: '02',
    title: 'Nurturing Kingdom Kids church for our children',
    category: 'Children Ministry',
    description:
      'A loving, fun, and secure sanctuary where children learn sound biblical truths, encounter the Holy Spirit, and experience worship tailored for young hearts.',
    badge: 'Kingdom Kids Church · Sundays',
    images: {
      main: {
        src: '/Picflow/children-group.webp',
        alt: 'Kingdom Kids joyful group at The Wisdom Church children church',
        position: 'object-[center_35%]',
      },
      sub1: {
        src: '/Picflow/child.webp',
        alt: 'Young child in Kingdom Kids church',
        position: 'object-center',
      },
      sub2: {
        src: '/Picflow/children-classroom-circle.webp',
        alt: 'Children engaged in interactive Bible lesson circle',
        position: 'object-[center_30%]',
      },
    },
  },
  {
    id: 'service-ministries',
    number: '03',
    title: 'Meaningful service opportunities across ministry departments',
    category: 'Ministry & Workforce',
    description:
      'Discover and deploy your God-given spiritual gifts across worship, creative media, sound production, ushering, welfare, and community outreach.',
    badge: 'Workforce & Service Units',
    images: {
      main: {
        src: '/Picflow/DSC00268-copy.webp',
        alt: 'Wisdom Church dedicated volunteer serving during Sunday worship service',
        position: 'object-[52%_center]',
      },
      sub1: {
        src: '/Picflow/DSC00049-copy.webp',
        alt: 'Volunteer ministers and choir team in fervent worship',
        position: 'object-[center_40%]',
      },
      sub2: {
        src: '/Picflow/DSC00054-copy.webp',
        alt: 'Community family worshipping together at The Wisdom Church',
        position: 'object-[center_32%]',
      },
    },
  },
];

const CYCLE_DURATION_MS = 6000;

export default function CommunityInteractiveShowcase() {
  const [activePillar, setActivePillar] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Gentle auto-advance between the 3 pillars
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActivePillar(prev => (prev + 1) % PILLARS.length);
    }, CYCLE_DURATION_MS);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleSelectPillar = useCallback((index: number) => {
    setActivePillar(index);
  }, []);

  const current = PILLARS[activePillar] ?? PILLARS[0];

  return (
    <Section
      id="community"
      tone="canvas"
      className="relative overflow-hidden bg-[radial-gradient(ellipse_75%_55%_at_50%_15%,color-mix(in_srgb,var(--app-primary-10)_60%,transparent)_0%,transparent_65%),var(--app-canvas)] py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* ── Left Column: Mature Editorial Image Gallery ── */}
          <div
            className="lg:col-span-6 xl:col-span-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative">
              {/* Asymmetrical Editorial Collage */}
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {/* Main Large Figure */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-canvas-2)] shadow-xl">
                  {PILLARS.map((pillar, idx) => {
                    const isActive = idx === activePillar;
                    return (
                      <div
                        key={`main-${pillar.id}`}
                        aria-hidden={!isActive}
                        className={cn(
                          'absolute inset-0 transition-opacity duration-700 ease-in-out',
                          isActive
                            ? 'opacity-100 z-10'
                            : 'opacity-0 pointer-events-none z-0'
                        )}
                      >
                        <Image
                          src={pillar.images.main.src}
                          alt={pillar.images.main.alt}
                          fill
                          quality={IMAGE_QUALITY}
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 30vw"
                          className={cn(
                            'h-full w-full object-cover transition-transform duration-1000 ease-out hover:scale-105',
                            pillar.images.main.position
                          )}
                        />
                      </div>
                    );
                  })}

                  {/* Sleek Floating Pill Badge */}
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-3.5 py-1.5 font-ui text-xs font-semibold text-[var(--app-ink)] shadow-md backdrop-blur-md">
                      <span className="h-2 w-2 rounded-full bg-[var(--app-primary)]" />
                      <span className="truncate">{current.badge}</span>
                    </div>
                  </div>
                </div>

                {/* Sub Stacked Figures with Editorial Stagger */}
                <div className="grid gap-4 pt-8 sm:gap-5 sm:pt-12">
                  {/* Top Sub Image */}
                  <div className="relative aspect-square overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-canvas-2)] shadow-md">
                    {PILLARS.map((pillar, idx) => {
                      const isActive = idx === activePillar;
                      return (
                        <div
                          key={`sub1-${pillar.id}`}
                          aria-hidden={!isActive}
                          className={cn(
                            'absolute inset-0 transition-opacity duration-700 ease-in-out',
                            isActive
                              ? 'opacity-100 z-10'
                              : 'opacity-0 pointer-events-none z-0'
                          )}
                        >
                          <Image
                            src={pillar.images.sub1.src}
                            alt={pillar.images.sub1.alt}
                            fill
                            quality={IMAGE_QUALITY}
                            sizes="(max-width: 1023px) 50vw, 20vw"
                            className={cn(
                              'h-full w-full object-cover',
                              pillar.images.sub1.position
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Sub Image */}
                  <div className="relative aspect-square overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-canvas-2)] shadow-md">
                    {PILLARS.map((pillar, idx) => {
                      const isActive = idx === activePillar;
                      return (
                        <div
                          key={`sub2-${pillar.id}`}
                          aria-hidden={!isActive}
                          className={cn(
                            'absolute inset-0 transition-opacity duration-700 ease-in-out',
                            isActive
                              ? 'opacity-100 z-10'
                              : 'opacity-0 pointer-events-none z-0'
                          )}
                        >
                          <Image
                            src={pillar.images.sub2.src}
                            alt={pillar.images.sub2.alt}
                            fill
                            quality={IMAGE_QUALITY}
                            sizes="(max-width: 1023px) 50vw, 20vw"
                            className={cn(
                              'h-full w-full object-cover',
                              pillar.images.sub2.position
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: High-End Senior Editorial Navigation ── */}
          <div className="flex flex-col gap-8 lg:col-span-6 xl:col-span-6">
            <SectionHeader
              eyebrow="Find your people"
              title="We don't do"
              accent="life alone."
              description="Build meaningful relationships, grow in faith, and discover where you belong in a community that feels like home."
            />

            {/* Editorial Interactive Rows (Refined, Mature & Senior) */}
            <div
              role="tablist"
              aria-label="Community Fellowships and Ministries"
              className="flex flex-col divide-y divide-[var(--app-border)] border-y border-[var(--app-border)]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {PILLARS.map((pillar, index) => {
                const isActive = index === activePillar;

                return (
                  <button
                    key={pillar.id}
                    type="button"
                    role="tab"
                    id={`pillar-tab-${pillar.id}`}
                    aria-selected={isActive}
                    aria-controls={`pillar-panel-${pillar.id}`}
                    onClick={() => handleSelectPillar(index)}
                    className={cn(
                      'group relative flex w-full flex-col py-5 sm:py-6 text-left transition-all duration-300 outline-none',
                      isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                    )}
                  >
                    {/* Header Row: Index Number + Titles + Right Arrow */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <span
                          className={cn(
                            'mt-0.5 font-mono text-label font-bold transition-colors',
                            isActive
                              ? 'text-[var(--app-primary-dark)]'
                              : 'text-[var(--app-subtle)] group-hover:text-[var(--app-text)]'
                          )}
                        >
                          {pillar.number}
                        </span>
                        <div>
                          <span className="block font-ui text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--app-subtle)]">
                            {pillar.category}
                          </span>
                          <h3
                            className={cn(
                              'mt-1 font-headline text-lg sm:text-xl font-semibold leading-snug transition-colors',
                              isActive
                                ? 'text-[var(--app-text)] font-bold'
                                : 'text-[var(--app-text)]/85 group-hover:text-[var(--app-text)]'
                            )}
                          >
                            {pillar.title}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={cn(
                          'mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                          isActive
                            ? 'border-[var(--app-primary-dark)] bg-[var(--app-primary)] text-black shadow-xs rotate-45'
                            : 'border-[var(--app-border)] text-[var(--app-subtle)] group-hover:border-[var(--app-primary)] group-hover:text-[var(--app-text)]'
                        )}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    {/* Smoothly Revealed Description */}
                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-300 pl-8 sm:pl-9',
                        isActive
                          ? 'max-h-28 pt-2.5 opacity-100'
                          : 'max-h-0 pt-0 opacity-0 pointer-events-none'
                      )}
                    >
                      <p className="font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
                        {pillar.description}
                      </p>
                    </div>

                    {/* Active Minimal Underline Indicator */}
                    {isActive ? (
                      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--app-border)]/50">
                        <div
                          className={cn(
                            'h-full bg-[var(--app-primary-dark)] animate-[community-progress_6s_linear_infinite]',
                            isPaused && '[animation-play-state:paused]'
                          )}
                        />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Bottom Action Triggers */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <ConnectCommunityCta label="Connect with us" />
              <Link href="/ministries" className={buttonClass('outline', 'md')}>
                Explore all ministries <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Embedded CSS keyframe for smooth timer bar */}
      <style jsx>{`
        @keyframes community-progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </Section>
  );
}
