'use client';

import HeroSection from '@/features/hero/PageHero';
import { hero_bg_3 } from '@/shared/assets';
import { Container, Section } from '@/shared/layout';
import { CalendarClock, MapPin, CheckCircle2 } from 'lucide-react';

const weeklyServices = [
  {
    day: 'Sunday',
    services: [
      {
        name: 'Morning Worship',
        time: '9:00 AM',
        description:
          'Our main worship service with contemporary music, relevant teaching, and fellowship',
        type: 'All Ages',
        location: 'Main Sanctuary',
      },
      {
        name: 'Sunday School',
        time: '10:30 AM',
        description:
          'Age-appropriate Bible classes for children, youth, and adults',
        type: 'All Ages',
        location: 'Various Classrooms',
      },
      {
        name: 'Evening Worship',
        time: '6:00 PM',
        description:
          'A more intimate service with traditional hymns and deeper Bible study',
        type: 'All Ages',
        location: 'Main Sanctuary',
      },
    ],
  },
  {
    day: 'Wednesday',
    services: [
      {
        name: 'Midweek Bible Study',
        time: '7:00 PM',
        description: 'In-depth Bible study and prayer meeting for adults',
        type: 'Adults',
        location: 'Fellowship Hall',
      },
      {
        name: 'Youth Group',
        time: '7:00 PM',
        description:
          'Dynamic worship and teaching for middle and high school students',
        type: 'Youth',
        location: 'Youth Center',
      },
      {
        name: 'Kids Club',
        time: '7:00 PM',
        description: 'Fun, faith-building activities for children ages 4-12',
        type: 'Children',
        location: "Children's Wing",
      },
    ],
  },
  {
    day: 'Friday',
    services: [
      {
        name: 'Young Adults',
        time: '7:30 PM',
        description:
          'Fellowship and Bible study for college students and young professionals',
        type: 'Young Adults',
        location: 'Coffee House',
      },
    ],
  },
];

const expectations = [
  {
    title: 'Welcoming Atmosphere',
    description:
      'Friendly greeters will welcome you and help you find your way around the campus.',
  },
  {
    title: 'Come As You Are',
    description:
      'Most people dress casually, so wear what makes you comfortable.',
  },
  {
    title: 'Engaging Worship',
    description:
      'A worship experience that is uplifting, sincere, and Christ-centered.',
  },
  {
    title: 'Practical Teaching',
    description: 'Messages that connect biblical truth to everyday life.',
  },
  {
    title: "Secure Children's Ministry",
    description:
      'Safe check-in and age-appropriate care for infants through 5th grade.',
  },
  {
    title: 'No Pressure',
    description: 'No spotlight, no pressure—just a space to encounter God.',
  },
];

export default function WeeklyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <HeroSection
        title="Weekly Services"
        subtitle="Regular gatherings for worship, teaching, and community."
        description="Join us throughout the week for services, studies, and fellowship designed to help you grow in faith and build lasting relationships."
        backgroundImage={hero_bg_3.src}
        showButtons
        primaryButtonText="Plan Your Visit"
        secondaryButtonText="Watch Online"
        showScrollIndicator
      />

      <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(247,222,18,0.12),transparent_28%),linear-gradient(180deg,#050505_0%,#080808_55%,#050505_100%)]" />
        <Container size="xl" className="relative z-10">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
              Weekly rhythm
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Our Weekly Schedule
            </h1>
            <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
              Multiple service times and gatherings to fit your schedule.
            </p>
          </div>

          <div className="space-y-5">
            {weeklyServices.map(daySchedule => (
              <section
                key={daySchedule.day}
                className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/25 sm:rounded-[2rem]"
              >
                <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                  <h2 className="text-xl font-semibold text-white">
                    {daySchedule.day}
                  </h2>
                </div>

                <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-2 lg:grid-cols-3">
                  {daySchedule.services.map(service => (
                    <article
                      key={`${daySchedule.day}-${service.name}`}
                      className="rounded-[1.25rem] border border-white/10 bg-black/30 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#f7de12]/35 hover:bg-white/[0.035]"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/70">
                          {service.type}
                        </span>
                        <span className="text-xs font-medium text-white/45">
                          {service.location}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-white">
                        {service.name}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#f7de12]">
                        <CalendarClock className="h-4 w-4" />
                        {service.time}
                      </div>

                      <p className="mt-3 text-sm leading-6 text-white/62">
                        {service.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/50">
                        <MapPin className="h-4 w-4" />
                        {service.location}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="lg" className="relative overflow-hidden bg-[#080808]">
        <Container size="xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
              First visit
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              What to Expect
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
              Your first visit to Wisdom House.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expectations.map(item => (
              <article
                key={item.title}
                className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 transition duration-300 hover:border-[#f7de12]/35"
              >
                <CheckCircle2 className="mb-4 h-5 w-5 text-[#f7de12]" />
                <h3 className="text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
