import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2 } from '@/components/text';
import { hero_bg_3 } from '@/components/assets';

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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <H2>Our Weekly Schedule</H2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
              We have multiple service times and gatherings throughout the week
              to fit your schedule
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {weeklyServices.map((daySchedule, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                  {daySchedule.day}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {daySchedule.services.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
                    >
                      <div className="text-center mb-4">
                        <span className="inline-block bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                          {service.type}
                        </span>
                      </div>

                      <h4 className="text-xl font-bold text-gray-900 mb-2 text-center">
                        {service.name}
                      </h4>

                      <div className="text-center mb-4">
                        <span className="text-2xl font-bold text-yellow-600">
                          {service.time}
                        </span>
                      </div>

                      <p className="text-gray-600 text-center mb-4">
                        {service.description}
                      </p>

                      <div className="text-center text-sm text-gray-500">
                        <span className="font-semibold">Location:</span>{' '}
                        {service.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <H2>What to Expect</H2>
              <p className="text-xl text-gray-600 mt-4">
                Your first visit to Wisdom House
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeeklyPage;
