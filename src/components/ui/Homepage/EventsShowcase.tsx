// components/ui/Homepage/EventsShowcase.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, Container } from '@/components/layout';
import { Caption, H3, BodySM, SmallText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { lightShades } from '@/components/colors/colorScheme';
import { ArrowRight, Calendar, MapPin, Play, X } from 'lucide-react';
import { NL, hero_bg_1, hero_bg_2, hero_bg_3 } from '@/components/assets';
import HeaderAlt from '../../../../public/HEADER 2.jpg.jpeg';
import { apiClient } from '@/lib/api';
import type { EventItem } from '@/lib/types';

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  location: string;
  image: any;
  cta?: string;
  href?: string;
  badge: string;
  category: 'program' | 'media' | 'reel';
  start?: string; // ISO
  end?: string; // ISO
  videoUrl?: string;
};

export default function EventsShowcase() {
  const { colorScheme = lightShades } = useTheme();
  const slides: Slide[] = useMemo(
    () => [


      {
        title: 'Wisdom Power Conference 26',
        subtitle: 'Upcoming',
        description:
          'City-wide gathering with worship, word, and miracles. Come expectant.',
        date: 'Mar 10 • 6:00 PM',
        location: 'Honor Gardens Event Center, Alasia opp. dominion Church',
        image: HeaderAlt,
        cta: 'Save a seat',
        href: '/events',
        badge: 'Upcoming',
        category: 'program',
        start: '2025-03-10T18:00:00.000Z',
        end: '2025-03-10T21:00:00.000Z',
      },
      {
        title: 'Highlights & Reels',
        subtitle: 'Media',
        description:
          'Watch quick reels from recent services and events—perfect for sharing.',
        date: 'Updated weekly',
        location: 'Media Team',
        image: hero_bg_3,
        cta: 'Watch reels',
        href: '/resources/sermons',
        badge: 'Reels',
        category: 'reel',
        videoUrl: '',
      },
      {
        title: 'Media Stories',
        subtitle: 'Media',
        description:
          'Short testimonies, sermon snippets, and behind-the-scenes moments.',
        date: 'New drops every week',
        location: 'Content Hub',
        image: hero_bg_1,
        cta: 'View media',
        href: '/resources',
        badge: 'Media',
        category: 'media',
        start: '2025-02-01T10:00:00.000Z',
        end: '2025-02-01T12:00:00.000Z',
      },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const [category, setCategory] = useState<'program' | 'media' | 'reel'>(
    'program'
  );
  const [reelModal, setReelModal] = useState<Slide | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  const filteredSlides = slides.filter(slide => slide.category === category);

  const statusOf = (slide: Slide) => {
    if (!slide.start || !slide.end) return slide.badge;
    const now = new Date();
    const start = new Date(slide.start);
    const end = new Date(slide.end);
    if (now >= start && now <= end) return 'Happening now';
    if (now < start) return 'Upcoming';
    const daysAgo = (now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 90 ? 'Recent' : 'Past';
  };

  useEffect(() => {
    if (active >= filteredSlides.length) {
      setActive(0);
    }
  }, [category, filteredSlides.length, active]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % Math.max(filteredSlides.length, 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [filteredSlides.length]);

  useEffect(() => {
    let mounted = true;
    const loadEvents = async () => {
      try {
        const data = await apiClient.getEvents({ limit: 5 });
        if (mounted && Array.isArray(data) && data.length) {
          setEvents(data);
        }
      } catch (err) {
        console.warn('Failed to load events', err);
      } finally {
        if (mounted) setEventsLoaded(true);
      }
    };
    loadEvents();
    return () => {
      mounted = false;
    };
  }, []);

  const programList =
    eventsLoaded && events.length && category === 'program'
      ? events.map(evt => ({
          title: evt.title,
          subtitle: evt.status || 'Upcoming',
          description: evt.description || '',
          date:
            evt.startDate || evt.endDate
              ? new Date(evt.startDate || evt.endDate || '').toLocaleString()
              : '',
          location: evt.location || '',
          image: evt.bannerUrl || HeaderAlt,
          cta: evt.ctaLabel || 'Save a seat',
          href: evt.ctaTarget || '/events',
          badge: evt.status || 'Upcoming',
          category: 'program' as const,
        }))
      : filteredSlides;

  const current = programList[active];

  return (
    <Section
      padding="lg"
      className="relative overflow-hidden"
      style={{
        background: '#0a0a0a',
      }}
    >
      <Container size="xl" className="relative z-10 space-y-6">
        <div className="flex flex-col gap-2">
          <Caption className="uppercase tracking-[0.2em] text-xs" style={{ color: colorScheme.primary }}>
            Programs & Media
          </Caption>
          <H3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            What’s happening now
          </H3>
          <BodySM className="text-white/75 max-w-3xl">
            Announcements, events, and reels in one place—swipe through the highlights.
          </BodySM>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {(['program', 'media', 'reel'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  category === cat
                    ? 'bg-white text-black border-white'
                    : 'border-white/25 text-white hover:bg-white/10'
                }`}
              >
                {cat === 'program' ? 'Programs & Events' : cat === 'media' ? 'Media' : 'Reels'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 items-stretch">
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#111] shadow-2xl min-h-[300px]">
            {current ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0">
                    {current.category === 'reel' ? (
                      <div className="w-full h-full relative">
                        <Image
                          src={current.image}
                          alt={current.title}
                          fill
                          className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <button
                            onClick={() => setReelModal(current)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:scale-[1.02] transition shadow-lg"
                          >
                            <Play className="w-4 h-4" /> Play reel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={current.image}
                        alt={current.title}
                        fill
                        className="object-cover object-center"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
                  <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8 lg:px-10 gap-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-black" style={{ background: colorScheme.primary }}>
                      {statusOf(current)}
                    </div>
                    <SmallText className="text-white/70">{current.subtitle}</SmallText>
                    <H3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                      {current.title}
                    </H3>
                    <BodySM className="text-white/80">{current.description}</BodySM>
                    <div className="flex flex-wrap gap-3 text-white/80 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-300" />
                        <span>{current.date}</span>
                      </div>
                      {current.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-amber-300" />
                          <span>{current.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 pt-2">
                      {current.href && (
                        <a
                          href={current.href}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:scale-[1.02] transition"
                        >
                          {current.cta || 'Open'} <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => setActive(prev => (prev + 1) % Math.max(filteredSlides.length, 1))}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition"
                      >
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/60">
                No items in this category yet.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {programList.map((slide, idx) => (
              <button
                key={`${slide.title}-${idx}`}
                onClick={() => setActive(idx)}
                className={`relative overflow-hidden rounded-2xl border border-white/15 p-4 text-left transition-transform duration-200 ${
                  idx === active ? 'bg-[#161616] shadow-xl' : 'bg-[#0f0f0f]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/15">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-1 left-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-black" style={{ background: colorScheme.primary }}>
                      {slide.badge}
                    </div>
                  </div>
                  <div className="flex-1">
                    <SmallText weight="bold" className="text-white">
                      {slide.title}
                    </SmallText>
                    <Caption className="text-white/60 line-clamp-2">{slide.description}</Caption>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </Container>

      {/* Reel modal/player */}
      <AnimatePresence>
        {reelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReelModal(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#0f0f0f] p-4 sm:p-6 shadow-2xl text-white"
            >
              <button
                onClick={() => setReelModal(null)}
                className="absolute right-4 top-4 text-white/70 hover:text-white"
                aria-label="Close reel"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="space-y-2 pr-8">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Reel</p>
                <h3 className="text-2xl font-black">{reelModal.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{reelModal.description}</p>
              </div>
              <div className="mt-4">
                {reelModal.videoUrl ? (
                  <video
                    controls
                    className="w-full rounded-2xl border border-white/10 bg-black"
                    poster={reelModal.image?.src}
                  >
                    <source src={reelModal.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center">
                    <Play className="w-10 h-10 text-white/70" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
                    <p className="absolute bottom-3 left-4 text-white/70 text-sm">
                      Upload reels media to enable playback.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
