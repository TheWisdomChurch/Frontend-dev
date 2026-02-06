// app/resources/page.tsx — THE ULTIMATE 2026 CHURCH RESOURCE HUB
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H1, H2, BodyLG, Caption } from '@/components/text';
import { Section, Container } from '@/components/layout';
import { WisdomeHouseLogo } from '@/components/assets';
import { resourceLinks } from '@/lib/data';
import { mainResourceLink } from '@/lib/types';
import { Radio, Sparkles, X, Youtube, Bell } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ResourcesPage() {
  const { colorScheme } = useTheme();
  const isDarkMode = colorScheme.background === '#000000';
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      gsap.fromTo(
        card,
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power4.out',
          delay: i * 0.1,
        }
      );
    });
  }, []);

  const handleLiveServiceClick = (
    e: React.MouseEvent,
    resource: mainResourceLink
  ) => {
    if (resource.isLiveService) {
      e.preventDefault();
      setShowLiveModal(true);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    // Show success message or redirect
    alert(`Thank you! We'll notify you at ${email} when we go live.`);
    setEmail('');
    setShowLiveModal(false);
  };

  const handleYouTubeRedirect = () => {
    window.open('https://www.youtube.com/@wisdomhousehq', '_blank');
  };

  const categories = useMemo(
    () => ['all', 'media', 'live', 'events', 'store', 'care', 'books'],
    []
  );

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
        (activeCategory === 'books' &&
          resource.path.includes('/publications'));

      if (!term) return categoryMatch;
      const haystack = `${resource.title} ${resource.subtitle} ${resource.description}`.toLowerCase();
      return categoryMatch && haystack.includes(term);
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Section padding="none" className="relative overflow-hidden bg-[#030303]" perf="none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.07) 0%, transparent 35%), radial-gradient(circle at 82% 12%, rgba(255,255,255,0.06) 0%, transparent 32%), radial-gradient(circle at 55% 90%, rgba(255,255,255,0.05) 0%, transparent 40%)',
            filter: 'blur(70px)',
          }}
        />
        <div className="hero-animated" />
        <Container
          size="xl"
          className="relative z-10 flex flex-col gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 py-16 lg:py-22 min-h-[100vh]"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 w-fit backdrop-blur">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/15 bg-black/60">
              <Image src={WisdomeHouseLogo} alt="The Wisdom House" fill className="object-contain p-1.5" />
            </div>
            <Caption className="text-white/80 uppercase tracking-[0.22em] text-[11px]">
              The Wisdom House Church
            </Caption>
          </div>

          <div className="space-y-4 max-w-4xl">
            <H1 className="hero-title-glow text-3xl sm:text-4xl md:text-[2.7rem] lg:text-[3rem] font-black text-white leading-tight">
              Resource Center
            </H1>
            <H2 className="text-xl sm:text-2xl lg:text-3xl font-semibold" style={{ color: colorScheme.primary }}>
              Everything you need in one place.
            </H2>
            <BodyLG className="text-white/85 leading-relaxed text-base sm:text-lg">
              Access sermons, live streams, events, publications, merchandise, and pastoral care — all designed to help you grow closer to God.
            </BodyLG>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
            {[
              { label: 'Media', value: 'Sermons & Live' },
              { label: 'Events', value: 'Confs & Gatherings' },
              { label: 'Care', value: 'Pastoral Support' },
              { label: 'Store', value: 'Merch & Books' },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 space-y-1"
                style={{ boxShadow: `0 10px 30px ${colorScheme.primary}20` }}
              >
                <Caption className="text-white/60">{item.label}</Caption>
                <H2 className="text-white text-lg font-semibold">{item.value}</H2>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Live Services Modal */}
      {showLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="relative rounded-3xl overflow-hidden w-full max-w-md"
            style={{
              background: isDarkMode
                ? `linear-gradient(145deg, ${colorScheme.surface}ee, ${colorScheme.surfaceVariant}cc)`
                : `linear-gradient(145deg, #ffffff, #f8f9fa)`,
              border: `1px solid ${isDarkMode ? '#333' : '#E5E7EB'}`,
              boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowLiveModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
              style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                  style={{ backgroundColor: colorScheme.primary + '20' }}
                >
                  <Radio
                    className="w-8 h-8"
                    style={{ color: colorScheme.primary }}
                  />
                </div>
                <H2
                  className="text-2xl font-bold mb-2"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                >
                  Never Miss a Live Service
                </H2>
                <BodyLG
                  style={{
                    color: isDarkMode ? colorScheme.textSecondary : '#666',
                  }}
                >
                  Get notified when we go live and join our growing YouTube
                  community
                </BodyLG>
              </div>

              {/* YouTube Subscription Section */}
              <div className="mb-6 p-4 rounded-2xl bg-black/10">
                <div className="flex items-center gap-3 mb-3">
                  <Youtube className="w-6 h-6 text-red-600" />
                  <span
                    className="font-semibold"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                  >
                    Subscribe to YouTube
                  </span>
                </div>
                <p
                  className="text-sm mb-4"
                  style={{
                    color: isDarkMode ? colorScheme.textSecondary : '#666',
                  }}
                >
                  Get instant notifications when we start streaming and access
                  our full video library
                </p>
                <button
                  onClick={handleYouTubeRedirect}
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: '#FF0000',
                    color: 'white',
                  }}
                >
                  <Youtube className="w-5 h-5" />
                  Subscribe to Channel
                </button>
              </div>

              {/* Email Notification Section */}
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                  >
                    Or get email notifications:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={
                      {
                        backgroundColor: isDarkMode
                          ? colorScheme.surface
                          : '#FFFFFF',
                        borderColor: isDarkMode ? '#333' : '#E5E7EB',
                        color: isDarkMode ? '#FFFFFF' : '#000000',
                        '--focus-ring-color': colorScheme.primary,
                      } as React.CSSProperties
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: colorScheme.primary,
                    color: colorScheme.black,
                  }}
                >
                  <Bell className="w-5 h-5" />
                  Get Notified
                </button>
              </form>

              {/* Footer Note */}
              <p
                className="text-xs text-center mt-4"
                style={{
                  color: isDarkMode ? colorScheme.textSecondary : '#666',
                }}
              >
                We'll send you reminders before each live service starts
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Futuristic Grid */}
      <Section
        padding="xl"
        className="relative overflow-hidden"
        style={{ backgroundColor: isDarkMode ? '#000000' : '#FAFAFA' }}
      >
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ backgroundColor: colorScheme.primary }}
          />
          <div
            className="absolute bottom-40 right-10 w-80 h-80 rounded-full blur-3xl opacity-15 animate-pulse delay-700"
            style={{ backgroundColor: colorScheme.primaryDark || '#D4BC0F' }}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <Sparkles className="absolute top-32 left-40 w-20 h-20 text-yellow-400/20 animate-pulse" />
            <Sparkles className="absolute bottom-40 right-32 w-32 h-32 text-amber-400/15 animate-pulse delay-500" />
          </div>
        </div>

        <Container size="xl">
          <div className="text-center mb-12">
            <H1
              className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 tracking-tight"
              style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
            >
              Your Spiritual{' '}
              <span style={{ color: colorScheme.primary }}>Home</span>
            </H1>
            <BodyLG
              className="text-base md:text-lg max-w-2xl mx-auto opacity-90 leading-relaxed"
              style={{
                color: isDarkMode
                  ? colorScheme.textSecondary
                  : colorScheme.textTertiary,
              }}
            >
              One destination. Infinite ways to grow, connect, and encounter
              God.
            </BodyLG>
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-10">
            <div
              className="rounded-2xl p-4 sm:p-5 border backdrop-blur"
              style={{
                background: isDarkMode
                  ? `${colorScheme.surface}cc`
                  : 'rgba(255,255,255,0.8)',
                borderColor: isDarkMode ? '#333' : '#E5E7EB',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-3 items-center">
                <input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search resources, sermons, events..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: isDarkMode ? colorScheme.surface : '#fff',
                    color: isDarkMode ? '#fff' : '#000',
                    borderColor: isDarkMode ? '#333' : '#E5E7EB',
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition"
                      style={{
                        backgroundColor:
                          activeCategory === category
                            ? colorScheme.primary
                            : 'transparent',
                        color:
                          activeCategory === category
                            ? colorScheme.black
                            : isDarkMode
                              ? colorScheme.white
                              : colorScheme.black,
                        borderColor:
                          activeCategory === category
                            ? colorScheme.primary
                            : isDarkMode
                              ? '#333'
                              : '#E5E7EB',
                      }}
                    >
                      {category === 'all'
                        ? 'All'
                        : category === 'media'
                          ? 'Media'
                          : category === 'live'
                            ? 'Live'
                            : category === 'events'
                              ? 'Events'
                              : category === 'store'
                                ? 'Store'
                                : category === 'care'
                                  ? 'Care'
                                  : 'Books'}
                    </button>
                  ))}
                </div>
              </div>
              <Caption
                className="text-xs mt-3"
                style={{
                  color: isDarkMode
                    ? colorScheme.textSecondary
                    : colorScheme.textTertiary,
                }}
              >
                Showing {filteredResources.length} resources
              </Caption>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredResources.map((resource, i) => {
              // Create the icon component dynamically
              const IconComponent = resource.icon;

              return (
                <Link
                  href={resource.path}
                  key={i}
                  className="group block"
                  onClick={e => handleLiveServiceClick(e, resource)}
                >
                  <div
                    ref={el => {
                      cardRefs.current[i] = el;
                    }}
                    className="relative h-full rounded-2xl overflow-hidden transition-all duration-700 group-hover:scale-105"
                    style={{
                      background: isDarkMode
                        ? `linear-gradient(145deg, ${colorScheme.surface}ee, ${colorScheme.surfaceVariant}cc)`
                        : `linear-gradient(145deg, #ffffff, #f8f9fa)`,
                      border: `1px solid ${isDarkMode ? '#333' : '#E5E7EB'}`,
                      boxShadow: isDarkMode
                        ? '0 20px 40px rgba(0,0,0,0.8)'
                        : '0 15px 35px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br ${resource.gradient}`}
                    />

                    {/* Floating Orb */}
                    <div
                      className="absolute top-6 right-6 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-1000"
                      style={{ backgroundColor: resource.glow }}
                    />

                    <div className="relative p-6 lg:p-8 h-full flex flex-col justify-between">
                      <div>
                        {/* Icon Container - Black background in light mode, White background in dark mode */}
                        <div
                          className="mb-6 p-4 rounded-2xl backdrop-blur-sm w-fit group-hover:bg-white/20 transition-all duration-500"
                          style={{
                            backgroundColor: isDarkMode ? '#FFFFFF' : '#000000',
                          }}
                        >
                          <div style={{ color: colorScheme.primary }}>
                            {IconComponent && (
                              <IconComponent className="w-8 h-8" />
                            )}
                          </div>
                        </div>

                        <h3
                          className="text-xl lg:text-2xl font-black mb-3 leading-tight"
                          style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                        >
                          {resource.title}
                        </h3>

                        <p
                          className="text-base font-semibold mb-3"
                          style={{ color: colorScheme.primary }}
                        >
                          {resource.subtitle}
                        </p>

                        <Caption
                          className="text-sm leading-relaxed opacity-80"
                          style={{
                            color: isDarkMode
                              ? colorScheme.textSecondary
                              : '#666',
                          }}
                        >
                          {resource.description}
                        </Caption>
                      </div>

                      <div className="mt-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                        <span
                          className="text-sm font-bold uppercase tracking-wider"
                          style={{ color: colorScheme.primary }}
                        >
                          {resource.actionText}
                        </span>
                        <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center group-hover:bg-yellow-400/40 transition-colors">
                          <Sparkles
                            className="w-5 h-5"
                            style={{ color: colorScheme.primary }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Final CTA */}
          <div className="mt-24 text-center">
            <div
              className="inline-block p-8 rounded-2xl relative overflow-hidden"
              style={{
                background: colorScheme.primaryGradient,
                boxShadow: `0 0 80px ${colorScheme.primary}80`,
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <H2 className="text-2xl md:text-4xl font-black text-black mb-4">
                  You Belong Here
                </H2>
                <BodyLG className="text-black/80 text-lg max-w-2xl">
                  Whatever you're looking for — teaching, community, worship, or
                  purpose — you've found your home.
                </BodyLG>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
