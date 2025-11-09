import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2 } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';

const BlogPage = () => {
  const blogPosts = [
    {
      title: 'Finding Peace in Uncertain Times',
      excerpt:
        'Discover biblical principles for maintaining peace and trust in God when life feels uncertain and overwhelming.',
      author: 'Pastor John Doe',
      date: 'November 15, 2024',
      category: 'Spiritual Growth',
      readTime: '5 min read',
    },
    {
      title: 'The Power of Daily Prayer',
      excerpt:
        'How establishing a consistent prayer life can transform your relationship with God and impact your daily walk.',
      author: 'Jane Smith',
      date: 'November 10, 2024',
      category: 'Prayer',
      readTime: '4 min read',
    },
    {
      title: 'Building Healthy Relationships',
      excerpt:
        'Biblical wisdom for cultivating strong, God-honoring relationships in family, friendship, and community.',
      author: 'Michael Brown',
      date: 'November 5, 2024',
      category: 'Relationships',
      readTime: '6 min read',
    },
    {
      title: "Understanding God's Will",
      excerpt:
        "Practical steps for discerning and following God's will in major life decisions and everyday choices.",
      author: 'Pastor John Doe',
      date: 'October 28, 2024',
      category: 'Faith',
      readTime: '7 min read',
    },
    {
      title: 'The Joy of Serving Others',
      excerpt:
        'How serving in ministry not only blesses others but also brings fulfillment and spiritual growth to the servant.',
      author: 'Emily White',
      date: 'October 22, 2024',
      category: 'Service',
      readTime: '4 min read',
    },
    {
      title: 'Overcoming Fear with Faith',
      excerpt:
        "Biblical strategies for replacing fear with faith and trusting God's promises in challenging circumstances.",
      author: 'Pastor John Doe',
      date: 'October 15, 2024',
      category: 'Faith',
      readTime: '5 min read',
    },
  ];

  return (
    <div>
      <HeroSection
        title="Blog"
        subtitle="Insights for Your Spiritual Journey"
        description="Practical wisdom, biblical insights, and encouraging stories to help you grow in your faith and navigate life's challenges."
        backgroundImage={hero_bg_2.src}
        showButtons={true}
        primaryButtonText="Latest Posts"
        secondaryButtonText="Subscribe to Updates"
        showScrollIndicator={true}
      />

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <H2>Recent Articles</H2>
            <p className="text-xl text-gray-600 mt-4">
              Fresh content to encourage and equip you
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <article
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Featured Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-end p-4">
                    <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        By {post.author}
                      </span>
                      <button className="text-yellow-600 font-semibold hover:text-yellow-700 transition-colors">
                        Read More →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-8">Browse by Category</H2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'Spiritual Growth',
                'Prayer',
                'Relationships',
                'Family',
                'Leadership',
                'Service',
                'Faith',
                'Bible Study',
              ].map((category, index) => (
                <button
                  key={index}
                  className="bg-white py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-yellow-50"
                >
                  <span className="text-gray-800 font-semibold">
                    {category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
