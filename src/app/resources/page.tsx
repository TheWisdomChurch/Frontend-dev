'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { H2, H3, BodyMD, Caption, SmallText } from '@/shared/text';
import {
  Container,
  Section,
  PageSection,
  FlexboxLayout,
  Gridbox,
} from '@/shared/layout';
import PageHero from '@/features/hero/PageHero';
import { resourceLinks } from '@/lib/data';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { Radio, Sparkles, X, Video, Bell, Search } from 'lucide-react';

type Category =
  | 'all'
  | 'media'
  | 'live'
  | 'events'
  | 'store'
  | 'care'
  | 'books';

const categories: Category[] = [
  'all',
  'media',
  'live',
  'events',
  'store',
  'care',
  'books',
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
    desc: 'Catch last gathering',
    href: '/resources/sermons',
    icon: Video,
  },
  {
    title: 'Events',
    desc: 'Conferences & programs',
    href: '/events',
    icon: Sparkles,
  },
  {
    title: 'Store',
    desc: 'Merch, books, devotionals',
    href: '/resources/store',
    icon: Sparkles,
  },
  {
    title: 'Publications',
    desc: 'Books & study guides',
    href: '/resources/publications',
    icon: Sparkles,
  },
  {
    title: 'Care & Counsel',
    desc: 'Pastoral support',
    href: '/pastoral',
    icon: Bell,
  },
] as const;

