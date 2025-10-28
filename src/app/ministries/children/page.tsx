import HeroSection from '@/components/ui/HerosectionPage';
import { H2 } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';

const ChildrenPage = () => {
  return (
    <div>
      <HeroSection
        title="Children Ministry"
        subtitle="Nurturing Young Hearts in Faith"
        description="A safe and engaging environment where children discover God's love through fun activities, Bible stories, and age-appropriate teachings."
        backgroundImage={hero_bg_1.src}
        showButtons={true}
        primaryButtonText="Register Your Child"
        secondaryButtonText="Volunteer With Us"
        showScrollIndicator={true}
      />

      {/* Ministry Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <H2>Welcome to Our Children's Ministry!</H2>
              <p className="text-xl text-gray-600 mt-4">
                Where kids learn about Jesus in a way they can understand and
                enjoy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Our Mission
                </h3>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  To partner with parents in laying a spiritual foundation that,
                  in God's timing, will lead a child into a personal
                  relationship with Jesus Christ.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  We create engaging, age-appropriate environments where
                  children can learn biblical truths and discover how much God
                  loves them.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Service Times
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-yellow-200">
                    <span className="font-semibold text-gray-800">
                      Sunday School
                    </span>
                    <span className="text-yellow-600 font-bold">10:30 AM</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-yellow-200">
                    <span className="font-semibold text-gray-800">
                      Children's Church
                    </span>
                    <span className="text-yellow-600 font-bold">
                      9:00 AM & 11:00 AM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      Wednesday Nights
                    </span>
                    <span className="text-yellow-600 font-bold">7:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Age Groups */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <H2 className="text-center mb-12">Programs by Age Group</H2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  age: 'Ages 2-4',
                  title: 'Little Explorers',
                  description:
                    'Simple Bible stories, songs, and play-based learning in a safe, nurturing environment.',
                  activities: [
                    'Bible Stories',
                    'Worship Songs',
                    'Creative Play',
                  ],
                },
                {
                  age: 'Ages 5-7',
                  title: 'Bible Adventurers',
                  description:
                    'Interactive lessons, crafts, and games that make Bible learning fun and memorable.',
                  activities: [
                    'Interactive Lessons',
                    'Arts & Crafts',
                    'Memory Verses',
                  ],
                },
                {
                  age: 'Ages 8-12',
                  title: 'Faith Builders',
                  description:
                    'Deeper Bible study, service projects, and building friendships centered on Christ.',
                  activities: [
                    'Bible Studies',
                    'Service Projects',
                    'Group Activities',
                  ],
                },
              ].map((group, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center"
                >
                  <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">
                      {group.age.split('-')[0]}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {group.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {group.activities.map((activity, i) => (
                      <li key={i}>• {activity}</li>
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

export default ChildrenPage;
