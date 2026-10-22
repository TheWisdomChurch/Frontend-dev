import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  Flame,
  GraduationCap,
  HeartHandshake,
  Shield,
  Sparkles,
} from 'lucide-react';

import SiteHero from '@/features/hero/SiteHero';
import Arrow from '@/shared/ui/icons/Arrow';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';
import { Container, Page, Section, SectionHeader } from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';
import SectionFlowDock, {
  type FlowDockItem,
} from '@/shared/components/SectionFlowDock';

export const metadata: Metadata = buildPageMetadata({
  title: 'Ministries — Find Your Place',
  description:
    "Prayer, Youth, Men's, Women's, Evangelism, and Children's ministries at The Wisdom Church, Lagos — find a community for every season of life and take a clear next step into fellowship, discipleship, and service.",
  path: '/ministries',
  keywords: [
    'church ministries Lagos',
    "men's ministry Lagos",
    "women's ministry Lagos",
    'youth ministry Lagos',
    "children's church Lagos",
    'prayer ministry',
    'evangelism outreach Lagos',
  ],
});

const FLOW_DOCK_MINISTRIES: readonly FlowDockItem[] = [
  {
    id: 'dock-prayer',
    title: 'Prayer Ministry',
    description: 'The engine room · Interceding and keeping the altar burning',
    badge: 'Weekly Altar',
    icon: 'flame',
    href: '/ministries/prayer',
  },
  {
    id: 'dock-youth',
    title: 'Youth Ministry',
    description: 'Teenagers & young adults grounded in Word and purpose',
    badge: 'Bi-Weekly',
    icon: 'sparkles',
    href: '/ministries/youth',
  },
  {
    id: 'dock-men',
    title: "Men's Ministry",
    description: 'Brotherhood, conviction, spiritual discipline and leadership',
    badge: 'Monthly',
    icon: 'shield',
    href: '/ministries/men',
  },
  {
    id: 'dock-women',
    title: "Women's Ministry",
    description: 'Women growing together in the Word, grace and fellowship',
    badge: 'Monthly',
    icon: 'heart-handshake',
    href: '/ministries/women',
  },
  {
    id: 'dock-outreach',
    title: 'Evangelism & Outreach',
    description:
      'Sharing the gospel and expressing Christ’s love in communities',
    badge: 'Outreaches',
    icon: 'compass',
    href: '/ministries/outreach',
  },
  {
    id: 'dock-children',
    title: "Children's Ministry",
    description:
      'A safe, joyful place for nursery to pre-teens learning God’s truth',
    badge: 'Kingdom Kids',
    icon: 'graduation-cap',
    href: '/ministries/children',
  },
];

