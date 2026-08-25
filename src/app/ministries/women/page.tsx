import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

import { WOMEN_MINISTRY_CONTENT as content } from '@/content/womenMinistry';
import WomenConferenceGallery from '@/features/ministries/WomenConferenceGallery';
import SiteHero from '@/features/hero/SiteHero';
import { buildPageMetadata } from '@/lib/seo';
import {
  EditorialContainer,
  EditorialHeader,
  EditorialLink,
  EditorialSection,
  EditorialSplit,
} from '@/shared/ui/editorial';
import { ScrollFadeIn } from '@/shared/ui/motion';

export const metadata: Metadata = buildPageMetadata({
  title: "Women's Ministry",
  description: content.hero.description,
  path: '/ministries/women',
});

export default function WomenMinistryPage() {
  return (
    <main className="min-h-screen bg-[var(--app-surface)]">
      <SiteHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.description}
        backgroundImage={content.hero.image}
        priority
        actions={
          <EditorialLink href="/contact">
            Join the community <ArrowRight className="ml-2 h-4 w-4" />
          </EditorialLink>
        }
      />

      <EditorialSection>
        <EditorialContainer>
          <EditorialHeader
            eyebrow={content.introduction.label}
            title={content.introduction.title}
            description={content.introduction.body}
            className="max-w-5xl"
          />
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="dark">
        <EditorialContainer>
          <div className="grid gap-px overflow-hidden rounded-card bg-white/15 lg:grid-cols-2">
            {[content.vision, content.mission].map((item, index) => (
              <ScrollFadeIn
                key={item.label}
                delay={index * 0.08}
                className="bg-[var(--app-dark)] p-8 sm:p-12 lg:p-16"
              >
                <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  {item.label}
                </p>
                <h2 className="mt-5 font-headline text-display-sm font-semibold leading-tight tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-6 max-w-xl font-ui text-body-lg leading-loose text-white/70">
                  {item.body}
                </p>
              </ScrollFadeIn>
            ))}
          </div>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="canvas">
        <EditorialContainer>
          <EditorialHeader
            eyebrow="The journey"
            title="Grow. Lead. Flourish."
          />
          <div className="mt-12 border-y border-[var(--app-border)]">
            {content.focus.map((item, index) => (
              <ScrollFadeIn key={item.title} delay={index * 0.05}>
                <article className="grid gap-4 border-b border-[var(--app-border)] py-8 last:border-b-0 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] sm:items-baseline sm:gap-10">
                  <h3 className="font-headline text-heading-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="max-w-xl font-ui text-body-md leading-loose text-[var(--app-ink)]/65">
                    {item.body}
                  </p>
                </article>
              </ScrollFadeIn>
            ))}
          </div>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection>
        <EditorialContainer>
          <EditorialSplit>
            <EditorialHeader
              eyebrow={content.conference.eyebrow}
              title={content.conference.title}
              description={content.conference.description}
            />
            <WomenConferenceGallery images={content.conference.images} />
          </EditorialSplit>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="brand">
        <EditorialContainer className="text-center">
          <EditorialHeader
            eyebrow={content.invitation.label}
            title={content.invitation.title}
            description={content.invitation.body}
            className="mx-auto max-w-4xl [&_p]:mx-auto"
          />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <EditorialLink href="/contact" variant="dark">
              Join the community
            </EditorialLink>
            <EditorialLink href="/events" variant="outline">
              View upcoming gatherings
            </EditorialLink>
          </div>
        </EditorialContainer>
      </EditorialSection>
    </main>
  );
}
