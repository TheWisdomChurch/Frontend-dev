import Image from 'next/image';
import {
  BookOpenCheck,
  HeartHandshake,
  ShieldCheck,
  Users,
} from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Bishop, PstKenny } from '@/shared/assets';
import { Container, Section } from '@/shared/layout';
import {
  ActionBanner,
  FeatureGrid,
  SplitSection,
  StatStrip,
} from '@/shared/components/site/PublicPageBlocks';

const stats = [
  {
    label: 'Leadership posture',
    value: 'Servant leadership',
    detail:
      'The goal is not visibility alone but faithful oversight, teaching, and care.',
    icon: HeartHandshake,
  },
  {
    label: 'Pastoral focus',
    value: 'Doctrine and discipleship',
    detail:
      'Leadership keeps truth, growth, and healthy church culture aligned.',
    icon: BookOpenCheck,
  },
  {
    label: 'Church culture',
    value: 'Excellence with warmth',
    detail:
      'We want both sound structure and genuine care in every ministry environment.',
    icon: ShieldCheck,
  },
  {
    label: 'Leadership outcome',
    value: 'Equipped people',
    detail:
      'Strong leaders should produce strong disciples and strong ministry teams.',
    icon: Users,
  },
];

const leadershipAreas = [
  {
    title: 'Teaching and doctrine',
    description:
      'Guarding the message of the church and ensuring that preaching, discipleship, and ministry training remain biblically sound.',
    icon: BookOpenCheck,
  },
  {
    title: 'Pastoral care',
    description:
      'Walking with people through prayer, counsel, family needs, transitions, and seasons that require direct support.',
    icon: HeartHandshake,
  },
  {
    title: 'Culture and standards',
    description:
      'Building ministry environments where service is orderly, communication is clear, and hospitality is intentional.',
    icon: ShieldCheck,
  },
  {
    title: 'Equipping leaders',
    description:
      'Developing responsible ministry leaders who can serve others with maturity, humility, and consistency.',
    icon: Users,
  },
];

export default function LeadershipPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Leadership that keeps the church grounded in truth and close to people."
        subtitle="Wisdom Church leadership exists to teach faithfully, shepherd carefully, and build healthy ministry culture."
        note="The aim is not only to lead services, but to raise people, guide families, and steward the direction of the house with integrity."
        chips={[
          'Servant leadership',
          'Pastoral care',
          'Doctrinal clarity',
          'Team culture',
        ]}
      />

      <StatStrip items={stats} />

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="grid gap-4 lg:grid-cols-2">
          {[
            {
              image: Bishop,
              name: 'Bishop Gabriel Ayilara',
              role: 'Senior Pastor',
              summary:
                'Provides spiritual oversight, vision, doctrinal direction, and leadership culture for the church.',
              highlights: [
                'Leads the house with a focus on complete believers.',
                'Shapes doctrine, vision, and ministry standards.',
                'Keeps preaching, prayer, and pastoral care central.',
              ],
            },
            {
              image: PstKenny,
              name: 'Pastor Kenny Ayilara',
              role: 'Co-Pastor',
              summary:
                'Supports church life through discipleship structures, care systems, and practical leadership development.',
              highlights: [
                'Strengthens pastoral follow-through and member care.',
                'Helps coordinate ministry teams and discipleship rhythms.',
                'Contributes to a strong family and church culture.',
              ],
            },
          ].map(person => (
            <article
              key={person.name}
              className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.03]"
            >
              <div className="relative h-80 border-b border-white/10 bg-black/20">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.2em] text-[#d7bb75]">
                    {person.role}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {person.name}
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-white/68">
                  {person.summary}
                </p>
                <div className="grid gap-3">
                  {person.highlights.map(item => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/68"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </Container>
      </Section>

      <Section padding="lg" className="border-y border-white/10 bg-[#080808]">
        <Container size="xl">
          <SplitSection
            eyebrow="Leadership philosophy"
            title="Church leadership should create clarity, care, and faithful momentum."
            description="Healthy leadership makes it easier for members to trust direction, receive care, and grow in responsibility. It should reduce confusion, not create it."
            points={[
              'Teach truth clearly and consistently.',
              'Stay close enough to people to care well.',
              'Build ministry systems that are understandable and sustainable.',
              'Model integrity, prayer, humility, and service.',
            ]}
            panelTitle="What leadership is stewarding"
            panelBody="Leadership is responsible for more than preaching moments. It stewards doctrine, people, ministry systems, and the overall health of the church body."
            panelItems={[
              'Worship and service culture',
              'Discipleship and ministry pathways',
              'Pastoral care and spiritual oversight',
              'Volunteer development and team health',
            ]}
          />
        </Container>
      </Section>

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              Leadership responsibilities
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              The leadership team serves the church through four major
              responsibilities.
            </h2>
          </div>
          <FeatureGrid items={leadershipAreas} columns={4} />
        </Container>
      </Section>

      <ActionBanner
        eyebrow="Reach out"
        title="If you need prayer, guidance, or a conversation with the church team, we are available."
        description="Leadership is most useful when it is accessible. If you need support, our team can help you take the right next step."
        primaryHref="/contact"
        primaryLabel="Contact the church"
        secondaryHref="/pastoral"
        secondaryLabel="Explore pastoral care"
      />
    </div>
  );
}
