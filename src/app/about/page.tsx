import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Church, HeartHandshake, MapPin, Play } from 'lucide-react';

import { IMAGE_QUALITY } from '@/shared/constants';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';
import { apiClient } from '@/lib/api';
import type {
  LeadershipMember,
  LeadershipRole,
} from '@/domain/leadership/types';
import { CanvasCard, DarkCard } from '@/features/leadership/LeadershipCards';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import PageHero from '@/features/hero/PageHero';

const SENIOR_ROLES: LeadershipRole[] = [
  'senior_pastor',
  'associate_pastor',
  'reverend',
];
export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildPageMetadata({
  title: 'About The Wisdom Church',
  description:
    'Meet The Wisdom Church — a Spirit-filled church in Lagos raising complete believers through the Word, prayer, worship, and fellowship.',
  path: '/about',
});

const defaultPillars: Array<{ title: string; body: string }> = [
  {
    title: 'The Word of God',
    body: 'We receive sound biblical teaching that builds faith, renews the mind, and equips every believer to live for Christ.',
  },
  {
    title: 'Prayer',
    body: 'We pray with faith and expectation, growing in communion with God and standing together for His will to be established.',
  },
  {
    title: 'Worship',
    body: 'We honour Jesus with joyful, reverent worship and make room for the Holy Spirit to transform lives.',
  },
  {
    title: 'Fellowship',
    body: 'We walk as one church family, caring for one another, serving together, and helping every person find their place.',
  },
];

const defaultAboutContent = {
  eyebrow: 'Welcome to The Wisdom Church',
  title: 'A church where lives are transformed.',
  subtitle:
    'We are a Spirit-filled family in Lagos, raising complete believers through the Word of God, prayer, worship, and genuine fellowship.',
  storyTitle: 'Raising complete believers in Christ.',
  storyBody:
    'The Wisdom Church is a family of believers committed to knowing Jesus, growing in His Word, and living by the power of the Holy Spirit. We gather so that people can encounter God, be established in faith, discover their place in the body of Christ, and carry His light into everyday life.',
  storyImage: '',
  cultureTitle: 'How we grow together as a church.',
  pillars: defaultPillars.map(item => ({ ...item })),
};

type AboutContent = typeof defaultAboutContent;

function normalizeAboutContent(
  value: Record<string, unknown> | null
): AboutContent {
  if (!value) return defaultAboutContent;
  const text = (key: keyof Omit<AboutContent, 'pillars'>) =>
    typeof value[key] === 'string' && value[key].trim()
      ? value[key].trim()
      : defaultAboutContent[key];
  const suppliedPillars = Array.isArray(value.pillars)
    ? value.pillars
        .filter(item => item && typeof item === 'object')
        .map(item => item as Record<string, unknown>)
        .filter(
          item =>
            typeof item.title === 'string' && typeof item.body === 'string'
        )
        .map(item => ({
          title: String(item.title).trim(),
          body: String(item.body).trim(),
        }))
        .filter(item => item.title && item.body)
        .slice(0, 8)
    : [];
  return {
    eyebrow: text('eyebrow'),
    title: text('title'),
    subtitle: text('subtitle'),
    storyTitle: text('storyTitle'),
    storyBody: text('storyBody'),
    storyImage:
      typeof value.storyImage === 'string' ? value.storyImage.trim() : '',
    cultureTitle: text('cultureTitle'),
    pillars: suppliedPillars.length
      ? suppliedPillars
      : defaultAboutContent.pillars,
  };
}

const churchLife = [
  {
    label: 'Worship',
    title: 'We gather in God’s presence.',
    body: 'Our services are filled with heartfelt worship, prayer, and the preaching of God’s Word.',
    image: '/Picflow/DSC06877 copy.webp',
    position: 'object-center',
  },
  {
    label: 'Discipleship',
    title: 'We are formed as disciples.',
    body: 'From Sunday teaching to daily prayer and ministry life, every gathering helps believers mature in Christ.',
    image: '/Picflow/DSC00268 copy.webp',
    position: 'object-[52%_center]',
  },
  {
    label: 'Fellowship',
    title: 'No one follows Jesus alone.',
    body: 'We build real relationships, carry one another’s burdens, celebrate testimonies, and serve as one family.',
    image: '/Picflow/DSC00054 copy.webp',
    position: 'object-[center_32%]',
  },
] as const;

