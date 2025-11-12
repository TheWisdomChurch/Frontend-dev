/* eslint-disable @typescript-eslint/no-unused-vars */
// components/ui/SpecialPage.tsx
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2, H3 } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';
import { EventRegistrationModal } from '@/components/modal/EventRegistrationModal';
import { useSpecialEvents } from '@/components/utils/hooks/useSpecial';

const SpecialPage = () => {
  const {
    // State
    isModalOpen,
    selectedEvent,
    formData,
    formErrors,
    isSubmitting,

    // Refs
    headerRef,
    servicesRef,
    eventsRef,
    conferenceRef,

    // Data
    specialEvents,
    weeklyServices,

    // Handlers
    handleInputChange,
    handleSubmit,
    openModal,
    closeModal,
  } = useSpecialEvents();

  const featuredEvents = specialEvents.filter(event => event.featured);
  const regularEvents = specialEvents.filter(event => !event.featured);

  return (
    <div className="overflow-x-hidden">
      <HeroSection
        title="Special Events"
        subtitle="Celebrating God's Faithfulness Together"
        description="Join us for these meaningful celebrations and special services throughout the year as we worship, fellowship, and grow together in Christ."
        backgroundImage={hero_bg_1.src}
        showButtons={true}
        primaryButtonText="View Calendar"
        secondaryButtonText="Get Reminders"
        showScrollIndicator={true}
      />

      {/* Header Section */}
      <section
        ref={headerRef}
        className="py-20 bg-gradient-to-br from-gray-900 to-black text-white"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Every Service at{' '}
              <span className="text-yellow-400">The Wisdom House Church</span>{' '}
              is a Special Service
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              From our weekly worship gatherings to annual celebrations, every
              moment at Wisdom House is an opportunity to encounter God's
              presence and experience transformative spiritual growth.
            </p>
          </div>
        </div>
      </section>

      {/* Weekly Services Section */}
      <section ref={servicesRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="mb-6">Weekly Services Schedule</H2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join us throughout the week for powerful times of worship,
                teaching, and fellowship
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {weeklyServices.map((day, index) => (
                <div
                  key={day.day}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100"
                >
                  <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">
                    {day.day}
                  </h3>
                  <div className="space-y-4">
                    {day.services.map((service, serviceIndex) => (
                      <div
                        key={serviceIndex}
                        className="bg-white rounded-xl p-4 shadow-md border-l-4 border-yellow-400"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-lg font-bold text-gray-900">
                            {service.name}
                          </span>
                          <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-semibold">
                            {service.type}
                          </span>
                        </div>
                        <p className="text-gray-600 font-semibold">
                          {service.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section
        ref={conferenceRef}
        className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-10 animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="mb-6">Major Events & Conferences</H2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Transformative gatherings designed for spiritual growth and
                divine encounters
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {featuredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 hover:border-opacity-40 transition-all duration-500 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-black mb-4">
                        {event.type.toUpperCase()}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-300">
                      <span className="font-semibold w-20">Date:</span>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="font-semibold w-20">Time:</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="font-semibold w-20">Location:</span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <button
                    onClick={() => openModal(event)}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-4 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Register for Event
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Special Events Section */}
      <section ref={eventsRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="mb-6">All Special Events & Celebrations</H2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Mark your calendar for these meaningful celebrations and
                gatherings throughout the year
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="event-card bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden group cursor-pointer"
                  onClick={() => openModal(event)}
                >
                  {/* Event Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <span className="text-white text-2xl font-bold text-center px-4 relative z-10 group-hover:scale-110 transition-transform duration-500">
                      {event.title}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {event.type}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="font-semibold w-12">Date:</span>
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="font-semibold w-12">Time:</span>
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {event.description}
                    </p>

                    <button className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-black transition-colors duration-300 group-hover:bg-yellow-400 group-hover:text-gray-900">
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Annual Traditions Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-8">Annual Traditions</H2>
            <p className="text-xl text-gray-600 mb-12">
              These are some of our beloved annual events that bring our church
              family together
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Vacation Bible School',
                  period: 'Every Summer',
                  description:
                    'A week of fun, faith, and friendship for children ages 4-12',
                  icon: '🎨',
                },
                {
                  title: 'Church Picnic',
                  period: 'Every June',
                  description:
                    'Food, games, and fellowship at our annual outdoor picnic',
                  icon: '🌭',
                },
                {
                  title: 'Harvest Festival',
                  period: 'Every October',
                  description:
                    'Family-friendly fall festival with games and treats',
                  icon: '🎃',
                },
                {
                  title: "New Year's Eve Service",
                  period: 'December 31st',
                  description:
                    "Reflect on God's faithfulness and pray for the year ahead",
                  icon: '🎆',
                },
              ].map((tradition, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 text-center group hover:scale-105"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {tradition.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {tradition.title}
                  </h3>
                  <p className="text-yellow-600 font-semibold mb-3">
                    {tradition.period}
                  </p>
                  <p className="text-gray-600">{tradition.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SpecialPage;
