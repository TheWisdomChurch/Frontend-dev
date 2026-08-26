import type { Metadata } from 'next';

import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import JsonLd from '@/shared/seo/JsonLd';
import { buildRecurringEventSchema, buildPageMetadata } from '@/lib/seo';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import Arrow from '@/shared/ui/icons/Arrow';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import {
  EditorialContainer,
  EditorialHeader,
  EditorialLink,
  EditorialSection,
} from '@/shared/ui/editorial';

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
    <main className="min-h-screen">
      {RECURRING_SCHEMAS.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}

      <SiteHero
        eyebrow="Weekly Services"
        title="We gather. Every week."
        subtitle="Sunday morning worship, and Daily Prayer every weekday morning — all open to everyone."
        compact
      />

      {/* Service panels */}
      <EditorialSection tone="canvas">
        <EditorialContainer>
          <div className="divide-y divide-[var(--app-ink)]/8 border-b border-[var(--app-ink)]/8 py-14 lg:py-18">
            {services.map((svc, i) => (
              <ScrollFadeIn key={svc.day} delay={i * 0.08}>
                <div
                  className={`grid gap-10 py-12 lg:grid-cols-2 lg:gap-20 lg:py-14 ${i === 0 ? 'pt-0' : ''}`}
                >
                  {/* Left — day + time */}
                  <div>
                    <div className="flex items-baseline gap-5">
                      <p className="font-ui text-display-sm font-medium leading-none tracking-[-0.04em] text-[var(--app-ink)] lg:text-display-md">
                        {svc.day}
                      </p>
                      <p className="font-ui text-body-lg font-bold text-[var(--app-primary)]">
                        {svc.time}
                      </p>
                    </div>
                    <div className="mt-6 h-[1.5px] w-10 bg-[var(--app-primary)]/50" />
                    <p className="mt-5 font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
                      {svc.name}
                    </p>
                    <p className="mt-3 font-ui text-body-sm leading-[1.9] text-[var(--app-ink)]/70 max-w-sm">
                      {svc.description}
                    </p>
                  </div>

                  {/* Right — detail bullets + cta */}
                  <div className="flex flex-col gap-6 lg:pt-4">
                    <ul className="space-y-3">
                      {svc.details.map(d => (
                        <li key={d} className="flex items-start gap-3">
                          <div className="mt-[0.55rem] h-[1.5px] w-4 shrink-0 bg-[var(--app-primary)]/55" />
                          <span className="font-ui text-body-sm leading-[1.8] text-[var(--app-ink)]/72">
                            {d}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="font-ui text-label text-[var(--app-ink)]/55">
                      {SERVICE_INFO.venue.name},{' '}
                      {SERVICE_INFO.venue.streetAddress}
                      ,<br />
                      {SERVICE_INFO.venue.locality}
                    </p>
                    <PlanVisitTrigger
                      icon={false}
                      className="self-start rounded-none border-[var(--app-ink)]/18 bg-transparent px-5 py-2.5 text-[var(--app-ink)]/60 hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                    >
                      Plan your visit <Arrow />
                    </PlanVisitTrigger>
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </EditorialContainer>
      </EditorialSection>

      {/* CTA dark */}
      <EditorialSection tone="dark">
        <EditorialContainer>
          <div className="flex flex-col items-center gap-7 text-center">
            <EditorialHeader
              eyebrow="First time?"
              title="Walk in. You belong here."
              description="No pressure, no expectations—just come and experience the community. Our welcome team will be right there when you arrive."
              tone="dark"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <PlanVisitTrigger
                icon={false}
                className="rounded-none px-8 py-3.5 text-label uppercase tracking-[0.14em]"
              >
                Let us know you're coming <Arrow />
              </PlanVisitTrigger>
              <EditorialLink href="/events" variant="outline">
                See all events
              </EditorialLink>
            </div>
          </div>
        </EditorialContainer>
      </EditorialSection>
    </main>
  );
}
