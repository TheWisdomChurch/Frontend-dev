import type { Metadata } from 'next';

import SiteHero from '@/features/hero/SiteHero';
import JsonLd from '@/shared/seo/JsonLd';
import { buildRecurringEventSchema, buildPageMetadata } from '@/lib/seo';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import Arrow from '@/shared/ui/icons/Arrow';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import WeeklyServiceCard from '@/features/events/WeeklyServiceCard';
import {
  Container,
  Page,
  SectionHeader,
  CtaLink,
  Section,
} from '@/shared/ui/layout';

// Metadata fields a route doesn't set are inherited from the parent layout,
// not reset — without its own `alternates`, this page was silently
// canonicalizing to /events (events/layout.tsx's canonical). buildPageMetadata
// gives it a correct self-referencing canonical, hreflang, and OG/Twitter
// block instead of a bare title+description.
export const metadata: Metadata = buildPageMetadata({
  title: 'Weekly Services',
  description: `Join us every ${SERVICE_INFO.sunday.day} at ${SERVICE_INFO.sunday.time} and for ${SERVICE_INFO.dailyPrayer.label}, ${SERVICE_INFO.dailyPrayer.days} at ${SERVICE_INFO.dailyPrayer.time}, at ${SERVICE_INFO.venue.short}.`,
  path: '/events/weekly',
});

const services = [
  {
    day: SERVICE_INFO.sunday.day,
    time: SERVICE_INFO.sunday.time,
    name: 'Sunday Worship Service',
    description:
      'Our flagship gathering — Spirit-filled worship, corporate prayer, and the preached Word. All are welcome.',
    details: [
      "Children's Church runs simultaneously for ages 3–12",
      'Doors open from 8:30 AM',
      'Dress code: Smart casual or formal',
    ],
  },
  {
    day: SERVICE_INFO.dailyPrayer.daysShort,
    time: SERVICE_INFO.dailyPrayer.time,
    name: 'Daily Morning Prayer',
    description:
      'Start every weekday in prayer, declaration, and the Word — a solid foundation before the day begins.',
    details: [
      'Runs approximately 45 minutes',
      'Open to all ages',
      'Join in person or via livestream',
    ],
  },
] as const;

const RECURRING_SCHEMAS = [
  buildRecurringEventSchema({
    name: 'Sunday Worship Service',
    description:
      'Our flagship gathering — Spirit-filled worship, corporate prayer, and the preached Word.',
    dayOfWeek: ['https://schema.org/Sunday'],
    startTime: '09:00',
  }),
  buildRecurringEventSchema({
    name: 'Daily Morning Prayer',
    description:
      'Start every weekday in prayer, declaration, and the Word — a solid foundation before the day begins.',
    dayOfWeek: [
      'https://schema.org/Monday',
      'https://schema.org/Tuesday',
      'https://schema.org/Wednesday',
      'https://schema.org/Thursday',
      'https://schema.org/Friday',
    ],
    startTime: '07:00',
  }),
];

export default function WeeklyPage() {
  return (
    <Page>
      {RECURRING_SCHEMAS.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}

      <SiteHero
        backgroundImage="/Picflow/DSC00057 copy.webp"
        eyebrow="Weekly Services"
        title="We gather. Every week."
        subtitle="Sunday morning worship, and Daily Prayer every weekday morning — all open to everyone."
      />

      {/* Service panels */}
      <Section tone="canvas">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service, index) => (
              <WeeklyServiceCard
                key={service.day}
                {...service}
                variant={index === 0 ? 'sunday' : 'prayer'}
                location={SERVICE_INFO.venue.full}
                delay={index * 0.08}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA dark */}
      <Section tone="dark">
        <Container>
          <div className="flex flex-col items-center gap-7 text-center">
            <SectionHeader
              eyebrow="First time?"
              title="Walk in. You belong here."
              description="No pressure, no expectations—just come and experience the community. Our welcome team will be right there when you arrive."
              tone="dark"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <PlanVisitTrigger icon={false} size="lg">
                Let us know you're coming <Arrow />
              </PlanVisitTrigger>
              <CtaLink href="/events" variant="outline">
                See all events
              </CtaLink>
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
