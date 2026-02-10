import HeroSection from '@/components/ui/Homepage/Herosection';
import { BodyMD, BodySM, H2, H3 } from '@/components/text';
import { hero_bg_3 } from '@/components/assets';
import { PageSection } from '@/components/layout';

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
      <PageSection tone="surface" padding="xl">
        <div className="text-center mb-8">
          <H2>Available Resources</H2>
          <BodyMD className="text-muted mt-3">
            Free resources to support your spiritual growth
          </BodyMD>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub, index) => (
              <div key={index} className="page-card p-5">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium border border-muted text-muted">
                    {pub.frequency}
                  </span>
                </div>

                <H3 className="mb-2">{pub.title}</H3>

                <BodySM className="text-muted mb-4 leading-relaxed">
                  {pub.description}
                </BodySM>

                <div className="space-y-3">
                  <div className="flex items-center text-[11px] text-subtle">
                    <span className="font-medium">Format:</span>
                    <span className="ml-2">{pub.format}</span>
                  </div>

                  <button className="w-full page-card-muted py-2.5 text-[12px] font-medium">
                    {pub.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Free Downloads Section */}
      <PageSection tone="muted" padding="xl">
        <div className="max-w-4xl mx-auto text-center">
          <H2 className="mb-6">Free Downloadable Resources</H2>

          <div className="page-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <H3 className="mb-3">Get Started Today</H3>
                <BodyMD className="text-muted mb-5">
                  All our publications are available free of charge. Download
                  instantly or request printed copies for yourself or your
                  small group.
                </BodyMD>
                <ul className="space-y-2 text-muted text-sm">
                  <li>✓ No cost, no registration required</li>
                  <li>✓ Available in multiple formats</li>
                  <li>✓ Perfect for personal or group use</li>
                  <li>✓ New resources added regularly</li>
                </ul>
              </div>

              <div className="page-card-muted p-5">
                <H3 className="mb-3">Most Popular Downloads</H3>
                <div className="space-y-3">
                  {[
                    '30-Day Prayer Challenge',
                    'Bible Reading Plan 2024',
                    'Small Group Leader Guide',
                    'Family Devotional Kit',
                  ].map((item, index) => (
                    <button key={index} className="w-full text-left page-card p-3 text-sm">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default PublicationPage;
