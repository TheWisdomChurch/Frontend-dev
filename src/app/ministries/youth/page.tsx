import HeroSection from '@/components/ui/Homepage/Herosection';
import { BodyMD, BodySM, H2, H3 } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';
import { PageSection } from '@/components/layout';

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
      <PageSection tone="surface" padding="xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <H2>Ignite Youth Group</H2>
            <BodyMD className="text-muted mt-3">
              For students in 6th through 12th grade
            </BodyMD>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <H3 className="mb-4">What We're About</H3>
              <BodyMD className="text-muted mb-5">
                Our youth ministry creates a space where teenagers can be
                themselves, ask tough questions, and grow in their
                relationship with God. We're committed to helping students
                navigate the challenges of adolescence with biblical wisdom
                and supportive community.
              </BodyMD>
              <div className="space-y-3">
                {[
                  'Relevant biblical teaching',
                  'Authentic relationships',
                  'Fun events and activities',
                ].map(item => (
                  <div key={item} className="flex items-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full mr-3"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    ></div>
                    <BodySM className="text-muted">{item}</BodySM>
                  </div>
                ))}
              </div>
            </div>

            <div className="page-card p-6">
              <H3 className="mb-4">Weekly Schedule</H3>
              <div className="space-y-3">
                {[
                  { label: 'Wednesday Nights', time: '7:00 PM' },
                  { label: 'Sunday School', time: '10:30 AM' },
                  { label: 'Monthly Events', time: 'Various Times' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center pb-3 border-b border-muted last:border-b-0 last:pb-0"
                  >
                    <BodySM>{item.label}</BodySM>
                    <BodySM className="text-accent font-medium">{item.time}</BodySM>
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

export default YouthPage;
