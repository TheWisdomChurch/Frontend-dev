import type { Metadata } from 'next';
import { ArrowRight, Church, HeartHandshake, MapPin, Play } from 'lucide-react';

import { apiClient } from '@/lib/api';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';
import { resolveAboutContent } from '@/content/about';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import { CanvasCard, DarkCard } from '@/features/leadership/LeadershipCards';
import type {
  LeadershipMember,
  LeadershipRole,
} from '@/domain/leadership/types';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import JsonLd from '@/shared/seo/JsonLd';
import {
  EditorialContainer,
  EditorialHeader,
  EditorialImage,
  EditorialLink,
  EditorialSection,
  EditorialSplit,
} from '@/shared/ui/editorial';
import { ScrollFadeIn } from '@/shared/ui/motion';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildPageMetadata({
  title: 'About The Wisdom Church',
  description:
    'Discover the vision, mission, five pillars, and Wisdom House identity of The Wisdom Church in Lagos.',
  path: '/about',
});

const SENIOR_ROLES: LeadershipRole[] = [
  'senior_pastor',
  'associate_pastor',
  'reverend',
];

const serviceDetails = [
  {
    icon: Church,
    label: 'Sunday worship',
    value: `${SERVICE_INFO.sunday.time} ${SERVICE_INFO.sunday.timezone}`,
  },
  {
    icon: HeartHandshake,
    label: 'Daily prayer',
    value: `${SERVICE_INFO.dailyPrayer.daysShort} · ${SERVICE_INFO.dailyPrayer.time}`,
  },
  { icon: MapPin, label: 'Our church home', value: SERVICE_INFO.venue.short },
] as const;

