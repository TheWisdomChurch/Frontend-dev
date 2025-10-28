import HeroSection from '@/components/ui/HerosectionPage';
import { H2 } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';

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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <H2>Making a Difference Together</H2>
              <p className="text-xl text-gray-600 mt-4">
                Local and global opportunities to serve and share the Gospel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <div key={index} className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.projects.map((project, i) => (
                      <li key={i} className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                        <span className="text-gray-800">{project}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OutreachPage;