const ministries = [
  {
    title: 'Prayer Ministry',
    label: 'The engine room',
    description:
      'A community giving itself to prayer — interceding for the church, the city, and one another, and keeping the altar burning continuously.',
    href: '/ministries/prayer',
    icon: Flame,
    tag: 'Spiritual Altar',
    highlights: ['Weekly Intercession', 'City-Wide Prayer', 'Altar Fire'],
  },
  {
    title: 'Youth Ministry',
    label: 'Teenagers & young adults',
    description:
      'A Christ-centred community where a new generation is grounded in Scripture, prayer, purpose, and godly friendships.',
    href: '/ministries/youth',
    icon: Sparkles,
    tag: 'Next Gen',
    highlights: [
      'Godly Friendships',
      'Scripture Foundations',
      'Purpose & Calling',
    ],
  },
  {
    title: "Men's Ministry",
    label: 'Brotherhood & discipleship',
    description:
      'A brotherhood forming men of conviction, spiritual discipline, integrity, and servant leadership across society.',
    href: '/ministries/men',
    icon: Shield,
    tag: 'Kingdom Men',
    highlights: ['Spiritual Discipline', 'Integrity & Family', 'Leadership'],
  },
  {
    title: "Women's Ministry",
    label: 'Women in every season',
    description:
      'Women growing together in the Word, prayer, fellowship, and the grace to live faithfully in every season of life.',
    href: '/ministries/women',
    icon: HeartHandshake,
    tag: 'Virtuous Grace',
    highlights: ['Word & Prayer', 'Life Fellowship', 'Faithful Grace'],
  },
  {
    title: 'Evangelism Outreach',
    label: 'Beyond our walls',
    description:
      'Sharing the gospel with clarity and courage, and expressing the love of Christ through practical care in our communities.',
    href: '/ministries/outreach',
    icon: Compass,
    tag: 'City Mission',
    highlights: ['Gospel Proclamation', 'Community Relief', 'Soul Winning'],
  },
  {
    title: "Children's Ministry",
    label: 'Nursery to pre-teens',
    description:
      'A safe, joyful place where children are known, cared for, and taught the truth of God’s Word at their level.',
    href: '/ministries/children',
    icon: GraduationCap,
    tag: 'Kingdom Kids',
    highlights: ['Bible Lessons', 'Safe Nursery', 'Worship & Joy'],
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
    <Page
      tone="surface"
      className="bg-[var(--app-dark)] text-[var(--app-text)] overflow-hidden"
    >
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
        backgroundImage="/Picflow/DSC00268-copy.webp"
        imagePositionClassName="object-center"
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

      {/* ── 1. Floating Ministries Dock (Matches Growth Portal Design & Flow) ──── */}
      <SectionFlowDock
        label="Ministries Directory"
        items={FLOW_DOCK_MINISTRIES}
      />

      <Section tone="canvas">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
            <SectionHeader
              eyebrow="More than a Sunday crowd"
              title="We grow best when we walk with others."
              size="sm"
            />
            <div className="border-l-2 border-[color-mix(in_srgb,var(--app-primary)_55%,transparent)] pl-5 sm:pl-7">
              <p className="max-w-2xl font-ui text-body-md leading-[1.85] text-[var(--app-muted)]">
                Ministry is where church becomes personal. It is where names are
                remembered, prayers are shared, disciples are formed, and every
                generation finds room to flourish in Christ.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 2. Ministries Directory Grid (High-End Obsidian Design, No Photo Backgrounds) ─ */}
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
              size="sm"
            />
            <p className="max-w-md font-ui text-body-sm leading-[1.8] text-[var(--app-muted)]">
              Choose a ministry to learn what happens, who it serves, and how to
              join. You do not need to have everything figured out first.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.map(ministry => {
              const Icon = ministry.icon;
              return (
                <div key={ministry.title} data-gsap="reveal" className="h-full">
                  <Link
                    href={ministry.href}
                    aria-label={`Explore ${ministry.title}`}
                    className="group relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[var(--app-dark-2)] via-[var(--app-dark)] to-black/95 p-6 sm:p-7 text-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-[var(--app-primary)]/60 hover:shadow-2xl hover:shadow-[var(--app-primary)]/10"
                  >
                    {/* Ambient Gold Radial Glow on Hover */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-px -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_srgb,var(--app-primary)_20%,transparent)_0%,transparent_70%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                    />

                    {/* Top Row: Icon badge + Tag */}
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--app-primary)]/40 bg-[var(--app-primary)]/15 text-[var(--app-primary-light)] transition-transform duration-500 group-hover:scale-110">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--app-primary-light)]">
                          {ministry.tag}
                        </span>
                      </div>

                      <div className="mt-6 space-y-2">
                        <p className="font-ui text-caption font-bold uppercase tracking-[0.2em] text-[var(--app-primary-light)]">
                          {ministry.label}
                        </p>
                        <h3 className="font-ui text-heading-md font-bold text-white transition-colors group-hover:text-[var(--app-primary-light)]">
                          {ministry.title}
                        </h3>
                        <p className="font-ui text-body-sm leading-relaxed text-white/75 pt-1">
                          {ministry.description}
                        </p>
                      </div>

                      {/* Highlights Pills */}
                      <div className="mt-5 flex flex-wrap gap-1.5 pt-1">
                        {ministry.highlights.map(hl => (
                          <span
                            key={hl}
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-ui text-[11px] font-medium text-white/80"
                          >
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA Action Button */}
                    <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
                      <span className="font-ui text-xs font-bold uppercase tracking-wider text-[var(--app-primary-light)] group-hover:text-white transition-colors">
                        Explore Ministry
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--app-primary)]/30 bg-[var(--app-primary)]/10 text-[var(--app-primary-light)] transition-all duration-300 group-hover:border-[var(--app-primary)] group-hover:bg-[var(--app-primary)] group-hover:text-[var(--app-dark)]">
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Your next step"
            title="A simple path from visiting to belonging."
            size="sm"
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
            <SectionHeader
              eyebrow="We will help you connect"
              title="Not sure where you belong yet?"
              description="Tell us a little about yourself. Our welcome team will listen, answer your questions, and personally guide you to the right ministry — without pressure."
              tone="dark"
              size="sm"
              className="max-w-2xl"
            />
            <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-4 lg:flex-col lg:items-start">
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
