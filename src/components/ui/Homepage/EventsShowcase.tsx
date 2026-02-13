'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Play } from 'lucide-react';

import { BaseModal } from '@/components/modal/Base';
import { hero_bg_1, hero_bg_3, EventBannerDesktop } from '@/components/assets';
import { lightShades } from '@/components/colors/colorScheme';
import { useTheme } from '@/components/contexts/ThemeContext';
import { Container, Section } from '@/components/layout';
import { BodySM, Caption, H3, SmallText } from '@/components/text';
import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';

type ShowcaseCategory = 'program' | 'media' | 'reel';

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  cta: string;
  href?: string;
  badge: string;
  category: ShowcaseCategory;
  start?: string;
  end?: string;
  videoUrl?: string;
};

const STATIC_SLIDES: Slide[] = [
  {
    id: 'wpc-2026',
    title: 'Wisdom Power Conference 2026',
    subtitle: 'Upcoming',
    description: 'City-wide gathering with worship, word, and miracles. Come expectant.',
    date: 'March 20, 2026 • 6:00 PM',
    location: 'Honor Gardens Event Center',
    imageUrl: EventBannerDesktop.src,
    cta: 'Save a seat',
    href: '/events',
    badge: 'Upcoming',
    category: 'program',
    start: '2026-03-20T18:00:00.000Z',
    end: '2026-03-22T20:00:00.000Z',
  },
  {
    id: 'media-stories',
    title: 'Media Stories',
    subtitle: 'Media',
    description: 'Short testimonies, sermon clips, and behind-the-scenes moments.',
    date: 'Updated weekly',
    location: 'Content Hub',
    imageUrl: hero_bg_1.src,
    cta: 'View media',
    href: '/resources',
    badge: 'Media',
    category: 'media',
  },
  {
    id: 'highlights-reels',
    title: 'Highlights & Reels',
    subtitle: 'Reels',
    description: 'Watch quick reels from recent services and events.',
    date: 'Updated weekly',
    location: 'Media Team',
    imageUrl: hero_bg_3.src,
    cta: 'Watch reels',
    href: '/resources/sermons',
    badge: 'Reel',
    category: 'reel',
  },
];

const CATEGORY_LABELS: Record<ShowcaseCategory, string> = {
  program: 'Programs & Events',
  media: 'Media',
  reel: 'Reels',
};

function formatEventDate(startAt?: string): string {
  if (!startAt) return 'Date to be announced';
  const parsed = new Date(startAt);
  if (Number.isNaN(parsed.getTime())) return 'Date to be announced';

  return parsed.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusFromRange(startAt?: string, endAt?: string): string {
  if (!startAt) return 'Upcoming';

  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) return 'Upcoming';

  const end = endAt ? new Date(endAt) : null;
  const now = Date.now();
  const startTime = start.getTime();
  const endTime = end && !Number.isNaN(end.getTime()) ? end.getTime() : startTime;

  if (now >= startTime && now <= endTime) return 'Happening now';
  if (now < startTime) return 'Upcoming';

  const daysAgo = (now - endTime) / (1000 * 60 * 60 * 24);
  return daysAgo <= 90 ? 'Recent' : 'Past';
}

