'use client';

import Image from 'next/image';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from 'lucide-react';

import HeroSection from '@/features/hero/PageHero';
import { hero_bg_2, NL } from '@/shared/assets';
import { H2, H3, H4, BodySM, BodyLG, Caption, Eyebrow } from '@/shared/text';
import { Container, Section } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';
import { useUpcomingEvents } from '@/shared/utils/hooks/UpcomingHooks';

export default function Upcoming() {
  const {
    currentDate,
    view,
    calendarRef,
    eventsRef,
    conferenceRef,
    newsletterRef,
    months,
    years,
    calendarGrid,
    currentMonthEvents,
    setView,
    handleEventClick,
    handleDateClick,
    openConferenceModal,
    openLiftingModal,
    openReminderModal,
    navigateMonth,
    navigateYear,
    selectMonth,
    selectYear,
  } = useUpcomingEvents();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--app-surface)] text-white">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        pauseOnHover
        draggable
        theme="dark"
        className="mt-16"
      />

      <HeroSection
        title="Upcoming Events"
        subtitle="What's Happening at Wisdom House"
        description="Stay connected with all the activities, studies, and gatherings happening throughout the week. There's always something going on!"
        backgroundImage={hero_bg_2.src}
        showButtons={false}
        showScrollIndicator
      />

      <Section padding="lg" className="bg-[var(--app-surface)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(201,150,26,0.10),transparent_28%),radial-gradient(circle_at_90%_16%,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,#050505_0%,#080808_55%,#050505_100%)]" />

        <Container size="lg">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Eyebrow className="text-[var(--app-primary)]">
              Featured program
            </Eyebrow>
            <H2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Upcoming Events
            </H2>
            <BodySM className="mt-3 text-white/65">
              Discover transformative experiences and spiritual gatherings
              designed to uplift and inspire your journey.
            </BodySM>
          </div>

          <div className="grid gap-8 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 sm:rounded-[2rem] sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-8">
            <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/30">
              <div className="relative h-72 sm:h-80 lg:h-[420px]">
                <Image
                  src={NL}
                  alt="7 Nights of Lifting - Transformative Nights of Worship"
                  fill
                  priority
                  className="object-contain p-3"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            </div>

            <div className="space-y-5">
              <Eyebrow className="text-[var(--app-primary)]">
                Transformative nights of worship &amp; prayer
              </Eyebrow>

              <H2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                7 Nights of{' '}
                <span className="text-[var(--app-primary)]">Lifting</span>
              </H2>

              <div className="space-y-3">
                <BodySM className="text-white/65">
                  Join us for seven powerful nights of worship, prayer, and
                  spiritual elevation. Each night features special guests,
                  anointed worship, and life-changing messages that will lift
                  your spirit and strengthen your faith.
                </BodySM>
                <BodySM className="text-white/65">
                  Don&apos;t miss this transformative experience where we come
                  together as a community to seek God&apos;s presence and power
                  in our lives.
                </BodySM>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  type="button"
                  variant="primary"
                  curvature="full"
                  onClick={openLiftingModal}
                >
                  Register to Attend
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  curvature="full"
                  onClick={() => openReminderModal('lifting')}
                >
                  Remind Me Later
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section
        ref={calendarRef}
        padding="lg"
        className="bg-[var(--app-surface-2)]"
      >
        <Container size="lg">
          <div className="mb-8 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 sm:rounded-[2rem] sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Eyebrow className="text-[var(--app-primary)]">
                  Event calendar
                </Eyebrow>
                <H2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {view === 'month'
                    ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                    : currentDate.getFullYear()}
                </H2>
                <BodySM className="mt-3 max-w-2xl text-white/60">
                  Browse through our interactive calendar to stay updated with
                  all upcoming events and gatherings.
                </BodySM>
              </div>

              <Button
                type="button"
                variant="primary"
                curvature="full"
                onClick={() => setView(view === 'month' ? 'year' : 'month')}
              >
                {view === 'month' ? 'Year View' : 'Month View'}
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  curvature="full"
                  onClick={() => navigateYear('prev')}
                  aria-label="Previous year"
                  className="h-10 w-10 border border-white/10 bg-black/25 text-white/75"
                >
                  ‹‹
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  curvature="full"
                  onClick={() => navigateMonth('prev')}
                  aria-label="Previous month"
                  className="h-10 w-10 border border-white/10 bg-black/25 text-white/75"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {years.map(year => (
                  <Button
                    key={year}
                    type="button"
                    variant={
                      currentDate.getFullYear() === year ? 'primary' : 'ghost'
                    }
                    curvature="full"
                    onClick={() => selectYear(year)}
                    className={`px-4 py-2 min-h-0 h-auto text-xs font-bold ${
                      currentDate.getFullYear() !== year
                        ? 'border border-white/10 bg-black/25 text-white/65 hover:bg-white/[0.06]'
                        : ''
                    }`}
                  >
                    {year}
                  </Button>
                ))}
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  curvature="full"
                  onClick={() => navigateMonth('next')}
                  aria-label="Next month"
                  className="h-10 w-10 border border-white/10 bg-black/25 text-white/75"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  curvature="full"
                  onClick={() => navigateYear('next')}
                  aria-label="Next year"
                  className="h-10 w-10 border border-white/10 bg-black/25 text-white/75"
                >
                  ››
                </Button>
              </div>
            </div>
          </div>

          {view === 'year' ? (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {months.map((month, index) => (
                <Button
                  key={month}
                  type="button"
                  variant="ghost"
                  onClick={() => selectMonth(index)}
                  className={`rounded-[1.25rem] border p-5 !justify-start text-left h-auto hover:-translate-y-1 ${
                    currentDate.getMonth() === index
                      ? 'border-[var(--app-primary)]/60 bg-[var(--app-primary)]/10'
                      : 'border-white/10 bg-white/[0.04] hover:border-[var(--app-primary)]/35'
                  }`}
                >
                  <div>
                    <BodyLG weight="semibold" className="text-white">
                      {month}
                    </BodyLG>
                    <Caption className="mt-2 text-white/50">
                      Click to view month
                    </Caption>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/25">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    day => (
                      <div key={day} className="py-2">
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarGrid.map((day, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      onClick={() => handleDateClick(day.date, day.events)}
                      className={`min-h-[104px] rounded-2xl border p-3 !justify-start h-auto flex-col items-start ${
                        day.isToday
                          ? 'border-[var(--app-primary)]/70 bg-[var(--app-primary)]/10'
                          : day.isCurrentMonth
                            ? 'border-white/10 bg-black/25 hover:bg-white/[0.05]'
                            : 'border-white/5 bg-black/10 text-white/30'
                      } ${day.events.length > 0 ? 'cursor-pointer' : ''}`}
                    >
                      <Caption
                        weight="semibold"
                        className={
                          day.isToday
                            ? 'text-[var(--app-primary)]'
                            : 'text-white'
                        }
                      >
                        {day.date.getDate()}
                      </Caption>

                      <div className="mt-2 w-full space-y-1">
                        {day.events.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className="truncate rounded-full bg-[var(--app-primary)] px-2 py-1 text-xs font-bold text-black"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}

                        {day.events.length > 2 ? (
                          <Caption className="text-white/45">
                            +{day.events.length - 2} more
                          </Caption>
                        ) : null}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div
            ref={eventsRef}
            className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 sm:rounded-[2rem] sm:p-6"
          >
            <div className="mb-6 text-center">
              <Eyebrow className="text-[var(--app-primary)]">
                This month
              </Eyebrow>
              <H3 className="mt-2 text-xl text-white sm:text-2xl">
                Events for {months[currentDate.getMonth()]}{' '}
                {currentDate.getFullYear()}
              </H3>
            </div>

            {currentMonthEvents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {currentMonthEvents.map(event => (
                  <Button
                    key={event.id}
                    type="button"
                    variant="ghost"
                    onClick={() => handleEventClick(event)}
                    className="group rounded-[1.25rem] border border-white/10 bg-black/25 p-5 !justify-start h-auto flex-col items-start hover:-translate-y-1 hover:border-[var(--app-primary)]/35 hover:bg-white/[0.035]"
                  >
                    <span className="inline-flex rounded-full bg-[var(--app-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--app-primary)]">
                      {event.type}
                    </span>

                    <H4 className="mt-4 text-lg text-white group-hover:text-[var(--app-primary)]">
                      {event.title}
                    </H4>

                    {event.description ? (
                      <BodySM className="mt-3 line-clamp-2 text-white/60">
                        {event.description}
                      </BodySM>
                    ) : null}

                    <div className="mt-4 w-full space-y-2 border-t border-white/10 pt-4">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-[var(--app-primary)]" />
                        <Caption className="text-white/55">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Caption>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-white/35" />
                        <Caption className="text-white/55">
                          {event.time}
                        </Caption>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-white/35" />
                        <Caption className="text-white/55">
                          {event.location}
                        </Caption>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <BodyLG weight="semibold" className="text-white/70">
                  No events scheduled for {months[currentDate.getMonth()]}{' '}
                  {currentDate.getFullYear()}
                </BodyLG>
                <Caption className="mt-2 text-white/45">
                  Check back later for updates or browse other months.
                </Caption>
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section ref={conferenceRef} padding="none" className="py-16 lg:py-24">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          poster="/images/event-placeholder.webp"
        >
          <source src="/_optimized/videos/videoBg.webm" type="video/webm" />
          <source src="/videos/videoBg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/70" />

        <Container
          size="md"
          className="relative rounded-[1.6rem] border border-white/10 bg-black/45 p-6 text-center shadow-2xl shadow-black/40 backdrop-blur-md sm:rounded-[2rem] sm:p-8 lg:p-10"
        >
          <Eyebrow className="text-[var(--app-primary)]">
            Major gathering
          </Eyebrow>
          <H2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Wisdom Power{' '}
            <span className="text-[var(--app-primary)]">Conference</span> 2026
          </H2>
          <BodySM className="mx-auto mt-4 max-w-2xl text-white/70">
            The most anticipated spiritual gathering of the year is coming.
            Experience powerful teachings, anointed worship, and life-changing
            encounters.
          </BodySM>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              variant="primary"
              curvature="full"
              onClick={openConferenceModal}
            >
              Register for Event
            </Button>
            <Button
              type="button"
              variant="ghost"
              curvature="full"
              onClick={() => openReminderModal('conference')}
            >
              Remind Me Later
            </Button>
          </div>
        </Container>
      </Section>

      <Section
        ref={newsletterRef}
        padding="lg"
        className="bg-[var(--app-surface)]"
      >
        <Container size="sm" className="text-center">
          <Eyebrow className="text-[var(--app-primary)]">Newsletter</Eyebrow>
          <H2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Stay Updated
          </H2>
          <BodySM className="mt-3 text-white/65">
            Get the latest news and updates about our upcoming programs and
            events delivered to your inbox.
          </BodySM>

          <form className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/25 sm:flex sm:gap-3 sm:p-5">
            <input
              type="email"
              placeholder="Enter your email address"
              className="min-h-12 w-full rounded-full border border-white/10 bg-black/30 px-5 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--app-primary)]/60 focus:ring-4 focus:ring-[var(--app-primary)]/10"
              required
            />
            <Button
              type="submit"
              variant="primary"
              curvature="full"
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Subscribe
            </Button>
          </form>

          <Caption className="mt-4 block text-white/45">
            By subscribing, you agree to receive updates about our events and
            programs. You can unsubscribe at any time.
          </Caption>
        </Container>
      </Section>
    </main>
  );
}
