import Image from 'next/image';
import { CalendarDays, MapPin, Play, Users } from 'lucide-react';

import { HOME_BELIEFS, HOME_COPY, HOME_IMAGES } from '@/features/home/content';
import CommunityJoinTrigger from '@/features/community/CommunityJoinTrigger';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import SiteHero from '@/features/hero/SiteHero';
import TakeMeToChurchButton from '@/features/navigation/TakeMeToChurchButton';
import { IMAGE_QUALITY } from '@/shared/constants';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import {
  EditorialContainer,
  EditorialHeader,
  EditorialImage,
  EditorialLink,
  EditorialSection,
  EditorialSplit,
  editorialActionClass,
} from '@/shared/ui/editorial';
import { ScrollFadeIn } from '@/shared/ui/motion';

export default function PremiumHome() {
  return (
    <main className="bg-[var(--app-surface)] text-[var(--app-ink)]">
      <SiteHero
        size="home"
        align="center"
        priority
        eyebrow={HOME_COPY.hero.eyebrow}
        title={`${HOME_COPY.hero.titleLead}${HOME_COPY.hero.titleAccent}${HOME_COPY.hero.titleTail}`}
        subtitle={HOME_COPY.hero.description}
        backgroundImage={HOME_IMAGES.hero.src}
        imagePositionClassName={HOME_IMAGES.hero.position}
        actions={
          <>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noreferrer"
              className={editorialActionClass.primary}
            >
              <Play className="mr-2 h-4 w-4 fill-current" /> Watch live
            </a>
            <PlanVisitTrigger className={editorialActionClass.outline}>
              Plan your visit
            </PlanVisitTrigger>
          </>
        }
      />

      <EditorialSection>
        <EditorialContainer>
          <EditorialSplit>
            <div>
              <EditorialHeader
                eyebrow="Welcome home"
                title={`${HOME_COPY.welcome.title} ${HOME_COPY.welcome.accent}`}
                description={HOME_COPY.welcome.description}
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <EditorialLink href="/about" variant="dark">
                  Discover our story
                </EditorialLink>
                <CommunityJoinTrigger
                  icon={false}
                  className={editorialActionClass.outline}
                >
                  Join our community
                </CommunityJoinTrigger>
              </div>
            </div>
            <EditorialImage
              src={HOME_IMAGES.welcome.src}
              alt={HOME_IMAGES.welcome.alt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="aspect-[4/3] sm:aspect-[16/11]"
              imageClassName={HOME_IMAGES.welcome.position}
            />
          </EditorialSplit>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="canvas">
        <EditorialContainer>
          <EditorialHeader
            eyebrow={HOME_COPY.identity.eyebrow}
            title={`${HOME_COPY.identity.title} ${HOME_COPY.identity.accent}`}
            description={HOME_COPY.identity.description}
            className="max-w-4xl"
          />
          <div className="mt-12 border-y border-[var(--app-border)]">
            {HOME_BELIEFS.map((belief, index) => (
              <ScrollFadeIn key={belief.title} delay={index * 0.04}>
                <article className="grid gap-6 border-b border-[var(--app-border)] py-8 last:border-b-0 md:grid-cols-[10rem_minmax(0,0.7fr)_minmax(0,1fr)] md:items-center md:gap-10">
                  <EditorialImage
                    src={belief.image}
                    alt={belief.imageAlt}
                    fill
                    sizes="(max-width: 767px) 100vw, 10rem"
                    className="aspect-[4/3] md:aspect-square"
                    imageClassName={belief.imagePosition}
                    unoptimized={belief.image === '/Picflow/DSC06902 copy.webp'}
                  />
                  <h3 className="font-headline text-heading-lg font-semibold">
                    {belief.title}
                  </h3>
                  <p className="max-w-xl font-ui text-body-lg leading-loose text-[var(--app-ink)]/65">
                    {belief.body}
                  </p>
                </article>
              </ScrollFadeIn>
            ))}
          </div>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection>
        <EditorialContainer>
          <EditorialSplit reverse>
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
              <EditorialHeader
                eyebrow={HOME_COPY.service.eyebrow}
                title={HOME_COPY.service.title}
              />
              <div className="mt-8 space-y-5 border-y border-[var(--app-border)] py-6 font-ui text-body-md">
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
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <TakeMeToChurchButton />
                <PlanVisitTrigger
                  icon={false}
                  className={editorialActionClass.outline}
                >
                  Plan your first visit
                </PlanVisitTrigger>
              </div>
            </div>
          </EditorialSplit>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="canvas">
        <EditorialContainer>
          <EditorialSplit>
            <EditorialImage
              src={HOME_IMAGES.pastor.src}
              alt={HOME_IMAGES.pastor.alt}
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="aspect-[4/5] sm:aspect-[5/4]"
              imageClassName="object-top"
            />
            <div>
              <EditorialHeader
                eyebrow={HOME_COPY.pastor.eyebrow}
                title={HOME_COPY.pastor.title}
                description={HOME_COPY.pastor.description}
              />
              <EditorialLink href="/leadership" variant="dark" className="mt-8">
                Meet our leadership
              </EditorialLink>
            </div>
          </EditorialSplit>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection>
        <EditorialContainer>
          <EditorialSplit reverse>
            <div className="grid grid-cols-2 gap-3">
              <EditorialImage
                src="/Picflow/DSC00054 copy.webp"
                alt="A mother and child at The Wisdom Church"
                fill
                unoptimized
                sizes="(max-width: 1023px) 50vw, 25vw"
                className="aspect-[4/5]"
                imageClassName="object-[center_32%]"
              />
              <div className="grid gap-3 pt-10">
                <EditorialImage
                  src="/images/worship-service-community-generated-v3.png"
                  alt="Worshippers sharing a service"
                  fill
                  sizes="(max-width: 1023px) 50vw, 25vw"
                  className="aspect-square"
                />
                <EditorialImage
                  src="/Picflow/DSC00268 copy.webp"
                  alt="A volunteer serving during worship"
                  fill
                  sizes="(max-width: 1023px) 50vw, 25vw"
                  className="aspect-square"
                  imageClassName="object-[52%_center]"
                />
              </div>
            </div>
            <div>
              <EditorialHeader
                eyebrow={HOME_COPY.community.eyebrow}
                title={HOME_COPY.community.title}
                description={HOME_COPY.community.description}
              />
              <EditorialLink href="/contact" variant="dark" className="mt-8">
                <Users className="mr-2 h-4 w-4" /> Connect with us
              </EditorialLink>
            </div>
          </EditorialSplit>
        </EditorialContainer>
      </EditorialSection>
    </main>
  );
}
