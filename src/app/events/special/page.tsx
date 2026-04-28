'use client';

import Image from 'next/image';
import { CalendarClock, Clock, MapPin, Star } from 'lucide-react';

import HeroSection from '@/features/hero/PageHero';
import { hero_bg_1, WisdomeHouseLogo } from '@/shared/assets';
import { useSpecialEvents } from '@/shared/utils/hooks/useSpecial';
import { Container, Section } from '@/shared/layout';

const annualTraditions = [
  {
    title: 'Celebration & Communion Service',
    period: 'Every First Sunday of the Month',
  },
  {
    title: `Worker's Retreat`,
    period: 'Quarterly',
  },
  {
    title: 'Christmas Celebration Service',
    period: 'Every December',
  },
  {
    title: "New Year's Crossover Service",
    period: 'December 31st',
  },
];

export default function SpecialPage() {
  const {
    headerRef,
    servicesRef,
    eventsRef,
    conferenceRef,
    specialEvents,
    weeklyServices,
    openModal,
  } = useSpecialEvents();

  const featuredEvents = specialEvents.filter(event => event.featured);
  const regularEvents = specialEvents.filter(event => !event.featured);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <HeroSection
        title="Special Events"
        subtitle="Celebrating God's Faithfulness Together"
        description="Join us for these meaningful celebrations and special services throughout the year as we worship, fellowship, and grow together in Christ."
        backgroundImage={hero_bg_1.src}
        showButtons={false}
        showScrollIndicator
      />

      <Section
        ref={headerRef}
        padding="lg"
        fullHeight={false}
        className="relative overflow-hidden bg-[#050505]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(247,222,18,0.13),transparent_28%),linear-gradient(180deg,#050505_0%,#080808_55%,#050505_100%)]" />

        <Container size="xl" className="relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
              Special services
            </p>
            <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-5xl">
              Every Service at{' '}
              <span className="text-[#f7de12]">The Wisdom House Church</span> is
              a Special Service
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
              From our weekly worship gatherings to annual celebrations, every
              moment at Wisdom House is an opportunity to encounter God&apos;s
              presence and experience transformative spiritual growth.
            </p>
          </div>
        </Container>
      </Section>

      <Section
        ref={servicesRef}
        padding="lg"
        fullHeight={false}
        className="bg-[#080808]"
      >
        <Container size="xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
              Weekly rhythm
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Weekly Services Schedule
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
              Join us throughout the week for powerful times of worship,
              teaching, and fellowship.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {weeklyServices.map(day => (
              <article
                key={day.day}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 sm:rounded-[1.75rem] sm:p-6"
              >
                <h3 className="text-xl font-semibold text-white">{day.day}</h3>

                <div className="mt-5 space-y-3">
                  {day.services.map((service, index) => (
                    <div
                      key={`${day.day}-${service.name}-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/25 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-semibold leading-6 text-white">
                          {service.name}
                        </h4>
                        <span className="rounded-full bg-[#f7de12]/10 px-2.5 py-1 text-[11px] font-bold text-[#f7de12]">
                          {service.type}
                        </span>
                      </div>

                      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-white/65">
                        <Clock className="h-4 w-4 text-[#f7de12]" />
                        {service.time}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section
        ref={conferenceRef}
        padding="lg"
        fullHeight={false}
        className="relative overflow-hidden bg-[#050505]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(247,222,18,0.12),transparent_28%),linear-gradient(180deg,#050505_0%,#080808_55%,#050505_100%)]" />

        <Container size="xl" className="relative z-10">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
              Featured events
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Major Events & Conferences
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
              Transformative gatherings designed for spiritual growth and divine
              encounters.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {featuredEvents.map(event => (
              <article
                key={event.id}
                className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-[#f7de12]/35 sm:rounded-[2rem] sm:p-6"
              >
                <span className="inline-flex rounded-full bg-[#f7de12] px-3 py-1 text-xs font-extrabold uppercase text-black">
                  {event.type}
                </span>

                <h3 className="mt-5 text-2xl font-semibold leading-tight text-white">
                  {event.title}
                </h3>

                <div className="mt-5 space-y-3 text-sm text-white/62">
                  <p className="flex gap-2">
                    <CalendarClock className="h-4 w-4 flex-none text-[#f7de12]" />
                    <span>{event.date}</span>
                  </p>
                  <p className="flex gap-2">
                    <Clock className="h-4 w-4 flex-none text-white/35" />
                    <span>{event.time}</span>
                  </p>
                  <p className="flex gap-2">
                    <MapPin className="h-4 w-4 flex-none text-white/35" />
                    <span>{event.location}</span>
                  </p>
                </div>

                <p className="mt-5 text-sm leading-7 text-white/65">
                  {event.description}
                </p>

                <button
                  type="button"
                  onClick={() => openModal(event)}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#f7de12] px-6 text-sm font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-[#ffe93d]"
                >
                  Register for Event
                </button>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section
        ref={eventsRef}
        padding="lg"
        fullHeight={false}
        className="bg-[#080808]"
      >
        <Container size="xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
              All events
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              All Special Events & Celebrations
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
              Mark your calendar for these meaningful celebrations and
              gatherings throughout the year.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {regularEvents.map(event => (
              <button
                key={event.id}
                type="button"
                onClick={() => openModal(event)}
                className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] text-left shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#f7de12]/35 sm:rounded-[1.75rem]"
              >
                <div className="relative grid h-44 place-items-center overflow-hidden bg-[#f7de12]">
                  <div className="absolute inset-0 bg-black/15" />
                  <Image
                    src={WisdomeHouseLogo}
                    alt={event.title}
                    width={76}
                    height={76}
                    className="relative object-contain transition duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="p-5">
                  <span className="inline-flex rounded-full bg-[#f7de12]/10 px-3 py-1 text-xs font-bold text-[#f7de12]">
                    {event.type}
                  </span>

                  <h3 className="mt-4 text-lg font-semibold leading-tight text-white">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-white/58">
                    <p>Date: {event.date}</p>
                    <p>Time: {event.time}</p>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/62">
                    {event.description}
                  </p>

                  <span className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-black transition group-hover:bg-[#f7de12]">
                    Learn More
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="lg" fullHeight={false} className="bg-[#050505]">
        <Container size="xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
              Church rhythm
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Annual Traditions
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
              These are some of our beloved annual events that bring our church
              family together.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            {annualTraditions.map(tradition => (
              <article
                key={tradition.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 text-center shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#f7de12]/35"
              >
                <Star className="mx-auto mb-4 h-6 w-6 text-[#f7de12]" />
                <h3 className="text-lg font-semibold text-white">
                  {tradition.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-[#f7de12]">
                  {tradition.period}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
