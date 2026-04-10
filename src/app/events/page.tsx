import {
  CalendarDays,
  Clock3,
  MapPin,
  Radio,
  Sparkles,
  Users,
} from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import {
  ActionBanner,
  FeatureGrid,
  SplitSection,
  StatStrip,
} from '@/shared/components/site/PublicPageBlocks';

const stats = [
  {
    label: 'Sunday worship',
    value: '9:00 AM',
    detail: 'Our main gathering for worship, prayer, the Word, and fellowship.',
    icon: Radio,
  },
  {
    label: 'Midweek service',
    value: 'Thursday · 6:00 PM',
    detail: 'A focused evening for teaching, spiritual refreshing, and prayer.',
    icon: Clock3,
  },
  {
    label: 'Church location',
    value: 'Honor Gardens, Lagos',
    detail: 'Opposite Dominion City, Alasia, Lekki-Epe Expressway.',
    icon: MapPin,
  },
  {
    label: 'Event rhythm',
    value: 'Weekly and seasonal',
    detail:
      'Regular gatherings supported by conferences, ministry events, and church-wide programs.',
    icon: CalendarDays,
  },
];

const eventRoutes = [
  {
    title: 'Weekly Services',
    description:
      'See the regular rhythm of worship services, studies, and prayer gatherings that shape the life of the church.',
    icon: Clock3,
    href: '/events/weekly',
    badge: 'Every week',
  },
  {
    title: 'Upcoming Events',
    description:
      'Track the next major gatherings, special meetings, and community moments happening across the church calendar.',
    icon: Sparkles,
    href: '/events/upcoming',
    badge: 'Next on the calendar',
  },
  {
    title: 'Special Events',
    description:
      'Explore conferences, church-wide celebrations, and unique programs designed for deeper encounters and impact.',
    icon: Users,
    href: '/events/special',
    badge: 'Seasonal moments',
  },
  {
    title: 'Events Calendar',
    description:
      'View the current calendar in one place and stay updated on how the month is unfolding.',
    icon: CalendarDays,
    href: '/events/calendar',
    badge: 'Monthly overview',
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="A church rhythm built around worship, discipleship, and shared moments of encounter."
        subtitle="Wisdom Church gatherings are structured to help people worship deeply, stay connected, and keep growing through the week."
        note="From weekly services to major church programs, every event should help people meet God, build relationships, and move forward in purpose."
        chips={[
          'Sunday worship',
          'Midweek service',
          'Special programs',
          'Church calendar',
        ]}
      />

      <StatStrip items={stats} />

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              Event pathways
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Start with the kind of gathering you need right now.
            </h2>
          </div>
          <FeatureGrid items={eventRoutes} columns={4} />
        </Container>
      </Section>

      <Section padding="lg" className="border-y border-white/10 bg-[#080808]">
        <Container size="xl">
          <SplitSection
            eyebrow="Why the church calendar matters"
            title="A strong event structure helps people stay engaged beyond one Sunday."
            description="Church life works best when people can easily understand the rhythm of worship, teaching, ministry gatherings, and special events. That clarity helps new people connect faster and helps regular members stay consistent."
            points={[
              'Weekly gatherings create spiritual rhythm and continuity.',
              'Special events create moments of focus, encounter, and momentum.',
              'A visible calendar removes guesswork and improves planning.',
              'Clear event communication helps families, volunteers, and ministry leaders stay aligned.',
            ]}
            panelTitle="What to expect"
            panelBody="Whether you are attending for the first time or checking what is next on the calendar, the events section should tell you what is happening, when it is happening, and why it matters."
            panelItems={[
              'Regular Sunday and midweek gatherings',
              'Seasonal programs and conferences',
              'Ministry-focused meetings and community moments',
              'A single calendar view for current scheduling',
            ]}
          />
        </Container>
      </Section>

      <ActionBanner
        eyebrow="Join us this week"
        title="Choose a service, mark the calendar, and come expectant."
        description="If you are planning your first visit, start with Sunday worship or the next upcoming program and we will help you feel at home."
        primaryHref="/contact"
        primaryLabel="Plan your visit"
        secondaryHref="/events/upcoming"
        secondaryLabel="See upcoming events"
      />
    </div>
  );
}
