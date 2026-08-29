import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import SiteHero from '@/features/hero/SiteHero';
import Arrow from '@/shared/ui/icons/Arrow';
import { IMAGE_QUALITY } from '@/shared/constants';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';
import {
  CardRail,
  Container,
  Eyebrow,
  Page,
  Section,
  SectionHeader,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';

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
    image: '/Picflow/menleaders.webp',
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
    image: '/Picflow/DSC00019 copy.webp',
    position: 'object-[center_42%]',
  },
] as const;

const pathway = [
  {
    title: 'Discover',
    body: 'Explore each ministry and find the community that fits your season of life.',
  },
  {
    title: 'Meet the team',
    body: 'Tell our welcome team where you would like to connect. A real person will help you take the next step.',
  },
  {
    title: 'Grow and serve',
    body: 'Build relationships, grow through discipleship, and use your gifts in the life of the church.',
  },
] as const;

export default function MinistriesPage() {
  return (
    <Page className="overflow-hidden">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Ministries', path: '/ministries' },
        ])}
      />

      <SiteHero
        eyebrow="Life together"
        title="There is a place for you in this church family."
        subtitle="Find a community where you can be known, grow in Christ, build lasting relationships, and serve with the gifts God has given you."
        backgroundImage="/Picflow/DSC00268 copy.webp"
        imagePositionClassName="object-[62%_38%] sm:object-[center_35%]"
        chips={['Belong', 'Grow', 'Serve']}
        actions={
          <>
            <Link href="#find-a-ministry" className={buttonClass('primary')}>
              Find a ministry <Arrow />
            </Link>
            <Link
              href="/contact?topic=connect"
              className={buttonClass('outline')}
            >
              Help me choose <Arrow />
            </Link>
          </>
        }
      />

      <Section tone="canvas">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
            <SectionHeader
              eyebrow="More than a Sunday crowd"
              title="We grow best when we walk with others."
            />
            <div className="border-l-2 border-[var(--app-primary)]/55 pl-5 sm:pl-7">
              <p className="max-w-2xl font-ui text-body-md leading-[1.85] text-[var(--app-muted)]">
                Ministry is where church becomes personal. It is where names are
                remembered, prayers are shared, disciples are formed, and every
                generation finds room to flourish in Christ.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section
        id="find-a-ministry"
        tone="dark"
        className="scroll-mt-24 bg-[linear-gradient(180deg,var(--app-dark-2),var(--app-dark))]"
      >
        <Container>
          <div className="mb-12 flex flex-col gap-4 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="Find your community"
              title="Explore our ministries"
              tone="dark"
            />
            <p className="max-w-md font-ui text-body-sm leading-[1.8] text-[var(--app-muted)]">
              Choose a ministry to learn what happens, who it serves, and how to
              join. You do not need to have everything figured out first.
            </p>
          </div>

          <CardRail columns={3} className="gap-5">
            {ministries.map(ministry => (
              <div key={ministry.title} data-gsap="reveal">
                <Link
                  href={ministry.href}
                  aria-label={`Explore ${ministry.title}`}
                  className="group relative flex min-h-[24rem] flex-col overflow-hidden rounded-image bg-[var(--app-dark)] ring-1 ring-inset ring-[var(--app-border)] transition-[transform,box-shadow,ring-color] duration-500 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--app-dark)] motion-safe:hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40 hover:ring-[var(--app-primary)]/40 sm:min-h-[28rem] lg:min-h-[32rem]"
                >
                  {/* Image */}
                  <Image
                    src={ministry.image}
                    alt=""
                    fill
                    quality={IMAGE_QUALITY}
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className={`object-cover ${ministry.position} transition-transform duration-[900ms] ease-out motion-safe:group-hover:scale-[1.05] motion-reduce:transition-none`}
                  />

                  {/* Linear dark gradients — top scrim for the header, deeper
                      bottom scrim that grows on hover to seat the description. */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-[linear-gradient(to_bottom,var(--app-dark),transparent)] opacity-90" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-[linear-gradient(to_top,var(--app-dark),transparent)] opacity-95 transition-[height] duration-700 ease-out group-hover:h-[78%]" />

                  {/* Content — header pinned top, detail + CTA at the bottom */}
                  <div className="relative flex flex-1 flex-col justify-between gap-8 p-6 sm:p-7 lg:p-8">
                    <div>
                      <p className="font-ui text-eyebrow font-semibold uppercase tracking-[0.22em] text-[var(--app-primary-light)]">
                        {ministry.label}
                      </p>
                      <h3 className="mt-3.5 font-ui text-heading-lg font-semibold leading-tight text-white sm:text-display-sm">
                        {ministry.title}
                      </h3>
                    </div>

                    <div>
                      <p className="max-w-sm font-ui text-body-sm leading-[1.8] text-white/80 transition-all duration-500 ease-out motion-reduce:transition-none md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                        {ministry.description}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 font-ui text-label font-bold uppercase tracking-[0.14em] text-white">
                        Learn more
                        <Arrow className="transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </CardRail>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Your next step"
            title="A simple path from visiting to belonging."
          />
          <div className="mt-10 grid border-y border-[var(--app-border)] md:grid-cols-3 md:divide-x md:divide-[var(--app-border)]">
            {pathway.map(step => (
              <div key={step.title} data-gsap="reveal">
                <article className="border-b border-[var(--app-border)] py-8 last:border-b-0 md:min-h-[270px] md:border-b-0 md:px-8 lg:px-10 lg:py-10">
                  <h3 className="font-ui text-heading-md font-semibold text-[var(--app-ink)]">
                    {step.title}
                  </h3>
                  <p className="mt-4 font-ui text-body-sm leading-[1.85] text-[var(--app-muted)]">
                    {step.body}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="dark">
        <Container>
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Eyebrow>We will help you connect</Eyebrow>
              <h2 className="mt-4 max-w-2xl font-ui text-heading-md font-medium leading-[1.05] tracking-[-0.04em] text-white sm:text-heading-lg lg:text-display-sm">
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
                className={buttonClass('primary')}
              >
                Help me connect <Arrow />
              </Link>
              <Link href="/pastoral" className={buttonClass('outline')}>
                Prayer &amp; pastoral care <Arrow />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
