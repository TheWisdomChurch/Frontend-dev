import type { Metadata } from 'next';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about The Wisdom Church vision, leadership, mission, and culture. Discover how we disciple believers and serve our city.',
  openGraph: {
    title: 'About Us | The Wisdom Church',
    description:
      'Learn about The Wisdom Church vision, leadership, mission, and culture.',
    url: 'https://wisdomchurchhq.org/about',
    images: [{ url: 'https://wisdomchurchhq.org/og-image.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | The Wisdom Church',
    description:
      'Learn about The Wisdom Church vision, leadership, mission, and culture.',
    images: ['https://wisdomchurchhq.org/og-image.webp'],
  },
  alternates: { canonical: '/about' },
};
import {
  BookOpen,
  HeartHandshake,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Bishop, PstKenny } from '@/shared/assets';
import { H2, H3, BodyMD, Eyebrow } from '@/shared/text';
import { Container, Section } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import {
  ActionBanner,
  FeatureGrid,
  SplitSection,
  StatStrip,
} from '@/shared/components/site/PublicPageBlocks';

const culturePillars = [
  {
    title: 'Presence-driven worship',
    description:
      'We gather to host the presence of God with reverence, expectation, and joy.',
    icon: Sparkles,
  },
  {
    title: 'Word-shaped discipleship',
    description:
      'Teaching is practical, biblical, and aimed at forming complete believers for daily life.',
    icon: BookOpen,
  },
  {
    title: 'People-first community',
    description:
      'Hospitality, accountability, and care are central to how we build church family.',
    icon: HeartHandshake,
  },
  {
    title: 'Excellence with integrity',
    description:
      'We steward people, systems, and service moments with clarity, order, and consistency.',
    icon: Shield,
  },
];

const stats = [
  {
    label: 'Church vision',
    value: 'Raise complete believers',
    detail:
      'Spiritually mature, biblically grounded, and equipped for purpose.',
    icon: Sparkles,
  },
  {
    label: 'Church culture',
    value: 'Word, power, excellence',
    detail: 'A house shaped by worship, truth, and practical obedience.',
    icon: BookOpen,
  },
  {
    label: 'Community posture',
    value: 'Love and discipleship',
    detail:
      'We build people, not just programs, and keep care close to ministry.',
    icon: Users,
  },
  {
    label: 'Location',
    value: 'Lekki-Epe, Lagos',
    detail:
      'A growing church family serving the city with consistency and faith.',
    icon: HeartHandshake,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--app-dark)] text-white">
      <PageHero
        variant="about"
        eyebrow="About Wisdom Church"
        title="A church family committed to wisdom, power, and faithful formation."
        subtitle="The Wisdom Church exists to help people know Christ deeply, grow in truth, and live with conviction in every sphere of life."
        note="We are building a strong, Spirit-filled church where worship is sincere, teaching is clear, and community is intentional."
        chips={[
          'Spirit-filled',
          'Biblically grounded',
          'People-focused',
          'Lagos',
        ]}
      />

      <ScrollFadeIn>
        <StatStrip items={stats} />
      </ScrollFadeIn>

      <Section padding="lg" className="bg-[var(--app-dark)]">
        <Container size="xl">
          <ScrollFadeIn>
            <SplitSection
              eyebrow="Our identity"
              title="We are building a house where people grow in Christ with clarity and consistency."
              description="The Wisdom Church is a trans-generational church community committed to forming believers who can stand strong in truth, serve others with grace, and walk boldly in their calling."
              points={[
                'Biblical teaching that connects doctrine to everyday living.',
                'Worship gatherings that make room for prayer, reverence, and joy.',
                'Pastoral care that stays close to people through real life situations.',
                'Ministries that help children, youth, families, and professionals find their place.',
              ]}
              panelTitle="How we define growth"
              panelBody="Growth at Wisdom Church is not just attendance. It means being formed in character, conviction, spiritual maturity, and service."
              panelItems={[
                'Grow in the Word and prayer life.',
                'Belong to a caring church family.',
                'Discover gifts and begin serving.',
                'Live with purpose in home, work, and city life.',
              ]}
            />
          </ScrollFadeIn>
        </Container>
      </Section>

      <Section
        padding="lg"
        className="border-y border-white/10 bg-[var(--app-dark-2)]"
      >
        <Container size="xl" className="space-y-8">
          <ScrollFadeIn className="mx-auto max-w-3xl space-y-3 text-center">
            <Eyebrow className="text-[var(--app-primary)]">
              House culture
            </Eyebrow>
            <H2 className="text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
              Four commitments shape how we lead, gather, and serve.
            </H2>
          </ScrollFadeIn>

          <ScrollFadeIn delay={0.1}>
            <FeatureGrid items={culturePillars} columns={4} />
          </ScrollFadeIn>
        </Container>
      </Section>

      <Section padding="lg" className="bg-[var(--app-dark)]">
        <Container size="xl" className="space-y-8">
          <ScrollFadeIn className="mx-auto max-w-3xl space-y-3 text-center">
            <Eyebrow className="text-[var(--app-primary)]">Leadership</Eyebrow>
            <H2 className="text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
              Leadership that keeps doctrine, care, and service aligned.
            </H2>
          </ScrollFadeIn>

          <div className="grid gap-5 lg:grid-cols-2">
            {[
              {
                image: Bishop,
                name: 'Bishop Gabriel Ayilara',
                role: 'Senior Pastor',
                description:
                  'A visionary leader committed to raising complete believers through sound teaching, disciplined leadership, and pastoral care.',
              },
              {
                image: PstKenny,
                name: 'Pastor Kenny Ayilara',
                role: 'Co-Pastor',
                description:
                  'A steady pastoral voice helping build discipleship pathways, family care structures, and strong ministry culture.',
              },
            ].map((person, index) => (
              <ScrollFadeIn key={person.name} delay={0.05 * index}>
                <article className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 transition duration-300 hover:border-[var(--app-primary)]/35 sm:rounded-[2rem]">
                  <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
                    <div className="relative h-72 bg-black sm:h-full sm:min-h-[300px]">
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 220px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent sm:hidden" />
                    </div>

                    <div className="flex flex-col justify-center space-y-4 p-5 sm:p-6 lg:p-7">
                      <Eyebrow className="text-[var(--app-primary)]">
                        {person.role}
                      </Eyebrow>

                      <H3 className="text-xl text-white sm:text-2xl">
                        {person.name}
                      </H3>

                      <BodyMD className="text-white/70">
                        {person.description}
                      </BodyMD>

                      <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white/65">
                        Wisdom Church leadership is built around discipleship,
                        doctrinal soundness, and practical care for people.
                      </div>
                    </div>
                  </div>
                </article>
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <ScrollFadeIn>
        <ActionBanner
          eyebrow="Visit Wisdom Church"
          title="Come and experience a church culture built around growth, care, and Christ-centered worship."
          description="If you are looking for a church home in Lagos, we would love to welcome you, answer your questions, and help you take a clear next step."
          primaryHref="/contact"
          primaryLabel="Plan your visit"
          secondaryHref="/leadership"
          secondaryLabel="Meet the team"
        />
      </ScrollFadeIn>
    </main>
  );
}