export default function EventsShowcase() {
  const { colorScheme = lightShades } = useTheme();

  const [category, setCategory] = useState<ShowcaseCategory>('program');
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [reelModal, setReelModal] = useState<Slide | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadEvents = async () => {
      try {
        const data = await apiClient.listEvents();
        if (mounted) {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.warn('Failed to load events showcase', error);
        if (mounted) {
          setEvents([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadEvents();
    return () => {
      mounted = false;
    };
  }, []);

  const programSlides = useMemo<Slide[]>(() => {
    if (!events.length) {
      return STATIC_SLIDES.filter((slide) => slide.category === 'program');
    }

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      subtitle: statusFromRange(event.startAt, event.endAt),
      description: event.description || 'Join us for this gathering.',
      date: formatEventDate(event.startAt),
      location: event.location || 'Venue to be announced',
      imageUrl: event.bannerUrl || event.imageUrl || EventBannerDesktop.src,
      cta: 'Save a seat',
      href: event.formSlug ? `/forms/${event.formSlug}` : '/events',
      badge: statusFromRange(event.startAt, event.endAt),
      category: 'program',
      start: event.startAt,
      end: event.endAt,
    }));
  }, [events]);

  const activeSlides = useMemo<Slide[]>(() => {
    if (category === 'program') return programSlides;
    return STATIC_SLIDES.filter((slide) => slide.category === category);
  }, [category, programSlides]);

  useEffect(() => {
    if (activeSlides.length === 0) {
      setActive(0);
      return;
    }

    if (active >= activeSlides.length) {
      setActive(0);
    }
  }, [active, activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % activeSlides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [activeSlides.length]);

  const current = activeSlides[active];

  return (
    <Section padding="md" className="relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 12% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.06) 0%, transparent 35%), radial-gradient(circle at 60% 90%, rgba(255,255,255,0.05) 0%, transparent 40%)',
          filter: 'blur(70px)',
        }}
        data-parallax-global="0.25"
      />

      <Container size="xl" className="relative z-10 space-y-5">
        <div className="flex flex-col gap-1.5">
          <Caption className="uppercase tracking-[0.2em] text-xs" style={{ color: colorScheme.primary }}>
            Programs & Media
          </Caption>

          <H3 className="text-xl sm:text-2xl font-semibold text-white leading-tight">What&apos;s happening now</H3>

          <BodySM className="text-white/75 max-w-3xl text-sm sm:text-base">
            Live programs and recent reels, powered by your backend data.
          </BodySM>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {(Object.keys(CATEGORY_LABELS) as ShowcaseCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  category === cat
                    ? 'bg-white text-black border-white'
                    : 'border-white/25 text-white hover:bg-white/10'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-3 sm:gap-4 items-stretch">
          <div
            className="
              relative overflow-hidden rounded-3xl border border-white/15 bg-[#111] shadow-2xl
              h-[420px] sm:h-[480px] lg:h-auto
              lg:aspect-[16/9] lg:min-h-[340px]
            "
          >
            {loading && category === 'program' ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              </div>
            ) : current ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${current.id}-${category}-${active}`}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0" data-parallax-global="0.2">
                    <img
                      src={current.imageUrl}
                      alt={current.title}
                      className="h-full w-full object-cover"
                    />

                    {current.category === 'reel' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <button
                          onClick={() => setReelModal(current)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:scale-[1.02] transition shadow-lg"
                        >
                          <Play className="w-4 h-4" /> Play reel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/25" data-parallax-global="0.12" />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/25 lg:bg-gradient-to-r lg:from-black/88 lg:via-black/68 lg:to-black/45"
                    data-parallax-global="0.08"
                  />

                  <div
                    className="
                      absolute inset-0 flex flex-col justify-end lg:justify-center
                      px-4 py-5 sm:px-7 sm:py-6 lg:px-10
                      gap-2.5 sm:gap-3
                      max-w-none lg:max-w-2xl
                    "
                  >
                    <div
                      className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{
                        background: 'rgba(255,255,255,0.14)',
                        border: '1px solid rgba(255,255,255,0.18)',
                      }}
                    >
                      {current.badge}
                    </div>

                    <SmallText className="text-white/70 text-sm line-clamp-1">{current.subtitle}</SmallText>

                    <H3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight">
                      {current.title}
                    </H3>

                    <BodySM className="text-white/80 text-sm sm:text-base line-clamp-3 sm:line-clamp-4">
                      {current.description}
                    </BodySM>

                    <div className="flex flex-wrap gap-2.5 text-white/80 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-300" />
                        <span className="line-clamp-1">{current.date}</span>
                      </div>

                      {current.location && (
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                          <span className="truncate">{current.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2.5 sm:gap-3 pt-1.5 flex-wrap">
                      {current.category === 'reel' ? (
                        <button
                          onClick={() => setReelModal(current)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:scale-[1.02] transition"
                        >
                          {current.cta} <Play className="w-4 h-4" />
                        </button>
                      ) : (
                        current.href && (
                          <a
                            href={current.href}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:scale-[1.02] transition"
                          >
                            {current.cta} <ArrowRight className="w-4 h-4" />
                          </a>
                        )
                      )}

                      <button
                        onClick={() =>
                          setActive((prev) => (prev + 1) % Math.max(activeSlides.length, 1))
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition"
                      >
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/60 px-6 text-center">
                {category === 'program'
                  ? 'No approved events available yet.'
                  : category === 'media'
                    ? 'No media stories available yet.'
                    : 'No reels available yet.'}
              </div>
            )}
          </div>

          <div
            className="
              flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1
              lg:grid lg:grid-cols-1 lg:gap-2.5 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0
              scroll-smooth
            "
          >
            {activeSlides.map((slide, idx) => (
              <button
                key={`${slide.id}-${idx}`}
                onClick={() => setActive(idx)}
                className={`
                  relative overflow-hidden rounded-2xl border border-white/15 p-3.5 sm:p-4 text-left
                  transition-transform duration-200
                  ${idx === active ? 'bg-[#161616] shadow-xl' : 'bg-[#0f0f0f]'}
                  min-w-[280px] sm:min-w-[340px] lg:min-w-0
                `}
                data-parallax-global={idx % 2 === 0 ? '0.12' : '0.18'}
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="relative w-16 sm:w-20 aspect-[4/3] rounded-xl overflow-hidden border border-white/15 shrink-0">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div
                      className="absolute bottom-1 left-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                      style={{
                        background: 'rgba(255,255,255,0.16)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {slide.badge}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <SmallText weight="bold" className="text-white truncate">
                      {slide.title}
                    </SmallText>
                    <Caption className="text-white/60 line-clamp-2">{slide.description}</Caption>
                  </div>

                  <ArrowRight className="w-4 h-4 text-white/50 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </Container>

      {reelModal && (
        <BaseModal
          isOpen={Boolean(reelModal)}
          onClose={() => setReelModal(null)}
          title={reelModal.title}
          subtitle={reelModal.description}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">Reel</p>
            {reelModal.videoUrl ? (
              <video
                controls
                className="w-full rounded-2xl border border-white/10 bg-black"
                poster={reelModal.imageUrl}
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
        </BaseModal>
      )}
    </Section>
  );
}
