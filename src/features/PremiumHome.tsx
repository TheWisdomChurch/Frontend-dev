'use client';

import Image from 'next/image';
import { CalendarDays, MapPin, Play, Users } from 'lucide-react';

import { IMAGE_QUALITY } from '@/shared/constants';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { Container, Section } from '@/shared/layout';
import HomeActionLink from '@/features/home/HomeActionLink';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import CommunityJoinTrigger from '@/features/community/CommunityJoinTrigger';
import TakeMeToChurchButton from '@/features/navigation/TakeMeToChurchButton';
import { HOME_BELIEFS, HOME_COPY, HOME_IMAGES } from '@/features/home/content';
import { SectionHeading, HeadingAccent } from '@/shared/ui/SectionHeading';
import { motion } from '@/lib/safe-motion';
import { useReducedMotion } from 'framer-motion';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion/staggerReveal';

const eyebrowClass = 'font-ui text-xs font-bold uppercase tracking-[0.22em]';
const displayClass =
  'font-sans font-black uppercase leading-[0.92] tracking-[-0.045em]';
// Shared horizontal rhythm for every split text/image panel below, so the
// left-column inset can't quietly drift out of sync between sections.
const panelPaddingX = 'px-6 sm:px-10 lg:px-16 xl:px-24';

// Matches each section's actual rendered column width so the browser
// fetches an image sized for what's on screen, not a full viewport-wide
// image for a half-width column.
const COVER_IMAGE_SIZES: Record<keyof typeof HOME_IMAGES, string> = {
  hero: '100vw',
  welcome: '(min-width: 1024px) 55vw, 100vw',
  service: '(min-width: 1024px) 50vw, 100vw',
  pastor: '(min-width: 1024px) 50vw, 100vw',
  community: '(min-width: 1024px) 62vw, 100vw',
};

function CoverImage({
  name,
  priority = false,
  loading,
}: {
  name: keyof typeof HOME_IMAGES;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}) {
  const image = HOME_IMAGES[name];
  const isCommunityImage = name === 'community';
  const isContain = 'fit' in image && image.fit === 'contain';
  const parallaxDepth =
    name === 'hero' ? '0.16' : name === 'service' ? '0.12' : '0.09';
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      priority={priority}
      loading={priority ? undefined : loading}
      quality={IMAGE_QUALITY}
      sizes={COVER_IMAGE_SIZES[name]}
      data-parallax-global={isCommunityImage ? undefined : parallaxDepth}
      className={`${isCommunityImage || isContain ? '' : 'scale-[1.06]'} ${isContain ? 'object-contain' : 'object-cover'} ${image.position}`}
    />
  );
}

function ServiceImage() {
  const image = HOME_IMAGES.service;

  return (
    <>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        quality={IMAGE_QUALITY}
        sizes="(min-width: 640px) 1px, 100vw"
        className={`object-cover sm:hidden ${image.position}`}
      />
      <Image
        src={image.desktopSrc}
        alt={image.alt}
        fill
        quality={IMAGE_QUALITY}
        sizes={COVER_IMAGE_SIZES.service}
        data-parallax-global="0.08"
        className="hidden object-cover object-[58%_center] sm:block"
      />
    </>
  );
}

function CommunityCollage() {
  const reduceMotion = useReducedMotion();
  const reveal = (delay: number, x = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24, x, scale: 0.975 },
    whileInView: { opacity: 1, y: 0, x: 0, scale: 1 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      delay: reduceMotion ? 0 : delay,
      duration: reduceMotion ? 0 : 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
    whileHover: reduceMotion ? undefined : { y: -5, scale: 1.008 },
  });

  return (
    <div className="grid grid-cols-2 items-stretch gap-2 sm:grid-cols-12 sm:grid-rows-2 sm:gap-3">
      <motion.div
        {...reveal(0)}
        className="group relative col-span-2 min-h-[260px] overflow-hidden bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:col-span-7 sm:row-span-2 sm:h-full sm:min-h-0"
      >
        <Image
          src="/Picflow/DSC00054 copy.webp"
          alt="A mother and child sharing life at The Wisdom Church"
          fill
          quality={IMAGE_QUALITY}
          sizes="(min-width: 1024px) 38vw, (min-width: 640px) 58vw, 100vw"
          className="object-cover object-[center_32%] transition-transform duration-1000 ease-out motion-reduce:transition-none group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/[0.035]" />
      </motion.div>

      <motion.div
        {...reveal(0.1, 18)}
        className="group relative aspect-[5/4] w-full overflow-hidden bg-[#15121b] shadow-[0_20px_55px_rgba(0,0,0,.3)] sm:col-span-5"
      >
        <Image
          src="/images/worship-service-community-generated-v3.png"
          alt="Worshippers sharing a service at The Wisdom Church"
          fill
          quality={IMAGE_QUALITY}
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 42vw, 50vw"
          className="object-cover object-center transition-transform duration-1000 ease-out motion-reduce:transition-none group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/12 via-transparent to-[var(--app-primary)]/[0.06]" />
        <div className="pointer-events-none absolute inset-y-0 -left-1/2 z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0 transition-all duration-1000 motion-reduce:hidden group-hover:left-[120%] group-hover:opacity-100" />
      </motion.div>

      <motion.div
        {...reveal(0.18, 18)}
        className="group relative aspect-[5/4] w-full overflow-hidden bg-white/5 shadow-[0_20px_55px_rgba(0,0,0,.3)] sm:col-span-5"
      >
        <Image
          src="/Picflow/DSC00268 copy.webp"
          alt="A Wisdom Church volunteer serving during worship"
          fill
          quality={IMAGE_QUALITY}
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 42vw, 50vw"
          className="object-cover object-[52%_center] transition-transform duration-1000 ease-out motion-reduce:transition-none group-hover:scale-[1.035]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/[0.035]" />
      </motion.div>
    </div>
  );
}

