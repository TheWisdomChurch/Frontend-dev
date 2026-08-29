import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import SiteHero from '@/features/hero/SiteHero';
import MinistryGallery from '@/features/ministries/MinistryGallery';
import { VideoEmbed } from '@/shared/ui/VideoEmbed';
import {
  Container,
  CtaLink,
  Eyebrow,
  Figure,
  Page,
  Section,
  SectionHeader,
  Split,
} from '@/shared/ui/layout';

/* ============================================================================
   Every ministry page is composed from this one template so /ministries/women,
   /men, /youth, /children and /outreach share a single architecture. Sections
   with no data yet (leader, activities, conference) are simply omitted until
   the details land — the page still reads as complete.
============================================================================ */

export type MinistryImage = { src: string; alt: string };

export type MinistryContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image?: string;
  };
  primaryCta: { label: string; href: string };
  introduction: {
    label: string;
    title: string;
    body: string;
    image: MinistryImage;
  };
  /** Vision + mission (or any pair of guiding statements). */
  pillars: {
    eyebrow: string;
    title: string;
    items: readonly { label: string; title: string; body: string }[];
  };
  /** The person who carries the ministry — convener, lead, coordinator. */
  leader?: {
    label: string;
    title: string;
    body: string;
    image: MinistryImage;
  };
  focus: {
    eyebrow: string;
    title: string;
    items: readonly { title: string; body: string }[];
  };
  /** Optional deeper "what we do" list — kept for ministries that have it. */
  activities?: {
    eyebrow: string;
    title: string;
    items: readonly { title: string; description: string }[];
  };
  conference?: {
    eyebrow: string;
    title: string;
    description: string;
    images: readonly MinistryImage[];
  };
  /** "Missed the last conference? Watch and be blessed" — a replay embed. */
  conferenceVideo?: {
    eyebrow: string;
    title: string;
    description?: string;
    youtubeSrc: string;
    youtubeTitle: string;
  };
  invitation: {
    label: string;
    title: string;
    body: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export default function MinistryPageTemplate({
  content,
  extra,
}: {
  content: MinistryContent;
  /** Slot for a page-specific section (e.g. the children's photo carousel). */
  extra?: ReactNode;
}) {
  const {
    hero,
    primaryCta,
    introduction,
    pillars,
    leader,
    focus,
    activities,
    conference,
    conferenceVideo,
    invitation,
  } = content;

  return (
    <Page tone="surface">
      <SiteHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.description}
        backgroundImage={hero.image}
        priority
        actions={
          <CtaLink href={primaryCta.href}>
            {primaryCta.label} <ArrowRight className="ml-2 h-4 w-4" />
          </CtaLink>
        }
      />

      {/* ── Introduction ─────────────────────────────────────── */}
      <Section>
        <Container>
          <Split className="lg:grid-cols-[0.88fr_1.12fr]">
            <SectionHeader
              eyebrow={introduction.label}
              title={introduction.title}
              description={introduction.body}
              size="sm"
            />
            <div data-gsap="reveal">
              <Figure
                src={introduction.image.src}
                alt={introduction.image.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 56vw"
                className="aspect-[4/3] sm:aspect-[16/10]"
                imageClassName="object-center"
              />
            </div>
          </Split>
        </Container>
      </Section>

      {/* ── Vision + Mission ─────────────────────────────────── */}
      <Section tone="dark">
        <Container>
          <div className="mb-12 max-w-3xl lg:mb-16">
            <SectionHeader
              eyebrow={pillars.eyebrow}
              title={pillars.title}
              tone="dark"
              size="sm"
            />
          </div>
          <div className="grid gap-px overflow-hidden rounded-card border border-[var(--app-border)] bg-[var(--app-border)] lg:grid-cols-2">
            {pillars.items.map(item => (
              <article
                key={item.label}
                data-gsap="reveal"
                className="tone-dark bg-[var(--app-dark)] p-8 sm:p-12 lg:p-14"
              >
                <Eyebrow>{item.label}</Eyebrow>
                <h3 className="mt-4 max-w-xl font-ui text-heading-md font-semibold leading-tight tracking-[-0.02em] text-[var(--app-text)] sm:text-heading-lg">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-xl font-ui text-body-md leading-loose text-[var(--app-muted)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Leader ───────────────────────────────────────────── */}
      {leader ? (
        <Section>
          <Container>
            <Split reverse className="lg:grid-cols-[0.9fr_1.1fr]">
              <div
                data-gsap="reveal"
                className="mx-auto w-full max-w-xl lg:mx-0"
              >
                <Figure
                  src={leader.image.src}
                  alt={leader.image.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  className="aspect-[4/5]"
                  imageClassName="object-[50%_22%]"
                />
              </div>
              <SectionHeader
                eyebrow={leader.label}
                title={leader.title}
                description={leader.body}
                size="sm"
              />
            </Split>
          </Container>
        </Section>
      ) : null}

      {/* ── Focus / the journey ──────────────────────────────── */}
      <Section tone="canvas">
        <Container>
          <SectionHeader
            eyebrow={focus.eyebrow}
            title={focus.title}
            size="sm"
          />
          <div className="mt-12 grid overflow-hidden rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] md:grid-cols-3">
            {focus.items.map(item => (
              <article
                key={item.title}
                data-gsap="reveal"
                className="min-h-56 border-b border-[var(--app-border)] p-8 last:border-b-0 sm:p-10 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <span
                  className="mb-8 block h-px w-12 bg-[var(--app-primary)]"
                  aria-hidden="true"
                />
                <h3 className="font-ui text-heading-md font-semibold tracking-[-0.02em] text-[var(--app-ink)]">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-sm font-ui text-body-sm leading-loose text-[var(--app-muted)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── What we do (optional) ────────────────────────────── */}
      {activities ? (
        <Section>
          <Container>
            <SectionHeader
              eyebrow={activities.eyebrow}
              title={activities.title}
              size="sm"
            />
            <div className="mt-10 grid grid-cols-1 gap-x-12 sm:grid-cols-2">
              {activities.items.map(item => (
                <div
                  key={item.title}
                  data-gsap="reveal"
                  className="border-t border-[var(--app-border)] py-8"
                >
                  <div className="mb-4 h-[1.5px] w-6 bg-[var(--app-primary)]/50" />
                  <h3 className="font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-ui text-body-sm leading-[1.9] text-[var(--app-muted)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ── Conference gallery (optional) ────────────────────── */}
      {conference ? (
        <Section tone="canvas">
          <Container>
            <Split>
              <SectionHeader
                eyebrow={conference.eyebrow}
                title={conference.title}
                description={conference.description}
                size="sm"
              />
              <MinistryGallery images={conference.images} />
            </Split>
          </Container>
        </Section>
      ) : null}

      {/* ── Conference replay (optional) ─────────────────────── */}
      {conferenceVideo ? (
        <Section tone="dark">
          <Container>
            <div className="mb-10 max-w-3xl">
              <SectionHeader
                eyebrow={conferenceVideo.eyebrow}
                title={conferenceVideo.title}
                description={conferenceVideo.description}
                tone="dark"
                size="sm"
              />
            </div>
            <div data-gsap="reveal">
              <VideoEmbed
                src={conferenceVideo.youtubeSrc}
                title={conferenceVideo.youtubeTitle}
              />
            </div>
          </Container>
        </Section>
      ) : null}

      {extra}

      {/* ── Invitation ───────────────────────────────────────── */}
      <Section tone="brand">
        <Container className="text-center">
          <SectionHeader
            eyebrow={invitation.label}
            title={invitation.title}
            description={invitation.body}
            size="sm"
            align="center"
            className="mx-auto max-w-3xl [&_p]:mx-auto"
          />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <CtaLink href={invitation.primaryHref} variant="dark">
              {invitation.primaryLabel}
            </CtaLink>
            <CtaLink href={invitation.secondaryHref} variant="outline">
              {invitation.secondaryLabel}
            </CtaLink>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
