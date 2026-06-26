'use client';

import React, {
  type ElementType,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Headphones,
  Loader2,
  Mail,
  PlayCircle,
  Radio,
  UserRound,
  Video,
} from 'lucide-react';

import { Container, Section } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';
import { Caption, H3, BodySM, SmallText, BodyMD } from '@/shared/text';
import { resourceLinks } from '@/lib/data';
import type { YouTubeVideo } from '@/lib/types';
import apiClient from '@/lib/api';
import { resolveConfiguredApiOrigin } from '@/lib/apiOrigin';

type Subscriber = {
  name: string;
  email: string;
};

type ResourceLink = {
  title?: string;
  label?: string;
  description?: string;
  href?: string;
  url?: string;
  icon?: ElementType;
};

const API_ORIGIN = resolveConfiguredApiOrigin();
const SERMONS_ENDPOINT = `${API_ORIGIN}/api/v1/sermons?sort=newest`;

const fallbackIcons = [BookOpen, Video, CalendarDays, Headphones, Radio];

function getResourceIcon(item: ResourceLink, index: number): ElementType {
  return item.icon || fallbackIcons[index % fallbackIcons.length];
}

function getResourceTitle(item: ResourceLink) {
  return item.title || item.label || 'Resource';
}

function getResourceHref(item: ResourceLink) {
  return item.href || item.url || '/resources';
}

