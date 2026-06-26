'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Heart,
  Loader2,
  PlayCircle,
  ShoppingBag,
} from 'lucide-react';

import { Container, Section } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';
import { apiClient } from '@/lib/api';
import type { YouTubeVideo } from '@/lib/types';
import { resolveConfiguredApiOrigin } from '@/lib/apiOrigin';

const API_ORIGIN = resolveConfiguredApiOrigin();
const SERMONS_ENDPOINT = `${API_ORIGIN}/api/v1/sermons?sort=newest`;

const MORE_RESOURCES = [
  {
    title: 'Sermons',
    label: 'Messages',
    desc: 'Watch and listen to messages straight from the house.',
    href: '/resources/sermons',
    cta: 'Browse sermons',
    img: '/images/conference-2025.webp',
    icon: BookOpen,
  },
  {
    title: 'Pastoral Care',
    label: 'Support',
    desc: 'Reach out for prayer, counselling, and pastoral guidance.',
    href: '/pastoral',
    cta: 'Request care',
    img: '/images/supernatural-service.webp',
    icon: Heart,
  },
  {
    title: 'Store',
    label: 'Resources',
    desc: 'Books, materials, and resources to deepen your faith.',
    href: '/resources/store',
    cta: 'Visit store',
    img: '/images/christmas-eve.webp',
    icon: ShoppingBag,
  },
];

type Subscriber = { name: string; email: string };

