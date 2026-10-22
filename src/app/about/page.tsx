import type { Metadata } from 'next';
import { ArrowRight, Play } from 'lucide-react';

import { apiClient } from '@/lib/api';
import {
  buildBreadcrumbSchema,
  buildPageMetadata,
  canonicalUrl,
  ORG_ID,
  SITE_LOGO,
} from '@/lib/seo';
import { resolveAboutContent } from '@/content/about';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import SiteHero from '@/features/hero/SiteHero';
import SectionFlowDock, {
  type FlowDockItem,
} from '@/shared/components/SectionFlowDock';
import { DarkCard } from '@/features/leadership/LeadershipCards';
import type {
  LeadershipMember,
  LeadershipRoleSlug,
} from '@/domain/leadership/types';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import JsonLd from '@/shared/seo/JsonLd';
import {
  Container,
  CtaLink,
  Page,
  Section,
  SectionHeader,
  Split,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';
import { GlassSmokeCard } from '@/shared/ui/GlassSmokeCard';
import { Marquee } from '@/shared/ui/Marquee';
import { ScrollFadeIn } from '@/shared/ui/motion';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildPageMetadata({
  title: 'About The Wisdom Church',
  description:
    'The vision, mission, five pillars, and identity of The Wisdom Church — a Spirit-filled family in Lagos led by pastors devoted to the Word, prayer, and community.',
  path: '/about',
  keywords: [
    'about The Wisdom Church',
    'Wisdom Church vision mission',
    'Wisdom Church pastors',
    'church beliefs Lagos',
    'what we believe',
  ],
});

const SENIOR_ROLES: LeadershipRoleSlug[] = [
  'senior_pastor',
  'associate_pastor',
  'reverend',
];

const ABOUT_FLOW_DOCK_ITEMS: readonly FlowDockItem[] = [
  {
    id: 'dock-message',
    title: 'The Gospel Message',
    description: 'Good news that establishes believers in sound doctrine',
    badge: 'Our Message',
    icon: 'book-open',
    targetId: 'the-message',
  },
  {
    id: 'dock-vision',
    title: 'Vision & Mission',
    description: 'Raising complete believers manifesting Christ everywhere',
    badge: 'Our Mandate',
    icon: 'compass',
    targetId: 'vision-mission',
  },
  {
    id: 'dock-pillars',
    title: 'Five Core Pillars',
    description: 'Sound doctrine, prayer, family, worship, and godly wisdom',
    badge: 'Five Pillars',
    icon: 'shield-check',
    targetId: 'five-pillars',
  },
  {
    id: 'dock-identity',
    title: 'Church Identity & Family',
    description: 'A warm, spirit-filled community where every soul belongs',
    badge: 'Our Family',
    icon: 'heart-handshake',
    targetId: 'church-identity',
  },
  {
    id: 'dock-pastors',
    title: 'Pastoral Council',
    description: 'Bishop Gabriel Ayilara & Pastoral Council oversight',
    badge: 'Leadership',
    icon: 'users',
    targetId: 'pastoral-leadership',
  },
];

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
    .filter(leader => (SENIOR_ROLES as string[]).includes(leader.role))
    .slice(0, 2);

  return (
    <Page
      tone="surface"
      className="bg-[var(--app-dark)] text-[var(--app-text)]"
    >
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About The Wisdom Church',
          url: canonicalUrl('/about'),
          primaryImageOfPage: SITE_LOGO,
          mainEntity: { '@id': ORG_ID },
        }}
      />

      <SiteHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.description}
        backgroundImage={content.hero.images[0].src}
        imagePositionClassName="object-center"
        priority
        actions={
          <>
            <PlanVisitTrigger size="lg">Worship with us</PlanVisitTrigger>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noreferrer"
              className={buttonClass('outline', 'lg')}
            >
              <Play className="h-4 w-4" /> Watch a service
            </a>
          </>
        }
      />

      {/* ── 1.1 Floating Navigation Dock: Matches Growth Portal Flow ─────────── */}
      <SectionFlowDock
        label="About The Wisdom Church"
        items={ABOUT_FLOW_DOCK_ITEMS}
      />

      <Section id="the-message" className="scroll-mt-24">
        <Container>
          <SectionHeader
            eyebrow={content.message.label}
            title={content.message.title}
            description="Good news that establishes believers in faith and equips them to manifest the life of Christ wherever they go."
            className="max-w-4xl"
          />
          <div className="mt-12 border-y border-[var(--app-border)] py-6">
            <Marquee items={content.message.themes} />
          </div>
        </Container>
      </Section>

      <Section id="vision-mission" tone="canvas" className="scroll-mt-24">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            {[content.vision, content.mission].map(item => (
              <GlassSmokeCard
                key={item.label}
                eyebrow={item.label}
                title={item.title}
                body={item.body}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section id="five-pillars" tone="dark" className="scroll-mt-24">
        <Container>
          <SectionHeader
            eyebrow="What shapes us"
            title="Five pillars. One way of life."
            tone="dark"
          />
          <div className="mt-12 border-y border-[var(--app-border)]">
            {content.pillars.map((pillar, index) => (
              <ScrollFadeIn key={pillar.title} delay={index * 0.04}>
                <article className="grid gap-4 border-b border-[var(--app-border)] py-8 last:border-b-0 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] sm:items-baseline sm:gap-10 lg:py-10">
                  <h3 className="font-ui text-heading-lg font-semibold !text-white">
                    {pillar.title}
                  </h3>
                  <p className="max-w-2xl font-ui text-body-md leading-loose text-[var(--app-muted)]">
                    {pillar.body}
                  </p>
                </article>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="church-identity" className="scroll-mt-24">
        <Container>
          <Split>
            <div>
              <SectionHeader
                eyebrow="What it means to belong"
                title="This is The Wisdom Church."
                description={content.declaration}
              />
              <div className="mt-8 border-y border-[var(--app-border)] py-5">
                <Marquee items={content.practices} speedSeconds={26} />
              </div>
            </div>
            <div className="grid gap-x-8 sm:grid-cols-2">
              {content.churchIdentity.map((item, index) => {
                const Icon = item.icon;
                return (
                  <ScrollFadeIn key={item.title} delay={index * 0.04}>
                    <article className="border-t border-[var(--app-border)] py-6">
                      <Icon className="h-5 w-5 text-[var(--app-primary-dark)]" />
                      <h3 className="mt-4 font-headline text-heading-sm font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-3 font-ui text-body-sm leading-loose text-[var(--app-muted)]">
                        {item.body}
                      </p>
                    </article>
                  </ScrollFadeIn>
                );
              })}
            </div>
          </Split>
        </Container>
      </Section>

      <Section id="pastoral-leadership" tone="dark" className="scroll-mt-24">
        <Container>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Pastoral leadership"
              title="Serving God’s people with the Word, prayer, and love."
              tone="dark"
              className="max-w-3xl"
            />
            <CtaLink href="/leadership" variant="outline" className="shrink-0">
              Meet our leaders <ArrowRight className="ml-2 h-4 w-4" />
            </CtaLink>
          </div>
        </Container>
      </Section>
      {leaders.length ? (
        <Section tone="dark" className="pt-0">
          <Container>
            <div className="grid gap-6 sm:grid-cols-2">
              {leaders.slice(0, 2).map(leader => (
                <DarkCard key={leader.id} leader={leader} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section tone="brand">
        <Container className="text-center">
          <SectionHeader
            eyebrow="There is a place for you"
            title="Come worship Jesus with us this Sunday."
            className="mx-auto max-w-4xl"
          />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PlanVisitTrigger variant="dark">Plan your visit</PlanVisitTrigger>
            <CtaLink href="/ministries" variant="outline">
              Explore ministries
            </CtaLink>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
