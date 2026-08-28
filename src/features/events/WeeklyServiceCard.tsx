'use client';

import { CalendarClock, Clock3, MapPin, SunMedium } from 'lucide-react';

import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { interactiveCardClass } from '@/shared/ui/layout';

export type WeeklyServiceCardProps = {
  day: string;
  time: string;
  name: string;
  description: string;
  location: string;
  details?: readonly string[];
  variant?: 'sunday' | 'prayer';
  delay?: number;
};

export default function WeeklyServiceCard({
  day,
  time,
  name,
  description,
  location,
  details,
  variant = 'prayer',
  delay = 0,
}: WeeklyServiceCardProps) {
  const Icon = variant === 'sunday' ? SunMedium : CalendarClock;

  return (
    <ScrollFadeIn delay={delay} className="h-full">
      <article
        className={`group flex h-full flex-col gap-5 rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-5 sm:p-7 lg:p-8 ${interactiveCardClass}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-ui text-heading-lg font-semibold leading-none text-[var(--app-ink)]">
              {day}
            </p>
            <p className="mt-2 flex items-center gap-2 font-ui text-body-sm font-bold text-[var(--app-primary-dark)]">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              {time}
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-button bg-[var(--app-primary-10)] text-[var(--app-primary-dark)] transition duration-300 group-hover:scale-105 group-hover:bg-[var(--app-primary)] group-hover:text-[var(--app-ink)]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <div className="h-px w-8 bg-[var(--app-primary)]/50" />

        <div className="space-y-2">
          <h3 className="font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
            {name}
          </h3>
          <p className="font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
            {description}
          </p>
        </div>

        {details?.length ? (
          <ul className="space-y-2 border-t border-[var(--app-border)] pt-4">
            {details.map(detail => (
              <li
                key={detail}
                className="flex items-start gap-3 font-ui text-label leading-relaxed text-[var(--app-muted)]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--app-primary)]" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="flex items-start gap-2 font-ui text-label leading-relaxed text-[var(--app-subtle)]">
          <MapPin
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--app-primary-dark)]"
            aria-hidden="true"
          />
          <span>{location}</span>
        </p>

        <PlanVisitTrigger variant="outline" className="mt-auto self-start">
          Plan a visit
        </PlanVisitTrigger>
      </article>
    </ScrollFadeIn>
  );
}
