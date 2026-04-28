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
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
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

      <section className="relative overflow-hidden bg-[#050505] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(247,222,18,0.13),transparent_28%),radial-gradient(circle_at_90%_16%,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,#050505_0%,#080808_55%,#050505_100%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
              Featured program
            </p>
            <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Upcoming Events
            </h1>
            <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
              Discover transformative experiences and spiritual gatherings
              designed to uplift and inspire your journey.
            </p>
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
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
                Transformative nights of worship & prayer
              </p>

              <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                7 Nights of <span className="text-[#f7de12]">Lifting</span>
              </h2>

              <div className="space-y-3 text-sm leading-7 text-white/65 sm:text-base">
                <p>
                  Join us for seven powerful nights of worship, prayer, and
                  spiritual elevation. Each night features special guests,
                  anointed worship, and life-changing messages that will lift
                  your spirit and strengthen your faith.
                </p>
                <p>
                  Don&apos;t miss this transformative experience where we come
                  together as a community to seek God&apos;s presence and power
                  in our lives.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={openLiftingModal}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f7de12] px-6 text-sm font-extrabold text-black shadow-lg shadow-[#f7de12]/20 transition hover:-translate-y-0.5 hover:bg-[#ffe93d]"
                >
                  Register to Attend
                </button>

                <button
                  type="button"
                  onClick={() => openReminderModal('lifting')}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 text-sm font-bold text-white/80 transition hover:bg-white/[0.08]"
                >
                  Remind Me Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={calendarRef}
        className="relative overflow-hidden bg-[#080808] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 sm:rounded-[2rem] sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
                  Event calendar
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {view === 'month'
                    ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                    : currentDate.getFullYear()}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Browse through our interactive calendar to stay updated with
                  all upcoming events and gatherings.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setView(view === 'month' ? 'year' : 'month')}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#f7de12] px-5 text-sm font-extrabold text-black"
              >
                {view === 'month' ? 'Year View' : 'Month View'}
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateYear('prev')}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/25 text-white/75 hover:bg-white/[0.06]"
                >
                  ‹‹
                </button>
                <button
                  type="button"
                  onClick={() => navigateMonth('prev')}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/25 text-white/75 hover:bg-white/[0.06]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {years.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => selectYear(year)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      currentDate.getFullYear() === year
                        ? 'bg-[#f7de12] text-black'
                        : 'border border-white/10 bg-black/25 text-white/65 hover:bg-white/[0.06]'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateMonth('next')}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/25 text-white/75 hover:bg-white/[0.06]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateYear('next')}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/25 text-white/75 hover:bg-white/[0.06]"
                >
                  ››
                </button>
              </div>
            </div>
          </div>

          {view === 'year' ? (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {months.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => selectMonth(index)}
                  className={`rounded-[1.25rem] border p-5 text-left transition hover:-translate-y-1 ${
                    currentDate.getMonth() === index
                      ? 'border-[#f7de12]/60 bg-[#f7de12]/10'
                      : 'border-white/10 bg-white/[0.04] hover:border-[#f7de12]/35'
                  }`}
                >
                  <p className="text-lg font-semibold text-white">{month}</p>
                  <p className="mt-2 text-sm text-white/50">
                    Click to view month
                  </p>
                </button>
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
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateClick(day.date, day.events)}
                      className={`min-h-[104px] rounded-2xl border p-3 text-left transition ${
                        day.isToday
                          ? 'border-[#f7de12]/70 bg-[#f7de12]/10'
                          : day.isCurrentMonth
                            ? 'border-white/10 bg-black/25 hover:bg-white/[0.05]'
                            : 'border-white/5 bg-black/10 text-white/30'
                      } ${day.events.length > 0 ? 'cursor-pointer' : ''}`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          day.isToday ? 'text-[#f7de12]' : 'text-white'
                        }`}
                      >
                        {day.date.getDate()}
                      </p>

                      <div className="mt-2 space-y-1">
                        {day.events.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className="truncate rounded-full bg-[#f7de12] px-2 py-1 text-xs font-bold text-black"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}

                        {day.events.length > 2 ? (
                          <p className="text-xs text-white/45">
                            +{day.events.length - 2} more
                          </p>
                        ) : null}
                      </div>
                    </button>
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
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
                This month
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                Events for {months[currentDate.getMonth()]}{' '}
                {currentDate.getFullYear()}
              </h3>
            </div>

            {currentMonthEvents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {currentMonthEvents.map(event => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => handleEventClick(event)}
                    className="group rounded-[1.25rem] border border-white/10 bg-black/25 p-5 text-left transition hover:-translate-y-1 hover:border-[#f7de12]/35 hover:bg-white/[0.035]"
                  >
                    <span className="inline-flex rounded-full bg-[#f7de12]/10 px-3 py-1 text-xs font-bold text-[#f7de12]">
                      {event.type}
                    </span>

                    <h4 className="mt-4 text-lg font-semibold leading-tight text-white group-hover:text-[#f7de12]">
                      {event.title}
                    </h4>

                    {event.description ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/60">
                        {event.description}
                      </p>
                    ) : null}

                    <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-white/55">
                      <p className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-[#f7de12]" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-white/35" />
                        {event.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-white/35" />
                        {event.location}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-lg font-semibold text-white/70">
                  No events scheduled for {months[currentDate.getMonth()]}{' '}
                  {currentDate.getFullYear()}
                </p>
                <p className="mt-2 text-sm text-white/45">
                  Check back later for updates or browse other months.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        ref={conferenceRef}
        className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
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

        <div className="relative mx-auto max-w-4xl rounded-[1.6rem] border border-white/10 bg-black/45 p-6 text-center shadow-2xl shadow-black/40 backdrop-blur-md sm:rounded-[2rem] sm:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
            Major gathering
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Wisdom Power <span className="text-[#f7de12]">Conference</span> 2026
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            The most anticipated spiritual gathering of the year is coming.
            Experience powerful teachings, anointed worship, and life-changing
            encounters.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openConferenceModal}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f7de12] px-6 text-sm font-extrabold text-black shadow-lg shadow-[#f7de12]/20 transition hover:-translate-y-0.5 hover:bg-[#ffe93d]"
            >
              Register for Event
            </button>
            <button
              type="button"
              onClick={() => openReminderModal('conference')}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 text-sm font-bold text-white/80 transition hover:bg-white/[0.08]"
            >
              Remind Me Later
            </button>
          </div>
        </div>
      </section>

      <section
        ref={newsletterRef}
        className="bg-[#050505] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
            Newsletter
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Stay Updated
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
            Get the latest news and updates about our upcoming programs and
            events delivered to your inbox.
          </p>

          <form className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/25 sm:flex sm:gap-3 sm:p-5">
            <input
              type="email"
              placeholder="Enter your email address"
              className="min-h-12 w-full rounded-full border border-white/10 bg-black/30 px-5 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#f7de12]/60 focus:ring-4 focus:ring-[#f7de12]/10"
              required
            />
            <button
              type="submit"
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#f7de12] px-6 text-sm font-extrabold text-black sm:mt-0 sm:w-auto"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-4 text-xs leading-5 text-white/45">
            By subscribing, you agree to receive updates about our events and
            programs. You can unsubscribe at any time.
          </p>
        </div>
      </section>
    </main>
  );
}
