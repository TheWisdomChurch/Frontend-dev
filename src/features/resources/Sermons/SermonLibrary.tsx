'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock3,
  Headphones,
  Play,
  Search,
  X,
} from 'lucide-react';

import type { SermonDiscovery, YouTubeVideo } from '@/domain/media/types';
import SiteHero from '@/features/hero/SiteHero';
import { Media } from '@/shared/ui/Media';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { useChurchAnalytics } from '@/shared/analytics/churchAnalytics';
import { decodeHtmlEntities } from '@/shared/utils/functionUtils/decodeHtmlEntities';
import { cleanSermonTitle } from '@/shared/utils/functionUtils/cleanSermonTitle';
import YouTubePlayer from './YoutubePlayer';
import {
  Container,
  SectionEmpty,
  Panel,
  Section,
  fieldClass,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';

/** Sermon titles arrive as uploaded to YouTube — entity-encoded and often
 * "{Title} | {Church Name} | {Date}". Every user-facing heading in this
 * file should go through this so the same message reads identically
 * whether it's a card, the "now playing" heading, or the homepage. */
function displayTitle(rawTitle: string): string {
  return cleanSermonTitle(decodeHtmlEntities(rawTitle));
}

type Sort = 'recommended' | 'newest' | 'popular';
type HistoryItem = { id: string; watchedAt: number };
const HISTORY_KEY = 'wisdom-sermon-history-v1';
const value = (raw: string) => Number(raw.replace(/\D/g, '')) || 0;
const time = (raw: string) => new Date(raw).getTime() || 0;
const date = (raw: string) =>
  new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(raw));

function readSearchParam(name: string, fallback = ''): string {
  if (typeof window === 'undefined') return fallback;
  return new URLSearchParams(window.location.search).get(name) || fallback;
}

function readHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]');
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is HistoryItem =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        typeof item.watchedAt === 'number'
    );
  } catch {
    return [];
  }
}

function SermonCard({
  sermon,
  onPlay,
  compact = false,
}: {
  sermon: YouTubeVideo;
  onPlay: () => void;
  compact?: boolean;
}) {
  return (
    <article className="group min-w-0">
      <button type="button" onClick={onPlay} className="block w-full text-left">
        <div
          className={`relative overflow-hidden bg-[var(--app-dark-3)] ${compact ? 'aspect-[16/10]' : 'aspect-video'}`}
        >
          <Media
            src={sermon.thumbnail}
            alt=""
            sizes="(max-width:640px) 88vw, (max-width:1024px) 44vw, 25vw"
            className="transition duration-700 ease-out group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-xl transition group-hover:scale-110">
            <Play className="h-4 w-4 fill-current" />
          </span>
          {sermon.duration && (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/75 px-2.5 py-1 font-ui text-caption font-bold text-white backdrop-blur">
              {sermon.duration}
            </span>
          )}
        </div>
        <p className="mt-4 truncate font-ui text-eyebrow font-bold uppercase tracking-[.19em] text-[var(--app-primary-dark)]">
          {sermon.series || 'Wisdom teaching'}
        </p>
        <h3 className="mt-2 line-clamp-2 font-ui text-heading-sm font-semibold leading-[1.25] text-[var(--app-ink)] transition group-hover:text-[var(--app-primary-dark)]">
          {displayTitle(sermon.title)}
        </h3>
        <p className="mt-2 truncate font-ui text-xs text-black/48">
          {sermon.preacher} · {date(sermon.publishedAt)}
        </p>
      </button>
    </article>
  );
}

