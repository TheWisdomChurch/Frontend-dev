import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2 } from '@/components/text';
import { hero_bg_3 } from '@/components/assets'; // Import your background image
import { missionStatement } from '@/lib/data'; // Import your mission statement

const MissionPage = () => {
  return (
    <div>
      {/* Hero Section */}
      {/* <HeroSection
        
      /> */}
      <HeroSection
        title="Our Mission & Vision"
        subtitle="Purpose Driven, Spirit Led"
        description="Discover the God-given purpose that guides everything we do as a church family, from local outreach to global impact."
        backgroundImage={hero_bg_3.src}
        showButtons={true}
        primaryButtonText="Get Involved"
        secondaryButtonText="Our Ministries"
        showScrollIndicator={true}
      />

      {/* Mission Statement Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-8">Our Mission</H2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-lg mb-12">
              <p className="text-2xl md:text-3xl font-semibold text-gray-800 italic leading-relaxed">
                "{missionStatement}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <H2>Our Vision</H2>
              <p className="text-xl text-gray-600 mt-4">
                Where God is leading us in the coming years
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🙏</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Spiritual Growth
                </h3>
                <p className="text-gray-700">
                  To see every member growing in their relationship with Christ
                  through discipleship, prayer, and biblical teaching.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Community Impact
                </h3>
                <p className="text-gray-700">
                  To be a light in our community, meeting practical needs and
                  sharing the hope of the Gospel through service and outreach.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Global Reach
                </h3>
                <p className="text-gray-700">
                  To support missions and spread God's love worldwide, making
                  disciples of all nations as Jesus commanded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <H2>Our Core Values</H2>
              <p className="text-xl text-gray-600 mt-4">
                The principles that guide our decisions and actions
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: 'Biblical Authority',
                  description:
                    'We submit to the absolute authority of Scripture in all matters of faith and practice.',
                },
                {
                  title: 'Prayer & Dependence',
                  description:
                    'We rely on God through fervent prayer, recognizing our need for His guidance and power.',
                },
                {
                  title: 'Authentic Community',
                  description:
                    'We pursue genuine relationships where we can grow, serve, and care for one another.',
                },
                {
                  title: 'Generous Service',
                  description:
                    'We serve others with the love of Christ, both within our church and in our community.',
                },
                {
                  title: 'Spiritual Growth',
                  description:
                    'We are committed to helping every believer mature in their faith and Christlikeness.',
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-700">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-yellow-400">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="text-gray-900 mb-6">Join Us in Our Mission</H2>
            <p className="text-xl text-gray-800 mb-8">
              Ready to be part of what God is doing at The Wisdom House?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Plan Your Visit
              </button>
              <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MissionPage;
