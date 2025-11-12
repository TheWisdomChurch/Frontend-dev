/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2, H3 } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUpcomingEvents } from '@/components/utils/hooks/UpcomingHooks';

// Import modal components (you can create these as separate components)
import { EventModal } from '@/components/modal/EventModal';
import { ConferenceModal } from '@/components/modal/conferenceModal';
import { LiftingModal } from '@/components/modal/LiftingModal';
import { ReminderModal } from '@/components/modal/reminderModal';
import { DateEventsModal } from '@/components/modal/dateEvent';

// import { DateEventsModal } from './modals/DateEventsModal';
// import { ConferenceModal } from './modals/ConferenceModal';
// import { LiftingModal } from './modals/LiftingModal';
// import { ReminderModal } from './modals/ReminderModal';

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
        showButtons={true}
        primaryButtonText="Download Calendar"
        secondaryButtonText="Subscribe to Updates"
        showScrollIndicator={true}
      />

      {/* Happening This Month Section */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Bold Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
                UPCOMING <span className="text-yellow-500">EVENTS</span>
              </h1>
              <div className="w-24 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-6"></div>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover transformative experiences and spiritual gatherings
                designed to uplift and inspire your journey
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image Column */}
              <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
                <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 h-96 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black opacity-20"></div>
                  <span className="text-white text-3xl font-bold text-center px-4 relative z-10">
                    7 Nights of Lifting
                  </span>
                </div>
              </div>

              {/* Content Column */}
              <div className="space-y-8">
                <H2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  7 Nights of <span className="text-yellow-500">Lifting</span>
                </H2>
                <div className="space-y-4">
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Join us for seven powerful nights of worship, prayer, and
                    spiritual elevation. Each night features special guests,
                    anointed worship, and life-changing messages that will lift
                    your spirit and strengthen your faith.
                  </p>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Don't miss this transformative experience where we come
                    together as a community to seek God's presence and power in
                    our lives.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={openLiftingModal}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Register to Attend
                  </button>
                  <button
                    onClick={() => openReminderModal('lifting')}
                    className="border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  >
                    Remind Me Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Calendar Section */}
      <section ref={calendarRef} className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="mb-6 text-4xl md:text-5xl font-black">
                Event <span className="text-yellow-400">Calendar</span>
              </H2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Browse through our interactive calendar to stay updated with all
                upcoming events and gatherings
              </p>

              {/* Calendar Controls */}
              <div className="flex items-center justify-between mb-8 bg-gray-800 rounded-2xl shadow-2xl p-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateYear('prev')}
                    className="p-3 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-2xl">‹‹</span>
                  </button>
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-3 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-2xl">‹</span>
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setView(view === 'month' ? 'year' : 'month')}
                    className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {view === 'month' ? 'Month View' : 'Year View'}
                  </button>
                  <h3 className="text-3xl font-black text-white">
                    {view === 'month'
                      ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                      : currentDate.getFullYear()}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-3 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-2xl">›</span>
                  </button>
                  <button
                    onClick={() => navigateYear('next')}
                    className="p-3 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-2xl">››</span>
                  </button>
                </div>
              </div>

              {/* Year Selector */}
              <div className="flex justify-center gap-3 mb-8">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => selectYear(year)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
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
              /* Year View */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {months.map((month, index) => {
                  const hasEvents = currentMonthEvents.length > 0;
                  return (
                    <div
                      key={month}
                      onClick={() => selectMonth(index)}
                      className={`bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 transform hover:scale-105 ${
                        currentDate.getMonth() === index
                          ? 'border-yellow-400 bg-yellow-400 bg-opacity-10'
                          : hasEvents
                            ? 'border-green-500 hover:border-green-400 bg-green-400 bg-opacity-5'
                            : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <h3 className="text-xl font-black text-white mb-3">
                        {month}
                      </h3>
                      {hasEvents ? (
                        <div className="space-y-2">
                          <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {currentMonthEvents.length} event
                            {currentMonthEvents.length > 1 ? 's' : ''}
                          </span>
                          <p className="text-sm text-gray-400">
                            Click to view events
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No events scheduled
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Month View */
              <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 bg-gray-900 border-b border-gray-700">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(
                    day => (
                      <div
                        key={day}
                        className="p-6 text-center font-black text-gray-300 text-sm uppercase tracking-wider"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 bg-gray-700 p-2">
                  {calendarGrid.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-32 p-3 rounded-xl transition-all duration-300 ${
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
                        className={`text-lg font-bold mb-2 ${
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
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs p-2 rounded-lg font-semibold cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            title={event.title}
                          >
                            <div className="truncate">{event.title}</div>
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded text-center">
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Month Events List */}
            <div
              ref={eventsRef}
              className="mt-16 bg-gray-800 rounded-3xl shadow-2xl p-10"
            >
              <H3 className="mb-8 text-3xl font-black text-center">
                Events for{' '}
                <span className="text-yellow-400">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
              </H3>

              {currentMonthEvents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {currentMonthEvents.map(event => (
                    <div
                      key={event.id}
                      className="event-card bg-gradient-to-br from-gray-750 to-gray-800 rounded-2xl p-8 border-l-4 border-yellow-400 hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {event.logo && (
                            <span className="text-2xl">{event.logo}</span>
                          )}
                          <span className="inline-block bg-yellow-400 bg-opacity-20 text-yellow-400 px-4 py-2 rounded-full text-sm font-black border border-yellow-400 border-opacity-30">
                            {event.type}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-2xl font-black text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-gray-300 mb-6 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-center">
                          <span className="font-black w-20 text-gray-400">
                            Date:
                          </span>
                          <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-black w-20 text-gray-400">
                            Time:
                          </span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-black w-20 text-gray-400">
                            Where:
                          </span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <button className="w-full mt-6 bg-yellow-400 text-gray-900 py-4 rounded-xl font-black hover:bg-yellow-500 transition-all duration-300 hover:scale-105 shadow-lg">
                        Add to Calendar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-2xl text-gray-400 mb-4 font-bold">
                    No events scheduled for {months[currentDate.getMonth()]}{' '}
                    {currentDate.getFullYear()}
                  </p>
                  <p className="text-gray-500">
                    Check back later for updates or browse other months.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Wisdom Power Conference 2026 Banner */}
      <section
        ref={conferenceRef}
        className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-10 animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-12 border border-white border-opacity-20 shadow-2xl">
              <H2 className="mb-8 text-5xl md:text-7xl font-black leading-tight">
                WISDOM POWER <span className="text-yellow-400">CONFERENCE</span>{' '}
                2026
              </H2>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-2xl md:text-3xl mb-12 opacity-90 leading-relaxed font-light">
                The most anticipated spiritual gathering of the year is coming.
                Experience powerful teachings, anointed worship, and
                life-changing encounters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={openConferenceModal}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-16 py-6 rounded-2xl font-black text-xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 shadow-2xl"
                >
                  Register for Event
                </button>
                <button
                  onClick={() => openReminderModal('conference')}
                  className="border-2 border-white text-white px-16 py-6 rounded-2xl font-bold text-xl hover:bg-white hover:bg-opacity-10 transition-all duration-500"
                >
                  Remind Me Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        ref={newsletterRef}
        className="py-24 bg-gradient-to-br from-white to-gray-100"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-6 text-4xl md:text-5xl font-black text-gray-900">
              Stay <span className="text-yellow-500">Updated</span>
            </H2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Get the latest news and updates about our upcoming programs and
              events delivered to your inbox
            </p>

            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-200">
              <form className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-5 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900 placeholder-gray-500 text-lg font-semibold transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-5 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap"
                  >
                    Subscribe Now
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  By subscribing, you agree to receive updates about our events
                  and programs. You can unsubscribe at any time. We respect your
                  privacy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {isModalOpen && selectedEvent && (
        <EventModal event={selectedEvent} onClose={closeModal} />
      )}

      {isDateModalOpen && dateEvents && (
        <DateEventsModal
          dateEvents={dateEvents}
          onClose={closeDateModal}
          onViewEvents={scrollToEvents}
          onEventClick={handleEventClick}
        />
      )}

      {isConferenceModalOpen && (
        <ConferenceModal
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSubmit={e => handleSubmit(e, 'conference')}
          onClose={closeConferenceModal}
        />
      )}

      {isLiftingModalOpen && (
        <LiftingModal
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSubmit={e => handleSubmit(e, 'lifting')}
          onClose={closeLiftingModal}
        />
      )}

      {isReminderModalOpen && (
        <ReminderModal
          formData={reminderFormData}
          formErrors={reminderFormErrors}
          isSettingReminder={isSettingReminder}
          onInputChange={handleReminderInputChange}
          onSubmit={handleReminderSubmit}
          onClose={closeReminderModal}
        />
      )}
    </div>
  );
};

export default Upcoming;
