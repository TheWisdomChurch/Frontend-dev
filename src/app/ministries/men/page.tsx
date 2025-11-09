import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2 } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';

const MenPage = () => {
  return (
    <div>
      <HeroSection
        title="Men's Ministry"
        subtitle="Building Godly Men"
        description="Equipping men to lead with integrity, serve with purpose, and grow in their faith through fellowship and biblical teaching."
        backgroundImage={hero_bg_1.src}
        showButtons={true}
        primaryButtonText="Join Men's Group"
        secondaryButtonText="Upcoming Events"
        showScrollIndicator={true}
      />

      {/* Men's Ministry Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <H2>Iron Sharpens Iron</H2>
              <p className="text-xl text-gray-600 mt-4">
                As iron sharpens iron, so one man sharpens another. - Proverbs
                27:17
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Weekly Gatherings
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Saturday Morning Breakfast
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Fellowship and Bible study over breakfast
                    </p>
                    <div className="text-yellow-600 font-semibold">
                      Saturdays 8:00 AM
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Monday Night Study
                    </h4>
                    <p className="text-gray-600 mb-3">
                      In-depth Bible study and discussion
                    </p>
                    <div className="text-yellow-600 font-semibold">
                      Mondays 7:00 PM
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Annual Events
                </h3>
                <div className="space-y-4">
                  {[
                    "Men's Retreat - Spring",
                    'Father-Son Campout - Summer',
                    'Service Projects - Quarterly',
                    'Sports Events - Monthly',
                  ].map((event, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                      <span className="text-gray-800">{event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenPage;