export default function ResourceSection() {
  const [recentVideo, setRecentVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriber, setSubscriber] = useState<Subscriber>({
    name: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const fetchedOnce = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Lazy-load only when in viewport
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setShouldFetch(true), 1600);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!shouldFetch || fetchedOnce.current) return;
    let mounted = true;

    const fetchRecent = async () => {
      try {
        const res = await fetch(SERMONS_ENDPOINT, {
          method: 'GET',
          cache: 'no-store',
          credentials: 'omit',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) return;
        const payload = await res.json();
        const data: YouTubeVideo[] = payload?.data ?? payload;
        if (mounted) {
          setRecentVideo(Array.isArray(data) ? (data[0] ?? null) : null);
          fetchedOnce.current = true;
        }
      } catch {
        if (mounted) setRecentVideo(null);
      } finally {
        if (mounted) setLoading(false);
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
    if (!email) return;
    setSubmitting(true);
    try {
      await apiClient.subscribe({
        name: subscriber.name.trim() || undefined,
        email,
      });
      setSubscriber({ name: '', email: '' });
      setSubmitted(true);
      window.setTimeout(() => setSubmitted(false), 2800);
    } catch {
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thumb =
    recentVideo?.thumbnail ||
    (recentVideo as any)?.thumbnails?.medium?.url ||
    '/images/placeholder.webp';
  const videoUrl = recentVideo?.id
    ? `https://www.youtube.com/watch?v=${recentVideo.id}`
    : null;

  return (
    <Section
      ref={sectionRef}
      id="resources"
      padding="none"
      className="bg-[var(--app-canvas)]"
    >
      <Container size="xl" className="py-section-md">
        {/* ── Section header ───────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Latest Message
            </p>
            <h2
              className="font-headline font-normal text-[var(--app-ink)]"
              style={{ fontSize: 'var(--type-display-sm)' }}
            >
              Fresh from the house
            </h2>
          </div>
          <Link
            href="/resources/sermons"
            className="group inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-[var(--app-primary)] transition"
          >
            All sermons
            <span className="transition duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* ── Layout ───────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left — content */}
          <div className="flex flex-col">
            <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--app-ink)]/35">
              Sundays 9:00 AM · Thursdays 6:00 PM
            </p>

            {loading ? (
              <div className="flex h-24 items-center gap-3 text-sm text-[var(--app-ink)]/40">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading latest message…
              </div>
            ) : recentVideo ? (
              <>
                <h3
                  className="font-headline font-normal leading-snug text-[var(--app-ink)]"
                  style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}
                >
                  {recentVideo.title}
                </h3>
                <p className="mt-2 text-[0.82rem] text-[var(--app-ink)]/50">
                  The Wisdom Church
                </p>
              </>
            ) : (
              <h3 className="font-headline text-[1.5rem] font-normal text-[var(--app-ink)]/40">
                Message coming soon
              </h3>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {videoUrl ? (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center gap-2 bg-[var(--app-primary)] px-7 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-[#0d0a06] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
                  style={{ borderRadius: 'var(--radius-button)' }}
                >
                  <PlayCircle className="h-4 w-4" />
                  Watch now
                </a>
              ) : null}
              <Link
                href="/resources/sermons"
                className="inline-flex h-12 items-center gap-2 border border-[var(--app-ink)]/20 px-7 text-[0.8rem] font-semibold text-[var(--app-ink)] transition hover:border-[var(--app-ink)]/40 active:scale-[0.98]"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                All sermons <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Subscribe form */}
            <form onSubmit={handleSubscribe} className="mt-10 max-w-[380px]">
              <p className="mb-3 text-[0.72rem] font-semibold text-[var(--app-ink)]/50">
                Get service reminders in your inbox
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={subscriber.email}
                  onChange={e =>
                    setSubscriber(p => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email address"
                  className="h-11 flex-1 border border-[var(--app-ink)]/15 bg-white px-4 text-sm text-[var(--app-ink)] outline-none placeholder:text-[var(--app-ink)]/30 focus:border-[var(--app-primary)]/60 focus:ring-2 focus:ring-[var(--app-primary)]/10"
                  style={{ borderRadius: 'var(--radius-input)' }}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  className="h-11 px-5 text-[0.78rem]"
                  style={{ borderRadius: 'var(--radius-button)' }}
                >
                  {submitting ? 'Sending…' : submitted ? '✓ Done' : 'Subscribe'}
                </Button>
              </div>
            </form>
          </div>

          {/* Right — video thumbnail */}
          <div
            className="relative aspect-video w-full overflow-hidden bg-[var(--app-ink)]/8 shadow-xl"
            style={{ borderRadius: 'var(--radius-card)' }}
          >
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--app-ink)]/20" />
              </div>
            ) : recentVideo ? (
              <>
                <img
                  src={thumb}
                  alt={recentVideo.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20" />
                {videoUrl ? (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label={`Watch ${recentVideo.title}`}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-2xl transition duration-300 hover:scale-[1.06] hover:bg-white">
                      <PlayCircle className="h-7 w-7 text-[var(--app-ink)]" />
                    </div>
                  </a>
                ) : null}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                <PlayCircle className="h-10 w-10 text-[var(--app-ink)]/20" />
                <p className="text-sm text-[var(--app-ink)]/30">
                  Latest message coming soon
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── You can do more ──────────────────────────────── */}
        <div className="mt-16 border-t border-[var(--app-ink)]/8 pt-14">
          <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Explore
              </p>
              <h3
                className="font-headline font-normal text-[var(--app-ink)]"
                style={{ fontSize: 'var(--type-display-sm)' }}
              >
                You can do more
              </h3>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {MORE_RESOURCES.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative flex min-h-[240px] flex-col justify-end overflow-hidden bg-[var(--app-ink)]/8"
                  style={{ borderRadius: 'var(--radius-card)' }}
                >
                  {/* Background image */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/35 to-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent transition-opacity duration-300 group-hover:bg-black/10" />

                  {/* Icon chip — top right */}
                  <div
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center bg-white/10 backdrop-blur-sm transition duration-300 group-hover:bg-[var(--app-primary)]/80"
                    style={{ borderRadius: 'var(--radius-badge)' }}
                  >
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6">
                    <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                      {item.label}
                    </p>
                    <p className="mt-1.5 font-headline text-[1.25rem] font-normal leading-snug text-white">
                      {item.title}
                    </p>
                    <p className="mt-1.5 font-ui text-[0.78rem] leading-[1.6] text-white/60">
                      {item.desc}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-ui text-[0.72rem] font-semibold text-[var(--app-primary)] transition-all duration-200 group-hover:gap-2.5">
                      {item.cta}{' '}
                      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
