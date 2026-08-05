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

const eyebrowClass = 'font-ui text-xs font-bold uppercase tracking-[0.22em]';
const displayClass =
  'font-sans font-black uppercase leading-[0.92] tracking-[-0.045em]';

function CoverImage({
  name,
  priority = false,
}: {
  name: keyof typeof HOME_IMAGES;
  priority?: boolean;
}) {
  const image = HOME_IMAGES[name];
  const isCommunityImage = name === 'community';
  const parallaxDepth =
    name === 'hero' ? '0.16' : name === 'service' ? '0.12' : '0.09';
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      priority={priority}
      quality={IMAGE_QUALITY}
      sizes="100vw"
      data-parallax-global={isCommunityImage ? undefined : parallaxDepth}
      className={`${isCommunityImage ? '' : 'scale-[1.06]'} object-cover ${image.position}`}
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
          className="relative flex min-h-[100svh] flex-col items-center justify-center pb-16 pt-28 text-center"
        >
          <div data-gsap="reveal">
            <p
              className={`${eyebrowClass} mb-6 text-[var(--app-primary-light)]`}
            >
              {HOME_COPY.hero.eyebrow}
            </p>
            <h1
              className={`${displayClass} mx-auto max-w-[1050px] text-[clamp(3rem,6.4vw,6.2rem)] text-white`}
            >
              {HOME_COPY.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-ui text-base leading-7 text-white/80 sm:text-lg">
              {HOME_COPY.hero.description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <HomeActionLink href={SOCIAL_LINKS.youtube} external>
                <Play className="h-4 w-4 fill-current" /> Watch live
              </HomeActionLink>
              <HomeActionLink href="/events/weekly" variant="light">
                Plan your visit
              </HomeActionLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="none" className="bg-white">
        <div className="grid lg:min-h-[660px] lg:grid-cols-2">
          <div className="flex items-center px-6 py-20 sm:px-10 lg:px-16 xl:px-24">
            <div data-gsap="reveal" className="max-w-xl">
              <p className={`${eyebrowClass} text-[var(--app-primary-dark)]`}>
                {HOME_COPY.welcome.eyebrow}
              </p>
              <h2
                className={`${displayClass} mt-5 text-[clamp(2.8rem,4.8vw,5.25rem)]`}
              >
                {HOME_COPY.welcome.title}
                <span className="block text-[var(--app-primary-dark)]">
                  {HOME_COPY.welcome.accent}
                </span>
              </h2>
              <p className="mt-7 font-ui text-base leading-8 text-black/60 sm:text-lg">
                {HOME_COPY.welcome.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <HomeActionLink href="/about">
                  Discover our story
                </HomeActionLink>
                <Link
                  href="/#community"
                  className="inline-flex min-h-12 items-center rounded-full border border-black/25 px-6 font-ui text-sm font-bold transition hover:bg-black hover:text-white"
                >
                  Join our community
                </Link>
              </div>
            </div>
          </div>
          <div className="group relative min-h-[460px] overflow-hidden lg:min-h-full">
            <CoverImage name="welcome" />
            <div className="absolute inset-0 bg-black/0 transition duration-700 group-hover:bg-black/10" />
          </div>
        </div>
      </Section>

      <Section padding="2xl" className="bg-[#0a0a0a] text-white">
        <Container size="2xl">
          <div data-gsap="reveal" className="mx-auto max-w-5xl text-center">
            <p className={`${eyebrowClass} text-[var(--app-primary)]`}>
              {HOME_COPY.identity.eyebrow}
            </p>
            <h2
              className={`${displayClass} mt-5 text-[clamp(2.8rem,5vw,5.6rem)]`}
            >
              {HOME_COPY.identity.title}
              <span className="block text-[var(--app-primary)]">
                {HOME_COPY.identity.accent}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl font-ui text-base leading-8 text-white/60">
              {HOME_COPY.identity.description}
            </p>
          </div>
          <div className="mt-14 grid border-y border-white/20 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_BELIEFS.map((belief, index) => (
              <div
                data-gsap="reveal"
                key={belief.title}
                className={`group flex min-h-[270px] flex-col justify-between border-white/20 px-2 py-8 sm:px-7 ${index > 0 ? 'lg:border-l' : ''} ${index % 2 === 1 ? 'sm:border-l' : ''} ${index > 1 ? 'sm:border-t lg:border-t-0' : ''}`}
              >
                <span className="font-ui text-xs font-bold tracking-[0.2em] text-white/40">
                  {belief.number}
                </span>
                <div>
                  <h3 className="font-sans text-3xl font-black uppercase tracking-[-0.035em] transition-colors group-hover:text-[var(--app-primary-light)]">
                    {belief.title}
                  </h3>
                  <p className="mt-4 font-ui text-sm leading-7 text-white/60">
                    {belief.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="none" className="bg-[var(--app-primary)]">
        <div className="grid lg:min-h-[620px] lg:grid-cols-2">
          <div className="group relative min-h-[430px] overflow-hidden lg:order-2 lg:min-h-full">
            <CoverImage name="service" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </div>
          <div className="flex items-center px-6 py-20 sm:px-10 lg:px-16 xl:px-24">
            <div data-gsap="reveal" className="max-w-xl">
              <p className={eyebrowClass}>{HOME_COPY.service.eyebrow}</p>
              <h2
                className={`${displayClass} mt-5 text-[clamp(3rem,5vw,5.6rem)]`}
              >
                {HOME_COPY.service.title}
              </h2>
              <div className="mt-8 space-y-4 border-y border-black/25 py-6 font-ui">
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
              </div>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <TakeMeToChurchButton />
                <HomeActionLink href="/events/weekly" variant="dark">
                  Plan your first visit
                </HomeActionLink>
              </div>
            </div>
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
          <div className="flex items-center px-6 py-20 sm:px-10 lg:px-16 xl:px-24">
            <div data-gsap="reveal" className="max-w-xl">
              <p className={`${eyebrowClass} text-[var(--app-primary)]`}>
                {HOME_COPY.pastor.eyebrow}
              </p>
              <h2
                className={`${displayClass} mt-5 text-[clamp(2.8rem,4.6vw,5.2rem)]`}
              >
                {HOME_COPY.pastor.title}
              </h2>
              <p className="mt-7 font-ui text-base leading-8 text-white/60 sm:text-lg">
                {HOME_COPY.pastor.description}
              </p>
              <HomeActionLink href="/leadership" className="mt-8">
                Meet our leadership
              </HomeActionLink>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="community"
        padding="none"
        className="overflow-hidden bg-[#0b0b0b] text-white"
      >
        <Container size="2xl" className="py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:gap-20">
            <div data-gsap="reveal" className="max-w-xl">
              <p className={`${eyebrowClass} text-[var(--app-primary)]`}>
                {HOME_COPY.community.eyebrow}
              </p>
              <h2
                className={`${displayClass} mt-5 text-[clamp(2.7rem,4.7vw,5.1rem)]`}
              >
                We don&apos;t do
                <span className="block text-[var(--app-primary)]">
                  life alone.
                </span>
              </h2>
              <p className="mt-7 max-w-lg font-ui text-base leading-8 text-white/58 sm:text-lg">
                {HOME_COPY.community.description}
              </p>
              <HomeActionLink href="/contact" className="mt-8">
                <Users className="h-4 w-4" /> Connect with us
              </HomeActionLink>

              <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/12 pt-6 font-ui text-xs font-bold uppercase tracking-[0.16em] text-white/42 sm:grid-cols-4 lg:grid-cols-2">
                <span>Prayer</span>
                <span>Friendship</span>
                <span>Growth</span>
                <span>Belonging</span>
              </div>
            </div>

            <div
              data-gsap="reveal"
              className="relative pb-0 sm:pb-10 sm:pl-10 lg:pb-12 lg:pl-12"
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
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
