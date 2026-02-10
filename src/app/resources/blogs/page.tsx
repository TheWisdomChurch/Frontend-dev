import HeroSection from '@/components/ui/Homepage/Herosection';
import { BodyMD, BodySM, H2, H3 } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';
import { PageSection } from '@/components/layout';

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
      <PageSection tone="surface" padding="xl">
        <div className="text-center mb-8">
          <H2>Recent Articles</H2>
          <BodyMD className="text-muted mt-3">
            Fresh content to encourage and equip you
          </BodyMD>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <article key={index} className="page-card overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-yellow-400/70 to-yellow-600/70 flex items-end p-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium border border-muted text-muted bg-white/70">
                    {post.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center text-[11px] text-subtle mb-3">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <H3 className="mb-2">{post.title}</H3>

                  <BodySM className="text-muted mb-4">
                    {post.excerpt}
                  </BodySM>

                  <div className="flex items-center justify-between">
                    <BodySM className="text-subtle">By {post.author}</BodySM>
                    <button className="text-accent font-medium">
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Categories Section */}
      <PageSection tone="muted" padding="xl">
        <div className="max-w-4xl mx-auto text-center">
          <H2 className="mb-6">Browse by Category</H2>

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
              <button key={index} className="page-card p-4">
                <BodySM className="font-medium text-muted">
                  {category}
                </BodySM>
              </button>
            ))}
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default BlogPage;
