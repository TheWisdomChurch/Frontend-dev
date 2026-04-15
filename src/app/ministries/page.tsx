import {
  BookOpenCheck,
  CalendarDays,
  HeartHandshake,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import {
  ActionBanner,
  FeatureGrid,
  SplitSection,
  StatStrip,
} from '@/shared/components/site/PublicPageBlocks';

const ministries = [
  {
    title: 'Youth Ministry',
    description:
      'A vibrant discipleship space for teenagers and young adults to grow in faith, leadership, and healthy community.',
    icon: Sparkles,
    href: '/ministries/youth',
    badge: 'Ages 13-25',
  },
  {
    title: "Women's Ministry",
    description:
      'A strengthening community for women to grow in scripture, prayer, fellowship, and purposeful service.',
    icon: HeartHandshake,
    href: '/ministries/women',
    badge: 'Community',
  },
  {
    title: "Men's Ministry",
    description:
      'A clear discipleship path for men who want to grow in integrity, leadership, and service at home and in church.',
    icon: ShieldCheck,
    href: '/ministries/men',
    badge: 'Brotherhood',
  },
  {
    title: "Children's Ministry",
    description:
      'A safe and joyful environment where children encounter Jesus through age-appropriate teaching and care.',
    icon: BookOpenCheck,
    href: '/ministries/children',
    badge: 'Nursery to pre-teens',
  },
  {
    title: 'Outreach & Missions',
    description:
      'Practical expressions of God’s love through service, relief, evangelism, and community development.',
    icon: Megaphone,
    href: '/ministries/outreach',
    badge: 'Impact',
  },
  {
    title: 'Pastoral Care',
    description:
      'Support structures for prayer, counseling, life transitions, family care, and spiritual guidance.',
    icon: Users,
    href: '/pastoral',
    badge: 'Care',
  },
];

const stats = [
  {
    label: 'Ministry focus',
    value: 'Formation and belonging',
    detail:
      'Every ministry exists to help people grow in Christ and find a place to serve.',
    icon: Users,
  },
  {
    label: 'Age coverage',
    value: 'Children to adults',
    detail:
      'The church is intentionally structured to disciple every generation.',
    icon: CalendarDays,
  },
  {
    label: 'Pathway',
    value: 'Gather, grow, serve',
    detail:
      'Each ministry creates a practical route from attendance to active service.',
    icon: Sparkles,
  },
  {
    label: 'Support',
    value: 'Care-led teams',
    detail:
      'Teams are built to notice people early and help them connect deeply.',
    icon: HeartHandshake,
  },
];

export default function MinistriesPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Ministries that help every generation belong, mature, and serve well."
        subtitle="Wisdom Church ministries are designed to make discipleship practical, relational, and responsive to real life."
        note="Whether you are looking for spiritual growth, accountability, friendship, or a place to serve, there is a ministry pathway for you."
        chips={['Youth', 'Women', 'Men', 'Children', 'Outreach']}
      />

      <ScrollFadeIn>
        <StatStrip items={stats} />
      </ScrollFadeIn>

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <ScrollFadeIn className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              Ministry areas
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Each ministry has a clear purpose, a defined audience, and a real
              discipleship pathway.
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.1} data-parallax-global="0.1">
            <FeatureGrid items={ministries} columns={3} />
          </ScrollFadeIn>
        </Container>
      </Section>

      <Section padding="lg" className="border-y border-white/10 bg-[#080808]">
        <Container size="xl">
          <ScrollFadeIn data-parallax-global="0.08">
            <SplitSection
              eyebrow="How people get connected"
              title="We do not want ministry involvement to feel vague or hidden."
              description="Getting connected at Wisdom Church should be clear. We want people to know where to start, what to expect, and how to move from interest to meaningful participation."
              points={[
                'Start by visiting a gathering or speaking with a ministry lead.',
                'Join a ministry community that matches your stage of life or calling.',
                'Stay consistent long enough to build relationships and trust.',
                'Move into training, responsibility, and long-term service where appropriate.',
              ]}
              panelTitle="What good ministry structure does"
              panelBody="Healthy ministry structure reduces confusion, helps leaders care better, and makes it easier for people to stay engaged over time."
              panelItems={[
                'Clear communication and meeting rhythms.',
                'Defined leaders and support teams.',
                'Practical entry points for newcomers.',
                'Visible next steps for serving and growth.',
              ]}
            />
          </ScrollFadeIn>
        </Container>
      </Section>

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <ScrollFadeIn className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              Ministry values
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Our teams are built around consistency, care, doctrine, and
              service excellence.
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.1} data-parallax-global="0.1">
            <FeatureGrid
              columns={2}
              items={[
                {
                  title: 'People before programs',
                  description:
                    'Programs matter, but people matter more. Ministry is designed to pastor and form people, not just fill calendars.',
                  icon: HeartHandshake,
                },
                {
                  title: 'Scripture before hype',
                  description:
                    'Our ministries are shaped by biblical truth, not trend cycles. Depth matters as much as energy.',
                  icon: BookOpenCheck,
                },
                {
                  title: 'Service with structure',
                  description:
                    'Strong systems help leaders care consistently and help members know where they fit.',
                  icon: ShieldCheck,
                },
                {
                  title: 'Growth with accountability',
                  description:
                    'We want ministry communities where encouragement and responsibility grow together.',
                  icon: Users,
                },
              ]}
            />
          </ScrollFadeIn>
        </Container>
      </Section>

      <ScrollFadeIn>
        <ActionBanner
          eyebrow="Take a next step"
          title="If you are ready to connect, we can help you find the right ministry fit."
          description="Tell us where you are in your faith journey, and we will guide you toward a ministry community or service opportunity that makes sense."
          primaryHref="/contact"
          primaryLabel="Get connected"
          secondaryHref="/events"
          secondaryLabel="See church rhythm"
        />
      </ScrollFadeIn>
    </div>
  );
}
