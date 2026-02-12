'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Play, X } from 'lucide-react';

import { Section, Container } from '@/components/layout';
import { Caption, H3, BodySM, SmallText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { lightShades } from '@/components/colors/colorScheme';
import { EventBannerDesktop } from '@/components/assets';
import { apiClient } from '@/lib/api';
import type { EventPublic, ReelPublic } from '@/lib/apiTypes';

type ShowcaseCategory = 'program' | 'reel';

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

function formatDateLabel(event: EventPublic): string {
  if (event.startAt) {
    const d = new Date(event.startAt);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  const date = event.date?.trim();
  const time = event.time?.trim();
  if (date && time) return `${date} • ${time}`;
  if (date) return date;
  if (time) return time;
  return 'Date to be announced';
}

function eventBadge(event: EventPublic): string {
  const now = new Date();

  if (event.startAt) {
    const start = new Date(event.startAt);
    if (!Number.isNaN(start.getTime())) {
      const end = event.endAt ? new Date(event.endAt) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
      if (now >= start && now <= end) return 'Happening now';
      if (now < start) return 'Upcoming';
      const daysAgo = (now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 90 ? 'Recent' : 'Past';
    }
  }

  if (event.date) {
    const day = new Date(`${event.date}T00:00:00`);
    const today = new Date();
    if (!Number.isNaN(day.getTime())) {
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const eventDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      if (eventDay.getTime() === todayStart.getTime()) return 'Happening now';
      if (eventDay.getTime() > todayStart.getTime()) return 'Upcoming';
      return 'Recent';
    }
  }

  return 'Upcoming';
}

function toProgramSlide(event: EventPublic): Slide {
  const href = event.registerLink || (event.formSlug ? `/forms/${event.formSlug}` : '/events');
  return {
    id: event.id,
    title: event.title,
    subtitle: event.location || 'Program',
    description: event.description || 'Join us for this gathering.',
    date: formatDateLabel(event),
    location: event.location || 'Venue to be announced',
    imageUrl: event.bannerUrl || event.imageUrl || EventBannerDesktop.src,
    cta: 'Register now',
    href,
    badge: eventBadge(event),
    category: 'program',
    start: event.startAt,
    end: event.endAt,
  };
}

function toReelSlide(reel: ReelPublic): Slide {
  const createdAt = reel.createdAt ? new Date(reel.createdAt) : null;
  const dateLabel = createdAt && !Number.isNaN(createdAt.getTime())
    ? createdAt.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
    : 'Latest upload';

  const description = reel.duration
    ? `Short highlight reel (${reel.duration}).`
    : 'Short highlight reel from a recent service.';

  return {
    id: reel.id,
    title: reel.title,
    subtitle: 'Media reel',
    description,
    date: dateLabel,
    location: 'Wisdom House Media',
    imageUrl: reel.thumbnail,
    cta: 'Play reel',
    badge: 'Reel',
    category: 'reel',
    videoUrl: reel.videoUrl,
  };
}

function resolveImageUrl(value?: string): string {
  const trimmed = value?.trim();
  return trimmed || EventBannerDesktop.src;
}

export default function EventsShowcase() {
  const { colorScheme = lightShades } = useTheme();

  const [category, setCategory] = useState<ShowcaseCategory>('program');
  const [active, setActive] = useState(0);
  const [reelModal, setReelModal] = useState<Slide | null>(null);

  const [events, setEvents] = useState<EventPublic[]>([]);
  const [reels, setReels] = useState<ReelPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [eventsRes, reelsRes] = await Promise.allSettled([
          apiClient.listEvents(),
          apiClient.listReels(),
        ]);

        if (!mounted) return;

        if (eventsRes.status === 'fulfilled') {
          setEvents(eventsRes.value);
        } else {
          console.warn('Failed to load events', eventsRes.reason);
        }

        if (reelsRes.status === 'fulfilled') {
          setReels(reelsRes.value);
        } else {
          console.warn('Failed to load reels', reelsRes.reason);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const slides = useMemo(() => {
    return {
      program: events.map(toProgramSlide),
      reel: reels.map(toReelSlide),
    };
  }, [events, reels]);

  const activeSlides = slides[category];
  const current = activeSlides[active];

  useEffect(() => {
    if (active >= activeSlides.length) {
      setActive(0);
    }
  }, [active, activeSlides.length]);

  useEffect(() => {
    if (!activeSlides.length) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

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
          <Caption
            className="uppercase tracking-[0.2em] text-xs"
            style={{ color: colorScheme.primary }}
          >
            Programs & Reels
          </Caption>

          <H3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            What&apos;s happening now
          </H3>

          <BodySM className="text-white/75 max-w-3xl text-sm sm:text-base">
            Live programs and recent reels, powered by your backend data.
          </BodySM>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {(['program', 'reel'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  category === cat
                    ? 'bg-white text-black border-white'
                    : 'border-white/25 text-white hover:bg-white/10'
                }`}
              >
                {cat === 'program' ? 'Programs & Events' : 'Reels'}
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
            {loading ? (
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
                      src={resolveImageUrl(current.imageUrl)}
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

                    <SmallText className="text-white/70 text-sm line-clamp-1">
                      {current.subtitle}
                    </SmallText>

                    <H3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
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

                      {activeSlides.length > 1 && (
                        <button
                          onClick={() =>
                            setActive((prev) => (prev + 1) % Math.max(activeSlides.length, 1))
                          }
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition"
                        >
                          Next <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/60 px-6 text-center">
                {category === 'program'
                  ? 'No approved events available yet.'
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
                      src={resolveImageUrl(slide.imageUrl)}
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
                    poster={resolveImageUrl(reelModal.imageUrl)}
                  >
                    <source src={reelModal.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center">
                    <Play className="w-10 h-10 text-white/70" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
                    <p className="absolute bottom-3 left-4 text-white/70 text-sm">
                      Reel video source is missing.
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