export default function ResourceSection() {
  const highlight = useMemo(
    () => (resourceLinks as ResourceLink[]).slice(0, 4),
    []
  );

  const [recentVideo, setRecentVideo] = useState<YouTubeVideo | null>(null);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [subscriber, setSubscriber] = useState<Subscriber>({
    name: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const fetchedOnce = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);

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
    const timer = window.setTimeout(() => setShouldFetch(true), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shouldFetch || fetchedOnce.current) return;

    let mounted = true;

    const fetchRecent = async () => {
      setLoadingRecent(true);

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
    setSubmitted(false);

    try {
      await apiClient.subscribe({ name: name || undefined, email });
      setSubscriber({ name: '', email: '' });
      setSubmitted(true);
      window.setTimeout(() => setSubmitted(false), 2800);
    } catch {
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  const recentVideoThumb =
    recentVideo?.thumbnail ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (recentVideo as any)?.thumbnails?.medium?.url ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (recentVideo as any)?.thumbnails?.default?.url ||
    '/images/placeholder.webp';

  const recentVideoUrl = recentVideo?.id
    ? `https://www.youtube.com/watch?v=${recentVideo.id}`
    : null;

  return (
    <Section ref={sectionRef} id="resources" padding="lg" className="bg-white">
      <Container size="xl" className="space-y-8 sm:space-y-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
              Resources & Media
            </p>
            <H3
              className="text-2xl font-semibold leading-tight tracking-tight text-[var(--app-text)] sm:text-3xl lg:text-4xl"
              useThemeColor={false}
            >
              Sermons, events &amp; pastoral care
            </H3>
          </div>

          <Link
            href="/resources"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--app-border)] px-5 py-2.5 text-sm font-semibold text-[var(--app-text)] transition hover:border-[var(--app-primary)]/40 hover:text-[var(--app-primary)]"
          >
            View all resources <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[var(--app-dark)] p-5 sm:p-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/70">
                  <span className="h-2 w-2 rounded-full bg-[var(--app-primary)]" />
                  Live & on-demand
                </div>

                <SmallText className="mt-6 text-white/55" useThemeColor={false}>
                  This week
                </SmallText>

                <H3
                  className="mt-2 text-xl font-semibold text-white sm:text-2xl"
                  useThemeColor={false}
                >
                  Latest from YouTube
                </H3>

                <BodySM
                  className="mt-3 text-sm leading-7 text-white/62 sm:text-base"
                  useThemeColor={false}
                >
                  Stream Sundays & Thursdays. Turn on reminders so you never
                  miss a service, teaching, or special broadcast.
                </BodySM>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-white/68 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  ['Sundays', '9:00 AM WAT'],
                  ['Midweek', 'Thu • 6:00 PM'],
                  ['Replays', 'YouTube archive'],
                ].map(([title, value]) => (
                  <div
                    key={title}
                    className="rounded-lg border border-white/10 bg-white/[0.06] p-3"
                  >
                    <BodySM
                      weight="semibold"
                      className="text-white"
                      useThemeColor={false}
                    >
                      {title}
                    </BodySM>
                    <Caption
                      className="mt-1 text-white/55"
                      useThemeColor={false}
                    >
                      {value}
                    </Caption>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50">
              {loadingRecent ? (
                <div className="flex min-h-[320px] items-center justify-center p-6">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white/70">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading latest message...
                  </div>
                </div>
              ) : recentVideo ? (
                <>
                  <img
                    src={recentVideoThumb}
                    alt={recentVideo.title}
                    className="h-[320px] w-full object-cover sm:h-[360px] lg:h-full"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/88" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-xl">
                      <Radio className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                      Latest message
                    </div>

                    <SmallText
                      className="line-clamp-2 text-base font-semibold leading-snug text-white sm:text-lg"
                      useThemeColor={false}
                    >
                      {recentVideo.title}
                    </SmallText>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {recentVideoUrl && (
                        <Link
                          href={recentVideoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[var(--app-primary)] px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
                        >
                          <PlayCircle className="h-4 w-4" />
                          Play now
                        </Link>
                      )}

                      <Link
                        href="/resources/sermons"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-5 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/[0.12]"
                      >
                        Sermons
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[320px] items-center justify-center p-6 text-center">
                  <div className="max-w-sm">
                    <PlayCircle className="mx-auto h-9 w-9 text-[var(--app-primary)]" />
                    <BodySM className="mt-4 text-white/62">
                      Latest message coming soon.
                    </BodySM>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {highlight.map((item, index) => {
                const Icon = getResourceIcon(item, index);
                const title = getResourceTitle(item);
                const href = getResourceHref(item);

                return (
                  <Link
                    key={`${title}-${index}`}
                    href={href}
                    className="group flex items-center gap-4 rounded-xl border border-[var(--app-border)] p-4 transition duration-200 hover:border-[var(--app-primary)]/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <SmallText
                        weight="bold"
                        className="line-clamp-1 text-[var(--app-text)]"
                        useThemeColor={false}
                      >
                        {title}
                      </SmallText>

                      <Caption
                        className="mt-0.5 line-clamp-1 text-[0.8rem] leading-5 text-[var(--app-muted)]"
                        useThemeColor={false}
                      >
                        {item.description ||
                          'Explore this resource from Wisdom House.'}
                      </Caption>
                    </div>

                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--app-subtle)] transition group-hover:translate-x-1 group-hover:text-[var(--app-primary)]" />
                  </Link>
                );
              })}
            </div>

            <form
              onSubmit={handleSubscribe}
              className="rounded-xl border border-[var(--app-border)] p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
                  <Bell className="h-5 w-5" />
                </div>

                <div>
                  <SmallText
                    weight="bold"
                    className="text-[var(--app-text)]"
                    useThemeColor={false}
                  >
                    Service reminders
                  </SmallText>
                  <Caption
                    className="mt-0.5 text-[0.8rem] leading-5 text-[var(--app-muted)]"
                    useThemeColor={false}
                  >
                    Get updates for sermons, live streams, and special programs.
                  </Caption>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-subtle)]" />
                  <input
                    value={subscriber.name}
                    onChange={e =>
                      setSubscriber(prev => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Your name (optional)"
                    className="h-11 w-full rounded-lg border border-[var(--app-border)] bg-white pl-10 pr-4 text-sm text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-subtle)] focus:border-[var(--app-primary)]/60 focus:ring-2 focus:ring-[var(--app-primary)]/10"
                  />
                </div>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-subtle)]" />
                  <input
                    value={subscriber.email}
                    onChange={e =>
                      setSubscriber(prev => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Email address"
                    type="email"
                    required
                    className="h-11 w-full rounded-lg border border-[var(--app-border)] bg-white pl-10 pr-4 text-sm text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-subtle)] focus:border-[var(--app-primary)]/60 focus:ring-2 focus:ring-[var(--app-primary)]/10"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  curvature="lg"
                  disabled={submitting}
                  className="h-12 w-full disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : submitted ? (
                    <>
                      Subscribed
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
