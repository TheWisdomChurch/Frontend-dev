import HeroSection from '@/components/ui/HerosectionPage';
import { H2 } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';

const StoryPage = () => {
  return (
    <div>
      <HeroSection
        title="Our Story"
        subtitle="From Humble Beginnings to Growing Impact"
        description="Discover the journey of how The Wisdom House Church started and how God has faithfully guided us every step of the way."
        backgroundImage={hero_bg_1.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Story Timeline Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <H2 className="text-center mb-12">Our Journey Through the Years</H2>

            <div className="space-y-12">
              {/* Timeline Item 1 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/3 text-center md:text-right">
                  <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-lg inline-block">
                    2010
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    The Beginning
                  </h3>
                  <p className="text-gray-700 mb-4">
                    The Wisdom House Church started as a small Bible study in a
                    living room with just 12 people. We met weekly to study
                    God's Word and pray for our community.
                  </p>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/3 text-center md:text-right">
                  <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-lg inline-block">
                    2015
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    First Building
                  </h3>
                  <p className="text-gray-700 mb-4">
                    God provided our first church building, allowing us to
                    expand our ministries and reach more families in our
                    community.
                  </p>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/3 text-center md:text-right">
                  <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-lg inline-block">
                    2020
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    Digital Expansion
                  </h3>
                  <p className="text-gray-700 mb-4">
                    During the global pandemic, we launched online services,
                    reaching people across the country and around the world with
                    the Gospel.
                  </p>
                </div>
              </div>

              {/* Timeline Item 4 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/3 text-center md:text-right">
                  <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-lg inline-block">
                    Today
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    Growing Community
                  </h3>
                  <p className="text-gray-700">
                    Today, we're a thriving community of believers committed to
                    making disciples, serving our city, and spreading God's
                    wisdom to the next generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoryPage;