export default async function AboutPage() {
  const [leadershipResult, contentResult] = await Promise.allSettled([
    apiClient.listLeadership(),
    apiClient.getAboutContent(),
  ]);
  const allLeaders =
    leadershipResult.status === 'fulfilled'
      ? leadershipResult.value
      : ([] as LeadershipMember[]);
  const content = normalizeAboutContent(
    contentResult.status === 'fulfilled' ? contentResult.value : null
  );
  const leaders = allLeaders
    .filter(leader => SENIOR_ROLES.includes(leader.role))
    .slice(0, 2);

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
        compact
        actions={
          <>
            <PlanVisitTrigger className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--app-primary)] px-6 font-ui text-xs font-bold uppercase tracking-[.13em] text-black transition hover:brightness-110">
              Worship with us this Sunday
            </PlanVisitTrigger>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/35 bg-black/20 px-6 font-ui text-xs font-bold uppercase tracking-[.13em] text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10"
            >
              <Play className="h-4 w-4 fill-current" /> Watch a service
            </a>
          </>
        }
      />

      <section className="border-b border-black/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <div className="grid divide-y divide-black/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-4 py-6 sm:px-6 lg:px-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)]/12 text-[var(--app-primary-dark)]">
                <Church className="h-4 w-4" />
              </div>
              <div>
                <p className="font-ui text-[10px] font-bold uppercase tracking-[.18em] text-black/65">
                  Sunday worship
                </p>
                <p className="mt-1 font-headline text-lg">
                  {SERVICE_INFO.sunday.time} {SERVICE_INFO.sunday.timezone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-6 sm:px-6 lg:px-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)]/12 text-[var(--app-primary-dark)]">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <div>
                <p className="font-ui text-[10px] font-bold uppercase tracking-[.18em] text-black/65">
                  Daily prayer
                </p>
                <p className="mt-1 font-headline text-lg">
                  {SERVICE_INFO.dailyPrayer.daysShort} ·{' '}
                  {SERVICE_INFO.dailyPrayer.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-6 sm:px-6 lg:px-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)]/12 text-[var(--app-primary-dark)]">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-ui text-[10px] font-bold uppercase tracking-[.18em] text-black/65">
                  Our church home
                </p>
                <p className="mt-1 font-headline text-lg">
                  {SERVICE_INFO.venue.short}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24 lg:py-32">
        <Container size="xl">
          <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
            <ScrollFadeIn>
              <p className="font-ui text-xs font-bold uppercase tracking-[.23em] text-[var(--app-primary-dark)]">
                Our God-given mandate
              </p>
              <h2 className="mt-5 max-w-xl font-headline text-4xl leading-[1.03] tracking-[-.035em] text-[var(--app-ink)] sm:text-5xl lg:text-6xl">
                {content.storyTitle}
              </h2>
            </ScrollFadeIn>
            <ScrollFadeIn delay={0.08} className="lg:pt-10">
              <p className="max-w-2xl font-ui text-lg leading-9 text-black/75">
                {content.storyBody}
              </p>
              <div className="mt-9 border-l-2 border-[var(--app-primary)] pl-6">
                <p className="font-headline text-2xl leading-snug text-[var(--app-ink)]">
                  Jesus is at the centre. His Word is our foundation. His Spirit
                  empowers our lives.
                </p>
              </div>
            </ScrollFadeIn>
          </div>
        </Container>
      </section>

      <section className="relative bg-[#0a0a0c] py-20 text-white sm:py-24 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(201,150,26,.12),transparent_28%)]" />
        <Container size="xl" className="relative">
          <ScrollFadeIn className="max-w-3xl">
            <p className="font-ui text-xs font-bold uppercase tracking-[.23em] text-[var(--app-primary)]">
              Built up in Christ
            </p>
            <h2 className="mt-4 font-headline text-4xl leading-tight sm:text-5xl">
              {content.cultureTitle}
            </h2>
            <p className="mt-5 max-w-xl font-ui text-base leading-8 text-white/75">
              Church is more than a meeting. It is where believers are rooted in
              truth, strengthened in prayer, renewed in worship, and joined in
              fellowship.
            </p>
          </ScrollFadeIn>
          <div className="mt-12 border-y border-white/15">
            {content.pillars.map((pillar, index) => (
              <ScrollFadeIn key={pillar.title} delay={index * 0.04}>
                <article className="group grid gap-5 border-b border-white/12 py-8 last:border-b-0 sm:grid-cols-[72px_minmax(180px,.75fr)_minmax(0,1.25fr)] sm:items-start sm:gap-8 sm:py-10 lg:grid-cols-[90px_minmax(240px,.7fr)_minmax(0,1.3fr)] lg:gap-12 lg:py-12">
                  <p
                    aria-hidden="true"
                    className="font-headline text-3xl leading-none text-[var(--app-primary)] sm:pt-1 sm:text-4xl"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-headline text-2xl leading-tight text-white sm:text-3xl">
                    {pillar.title}
                  </h3>
                  <p className="max-w-2xl font-ui text-base leading-8 text-white/82">
                    {pillar.body}
                  </p>
                </article>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[var(--app-canvas)] py-20 sm:py-24 lg:py-28">
        <Container size="xl">
          <ScrollFadeIn className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-ui text-xs font-bold uppercase tracking-[.23em] text-[var(--app-primary-dark)]">
                Life in our church
              </p>
              <h2 className="mt-4 max-w-2xl font-headline text-4xl leading-tight sm:text-5xl">
                A place to encounter God, grow, and belong.
              </h2>
            </div>
            <Link
              href="/ministries"
              className="inline-flex items-center gap-2 font-ui text-xs font-bold uppercase tracking-[.14em] text-[var(--app-primary-dark)]"
            >
              Find your place <span aria-hidden>→</span>
            </Link>
          </ScrollFadeIn>
          <div className="mt-10 grid items-stretch gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {churchLife.map((item, index) => (
              <ScrollFadeIn
                key={item.title}
                delay={index * 0.07}
                className="h-full"
              >
                <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_18px_55px_rgba(20,15,8,.08)]">
                  <div className="relative aspect-[4/3] min-h-[240px] w-full overflow-hidden bg-black sm:aspect-[16/11] lg:aspect-[4/3]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      quality={IMAGE_QUALITY}
                      sizes="(max-width:767px) 100vw, (max-width:1023px) 50vw, 33vw"
                      className={`object-cover ${item.position} transition duration-1000 group-hover:scale-[1.035]`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />
                    <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-black/45 px-3 py-1.5 font-ui text-[10px] font-bold uppercase tracking-[.18em] text-white backdrop-blur-md sm:bottom-5 sm:left-5">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 text-[var(--app-ink)] sm:p-7 lg:p-8">
                    <h3 className="font-headline text-[clamp(1.65rem,2.3vw,2.15rem)] leading-[1.12] tracking-[-.025em]">
                      {item.title}
                    </h3>
                    <div className="mt-4 h-px w-10 bg-[var(--app-primary)]" />
                    <p className="mt-4 font-ui text-sm leading-7 text-black/75 sm:text-[.95rem] sm:leading-7">
                      {item.body}
                    </p>
                  </div>
                </article>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <div className="relative overflow-hidden bg-[var(--app-dark)] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(201,150,26,.14),transparent_32%)]" />
          <Container size="xl" className="relative py-20 sm:py-24 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,.36fr)] lg:items-end lg:gap-16">
              <ScrollFadeIn className="max-w-3xl">
                <p className="font-ui text-xs font-bold uppercase tracking-[.23em] text-[var(--app-primary-light)]">
                  Pastoral leadership
                </p>
                <h2 className="mt-5 font-headline text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl">
                  Shepherding God’s people with the Word, prayer, and love.
                </h2>
                <p className="mt-6 max-w-2xl font-ui text-base leading-8 text-white/78">
                  Our pastors serve the church by teaching Scripture, praying
                  faithfully, caring for people, and helping every believer grow
                  in Christ.
                </p>
              </ScrollFadeIn>

              <ScrollFadeIn delay={0.08} className="lg:justify-self-end">
                <Link
                  href="/leadership"
                  className="group inline-flex min-h-12 w-full items-center justify-between gap-5 rounded-full border border-white/25 bg-white/[.06] px-6 font-ui text-xs font-bold uppercase tracking-[.13em] text-white transition hover:border-[var(--app-primary)] hover:bg-[var(--app-primary)] hover:text-black sm:w-auto lg:min-w-[250px]"
                >
                  Meet our church leaders
                  <span
                    aria-hidden
                    className="text-lg transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </ScrollFadeIn>
            </div>
          </Container>
        </div>
        {leaders.length > 0 ? (
          <div className="grid lg:grid-cols-2">
            <CanvasCard leader={leaders[0]} />
            {leaders[1] && <DarkCard leader={leaders[1]} />}
          </div>
        ) : (
          <Container size="xl" className="py-12">
            <p className="font-ui text-sm text-black/70">
              Leadership profiles are being updated. Meet the pastoral team when
              you worship with us.
            </p>
          </Container>
        )}
      </section>

      <section className="relative overflow-hidden bg-[var(--app-primary)] py-20 sm:py-24 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,.22),transparent_28%)]" />
        <Container size="lg" className="relative text-center">
          <p className="font-ui text-xs font-bold uppercase tracking-[.23em] text-black/70">
            There is a place for you here
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl font-headline text-4xl leading-[1.03] tracking-[-.035em] text-black sm:text-5xl lg:text-6xl">
            Come worship Jesus with us this Sunday.
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-ui text-base leading-8 text-black/75">
            Whether you are beginning your walk with God, returning to church,
            or looking for a church family, we will be glad to welcome you.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PlanVisitTrigger className="inline-flex min-h-12 items-center justify-center rounded-full bg-black px-7 font-ui text-xs font-bold uppercase tracking-[.14em] text-white">
              Plan your first visit
            </PlanVisitTrigger>
            <Link
              href="/ministries"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/25 px-7 font-ui text-xs font-bold uppercase tracking-[.14em] text-black"
            >
              Explore church ministries
            </Link>
          </div>
          <p className="mt-7 font-ui text-xs font-semibold text-black/70">
            {SERVICE_INFO.sunday.day} · {SERVICE_INFO.sunday.time}{' '}
            {SERVICE_INFO.sunday.timezone} · {SERVICE_INFO.venue.short}
          </p>
        </Container>
      </section>
    </main>
  );
}
