import HeroSection from '@/components/ui/HerosectionPage';
import { H2 } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';

const YouthPage = () => {
  return (
    <div>
      <HeroSection
        title="Youth Ministry"
        subtitle="Empowering the Next Generation"
        description="A dynamic space where teenagers can explore faith, build authentic relationships, and discover their purpose in Christ."
        backgroundImage={hero_bg_2.src}
        showButtons={true}
        primaryButtonText="Join Youth Group"
        secondaryButtonText="Upcoming Events"
        showScrollIndicator={true}
      />

      {/* Youth Ministry Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <H2>Ignite Youth Group</H2>
              <p className="text-xl text-gray-600 mt-4">
                For students in 6th through 12th grade
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  What We're About
                </h3>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Our youth ministry creates a space where teenagers can be
                  themselves, ask tough questions, and grow in their
                  relationship with God. We're committed to helping students
                  navigate the challenges of adolescence with biblical wisdom
                  and supportive community.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-gray-800">
                      Relevant biblical teaching
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-gray-800">
                      Authentic relationships
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-gray-800">
                      Fun events and activities
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 text-white rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Weekly Schedule</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                    <span>Wednesday Nights</span>
                    <span className="text-yellow-400 font-bold">7:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                    <span>Sunday School</span>
                    <span className="text-yellow-400 font-bold">10:30 AM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Events</span>
                    <span className="text-yellow-400 font-bold">
                      Various Times
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YouthPage;
