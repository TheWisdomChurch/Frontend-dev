// components/ui/Events/Events.tsx
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import {
  H2,
  H3,
  BaseText,
  BodyMD,
  BodySM,
  //   SmallText,
  SemiBoldText,
} from '@/components/text';
import { hero_bg_2, NL } from '@/components/assets';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUpcomingEvents } from '@/components/utils/hooks/UpcomingHooks';
import { ReminderModal } from '@/components/modal/reminderModal';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Phone, Calendar, Clock, MapPin } from 'lucide-react';

const Events = () => {
  const {
    // State
    currentDate,
    view,
    selectedEvent,
    isModalOpen,
    dateEvents,
    isDateModalOpen,
    isConferenceModalOpen,
    isLiftingModalOpen,
    isReminderModalOpen,
    formData,
    reminderFormData,
    formErrors,
    reminderFormErrors,
    isSubmitting,
    isSettingReminder,

    // Refs
    calendarRef,
    eventsRef,
    conferenceRef,
    newsletterRef,

    // Data
    months,
    years,
    calendarGrid,
    currentMonthEvents,

    // Handlers
    setView,
    handleInputChange,
    handleReminderInputChange,
    handleSubmit,
    handleReminderSubmit,
    handleEventClick,
    handleDateClick,
    openConferenceModal,
    closeConferenceModal,
    openLiftingModal,
    closeLiftingModal,
    openReminderModal,
    closeReminderModal,
    closeModal,
    closeDateModal,
    scrollToEvents,
    navigateMonth,
    navigateYear,
    selectMonth,
    selectYear,
  } = useUpcomingEvents();

  return (
    <div className="overflow-x-hidden">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />

      {/* Hero Section */}
      <HeroSection
        title="Events & Programs"
        subtitle="What's Happening at Wisdom House"
        description="Stay connected with all the activities, studies, and gatherings happening throughout the week. There's always something going on!"
        backgroundImage={hero_bg_2.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Featured Event Section - SLIM & MODERN */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -translate-y-16 translate-x-16 opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full -translate-x-12 translate-y-12 opacity-40"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header - Slimmer */}
            <div className="text-center mb-10 md:mb-12">
              <H2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 tracking-normal">
                Upcoming <span className="text-yellow-500">Events</span>
              </H2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mb-4 rounded-full"></div>
              <BodyMD className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
                Discover transformative experiences and spiritual gatherings
                designed to uplift and inspire
              </BodyMD>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">
              {/* Image Column */}
              <div className="flex justify-center lg:justify-start">
                <div className="w-full max-w-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                  <div className="relative w-full h-60 sm:h-72 md:h-80">
                    <Image
                      src={NL}
                      alt="7 Nights of Lifting - Transformative Nights of Worship"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 40vw"
                      priority
                    />
                  </div>

                  {/* Text below image - Slim */}
                  <div className="bg-white p-4 text-center border-t border-gray-100">
                    <SemiBoldText className="text-lg md:text-xl text-gray-900 mb-1">
                      7 Nights of Lifting
                    </SemiBoldText>
                    <BodySM className="text-gray-500">
                      Transformative Worship & Prayer
                    </BodySM>
                  </div>
                </div>
              </div>

              {/* Content Column - Slim Text */}
              <div className="space-y-4 md:space-y-5">
                <H3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 leading-snug">
                  7 Nights of <span className="text-yellow-500">Lifting</span>
                </H3>
                <div className="space-y-3">
                  <BodyMD className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
                    Join us for seven powerful nights of worship, prayer, and
                    spiritual elevation. Each night features special guests,
                    anointed worship, and life-changing messages.
                  </BodyMD>
                  <BodyMD className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
                    Experience transformative worship where we come together as
                    a community to seek God's presence and power in our lives.
                  </BodyMD>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
                  <button
                    onClick={openLiftingModal}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    Register to Attend
                  </button>
                  <button
                    onClick={() => openReminderModal('lifting')}
                    className="border border-gray-300 text-gray-700 px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  >
                    Set Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Section - Modern & Clean */}
      <section
        ref={calendarRef}
        className="py-10 md:py-14 bg-gray-50 text-gray-900 border-t border-gray-200"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <H2 className="mb-3 text-xl md:text-2xl lg:text-3xl font-semibold">
                Event <span className="text-yellow-500">Calendar</span>
              </H2>
              <BodyMD className="text-sm md:text-base text-gray-600 mb-6 max-w-2xl mx-auto font-light">
                Browse through our interactive calendar to stay updated with all
                upcoming events
              </BodyMD>

              {/* Calendar Controls - Slimmer */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-5 bg-white rounded-lg shadow-sm p-3 gap-3 border border-gray-200">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigateYear('prev')}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-all duration-200"
                  >
                    <span className="text-lg">‹‹</span>
                  </button>
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-all duration-200"
                  >
                    <span className="text-lg">‹</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={() => setView(view === 'month' ? 'year' : 'month')}
                    className="bg-yellow-400 text-gray-900 px-3 md:px-4 py-1.5 rounded-md font-medium hover:bg-yellow-500 transition-all duration-200 shadow-sm text-xs md:text-sm"
                  >
                    {view === 'month' ? 'Month View' : 'Year View'}
                  </button>
                  <BaseText
                    fontFamily="bricolage"
                    weight="semibold"
                    className="text-lg md:text-xl text-gray-900 text-center"
                  >
                    {view === 'month'
                      ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                      : currentDate.getFullYear()}
                  </BaseText>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-all duration-200"
                  >
                    <span className="text-lg">›</span>
                  </button>
                  <button
                    onClick={() => navigateYear('next')}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-all duration-200"
                  >
                    <span className="text-lg">››</span>
                  </button>
                </div>
              </div>

              {/* Year Selector - Compact */}
              <div className="flex flex-wrap justify-center gap-1 mb-5">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => selectYear(year)}
                    className={`px-2 md:px-3 py-1 rounded-md font-medium transition-all duration-200 text-xs md:text-sm ${
                      currentDate.getFullYear() === year
                        ? 'bg-yellow-400 text-gray-900 shadow-sm'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {view === 'year' ? (
              /* Year View - Clean */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 mb-6">
                {months.map((month, index) => {
                  const hasEvents = currentMonthEvents.length > 0;
                  return (
                    <div
                      key={month}
                      onClick={() => selectMonth(index)}
                      className={`bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border transform hover:scale-105 ${
                        currentDate.getMonth() === index
                          ? 'border-yellow-400 bg-yellow-50'
                          : hasEvents
                            ? 'border-green-200 hover:border-green-300 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <BaseText
                        fontFamily="bricolage"
                        weight="medium"
                        className="text-sm text-gray-900 mb-1"
                      >
                        {month}
                      </BaseText>
                      {hasEvents ? (
                        <div className="space-y-0.5">
                          <span className="inline-block bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
                            {currentMonthEvents.length} event
                            {currentMonthEvents.length > 1 ? 's' : ''}
                          </span>
                          <BodySM className="text-gray-500">
                            Click to view
                          </BodySM>
                        </div>
                      ) : (
                        <BodySM className="text-gray-400">No events</BodySM>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Month View - Clean */
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(
                    day => (
                      <div
                        key={day}
                        className="p-2 text-center font-medium text-gray-600 text-xs uppercase tracking-wide"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px bg-gray-100 p-px">
                  {calendarGrid.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-16 p-1 transition-all duration-200 ${
                        !day.isCurrentMonth
                          ? 'bg-gray-50 text-gray-400'
                          : 'bg-white hover:bg-gray-50 text-gray-900'
                      } ${
                        day.isToday
                          ? 'bg-yellow-50 border border-yellow-300'
                          : ''
                      } ${
                        day.events.length > 0
                          ? 'cursor-pointer hover:scale-105'
                          : ''
                      }`}
                      onClick={() => handleDateClick(day.date, day.events)}
                    >
                      <div
                        className={`text-xs font-medium mb-1 ${
                          day.isToday
                            ? 'text-yellow-600'
                            : !day.isCurrentMonth
                              ? 'text-gray-400'
                              : 'text-gray-900'
                        }`}
                      >
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-0.5">
                        {day.events.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs p-1 rounded font-medium cursor-pointer hover:shadow-sm transition-all duration-200"
                            title={event.title}
                          >
                            <div className="truncate leading-none">
                              {event.title}
                            </div>
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded text-center">
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Month Events List - Slim */}
            <div
              ref={eventsRef}
              className="mt-6 bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200"
            >
              <H3 className="mb-4 text-lg md:text-xl font-semibold text-center">
                Events for{' '}
                <span className="text-yellow-500">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
              </H3>

              {currentMonthEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {currentMonthEvents.map(event => (
                    <div
                      key={event.id}
                      className="bg-gray-50 rounded-lg p-3 border-l-3 border-yellow-400 hover:shadow-md transition-all duration-200 hover:scale-[1.02] group cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          {event.logo && (
                            <span className="text-base">{event.logo}</span>
                          )}
                          <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium border border-yellow-200">
                            {event.type}
                          </span>
                        </div>
                      </div>
                      <BaseText
                        fontFamily="bricolage"
                        weight="semibold"
                        className="text-base text-gray-900 mb-1.5 group-hover:text-yellow-600 transition-colors duration-200 line-clamp-1"
                      >
                        {event.title}
                      </BaseText>
                      {event.description && (
                        <BodySM className="text-gray-600 mb-2 leading-relaxed line-clamp-2 font-light">
                          {event.description}
                        </BodySM>
                      )}
                      <div className="space-y-1 text-gray-600 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                      <button className="w-full mt-2 bg-yellow-400 text-gray-900 py-1.5 rounded-md font-medium hover:bg-yellow-500 transition-all duration-200 shadow-sm text-xs">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-2xl mb-2">📅</div>
                  <BaseText
                    fontFamily="bricolage"
                    weight="medium"
                    className="text-base text-gray-500 mb-1"
                  >
                    No events scheduled for {months[currentDate.getMonth()]}
                  </BaseText>
                  <BodySM className="text-gray-400">
                    Check back later for updates
                  </BodySM>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Conference Banner - Sleek */}
      <section
        ref={conferenceRef}
        className="py-12 md:py-16 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden"
      >
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            poster="/conference-poster.jpg"
          >
            <source src="/videos/videoBg.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20 shadow-lg">
              <H2 className="mb-3 text-xl md:text-2xl lg:text-3xl font-semibold leading-tight">
                Wisdom Power <span className="text-yellow-300">Conference</span>{' '}
                2026
              </H2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mb-4 rounded-full"></div>
              <BodyMD className="text-sm md:text-base mb-6 opacity-90 leading-relaxed font-light">
                The most anticipated spiritual gathering of the year. Experience
                powerful teachings, anointed worship, and life-changing
                encounters.
              </BodyMD>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={openConferenceModal}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-5 md:px-6 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-md"
                >
                  Register Now
                </button>
                <button
                  onClick={() => openReminderModal('conference')}
                  className="border border-white/50 text-white px-5 md:px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-white/10 transition-all duration-300"
                >
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pastoral Care Banner - Modern */}
      <section className="py-10 md:py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
              {/* Header */}
              <div className="text-center mb-6">
                <H2 className="mb-2 text-lg md:text-xl font-semibold text-gray-900">
                  Pastoral Care Services
                </H2>
                <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mb-4 rounded-full"></div>
                <BodyMD className="text-sm text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed font-light">
                  Celebrate life's special moments with us. From weddings and
                  dedications to memorial services.
                </BodyMD>
              </div>

              {/* Services Grid - Compact */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
                {[
                  { icon: '💒', label: 'Weddings' },
                  { icon: '👶', label: 'Dedications' },
                  { icon: '🎉', label: 'Celebrations' },
                  { icon: '🙏', label: 'Memorials' },
                ].map((service, index) => (
                  <div
                    key={index}
                    className="text-center p-2 rounded-lg bg-white hover:bg-yellow-50 transition-colors duration-200 border border-gray-200"
                  >
                    <div className="text-lg mb-1">{service.icon}</div>
                    <BodySM className="text-xs font-medium text-gray-700">
                      {service.label}
                    </BodySM>
                  </div>
                ))}
              </div>

              {/* CTA Buttons - Slim */}
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/pastoral"
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 md:px-5 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-sm inline-flex items-center justify-center gap-1.5"
                >
                  <span>Request Care</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <button className="border border-gray-300 text-gray-700 px-4 md:px-5 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 inline-flex items-center justify-center gap-1.5">
                  <Phone className="w-3 h-3" />
                  <span>Contact</span>
                </button>
              </div>

              {/* Additional Info */}
              <BodySM className="text-gray-500 mt-3 max-w-2xl mx-auto">
                Our pastoral team is available to officiate ceremonies and
                provide spiritual guidance.
              </BodySM>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Clean */}
      <section
        ref={newsletterRef}
        className="py-10 md:py-12 bg-gray-50 border-t border-gray-200"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <H2 className="mb-2 text-lg md:text-xl font-semibold text-gray-900">
              Stay <span className="text-yellow-500">Updated</span>
            </H2>
            <BodyMD className="text-sm text-gray-600 mb-4 max-w-xl mx-auto leading-relaxed font-light">
              Get the latest news about our upcoming programs and events
            </BodyMD>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <form className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900 placeholder-gray-500 text-sm font-normal transition-all duration-200"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-md font-semibold text-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 shadow-sm whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
                <BodySM className="text-gray-500">
                  Unsubscribe anytime. We respect your privacy.
                </BodySM>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
