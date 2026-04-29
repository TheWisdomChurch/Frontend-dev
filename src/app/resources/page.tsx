'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Headphones,
  Radio,
  Search,
  Sparkles,
  Store,
  Video,
  X,
} from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import { H2, H3, BodyMD, Caption, SmallText } from '@/shared/text';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { resourceLinks } from '@/lib/data';

type Category =
  | 'all'
  | 'media'
  | 'live'
  | 'events'
  | 'store'
  | 'care'
  | 'books';

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
    desc: 'Sunday & Thursday stream',
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
  const { colorScheme } = useTheme();

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
        (activeCategory === 'books' && path.includes('/publications'));

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
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Resource Center"
        subtitle="Everything you need in one place."
        note="Live streams, sermons, events, publications, store, and pastoral care — curated for your growth."
        chips={['Live', 'Sermons', 'Events', 'Store', 'Books', 'Care']}
        compact
      />

      <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(247,222,18,0.13),transparent_32%),radial-gradient(circle_at_86%_8%,rgba(255,255,255,0.07),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(247,222,18,0.08),transparent_34%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />
        </div>

        <Container size="xl" className="relative z-10 space-y-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
                style={{
                  borderColor: `${colorScheme.primary}33`,
                  background: `${colorScheme.primary}12`,
                  color: colorScheme.primary,
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <Caption className="text-[10px] font-bold uppercase tracking-[0.24em]">
                  Resources & Growth
                </Caption>
              </div>

              <H2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Explore every ministry resource from one clean hub.
              </H2>

              <BodyMD className="mt-4 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                Find sermons, live services, events, publications, store links,
                and care pathways without confusion.
              </BodyMD>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-white/60 backdrop-blur-xl">
              {filteredResources.length} resources available
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((item, index) => {
              const Icon = item.icon;

              return (
                <ScrollFadeIn key={item.title} delay={index * 0.04}>
                  <Link
                    href={item.href}
                    className="group relative block h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.085]"
                  >
                    <div
                      className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full opacity-0 blur-3xl transition group-hover:opacity-100"
                      style={{ background: `${colorScheme.primary}22` }}
                    />

                    <div className="relative z-10 flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                        style={{
                          background: `${colorScheme.primary}18`,
                          color: colorScheme.primary,
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <Caption className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">
                          {String(index + 1).padStart(2, '0')}
                        </Caption>

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
                </ScrollFadeIn>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section padding="lg" className="relative overflow-hidden bg-[#070707]">
        <Container size="xl">
          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <H2 className="text-xl font-semibold leading-tight text-white">
                  Resource library
                </H2>

                <SmallText className="mt-2 block text-sm leading-6 text-white/58">
                  Browse by category or search by keyword.
                </SmallText>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {categories.map(cat => {
                    const active = activeCategory === cat.key;

                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setActiveCategory(cat.key)}
                        className={`rounded-2xl border px-3 py-2.5 text-xs font-bold transition ${
                          active
                            ? 'border-transparent text-black'
                            : 'border-white/10 bg-white/[0.04] text-white/64 hover:bg-white/[0.08] hover:text-white'
                        }`}
                        style={
                          active
                            ? {
                                backgroundColor: colorScheme.primary,
                                color: '#000',
                              }
                            : undefined
                        }
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                <label className="relative block">
                  <span className="sr-only">Search resources</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search resources..."
                    className="h-12 w-full rounded-2xl border border-white/12 bg-black/35 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/20 focus:border-[#F7DE12]/70 focus:ring-4 focus:ring-[#F7DE12]/10"
                  />
                </label>

                <Caption className="mt-3 block text-[11px] text-white/45">
                  Showing {filteredResources.length} result
                  {filteredResources.length === 1 ? '' : 's'}
                </Caption>
              </div>
            </aside>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredResources.map((resource, index) => {
                const Icon = (resource.icon ||
                  fallbackIcons[
                    index % fallbackIcons.length
                  ]) as typeof Sparkles;

                return (
                  <ScrollFadeIn key={resource.title} delay={index * 0.035}>
                    <Link
                      href={resource.path}
                      onClick={(
                        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                      ) => handleLiveServiceClick(e, resource.isLiveService)}
                      className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.085]"
                    >
                      <div
                        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition group-hover:opacity-100"
                        style={{ background: `${colorScheme.primary}20` }}
                      />

                      <div className="relative z-10 flex h-full flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <div
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                              style={{
                                background: `${colorScheme.primary}18`,
                                color: colorScheme.primary,
                              }}
                            >
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <Caption className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">
                                {resource.subtitle}
                              </Caption>

                              <H3 className="line-clamp-2 text-base font-semibold leading-tight text-white sm:text-lg">
                                {resource.title}
                              </H3>
                            </div>
                          </div>

                          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/35 transition group-hover:translate-x-1 group-hover:text-white" />
                        </div>

                        <BodyMD className="mt-4 line-clamp-4 text-sm leading-7 text-white/62">
                          {resource.description}
                        </BodyMD>

                        <div className="mt-auto pt-5">
                          <Caption
                            className="text-[11px] font-bold uppercase tracking-[0.16em]"
                            style={{ color: colorScheme.primary }}
                          >
                            {resource.actionText || 'Read More'}
                          </Caption>
                        </div>
                      </div>
                    </Link>
                  </ScrollFadeIn>
                );
              })}

              {filteredResources.length === 0 && (
                <div className="sm:col-span-2 rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-8 text-center">
                  <Search
                    className="mx-auto h-8 w-8"
                    style={{ color: colorScheme.primary }}
                  />
                  <H3 className="mt-4 text-lg font-semibold text-white">
                    No resources found
                  </H3>
                  <SmallText className="mt-2 block text-sm leading-6 text-white/55">
                    Try another category or clear your search term.
                  </SmallText>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {showLiveModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="relative w-full max-w-md overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#101010] shadow-[0_30px_90px_rgba(0,0,0,0.7)] sm:rounded-[2rem]">
            <div className="flex justify-center pb-1.5 pt-3 sm:hidden">
              <span className="h-1.5 w-12 rounded-full bg-white/18" />
            </div>

            <button
              onClick={() => setShowLiveModal(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/18"
              aria-label="Close"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-5 p-6 sm:p-7">
              <div className="text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${colorScheme.primary}18` }}
                >
                  <Radio
                    className="h-7 w-7"
                    style={{ color: colorScheme.primary }}
                  />
                </div>

                <H2 className="mt-4 text-xl font-semibold leading-tight text-white">
                  Never miss a live service
                </H2>

                <BodyMD className="mt-2 text-sm leading-7 text-white/62">
                  Get alerts for every stream and access the full video library.
                </BodyMD>
              </div>

              <button
                type="button"
                onClick={() =>
                  window.open(
                    'https://www.youtube.com/@wisdomhousehq',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF0000] text-sm font-bold text-white transition hover:scale-[1.01]"
              >
                <Video className="h-4 w-4" />
                Subscribe on YouTube
              </button>

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
                  className="h-12 w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/20 focus:border-[#F7DE12]/70 focus:ring-4 focus:ring-[#F7DE12]/10"
                />

                <button
                  type="submit"
                  className="h-12 w-full rounded-2xl text-sm font-bold transition hover:scale-[1.01]"
                  style={{
                    backgroundColor: colorScheme.primary,
                    color: '#000',
                  }}
                >
                  Notify me
                </button>
              </form>

              <p className="text-center text-xs leading-6 text-white/45">
                We’ll email you before each live service starts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
