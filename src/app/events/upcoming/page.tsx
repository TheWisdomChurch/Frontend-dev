/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import {
  H2,
  H3,
  BaseText,
  LightText,
  BodyMD,
  SemiBoldText,
} from '@/components/text';
import { hero_bg_2, NL } from '@/components/assets';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUpcomingEvents } from '@/components/utils/hooks/UpcomingHooks';



import { ReminderModal } from '@/components/modal/reminderModal';

import Image from 'next/image';

// Import your images - you'll need to add these to your assets
// import conferenceVideo from '@/components/assets/videos/conference-bg.mp4';
// import liftingImage from '@/components/assets/images/lifting-event.jpg';

const Upcoming = () => {
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
    reminderEventType,
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
    location,
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

      <HeroSection
        title="Upcoming Events"
        subtitle="What's Happening at Wisdom House"
        description="Stay connected with all the activities, studies, and gatherings happening throughout the week. There's always something going on!"
        backgroundImage={hero_bg_2.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Happening This Month Section - Updated with Image */}
      {/* Happening This Month Section - Updated with Image */}
      {/* Happening This Month Section - Updated with Image */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-yellow-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-blue-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-20"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Bold Header */}
            <div className="text-center mb-12 md:mb-16">
              <BaseText
                fontFamily="bricolage"
                weight="black"
                className="text-4xl md:text-6xl lg:text-7xl text-gray-900 mb-4 md:mb-6 tracking-tight"
              >
                UPCOMING <span className="text-yellow-500">EVENTS</span>
              </BaseText>
              <div className="w-20 h-1 md:w-24 md:h-2 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-4 md:mb-6 rounded-full"></div>
              <BodyMD className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover transformative experiences and spiritual gatherings
                designed to uplift and inspire your journey
              </BodyMD>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              {/* Image Column - Fixed container size */}
              <div className="flex justify-center lg:justify-start">
                <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96">
                    <Image
                      src={NL}
                      alt="7 Nights of Lifting - Transformative Nights of Worship"
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 40vw"
                      priority
                    />
                    {/* Optional: Add a subtle border or background if needed */}
                    <div className="absolute inset-0 border-2 border-gray-200 rounded-2xl lg:rounded-3xl pointer-events-none"></div>
                  </div>

                  {/* Text below the image instead of overlay */}
                  <div className="bg-white p-4 md:p-6 text-center">
                    <SemiBoldText className="text-xl md:text-2xl lg:text-3xl text-gray-900 mb-2">
                      7 Nights of Lifting
                    </SemiBoldText>
                    <BodyMD className="text-gray-600 text-sm md:text-base">
                      Transformative Nights of Worship & Prayer
                    </BodyMD>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="space-y-6 md:space-y-8">
                <H2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                  7 Nights of <span className="text-yellow-500">Lifting</span>
                </H2>
                <div className="space-y-4">
                  <BodyMD className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                    Join us for seven powerful nights of worship, prayer, and
                    spiritual elevation. Each night features special guests,
                    anointed worship, and life-changing messages that will lift
                    your spirit and strengthen your faith.
                  </BodyMD>
                  <BodyMD className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                    Don't miss this transformative experience where we come
                    together as a community to seek God's presence and power in
                    our lives.
                  </BodyMD>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                  <button
                    onClick={openLiftingModal}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:shadow-xl lg:hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Register to Attend
                  </button>
                  <button
                    onClick={() => openReminderModal('lifting')}
                    className="border-2 border-gray-300 text-gray-700 px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  >
                    Remind Me Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Calendar Section - Made More Compact */}
      <section
        ref={calendarRef}
        className="py-12 md:py-16 bg-gray-900 text-white"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <H2 className="mb-4 md:mb-6 text-3xl md:text-4xl lg:text-5xl font-black">
                Event <span className="text-yellow-400">Calendar</span>
              </H2>
              <BodyMD className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
                Browse through our interactive calendar to stay updated with all
                upcoming events and gatherings
              </BodyMD>

              {/* Calendar Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-gray-800 rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 gap-4">
                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={() => navigateYear('prev')}
                    className="p-2 md:p-3 hover:bg-gray-700 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-xl md:text-2xl">‹‹</span>
                  </button>
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 md:p-3 hover:bg-gray-700 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-xl md:text-2xl">‹</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-6">
                  <button
                    onClick={() => setView(view === 'month' ? 'year' : 'month')}
                    className="bg-yellow-400 text-gray-900 px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base"
                  >
                    {view === 'month' ? 'Month View' : 'Year View'}
                  </button>
                  <BaseText
                    fontFamily="bricolage"
                    weight="black"
                    className="text-2xl md:text-3xl text-white text-center"
                  >
                    {view === 'month'
                      ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                      : currentDate.getFullYear()}
                  </BaseText>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 md:p-3 hover:bg-gray-700 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-xl md:text-2xl">›</span>
                  </button>
                  <button
                    onClick={() => navigateYear('next')}
                    className="p-2 md:p-3 hover:bg-gray-700 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-xl md:text-2xl">››</span>
                  </button>
                </div>
              </div>

              {/* Year Selector */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => selectYear(year)}
                    className={`px-3 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-bold transition-all duration-300 text-sm md:text-base ${
                      currentDate.getFullYear() === year
                        ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
                        : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:scale-105'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {view === 'year' ? (
              /* Year View - More Compact */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8">
                {months.map((month, index) => {
                  const hasEvents = currentMonthEvents.length > 0;
                  return (
                    <div
                      key={month}
                      onClick={() => selectMonth(index)}
                      className={`bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 transform hover:scale-105 ${
                        currentDate.getMonth() === index
                          ? 'border-yellow-400 bg-yellow-400 bg-opacity-10'
                          : hasEvents
                            ? 'border-green-500 hover:border-green-400 bg-green-400 bg-opacity-5'
                            : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <BaseText
                        fontFamily="bricolage"
                        weight="black"
                        className="text-lg md:text-xl text-white mb-2"
                      >
                        {month}
                      </BaseText>
                      {hasEvents ? (
                        <div className="space-y-1">
                          <span className="inline-block bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {currentMonthEvents.length} event
                            {currentMonthEvents.length > 1 ? 's' : ''}
                          </span>
                          <BodyMD className="text-xs text-gray-400">
                            Click to view events
                          </BodyMD>
                        </div>
                      ) : (
                        <BodyMD className="text-xs text-gray-500">
                          No events scheduled
                        </BodyMD>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Month View - More Compact */
              <div className="bg-gray-800 rounded-xl md:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 bg-gray-900 border-b border-gray-700">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(
                    day => (
                      <div
                        key={day}
                        className="p-2 md:p-3 lg:p-4 text-center font-black text-gray-300 text-xs md:text-sm uppercase tracking-wider"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 bg-gray-700 p-1 md:p-2">
                  {calendarGrid.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-20 md:min-h-24 p-1 md:p-2 rounded-lg md:rounded-xl transition-all duration-300 ${
                        !day.isCurrentMonth
                          ? 'bg-gray-900 text-gray-600'
                          : 'bg-gray-800 hover:bg-gray-750 text-white'
                      } ${
                        day.isToday
                          ? 'bg-yellow-400 bg-opacity-20 border-2 border-yellow-400'
                          : ''
                      } ${
                        day.events.length > 0
                          ? 'cursor-pointer hover:scale-105'
                          : ''
                      }`}
                      onClick={() => handleDateClick(day.date, day.events)}
                    >
                      <div
                        className={`text-sm md:text-base font-bold mb-1 ${
                          day.isToday
                            ? 'text-yellow-400'
                            : !day.isCurrentMonth
                              ? 'text-gray-600'
                              : 'text-white'
                        }`}
                      >
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {day.events.slice(0, 2).map((event, eventIndex) => (
                          <div
                            key={event.id}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs p-1 rounded md:rounded-lg font-semibold cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            title={event.title}
                          >
                            <div className="truncate">{event.title}</div>
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-gray-400 bg-gray-700 px-1 py-0.5 rounded text-center">
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Month Events List - More Compact Cards */}
            <div
              ref={eventsRef}
              className="mt-8 md:mt-12 bg-gray-800 rounded-xl md:rounded-2xl lg:rounded-3xl shadow-xl p-6 md:p-8 lg:p-10"
            >
              <H3 className="mb-6 text-2xl md:text-3xl font-black text-center">
                Events for{' '}
                <span className="text-yellow-400">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
              </H3>

              {currentMonthEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                  {currentMonthEvents.map(event => (
                    <div
                      key={event.id}
                      className="event-card bg-gradient-to-br from-gray-750 to-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 border-l-4 border-yellow-400 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {event.logo && (
                            <span className="text-xl md:text-2xl">
                              {event.logo}
                            </span>
                          )}
                          <span className="inline-block bg-yellow-400 bg-opacity-20 text-yellow-400 px-2 md:px-3 py-1 rounded-full text-xs font-black border border-yellow-400 border-opacity-30">
                            {event.type}
                          </span>
                        </div>
                      </div>
                      <BaseText
                        fontFamily="bricolage"
                        weight="black"
                        className="text-lg md:text-xl lg:text-2xl text-white mb-2 md:mb-3 group-hover:text-yellow-400 transition-colors duration-300"
                      >
                        {event.title}
                      </BaseText>
                      {event.description && (
                        <BodyMD className="text-gray-300 mb-3 md:mb-4 leading-relaxed text-sm md:text-base line-clamp-2">
                          {event.description}
                        </BodyMD>
                      )}
                      <div className="space-y-1 md:space-y-2 text-gray-300 text-sm">
                        <div className="flex items-center">
                          <SemiBoldText className="w-12 md:w-16 text-gray-400 text-xs md:text-sm">
                            Date:
                          </SemiBoldText>
                          <BodyMD className="text-xs md:text-sm">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </BodyMD>
                        </div>
                        <div className="flex items-center">
                          <SemiBoldText className="w-12 md:w-16 text-gray-400 text-xs md:text-sm">
                            Time:
                          </SemiBoldText>
                          <BodyMD className="text-xs md:text-sm">
                            {event.time}
                          </BodyMD>
                        </div>
                        <div className="flex items-center">
                          <SemiBoldText className="w-12 md:w-16 text-gray-400 text-xs md:text-sm">
                            Where:
                          </SemiBoldText>
                          <BodyMD className="text-xs md:text-sm">
                            {event.location}
                          </BodyMD>
                        </div>
                      </div>
                      <button className="w-full mt-3 md:mt-4 bg-yellow-400 text-gray-900 py-2 md:py-3 rounded-lg md:rounded-xl font-black hover:bg-yellow-500 transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base">
                        Add to Calendar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <div className="text-4xl md:text-6xl mb-3 md:mb-4">📅</div>
                  <BaseText
                    fontFamily="bricolage"
                    weight="bold"
                    className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-2 md:mb-3"
                  >
                    No events scheduled for {months[currentDate.getMonth()]}{' '}
                    {currentDate.getFullYear()}
                  </BaseText>
                  <BodyMD className="text-gray-500 text-sm md:text-base">
                    Check back later for updates or browse other months.
                  </BodyMD>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Wisdom Power Conference 2026 Banner with Video Background */}
      {/* Wisdom Power Conference 2026 Banner with Video Background */}
      <section
        ref={conferenceRef}
        className="min-h-[80vh] md:min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden"
      >
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            poster="/conference-poster.jpg" // Add a poster image as fallback
          >
            {/* Correct video source - place your video in public/videos folder */}
            <source src="/videos/videoBg.mp4" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
          </video>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
          <div
            className="absolute -bottom-20 -left-20 w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-purple-500 rounded-full opacity-10 animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl lg:max-w-5xl mx-auto text-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 border border-white border-opacity-20 shadow-2xl">
              <H2 className="mb-4 md:mb-6 text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                WISDOM POWER <span className="text-yellow-400">CONFERENCE</span>{' '}
                2026
              </H2>
              <div className="w-20 h-1 md:w-24 md:h-1.5 lg:w-32 lg:h-2 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-6 md:mb-8 rounded-full"></div>
              <BodyMD className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-8 md:mb-10 lg:mb-12 opacity-90 leading-relaxed font-light">
                The most anticipated spiritual gathering of the year is coming.
                Experience powerful teachings, anointed worship, and
                life-changing encounters.
              </BodyMD>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <button
                  onClick={openConferenceModal}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 md:px-12 lg:px-16 py-3 md:py-4 lg:py-6 rounded-xl md:rounded-2xl font-black text-base md:text-lg lg:text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 shadow-xl"
                >
                  Register for Event
                </button>
                <button
                  onClick={() => openReminderModal('conference')}
                  className="border-2 border-white text-white px-8 md:px-12 lg:px-16 py-3 md:py-4 lg:py-6 rounded-xl md:rounded-2xl font-bold text-base md:text-lg lg:text-xl hover:bg-white hover:bg-opacity-10 transition-all duration-500"
                >
                  Remind Me Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - More Compact */}
      <section
        ref={newsletterRef}
        className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-white to-gray-100"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl lg:max-w-4xl mx-auto text-center">
            <H2 className="mb-4 md:mb-6 text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
              Stay <span className="text-yellow-500">Updated</span>
            </H2>
            <BodyMD className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed">
              Get the latest news and updates about our upcoming programs and
              events delivered to your inbox
            </BodyMD>

            <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-10 shadow-xl border border-gray-200">
              <form className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900 placeholder-gray-500 text-base md:text-lg font-semibold transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 md:px-8 lg:px-10 py-3 md:py-4 rounded-lg md:rounded-xl font-black text-base md:text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap"
                  >
                    Subscribe Now
                  </button>
                </div>
                <BodyMD className="text-xs md:text-sm text-gray-500">
                  By subscribing, you agree to receive updates about our events
                  and programs. You can unsubscribe at any time. We respect your
                  privacy.
                </BodyMD>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Upcoming;
