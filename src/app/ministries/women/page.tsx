import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2 } from '@/components/text';
import { hero_bg_3 } from '@/components/assets';

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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <H2>Women of Wisdom</H2>
              <p className="text-xl text-gray-600 mt-4">
                Connecting women of all ages and stages of life
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <div
                  key={index}
                  className="bg-yellow-50 rounded-2xl p-6 text-center"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold">
                    {item.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WomenPage;
