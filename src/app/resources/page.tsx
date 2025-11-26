// app/resources/page.tsx — THE ULTIMATE 2026 CHURCH RESOURCE HUB
'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H1, H2, BodyLG, Caption } from '@/components/text';
import { Section, Container } from '@/components/layout';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { hero_bg_3 } from '@/components/assets';
import {
  Video,
  ShoppingBag,
  Calendar,
  BookOpen,
  Heart,
  Radio,
  Sparkles,
  X,
  Youtube,
  Bell,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ResourceLink {
  title: string;
  subtitle: string;
  description: string;
  path: string;
  icon: JSX.Element;
  gradient: string;
  glow: string;
  isLiveService?: boolean;
}

const resourceLinks: ResourceLink[] = [
  {
    title: 'Sermons & Teachings',
    subtitle: 'Messages that transform lives',
    description: 'Watch, listen, and grow through powerful biblical teaching',
    path: '/resources/sermons',
    icon: <Video className="w-10 h-10" />,
    gradient: 'from-yellow-400/20 to-amber-600/10',
    glow: 'rgba(251, 191, 36, 0.4)',
  },
  {
    title: 'Live Services',
    subtitle: 'Join us in real-time',
    description:
      'Stream Sunday services, prayer meetings, and special events live',
    path: '#', // Changed to hash to prevent navigation
    icon: <Radio className="w-10 h-10" />,
    gradient: 'from-amber-500/20 to-orange-600/10',
    glow: 'rgba(251, 146, 60, 0.5)',
    isLiveService: true, // Flag to identify live services card
  },
  {
    title: 'Events & Programs',
    subtitle: 'Be part of something greater',
    description:
      'Conferences, revivals, outreaches, and life-changing gatherings',
    path: '/events',
    icon: <Calendar className="w-10 h-10" />,
    gradient: 'from-orange-500/20 to-red-600/10',
    glow: 'rgba(239, 68, 68, 0.4)',
  },
  {
    title: 'Wisdom House Store',
    subtitle: 'Wear your faith',
    description: 'Merchandise that carries a message of hope and identity',
    path: '/resources/store',
    icon: <ShoppingBag className="w-10 h-10" />,
    gradient: 'from-red-500/20 to-pink-600/10',
    glow: 'rgba(236, 72, 153, 0.4)',
  },
  {
    title: 'Publications',
    subtitle: 'Resources for spiritual growth',
    description: 'Devotionals, study guides, prayer journals, and more',
    path: '/resources/publications',
    icon: <BookOpen className="w-10 h-10" />,
    gradient: 'from-pink-500/20 to-purple-600/10',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
  {
    title: 'Pastoral Care',
    subtitle: "We're here for life's moments",
    description: 'Weddings, dedications, counseling, and sacred celebrations',
    path: '/pastoral',
    icon: <Heart className="w-10 h-10" />,
    gradient: 'from-purple-500/20 to-indigo-600/10',
    glow: 'rgba(99, 102, 241, 0.4)',
  },
];

export default function ResourcesPage() {
  const { colorScheme } = useTheme();
  const isDarkMode = colorScheme.background === '#000000';
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [email, setEmail] = useState('');

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
    resource: ResourceLink
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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection
        title="Resource Center"
        subtitle="Everything You Need in One Place"
        description="Access sermons, live streams, events, publications, merchandise, and pastoral care — all designed to help you grow closer to God."
        backgroundImage={hero_bg_3.src}
        showButtons={false}
        showScrollIndicator={true}
      />

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
          <div className="text-center mb-20">
            <H1
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter"
              style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
            >
              Your Spiritual{' '}
              <span style={{ color: colorScheme.primary }}>Home</span>
            </H1>
            <BodyLG
              className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {resourceLinks.map((resource, i) => (
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
                  className="relative h-full rounded-3xl overflow-hidden transition-all duration-700 group-hover:scale-105"
                  style={{
                    background: isDarkMode
                      ? `linear-gradient(145deg, ${colorScheme.surface}ee, ${colorScheme.surfaceVariant}cc)`
                      : `linear-gradient(145deg, #ffffff, #f8f9fa)`,
                    border: `1px solid ${isDarkMode ? '#333' : '#E5E7EB'}`,
                    boxShadow: isDarkMode
                      ? '0 30px 60px rgba(0,0,0,0.8)'
                      : '0 20px 50px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br ${resource.gradient}`}
                  />

                  {/* Floating Orb */}
                  <div
                    className="absolute top-8 right-8 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-1000"
                    style={{ backgroundColor: resource.glow }}
                  />

                  <div className="relative p-10 lg:p-12 h-full flex flex-col justify-between">
                    <div>
                      {/* Icon Container - Black background in light mode, White background in dark mode */}
                      <div
                        className="mb-8 p-6 rounded-3xl backdrop-blur-sm w-fit group-hover:bg-white/20 transition-all duration-500"
                        style={{
                          backgroundColor: isDarkMode ? '#FFFFFF' : '#000000',
                        }}
                      >
                        <div style={{ color: colorScheme.primary }}>
                          {resource.icon}
                        </div>
                      </div>

                      <h3
                        className="text-3xl lg:text-4xl font-black mb-4 leading-tight"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        {resource.title}
                      </h3>

                      <p
                        className="text-xl font-semibold mb-4"
                        style={{ color: colorScheme.primary }}
                      >
                        {resource.subtitle}
                      </p>

                      <Caption
                        className="text-base leading-relaxed opacity-80"
                        style={{
                          color: isDarkMode
                            ? colorScheme.textSecondary
                            : '#666',
                        }}
                      >
                        {resource.description}
                      </Caption>
                    </div>

                    <div className="mt-12 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                      <span
                        className="text-lg font-bold uppercase tracking-wider"
                        style={{ color: colorScheme.primary }}
                      >
                        {resource.isLiveService
                          ? 'Get Notified →'
                          : 'Explore →'}
                      </span>
                      <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center group-hover:bg-yellow-400/40 transition-colors">
                        <Sparkles
                          className="w-8 h-8"
                          style={{ color: colorScheme.primary }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Final CTA */}
          <div className="mt-32 text-center">
            <div
              className="inline-block p-12 rounded-3xl relative overflow-hidden"
              style={{
                background: colorScheme.primaryGradient,
                boxShadow: `0 0 120px ${colorScheme.primary}80`,
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <H2 className="text-4xl md:text-6xl font-black text-black mb-6">
                  You Belong Here
                </H2>
                <BodyLG className="text-black/80 text-xl max-w-2xl">
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
