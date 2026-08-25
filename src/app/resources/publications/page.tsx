import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Download, MessageCircle } from 'lucide-react';

import SiteHero from '@/features/hero/SiteHero';
import { H2, BodySM, Eyebrow } from '@/shared/text';
import { Container, Section } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';

export const metadata: Metadata = {
  title: 'Publications',
  description:
    'Printed and digital resources from The Wisdom Church — sermon notes, study guides, and devotional materials. Coming soon.',
  alternates: { canonical: '/resources/publications' },
};

const available = [
  {
    label: 'Sermon notes',
    detail: 'Notes from recent messages available after Sunday services.',
    action: 'Request via WhatsApp',
    href: 'https://wa.me/2347069995333',
  },
  {
    label: 'Study materials',
    detail:
      'Bible study guides and small group resources — ask your ministry leader.',
    action: 'Contact us',
    href: '/contact',
  },
  {
    label: 'Prayer resources',
    detail:
      'Prayer guides and schedules shared through our WhatsApp community.',
    action: 'Join WhatsApp',
    href: 'https://wa.me/2347069995333',
  },
];

export default function PublicationPage() {
  return (
    <main className="min-h-screen bg-[var(--app-dark)] text-white">
      <SiteHero
        eyebrow="Publications"
        title="Resources to help you grow between services."
        subtitle="Sermon notes, study guides, and devotional materials from The Wisdom Church."
      />

      <Section
        padding="lg"
        className="relative overflow-hidden bg-[var(--app-dark)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(201,150,26,0.07),transparent_40%)]" />

        <Container size="xl" className="relative z-10">
          <ScrollFadeIn className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-8 h-px w-14 bg-[var(--app-primary)]" />

            <Eyebrow className="text-[var(--app-primary)]">
              In development
            </Eyebrow>

            <H2 className="mt-4 text-[var(--type-display-sm)] font-headline font-normal text-white">
              A digital resource library
              <br className="hidden sm:block" /> is on the way.
            </H2>

            <BodySM className="mx-auto mt-5 max-w-lg text-white/70 leading-[1.9]">
              We are building a proper resource section where you will be able
              to download sermon notes, study guides, and devotional materials.
              Until then, reach out directly and we will get you what you need.
            </BodySM>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://wa.me/2347069995333"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2.5 bg-[var(--app-primary)] px-7 font-ui text-label font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:brightness-105 active:scale-[0.98]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Request via WhatsApp
              </a>

              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 border border-white/15 bg-transparent px-7 font-ui text-label font-semibold text-white/65 transition hover:border-white/30 hover:text-white"
              >
                Contact us
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </ScrollFadeIn>

          {/* Available now cards */}
          <ScrollFadeIn delay={0.1}>
            <div className="mx-auto mt-16 max-w-3xl">
              <p className="mb-5 font-ui text-caption font-bold uppercase tracking-[0.2em] text-white/45">
                Available now — request directly
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {available.map((item, i) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      item.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="group flex flex-col gap-3 rounded-card border border-white/8 bg-white/[0.025] p-5 transition hover:border-[var(--app-primary)]/25 hover:bg-white/[0.04]"
                    // eslint-disable-next-line no-restricted-syntax
                    style={{ transitionDelay: `${i * 40}ms` }}
                  >
                    <Download className="h-4 w-4 text-[var(--app-primary)]" />
                    <div>
                      <p className="font-ui text-body-sm font-semibold text-white">
                        {item.label}
                      </p>
                      <p className="mt-1 font-ui text-label leading-[1.7] text-white/62">
                        {item.detail}
                      </p>
                    </div>
                    <span className="mt-auto inline-flex items-center gap-1.5 font-ui text-label font-semibold text-[var(--app-primary)] transition group-hover:translate-x-0.5">
                      {item.action} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </ScrollFadeIn>
        </Container>
      </Section>
    </main>
  );
}
