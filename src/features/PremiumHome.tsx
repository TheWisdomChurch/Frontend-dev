import Image from 'next/image';
import { CalendarDays, MapPin } from 'lucide-react';

import {
  HOME_BELIEFS,
  HOME_COMMUNITY_GALLERY,
  HOME_COPY,
  HOME_IMAGES,
} from '@/features/home/content';
import { CellFellowshipCta } from '@/features/community/CellFellowshipCta';
import { ConnectCommunityCta } from '@/features/community/ConnectCommunityCta';
import CommunityJoinTrigger from '@/features/community/CommunityJoinTrigger';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import HomeHero from '@/features/hero/HomeHero';
import TakeMeToChurchButton from '@/features/navigation/TakeMeToChurchButton';
import SectionFlowDock, {
  type FlowDockItem,
} from '@/shared/components/SectionFlowDock';
import { cn } from '@/lib/cn';
import { IMAGE_QUALITY } from '@/shared/constants';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import {
  Container,
  Page,
  SectionHeader,
  Figure,
  CtaLink,
  Section,
  Split,
  SplitFeature,
} from '@/shared/ui/layout';

const HOME_FLOW_DOCK_ITEMS: readonly FlowDockItem[] = [
  {
    id: 'dock-sunday-worship',
    title: 'Sunday Worship Service',
    description: 'Sundays at 9:00 AM (WAT) · In-Person & Streaming Live',
    badge: '9:00 AM WAT',
    icon: 'church',
    targetId: 'welcome',
  },
  {
    id: 'dock-growth-portal',
    title: 'Growth & Discipleship',
    description: 'Foundations, Believers Equipping & Spiritual Maturity',
    badge: 'Grow Portal',
    icon: 'graduation-cap',
    href: '/grow',
  },
  {
    id: 'dock-cell-fellowships',
    title: 'Cell Fellowship Centers',
    description: 'Midweek fellowship in neighborhood homes across Lagos',
    badge: 'Midweek',
    icon: 'users',
    targetId: 'community',
  },
  {
    id: 'dock-leadership',
    title: 'Leadership Organogram',
    description: 'Pastoral oversight, organogram, and church stewards',
    badge: 'Leadership',
    icon: 'shield-check',
    href: '/leadership',
  },
  {
    id: 'dock-ministries',
    title: 'Ministries Directory',
    description: 'A place for men, women, youth, and kingdom children',
    badge: 'Find Your Tribe',
    icon: 'heart-handshake',
    href: '/ministries',
  },
];

