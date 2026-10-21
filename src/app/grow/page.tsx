import type { Metadata } from 'next';
import SiteHero from '@/features/hero/SiteHero';
import { GrowthPortal } from '@/features/grow/GrowthPortal';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';
import JsonLd from '@/shared/seo/JsonLd';
import { Page } from '@/shared/ui/layout';

export const metadata: Metadata = buildPageMetadata({
  title: 'Training Portal & Spiritual Growth Classes',
  description:
    'Discover spiritual growth pathways at The Wisdom Church: New Convert Class, Believers Equipping Class, and Membership & Foundational Class.',
  path: '/grow',
  keywords: [
    'Wisdom Church training portal',
    'discipleship classes Lagos',
    'new convert class',
    'believers equipping class',
    'church membership class',
    'spiritual growth track',
  ],
});

export default function GrowPage() {
  return (
    <Page>
      {/* ── SEO Structured Data ──────────────────────────────── */}
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Growth Portal', path: '/grow' },
        ])}
      />

      {/* ── 1. Hero Section ──────────────────────────────────── */}
      <SiteHero
        backgroundImage="/Picflow/DSC00058-copy.webp"
        imagePositionClassName="object-center"
        eyebrow="Training & Discipleship Portal"
        title="Forming Believers for Greatness and Impact."
        subtitle="A clear, progressive discipleship framework designed to ground you in sound doctrine, nurture spiritual authority, and integrate you into a purposeful covenant family."
      />

      {/* ── 2. Diagonal 2-Column Discipleship Classes ─────────── */}
      <GrowthPortal />
    </Page>
  );
}
