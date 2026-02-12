import HeroSection from '@/components/ui/Homepage/Herosection';
import { BodyMD, BodySM, H2, H3 } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';
import { PageSection } from '@/components/layout';

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
      <PageSection tone="surface" padding="xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <H2>Iron Sharpens Iron</H2>
            <BodyMD className="text-muted mt-3">
              As iron sharpens iron, so one man sharpens another. - Proverbs
              27:17
            </BodyMD>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <H3 className="mb-4">Weekly Gatherings</H3>
              <div className="space-y-4">
                <div className="page-card p-5">
                  <BodySM className="font-medium mb-1">
                    Saturday Morning Breakfast
                  </BodySM>
                  <BodySM className="text-muted mb-2">
                    Fellowship and Bible study over breakfast
                  </BodySM>
                  <BodySM className="text-accent font-medium">
                    Saturdays 8:00 AM
                  </BodySM>
                </div>
                <div className="page-card p-5">
                  <BodySM className="font-medium mb-1">
                    Monday Night Study
                  </BodySM>
                  <BodySM className="text-muted mb-2">
                    In-depth Bible study and discussion
                  </BodySM>
                  <BodySM className="text-accent font-medium">
                    Mondays 7:00 PM
                  </BodySM>
                </div>
              </div>
            </div>

            <div>
              <H3 className="mb-4">Annual Events</H3>
              <div className="space-y-3">
                {[
                  "Men's Retreat - Spring",
                  'Father-Son Campout - Summer',
                  'Service Projects - Quarterly',
                  'Sports Events - Monthly',
                ].map((event, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                    <span className="text-muted">{event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default MenPage;
