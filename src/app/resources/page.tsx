// app/resources/page.tsx — refreshed resource hub
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H2, H3, BodyMD, Caption, SmallText } from '@/components/text';
import { Section, Container, GridboxLayout, FlexboxLayout } from '@/components/layout';
import PageHero from '@/components/ui/PageHero';
import { resourceLinks } from '@/lib/data';
import { Radio, Sparkles, X, Youtube, Bell } from 'lucide-react';

type Category = 'all' | 'media' | 'live' | 'events' | 'store' | 'care' | 'books';

export default function ResourcesPage() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme.background === '#000000';

  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [email, setEmail] = useState('');

  const categories: Category[] = ['all', 'media', 'live', 'events', 'store', 'care', 'books'];

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
      const haystack = `${resource.title} ${resource.subtitle} ${resource.description}`.toLowerCase();
      return categoryMatch && haystack.includes(term);
    });
  }, [activeCategory, searchTerm]);

  const palette = {
    card: '#0f0f0f',
    panel: '#0b0b0b',
    border: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.70)',
  };

  const handleLiveServiceClick = (e: React.MouseEvent, isLive?: boolean) => {
    if (isLive) {
      e.preventDefault();
      setShowLiveModal(true);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
    setShowLiveModal(false);
    // Backend should send email confirmation; stub only.
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

      {/* Quick actions */}
      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-6">
          <GridboxLayout columns={3} responsive={{ xs: 1, md: 2, lg: 3 }} gap="md">
            {[
              { title: 'Watch live', desc: 'Sunday & Thursday stream', href: '/resources/sermons', icon: <Radio className="w-5 h-5" /> },
              { title: 'Latest sermon', desc: 'Catch last gathering', href: '/resources/sermons', icon: <Youtube className="w-5 h-5" /> },
              { title: 'Events', desc: 'Conferences & programs', href: '/events', icon: <Sparkles className="w-5 h-5" /> },
              { title: 'Store', desc: 'Merch, books, devotionals', href: '/resources/store', icon: <Sparkles className="w-5 h-5" /> },
              { title: 'Publications', desc: 'Books & study guides', href: '/resources/publications', icon: <Sparkles className="w-5 h-5" /> },
              { title: 'Care & Counsel', desc: 'Pastoral support', href: '/pastoral', icon: <Bell className="w-5 h-5" /> },
            ].map(item => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-start gap-3 hover:-translate-y-1 transition"
              >
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colorScheme.opacity.primary10 }}>
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <H3 className="text-base font-semibold">{item.title}</H3>
                  <SmallText className="text-white/65 text-[12px]">{item.desc}</SmallText>
                </div>
              </Link>
            ))}
          </GridboxLayout>
        </Container>
      </Section>

      {/* Library */}
      <Section padding="lg" className="bg-[#0a0a0a]">
        <Container size="xl" className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <H2 className="text-xl sm:text-2xl font-semibold">Resource library</H2>
              <SmallText className="text-white/65 text-[12px]">Browse by category or search.</SmallText>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.25 rounded-full text-[12px] font-semibold border transition ${
                    activeCategory === cat ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat[0].toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search resources..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none"
            />
            <Caption className="text-white/60 text-[11px] mt-2">Showing {filteredResources.length} resources</Caption>
          </div>

          <GridboxLayout columns={3} responsive={{ xs: 1, md: 2, lg: 3 }} gap="md">
            {filteredResources.map(resource => (
              <Link
                key={resource.title}
                href={resource.path}
                onClick={e => handleLiveServiceClick(e, resource.isLiveService)}
                className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-4 sm:p-5 flex flex-col gap-3 hover:-translate-y-1 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Caption className="text-white/60 text-[11px]">{resource.subtitle}</Caption>
                    <H3 className="text-base font-semibold leading-tight">{resource.title}</H3>
                  </div>
                  <span className="text-xs text-white/60">→</span>
                </div>
                <BodyMD className="text-white/70 text-sm leading-relaxed">
                  {resource.description}
                </BodyMD>
                <SmallText className="text-white/50 text-[12px]">
                  {resource.path}
                </SmallText>
              </Link>
            ))}
          </GridboxLayout>
        </Container>
      </Section>

      {/* Live modal */}
      {showLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="relative rounded-3xl overflow-hidden w-full max-w-md"
            style={{
              background: isDark ? `linear-gradient(145deg, ${colorScheme.surface}ee, ${colorScheme.surfaceVariant}cc)` : `linear-gradient(145deg, #ffffff, #f8f9fa)`,
              border: `1px solid ${isDark ? '#333' : '#E5E7EB'}`,
              boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
            }}
          >
            <button
              onClick={() => setShowLiveModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
              style={{ color: isDark ? '#FFFFFF' : '#000000' }}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 space-y-5">
              <div className="text-center space-y-2">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl"
                  style={{ backgroundColor: colorScheme.primary + '20' }}
                >
                  <Radio className="w-7 h-7" style={{ color: colorScheme.primary }} />
                </div>
                <H2 className="text-xl font-semibold" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
                  Never miss a live service
                </H2>
                <BodyMD style={{ color: isDark ? colorScheme.textSecondary : '#555' }}>
                  Get alerts for every stream and access the full video library.
                </BodyMD>
              </div>

              <button
                onClick={() => window.open('https://www.youtube.com/@wisdomhousehq', '_blank')}
                className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{ backgroundColor: '#FF0000', color: 'white' }}
              >
                <Youtube className="w-5 h-5" />
                Subscribe on YouTube
              </button>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <label className="block text-sm font-medium" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
                  Or get email reminders
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3.5 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm"
                  style={{
                    backgroundColor: isDark ? colorScheme.surface : '#FFFFFF',
                    borderColor: isDark ? '#333' : '#E5E7EB',
                    color: isDark ? '#FFFFFF' : '#000000',
                  }}
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02]"
                  style={{ backgroundColor: colorScheme.primary, color: colorScheme.black }}
                >
                  Notify me
                </button>
              </form>

              <p className="text-xs text-center" style={{ color: isDark ? colorScheme.textSecondary : '#666' }}>
                We’ll email you before each live service starts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
