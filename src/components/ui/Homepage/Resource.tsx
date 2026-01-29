// components/ui/Homepage/Resource.tsx
'use client';

import React, { type ElementType, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Section, Container } from '@/components/layout';
import { Caption, H3, BodySM, SmallText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { resourceLinks } from '@/lib/data';
import { ArrowRight, PlayCircle, Radio } from 'lucide-react';
import type { YouTubeVideo } from '@/lib/types';
import { apiClient } from '@/lib/api';

export default function ResourceSection() {
  const { colorScheme } = useTheme();
  const highlight = resourceLinks.slice(0, 4);
  const [recentVideo, setRecentVideo] = useState<YouTubeVideo | null>(null);
  const [subscriber, setSubscriber] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (fetchedOnce.current) return;
    let mounted = true;
    const cached = sessionStorage.getItem('recent_video');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as YouTubeVideo;
        setRecentVideo(parsed);
        fetchedOnce.current = true;
        return;
      } catch {
        // fallback to network
      }
    }
    const fetchRecent = async () => {
      try {
        const res = await fetch('/api/sermons?sort=newest', { cache: 'force-cache' });
        if (!res.ok) return;
        const data: YouTubeVideo[] = await res.json();
        if (mounted && data.length > 0) {
          setRecentVideo(data[0]);
          sessionStorage.setItem('recent_video', JSON.stringify(data[0]));
          fetchedOnce.current = true;
        }
      } catch (err) {
        console.warn('Failed to fetch recent YouTube video', err);
      }
    };
    fetchRecent();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriber.email) return;
    setSubmitting(true);
    try {
      await apiClient.subscribe(subscriber);
      setSubscriber({ name: '', email: '' });
    } catch (err) {
      console.warn('Subscribe failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section
      id="resources"
      padding="lg"
      className="relative overflow-hidden"
      style={{
        background: '#0b0b0b',
      }}
    >
      <Container size="xl" className="relative z-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-3">
            <Caption className="uppercase tracking-[0.2em] text-xs" style={{ color: colorScheme.primary }}>
              Resources & Media
            </Caption>
            <H3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
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
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#111] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0 to-white/10" />
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <span className="h-2 w-2 rounded-full" style={{ background: colorScheme.primary }} />
              Live & on-demand
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <SmallText className="text-white/70">This week</SmallText>
                <H3 className="text-xl sm:text-2xl font-bold text-white">
                  Latest from YouTube
                </H3>
                <BodySM className="text-white/70">
                  Stream Sundays & Thursdays. Turn on reminders so you never miss a moment.
                </BodySM>
              </div>
              {recentVideo && (
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      recentVideo.thumbnail ||
                      (recentVideo as any)?.thumbnails?.medium?.url ||
                      (recentVideo as any)?.thumbnails?.default?.url ||
                      '/images/placeholder.jpg'
                    }
                    alt={recentVideo.title}
                    className="w-full h-36 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Link
                      href={`https://www.youtube.com/watch?v=${recentVideo.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:scale-[1.04] transition shadow-lg"
                    >
                      <PlayCircle className="w-4 h-4" /> Play latest message
                    </Link>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    <SmallText className="text-white line-clamp-2">
                      {recentVideo.title}
                    </SmallText>
                    <Caption className="text-white/70">
                      {recentVideo.likeCount ? `${recentVideo.likeCount} likes` : 'New upload'}
                    </Caption>
                  </div>
                </div>
              )}
                <div className="flex flex-wrap gap-2">
                  <Link href="/resources/sermons">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white text-sm hover:bg-white/10">
                      <PlayCircle className="w-4 h-4" /> Watch now
                    </button>
                  </Link>
                </div>
              <div className="grid grid-cols-3 gap-3 text-white/70 text-sm">
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
                onChange={e => setSubscriber({ ...subscriber, name: e.target.value })}
                className="w-full rounded-xl bg-black/60 border border-white/15 text-white px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                value={subscriber.email}
                onChange={e => setSubscriber({ ...subscriber, email: e.target.value })}
                className="w-full rounded-xl bg-black/40 border border-white/15 text-white px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:scale-[1.02] transition disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Notify me when live'} <ArrowRight className="w-4 h-4" />
              </button>
              <Caption className="text-white/60">
                We only send service reminders and key events.
              </Caption>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlight.map(card => {
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
                    <span className="h-2 w-2 rounded-full" style={{ background: card.glow || colorScheme.primary }} />
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
