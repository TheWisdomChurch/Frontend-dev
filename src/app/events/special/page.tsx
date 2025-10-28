import HeroSection from '@/components/ui/HerosectionPage';
import { H2 } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';

const SpecialPage = () => {
  const specialEvents = [
    {
      title: 'Easter Celebration Service',
      date: 'April 20, 2025',
      time: '8:00 AM & 10:30 AM',
      description:
        'Join us for a powerful Easter service celebrating the resurrection of Jesus Christ. Special music, message of hope, and family activities.',
      image: hero_bg_1, // Replace with actual event images
      location: 'Main Sanctuary & Outdoor Tent',
    },
    {
      title: 'Christmas Eve Candlelight Service',
      date: 'December 24, 2024',
      time: '4:00 PM, 6:00 PM & 8:00 PM',
      description:
        'A beautiful candlelight service with Christmas carols, communion, and the Christmas story. Perfect for the whole family.',
      image: hero_bg_1,
      location: 'Main Sanctuary',
    },
    {
      title: 'Thanksgiving Community Dinner',
      date: 'November 28, 2024',
      time: '12:00 PM - 3:00 PM',
      description:
        'Free community Thanksgiving dinner for all. Come enjoy a traditional meal and give thanks together as a church family.',
      image: hero_bg_1,
      location: 'Church Fellowship Hall',
    },
  ];

  return (
    <div>
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

      {/* Special Events List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <H2>Upcoming Special Events</H2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
              Mark your calendar for these meaningful celebrations and
              gatherings
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-12">
            {specialEvents.map((event, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="md:flex">
                  {/* Event Image */}
                  <div className="md:w-2/5">
                    <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Event Image</span>
                      {/* Replace with: <Image src={event.image} alt={event.title} className="w-full h-full object-cover" /> */}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="md:w-3/5 p-8">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                          {event.title}
                        </h3>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-700">
                            <span className="font-semibold w-20">Date:</span>
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <span className="font-semibold w-20">Time:</span>
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <span className="font-semibold w-20">
                              Location:
                            </span>
                            <span>{event.location}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                          Add to Calendar
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Events Section */}
      <section className="py-16 bg-gray-50">
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
                },
                {
                  title: 'Church Picnic',
                  period: 'Every June',
                  description:
                    'Food, games, and fellowship at our annual outdoor picnic',
                },
                {
                  title: 'Harvest Festival',
                  period: 'Every October',
                  description:
                    'Family-friendly fall festival with games and treats',
                },
                {
                  title: "New Year's Eve Service",
                  period: 'December 31st',
                  description:
                    "Reflect on God's faithfulness and pray for the year ahead",
                },
              ].map((tradition, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md text-center"
                >
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
    </div>
  );
};

export default SpecialPage;