export default async function AboutPage() {
  const [leadershipResult, contentResult] = await Promise.allSettled([
    apiClient.listLeadership(),
    apiClient.getAboutContent(),
  ]);
  const content = resolveAboutContent(
    contentResult.status === 'fulfilled' ? contentResult.value : null
  );
  const leaders = (
    leadershipResult.status === 'fulfilled'
      ? leadershipResult.value
      : ([] as LeadershipMember[])
  )
    .filter(leader => SENIOR_ROLES.includes(leader.role))
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-[var(--app-surface)]">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      <EditorialSection
        tone="dark"
        className="pt-[calc(var(--app-header-height)+var(--section-xs))]"
      >
        <EditorialContainer>
          <EditorialSplit className="items-end">
            <ScrollFadeIn>
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                {content.hero.eyebrow}
              </p>
              <h1 className="mt-5 max-w-3xl text-balance font-headline text-display-md font-semibold leading-none tracking-tight sm:text-display-lg">
                {content.hero.title}
              </h1>
              <p className="mt-7 max-w-2xl font-ui text-lead leading-relaxed text-white/70">
                {content.hero.description}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <PlanVisitTrigger className="inline-flex min-h-12 items-center justify-center rounded-button bg-[var(--app-primary)] px-7 font-ui text-label font-bold uppercase tracking-widest text-[var(--app-ink)]">
                  Worship with us
                </PlanVisitTrigger>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-white/20 px-7 font-ui text-label font-bold uppercase tracking-widest text-white"
                >
                  <Play className="h-4 w-4" /> Watch a service
                </a>
              </div>
            </ScrollFadeIn>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <EditorialImage
                src={content.hero.images[0].src}
                alt={content.hero.images[0].alt}
                fill
                priority
                sizes="(max-width: 1023px) 50vw, 25vw"
                className="aspect-[4/5]"
              />
              <div className="grid gap-3 pt-10 sm:gap-4 sm:pt-16">
                {content.hero.images.slice(1).map(image => (
                  <EditorialImage
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1023px) 50vw, 25vw"
                    className="aspect-[4/3]"
                  />
                ))}
              </div>
            </div>
          </EditorialSplit>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection compact tone="canvas">
        <EditorialContainer>
          <div className="grid gap-px overflow-hidden rounded-card bg-[var(--app-border)] sm:grid-cols-3">
            {serviceDetails.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 bg-[var(--app-canvas)] p-5 sm:p-6"
                >
                  <Icon className="h-5 w-5 shrink-0 text-[var(--app-primary-dark)]" />
                  <div>
                    <p className="font-ui text-eyebrow font-bold uppercase tracking-widest text-[var(--app-subtle)]">
                      {item.label}
                    </p>
                    <p className="mt-1 font-headline text-heading-sm">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection>
        <EditorialContainer>
          <EditorialHeader
            eyebrow={content.message.label}
            title={content.message.title}
            description="Good news that establishes believers in faith and equips them to manifest the life of Christ wherever they go."
            className="max-w-4xl"
          />
          <div className="mt-12 flex flex-wrap border-y border-[var(--app-border)] py-5">
            {content.message.themes.map(theme => (
              <span
                key={theme}
                className="mr-8 py-2 font-ui text-heading-sm font-semibold text-[var(--app-muted)]"
              >
                {theme}
              </span>
            ))}
          </div>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="canvas">
        <EditorialContainer>
          <div className="grid gap-px overflow-hidden rounded-card bg-[var(--app-border)] lg:grid-cols-2">
            {[content.vision, content.mission].map((item, index) => (
              <ScrollFadeIn
                key={item.label}
                delay={index * 0.08}
                className="bg-[var(--app-canvas)] p-8 sm:p-12 lg:p-16"
              >
                <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary-dark)]">
                  {item.label}
                </p>
                <h2 className="mt-5 max-w-xl font-headline text-display-sm font-semibold leading-tight tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-6 max-w-xl font-ui text-body-lg leading-loose text-[var(--app-ink)]/70">
                  {item.body}
                </p>
              </ScrollFadeIn>
            ))}
          </div>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="dark">
        <EditorialContainer>
          <EditorialHeader
            eyebrow="What shapes us"
            title="Five pillars. One way of life."
            tone="dark"
          />
          <div className="mt-12 border-y border-white/15">
            {content.pillars.map((pillar, index) => (
              <ScrollFadeIn key={pillar.title} delay={index * 0.04}>
                <article className="grid gap-4 border-b border-white/15 py-8 last:border-b-0 sm:grid-cols-[auto_minmax(0,0.7fr)_minmax(0,1fr)] sm:items-baseline sm:gap-10 lg:py-10">
                  <span className="font-ui text-label font-bold text-[var(--app-primary)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-headline text-heading-lg font-semibold">
                    {pillar.title}
                  </h3>
                  <p className="max-w-2xl font-ui text-body-md leading-loose text-white/65">
                    {pillar.body}
                  </p>
                </article>
              </ScrollFadeIn>
            ))}
          </div>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection>
        <EditorialContainer>
          <EditorialSplit>
            <div>
              <EditorialHeader
                eyebrow="What it means to belong"
                title="This is a Wisdom House."
                description={content.declaration}
              />
              <div className="mt-8 flex flex-wrap gap-2">
                {content.practices.map(practice => (
                  <span
                    key={practice}
                    className="rounded-badge border border-[var(--app-border)] px-4 py-2 font-ui text-label font-semibold"
                  >
                    {practice}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-x-8 sm:grid-cols-2">
              {content.wisdomHouse.map((item, index) => {
                const Icon = item.icon;
                return (
                  <ScrollFadeIn key={item.title} delay={index * 0.04}>
                    <article className="border-t border-[var(--app-border)] py-6">
                      <Icon className="h-5 w-5 text-[var(--app-primary-dark)]" />
                      <h3 className="mt-4 font-headline text-heading-sm font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-3 font-ui text-body-sm leading-loose text-[var(--app-ink)]/65">
                        {item.body}
                      </p>
                    </article>
                  </ScrollFadeIn>
                );
              })}
            </div>
          </EditorialSplit>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="dark">
        <EditorialContainer>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <EditorialHeader
              eyebrow="Pastoral leadership"
              title="Serving God’s people with the Word, prayer, and love."
              tone="dark"
              className="max-w-3xl"
            />
            <EditorialLink
              href="/leadership"
              variant="outline"
              className="shrink-0"
            >
              Meet our leaders <ArrowRight className="ml-2 h-4 w-4" />
            </EditorialLink>
          </div>
        </EditorialContainer>
      </EditorialSection>
      {leaders.length ? (
        <div className="grid lg:grid-cols-2">
          <CanvasCard leader={leaders[0]} />
          {leaders[1] ? <DarkCard leader={leaders[1]} /> : null}
        </div>
      ) : null}

      <EditorialSection tone="brand">
        <EditorialContainer className="text-center">
          <EditorialHeader
            eyebrow="There is a place for you"
            title="Come worship Jesus with us this Sunday."
            className="mx-auto max-w-4xl"
          />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PlanVisitTrigger className="inline-flex min-h-12 items-center justify-center rounded-button bg-[var(--app-dark)] px-7 font-ui text-label font-bold uppercase tracking-widest text-white">
              Plan your visit
            </PlanVisitTrigger>
            <EditorialLink href="/ministries" variant="outline">
              Explore ministries
            </EditorialLink>
          </div>
        </EditorialContainer>
      </EditorialSection>
    </main>
  );
}
