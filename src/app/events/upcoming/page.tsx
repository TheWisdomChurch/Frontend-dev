import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2 } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';

const Upcoming = () => {
  const upcomingEvents = [
    {
      title: "Men's Breakfast & Bible Study",
      date: 'November 15, 2024',
      time: '8:00 AM - 9:30 AM',
      type: "Men's Ministry",
      location: 'Fellowship Hall',
    },
    {
      title: "Women's Prayer Circle",
      date: 'November 16, 2024',
      time: '10:00 AM - 11:30 AM',
      type: "Women's Ministry",
      location: 'Prayer Room',
    },
    {
      title: 'Youth Group Game Night',
      date: 'November 17, 2024',
      time: '6:00 PM - 8:30 PM',
      type: 'Youth Ministry',
      location: 'Youth Center',
    },
    {
      title: 'Financial Peace University',
      date: 'November 18, 2024',
      time: '7:00 PM - 8:30 PM',
      type: 'Adult Education',
      location: 'Room 201',
    },
    {
      title: 'Community Outreach: Food Drive',
      date: 'November 20, 2024',
      time: '9:00 AM - 12:00 PM',
      type: 'Outreach',
      location: 'Church Parking Lot',
    },
    {
      title: 'Worship Team Practice',
      date: 'November 21, 2024',
      time: '7:00 PM - 9:00 PM',
      type: 'Worship',
      location: 'Main Sanctuary',
    },
  ];

  return (
    <div>
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

      {/* Upcoming Events Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <H2>This Week's Events</H2>
            <p className="text-xl text-gray-600 mt-4">
              Join us for these upcoming gatherings and activities
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-yellow-400"
                >
                  <div className="mb-4">
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {event.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {event.title}
                  </h3>

                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <span className="font-semibold w-16">Date:</span>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold w-16">Time:</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold w-16">Where:</span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                    Add to Calendar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Calendar Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-8">Monthly Calendar</H2>
            <p className="text-xl text-gray-600 mb-12">
              Get a bird's-eye view of what's happening this month
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-7 gap-4 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div
                    key={day}
                    className="text-center font-semibold text-gray-900 py-2"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days would go here */}
                <div className="text-center py-8 text-gray-400">
                  Calendar Grid Placeholder
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                  View Full Calendar
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Print Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Upcoming;
