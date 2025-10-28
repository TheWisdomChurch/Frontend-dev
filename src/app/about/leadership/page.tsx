import HeroSection from '@/components/ui/HerosectionPage';
import { H2 } from '@/components/text';
import { hero_bg_2 } from '@/components/assets'; // Import your background image

import { leaders } from '@/lib/data'; // Import your leaders data

const LeadersPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Our Leadership"
        subtitle="Guided by Servant Leaders"
        description="Meet the dedicated team of pastors and leaders who serve our church family with wisdom, compassion, and commitment to God's calling."
        backgroundImage={hero_bg_2.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Leadership Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <H2>Meet Our Pastoral Team</H2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
              God has blessed us with faithful leaders who shepherd our
              congregation with love and dedication to God's Word.
            </p>
          </div>

          {/* Leadership Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {leaders.map((leader, index) => (
              <div key={index} className="text-center group">
                {/* Leader Image */}
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-yellow-400 group-hover:border-yellow-500 transition-colors duration-300">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Leader Image</span>
                    {/* Replace with actual image: <Image src={leader.image} alt={leader.name} fill className="object-cover" /> */}
                  </div>
                </div>

                {/* Leader Info */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {leader.name}
                </h3>
                <p className="text-yellow-600 font-semibold mb-4">
                  {leader.role}
                </p>
                <p className="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt.
                </p>
              </div>
            ))}
          </div>

          {/* Additional Leadership Info */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8">
              <H2 className="text-center mb-6">Our Leadership Philosophy</H2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Servant Leadership
                  </h3>
                  <p className="text-gray-700">
                    We believe leadership is about serving others, following the
                    example of Jesus Christ who came not to be served, but to
                    serve.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Biblical Foundation
                  </h3>
                  <p className="text-gray-700">
                    Our leaders are committed to teaching and living according
                    to God's Word, providing spiritual guidance rooted in
                    Scripture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeadersPage;
