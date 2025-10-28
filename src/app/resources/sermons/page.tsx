import HeroSection from '@/components/ui/HerosectionPage';
import { H2 } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';
import { sermons } from '@/lib/data';

const SermonPage = () => {
  return (
    <div>
      <HeroSection
        title="Sermons"
        subtitle="Biblical Teaching for Everyday Life"
        description="Explore our library of messages that connect God's Word to real-life situations. Grow in your faith through practical, biblical teaching."
        backgroundImage={hero_bg_1.src}
        showButtons={true}
        primaryButtonText="Watch Latest Sermon"
        secondaryButtonText="Subscribe to Podcast"
        showScrollIndicator={true}
      />

      {/* Latest Sermons */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <H2>Recent Messages</H2>
            <p className="text-xl text-gray-600 mt-4">
              Catch up on our latest sermon series
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sermons.map((sermon, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Sermon Thumbnail */}
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                      <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                        Watch Now
                      </button>
                    </div>
                  </div>

                  {/* Sermon Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {sermon.title}
                    </h3>

                    <div className="space-y-2 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <span className="font-semibold w-16">Preacher:</span>
                        <span>{sermon.preacher}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold w-16">Date:</span>
                        <span>{sermon.date}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-sm">
                        Watch Video
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
                        Listen
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sermon Series */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <H2 className="text-center mb-12">Current Series</H2>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="h-64 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl font-bold text-center">
                      Faith in Action
                      <br />
                      Series
                    </span>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Faith in Action
                  </h3>
                  <p className="text-gray-700 text-lg mb-6">
                    Explore how to put your faith into practice through this
                    6-part series on practical Christian living. Discover how to
                    live out your beliefs in everyday situations.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                      Start Series
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Download Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Listen */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-8">How to Access Sermons</H2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  platform: 'YouTube',
                  description: 'Watch full video messages with notes',
                  action: 'Subscribe to Channel',
                },
                {
                  platform: 'Podcast',
                  description: 'Listen on your favorite podcast app',
                  action: 'Subscribe on Apple Podcasts',
                },
                {
                  platform: 'Church App',
                  description: 'Access all sermons on our mobile app',
                  action: 'Download App',
                },
              ].map((option, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {option.platform}
                  </h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <button className="w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                    {option.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SermonPage;
