'use client';

import Image from 'next/image';
import { CalendarClock, Clock, MapPin, Star } from 'lucide-react';

import HeroSection from '@/features/hero/PageHero';
import { hero_bg_1, WisdomeHouseLogo } from '@/shared/assets';
import { useSpecialEvents } from '@/shared/utils/hooks/useSpecial';
import { H2, H3, H4, BodySM, Caption, Eyebrow } from '@/shared/text';
import { Container, Section } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';

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
    <main className="min-h-screen overflow-x-hidden bg-[var(--app-surface)] text-white">
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
        className="relative overflow-hidden bg-[var(--app-surface)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(201,150,26,0.10),transparent_28%),linear-gradient(180deg,#050505_0%,#080808_55%,#050505_100%)]" />

        <Container size="xl" className="relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow className="text-[var(--app-primary)]">
              Special services
            </Eyebrow>
            <H2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-5xl">
              Every Service at{' '}
              <span className="text-[var(--app-primary)]">
                The Wisdom House Church
              </span>{' '}
              is a Special Service
            </H2>
            <BodySM className="mx-auto mt-4 max-w-3xl text-white/65">
              From our weekly worship gatherings to annual celebrations, every
              moment at Wisdom House is an opportunity to encounter God&apos;s
              presence and experience transformative spiritual growth.
            </BodySM>
          </div>
        </Container>
      </Section>

      <Section
        ref={servicesRef}
        padding="lg"
        fullHeight={false}
        className="bg-[var(--app-surface-2)]"
      >
        <Container size="xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Eyebrow className="text-[var(--app-primary)]">
              Weekly rhythm
            </Eyebrow>
            <H2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Weekly Services Schedule
            </H2>
            <BodySM className="mt-3 text-white/65">
              Join us throughout the week for powerful times of worship,
              teaching, and fellowship.
            </BodySM>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {weeklyServices.map(day => (
              <article
                key={day.day}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 sm:rounded-[1.75rem] sm:p-6"
              >
                <H3 className="text-xl text-white">{day.day}</H3>

                <div className="mt-5 space-y-3">
                  {day.services.map((service, index) => (
                    <div
                      key={`${day.day}-${service.name}-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/25 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <H4 className="text-sm text-white">{service.name}</H4>
                        <span className="rounded-full bg-[var(--app-primary)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--app-primary)]">
                          {service.type}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[var(--app-primary)]" />
                        <BodySM weight="semibold" className="text-white/65">
                          {service.time}
                        </BodySM>
                      </div>
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
        className="relative overflow-hidden bg-[var(--app-surface)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(201,150,26,0.10),transparent_28%),linear-gradient(180deg,#050505_0%,#080808_55%,#050505_100%)]" />

        <Container size="xl" className="relative z-10">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Eyebrow className="text-[var(--app-primary)]">
              Featured events
            </Eyebrow>
            <H2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Major Events &amp; Conferences
            </H2>
            <BodySM className="mt-3 text-white/65">
              Transformative gatherings designed for spiritual growth and divine
              encounters.
            </BodySM>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {featuredEvents.map(event => (
              <article
                key={event.id}
                className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-[var(--app-primary)]/35 sm:rounded-[2rem] sm:p-6"
              >
                <span className="inline-flex rounded-full bg-[var(--app-primary)] px-3 py-1 text-xs font-extrabold uppercase text-black">
                  {event.type}
                </span>

                <H3 className="mt-5 text-2xl text-white">{event.title}</H3>

                <div className="mt-5 space-y-3 text-sm text-white/62">
                  <div className="flex gap-2">
                    <CalendarClock className="h-4 w-4 flex-none text-[var(--app-primary)]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <Clock className="h-4 w-4 flex-none text-white/35" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 flex-none text-white/35" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <BodySM className="mt-5 text-white/65">
                  {event.description}
                </BodySM>

                <Button
                  variant="primary"
                  curvature="full"
                  onClick={() => openModal(event)}
                  className="mt-6 w-full hover:-translate-y-0.5"
                >
                  Register for Event
                </Button>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section
        ref={eventsRef}
        padding="lg"
        fullHeight={false}
        className="bg-[var(--app-surface-2)]"
      >
        <Container size="xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Eyebrow className="text-[var(--app-primary)]">All events</Eyebrow>
            <H2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              All Special Events &amp; Celebrations
            </H2>
            <BodySM className="mt-3 text-white/65">
              Mark your calendar for these meaningful celebrations and
              gatherings throughout the year.
            </BodySM>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {regularEvents.map(event => (
              <Button
                key={event.id}
                type="button"
                variant="ghost"
                onClick={() => openModal(event)}
                className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] !justify-start h-auto flex-col items-start p-0 shadow-2xl shadow-black/20 hover:-translate-y-1 hover:border-[var(--app-primary)]/35 sm:rounded-[1.75rem]"
              >
                <div className="relative grid h-44 w-full place-items-center overflow-hidden bg-[var(--app-primary)]">
                  <div className="absolute inset-0 bg-black/15" />
                  <Image
                    src={WisdomeHouseLogo}
                    alt={event.title}
                    width={76}
                    height={76}
                    className="relative object-contain transition duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="w-full p-5 text-left">
                  <span className="inline-flex rounded-full bg-[var(--app-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--app-primary)]">
                    {event.type}
                  </span>

                  <H3 className="mt-4 text-lg text-white">{event.title}</H3>

                  <div className="mt-4 space-y-2">
                    <Caption className="text-white/58">
                      Date: {event.date}
                    </Caption>
                    <Caption className="text-white/58">
                      Time: {event.time}
                    </Caption>
                  </div>

                  <BodySM className="mt-4 line-clamp-2 text-white/62">
                    {event.description}
                  </BodySM>

                  <span className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-black transition group-hover:bg-[var(--app-primary)]">
                    Learn More
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </Container>
      </Section>

      <Section
        padding="lg"
        fullHeight={false}
        className="bg-[var(--app-surface)]"
      >
        <Container size="xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Eyebrow className="text-[var(--app-primary)]">
              Church rhythm
            </Eyebrow>
            <H2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Annual Traditions
            </H2>
            <BodySM className="mt-3 text-white/65">
              These are some of our beloved annual events that bring our church
              family together.
            </BodySM>
          </div>

          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            {annualTraditions.map(tradition => (
              <article
                key={tradition.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 text-center shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-[var(--app-primary)]/35"
              >
                <Star className="mx-auto mb-4 h-6 w-6 text-[var(--app-primary)]" />
                <H3 className="text-lg text-white">{tradition.title}</H3>
                <Caption
                  weight="semibold"
                  className="mt-2 text-[var(--app-primary)]"
                >
                  {tradition.period}
                </Caption>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
