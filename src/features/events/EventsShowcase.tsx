'use client';

import { calendarEvents } from '@/lib/data';
import Link from 'next/link';
import { Section, Container } from '@/shared/layout';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function EventsShowcase() {
  const upcomingEvents = calendarEvents?.slice(0, 3) || [];

  return (
    <Section
      padding="lg"
      className="py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      <Container size="xl" className="space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <p
              className="text-sm uppercase tracking-widest font-semibold"
              style={{ color: 'var(--color-gold)' }}
            >
              Coming Soon
            </p>
            <h2
              className="font-serif leading-tight"
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 3.25rem)',
                color: 'var(--color-text-primary)',
              }}
            >
              Upcoming Events & Gatherings
            </h2>
          </div>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Join us for worship, prayer, fellowship, and opportunities to grow
            spiritually and connect with our community.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {upcomingEvents.map((event, idx) => (
            <Link
              key={idx}
              href={`/events/${event.slug || 'upcoming'}`}
              className="group rounded-2xl p-7 sm:p-8 transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: 'rgba(215, 187, 117, 0.08)',
                border: '1px solid var(--color-border-light)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor =
                  'rgba(215, 187, 117, 0.12)';
                e.currentTarget.style.borderColor = 'var(--color-gold)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor =
                  'rgba(215, 187, 117, 0.08)';
                e.currentTarget.style.borderColor = 'var(--color-border-light)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Category Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4"
                style={{ backgroundColor: 'rgba(215, 187, 117, 0.15)' }}
              >
                <Calendar
                  className="h-3 w-3"
                  style={{ color: 'var(--color-gold)' }}
                />
                <span
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--color-gold)' }}
                >
                  {event.category || 'Event'}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-xl sm:text-2xl font-semibold mb-4 leading-tight line-clamp-2 group-hover:text-yellow-400 transition-colors"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {event.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-6 line-clamp-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {event.description}
              </p>

              {/* Event Details */}
              <div
                className="space-y-3 pt-6 border-t"
                style={{ borderColor: 'var(--color-border-light)' }}
              >
                {/* Date & Time */}
                <div className="flex items-center gap-3">
                  <Clock
                    className="h-4 w-4"
                    style={{ color: 'var(--color-gold)' }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {event.date} at {event.time}
                  </span>
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex items-center gap-3">
                    <MapPin
                      className="h-4 w-4"
                      style={{ color: 'var(--color-gold)' }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {event.location}
                    </span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div
                className="mt-6 inline-flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all"
                style={{ color: 'var(--color-gold)' }}
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="flex justify-center pt-4 sm:pt-8">
          <Link href="/events" className="btn-secondary">
            View All Events & Calendar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
