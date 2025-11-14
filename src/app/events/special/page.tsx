// components/ui/SpecialPage.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import { H1, H2, H3, SmallText } from '@/components/text';
import { hero_bg_1, WisdomeHouseLogo } from '@/components/assets'; // Fixed: removed extra 'e'
import { EventRegistrationModal } from '@/components/modal/EventRegistrationModal';
import { useSpecialEvents } from '@/components/utils/hooks/useSpecial';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import { useTheme } from '@/components/contexts/ThemeContext';
import Image from 'next/image';

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

  const { colorScheme } = useTheme();
  const featuredEvents = specialEvents.filter(event => event.featured);
  const regularEvents = specialEvents.filter(event => !event.featured);

  return (
    <div className="overflow-x-hidden">
      <HeroSection
        title="Special Events"
        subtitle="Celebrating God's Faithfulness Together"
        description="Join us for these meaningful celebrations and special services throughout the year as we worship, fellowship, and grow together in Christ."
        backgroundImage={hero_bg_1.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Header Section */}
      <Section
        ref={headerRef}
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: colorScheme.text }}
      >
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
            className="text-center"
          >
            <H1
              className="text-5xl md:text-7xl font-black mb-8 leading-tight"
              style={{ color: colorScheme.black }}
            >
              Every Service at{' '}
              <span style={{ color: colorScheme.primary }}>
                The Wisdom House Church
              </span>{' '}
              is a Special Service
            </H1>
            <div
              className="w-32 h-1 mx-auto mb-8 rounded-full"
              style={{ background: colorScheme.primaryGradient }}
            ></div>
            <H3
              className="text-xl md:text-2xl leading-relaxed"
              style={{ color: colorScheme.black }}
            >
              From our weekly worship gatherings to annual celebrations, every
              moment at Wisdom House is an opportunity to encounter God's
              presence and experience transformative spiritual growth.
            </H3>
          </FlexboxLayout>
        </Container>
      </Section>

      {/* Weekly Services Section */}
      <Section
        ref={servicesRef}
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: colorScheme.background }}
      >
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
          >
            <div className="text-center mb-16">
              <H2 className="mb-6" style={{ color: colorScheme.heading }}>
                Weekly Services Schedule
              </H2>
              <p
                className="text-xl max-w-2xl mx-auto"
                style={{ color: colorScheme.textSecondary }}
              >
                Join us throughout the week for powerful times of worship,
                teaching, and fellowship
              </p>
            </div>

            <GridboxLayout
              columns={1}
              gap="lg"
              responsive={{
                sm: 1,
                md: 3,
                lg: 3,
              }}
              className="max-w-6xl mx-auto"
            >
              {weeklyServices.map((day, index) => (
                <div
                  key={day.day}
                  className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border"
                  style={{
                    backgroundColor: colorScheme.card,
                    borderColor: colorScheme.border,
                  }}
                >
                  <h3
                    className="text-2xl font-black mb-6 text-center"
                    style={{ color: colorScheme.heading }}
                  >
                    {day.day}
                  </h3>
                  <div className="space-y-4">
                    {day.services.map((service, serviceIndex) => (
                      <div
                        key={serviceIndex}
                        className="rounded-xl p-4 shadow-md border-l-4"
                        style={{
                          backgroundColor: colorScheme.surface,
                          borderColor: colorScheme.primary,
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span
                            className="text-lg font-bold"
                            style={{ color: colorScheme.text }}
                          >
                            {service.name}
                          </span>
                          <span
                            className="inline-block px-2 py-1 rounded text-sm font-semibold"
                            style={{
                              backgroundColor: colorScheme.opacity.primary10,
                              color: colorScheme.primaryDark,
                            }}
                          >
                            {service.type}
                          </span>
                        </div>
                        <p
                          className="font-semibold"
                          style={{ color: colorScheme.textSecondary }}
                        >
                          {service.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </GridboxLayout>
          </FlexboxLayout>
        </Container>
      </Section>

      {/* Featured Events Section */}
      <Section
        ref={conferenceRef}
        padding="lg"
        fullHeight={false}
        style={{
          background: `linear-gradient(135deg, ${colorScheme.gray[800]} 0%, ${colorScheme.gray[900]} 50%, ${colorScheme.black} 100%)`,
        }}
        className="relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 animate-pulse"
            style={{ backgroundColor: colorScheme.primary }}
          ></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 animate-pulse"
            style={{
              backgroundColor: colorScheme.primaryLight,
              animationDelay: '1s',
            }}
          ></div>
        </div>

        <Container size="xl" className="relative z-10">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
          >
            <div className="text-center mb-16">
              <H2 className="mb-6" style={{ color: colorScheme.text }}>
                Major Events & Conferences
              </H2>
              <p
                className="text-xl max-w-2xl mx-auto"
                style={{ color: colorScheme.textSecondary }}
              >
                Transformative gatherings designed for spiritual growth and
                divine encounters
              </p>
            </div>

            <GridboxLayout
              columns={1}
              gap="lg"
              responsive={{
                sm: 1,
                md: 1,
                lg: 2,
              }}
              className="max-w-6xl mx-auto"
            >
              {featuredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="rounded-3xl p-8 border border-opacity-20 hover:border-opacity-40 transition-all duration-500 hover:scale-105 backdrop-blur-lg"
                  style={{
                    backgroundColor: colorScheme.opacity.white10,
                    borderColor: colorScheme.white,
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span
                        className="inline-block px-4 py-2 rounded-full text-sm font-black mb-4"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.onPrimary,
                        }}
                      >
                        {event.type.toUpperCase()}
                      </span>
                      <h3
                        className="text-2xl md:text-3xl font-black mb-4"
                        style={{ color: colorScheme.text }}
                      >
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div
                      className="flex items-center"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      <span className="font-semibold w-20">Date:</span>
                      <span>{event.date}</span>
                    </div>
                    <div
                      className="flex items-center"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      <span className="font-semibold w-20">Time:</span>
                      <span>{event.time}</span>
                    </div>
                    <div
                      className="flex items-center"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      <span className="font-semibold w-20">Location:</span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p
                    className="mb-6 leading-relaxed"
                    style={{ color: colorScheme.textSecondary }}
                  >
                    {event.description}
                  </p>

                  <button
                    onClick={() => openModal(event)}
                    className="w-full py-4 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                    style={{
                      background: colorScheme.primaryGradient,
                      color: colorScheme.onPrimary,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor =
                        colorScheme.buttonHover;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background =
                        colorScheme.primaryGradient;
                    }}
                  >
                    Register for Event
                  </button>
                </div>
              ))}
            </GridboxLayout>
          </FlexboxLayout>
        </Container>
      </Section>

      {/* All Special Events Section */}
      <Section
        ref={eventsRef}
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: colorScheme.backgroundSecondary }}
      >
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
          >
            <div className="text-center mb-16">
              <H2 className="mb-6" style={{ color: colorScheme.heading }}>
                All Special Events & Celebrations
              </H2>
              <p
                className="text-xl max-w-2xl mx-auto"
                style={{ color: colorScheme.textSecondary }}
              >
                Mark your calendar for these meaningful celebrations and
                gatherings throughout the year
              </p>
            </div>

            <GridboxLayout
              columns={1}
              gap="lg"
              responsive={{
                sm: 1,
                md: 2,
                lg: 3,
              }}
              className="max-w-6xl mx-auto"
            >
              {regularEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="event-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden group cursor-pointer"
                  onClick={() => openModal(event)}
                  style={{ backgroundColor: colorScheme.card }}
                >
                  {/* Event Image Placeholder */}
                  <div
                    className="h-48 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: colorScheme.primaryGradient,
                    }}
                  >
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                      <Image
                        src={WisdomeHouseLogo} // Fixed: using correct variable name
                        alt={event.title}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: colorScheme.surfaceVariant,
                          color: colorScheme.textSecondary,
                        }}
                      >
                        {event.type}
                      </span>
                    </div>

                    <h3
                      className="text-xl font-black mb-3 group-hover:transition-colors duration-300"
                      style={{
                        color: colorScheme.heading,
                      }}
                    >
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div
                        className="flex items-center text-sm"
                        style={{ color: colorScheme.textSecondary }}
                      >
                        <span className="font-semibold w-12">Date:</span>
                        <span>{event.date}</span>
                      </div>
                      <div
                        className="flex items-center text-sm"
                        style={{ color: colorScheme.textSecondary }}
                      >
                        <span className="font-semibold w-12">Time:</span>
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <p
                      className="text-sm leading-relaxed line-clamp-2"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      {event.description}
                    </p>

                    <button
                      className="w-full mt-4 py-3 rounded-xl font-semibold transition-colors duration-300 group-hover:transition-colors"
                      style={{
                        backgroundColor: colorScheme.button,
                        color: colorScheme.buttonText,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor =
                          colorScheme.buttonHover;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor =
                          colorScheme.button;
                      }}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </GridboxLayout>
          </FlexboxLayout>
        </Container>
      </Section>

      {/* Annual Traditions Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: colorScheme.text }}
      >
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
            className="text-center"
          >
            <H2 className="mb-1" style={{ color: colorScheme.black }}>
              Annual Traditions
            </H2>
            <SmallText
              className="text-xl mb-4"
              style={{ color: colorScheme.primaryDark }}
            >
              These are some of our beloved annual events that bring our church
              family together
            </SmallText>

            <GridboxLayout
              columns={1}
              gap="lg"
              responsive={{
                sm: 1,
                md: 2,
                lg: 2,
              }}
              className="max-w-4xl mx-auto"
            >
              {[
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
                  description: '',
                },
                {
                  title: "New Year's Crossover Service",
                  period: 'December 31st',
                },
              ].map((tradition, index) => (
                <div
                  key={index}
                  className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border group hover:scale-105 text-center"
                  style={{
                    backgroundColor: colorScheme.card,
                    borderColor: colorScheme.border,
                  }}
                >
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={WisdomeHouseLogo} // Fixed: using correct variable name
                      alt={tradition.title}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: colorScheme.heading }}
                  >
                    {tradition.title}
                  </h3>
                  <p
                    className="font-semibold mb-3"
                    style={{ color: colorScheme.primary }}
                  >
                    {tradition.period}
                  </p>
                  <p style={{ color: colorScheme.textSecondary }}>
                    {tradition.description}
                  </p>
                </div>
              ))}
            </GridboxLayout>
          </FlexboxLayout>
        </Container>
      </Section>

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
