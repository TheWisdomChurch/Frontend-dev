import HeroSection from '@/components/ui/Homepage/Herosection';
import { BodyMD, BodySM, H2, H3 } from '@/components/text';
import { hero_bg_3 } from '@/components/assets';
import { PageSection } from '@/components/layout';

const WomenPage = () => {
  return (
    <div>
      <HeroSection
        title="Women's Ministry"
        subtitle="Growing Together in Grace"
        description="A community of women supporting each other through Bible study, prayer, and fellowship as we journey together in faith."
        backgroundImage={hero_bg_3.src}
        showButtons={true}
        primaryButtonText="Join Our Next Study"
        secondaryButtonText="View Events"
        showScrollIndicator={true}
      />

      {/* Women's Ministry Details */}
      <PageSection tone="surface" padding="xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <H2>Women of Wisdom</H2>
            <BodyMD className="text-muted mt-3">
              Connecting women of all ages and stages of life
            </BodyMD>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Bible Studies',
                description:
                  "Weekly small group studies exploring God's Word together",
                day: 'Tuesdays 10:00 AM & 7:00 PM',
              },
              {
                title: 'Prayer Groups',
                description:
                  'Intimate gatherings for prayer and spiritual support',
                day: 'Thursdays 9:30 AM',
              },
              {
                title: 'Special Events',
                description:
                  'Retreats, conferences, and fellowship opportunities',
                day: 'Monthly Gatherings',
              },
            ].map((item, index) => (
              <div key={index} className="page-card p-5 text-center">
                <H3 className="mb-2">{item.title}</H3>
                <BodySM className="text-muted mb-3">{item.description}</BodySM>
                <BodySM className="text-accent font-medium">
                  {item.day}
                </BodySM>
              </div>
            ))}
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default WomenPage;
