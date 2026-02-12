import HeroSection from '@/components/ui/Homepage/Herosection';
import { BodyMD, BodySM, H2, H3 } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';
import { PageSection } from '@/components/layout';

const OutreachPage = () => {
  return (
    <div>
      <HeroSection
        title="Outreach Ministry"
        subtitle="Serving Our Community, Sharing God's Love"
        description="Extending the love of Christ beyond our walls through practical service, community partnerships, and mission opportunities."
        backgroundImage={hero_bg_2.src}
        showButtons={true}
        primaryButtonText="Volunteer Opportunities"
        secondaryButtonText="Upcoming Projects"
        showScrollIndicator={true}
      />

      {/* Outreach Details */}
      <PageSection tone="surface" padding="xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <H2>Making a Difference Together</H2>
            <BodyMD className="text-muted mt-3">
              Local and global opportunities to serve and share the Gospel
            </BodyMD>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Local Outreach',
                projects: [
                  'Monthly Food Distribution',
                  'Homeless Shelter Meals',
                  'School Supply Drives',
                  'Community Clean-up Days',
                ],
              },
              {
                title: 'Global Missions',
                projects: [
                  'Annual Mission Trips',
                  'International Orphan Support',
                  'Clean Water Projects',
                  'Bible Distribution',
                ],
              },
            ].map((category, index) => (
              <div key={index} className="page-card-muted p-5">
                <H3 className="text-center mb-4">{category.title}</H3>
                <ul className="space-y-3">
                  {category.projects.map((project, i) => (
                    <li key={i} className="flex items-center">
                      <div
                        className="w-2.5 h-2.5 rounded-full mr-3"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      ></div>
                      <BodySM className="text-muted">{project}</BodySM>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default OutreachPage;
