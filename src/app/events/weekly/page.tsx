'use client';

import HeroSection from '@/features/hero/PageHero';
import { BodyMD, BodySM, H2, H3 } from '@/shared/text';
import { hero_bg_3 } from '@/shared/assets';
import { Container, Section } from '@/shared/layout';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { CalendarClock, MapPin } from 'lucide-react';
import { cn } from '@/lib/cn';

const WeeklyPage = () => {
  const { colorScheme } = useTheme();
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

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <HeroSection
        title="Weekly Services"
        subtitle="Regular gatherings for worship, teaching, and community."
        description="Join us throughout the week for services, studies, and fellowship designed to help you grow in faith and build lasting relationships."
        backgroundImage={hero_bg_3.src}
        showButtons={true}
        primaryButtonText="Plan Your Visit"
        secondaryButtonText="Watch Online"
        showScrollIndicator={true}
      />

      {/* Weekly Schedule */}
      <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage:
              'radial-gradient(circle at 50% 30%, black 35%, transparent 90%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 30%, black 35%, transparent 90%)',
          }}
        />
        <Container size="xl" className="relative z-10 space-y-6 sm:space-y-8">
          <div className="text-center mb-4 fade-up">
            <H2>Our Weekly Schedule</H2>
            <BodyMD className="text-white/70 mt-3 max-w-2xl mx-auto">
              Multiple service times and gatherings to fit your schedule.
            </BodyMD>
          </div>

          <div className="max-w-6xl mx-auto space-y-6">
            {weeklyServices.map((daySchedule, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 fade-up"
              >
                <H3 className="text-center mb-4">{daySchedule.day}</H3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {daySchedule.services.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      className={cn(
                        'rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5',
                        'shadow-[0_12px_30px_rgba(0,0,0,0.25)]'
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70">
                          {service.type}
                        </span>
                        <span className="text-[11px] text-white/60">
                          {service.location}
                        </span>
                      </div>

                      <H3 className="mb-1 text-base sm:text-lg">
                        {service.name}
                      </H3>

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-white/75 mb-3">
                        <CalendarClock className="h-4 w-4 text-white/60" />
                        <span style={{ color: colorScheme.primary }}>
                          {service.time}
                        </span>
                      </div>

                      <BodySM className="text-white/65 mb-3">
                        {service.description}
                      </BodySM>

                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <MapPin className="h-4 w-4 text-white/50" />
                        <span>{service.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* What to Expect Section */}
      <Section padding="lg" className="relative overflow-hidden bg-[#080808]">
        <Container size="xl" className="space-y-6 sm:space-y-8">
          <div className="text-center fade-up">
            <H2>What to Expect</H2>
            <BodyMD className="text-white/70 mt-3">
              Your first visit to Wisdom House.
            </BodyMD>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
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
                description:
                  'Messages that connect biblical truth to everyday life.',
              },
              {
                title: "Secure Children's Ministry",
                description:
                  'Safe check‑in and age‑appropriate care for infants through 5th grade.',
              },
              {
                title: 'No Pressure',
                description:
                  'No spotlight, no pressure—just a space to encounter God.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 fade-up"
              >
                <H3 className="mb-2">{item.title}</H3>
                <BodySM className="text-white/65">{item.description}</BodySM>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default WeeklyPage;
