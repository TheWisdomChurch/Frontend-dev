import type { Metadata } from 'next';

import MinistryPageTemplate from '@/features/ministries/MinistryPageTemplate';
import { CHILDREN_MINISTRY_CONTENT as content } from '@/content/childrenMinistry';
import { buildPageMetadata } from '@/lib/seo';
import { Container, Section, SectionHeader } from '@/shared/ui/layout';
import ChildrenGallery from './ChildrenGallery';

export const metadata: Metadata = buildPageMetadata({
  title: "Children's Ministry",
  description:
    'A safe, joyful, and Bible-centered ministry for children from nursery through pre-teen years at The Wisdom Church.',
  path: '/ministries/children',
});

const gallerySection = (
  <Section tone="canvas">
    <Container>
      <SectionHeader
        eyebrow="Life in our ministry"
        title="A glimpse of what Sunday looks like for your child."
        size="sm"
      />
      <div className="pt-8 lg:pt-10">
        <ChildrenGallery />
      </div>
    </Container>
  </Section>
);

export default function ChildrenMinistryPage() {
  return <MinistryPageTemplate content={content} extra={gallerySection} />;
}
