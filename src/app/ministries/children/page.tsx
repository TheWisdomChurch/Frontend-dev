import type { Metadata } from 'next';

import MinistryPageTemplate, {
  type MinistryPageConfig,
} from '@/features/ministries/MinistryPageTemplate';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import SectionGlow from '@/shared/ui/SectionGlow';
import { buildPageMetadata } from '@/lib/seo';
import ChildrenGallery from './ChildrenGallery';

export const metadata: Metadata = buildPageMetadata({
  title: "Children's Ministry",
  description:
    'A safe, joyful, and Bible-centered ministry for children from nursery through pre-teen years at The Wisdom Church.',
  path: '/ministries/children',
});

const gallerySection = (
  <section className="relative min-w-0 overflow-hidden border-b border-white/8 bg-[var(--app-dark)]">
    <SectionGlow />
    <Container size="xl">
      <ScrollFadeIn className="pt-14 lg:pt-18">
        <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
          Life in our ministry
        </p>
        <h2 className="mt-3 max-w-lg font-headline text-heading-md font-normal leading-snug text-white sm:text-heading-md">
          A glimpse of what Sunday looks like
          <em className="italic text-[var(--app-primary)]/80">
            {' '}
            for your child.
          </em>
        </h2>
      </ScrollFadeIn>
      <div className="pb-14 pt-8 lg:pb-18 lg:pt-10">
        <ChildrenGallery />
      </div>
    </Container>
  </section>
);

const config: MinistryPageConfig = {
  hero: {
    eyebrow: "Children's Ministry",
    title: 'Where little ones meet Jesus.',
    subtitle:
      'Safe, joyful, and built around families — from nursery through pre-teen years.',
    backgroundImage: '/images/easter-service.webp',
  },
  mission: {
    dark: true,
    heading: {
      lead: 'Children should experience church as a place of',
      accent: ' safety, joy, and truth.',
    },
    body: "The children's ministry exists to help young people know God early, feel genuinely cared for at church, and build spiritual foundations that support growth well into their teenage years and beyond.",
  },
  activities: {
    dark: false,
    heading: {
      lead: 'Programs built for',
      accent: ' consistent growth.',
    },
    items: [
      {
        title: 'Bible Teaching',
        description:
          'Scripture brought to life at the right level — engaging, memorable, and built for young minds.',
      },
      {
        title: 'Worship & Response',
        description:
          'Music and worship moments that help children experience the presence of God with joy and openness.',
      },
      {
        title: 'Supervised Care',
        description:
          'Every child is known by name and watched by trained leaders who take safety and warmth seriously.',
      },
      {
        title: 'Family Connection',
        description:
          'Parents stay informed and connected to what their children are learning every time they come in.',
      },
    ],
  },
  extra: gallerySection,
  values: {
    dark: false,
    eyebrow: 'A word to parents',
    heading: {
      lead: 'Your child will be in',
      accent: ' great hands.',
    },
    items: [
      {
        title: 'Safe',
        body: 'Every child is supervised, known by name, and cared for in an environment parents can fully trust.',
      },
      {
        title: 'Joyful',
        body: 'We build experiences children actually look forward to — worship, stories, and moments they carry home.',
      },
      {
        title: 'Grounded',
        body: 'Biblical truth taught at the right level — not watered down, just made real and accessible for young hearts.',
      },
    ],
  },
  cta: {
    dark: true,
    heading: {
      lead: 'Connect your child to a',
      accent: ' community that cares.',
    },
    body: 'Reach out and we will help your family understand what to expect, meet the team, and settle comfortably into the ministry.',
    primaryLabel: 'Connect my family',
    primaryHref: '/contact',
    secondaryLabel: 'See service times',
    secondaryHref: '/events/weekly',
  },
};

export default function ChildrenMinistryPage() {
  return <MinistryPageTemplate config={config} />;
}
