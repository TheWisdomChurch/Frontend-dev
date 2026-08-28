'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Headphones,
  Newspaper,
  Radio,
  Search,
  Sparkles,
  Store,
  Video,
} from 'lucide-react';

import { Button } from '@/shared/ui/button';
import SiteHero from '@/features/hero/SiteHero';
import { H2, H3, BodyMD, Caption, SmallText } from '@/shared/text';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { resourceLinks } from '@/lib/data';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { BaseModal } from '@/shared/ui/modals/Modal';
import {
  EditorialContainer,
  EditorialEmptyState,
  EditorialHeader,
  EditorialPanel,
  EditorialPage,
  EditorialRail,
  EditorialSection,
  editorialFieldClass,
} from '@/shared/ui/editorial';

type Category =
  'all' | 'media' | 'live' | 'events' | 'store' | 'care' | 'books';

const categories: Array<{ key: Category; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'media', label: 'Media' },
  { key: 'live', label: 'Live' },
  { key: 'events', label: 'Events' },
  { key: 'store', label: 'Store' },
  { key: 'care', label: 'Care' },
  { key: 'books', label: 'Books' },
];

const quickActions = [
  {
    title: 'Watch live',
    desc: 'Sunday & daily prayer stream',
    href: '/resources/sermons',
    icon: Radio,
  },
  {
    title: 'Latest sermon',
    desc: 'Catch the latest message',
    href: '/resources/sermons',
    icon: Video,
  },
  {
    title: 'Events',
    desc: 'Conferences & programs',
    href: '/events',
    icon: CalendarDays,
  },
  {
    title: 'Store',
    desc: 'Merch, books, devotionals',
    href: '/resources/store',
    icon: Store,
  },
  {
    title: 'Publications',
    desc: 'Books & study guides',
    href: '/resources/publications',
    icon: BookOpen,
  },
  {
    title: 'Blog',
    desc: 'Devotionals & articles',
    href: '/resources/blogs',
    icon: Newspaper,
  },
  {
    title: 'Care & Counsel',
    desc: 'Pastoral support',
    href: '/pastoral',
    icon: Headphones,
  },
] as const;

