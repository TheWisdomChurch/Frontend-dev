import type { ReactNode } from 'react';
import Link from 'next/link';

import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import Arrow from '@/shared/ui/icons/Arrow';
import { Container, Page, Section, SectionHeader } from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';

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

/** Compose `{ lead, accent, tail }` into the ReactNode a SectionHeader title expects. */
function heading(h: MinistryHeading): ReactNode {
  return (
    <>
      {h.lead}
      <span className="font-normal text-[var(--app-primary)]">{h.accent}</span>
      {h.tail}
    </>
  );
}

export default function MinistryPageTemplate({
  config,
}: {
  config: MinistryPageConfig;
}) {
  const { hero, conference, mission, activities, extra, values, cta } = config;

  return (
    <Page>
      <SiteHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        backgroundImage={hero.backgroundImage}
      />

      {conference ? (
        <Section tone="dark">
          <Container>
            <ScrollFadeIn>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeader
                  eyebrow={conference.eyebrow}
                  title={heading(conference.heading)}
                  description={conference.description}
                  size="sm"
                />
                <Link
                  href="/contact"
                  className={buttonClass(
                    'outline',
                    'md',
                    'self-start lg:self-auto'
                  )}
                >
                  {conference.ctaLabel} <Arrow />
                </Link>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.1}>
              <div className="relative mt-12 aspect-video w-full overflow-hidden rounded-image border border-current/10">
                <iframe
                  src={conference.youtubeSrc}
                  title={conference.youtubeTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </ScrollFadeIn>
          </Container>
        </Section>
      ) : null}

      <Section tone={mission.dark ? 'dark' : 'canvas'}>
        <Container>
          <ScrollFadeIn>
            <SectionHeader
              eyebrow="Our mission"
              title={heading(mission.heading)}
              description={mission.body}
              size="sm"
            />
          </ScrollFadeIn>
        </Container>
      </Section>

      <Section tone={activities.dark ? 'dark' : 'canvas'}>
        <Container>
          <ScrollFadeIn>
            <SectionHeader
              eyebrow="What we do"
              title={heading(activities.heading)}
              size="sm"
            />
          </ScrollFadeIn>

          <div className="mt-12 grid grid-cols-1 gap-x-12 sm:grid-cols-2">
            {activities.items.map((item, i) => (
              <ScrollFadeIn key={item.title} delay={i * 0.07}>
                <div className="border-t border-current/10 py-8">
                  <div className="mb-4 h-[1.5px] w-6 bg-[var(--app-primary)]/50" />
                  <h3 className="font-ui text-heading-sm font-semibold text-current">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-ui text-body-sm leading-[1.9] text-[var(--app-muted)]">
                    {item.description}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {extra}

      <Section tone={values.dark ? 'dark' : 'canvas'}>
        <Container>
          <ScrollFadeIn>
            <SectionHeader
              eyebrow={values.eyebrow ?? 'What shapes us'}
              title={heading(values.heading)}
              size="sm"
              className="border-b border-current/10 pb-8 sm:pb-10"
            />
          </ScrollFadeIn>

          <div className="grid grid-cols-1 divide-y divide-current/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {values.items.map((v, i) => (
              <ScrollFadeIn key={v.title} delay={i * 0.08}>
                <div className="flex flex-col py-8 sm:px-6 lg:px-8 lg:py-10">
                  <div className="mb-5 h-[1.5px] w-6 bg-[var(--app-primary)]/55" />
                  <h3 className="font-ui text-heading-md font-medium leading-tight tracking-[-0.02em] text-current">
                    {v.title}
                  </h3>
                  <p className="mt-4 font-ui text-body-sm leading-[1.9] text-[var(--app-muted)]">
                    {v.body}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone={cta.dark ? 'dark' : 'canvas'}>
        <Container>
          <div className="flex flex-col items-center gap-7 text-center">
            <SectionHeader
              eyebrow={cta.eyebrow ?? 'Join the ministry'}
              title={heading(cta.heading)}
              description={cta.body}
              size="sm"
              align="center"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={cta.primaryHref} className={buttonClass('primary')}>
                {cta.primaryLabel} <Arrow />
              </Link>
              <Link href={cta.secondaryHref} className={buttonClass('outline')}>
                {cta.secondaryLabel}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
