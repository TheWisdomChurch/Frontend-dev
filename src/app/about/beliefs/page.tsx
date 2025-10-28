import HeroSection from '@/components/ui/HerosectionPage';
import { H2 } from '@/components/text';
import { hero_bg_1 } from '@/components/assets'; // Import your background image

const BeliefsPage = () => {
  return (
    <div>
      {/* Hero Section with custom props */}
      <HeroSection
        title="Our Beliefs"
        subtitle="Foundational Truths We Stand On"
        description="Discover the core biblical principles that guide our faith, shape our community, and direct our mission at The Wisdom House Church."
        backgroundImage={hero_bg_1.src}
        showButtons={true}
        primaryButtonText="Learn More About Us"
        secondaryButtonText="Visit Our Church"
        showScrollIndicator={true}
      />

      {/* Page Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <H2 className="text-center mb-12">Core Doctrinal Beliefs</H2>

            <div className="prose prose-lg mx-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">The Bible</h3>
                <p className="text-gray-700">
                  We believe the Bible is the inspired, infallible, and
                  authoritative Word of God. It is our final authority in all
                  matters of faith and conduct.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">God</h3>
                <p className="text-gray-700">
                  We believe in one God, eternally existing in three persons:
                  Father, Son, and Holy Spirit - each co-equal in power and
                  glory.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Salvation</h3>
                <p className="text-gray-700">
                  We believe that salvation is a free gift of God's grace,
                  received through faith in Jesus Christ and His atoning
                  sacrifice on the cross.
                </p>
              </div>

              {/* Add more beliefs as needed */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BeliefsPage;
