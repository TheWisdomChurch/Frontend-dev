'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin, Play, Users } from 'lucide-react';

import { IMAGE_QUALITY } from '@/shared/constants';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { Container, Section } from '@/shared/layout';
import HomeActionLink from '@/features/home/HomeActionLink';
import TakeMeToChurchButton from '@/features/navigation/TakeMeToChurchButton';
import { HOME_BELIEFS, HOME_COPY, HOME_IMAGES } from '@/features/home/content';
import { SectionHeading, HeadingAccent } from '@/shared/ui/SectionHeading';
import { motion } from '@/lib/safe-motion';
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
}: {
  name: keyof typeof HOME_IMAGES;
  priority?: boolean;
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
      quality={IMAGE_QUALITY}
      sizes={COVER_IMAGE_SIZES[name]}
      data-parallax-global={isCommunityImage ? undefined : parallaxDepth}
      className={`${isCommunityImage || isContain ? '' : 'scale-[1.06]'} ${isContain ? 'object-contain' : 'object-cover'} ${image.position}`}
    />
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
              <HomeActionLink
                href={SOCIAL_LINKS.youtube}
                external
                icon={Play}
                iconClassName="fill-current"
                hideArrow
                className="flex-1 min-w-0 justify-center px-4 text-xs sm:flex-none sm:px-6 sm:text-sm"
              >
                Watch live
              </HomeActionLink>
              <HomeActionLink
                href="/events/weekly"
                variant="light"
                icon={CalendarDays}
                hideArrow
                className="flex-1 min-w-0 justify-center px-4 text-xs sm:flex-none sm:px-6 sm:text-sm"
              >
                Plan your visit
              </HomeActionLink>
            </div>
          </div>
        </Container>
      </Section>

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
              <Link
                href="/#community"
                className="inline-flex min-h-12 flex-1 items-center justify-center whitespace-nowrap rounded-full border border-black/25 px-4 font-ui text-xs font-bold transition hover:bg-black hover:text-white sm:px-6 sm:text-sm"
              >
                Join our community
              </Link>
            </motion.div>
          </motion.div>

          <div className="group relative min-h-[460px] overflow-hidden lg:min-h-full">
            <CoverImage name="welcome" />
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
                className="group relative isolate flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black sm:min-h-[400px]"
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
                  <p className="mt-3 font-ui text-sm leading-6 text-white/65">
                    {belief.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      <Section padding="none" className="bg-[var(--app-primary)]">
        <div className="grid lg:min-h-[620px] lg:grid-cols-2 xl:min-h-[720px] 2xl:min-h-[820px]">
          <div className="group relative min-h-[430px] overflow-hidden lg:order-2 lg:min-h-full">
            <CoverImage name="service" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </div>
          <div className={`flex items-center ${panelPaddingX} py-20`}>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={staggerViewport}
              className="max-w-xl"
            >
              <motion.p variants={staggerItem} className={eyebrowClass}>
                {HOME_COPY.service.eyebrow}
              </motion.p>
              <SectionHeading tone="dark" className="mt-5">
                {HOME_COPY.service.title}
              </SectionHeading>
              <motion.div
                variants={staggerItem}
                className="mt-8 space-y-4 border-y border-black/25 py-6 font-ui"
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
                initial="hidden"
                whileInView="show"
                viewport={staggerViewport}
                className="mt-8 flex flex-nowrap items-stretch gap-2 sm:gap-3"
              >
                <TakeMeToChurchButton fullWidth className="flex-1" />
                <HomeActionLink
                  href="/events/weekly"
                  variant="dark"
                  className="flex-1 justify-center whitespace-nowrap gap-2 px-4 text-xs sm:gap-3 sm:px-5 sm:text-sm"
                >
                  Plan your first visit
                </HomeActionLink>
              </motion.div>
            </motion.div>
          </div>
        </div>
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
              className="relative pb-0 sm:pb-10 sm:pl-10 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:pb-12 lg:pl-12"
            >
              <div className="relative h-[340px] overflow-hidden sm:h-[500px] lg:h-[610px]">
                <CoverImage name="community" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5" />
              </div>

              <div className="absolute bottom-0 left-0 hidden h-[250px] w-[190px] overflow-hidden border-[8px] border-[#0b0b0b] sm:block lg:h-[310px] lg:w-[230px]">
                <Image
                  src="/Picflow Images Jul 31 (2)/DSC00064 copy.webp"
                  alt="Members praying together at The Wisdom Church"
                  fill
                  quality={IMAGE_QUALITY}
                  sizes="230px"
                  className="object-cover object-center"
                />
              </div>

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
                className="mt-10 border-t border-white/12 pt-6"
              >
                <div className="flex snap-x snap-proximity items-center gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [mask-image:linear-gradient(to_right,black_88%,transparent_100%)] [scrollbar-width:none] [-webkit-mask-image:linear-gradient(to_right,black_88%,transparent_100%)] [&::-webkit-scrollbar]:hidden">
                  {['Prayer', 'Friendship', 'Growth', 'Belonging'].map(
                    label => (
                      <span
                        key={label}
                        className="shrink-0 snap-start rounded-full border border-white/14 px-4 py-2 font-ui text-xs font-bold uppercase tracking-[0.14em] text-white/55"
                      >
                        {label}
                      </span>
                    )
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