function SundayExperienceSection() {
  const expectations = [
    {
      title: 'A warm welcome',
      body: 'Our welcome team will help you settle in and answer questions when you arrive.',
    },
    {
      title: 'Worship and the Word',
      body: 'Expect heartfelt worship and practical biblical teaching for everyday life.',
    },
    {
      title: 'Room for your family',
      body: 'Bringing children? Our team will guide your family to the right place on arrival.',
    },
  ] as const;

  return (
    <Section
      id="visit"
      padding="none"
      className="bg-[var(--app-primary)] scroll-mt-20"
    >
      <div className="grid lg:min-h-[620px] lg:grid-cols-2 xl:min-h-[720px]">
        <div className="group relative min-h-[min(125vw,600px)] overflow-hidden bg-black lg:order-2 lg:min-h-full">
          <ServiceImage />
        </div>
        <div className={`flex items-center ${panelPaddingX} py-16 sm:py-20`}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={staggerViewport}
            className="max-w-xl"
          >
            <motion.p variants={staggerItem} className={eyebrowClass}>
              Your first Sunday
            </motion.p>
            <SectionHeading tone="dark" className="mt-5">
              {HOME_COPY.service.title}
            </SectionHeading>
            <motion.p
              variants={staggerItem}
              className="mt-6 font-ui text-base leading-8 text-black/65 sm:text-lg"
            >
              {HOME_COPY.service.description}
            </motion.p>

            <motion.div
              variants={staggerContainer}
              className="mt-7 grid gap-2 sm:grid-cols-3"
            >
              {expectations.map(item => (
                <motion.div
                  key={item.title}
                  variants={staggerItem}
                  className="border border-black/15 bg-black/[0.045] p-4"
                >
                  <strong className="font-ui text-sm text-black">
                    {item.title}
                  </strong>
                  <p className="mt-2 font-ui text-xs leading-5 text-black/60">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="mt-7 space-y-4 border-y border-black/25 py-5 font-ui"
            >
              <div className="flex items-center gap-4">
                <CalendarDays className="h-5 w-5" />
                <strong>
                  {SERVICE_INFO.sunday.day} · {SERVICE_INFO.sunday.time}{' '}
                  {SERVICE_INFO.sunday.timezone}
                </strong>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                <strong>{SERVICE_INFO.venue.full}</strong>
              </div>
            </motion.div>
            <motion.div
              variants={staggerItem}
              className="mt-7 grid grid-cols-1 items-stretch gap-3 min-[420px]:grid-cols-2"
            >
              <PlanVisitTrigger
                icon={false}
                className="h-full min-w-0 whitespace-normal border-black bg-black px-4 py-3 text-center text-xs leading-5 text-white hover:border-white hover:bg-white hover:text-black sm:px-5 sm:text-sm"
              >
                Plan your first visit
              </PlanVisitTrigger>
              <TakeMeToChurchButton fullWidth />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

export default function PremiumHome() {
  return (
    <div className="premium-home bg-white text-[var(--app-ink)]">
      <Section padding="none" className="min-h-[100svh] bg-black text-white">
        <CoverImage name="hero" priority />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.52)_0%,rgba(0,0,0,.16)_35%,rgba(0,0,0,.84)_100%)]" />
        <Container
          size="2xl"
          className="relative flex min-h-[100svh] flex-col items-center justify-center pb-12 pt-40 text-center sm:pt-44 lg:pt-48"
        >
          <div data-gsap="reveal" className="flex flex-col items-center">
            <p className="mb-4 font-ui text-sm font-bold uppercase tracking-[0.28em] text-[var(--app-primary-light)] sm:text-base">
              {HOME_COPY.hero.eyebrow}
            </p>
            <div className="mb-6 h-px w-14 bg-[var(--app-primary-light)]/60" />
            <h1
              className={`${displayClass} mx-auto max-w-[1050px] text-[clamp(2rem,8vw,6.2rem)] text-white`}
            >
              {HOME_COPY.hero.titleLead}
              <em className="italic">{HOME_COPY.hero.titleAccent}</em>
              {HOME_COPY.hero.titleTail}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-ui text-base leading-7 text-white/80 sm:text-lg">
              {HOME_COPY.hero.description}
            </p>
            <div className="mt-8 flex w-full max-w-sm flex-nowrap items-stretch justify-center gap-2 sm:max-w-none sm:gap-3">
              <PlanVisitTrigger className="min-w-0 flex-1 px-4 text-xs sm:flex-none sm:px-6 sm:text-sm">
                Plan your visit
              </PlanVisitTrigger>
              <HomeActionLink
                href={SOCIAL_LINKS.youtube}
                external
                variant="light"
                icon={Play}
                iconClassName="fill-current"
                hideArrow
                className="flex-1 min-w-0 justify-center px-4 text-xs sm:flex-none sm:px-6 sm:text-sm"
              >
                Watch online
              </HomeActionLink>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-white/18 pt-5 font-ui text-xs font-semibold uppercase tracking-[0.12em] text-white/72 sm:text-sm">
              <span>
                {SERVICE_INFO.sunday.day} · {SERVICE_INFO.sunday.time}{' '}
                {SERVICE_INFO.sunday.timezone}
              </span>
              <span
                className="hidden h-1 w-1 rounded-full bg-[var(--app-primary)] sm:block"
                aria-hidden="true"
              />
              <span>{SERVICE_INFO.venue.short}</span>
            </div>
          </div>
        </Container>
      </Section>

      <SundayExperienceSection />

      <Section padding="none" className="bg-white">
        <div className="grid lg:min-h-[560px] lg:grid-cols-[1fr_1.2fr]">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={staggerViewport}
            className={`flex flex-col justify-center ${panelPaddingX} py-16 sm:py-20 lg:py-24`}
          >
            <div className="max-w-xl">
              <SectionHeading tone="dark" className="mt-5">
                {HOME_COPY.welcome.title}
                <span className="block text-[var(--app-primary-dark)]">
                  {HOME_COPY.welcome.accent}
                </span>
              </SectionHeading>
              <motion.p
                variants={staggerItem}
                className="mt-7 font-ui text-base leading-8 text-black/60 sm:text-lg"
              >
                {HOME_COPY.welcome.description}
              </motion.p>
            </div>

            <motion.div
              variants={staggerItem}
              className="mt-8 flex max-w-xl flex-wrap items-stretch gap-2 border-t border-black/10 pt-8 sm:gap-3"
            >
              <HomeActionLink
                href="/about"
                className="flex-1 justify-center whitespace-nowrap px-4 text-xs sm:px-6 sm:text-sm"
              >
                Discover our story
              </HomeActionLink>
              <CommunityJoinTrigger
                icon={false}
                className="flex-1 whitespace-normal px-4 text-xs sm:px-6 sm:text-sm"
              >
                Join our community
              </CommunityJoinTrigger>
            </motion.div>
          </motion.div>

          <div className="group relative min-h-[460px] overflow-hidden lg:min-h-full">
            <CoverImage name="welcome" loading="lazy" />
            <div className="absolute inset-0 bg-black/0 transition duration-700 group-hover:bg-black/10" />
          </div>
        </div>
      </Section>

      <Section padding="2xl" className="bg-[#0a0a0a] text-white">
        <Container size="2xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={staggerViewport}
            className="mx-auto max-w-5xl text-center"
          >
            <motion.p
              variants={staggerItem}
              className={`${eyebrowClass} text-[var(--app-primary)]`}
            >
              {HOME_COPY.identity.eyebrow}
            </motion.p>
            <SectionHeading tone="light" className="mx-auto mt-5">
              {HOME_COPY.identity.title}
              <HeadingAccent>{HOME_COPY.identity.accent}</HeadingAccent>
            </SectionHeading>
            <motion.p
              variants={staggerItem}
              className="mx-auto mt-6 max-w-2xl font-ui text-base leading-8 text-white/60"
            >
              {HOME_COPY.identity.description}
            </motion.p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={staggerViewport}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {HOME_BELIEFS.map(belief => (
              <motion.div
                variants={staggerItem}
                key={belief.title}
                className="group relative isolate flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black sm:min-h-[400px]"
              >
                <Image
                  src={belief.image}
                  alt={belief.imageAlt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  quality={IMAGE_QUALITY}
                  className={`object-cover ${belief.imagePosition} transition-[transform,filter] duration-700 ease-out will-change-transform group-hover:scale-[1.06]`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/10 transition-opacity duration-500 group-hover:from-black/95" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-transparent" />

                <div className="relative z-10 mt-auto p-6 pt-0 sm:p-7 sm:pt-0">
                  <h3 className="break-words font-sans text-2xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-white transition-colors duration-300 group-hover:text-[var(--app-primary-light)] sm:text-[1.7rem] lg:text-2xl xl:text-[1.85rem]">
                    {belief.title}
                  </h3>
                  <p className="mt-3 min-h-12 font-ui text-sm leading-6 text-white/65">
                    {belief.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      <Section padding="none" className="bg-black text-white">
        <div className="grid overflow-hidden lg:min-h-[680px] lg:grid-cols-2">
          <div className="relative flex min-h-[540px] items-end justify-center bg-[#171310]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(201,150,26,.28),transparent_42%)]" />
            <Image
              src={HOME_IMAGES.pastor.src}
              alt={HOME_IMAGES.pastor.alt}
              width={792}
              height={963}
              quality={IMAGE_QUALITY}
              sizes="(max-width:1024px) 90vw, 50vw"
              className="relative z-10 max-h-[650px] w-auto object-contain object-bottom transition duration-700 hover:scale-[1.02]"
            />
          </div>
          <div className={`flex items-center ${panelPaddingX} py-20`}>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={staggerViewport}
              className="max-w-xl"
            >
              <motion.p
                variants={staggerItem}
                className={`${eyebrowClass} text-[var(--app-primary)]`}
              >
                {HOME_COPY.pastor.eyebrow}
              </motion.p>
              <SectionHeading tone="light" className="mt-5">
                {HOME_COPY.pastor.title}
              </SectionHeading>
              <motion.p
                variants={staggerItem}
                className="mt-7 font-ui text-base leading-8 text-white/60 sm:text-lg"
              >
                {HOME_COPY.pastor.description}
              </motion.p>
              <motion.div variants={staggerItem}>
                <HomeActionLink href="/leadership" className="mt-8">
                  Meet our leadership
                </HomeActionLink>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Section>

      <Section
        id="community"
        padding="none"
        className="overflow-hidden bg-[#0b0b0b] text-white"
      >
        <Container size="2xl" className="py-16 sm:py-20 lg:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={staggerViewport}
              className="max-w-xl lg:col-start-1 lg:row-start-1"
            >
              <motion.p
                variants={staggerItem}
                className={`${eyebrowClass} text-[var(--app-primary)]`}
              >
                {HOME_COPY.community.eyebrow}
              </motion.p>
              <SectionHeading tone="light" className="mt-5">
                We don&apos;t do
                <HeadingAccent>life alone.</HeadingAccent>
              </SectionHeading>
              <motion.p
                variants={staggerItem}
                className="mt-7 max-w-lg font-ui text-base leading-8 text-white/58 sm:text-lg"
              >
                {HOME_COPY.community.description}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={staggerViewport}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative lg:col-start-2 lg:row-start-1 lg:row-span-2"
            >
              <CommunityCollage />

              <span className="absolute -right-2 top-7 hidden font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-white/38 [writing-mode:vertical-rl] sm:block">
                Wisdom Church community
              </span>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={staggerViewport}
              className="mt-8 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:self-end"
            >
              <motion.div variants={staggerItem}>
                <HomeActionLink href="/contact">
                  <Users className="h-4 w-4" /> Connect with us
                </HomeActionLink>
              </motion.div>

              <motion.div
                variants={staggerItem}
                className="mt-10 overflow-hidden border-y border-white/12 py-4"
              >
                <div
                  className="community-ticker"
                  role="region"
                  aria-label="Wisdom Church community values"
                >
                  <div className="community-ticker__track">
                    {[0, 1].map(copy => (
                      <div
                        key={copy}
                        className="community-ticker__group"
                        aria-hidden={copy === 1 ? true : undefined}
                      >
                        {[
                          'Prayer',
                          'Worship',
                          'Friendship',
                          'Growth',
                          'Belonging',
                        ].map(label => (
                          <span
                            key={`${copy}-${label}`}
                            className="inline-flex shrink-0 items-center gap-3 font-ui text-xs font-bold uppercase tracking-[0.18em] text-white/62 sm:text-sm"
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-[var(--app-primary)] shadow-[0_0_12px_var(--app-primary)]"
                              aria-hidden="true"
                            />
                            {label}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