export default function ResourcesPage() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme.background === '#000000';

  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [email, setEmail] = useState('');

  const filteredResources = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return resourceLinks.filter(resource => {
      const categoryMatch =
        activeCategory === 'all' ||
        (activeCategory === 'media' && resource.path.includes('/sermons')) ||
        (activeCategory === 'live' && resource.isLiveService) ||
        (activeCategory === 'events' && resource.path.includes('/events')) ||
        (activeCategory === 'store' && resource.path.includes('/store')) ||
        (activeCategory === 'care' && resource.path.includes('/pastoral')) ||
        (activeCategory === 'books' && resource.path.includes('/publications'));

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

  const handleEmailSubmit = (e: React.FormEvent) => {
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
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          data-parallax-global="0.12"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            maskImage:
              'radial-gradient(circle at 50% 34%, black 42%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 34%, black 42%, transparent 92%)',
          }}
        />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
          data-parallax-global="0.18"
          style={{ background: `${colorScheme.primary}14` }}
        />

        <Container size="xl" className="relative z-10 space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {quickActions.map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollFadeIn key={item.title} delay={index * 0.05}>
                  <Link
                    href={item.href}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20"
                    style={{ boxShadow: '0 12px 28px rgba(0,0,0,0.22)' }}
                    data-parallax-global={index % 2 === 0 ? '0.08' : '0.12'}
                  >
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 85% 15%, ${colorScheme.primary}18 0%, transparent 52%)`,
                      }}
                    />
                    <div className="relative flex items-start gap-3">
                      <div
                        className="h-10 w-10 rounded-xl border border-white/10 flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: colorScheme.opacity.primary10,
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: colorScheme.primary }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Caption className="text-[10px] tracking-[0.18em] text-white/45 mb-1 block">
                          {String(index + 1).padStart(2, '0')}
                        </Caption>
                        <H3 className="text-sm sm:text-[15px] font-semibold leading-tight mb-1">
                          {item.title}
                        </H3>
                        <SmallText className="text-white/65 text-[11px] sm:text-xs leading-relaxed">
                          {item.desc}
                        </SmallText>
                      </div>
                    </div>
                  </Link>
                </ScrollFadeIn>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section padding="lg" className="relative overflow-hidden bg-[#070707]">
        <Container size="xl" className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-4 sm:gap-5 lg:gap-6 items-start">
            <aside className="xl:sticky xl:top-24 space-y-4">
              <div
                className="rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-5"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 46%, rgba(0,0,0,0.2) 100%)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.28)',
                }}
              >
                <H2 className="text-lg sm:text-xl font-semibold mb-1.5 leading-tight">
                  Resource library
                </H2>
                <SmallText className="text-white/65 text-[11px] sm:text-xs leading-relaxed">
                  Browse by category or search.
                </SmallText>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-xl border px-3 py-2 text-[11px] sm:text-xs font-semibold transition-colors ${
                        activeCategory === cat
                          ? 'text-black border-transparent'
                          : 'text-white border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                      }`}
                      style={
                        activeCategory === cat
                          ? {
                              backgroundColor: colorScheme.primary,
                              color: colorScheme.black,
                            }
                          : undefined
                      }
                    >
                      {cat === 'all'
                        ? 'All'
                        : cat[0].toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-5"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 46%, rgba(0,0,0,0.18) 100%)',
                }}
              >
                <label className="relative block">
                  <span className="sr-only">Search resources</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search resources..."
                    className="w-full rounded-xl border border-white/10 bg-black/35 pl-9 pr-3 py-2.5 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  />
                </label>
                <Caption className="text-white/60 text-[11px] mt-2 block">
                  Showing {filteredResources.length} resources
                </Caption>
              </div>
            </aside>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredResources.map((resource, index) => {
                const Icon = resource.icon || Sparkles;
                return (
                  <ScrollFadeIn key={resource.title} delay={index * 0.04}>
                    <Link
                      href={resource.path}
                      onClick={e =>
                        handleLiveServiceClick(e, resource.isLiveService)
                      }
                      className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20"
                      style={{
                        background:
                          'linear-gradient(150deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 46%, rgba(0,0,0,0.2) 100%)',
                        boxShadow: '0 16px 36px rgba(0,0,0,0.25)',
                      }}
                      data-parallax-global={index % 3 === 0 ? '0.08' : '0.12'}
                    >
                      <div
                        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(circle at 86% 12%, ${colorScheme.primary}16 0%, transparent 48%)`,
                        }}
                      />

                      <div className="relative flex h-full flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div
                              className="h-10 w-10 rounded-xl border border-white/10 flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: colorScheme.opacity.primary10,
                              }}
                            >
                              <Icon
                                className="w-4 h-4"
                                style={{ color: colorScheme.primary }}
                              />
                            </div>
                            <div className="min-w-0">
                              <Caption className="text-white/55 text-[10px] sm:text-[11px] block mb-1 leading-tight">
                                {resource.subtitle}
                              </Caption>
                              <H3 className="text-sm sm:text-base font-semibold leading-tight text-white">
                                {resource.title}
                              </H3>
                            </div>
                          </div>
                          <span className="text-white/45 text-sm transition-transform duration-300 group-hover:translate-x-0.5">
                            →
                          </span>
                        </div>

                        <BodyMD className="text-white/70 text-xs sm:text-sm leading-relaxed">
                          {resource.description}
                        </BodyMD>

                        <div className="mt-auto pt-1">
                          <Caption
                            className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em]"
                            style={{ color: colorScheme.primary }}
                          >
                            {resource.actionText || 'Read More →'}
                          </Caption>
                        </div>
                      </div>
                    </Link>
                  </ScrollFadeIn>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {showLiveModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-6">
          <div
            className="relative w-full max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl border"
            style={{
              background: isDark
                ? `linear-gradient(145deg, ${colorScheme.surface}ee, ${colorScheme.surfaceVariant}cc)`
                : 'linear-gradient(145deg, #ffffff, #f8f9fa)',
              borderColor: isDark ? '#333' : '#E5E7EB',
              boxShadow: '0 30px 60px rgba(0,0,0,0.65)',
            }}
          >
            <div className="flex justify-center pt-3 pb-1.5 sm:hidden">
              <span className="h-1.5 w-12 rounded-full bg-black/20" />
            </div>

            <button
              onClick={() => setShowLiveModal(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/15 hover:bg-black/25 transition-colors"
              style={{ color: isDark ? '#FFFFFF' : '#000000' }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-5 sm:p-6 lg:p-7 space-y-4 sm:space-y-5">
              <div className="text-center space-y-2">
                <div
                  className="mx-auto inline-flex items-center justify-center w-12 h-12 rounded-2xl"
                  style={{ backgroundColor: `${colorScheme.primary}20` }}
                >
                  <Radio
                    className="w-6 h-6"
                    style={{ color: colorScheme.primary }}
                  />
                </div>
                <H2
                  className="text-lg sm:text-xl font-semibold leading-tight"
                  style={{ color: isDark ? '#FFFFFF' : '#000000' }}
                >
                  Never miss a live service
                </H2>
                <BodyMD
                  className="text-sm leading-relaxed"
                  style={{ color: isDark ? colorScheme.textSecondary : '#555' }}
                >
                  Get alerts for every stream and access the full video library.
                </BodyMD>
              </div>

              <button
                onClick={() =>
                  window.open(
                    'https://www.youtube.com/@wisdomhousehq',
                    '_blank'
                  )
                }
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition hover:scale-[1.01] flex items-center justify-center gap-2"
                style={{ backgroundColor: '#FF0000', color: 'white' }}
              >
                <Video className="w-4 h-4" />
                Subscribe on YouTube
              </button>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <label
                  className="block text-xs sm:text-sm font-medium"
                  style={{ color: isDark ? '#FFFFFF' : '#000000' }}
                >
                  Or get email reminders
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition text-sm"
                  style={{
                    backgroundColor: isDark ? colorScheme.surface : '#FFFFFF',
                    borderColor: isDark ? '#333' : '#E5E7EB',
                    color: isDark ? '#FFFFFF' : '#000000',
                  }}
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition hover:scale-[1.01]"
                  style={{
                    backgroundColor: colorScheme.primary,
                    color: colorScheme.black,
                  }}
                >
                  Notify me
                </button>
              </form>

              <p
                className="text-[11px] sm:text-xs text-center leading-relaxed"
                style={{ color: isDark ? colorScheme.textSecondary : '#666' }}
              >
                We’ll email you before each live service starts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
