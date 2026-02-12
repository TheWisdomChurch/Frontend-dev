'use client';

import { useMemo, useState } from 'react';
import PageHero from '@/components/ui/PageHero';
import { useUpcomingEvents } from '@/components/utils/hooks/UpcomingHooks';
import { Section, Container, GridboxLayout, FlexboxLayout } from '@/components/layout';
import { H3, BodyMD, SmallText, Caption } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { Calendar, MapPin, Clock, ArrowRight, Bell } from 'lucide-react';

type EventItem = {
  title: string;
  location?: string;
  time?: string;
  date: Date;
  description?: string;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

export default function EventsPage() {
  const { colorScheme } = useTheme(); // ✅ FIX: define colorScheme

  const { calendarGrid, currentDate, navigateMonth, navigateYear, months } = useUpcomingEvents();

  const [filter, setFilter] = useState<'all' | 'this' | 'next'>('this');

  const flatEvents: EventItem[] = useMemo(() => {
    return calendarGrid
      .flatMap(day =>
        day.events.map(evt => ({
          title: evt.title,
          location: evt.location,
          time: evt.time,
          date: day.date,
          description: evt.description,
        }))
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [calendarGrid]);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return flatEvents;

    const now = new Date();
    const monthOffset = filter === 'this' ? 0 : 1;
    const targetMonth = (now.getMonth() + monthOffset) % 12;
    const targetYear = now.getFullYear() + (filter === 'next' && now.getMonth() === 11 ? 1 : 0);

    return flatEvents.filter(
      e => e.date.getMonth() === targetMonth && e.date.getFullYear() === targetYear
    );
  }, [flatEvents, filter]);

  const featured = filteredEvents[0] ?? flatEvents[0] ?? null;

  const primary = colorScheme?.primary || '#fbbf24';

  return (
    <div className="bg-[#050505] text-white min-h-screen">
      <PageHero
        title="Events & Programs"
        subtitle="See what’s happening at Wisdom House"
        note="Conferences, special services, and weekly gatherings — all in one place."
        chips={['Live gatherings', 'Conferences', 'Weekly services']}
        compact
      />

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          {/* Filters + stats */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex gap-2">
              {[
                { key: 'this', label: 'This month' },
                { key: 'next', label: 'Next month' },
                { key: 'all', label: 'All events' },
              ].map(btn => (
                <button
                  key={btn.key}
                  onClick={() => setFilter(btn.key as typeof filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    filter === btn.key
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-white border-white/10'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-white/70">
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                Showing {filteredEvents.length || flatEvents.length} events
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
            </div>
          </div>

          {/* Featured */}
          {featured && (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-black/60 to-black/80 p-6 sm:p-7 lg:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.45)] space-y-4">
              <Caption className="text-white/60 text-[11px]">Featured</Caption>

              <H3 className="text-xl sm:text-2xl font-semibold">{featured.title}</H3>

              <div className="flex flex-wrap gap-4 text-sm text-white/70">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: primary }} />
                  {formatDate(featured.date)}
                </span>

                {featured.time && (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featured.time}
                  </span>
                )}

                {featured.location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {featured.location}
                  </span>
                )}
              </div>

              {featured.description && (
                <BodyMD className="text-white/70 text-sm leading-relaxed max-w-2xl">
                  {featured.description}
                </BodyMD>
              )}

              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:-translate-y-0.5 transition"
                style={{ color: primary }}
              >
                Set reminder <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Events grid */}
          <GridboxLayout columns={3} responsive={{ xs: 1, md: 2, lg: 3 }} gap="md">
            {filteredEvents.slice(1).map(evt => (
              <div
                key={`${evt.title}-${evt.date.toISOString()}`}
                className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-4 sm:p-5 flex flex-col gap-3 hover:-translate-y-1 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <Caption className="text-white/60 text-[11px]">{formatDate(evt.date)}</Caption>
                    <H3 className="text-base font-semibold leading-tight">{evt.title}</H3>
                  </div>
                  <Bell className="w-4 h-4 text-white/60" />
                </div>

                <div className="text-white/65 text-[12px] space-y-1">
                  {evt.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{evt.time}</span>
                    </div>
                  )}
                  {evt.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{evt.location}</span>
                    </div>
                  )}
                </div>

                {evt.description && (
                  <SmallText className="text-white/60 text-[12px] line-clamp-3">
                    {evt.description}
                  </SmallText>
                )}

                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Remind me</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </GridboxLayout>

          {/* Navigation controls */}
          <FlexboxLayout justify="center" gap="sm" className="pt-4">
            <button
              type="button"
              onClick={() => {
                navigateYear('prev');
                navigateMonth('prev');
              }}
              className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs font-semibold hover:-translate-y-0.5 transition"
            >
              Previous month
            </button>

            <button
              type="button"
              onClick={() => {
                navigateMonth('next');
                navigateYear('next');
              }}
              className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs font-semibold hover:-translate-y-0.5 transition"
            >
              Next month
            </button>
          </FlexboxLayout>
        </Container>
      </Section>
    </div>
  );
}
