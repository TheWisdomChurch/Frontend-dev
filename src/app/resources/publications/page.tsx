import HeroSection from '@/components/ui/Homepage/Herosection';
import {
  H2,
  BaseText,
  LightText,
  BodyMD,
  SemiBoldText,
} from '@/components/text';
import { hero_bg_3 } from '@/components/assets';

const PublicationPage = () => {
  const publications = [
    {
      title: 'Monthly Church Newsletter',
      description:
        'Stay updated with church events, testimonies, and important announcements.',
      frequency: 'Monthly',
      format: 'Digital & Print',
      action: 'Subscribe Now',
    },
    {
      title: 'Daily Devotional Guide',
      description:
        "Short daily readings to start your day with God's Word and reflection.",
      frequency: 'Daily',
      format: 'Email & App',
      action: 'Get Daily Devotionals',
    },
    {
      title: 'Bible Study Workbooks',
      description:
        'In-depth study guides for small groups and personal Bible study.',
      frequency: 'Quarterly',
      format: 'PDF & Print',
      action: 'View Studies',
    },
    {
      title: 'Annual Church Report',
      description:
        'Comprehensive review of ministry impact, finances, and future vision.',
      frequency: 'Annual',
      format: 'Digital PDF',
      action: 'Download Report',
    },
    {
      title: 'Prayer Guide',
      description:
        'Weekly prayer focuses and resources for personal and corporate prayer.',
      frequency: 'Weekly',
      format: 'Email',
      action: 'Receive Guide',
    },
    {
      title: "Children's Ministry Resources",
      description:
        'Activity sheets, parent guides, and teaching materials for families.',
      frequency: 'Monthly',
      format: 'Digital Download',
      action: 'Access Resources',
    },
  ];

  return (
    <div>
      <HeroSection
        title="Publications"
        subtitle="Resources for Spiritual Growth"
        description="Access our collection of digital and print resources designed to support your faith journey, from daily devotionals to in-depth study materials."
        backgroundImage={hero_bg_3.src}
        showButtons={true}
        primaryButtonText="Browse Resources"
        secondaryButtonText="Request Print Copies"
        showScrollIndicator={true}
      />

      {/* Publications Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <H2>Available Resources</H2>
            <BodyMD className="text-xl text-gray-600 mt-4">
              Free resources to support your spiritual growth
            </BodyMD>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publications.map((pub, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="mb-4">
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {pub.frequency}
                    </span>
                  </div>

                  <BaseText
                    fontFamily="bricolage"
                    weight="bold"
                    className="text-xl text-gray-900 mb-3"
                  >
                    {pub.title}
                  </BaseText>

                  <LightText className="text-gray-600 mb-4 leading-relaxed">
                    {pub.description}
                  </LightText>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <SemiBoldText className="text-gray-500">
                        Format:
                      </SemiBoldText>
                      <BodyMD className="ml-2 text-gray-500">
                        {pub.format}
                      </BodyMD>
                    </div>

                    <button className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                      <SemiBoldText>{pub.action}</SemiBoldText>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Free Downloads Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-8">Free Downloadable Resources</H2>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-left">
                  <BaseText
                    fontFamily="bricolage"
                    weight="bold"
                    className="text-2xl text-gray-900 mb-4"
                  >
                    Get Started Today
                  </BaseText>
                  <BodyMD className="text-gray-700 mb-6">
                    All our publications are available free of charge. Download
                    instantly or request printed copies for yourself or your
                    small group.
                  </BodyMD>
                  <ul className="space-y-2 text-gray-600">
                    <li>✓ No cost, no registration required</li>
                    <li>✓ Available in multiple formats</li>
                    <li>✓ Perfect for personal or group use</li>
                    <li>✓ New resources added regularly</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6">
                  <BaseText
                    fontFamily="bricolage"
                    weight="bold"
                    className="text-lg text-gray-900 mb-4"
                  >
                    Most Popular Downloads
                  </BaseText>
                  <div className="space-y-3">
                    {[
                      '30-Day Prayer Challenge',
                      'Bible Reading Plan 2024',
                      'Small Group Leader Guide',
                      'Family Devotional Kit',
                    ].map((item, index) => (
                      <button
                        key={index}
                        className="w-full text-left bg-white p-3 rounded-lg hover:bg-yellow-100 transition-colors"
                      >
                        <SemiBoldText className="text-gray-800">
                          {item}
                        </SemiBoldText>
                      </button>
                    ))}
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

export default PublicationPage;
