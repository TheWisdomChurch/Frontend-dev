import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

import { WOMEN_MINISTRY_CONTENT as content } from '@/content/womenMinistry';
import WomenConferenceGallery from '@/features/ministries/WomenConferenceGallery';
import SiteHero from '@/features/hero/SiteHero';
import { buildPageMetadata } from '@/lib/seo';
import {
  EditorialContainer,
  EditorialHeader,
  EditorialImage,
  EditorialLink,
  EditorialSection,
  EditorialSplit,
} from '@/shared/ui/editorial';

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
          <EditorialSplit className="lg:grid-cols-[0.88fr_1.12fr]">
            <EditorialHeader
              eyebrow={content.introduction.label}
              title={content.introduction.title}
              description={content.introduction.body}
            />
            <div data-gsap="reveal">
              <EditorialImage
                src={content.introduction.image.src}
                alt={content.introduction.image.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 56vw"
                className="aspect-[4/3] sm:aspect-[16/10]"
                imageClassName="object-center"
              />
            </div>
          </EditorialSplit>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="dark">
        <EditorialContainer>
          <div className="mb-12 max-w-3xl lg:mb-16">
            <EditorialHeader
              eyebrow="What guides us"
              title="Rooted in Christ. Prepared for every sphere."
              tone="dark"
            />
          </div>
          <div className="grid gap-px overflow-hidden rounded-card border border-white/10 bg-white/15 lg:grid-cols-2">
            {[content.vision, content.mission].map(item => (
              <article
                key={item.label}
                data-gsap="reveal"
                className="bg-[var(--app-dark)] p-8 sm:p-12 lg:p-16"
              >
                <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                  {item.label}
                </p>
                <h3 className="mt-5 max-w-xl font-ui text-heading-lg font-medium leading-tight tracking-[-0.035em] !text-white sm:text-display-sm">
                  {item.title}
                </h3>
                <p className="mt-6 max-w-xl font-ui text-body-lg leading-loose text-white/70">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection>
        <EditorialContainer>
          <EditorialSplit reverse className="lg:grid-cols-[0.9fr_1.1fr]">
            <div data-gsap="reveal" className="mx-auto w-full max-w-xl lg:mx-0">
              <EditorialImage
                src={content.headConvener.image.src}
                alt={content.headConvener.image.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="aspect-[4/5]"
                imageClassName="object-[50%_22%]"
              />
            </div>
            <EditorialHeader
              eyebrow={content.headConvener.label}
              title={content.headConvener.title}
              description={content.headConvener.body}
            />
          </EditorialSplit>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="canvas">
        <EditorialContainer>
          <EditorialHeader
            eyebrow="The journey"
            title="Grow. Lead. Flourish."
          />
          <div className="mt-12 grid overflow-hidden rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] md:grid-cols-3">
            {content.focus.map(item => (
              <article
                key={item.title}
                data-gsap="reveal"
                className="min-h-64 border-b border-[var(--app-border)] p-8 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-10"
              >
                <span
                  className="mb-10 block h-px w-12 bg-[var(--app-primary)]"
                  aria-hidden="true"
                />
                <h3 className="font-ui text-heading-lg font-medium tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-sm font-ui text-body-md leading-loose text-[var(--app-ink)]/65">
                  {item.body}
                </p>
              </article>
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
