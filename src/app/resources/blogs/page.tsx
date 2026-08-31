import type { Metadata } from 'next';
import { Play, ArrowRight } from 'lucide-react';

import { BlogSubscribeForm } from './BlogSubscribeForm';

import SiteHero from '@/features/hero/SiteHero';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import {
  Container,
  CtaLink,
  Eyebrow,
  Page,
  Panel,
  Section,
  SectionHeader,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';

export const metadata: Metadata = {
  title: 'Blog & Devotionals',
  description:
    'Insights, devotionals, and articles from The Wisdom Church. Coming soon — watch our messages on YouTube in the meantime.',
  alternates: { canonical: '/resources/blogs' },
};

export default function BlogPage() {
  return (
    <Page tone="dark">
      <SiteHero
        backgroundImage="/Picflow/DSC00019-copy.webp"
        eyebrow="Blog & Devotionals"
        title="Insights, reflections, and devotionals from the church."
        subtitle="Written content to encourage, teach, and equip you between Sundays."
      />

      <Section tone="dark">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeader
              eyebrow="Coming soon"
              title="We are preparing devotionals and articles for you."
              description="Our team is working on written content—devotionals, sermon notes, and reflections—that will live here. Check back soon."
              tone="dark"
            />

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('primary')}
              >
                <Play className="h-3.5 w-3.5 fill-[var(--app-ink)]" />
                Watch our messages
              </a>

              <CtaLink href="/resources/sermons" variant="outline">
                Browse sermons <ArrowRight className="h-3.5 w-3.5" />
              </CtaLink>
            </div>
          </div>

          <Panel tone="dark" className="mx-auto mt-16 max-w-xl p-8 text-center">
            <Eyebrow>Get notified</Eyebrow>
            <p className="mt-2 font-ui text-body-sm text-white/70">
              Be the first to know when devotionals and articles go live. Drop
              your email below.
            </p>
            <div className="mt-6 flex justify-center">
              <BlogSubscribeForm />
            </div>
          </Panel>

          {/* WhatsApp update strip */}
          <Panel tone="dark" className="mx-auto mt-5 max-w-xl p-6 text-center">
            <Eyebrow>Or join our community</Eyebrow>
            <p className="mt-2 font-ui text-body-sm text-white/65">
              Get devotionals, sermon notes, and church updates directly via
              WhatsApp.
            </p>
            <a
              href="https://wa.me/2347069995333"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-10 items-center gap-2 border border-[color-mix(in_srgb,var(--app-whatsapp)_25%,transparent)] bg-[color-mix(in_srgb,var(--app-whatsapp)_10%,transparent)] px-5 font-ui text-label font-bold text-[var(--app-whatsapp)] transition hover:bg-[color-mix(in_srgb,var(--app-whatsapp)_18%,transparent)]"
            >
              Join WhatsApp community
            </a>
          </Panel>
        </Container>
      </Section>
    </Page>
  );
}
