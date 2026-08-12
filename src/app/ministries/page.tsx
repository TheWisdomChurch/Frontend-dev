import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import SectionGlow from '@/shared/ui/SectionGlow';
import Arrow from '@/shared/ui/icons/Arrow';
import { IMAGE_QUALITY } from '@/shared/constants';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Ministries — Find Your Place',
  description:
    'Find a ministry community for every season of life at The Wisdom Church and take a clear next step into fellowship, discipleship, and service.',
  path: '/ministries',
});

const ministries = [
  {
    title: 'Youth Ministry',
    label: 'Teenagers & young adults',
    description:
      'A Christ-centred community where a new generation is grounded in Scripture, prayer, purpose, and godly friendships.',
    href: '/ministries/youth',
    image: '/Picflow/DSC00268 copy.webp',
    position: 'object-[center_32%]',
  },
  {
    title: "Women's Ministry",
    label: 'Women in every season',
    description:
      'Women growing together in the Word, prayer, fellowship, and the grace to live faithfully in every season.',
    href: '/ministries/women',
    image: '/Picflow/DSC00054 copy.webp',
    position: 'object-[center_28%]',
  },
  {
    title: "Men's Ministry",
    label: 'Brotherhood & discipleship',
    description:
      'A brotherhood forming men of conviction, spiritual discipline, integrity, and servant leadership.',
    href: '/ministries/men',
    image: '/Picflow/DSC06877 copy.webp',
    position: 'object-center',
  },
  {
    title: "Children's Ministry",
    label: 'Nursery to pre-teens',
    description:
      'A safe, joyful place where children are known, cared for, and taught the truth of God’s Word at their level.',
    href: '/ministries/children',
    image: '/Picflow/DSC00123 copy.webp',
    position: 'object-[center_35%]',
  },
  {
    title: 'Outreach & Missions',
    label: 'Faith beyond our walls',
    description:
      'Serving our neighbours, sharing the gospel, and expressing the love of Christ through practical care.',
    href: '/ministries/outreach',
    image: '/Picflow/DSC00132 copy.webp',
    position: 'object-center',
  },
] as const;

const pathway = [
  {
    number: '01',
    title: 'Discover',
    body: 'Explore each ministry and find the community that fits your season of life.',
  },
  {
    number: '02',
    title: 'Meet the team',
    body: 'Tell our welcome team where you would like to connect. A real person will help you take the next step.',
  },
  {
    number: '03',
    title: 'Grow and serve',
    body: 'Build relationships, grow through discipleship, and use your gifts in the life of the church.',
  },
] as const;

const primaryActionClass =
  'inline-flex min-h-12 items-center justify-center gap-2.5 bg-[var(--app-primary)] px-6 py-3 font-ui text-label font-bold uppercase tracking-[0.12em] text-[var(--app-ink)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-dark)]';

