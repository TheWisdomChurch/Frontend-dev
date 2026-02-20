import HeroSection from '@/components/ui/Homepage/Herosection';
import { BodyMD, BodySM, H2, H3 } from '@/components/text';
import { hero_bg_3 } from '@/components/assets';
import { PageSection } from '@/components/layout';

const WeeklyPage = () => {
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
    <div>
      <HeroSection
        title="Weekly Services"
        subtitle="Regular Gatherings for Worship & Growth"
        description="Join us throughout the week for services, studies, and fellowship opportunities designed to help you grow in your faith and connect with others."
        backgroundImage={hero_bg_3.src}
        showButtons={true}
        primaryButtonText="Plan Your Visit"
        secondaryButtonText="Watch Online"
        showScrollIndicator={true}
      />

      {/* Weekly Schedule */}
      <PageSection tone="surface" padding="xl">
        <div className="text-center mb-8 fade-up">
          <H2>Our Weekly Schedule</H2>
          <BodyMD className="text-muted mt-3 max-w-2xl mx-auto">
            We have multiple service times and gatherings throughout the week
            to fit your schedule
          </BodyMD>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {weeklyServices.map((daySchedule, index) => (
            <div key={index} className="page-card-muted p-5 sm:p-6 fade-up">
              <H3 className="text-center mb-4">{daySchedule.day}</H3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {daySchedule.services.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="page-card p-4 sm:p-5">
                    <div className="text-center mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium border border-muted text-muted">
                        {service.type}
                      </span>
                    </div>

                    <H3 className="text-center mb-1">{service.name}</H3>

                    <div className="text-center mb-3">
                      <BodySM className="text-accent font-medium">
                        {service.time}
                      </BodySM>
                    </div>

                    <BodySM className="text-muted text-center mb-3">
                      {service.description}
                    </BodySM>

                    <BodySM className="text-subtle text-center">
                      <span className="font-medium">Location:</span>{' '}
                      {service.location}
                    </BodySM>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* What to Expect Section */}
      <PageSection tone="muted" padding="xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 fade-up">
            <H2>What to Expect</H2>
            <BodyMD className="text-muted mt-3">
              Your first visit to Wisdom House
            </BodyMD>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: 'Welcoming Atmosphere',
                description:
                  'Friendly greeters will welcome you and help you find your way around our campus.',
              },
              {
                title: 'Casual Dress',
                description:
                  'Come as you are! Most people dress casually, so wear whatever feels comfortable.',
              },
              {
                title: 'Engaging Worship',
                description:
                  "Our services feature contemporary worship music that's both uplifting and meaningful.",
              },
              {
                title: 'Practical Teaching',
                description:
                  'Messages that connect biblical truth to everyday life in relevant, applicable ways.',
              },
              {
                title: "Safe Children's Ministry",
                description:
                  'Secure check-in and age-appropriate programs for children from infants to 5th grade.',
              },
              {
                title: 'No Pressure',
                description:
                  "We won't single you out or pressure you to give. Just come and experience God's presence.",
              },
            ].map((item, index) => (
              <div key={index} className="page-card p-5">
                <H3 className="mb-2">{item.title}</H3>
                <BodySM className="text-muted">{item.description}</BodySM>
              </div>
            ))}
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default WeeklyPage;