function Rail({
  title,
  note,
  sermons,
  onPlay,
}: {
  title: string;
  note: string;
  sermons: YouTubeVideo[];
  onPlay: (item: YouTubeVideo) => void;
}) {
  if (!sermons.length) return null;
  return (
    <section className="border-t border-black/10 py-section-xs">
      <div className="mb-7 flex items-end justify-between gap-5">
        <div>
          <h2 className="font-ui text-heading-md font-semibold tracking-[-0.02em] text-[var(--app-ink)] sm:text-heading-lg">
            {title}
          </h2>
          <p className="mt-2 max-w-xl font-ui text-sm leading-6 text-black/50">
            {note}
          </p>
        </div>
        <ArrowRight className="hidden h-5 w-5 text-[var(--app-primary-dark)] sm:block" />
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {sermons.slice(0, 8).map(item => (
          <div key={item.id} className="w-[82vw] shrink-0 snap-start sm:w-auto">
            <SermonCard sermon={item} onPlay={() => onPlay(item)} compact />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SermonLibrary({
  discovery,
  unavailable,
  source,
}: {
  discovery: SermonDiscovery;
  unavailable: boolean;
  source: 'discovery' | 'legacy' | 'offline';
}) {
  const catalogue = useMemo(() => {
    const map = new Map<string, YouTubeVideo>();
    [
      discovery.featured,
      ...discovery.recommended,
      ...discovery.latest,
      ...discovery.collections.flatMap(item => item.items),
    ].forEach(item => {
      if (item) map.set(item.id, item);
    });
    return [...map.values()];
  }, [discovery]);
  const { trackSermonEngagement } = useChurchAnalytics();
  const [selected, setSelected] = useState(
    () =>
      catalogue.find(item => item.id === readSearchParam('watch')) ??
      discovery.featured ??
      discovery.latest[0] ??
      null
  );
  const [query, setQuery] = useState(() => readSearchParam('q'));
  const deferredQuery = useDeferredValue(query);
  const [series, setSeries] = useState(() => readSearchParam('series', 'all'));
  const [speaker, setSpeaker] = useState(() =>
    readSearchParam('speaker', 'all')
  );
  const [sort, setSort] = useState<Sort>('recommended');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(12);
  const [history, setHistory] = useState<HistoryItem[]>(readHistory);
  const playerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (series !== 'all') params.set('series', series);
    if (speaker !== 'all') params.set('speaker', speaker);
    if (selected) params.set('watch', selected.id);
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${params.size ? `?${params}` : ''}`
    );
  }, [query, selected, series, speaker]);

  const play = (sermon: YouTubeVideo) => {
    setSelected(sermon);
    const next = [
      { id: sermon.id, watchedAt: Date.now() },
      ...history.filter(item => item.id !== sermon.id),
    ].slice(0, 12);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    trackSermonEngagement({
      sermonId: sermon.id,
      sermonTitle: sermon.title,
      speaker: sermon.preacher,
      action: 'view',
    });
    requestAnimationFrame(() =>
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    );
  };

  const historySermons = history
    .map(entry => catalogue.find(item => item.id === entry.id))
    .filter((item): item is YouTubeVideo => Boolean(item));
  const recommended = useMemo(() => {
    if (!selected) return discovery.recommended;
    const tokens = new Set(
      [selected.series, selected.preacher, ...(selected.tags || [])]
        .map(item => item.toLowerCase())
        .filter(Boolean)
    );
    return [...catalogue]
      .filter(item => item.id !== selected.id)
      .sort((a, b) => {
        const score = (item: YouTubeVideo) =>
          [item.series, item.preacher, ...(item.tags || [])].reduce(
            (sum, token) => sum + (tokens.has(token.toLowerCase()) ? 1 : 0),
            0
          ) *
            100 +
          time(item.publishedAt) / 1e12;
        return score(b) - score(a);
      })
      .slice(0, 8);
  }, [catalogue, discovery.recommended, selected]);
  const seriesOptions = [
    ...new Set(catalogue.map(item => item.series).filter(Boolean)),
  ].sort();
  const speakerOptions = [
    ...new Set(catalogue.map(item => item.preacher).filter(Boolean)),
  ].sort();
  const results = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    const rank = new Map(
      discovery.recommended.map((item, index) => [item.id, index])
    );
    return catalogue
      .filter(
        item =>
          (!needle ||
            [
              item.title,
              item.description,
              item.series,
              item.preacher,
              ...(item.tags || []),
            ]
              .join(' ')
              .toLowerCase()
              .includes(needle)) &&
          (series === 'all' || item.series === series) &&
          (speaker === 'all' || item.preacher === speaker)
      )
      .sort((a, b) =>
        sort === 'popular'
          ? value(b.viewCount) - value(a.viewCount)
          : sort === 'newest'
            ? time(b.publishedAt) - time(a.publishedAt)
            : (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999)
      );
  }, [catalogue, deferredQuery, discovery.recommended, series, sort, speaker]);
  const activeFilters = Boolean(query || series !== 'all' || speaker !== 'all');
  const reset = () => {
    setQuery('');
    setSeries('all');
    setSpeaker('all');
    setSort('recommended');
    setVisible(12);
  };

  return (
    <>
      <SiteHero
        backgroundImage="/Picflow/DSC00082 copy.webp"
        imagePositionClassName="object-[center_12%] sm:object-[center_18%]"
        eyebrow="Wisdom Church Media"
        title="Truth for every season."
        subtitle="Start with what matters to you. Discover relevant teachings, continue where you left off, and grow one message at a time."
      />
      {selected && (
        <Section ref={playerRef} tone="dark" compact className="scroll-mt-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(290px,.7fr)] lg:items-center">
              <YouTubePlayer
                key={selected.id}
                videoId={selected.id}
                title={selected.title}
                className="!rounded-none ring-1 ring-white/10"
              />
              <div>
                <p className="font-ui text-eyebrow font-bold uppercase tracking-[.24em] text-[var(--app-primary)]">
                  Now playing · {selected.series}
                </p>
                <h1 className="mt-4 font-ui text-heading-lg font-semibold leading-[1.1] tracking-[-0.025em] text-white sm:text-display-sm">
                  {displayTitle(selected.title)}
                </h1>
                <p className="mt-4 font-ui text-sm text-[var(--app-subtle)]">
                  {selected.preacher} · {date(selected.publishedAt)} ·{' '}
                  {selected.duration}
                </p>
                {selected.description && (
                  <p className="mt-5 line-clamp-4 font-ui text-sm leading-7 text-[var(--app-muted)]">
                    {selected.description}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonClass('primary')}
                  >
                    Watch on YouTube <ArrowRight className="h-4 w-4" />
                  </a>
                  {recommended[0] && (
                    <button
                      type="button"
                      onClick={() => play(recommended[0])}
                      className={buttonClass('outline')}
                    >
                      Play next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      <Section tone="canvas">
        <Container>
          {unavailable && (
            <Panel tone="dark" role="status">
              <div className="grid lg:min-h-[620px] lg:grid-cols-[1.05fr_.95fr]">
                <div className="relative min-h-[330px] overflow-hidden sm:min-h-[430px] lg:min-h-full">
                  <Media
                    src="/images/worship-service-community-generated-v3.png"
                    alt="The Wisdom Church congregation worshipping together"
                    sizes="(max-width:1024px) 100vw, 52vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/10 lg:to-[var(--app-dark)]" />
                  <a
                    href={SOCIAL_LINKS.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="group absolute inset-0 flex items-center justify-center"
                    aria-label="Open The Wisdom Church sermon library on YouTube"
                  >
                    <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/45 bg-black/35 text-white shadow-2xl backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-[var(--app-primary)] group-hover:text-black sm:h-24 sm:w-24">
                      <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
                    </span>
                  </a>
                  <div className="absolute bottom-5 left-5 rounded-full border border-[var(--app-border)] bg-black/35 px-4 py-2 font-ui text-eyebrow font-bold uppercase tracking-[.2em] text-white backdrop-blur-md sm:bottom-7 sm:left-7">
                    Official media channel
                  </div>
                </div>

                <div className="relative flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16">
                  <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[var(--app-primary)]/10 blur-3xl" />
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white/[.06] px-3 py-1.5 font-ui text-eyebrow font-bold uppercase tracking-[.2em] text-[var(--app-primary)]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--app-primary)]" />{' '}
                      Media library online
                    </div>
                    <h2 className="mt-6 max-w-lg font-ui text-display-sm font-semibold leading-[1.05] tracking-[-0.03em] sm:text-display-md">
                      Every message.
                      <br />
                      <em className="text-[var(--app-primary)]">
                        One trusted channel.
                      </em>
                    </h2>
                    <p className="mt-5 max-w-md font-ui text-sm leading-7 text-[var(--app-muted)] sm:text-base">
                      The in-page catalogue is reconnecting, but your journey
                      does not stop here. Watch recent services, teaching
                      series, prayer moments, and conference messages directly
                      from Wisdom Church.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <a
                        className={buttonClass('primary')}
                        href={SOCIAL_LINKS.youtube}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Explore all messages <ArrowRight className="h-4 w-4" />
                      </a>
                      <a
                        className={buttonClass('outline')}
                        href={`${SOCIAL_LINKS.youtube}/streams`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Watch live <Play className="h-4 w-4" />
                      </a>
                    </div>
                    <div className="mt-9 grid gap-3 border-t border-[var(--app-border)] pt-6 sm:grid-cols-2">
                      <a
                        href="/events/weekly"
                        className="group flex items-center gap-3 rounded-2xl bg-white/[.045] p-4 transition hover:bg-white/[.08]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[.07] text-[var(--app-primary)]">
                          <CalendarDays className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block font-ui text-xs font-bold text-white">
                            Join this Sunday
                          </span>
                          <span className="mt-1 block font-ui text-caption text-[var(--app-subtle)]">
                            {SERVICE_INFO.sunday.time} ·{' '}
                            {SERVICE_INFO.venue.short}
                          </span>
                        </span>
                      </a>
                      <a
                        href="/resources"
                        className="group flex items-center gap-3 rounded-2xl bg-white/[.045] p-4 transition hover:bg-white/[.08]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[.07] text-[var(--app-primary)]">
                          <Headphones className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block font-ui text-xs font-bold text-white">
                            More resources
                          </span>
                          <span className="mt-1 block font-ui text-caption text-[var(--app-subtle)]">
                            Books, articles and growth tools
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          )}
          {!unavailable && source === 'legacy' && (
            <p className="mb-6 font-ui text-xs text-black/45">
              Live catalogue loaded from the church sermon feed.
            </p>
          )}
          {!unavailable && (
            <>
              <Rail
                title={
                  historySermons.length
                    ? 'Continue your journey'
                    : 'Recommended for you'
                }
                note={
                  historySermons.length
                    ? 'Your recently opened messages, stored privately on this device.'
                    : 'A balanced selection based on freshness and congregation engagement.'
                }
                sermons={
                  historySermons.length ? historySermons : discovery.recommended
                }
                onPlay={play}
              />
              <Rail
                title="Because you watched this"
                note="More teachings connected by speaker, series, and topic."
                sermons={recommended}
                onPlay={play}
              />
              {discovery.collections.slice(0, 3).map(collection => (
                <Rail
                  key={collection.id}
                  title={collection.title}
                  note={collection.description}
                  sermons={collection.items}
                  onPlay={play}
                />
              ))}
            </>
          )}

          {!unavailable && (
            <section
              id="library"
              className="border-t border-black/10 pt-12 sm:pt-16"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-ui text-eyebrow font-bold uppercase tracking-[.22em] text-[var(--app-primary-dark)]">
                    Complete library
                  </p>
                  <h2 className="mt-2 font-ui text-heading-md font-semibold tracking-[-0.02em] sm:text-heading-lg">
                    Explore every message.
                  </h2>
                </div>
                <p aria-live="polite" className="font-ui text-sm text-black/50">
                  {results.length} available
                </p>
              </div>
              <Panel className="mt-7 p-3">
                <div className="flex gap-2">
                  <label className="relative min-w-0 flex-1">
                    <span className="sr-only">Search the sermon library</span>
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
                    <input
                      id="sermon-search"
                      name="sermonSearch"
                      value={query}
                      onChange={event => {
                        setQuery(event.target.value);
                        setVisible(12);
                      }}
                      placeholder="Search a topic, title or speaker"
                      className={`${fieldClass} h-12 pl-10 pr-10`}
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(open => !open)}
                    aria-expanded={filtersOpen}
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-black/10 px-4 font-ui text-xs font-bold uppercase tracking-wider"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    <ChevronDown
                      className={`h-4 w-4 transition ${filtersOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
                {filtersOpen && (
                  <div className="mt-3 grid gap-3 border-t border-black/8 pt-3 sm:grid-cols-3">
                    <select
                      id="sermon-series"
                      name="sermonSeries"
                      aria-label="Filter by series"
                      value={series}
                      onChange={event => setSeries(event.target.value)}
                      className={`${fieldClass} h-11`}
                    >
                      <option value="all">Every series</option>
                      {seriesOptions.map(item => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    <select
                      id="sermon-speaker"
                      name="sermonSpeaker"
                      aria-label="Filter by speaker"
                      value={speaker}
                      onChange={event => setSpeaker(event.target.value)}
                      className={`${fieldClass} h-11`}
                    >
                      <option value="all">Every speaker</option>
                      {speakerOptions.map(item => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    <select
                      id="sermon-sort"
                      name="sermonSort"
                      aria-label="Sort library"
                      value={sort}
                      onChange={event => setSort(event.target.value as Sort)}
                      className={`${fieldClass} h-11`}
                    >
                      <option value="recommended">Recommended</option>
                      <option value="newest">Newest</option>
                      <option value="popular">Most watched</option>
                    </select>
                  </div>
                )}
              </Panel>
              {activeFilters && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="font-ui text-xs text-black/45">
                    Showing a focused selection
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="font-ui text-xs font-bold text-[var(--app-primary-dark)]"
                  >
                    Clear all
                  </button>
                </div>
              )}
              {!results.length ? (
                <SectionEmpty
                  className="mt-8"
                  title="Let’s find another path"
                  description="No message matches all those choices. Clear the filters to see the full library."
                  action={
                    <button
                      type="button"
                      onClick={reset}
                      className={buttonClass('dark')}
                    >
                      Show everything
                    </button>
                  }
                />
              ) : (
                <div className="mt-9 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results.slice(0, visible).map(item => (
                    <SermonCard
                      key={item.id}
                      sermon={item}
                      onPlay={() => play(item)}
                    />
                  ))}
                </div>
              )}
              {visible < results.length && (
                <div className="mt-12 text-center">
                  <button
                    type="button"
                    onClick={() => setVisible(count => count + 12)}
                    className="rounded-full border border-black/15 px-7 py-3 font-ui text-xs font-bold uppercase tracking-wider"
                  >
                    Show more messages
                  </button>
                </div>
              )}
            </section>
          )}
          {!unavailable && (
            <Panel
              tone="dark"
              className="mt-16 grid gap-4 p-7 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10"
            >
              <div>
                <p className="flex items-center gap-2 font-ui text-eyebrow font-bold uppercase tracking-[.22em] text-[var(--app-primary)]">
                  <Clock3 className="h-4 w-4" /> Updated automatically
                </p>
                <p className="mt-3 max-w-xl font-ui text-heading-md font-semibold tracking-[-0.02em] sm:text-heading-lg">
                  Fresh teaching flows directly from the official Wisdom Church
                  channel.
                </p>
              </div>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noreferrer"
                className={buttonClass('primary')}
              >
                Subscribe <ArrowRight className="h-4 w-4" />
              </a>
            </Panel>
          )}
        </Container>
      </Section>
    </>
  );
}
