import Image from 'next/image';
import { CalendarDays, MapPin, Play, Users } from 'lucide-react';

import {
  HOME_BELIEFS,
  HOME_COMMUNITY_GALLERY,
  HOME_COPY,
  HOME_IMAGES,
} from '@/features/home/content';
import CommunityJoinTrigger from '@/features/community/CommunityJoinTrigger';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import SiteHero from '@/features/hero/SiteHero';
import TakeMeToChurchButton from '@/features/navigation/TakeMeToChurchButton';
import { IMAGE_QUALITY } from '@/shared/constants';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import {
  Container,
  Page,
  SectionHeader,
  Figure,
  CtaLink,
  Section,
  Split,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';

export default function PremiumHome() {
  return (
    <Page tone="surface">
      <SiteHero
        size="home"
        align="center"
        priority
        title={`${HOME_COPY.hero.titleLead}${HOME_COPY.hero.titleAccent}${HOME_COPY.hero.titleTail}`}
        titleLines={[
          `${HOME_COPY.hero.titleLead}${HOME_COPY.hero.titleAccent}`.trim(),
          HOME_COPY.hero.titleTail.trim(),
        ]}
        highlightSecondLine
        subtitle={HOME_COPY.hero.description}
        backgroundImage={HOME_IMAGES.hero.src}
        imagePositionClassName={HOME_IMAGES.hero.position}
        actions={
          <>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noreferrer"
              className={buttonClass('primary', 'lg')}
            >
              <Play className="mr-2 h-4 w-4 fill-current" />{' '}
              {HOME_COPY.actions.watchLive}
            </a>
            <PlanVisitTrigger variant="outline" size="lg">
              {HOME_COPY.actions.planVisit}
            </PlanVisitTrigger>
          </>
        }
      />

      <Section>
        <Container>
          <Split>
            <div>
              <SectionHeader
                eyebrow={HOME_COPY.welcome.eyebrow}
                title={HOME_COPY.welcome.title}
                accent={HOME_COPY.welcome.accent}
                description={HOME_COPY.welcome.description}
              />
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <CtaLink href="/about" variant="dark">
                  {HOME_COPY.actions.discoverStory}
                </CtaLink>
                <CommunityJoinTrigger icon={false}>
                  {HOME_COPY.actions.joinCommunity}
                </CommunityJoinTrigger>
              </div>
            </div>
            <Figure
              parallax
              src={HOME_IMAGES.welcome.src}
              alt={HOME_IMAGES.welcome.alt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="aspect-[4/3] sm:aspect-[16/11]"
              imageClassName={HOME_IMAGES.welcome.position}
            />
          </Split>
        </Container>
      </Section>

      <Section tone="dark" className="bg-[var(--app-dark-2)]">
        <Container>
          <SectionHeader
            eyebrow={HOME_COPY.identity.eyebrow}
            title={HOME_COPY.identity.title}
            accent={HOME_COPY.identity.accent}
            description={HOME_COPY.identity.description}
            tone="dark"
            size="lg"
            className="max-w-5xl"
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
            {HOME_BELIEFS.map((belief, index) => (
              <article
                key={belief.title}
                tabIndex={0}
                data-gsap="reveal"
                aria-labelledby={`belief-${index}`}
                className={`group relative isolate min-h-[22rem] overflow-hidden rounded-image bg-[var(--app-surface)] outline-none ring-[var(--app-primary)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--app-dark-2)] sm:min-h-0 ${belief.layoutClass} lg:h-[clamp(25rem,34vw,38rem)]`}
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
                    className={`object-cover ${belief.imagePosition} transition-transform duration-700 ease-out motion-reduce:transition-none md:group-hover:scale-[1.035] md:group-focus:scale-[1.035]`}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-100 transition-opacity duration-500 motion-reduce:transition-none md:opacity-0 md:group-hover:opacity-100 md:group-focus:opacity-100" />

                <div className="absolute inset-x-0 bottom-0 p-6 opacity-100 transition-all duration-500 ease-out motion-reduce:transition-none sm:p-8 md:translate-y-5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus:translate-y-0 md:group-focus:opacity-100 lg:p-10">
                  <div>
                    <h3
                      id={`belief-${index}`}
                      className="font-headline text-heading-lg font-semibold !text-white"
                    >
                      {belief.title}
                    </h3>
                    <p className="mt-3 max-w-md font-ui text-body-md leading-relaxed text-[var(--app-muted)]">
                      {belief.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Split reverse>
            <div className="relative aspect-[4/3] overflow-hidden rounded-image bg-[var(--app-surface-2)] sm:aspect-[16/11]">
              <Image
                src={HOME_IMAGES.service.desktopSrc}
                alt={HOME_IMAGES.service.alt}
                fill
                unoptimized
                quality={IMAGE_QUALITY}
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div>
              <SectionHeader
                eyebrow={HOME_COPY.service.eyebrow}
                title={HOME_COPY.service.title}
                accent={HOME_COPY.service.accent}
              />
              <div className="mt-10 space-y-5 border-y border-[var(--app-border)] py-7 font-ui text-body-md">
                <p className="flex items-center gap-4">
                  <CalendarDays className="h-5 w-5 text-[var(--app-primary-dark)]" />
                  <strong>
                    {SERVICE_INFO.sunday.day} · {SERVICE_INFO.sunday.time}{' '}
                    {SERVICE_INFO.sunday.timezone}
                  </strong>
                </p>
                <p className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-[var(--app-primary-dark)]" />
                  <strong>{SERVICE_INFO.venue.full}</strong>
                </p>
              </div>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <TakeMeToChurchButton />
                <PlanVisitTrigger icon={false} variant="outline">
                  {HOME_COPY.actions.planFirstVisit}
                </PlanVisitTrigger>
              </div>
            </div>
          </Split>
        </Container>
      </Section>

      <Section tone="canvas">
        <Container>
          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
            {/* The Bishop image is a transparent cut-out, so it sits on the
                dark panel it was shot for rather than in a cropped frame —
                no seam, nothing clipped, at any width. */}
            <div className="tone-dark relative flex justify-center overflow-hidden rounded-image bg-[var(--app-dark)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_55%_at_50%_22%,var(--app-primary-20),transparent_70%)]"
              />
              <Image
                src={HOME_IMAGES.pastor.src}
                alt={HOME_IMAGES.pastor.alt}
                width={792}
                height={963}
                sizes="(max-width: 1023px) 20rem, 38vw"
                quality={IMAGE_QUALITY}
                className="relative h-auto w-full max-w-[20rem] object-contain lg:max-w-none"
              />
            </div>

            <div>
              <SectionHeader
                eyebrow={HOME_COPY.pastor.eyebrow}
                title={HOME_COPY.pastor.title}
                accent={HOME_COPY.pastor.accent}
                description={HOME_COPY.pastor.description}
                reveal={false}
              />
              <CtaLink href="/leadership" variant="dark" className="mt-8">
                {HOME_COPY.actions.meetLeadership}
              </CtaLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Split reverse>
            <div className="grid grid-cols-2 gap-5">
              <Figure
                src={HOME_COMMUNITY_GALLERY[0].src}
                alt={HOME_COMMUNITY_GALLERY[0].alt}
                fill
                unoptimized={HOME_COMMUNITY_GALLERY[0].unoptimized}
                sizes="(max-width: 1023px) 50vw, 25vw"
                className="aspect-[4/5]"
                imageClassName={HOME_COMMUNITY_GALLERY[0].position}
              />
              <div className="grid gap-5 pt-12">
                <Figure
                  src={HOME_COMMUNITY_GALLERY[1].src}
                  alt={HOME_COMMUNITY_GALLERY[1].alt}
                  fill
                  unoptimized={HOME_COMMUNITY_GALLERY[1].unoptimized}
                  sizes="(max-width: 1023px) 50vw, 25vw"
                  className="aspect-square"
                  imageClassName={HOME_COMMUNITY_GALLERY[1].position}
                />
                <Figure
                  src={HOME_COMMUNITY_GALLERY[2].src}
                  alt={HOME_COMMUNITY_GALLERY[2].alt}
                  fill
                  unoptimized={HOME_COMMUNITY_GALLERY[2].unoptimized}
                  sizes="(max-width: 1023px) 50vw, 25vw"
                  className="aspect-square"
                  imageClassName={HOME_COMMUNITY_GALLERY[2].position}
                />
              </div>
            </div>
            <div>
              <SectionHeader
                eyebrow={HOME_COPY.community.eyebrow}
                title={HOME_COPY.community.title}
                accent={HOME_COPY.community.accent}
                description={HOME_COPY.community.description}
              />
              <CtaLink href="/contact" variant="dark" className="mt-10">
                <Users className="mr-2 h-4 w-4" /> {HOME_COPY.actions.connect}
              </CtaLink>
            </div>
          </Split>
        </Container>
      </Section>
    </Page>
  );
}
