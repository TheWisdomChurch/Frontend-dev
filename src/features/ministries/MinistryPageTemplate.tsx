import type { ReactNode } from 'react';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import SectionGlow from '@/shared/ui/SectionGlow';
import Arrow from '@/shared/ui/icons/Arrow';
import { cn } from '@/lib/cn';

export type MinistryHeading = { lead: string; accent: string; tail?: string };
export type MinistryActivity = { title: string; description: string };
export type MinistryValue = { title: string; body: string };

export type MinistryPageConfig = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    backgroundImage?: string;
  };
  conference?: {
    eyebrow: string;
    heading: MinistryHeading;
    description: string;
    youtubeSrc: string;
    youtubeTitle: string;
    ctaLabel: string;
  };
  mission: {
    dark: boolean;
    heading: MinistryHeading;
    body: string;
  };
  activities: {
    dark: boolean;
    heading: MinistryHeading;
    items: readonly MinistryActivity[];
  };
  /** Slot for a page-specific section (e.g. children's ministry gallery). */
  extra?: ReactNode;
  values: {
    dark: boolean;
    eyebrow?: string;
    heading: MinistryHeading;
    items: readonly MinistryValue[];
  };
  cta: {
    dark: boolean;
    eyebrow?: string;
    heading: MinistryHeading;
    body: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

function Heading({
  heading,
  className,
}: {
  heading: MinistryHeading;
  className: string;
}) {
  return (
    <h2 className={className}>
      {heading.lead}
      <em className="italic text-[var(--app-primary)]/80">{heading.accent}</em>
      {heading.tail}
    </h2>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
      {children}
    </p>
  );
}

export default function MinistryPageTemplate({
  config,
}: {
  config: MinistryPageConfig;
}) {
  const { hero, conference, mission, activities, extra, values, cta } = config;

  return (
    <main className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        backgroundImage={hero.backgroundImage}
      />

      {/* ── Conference (optional) — dark ─────────────────────── */}
      {conference ? (
        <section className="relative min-w-0 overflow-hidden border-b border-white/8 bg-[var(--app-dark)]">
          <SectionGlow />
          <Container size="xl">
            <ScrollFadeIn className="pt-14 lg:pt-18">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <Eyebrow>{conference.eyebrow}</Eyebrow>
                  <Heading
                    heading={conference.heading}
                    className="mt-3 font-headline text-heading-lg font-normal leading-snug text-white sm:text-heading-lg lg:text-display-sm"
                  />
                  <p className="mt-4 max-w-xl font-ui text-body-sm leading-[2] text-white/70">
                    {conference.description}
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center gap-2 self-start border border-white/18 px-6 py-3 font-ui text-label font-semibold text-white/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] lg:self-auto"
                >
                  {conference.ctaLabel} <Arrow />
                </Link>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.1}>
              <div className="pb-14 pt-8 lg:pb-18 lg:pt-10">
                <div className="relative aspect-video w-full overflow-hidden border border-white/8">
                  <iframe
                    src={conference.youtubeSrc}
                    title={conference.youtubeTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </div>
            </ScrollFadeIn>
          </Container>
        </section>
      ) : null}

      {/* ── Mission ──────────────────────────────────────────── */}
      <section
        className={cn(
          'relative min-w-0 overflow-hidden border-b',
          mission.dark
            ? 'border-white/8 bg-[var(--app-dark)]'
            : 'border-[var(--app-ink)]/8 bg-[var(--app-canvas)]'
        )}
      >
        {mission.dark ? <SectionGlow /> : null}
        <Container size="xl">
          <ScrollFadeIn className="py-16 lg:py-20">
            <Eyebrow>Our mission</Eyebrow>
            <Heading
              heading={mission.heading}
              className={cn(
                'mt-4 max-w-2xl font-headline text-heading-md font-normal leading-snug sm:text-heading-lg',
                mission.dark ? 'text-white' : 'text-[var(--app-ink)]'
              )}
            />
            <div className="mt-8 h-[1.5px] w-10 bg-[var(--app-primary)]/50" />
            <p
              className={cn(
                'mt-6 max-w-xl font-ui text-body-sm leading-[2]',
                mission.dark ? 'text-white/70' : 'text-[var(--app-ink)]/70'
              )}
            >
              {mission.body}
            </p>
          </ScrollFadeIn>
        </Container>
      </section>

      {/* ── What we do ───────────────────────────────────────── */}
      <section
        className={cn(
          'min-w-0 overflow-hidden border-b',
          activities.dark
            ? 'border-white/8 bg-[var(--app-dark)]'
            : 'border-[var(--app-ink)]/8 bg-[var(--app-canvas)]'
        )}
      >
        <Container size="xl">
          <ScrollFadeIn className="pt-16 lg:pt-20">
            <Eyebrow>What we do</Eyebrow>
            <Heading
              heading={activities.heading}
              className={cn(
                'mt-3 max-w-xl font-headline text-heading-md font-normal leading-snug sm:text-heading-lg',
                activities.dark ? 'text-white' : 'text-[var(--app-ink)]'
              )}
            />
          </ScrollFadeIn>

          <div className="grid grid-cols-1 gap-x-12 gap-y-0 pb-16 pt-12 sm:grid-cols-2 lg:pb-20 lg:pt-14">
            {activities.items.map((item, i) => (
              <ScrollFadeIn key={item.title} delay={i * 0.07}>
                <div
                  className={cn(
                    'border-t py-8',
                    activities.dark
                      ? 'border-white/8'
                      : 'border-[var(--app-ink)]/10'
                  )}
                >
                  <div className="mb-4 h-[1.5px] w-6 bg-[var(--app-primary)]/50" />
                  <h3
                    className={cn(
                      'font-headline text-heading-sm font-normal',
                      activities.dark ? 'text-white' : 'text-[var(--app-ink)]'
                    )}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      'mt-3 font-ui text-body-sm leading-[1.95]',
                      activities.dark
                        ? 'text-white/70'
                        : 'text-[var(--app-ink)]/68'
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Extra (optional page-specific section) ───────────── */}
      {extra}

      {/* ── Core values ──────────────────────────────────────── */}
      <section
        className={cn(
          'min-w-0 overflow-hidden border-b',
          values.dark
            ? 'border-white/8 bg-[var(--app-dark)]'
            : 'border-[var(--app-ink)]/8 bg-[var(--app-canvas)]'
        )}
      >
        <Container size="xl">
          <ScrollFadeIn>
            <div
              className={cn(
                'border-b py-12 lg:py-14',
                values.dark ? 'border-white/8' : 'border-[var(--app-ink)]/8'
              )}
            >
              <Eyebrow>{values.eyebrow ?? 'What shapes us'}</Eyebrow>
              <Heading
                heading={values.heading}
                className={cn(
                  'mt-3 max-w-lg font-headline text-heading-md font-normal leading-snug sm:text-heading-lg',
                  values.dark ? 'text-white' : 'text-[var(--app-ink)]'
                )}
              />
            </div>
          </ScrollFadeIn>

          <div
            className={cn(
              'grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0',
              values.dark
                ? 'divide-y divide-white/8'
                : 'divide-y divide-[var(--app-ink)]/8'
            )}
          >
            {values.items.map((v, i) => (
              <ScrollFadeIn key={v.title} delay={i * 0.08}>
                <div className="flex flex-col py-10 sm:px-8 lg:px-10 lg:py-12">
                  <div className="mb-5 h-[1.5px] w-6 bg-[var(--app-primary)]/55" />
                  <h3
                    className={cn(
                      'font-headline text-heading-md font-normal leading-none lg:text-heading-lg',
                      values.dark ? 'text-white' : 'text-[var(--app-ink)]'
                    )}
                  >
                    {v.title}
                  </h3>
                  <p
                    className={cn(
                      'mt-4 font-ui text-body-sm leading-[1.95]',
                      values.dark ? 'text-white/70' : 'text-[var(--app-ink)]/68'
                    )}
                  >
                    {v.body}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <ScrollFadeIn>
        <section
          className={cn(
            'relative min-w-0 overflow-hidden py-20 lg:py-28',
            cta.dark ? 'bg-[var(--app-dark)]' : 'bg-[var(--app-canvas)]'
          )}
        >
          {cta.dark ? <SectionGlow /> : null}
          <Container size="lg">
            <div className="flex flex-col items-center gap-7 text-center">
              <Eyebrow>{cta.eyebrow ?? 'Join the ministry'}</Eyebrow>
              <Heading
                heading={cta.heading}
                className={cn(
                  'font-headline text-heading-md font-normal leading-snug sm:text-heading-lg',
                  cta.dark ? 'text-white' : 'text-[var(--app-ink)]'
                )}
              />
              <div
                className={cn(
                  'h-px w-10 bg-[var(--app-primary)]',
                  cta.dark ? 'opacity-40' : 'opacity-35'
                )}
              />
              <p
                className={cn(
                  'max-w-md font-ui text-body-sm leading-[2]',
                  cta.dark ? 'text-white/70' : 'text-[var(--app-ink)]/68'
                )}
              >
                {cta.body}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={cta.primaryHref}
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-8 py-3.5 font-ui text-label font-bold uppercase tracking-[0.14em] text-[var(--app-ink)] transition hover:brightness-105"
                >
                  {cta.primaryLabel} <Arrow />
                </Link>
                <Link
                  href={cta.secondaryHref}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 border px-8 py-3.5 font-ui text-label font-semibold uppercase tracking-[0.14em] transition',
                    cta.dark
                      ? 'border-white/18 text-white/50 hover:border-white/35 hover:text-white'
                      : 'border-[var(--app-ink)]/18 text-[var(--app-ink)]/50 hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
                  )}
                >
                  {cta.secondaryLabel}
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
