'use client';

import { useMemo, useState } from 'react';
import { BookOpenCheck, Library, PlayCircle, ShoppingBag } from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import {
  ActionBanner,
  FeatureGrid,
  SplitSection,
  StatStrip,
} from '@/shared/components/site/PublicPageBlocks';

const categories = [
  { id: 'all', label: 'All resources' },
  { id: 'watch', label: 'Watch & listen' },
  { id: 'read', label: 'Read & study' },
  { id: 'shop', label: 'Store' },
] as const;

const resourcePages = [
  {
    title: 'Sermons & Teachings',
    description:
      'Watch recent messages, revisit church teachings, and stay in step with what the house is emphasizing.',
    icon: PlayCircle,
    href: '/resources/sermons',
    badge: 'Video + audio',
    type: 'watch',
  },
  {
    title: 'Publications',
    description:
      'Browse devotionals, newsletters, study guides, and church resources designed for growth and reflection.',
    icon: BookOpenCheck,
    href: '/resources/publications',
    badge: 'Digital resources',
    type: 'read',
  },
  {
    title: 'Blog',
    description:
      'Read short-form articles, biblical reflections, and practical guidance for daily Christian living.',
    icon: Library,
    href: '/resources/blogs',
    badge: 'Articles',
    type: 'read',
  },
  {
    title: 'Ministry Store',
    description:
      'Access church merchandise, practical faith tools, and products connected to the ministry’s message and culture.',
    icon: ShoppingBag,
    href: '/resources/store',
    badge: 'Products',
    type: 'shop',
  },
] as const;

const stats = [
  {
    label: 'Main platform',
    value: 'YouTube sermons',
    detail:
      'The easiest place to catch up on full-length messages and service highlights.',
    icon: PlayCircle,
  },
  {
    label: 'Study support',
    value: 'Guides and publications',
    detail:
      'Resources designed to support personal devotion, group study, and family growth.',
    icon: BookOpenCheck,
  },
  {
    label: 'Content mix',
    value: 'Watch, read, revisit',
    detail:
      'The library is structured around different ways people learn and stay engaged.',
    icon: Library,
  },
  {
    label: 'Store access',
    value: 'Merchandise and tools',
    detail: 'Practical items tied to ministry, events, and church culture.',
    icon: ShoppingBag,
  },
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]['id']>('all');

  const filteredResources = useMemo(() => {
    if (activeCategory === 'all') return resourcePages;
    return resourcePages.filter(page => page.type === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Resources that help church life continue beyond the service."
        subtitle="This library brings together messages, articles, publications, and store items in one clearer resource hub."
        note="The aim is simple: make it easy for people to revisit teaching, keep learning through the week, and access the materials connected to ministry life."
        chips={['Sermons', 'Articles', 'Publications', 'Store']}
      />

      <StatStrip items={stats} />

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
                Resource pages
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Browse by the way you want to learn.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className="rounded-full border px-4 py-2 text-sm font-medium transition"
                  style={
                    activeCategory === category.id
                      ? {
                          borderColor: 'transparent',
                          color: '#050505',
                          background:
                            'linear-gradient(135deg, #d7bb75, #f0deaa)',
                        }
                      : {
                          borderColor: 'rgba(255,255,255,0.12)',
                          color: 'rgba(255,255,255,0.72)',
                          background: 'rgba(255,255,255,0.03)',
                        }
                  }
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <FeatureGrid items={filteredResources} columns={2} />
        </Container>
      </Section>

      <Section padding="lg" className="border-y border-white/10 bg-[#080808]">
        <Container size="xl">
          <SplitSection
            eyebrow="Resource strategy"
            title="A church resource hub should reduce friction, not create it."
            description="People should be able to find the latest message, revisit important teachings, and access reading material without searching through disconnected pages."
            points={[
              'Use sermons when you want to revisit the current emphasis of the house.',
              'Use publications when you need structured reading or devotional support.',
              'Use blog content for shorter reflections and practical encouragement.',
              'Use the store when you need ministry materials or event-related items.',
            ]}
            panelTitle="How this helps the church"
            panelBody="A clearer resource structure supports discipleship, keeps people connected during the week, and makes church content easier to recommend and revisit."
            panelItems={[
              'Better access to archived teaching',
              'Clearer distinction between media and reading resources',
              'A usable landing page for first-time visitors',
              'A simpler route into the store and ministry tools',
            ]}
          />
        </Container>
      </Section>

      <ActionBanner
        eyebrow="Keep growing"
        title="Choose a resource path for the week and stay engaged beyond Sunday."
        description="If you want to start somewhere practical, begin with a recent sermon or a publication that supports your current season."
        primaryHref="/resources/sermons"
        primaryLabel="Watch a sermon"
        secondaryHref="/resources/publications"
        secondaryLabel="Browse publications"
      />
    </div>
  );
}
