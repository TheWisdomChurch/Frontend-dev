import type { Metadata } from 'next';

import MinistryPageTemplate from '@/features/ministries/MinistryPageTemplate';
import { CHILDREN_MINISTRY_CONTENT as content } from '@/content/childrenMinistry';
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildMinistrySchema,
} from '@/lib/seo';
import JsonLd from '@/shared/seo/JsonLd';
import { Container, Section, SectionHeader } from '@/shared/ui/layout';
import RegisterChildCta from '@/features/ministries/RegisterChildCta';
import ChildrenGallery from './ChildrenGallery';

const PATH = '/ministries/children';
const DESCRIPTION =
  "The Wisdom Church Children's Ministry in Lagos — a safe, joyful, Bible-centered ministry for children from nursery to pre-teen, partnering with families to raise Godly, wise, and excellent leaders for Christ.";

export const metadata: Metadata = buildPageMetadata({
  title: "Children's Ministry",
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "children's ministry Lagos",
    "children's church Lagos",
    'Sunday school Lagos',
    'kids church Nigeria',
    'Christian children ministry',
    'The Wisdom Church children',
    'childrens ministry Lekki',
    'nursery and kids church',
  ],
});

const ministrySchema = buildMinistrySchema({
  name: "Children's Ministry",
  description: DESCRIPTION,
  path: PATH,
  image: '/Picflow/children-hero.webp',
  leader: {
    name: 'Mrs Mojisola Oladejo',
    role: "Children's Ministry Director",
    image: content.leader?.image.src,
  },
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Ministries', path: '/ministries' },
  { name: "Children's Ministry", path: PATH },
]);

const extraSections = (
  <>
    <Section tone="dark" id="register-child" className="scroll-mt-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_auto] lg:items-end lg:gap-16">
          <SectionHeader
            eyebrow="New here?"
            title="Register your child in a"
            accent="few minutes."
            description="Tell us a little about your child — name, age, who may collect them, and any medical needs — so our trained team can care for them from their very first Sunday."
            tone="dark"
            size="sm"
          />
          <div className="lg:shrink-0">
            <RegisterChildCta label="Register your child" />
          </div>
        </div>
      </Container>
    </Section>

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
  </>
);

export default function ChildrenMinistryPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={ministrySchema} />
      <MinistryPageTemplate
        content={content}
        extra={extraSections}
        heroActions={<RegisterChildCta label="Register your child" />}
      />
    </>
  );
}
