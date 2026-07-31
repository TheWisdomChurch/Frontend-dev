import type { Metadata } from 'next';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';

import { BlogSubscribeForm } from './BlogSubscribeForm';

import PageHero from '@/features/hero/PageHero';
import { H2, BodySM, Eyebrow } from '@/shared/text';
import { Container, Section } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';

export const metadata: Metadata = {
  title: 'Blog & Devotionals',
  description:
    'Insights, devotionals, and articles from The Wisdom Church. Coming soon — watch our messages on YouTube in the meantime.',
  alternates: { canonical: '/resources/blogs' },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[var(--app-dark)] text-white">
      <PageHero
        eyebrow="Blog & Devotionals"
        title="Insights, reflections, and devotionals from the church."
        subtitle="Written content to encourage, teach, and equip you between Sundays."
      />

      <Section
        padding="lg"
        className="relative overflow-hidden bg-[var(--app-dark)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(201,150,26,0.07),transparent_40%)]" />

        <Container size="xl" className="relative z-10">
          <ScrollFadeIn className="mx-auto max-w-2xl text-center">
            {/* Gold rule */}
            <div className="mx-auto mb-8 h-px w-14 bg-[var(--app-primary)]" />

            <Eyebrow className="text-[var(--app-primary)]">Coming soon</Eyebrow>

            <H2 className="mt-4 text-[var(--type-display-sm)] font-headline font-normal text-white">
              We are preparing devotionals
              <br className="hidden sm:block" /> and articles for you.
            </H2>

            <BodySM className="mx-auto mt-5 max-w-lg text-white/70 leading-[1.9]">
              Our team is working on written content — devotionals, sermon
              notes, and reflections — that will live here. Check back soon.
            </BodySM>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2.5 bg-[var(--app-primary)] px-7 font-ui text-label font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:brightness-105 active:scale-[0.98]"
              >
                <Play className="h-3.5 w-3.5 fill-[var(--app-ink)]" />
                Watch our messages
              </a>

              <Link
                href="/resources/sermons"
                className="inline-flex h-11 items-center gap-2 border border-white/15 bg-transparent px-7 font-ui text-label font-semibold text-white/65 transition hover:border-white/30 hover:text-white"
              >
                Browse sermons
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </ScrollFadeIn>

          {/* Notify me form */}
          <ScrollFadeIn delay={0.1}>
            <div className="mx-auto mt-16 max-w-xl border border-white/8 bg-white/[0.025] p-8 text-center">
              <p className="font-ui text-label font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
                Get notified
              </p>
              <p className="mt-2 font-ui text-body-sm text-white/70">
                Be the first to know when devotionals and articles go live. Drop
                your email below.
              </p>
              <div className="mt-6 flex justify-center">
                <BlogSubscribeForm />
              </div>
            </div>
          </ScrollFadeIn>

          {/* WhatsApp update strip */}
          <ScrollFadeIn delay={0.15}>
            <div className="mx-auto mt-5 max-w-xl border border-white/8 bg-white/[0.025] p-6 text-center">
              <p className="font-ui text-label font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
                Or join our community
              </p>
              <p className="mt-2 font-ui text-body-sm text-white/65">
                Get devotionals, sermon notes, and church updates directly via
                WhatsApp.
              </p>
              <a
                href="https://wa.me/2347069995333"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-10 items-center gap-2 border border-[var(--app-whatsapp)]/25 bg-[var(--app-whatsapp)]/10 px-5 font-ui text-label font-bold text-[var(--app-whatsapp)] transition hover:bg-[var(--app-whatsapp)]/18"
              >
                Join WhatsApp community
              </a>
            </div>
          </ScrollFadeIn>
        </Container>
      </Section>
    </main>
  );
}