export default function MinistriesPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Ministries', path: '/ministries' },
        ])}
      />

      <PageHero
        eyebrow="Life together"
        title="There is a place for you in this church family."
        subtitle="Find a community where you can be known, grow in Christ, build lasting relationships, and serve with the gifts God has given you."
        backgroundImage="/Picflow/DSC00268 copy.webp"
        imagePositionClassName="object-[62%_38%] sm:object-[center_35%]"
        compact
        chips={['Belong', 'Grow', 'Serve']}
        actions={
          <>
            <Link href="#find-a-ministry" className={primaryActionClass}>
              Find a ministry <Arrow />
            </Link>
            <Link
              href="/contact?topic=connect"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 border border-white/30 bg-white/[0.06] px-6 py-3 font-ui text-label font-semibold text-white transition hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Help me choose <Arrow />
            </Link>
          </>
        }
      />

      <section className="border-b border-[var(--app-ink)]/10 bg-[var(--app-canvas)] py-14 sm:py-16 lg:py-20">
        <Container size="xl">
          <ScrollFadeIn className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                More than a Sunday crowd
              </p>
              <h2 className="mt-4 max-w-xl font-headline text-heading-md font-normal leading-[1.16] text-[var(--app-ink)] sm:text-heading-lg lg:text-display-sm">
                We grow best when we walk with others.
              </h2>
            </div>
            <div className="border-l-2 border-[var(--app-primary)]/55 pl-5 sm:pl-7">
              <p className="max-w-2xl font-ui text-body-md leading-[1.85] text-[var(--app-ink)]/75">
                Ministry is where church becomes personal. It is where names are
                remembered, prayers are shared, disciples are formed, and every
                generation finds room to flourish in Christ.
              </p>
            </div>
          </ScrollFadeIn>
        </Container>
      </section>

      <section
        id="find-a-ministry"
        className="scroll-mt-24 bg-[var(--app-canvas-2)] py-14 sm:py-18 lg:py-24"
      >
        <Container size="xl">
          <ScrollFadeIn className="mb-10 flex flex-col gap-4 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Find your community
              </p>
              <h2 className="mt-3 font-headline text-heading-md font-normal text-[var(--app-ink)] sm:text-heading-lg">
                Explore our ministries
              </h2>
            </div>
            <p className="max-w-md font-ui text-body-sm leading-[1.8] text-[var(--app-ink)]/65">
              Choose a ministry to learn what happens, who it serves, and how to
              join. You do not need to have everything figured out first.
            </p>
          </ScrollFadeIn>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
            {ministries.map((ministry, index) => {
              const featured = index === 0 || index === 3;
              return (
                <ScrollFadeIn
                  key={ministry.title}
                  delay={index * 0.06}
                  className={featured ? 'lg:col-span-7' : 'lg:col-span-5'}
                >
                  <Link
                    href={ministry.href}
                    aria-label={`Explore ${ministry.title}`}
                    className="group grid min-h-[440px] overflow-hidden bg-[var(--app-dark)] shadow-[0_18px_50px_rgba(20,16,8,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] focus-visible:ring-offset-4 md:min-h-[400px] md:grid-cols-[1.08fr_0.92fr] lg:min-h-[430px] lg:grid-cols-1"
                  >
                    <div className="relative min-h-[250px] overflow-hidden lg:min-h-0">
                      <Image
                        src={ministry.image}
                        alt=""
                        fill
                        quality={IMAGE_QUALITY}
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 58vw"
                        className={`object-cover ${ministry.position} transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-dark)]/75 via-transparent to-transparent lg:from-[var(--app-dark)]/95 lg:via-[var(--app-dark)]/20" />
                    </div>
                    <div className="relative flex flex-col justify-between border-t border-white/10 p-6 sm:p-7 lg:-mt-44 lg:min-h-[240px] lg:border-t-0 lg:bg-gradient-to-t lg:from-[var(--app-dark)] lg:via-[var(--app-dark)]/90 lg:to-transparent lg:pt-20">
                      <div>
                        <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
                          {ministry.label}
                        </p>
                        <h3 className="mt-3 font-headline text-heading-md font-normal leading-tight text-white sm:text-heading-lg">
                          {ministry.title}
                        </h3>
                        <p className="mt-3 max-w-lg font-ui text-body-sm leading-[1.75] text-white/78">
                          {ministry.description}
                        </p>
                      </div>
                      <span className="mt-6 inline-flex items-center gap-2 self-start font-ui text-label font-bold uppercase tracking-[0.12em] text-white">
                        Learn more
                        <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </ScrollFadeIn>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-[var(--app-ink)]/10 bg-[var(--app-canvas)] py-14 sm:py-18 lg:py-24">
        <Container size="xl">
          <ScrollFadeIn className="max-w-2xl">
            <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Your next step
            </p>
            <h2 className="mt-3 font-headline text-heading-md font-normal leading-tight text-[var(--app-ink)] sm:text-heading-lg">
              A simple path from visiting to belonging.
            </h2>
          </ScrollFadeIn>
          <div className="mt-10 grid border-y border-[var(--app-ink)]/10 md:grid-cols-3 md:divide-x md:divide-[var(--app-ink)]/10">
            {pathway.map((step, index) => (
              <ScrollFadeIn key={step.number} delay={index * 0.08}>
                <article className="border-b border-[var(--app-ink)]/10 py-8 last:border-b-0 md:min-h-[270px] md:border-b-0 md:px-8 lg:px-10 lg:py-10">
                  <span className="font-ui text-label font-bold tracking-[0.14em] text-[var(--app-primary)]">
                    {step.number}
                  </span>
                  <h3 className="mt-8 font-headline text-heading-md font-normal text-[var(--app-ink)]">
                    {step.title}
                  </h3>
                  <p className="mt-4 font-ui text-body-sm leading-[1.85] text-[var(--app-ink)]/68">
                    {step.body}
                  </p>
                </article>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative bg-[var(--app-dark)] py-16 sm:py-20 lg:py-24">
        <SectionGlow />
        <Container size="lg">
          <ScrollFadeIn className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                We will help you connect
              </p>
              <h2 className="mt-4 max-w-2xl font-headline text-heading-md font-normal leading-[1.15] text-white sm:text-heading-lg lg:text-display-sm">
                Not sure where you belong yet?
              </h2>
              <p className="mt-5 max-w-xl font-ui text-body-sm leading-[1.85] text-white/78">
                Tell us a little about yourself. Our welcome team will listen,
                answer your questions, and personally guide you to the right
                ministry—without pressure.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/contact?topic=connect"
                className={primaryActionClass}
              >
                Help me connect <Arrow />
              </Link>
              <Link
                href="/pastoral"
                className="inline-flex min-h-12 items-center justify-center gap-2.5 border border-white/25 px-6 py-3 font-ui text-label font-semibold text-white transition hover:border-white/55 hover:bg-white/[0.06]"
              >
                Prayer &amp; pastoral care <Arrow />
              </Link>
            </div>
          </ScrollFadeIn>
        </Container>
      </section>
    </main>
  );
}
