import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';
import JsonLd from '@/shared/seo/JsonLd';
import { Container, Page, Section } from '@/shared/ui/layout';

export const metadata: Metadata = buildPageMetadata({
  title: 'Believers Equipping Class',
  description:
    'Deepen your walk in the Spirit and truth through practical discipleship, spiritual gifts mentorship, and hands-on ministry training.',
  path: '/grow/believers-equipping',
  keywords: [
    'Believers Equipping Class',
    'spiritual gifts training',
    'Christian discipleship Lagos',
    'ministry training',
  ],
});

const modules = [
  {
    title: 'Hearing the Voice of God',
    description:
      'Develop a grounded, Scripture-shaped understanding of how the Holy Spirit leads, and grow in discernment as you follow God in everyday life.',
  },
  {
    title: 'The Gifts and Operations of the Holy Spirit',
    description:
      'Explore the gifts of the Spirit, their biblical purpose, and how they serve and strengthen the church with wisdom and love.',
  },
  {
    title: 'Kingdom Stewardship, Prosperity and Faith',
    description:
      'Build a faithful approach to resources, responsibility, generosity, and the life of faith entrusted to every believer.',
  },
  {
    title: 'Spiritual Warfare and Kingdom Authority',
    description:
      'Study the believer’s authority in Christ and learn to stand firm through prayer, the Word, and a life shaped by spiritual maturity.',
  },
];

const outcomes = [
  'Grow from foundational teaching into a more mature, Scripture-rooted faith.',
  'Recognize and steward the gifts God has placed in your life.',
  'Practice serving others in a supported ministry environment.',
  'Build confidence in prayer, spiritual discernment, and kingdom responsibility.',
];

export default function BelieversEquippingPage() {
  return (
    <Page tone="surface" className="bg-[var(--app-dark)] text-[var(--app-text)]">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Growth Portal', path: '/grow' },
          {
            name: 'Believers Equipping Class',
            path: '/grow/believers-equipping',
          },
        ])}
      />

      <Section
        tone="dark"
        className="relative isolate overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,color-mix(in_srgb,var(--app-primary)_20%,transparent)_0%,transparent_70%),var(--app-dark)] py-16 text-white sm:py-24 lg:py-32"
      >
        <Container>
          <Link
            href="/grow#believers-equipping"
            className="mb-12 inline-flex items-center gap-2 font-ui text-sm font-semibold text-white/70 transition-colors hover:text-[var(--app-primary-light)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Growth Portal
          </Link>

          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-ui text-xs font-bold uppercase tracking-[0.18em] text-[var(--app-primary-light)]">
              <Sparkles className="h-4 w-4" />
              Spiritual Dominion &amp; Ministry
            </span>
            <h1 className="mt-7 font-headline text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
              Believers Equipping <span className="text-[var(--app-primary-light)]">Class</span>
            </h1>
            <p className="mt-6 max-w-2xl font-ui text-lg leading-relaxed text-white/75 sm:text-xl">
              Deepening your walk in the Spirit and Truth.
            </p>
            <p className="mt-5 max-w-3xl font-ui text-base leading-8 text-white/70 sm:text-lg">
              Move beyond foundational milk into solid spiritual meat. This
              intensive discipleship pathway is designed to strengthen your
              spiritual authority, form faithful kingdom stewards, help you
              discern the voice of the Holy Spirit, and equip you to serve with
              lasting impact.
            </p>
            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4 font-ui text-sm font-medium text-white/75">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--app-primary-light)]" />
                6-week intensive training cohort
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[var(--app-primary-light)]" />
                Wednesdays · 6:00 PM (WAT)
              </span>
            </div>
            <Link
              href="/grow?register=believers-equipping"
              className="group mt-10 inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[var(--app-primary-dark)] via-[var(--app-primary)] to-[var(--app-primary-light)] px-8 py-4 font-ui text-sm font-bold uppercase tracking-wider text-[var(--app-dark)] shadow-[0_4px_24px_color-mix(in_srgb,var(--app-primary)_35%,transparent)] transition hover:brightness-105"
            >
              Register for Equipping Class
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </Section>

      <Section
        tone="canvas"
        className="border-b border-[var(--app-border)] bg-[var(--app-canvas-2)] py-16 sm:py-24"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-[var(--app-primary-dark)]">
                The pathway
              </p>
              <h2 className="mt-4 font-headline text-3xl font-bold leading-tight text-[var(--app-text)] sm:text-4xl">
                A deeper, practical formation in faith.
              </h2>
            </div>
            <div className="space-y-5 font-ui text-base leading-8 text-[var(--app-muted)]">
              <p>
                The Believers Equipping Class is for Christians ready to grow in spiritual maturity and become more effective in the life and work of the church. Each session brings biblical teaching together with guided discussion, mentorship, and practical application.
              </p>
              <p>
                You will study how the Holy Spirit works, learn to steward spiritual gifts with humility, and explore what it means to exercise kingdom authority in a life of service. The aim is not simply to add knowledge, but to help you live what you learn and serve people well.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="surface" className="border-b border-white/10 bg-[var(--app-dark-2)] py-16 text-white sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-[var(--app-primary-light)]">
              What you will study
            </p>
            <h2 className="mt-4 font-headline text-3xl font-bold text-white sm:text-4xl">
              Deep theological and practical modules
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {modules.map((module, index) => (
              <article key={module.title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
                <span className="font-ui text-sm font-bold text-[var(--app-primary-light)]">MODULE 0{index + 1}</span>
                <h3 className="mt-4 font-headline text-xl font-bold text-white">{module.title}</h3>
                <p className="mt-3 font-ui text-sm leading-7 text-white/65">{module.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="canvas" className="bg-[var(--app-canvas-2)] py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-[var(--app-primary-dark)]">Equipped to serve</p>
              <h2 className="mt-4 font-headline text-3xl font-bold text-[var(--app-text)] sm:text-4xl">Learning that continues into ministry.</h2>
              <p className="mt-5 font-ui leading-8 text-[var(--app-muted)]">
                Training includes spiritual gifts assessment and mentorship, hands-on ministry practice, and pastoral guidance. Participants who complete the pathway are celebrated at the Pastoral Equipping Graduation.
              </p>
            </div>
            <ul className="space-y-4">
              {outcomes.map(outcome => (
                <li key={outcome} className="flex gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 font-ui leading-7 text-[var(--app-text)]">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--app-primary-dark)]" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-14 rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-[var(--app-primary-dark)]">Take your next step</p>
              <h2 className="mt-3 font-headline text-2xl font-bold text-[var(--app-text)] sm:text-3xl">Grow in the Spirit. Serve with purpose.</h2>
              <p className="mt-3 max-w-2xl font-ui leading-7 text-[var(--app-muted)]">Register your interest and our discipleship team will follow up with cohort onboarding details.</p>
            </div>
            <Link
              href="/grow?register=believers-equipping"
              className="group mt-7 inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[var(--app-dark)] px-7 py-4 font-ui text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[var(--app-primary-dark)] lg:mt-0"
            >
              Register for Equipping Class
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
