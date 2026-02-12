// src/components/ui/Homepage/Resource.tsx
'use client';

import React, { type ElementType, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Section, Container } from '@/components/layout';
import { Caption, H3, BodySM, SmallText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { resourceLinks } from '@/lib/data';
import { ArrowRight, PlayCircle, Radio } from 'lucide-react';
import type { YouTubeVideo } from '@/lib/types';
import apiClient from '@/lib/api';

type Subscriber = { name: string; email: string };

export default function ResourceSection() {
  const { colorScheme } = useTheme();

  // ✅ avoid re-slicing on every render
  const highlight = resourceLinks.slice(0, 4);

  const [recentVideo, setRecentVideo] = useState<YouTubeVideo | null>(null);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const [subscriber, setSubscriber] = useState<Subscriber>({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchedOnce = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  // Fetch once when section enters viewport
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Fallback: fetch after 1.5s even if observer doesn't fire
  useEffect(() => {
    const timer = setTimeout(() => setShouldFetch(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Actual fetch
  useEffect(() => {
    if (!shouldFetch || fetchedOnce.current) return;

    let mounted = true;

    const fetchRecent = async () => {
      setLoadingRecent(true);
      try {
        // Your internal route that proxies / fetches YouTube
        const res = await fetch('/api/sermons?sort=newest', { cache: 'force-cache' });
        if (!res.ok) return;

        const data: YouTubeVideo[] = await res.json();

        if (mounted) {
          setRecentVideo(data?.[0] ?? null);
          fetchedOnce.current = true;
        }
      } catch {
        // no-op (avoid console spam in prod)
      } finally {
        if (mounted) setLoadingRecent(false);
      }
    };

    fetchRecent();

    return () => {
      mounted = false;
    };
  }, [shouldFetch]);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = subscriber.email.trim();
    const name = subscriber.name.trim();

    if (!email) return;

    setSubmitting(true);
    try {
      await apiClient.subscribe({ name: name || undefined, email });
      setSubscriber({ name: '', email: '' });
    } catch {
      // optional: show toast/modal
    } finally {
      setSubmitting(false);
    }
  };

  const recentVideoThumb =
    recentVideo?.thumbnail ||
    (recentVideo as any)?.thumbnails?.medium?.url ||
    (recentVideo as any)?.thumbnails?.default?.url ||
    '/images/placeholder.jpg';

  const recentVideoUrl = recentVideo?.id
    ? `https://www.youtube.com/watch?v=${recentVideo.id}`
    : null;

  return (
    <Section
      ref={sectionRef}
      id="resources"
      padding="lg"
      className="relative overflow-hidden"
      style={{ background: '#0b0b0b' }}
    >
      <Container size="xl" className="relative z-10 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-3">
            <Caption
              className="uppercase tracking-[0.2em] text-xs"
              style={{ color: colorScheme.primary }}
            >
              Resources & Media
            </Caption>
            <H3 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
              Streams, sermons, events, and pastoral care
            </H3>
            <BodySM className="text-white/75 max-w-3xl">
              Catch up on sermons, join a live service, register for events, or request pastoral moments.
            </BodySM>
          </div>

          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20 hover:bg-white/10"
          >
            View all resources <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
          {/* LEFT: Latest video */}
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#111] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0 to-white/10" />
            <div className="relative flex items-center gap-3 text-white/80 text-sm">
              <span className="h-2 w-2 rounded-full" style={{ background: colorScheme.primary }} />
              Live & on-demand
            </div>

            <div className="relative flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <SmallText className="text-white/70">This week</SmallText>
                <H3 className="text-lg sm:text-xl font-semibold text-white">Latest from YouTube</H3>
                <BodySM className="text-white/70">
                  Stream Sundays & Thursdays. Turn on reminders so you never miss a moment.
                </BodySM>
              </div>

              {/* ✅ FIXED: only ONE ternary (no extra ":(") */}
              {!loadingRecent && recentVideo ? (
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-3 sm:p-4">
                  <div className="flex items-center gap-3 min-h-[88px] sm:min-h-[96px]">
                    <div className="relative h-16 w-24 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img
                        src={recentVideoThumb}
                        alt={recentVideo.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                        <PlayCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <SmallText className="text-white line-clamp-2">{recentVideo.title}</SmallText>
                      <Caption className="text-white/60">
                        {recentVideo.likeCount ? `${recentVideo.likeCount} likes` : 'New upload'}
                      </Caption>
                    </div>

                    {recentVideoUrl ? (
                      <Link
                        href={recentVideoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white text-black text-xs font-semibold hover:scale-[1.04] transition shadow-lg shrink-0"
                      >
                        <PlayCircle className="w-4 h-4" /> Play
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : loadingRecent ? (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <BodySM className="text-white/70">Loading latest message…</BodySM>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white/70 text-sm min-h-[88px] sm:min-h-[96px] flex items-center">
                  Latest message coming soon.
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/resources/sermons"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white text-sm hover:bg-white/10"
                >
                  <PlayCircle className="w-4 h-4" /> Watch now
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-white/70 text-sm">
                <div className="rounded-2xl bg-black/40 border border-white/10 p-3">
                  <div className="text-white font-semibold">Sundays</div>
                  <div>9:00 AM (WAT)</div>
                </div>
                <div className="rounded-2xl bg-black/40 border border-white/10 p-3">
                  <div className="text-white font-semibold">Midweek</div>
                  <div>Thu • 6:00 PM</div>
                </div>
                <div className="rounded-2xl bg-black/40 border border-white/10 p-3">
                  <div className="text-white font-semibold">Replays</div>
                  <div>YouTube + Mixlr archive</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Subscribe */}
          <div className="rounded-3xl border border-white/15 bg-[#111] p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
              <Radio className="w-4 h-4" />
              Live notification
            </div>

            <form className="space-y-2" onSubmit={handleSubscribe}>
              <input
                type="text"
                placeholder="Your name"
                value={subscriber.name}
                onChange={(e) => setSubscriber((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-xl bg-black/60 border border-white/15 text-white px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                value={subscriber.email}
                onChange={(e) => setSubscriber((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-xl bg-black/40 border border-white/15 text-white px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:scale-[1.02] transition disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Notify me when live'} <ArrowRight className="w-4 h-4" />
              </button>
              <Caption className="text-white/60">We only send service reminders and key events.</Caption>
            </form>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlight.map((card) => {
            const Icon = (card.icon as ElementType) || ArrowRight;

            return (
              <Link
                key={card.title}
                href={card.path}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl group"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: card.gradient || 'transparent' }}
                />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-[0.12em]">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: card.glow || colorScheme.primary }}
                    />
                    {card.subtitle}
                  </div>

                  <div className="flex items-center gap-2 text-white">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                      <Icon className="w-5 h-5" />
                    </div>
                    <SmallText weight="bold" className="text-white text-lg">
                      {card.title}
                    </SmallText>
                  </div>

                  <BodySM className="text-white/70 leading-relaxed">{card.description}</BodySM>

                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                    {card.actionText || 'Open'} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