const fallbackIcons = [
  BookOpen,
  Video,
  CalendarDays,
  Store,
  Headphones,
  Sparkles,
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [email, setEmail] = useState('');

  const filteredResources = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return resourceLinks.filter(resource => {
      const path = resource.path || '';

      const categoryMatch =
        activeCategory === 'all' ||
        (activeCategory === 'media' && path.includes('/sermons')) ||
        (activeCategory === 'live' && resource.isLiveService) ||
        (activeCategory === 'events' && path.includes('/events')) ||
        (activeCategory === 'store' && path.includes('/store')) ||
        (activeCategory === 'care' && path.includes('/pastoral')) ||
        (activeCategory === 'books' &&
          (path.includes('/publications') || path.includes('/blogs')));

      if (!term) return categoryMatch;

      const haystack =
        `${resource.title} ${resource.subtitle} ${resource.description}`.toLowerCase();

      return categoryMatch && haystack.includes(term);
    });
  }, [activeCategory, searchTerm]);

  const handleLiveServiceClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    isLive?: boolean
  ) => {
    if (!isLive) return;
    e.preventDefault();
    setShowLiveModal(true);
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail('');
    setShowLiveModal(false);
  };

  return (
    <EditorialPage tone="dark">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
        ])}
      />

      <SiteHero
        title="Resource Center"
        subtitle="Everything you need in one place."
        note="Live streams, sermons, events, publications, store, and pastoral care — curated for your growth."
        chips={['Live', 'Sermons', 'Events', 'Store', 'Books', 'Care']}
        compact
      />

      <EditorialSection tone="dark">
        <EditorialContainer className="space-y-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <EditorialHeader
                eyebrow="Resources & growth"
                title="Explore every ministry resource from one clean hub."
                description="Find sermons, live services, events, publications, store links, and care pathways without confusion."
                tone="dark"
              />
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-white/60 backdrop-blur-xl">
              {filteredResources.length} resources available
            </div>
          </div>

          <EditorialRail columns={3} itemWidth="compact" className="gap-4">
            {quickActions.map(item => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative block h-full min-h-[11rem] overflow-hidden rounded-card border border-white/12 bg-white/[0.035] p-6 transition duration-500 ease-out motion-safe:hover:-translate-y-1 hover:border-[var(--app-primary)]/40"
                >
                  <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[var(--app-primary)]/[0.13] opacity-0 blur-3xl transition group-hover:opacity-100" />

                  <div className="relative z-10 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-primary)]/[0.09] text-[var(--app-primary)] transition-transform duration-500 ease-out group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <H3 className="text-base font-semibold leading-tight text-white">
                        {item.title}
                      </H3>

                      <SmallText className="mt-2 block text-sm leading-6 text-white/58">
                        {item.desc}
                      </SmallText>
                    </div>

                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/35 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                </Link>
              );
            })}
          </EditorialRail>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection tone="canvas">
        <EditorialContainer>
          <div className="grid gap-6 lg:grid-cols-[minmax(16rem,19rem)_minmax(0,1fr)]">
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <EditorialPanel className="p-5">
                <H2 className="text-xl font-semibold leading-tight text-[var(--app-ink)]">
                  Resource library
                </H2>

                <SmallText className="mt-2 block text-sm leading-6 text-[var(--app-muted)]">
                  Browse by category or search by keyword.
                </SmallText>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {categories.map(cat => {
                    const active = activeCategory === cat.key;

                    return (
                      <Button
                        key={cat.key}
                        type="button"
                        variant={active ? 'primary' : 'ghost'}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`rounded-2xl px-3 py-2.5 min-h-0 h-auto text-xs font-bold ${
                          active
                            ? ''
                            : 'border border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-muted)] hover:border-[var(--app-primary)] hover:text-[var(--app-ink)]'
                        }`}
                      >
                        {cat.label}
                      </Button>
                    );
                  })}
                </div>
              </EditorialPanel>

              <EditorialPanel className="p-5">
                <label className="relative block">
                  <span className="sr-only">Search resources</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search resources..."
                    className={`${editorialFieldClass} h-12 pl-11`}
                  />
                </label>

                <Caption className="mt-3 block text-[11px] text-[var(--app-subtle)]">
                  Showing {filteredResources.length} result
                  {filteredResources.length === 1 ? '' : 's'}
                </Caption>
              </EditorialPanel>
            </aside>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredResources.map((resource, index) => {
                const Icon = (resource.icon ||
                  fallbackIcons[
                    index % fallbackIcons.length
                  ]) as typeof Sparkles;

                const isTrailingOdd =
                  filteredResources.length % 2 === 1 &&
                  index === filteredResources.length - 1;

                return (
                  <ScrollFadeIn
                    key={resource.title}
                    delay={index * 0.035}
                    className={isTrailingOdd ? 'sm:col-span-2' : ''}
                  >
                    <Link
                      href={resource.path}
                      onClick={(
                        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                      ) => handleLiveServiceClick(e, resource.isLiveService)}
                      className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--app-primary)]/40"
                    >
                      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[var(--app-primary)]/[0.12] opacity-0 blur-3xl transition group-hover:opacity-100" />

                      <div className="relative z-10 flex h-full flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-primary)]/[0.09] text-[var(--app-primary)]">
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <Caption className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--app-subtle)]">
                                {resource.subtitle}
                              </Caption>

                              <H3 className="line-clamp-2 text-base font-semibold leading-tight text-[var(--app-ink)] sm:text-lg">
                                {resource.title}
                              </H3>
                            </div>
                          </div>

                          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/35 transition group-hover:translate-x-1 group-hover:text-white" />
                        </div>

                        <BodyMD className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--app-muted)]">
                          {resource.description}
                        </BodyMD>

                        <div className="mt-auto pt-5">
                          <Caption className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--app-primary)]">
                            {resource.actionText || 'Read More'}
                          </Caption>
                        </div>
                      </div>
                    </Link>
                  </ScrollFadeIn>
                );
              })}

              {filteredResources.length === 0 && (
                <EditorialEmptyState
                  className="sm:col-span-2"
                  title="No resources found"
                  description="Try another category or clear your search term."
                />
              )}
            </div>
          </div>
        </EditorialContainer>
      </EditorialSection>

      <BaseModal
        isOpen={showLiveModal}
        onClose={() => setShowLiveModal(false)}
        title="Never miss a live service"
        subtitle="Choose YouTube or receive a reminder before each stream."
        maxWidth="max-w-md"
        forceBottomSheet
      >
        <div className="min-w-0 space-y-5">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--app-primary)]/[0.09]">
              <Radio className="h-7 w-7 text-[var(--app-primary)]" />
            </div>

            <BodyMD className="mt-2 text-sm leading-7 text-white/62">
              Get alerts for every stream and access the full video library.
            </BodyMD>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              window.open(SOCIAL_LINKS.youtube, '_blank', 'noopener,noreferrer')
            }
            className="h-12 w-full gap-2 rounded-button bg-[var(--app-youtube)] text-sm font-bold text-white hover:scale-[1.01] hover:bg-[var(--app-youtube-hover)]"
          >
            <Video className="h-4 w-4" />
            Subscribe on YouTube
          </Button>

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <label className="block text-sm font-semibold text-white/80">
              Or get email reminders
            </label>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-12 w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-4 focus:ring-[var(--app-primary)]/10"
            />

            <Button
              type="submit"
              variant="primary"
              className="h-12 w-full rounded-2xl text-sm font-bold hover:scale-[1.01]"
            >
              Notify me
            </Button>
          </form>

          <Caption className="block text-center text-white/45">
            We’ll email you before each live service starts.
          </Caption>
        </div>
      </BaseModal>
    </EditorialPage>
  );
}