export default function PremiumHome() {
  return (
    <Page
      tone="surface"
      className="bg-[var(--app-dark)] text-[var(--app-text)]"
    >
      {/* ── 1. Hero Section: Living Video Sanctuary ─────────────────────────── */}
      <HomeHero
        backgroundImage={HOME_IMAGES.hero.src}
        imagePositionClassName={HOME_IMAGES.hero.position}
        priority
      />

      {/* ── 1.1 Floating Navigation Dock: Matches Growth Portal Flow ─────────── */}
      <SectionFlowDock
        label="The Wisdom Church Experience"
        items={HOME_FLOW_DOCK_ITEMS}
      />

      {/* ── 2. Welcome Section: Warm Editorial Canvas ───────────────────────── */}
      <Section
        id="welcome"
        tone="canvas"
        className="relative bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,color-mix(in_srgb,var(--app-primary-10)_80%,transparent)_0%,transparent_65%),var(--app-canvas-2)] py-18 sm:py-28"
      >
        <Container>
          <SplitFeature
            text={
              <div className="space-y-6">
                <SectionHeader
                  eyebrow={HOME_COPY.welcome.eyebrow}
                  title={HOME_COPY.welcome.title}
                  accent={HOME_COPY.welcome.accent}
                  description={HOME_COPY.welcome.description}
                />

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 font-ui text-xs font-semibold text-[var(--app-text)] shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-primary)]" />
                    Sound Doctrine
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 font-ui text-xs font-semibold text-[var(--app-text)] shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-primary)]" />
                    Fervent Prayer
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 font-ui text-xs font-semibold text-[var(--app-text)] shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-primary)]" />
                    Genuine Family
                  </span>
                </div>
              </div>
            }
            media={
              <div className="group relative overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                <Figure
                  parallax
                  src={HOME_IMAGES.welcome.src}
                  alt={HOME_IMAGES.welcome.alt}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="aspect-[4/3] sm:aspect-[16/11]"
                  imageClassName={cn(
                    HOME_IMAGES.welcome.position,
                    'transition-transform duration-700 ease-out group-hover:scale-105'
                  )}
                />
                <div className="pointer-events-none absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/65 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-lg backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-[var(--app-primary)]" />
                    <span>
                      A Spirit-Filled Family · Rooted in God&apos;s Wisdom
                    </span>
                  </div>
                </div>
              </div>
            }
            actions={
              <>
                <CtaLink href="/about" variant="dark">
                  {HOME_COPY.actions.discoverStory}
                </CtaLink>
                <CommunityJoinTrigger icon={false}>
                  {HOME_COPY.actions.joinCommunity}
                </CommunityJoinTrigger>
              </>
            }
          />
        </Container>
      </Section>

      {/* ── 3. Identity & Pillars Section: Deep Obsidian Nebula ─────────────── */}
      <Section
        id="identity"
        tone="dark"
        className="relative bg-[radial-gradient(ellipse_75%_55%_at_50%_25%,color-mix(in_srgb,var(--app-primary)_14%,transparent)_0%,transparent_70%),var(--app-dark)] py-20 sm:py-32"
      >
        <Container className="relative z-10">
          <SectionHeader
            eyebrow={HOME_COPY.identity.eyebrow}
            title={HOME_COPY.identity.title}
            accent={HOME_COPY.identity.accent}
            description={HOME_COPY.identity.description}
            tone="dark"
            size="lg"
            className="max-w-5xl"
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
            {HOME_BELIEFS.map((belief, index) => (
              <article
                key={belief.title}
                tabIndex={0}
                data-gsap="reveal"
                aria-labelledby={`belief-${index}`}
                className={`group relative isolate min-h-[24rem] overflow-hidden rounded-3xl border border-white/10 bg-[var(--app-dark-2)] outline-none ring-[var(--app-primary)] transition-all duration-500 hover:scale-[1.015] hover:border-[var(--app-primary)]/50 hover:shadow-2xl hover:shadow-black/70 sm:min-h-0 ${belief.layoutClass} lg:h-[clamp(26rem,35vw,39rem)]`}
              >
                <div
                  data-parallax-global={belief.parallaxDepth}
                  className="absolute inset-x-0 -inset-y-[6%]"
                >
                  <Image
                    src={belief.image}
                    alt={belief.imageAlt}
                    fill
                    unoptimized={false}
                    quality={IMAGE_QUALITY}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 58vw"
                    className={`object-cover ${belief.imagePosition} transition-transform duration-700 ease-out md:group-hover:scale-105`}
                  />
                </div>

                {/* High-Definition Contrast Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500" />

                {/* Card Text Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                  <h3
                    id={`belief-${index}`}
                    className="font-headline text-heading-lg font-semibold !text-white"
                  >
                    {belief.title}
                  </h3>
                  <p className="mt-3 max-w-md font-ui text-body-md leading-relaxed text-[var(--app-on-dark)]/85">
                    {belief.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 4. Sunday Service Section: Sanctuary Experience (Living Video Canvas) ── */}
      <Section
        id="service"
        tone="dark"
        className="relative overflow-hidden bg-[var(--app-dark)] py-20 sm:py-32"
      >
        {/* Living Video Canvas Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
        >
          <div className="service-video-canvas will-change-transform">
            <Image
              src={HOME_IMAGES.service.desktopSrc}
              alt="Wisdom Church Sunday Service sanctuary atmosphere"
              fill
              quality={IMAGE_QUALITY}
              sizes="100vw"
              className="h-full w-full object-cover object-center opacity-30"
            />
            {/* Atmospheric Sanctuary Stage Lighting Sweep */}
            <div className="hero-video-light-beam opacity-60" />
            {/* Volumetric Stage Flare */}
            <div className="hero-stage-flare opacity-50" />
            {/* Filmic Dust Shimmer */}
            <div className="hero-filmic-dust opacity-35" />
          </div>
        </div>

        {/* Deep Contrast Scrims for HD Readability */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--app-dark)_85%,transparent)_0%,var(--app-dark)_95%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--app-dark)_0%,color-mix(in_srgb,var(--app-dark)_70%,transparent)_35%,color-mix(in_srgb,var(--app-dark)_85%,transparent)_75%,var(--app-dark)_100%)]"
        />

        <Container className="relative z-10">
          <SplitFeature
            reverse
            media={
              <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/20 bg-black/60 shadow-2xl backdrop-blur-md sm:aspect-[16/11]">
                <Image
                  src={HOME_IMAGES.service.desktopSrc}
                  alt={HOME_IMAGES.service.alt}
                  fill
                  unoptimized
                  quality={IMAGE_QUALITY}
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/75 px-4 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-[var(--status-success)] animate-pulse" />
                    <span>Sundays at 9:00 AM (WAT)</span>
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                  <div className="rounded-2xl border border-white/15 bg-black/70 p-4 text-xs text-white/90 shadow-lg backdrop-blur-md">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--app-primary-light)]">
                      Experience God&apos;s Presence
                    </p>
                    <p className="mt-1 font-medium leading-relaxed">
                      Uplifting worship, sound prophetic teaching, and warm
                      fellowship await you.
                    </p>
                  </div>
                </div>
              </div>
            }
            text={
              <>
                <SectionHeader
                  eyebrow={HOME_COPY.service.eyebrow}
                  title={HOME_COPY.service.title}
                  accent={HOME_COPY.service.accent}
                  tone="dark"
                />

                <div className="mt-8 rounded-3xl border border-white/15 bg-black/60 p-6 shadow-2xl backdrop-blur-xl font-ui sm:p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-primary-20)] text-[var(--app-primary-light)]">
                        <CalendarDays className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--app-primary-light)]">
                          Weekly Service Times
                        </p>
                        <p className="mt-0.5 text-lg font-bold text-white sm:text-xl">
                          {SERVICE_INFO.sunday.day}s at{' '}
                          {SERVICE_INFO.sunday.time} (
                          {SERVICE_INFO.sunday.timezone})
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--app-on-dark)]/80">
                          Sunday Worship Service · In-Person &amp; Streaming
                          Live
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 border-t border-white/10 pt-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-primary-20)] text-[var(--app-primary-light)]">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--app-primary-light)]">
                          Sanctuary Location
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-white sm:text-base leading-snug">
                          {SERVICE_INFO.venue.full}
                        </p>
                        <p className="mt-1 text-xs text-[var(--app-on-dark)]/75">
                          Easy access, ample parking, and fully air-conditioned
                          sanctuary
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                    <span className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-[var(--app-on-dark)] shadow-xs">
                      ✓ Free Secure Parking
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-[var(--app-on-dark)] shadow-xs">
                      ✓ Kingdom Kids Church
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-[var(--app-on-dark)] shadow-xs">
                      ✓ Warm Hospitality
                    </span>
                  </div>
                </div>
              </>
            }
            actions={
              <>
                <TakeMeToChurchButton />
                <PlanVisitTrigger icon={false} variant="outline">
                  {HOME_COPY.actions.planFirstVisit}
                </PlanVisitTrigger>
              </>
            }
          />
        </Container>
      </Section>

      {/* ── 5. Pastoral Section: Regal Obsidian Velvet & Gold Aura ──────────── */}
      <Section
        id="pastoral"
        tone="dark"
        className="relative bg-[radial-gradient(circle_at_35%_45%,color-mix(in_srgb,var(--app-primary)_18%,transparent)_0%,transparent_65%),var(--app-dark-3)] py-20 sm:py-28"
      >
        <Container>
          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div className="tone-dark relative flex justify-center overflow-hidden rounded-3xl border border-white/10 bg-[var(--app-dark)] p-4 shadow-2xl sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,var(--app-primary-20)_0%,transparent_70%)]"
              />
              <Image
                src={HOME_IMAGES.pastor.src}
                alt={HOME_IMAGES.pastor.alt}
                width={792}
                height={963}
                sizes="(max-width: 1023px) 20rem, 38vw"
                quality={IMAGE_QUALITY}
                className="relative h-auto w-full max-w-[20rem] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02] lg:max-w-none"
              />
              <div className="absolute inset-x-5 bottom-5 text-center">
                <span className="inline-block rounded-full border border-white/15 bg-black/75 px-4 py-1.5 text-xs font-bold text-[var(--app-primary-light)] shadow-lg backdrop-blur-md">
                  Bishop Gabriel Ayilara · Senior Pastor
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <SectionHeader
                eyebrow={HOME_COPY.pastor.eyebrow}
                title={HOME_COPY.pastor.title}
                accent={HOME_COPY.pastor.accent}
                description={HOME_COPY.pastor.description}
                tone="dark"
                reveal={false}
              />

              <blockquote className="border-l-2 border-[var(--app-primary)] pl-5 font-headline text-lg italic leading-relaxed text-[var(--app-on-dark)] sm:text-xl">
                &quot;Our mandate is to raise complete believers equipped with
                the wisdom that produces undeniable results in every sphere of
                life.&quot;
              </blockquote>

              <div className="pt-2">
                <CtaLink href="/leadership" variant="primary">
                  {HOME_COPY.actions.meetLeadership}
                </CtaLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 6. Life at Wisdom Church / Community Gallery ─────────────────────── */}
      <Section
        id="community"
        tone="canvas"
        className="relative bg-[radial-gradient(ellipse_70%_50%_at_50%_15%,color-mix(in_srgb,var(--app-primary-10)_50%,transparent)_0%,transparent_60%),var(--app-canvas)] py-20 sm:py-28"
      >
        <Container>
          <Split reverse>
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <Figure
                src={HOME_COMMUNITY_GALLERY[0].src}
                alt={HOME_COMMUNITY_GALLERY[0].alt}
                fill
                unoptimized={HOME_COMMUNITY_GALLERY[0].unoptimized}
                sizes="(max-width: 1023px) 50vw, 25vw"
                className="aspect-[4/5] rounded-3xl border border-[var(--app-border)] shadow-md"
                imageClassName={HOME_COMMUNITY_GALLERY[0].position}
              />
              <div className="grid gap-4 pt-8 sm:gap-5 sm:pt-12">
                <Figure
                  src={HOME_COMMUNITY_GALLERY[1].src}
                  alt={HOME_COMMUNITY_GALLERY[1].alt}
                  fill
                  unoptimized={HOME_COMMUNITY_GALLERY[1].unoptimized}
                  sizes="(max-width: 1023px) 50vw, 25vw"
                  className="aspect-square rounded-3xl border border-[var(--app-border)] shadow-md"
                  imageClassName={HOME_COMMUNITY_GALLERY[1].position}
                />
                <Figure
                  src={HOME_COMMUNITY_GALLERY[2].src}
                  alt={HOME_COMMUNITY_GALLERY[2].alt}
                  fill
                  unoptimized={HOME_COMMUNITY_GALLERY[2].unoptimized}
                  sizes="(max-width: 1023px) 50vw, 25vw"
                  className="aspect-square rounded-3xl border border-[var(--app-border)] shadow-md"
                  imageClassName={HOME_COMMUNITY_GALLERY[2].position}
                />
              </div>
            </div>

            <div className="space-y-6">
              <SectionHeader
                eyebrow={HOME_COPY.community.eyebrow}
                title={HOME_COPY.community.title}
                accent={HOME_COPY.community.accent}
                description={HOME_COPY.community.description}
              />

              <div className="space-y-3 font-ui text-sm text-[var(--app-muted)]">
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-primary)]" />
                  <span>
                    Active Men&apos;s, Women&apos;s, and Youth Fellowships
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-primary)]" />
                  <span>Nurturing Kingdom Kids church for our children</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-primary)]" />
                  <span>
                    Meaningful service opportunities across ministry departments
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <ConnectCommunityCta label={HOME_COPY.actions.connect} />
              </div>
            </div>
          </Split>
        </Container>
      </Section>

      {/* ── 7. Cell Fellowship Section: Elevated Obsidian Cards ─────────────── */}
      <Section
        id="cell-fellowship"
        tone="dark"
        className="relative bg-[radial-gradient(ellipse_70%_50%_at_50%_60%,color-mix(in_srgb,var(--app-primary-10)_60%,transparent)_0%,transparent_65%),var(--app-dark)] py-20 sm:py-28"
      >
        <Container>
          <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-x-16 lg:gap-y-14">
            <SectionHeader
              eyebrow={HOME_COPY.cellFellowship.eyebrow}
              title={HOME_COPY.cellFellowship.title}
              accent={HOME_COPY.cellFellowship.accent}
              description={HOME_COPY.cellFellowship.description}
              tone="dark"
              className="order-1 lg:order-none"
            />

            <div className="order-2 grid gap-5 sm:grid-cols-3 lg:order-none lg:col-span-2">
              {HOME_COPY.cellFellowship.points.map(point => (
                <article
                  key={point.title}
                  data-gsap="reveal"
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--app-primary)]/50 hover:bg-white/[0.06]"
                >
                  <span
                    className="block h-[1.5px] w-8 bg-[color-mix(in_srgb,var(--app-primary)_70%,transparent)] transition-all duration-300 group-hover:w-12 group-hover:bg-[var(--app-primary)]"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-ui text-heading-sm font-semibold text-white">
                    {point.title}
                  </h3>
                  <p className="mt-2.5 font-ui text-body-sm leading-relaxed text-[var(--app-on-dark)]/80">
                    {point.body}
                  </p>
                </article>
              ))}
            </div>

            <div className="order-3 lg:order-none lg:shrink-0">
              <CellFellowshipCta label="Join a Cell Fellowship" />
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
