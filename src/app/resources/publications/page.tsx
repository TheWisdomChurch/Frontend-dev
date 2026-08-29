import type { Metadata } from 'next';
import { ArrowRight, Download, MessageCircle } from 'lucide-react';

import SiteHero from '@/features/hero/SiteHero';
import {
  Container,
  Page,
  SectionHeader,
  CtaLink,
  Section,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';

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
    <Page tone="dark">
      <SiteHero
        backgroundImage="/Picflow/DSC00018-copy.webp"
        eyebrow="Publications"
        title="Resources to help you grow between services."
        subtitle="Sermon notes, study guides, and devotional materials from The Wisdom Church."
      />

      <Section tone="dark">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeader
              eyebrow="In development"
              title="A digital resource library is on the way."
              description="We are building a proper resource section where you will be able to download sermon notes, study guides, and devotional materials. Until then, reach out directly and we will get you what you need."
              tone="dark"
            />

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://wa.me/2347069995333"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('primary')}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Request via WhatsApp
              </a>

              <CtaLink href="/contact" variant="outline">
                Contact us
                <ArrowRight className="h-3.5 w-3.5" />
              </CtaLink>
            </div>
          </div>

          {/* Available now cards */}
          <div className="mx-auto mt-16 max-w-3xl" data-gsap="reveal">
            <p className="mb-5 font-ui text-caption font-bold uppercase tracking-[0.2em] text-[var(--app-subtle)]">
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
                  className="group flex flex-col gap-3 rounded-card border border-[var(--app-border)] bg-white/[0.025] p-5 transition hover:border-[color-mix(in_srgb,var(--app-primary)_25%,transparent)] hover:bg-white/[0.04]"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <Download className="h-4 w-4 text-[var(--app-primary)]" />
                  <div>
                    <p className="font-ui text-body-sm font-semibold text-white">
                      {item.label}
                    </p>
                    <p className="mt-1 font-ui text-label leading-[1.7] text-[var(--app-muted)]">
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
        </Container>
      </Section>
    </Page>
  );
}
