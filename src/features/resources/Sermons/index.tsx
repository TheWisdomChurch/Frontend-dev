'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import YouTubePlayer from './YoutubePlayer';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { useSermonUtil } from '@/shared/utils/hooks/useSermon';
import type {
  YouTubeVideo,
  GroupedSeriesData,
  UngroupedSeriesData,
} from '@/lib/types';

/* ── Arrow ───────────────────────────────────────────────── */

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 6h10M6 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Play icon ───────────────────────────────────────────── */

function PlayIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 4l10 5-10 5V4z" />
    </svg>
  );
}

/* ── Video modal ─────────────────────────────────────────── */

function VideoModal({
  video,
  onClose,
}: {
  video: YouTubeVideo;
  onClose: () => void;
}) {
  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-5xl flex-col overflow-hidden border border-white/10 bg-[var(--app-dark)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="min-w-0 flex-1 pr-4">
            {video.series && (
              <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                {video.series}
              </p>
            )}
            <p className="mt-0.5 font-headline text-[1rem] font-normal text-white line-clamp-1">
              {video.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/15 text-white/50 transition hover:border-white/30 hover:text-white"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* Player */}
        <div className="aspect-video w-full bg-black">
          <YouTubePlayer
            videoId={video.id}
            title={video.title}
            className="h-full w-full"
          />
        </div>

        {/* Meta */}
        <div className="border-t border-white/10 px-6 py-4">
          <p className="font-ui text-[0.78rem] text-white/40">
            {video.preacher}
            {video.publishedAt && ` · ${formatDate(video.publishedAt)}`}
            {video.duration && ` · ${video.duration}`}
          </p>
          {video.description && (
            <p className="mt-2 font-ui text-[0.82rem] leading-[1.75] text-white/48 line-clamp-2">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sermon card ─────────────────────────────────────────── */

function SermonCard({
  video,
  onClick,
}: {
  video: YouTubeVideo;
  onClick: () => void;
}) {
  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <article
      className="group cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[var(--app-dark-2)]">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-headline text-[3rem] font-normal text-white/8">
              W
            </span>
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/40">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 pl-0.5 text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
            <PlayIcon />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-4">
        {video.series && (
          <p className="mb-1.5 font-ui text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
            {video.series}
          </p>
        )}
        <h3 className="font-headline text-[1rem] font-normal leading-snug text-white line-clamp-2 transition duration-150 group-hover:text-white/75">
          {video.title}
        </h3>
        <p className="mt-2 font-ui text-[0.74rem] text-white/35">
          {video.preacher}
          {video.publishedAt && ` · ${formatDate(video.publishedAt)}`}
        </p>
      </div>
    </article>
  );
}

/* ── Category card ───────────────────────────────────────── */

function CategoryCard({
  group,
  isUngrouped,
  onClick,
}: {
  group: GroupedSeriesData | UngroupedSeriesData;
  isUngrouped?: boolean;
  onClick: () => void;
}) {
  return (
    <article
      className="group cursor-pointer border border-[var(--app-ink)]/10 bg-[var(--app-canvas)] transition duration-200 hover:border-[var(--app-primary)]/35"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {/* Thumbnail strip */}
      <div className="relative h-28 overflow-hidden bg-[var(--app-canvas-2)]">
        {group.latestThumbnail && (
          <img
            src={group.latestThumbnail}
            alt={group.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-canvas)]/90 to-transparent" />
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-headline text-[1.05rem] font-normal text-[var(--app-ink)] line-clamp-2 transition duration-150 group-hover:text-[var(--app-primary)]">
              {group.name}
            </h3>
            {'description' in group && group.description && (
              <p className="mt-1.5 font-ui text-[0.74rem] leading-[1.7] text-[var(--app-ink)]/45 line-clamp-2">
                {group.description}
              </p>
            )}
          </div>
          <span className="shrink-0 translate-x-0 font-ui text-[0.7rem] text-[var(--app-ink)]/30 transition duration-200 group-hover:translate-x-1 group-hover:text-[var(--app-primary)]">
            →
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="font-ui text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--app-primary)]">
            {group.count} {group.count === 1 ? 'message' : 'messages'}
          </span>
          {!isUngrouped &&
            'uniqueSeries' in group &&
            group.uniqueSeries.length > 1 && (
              <span className="font-ui text-[0.65rem] text-[var(--app-ink)]/32">
                · {group.uniqueSeries.length} series
              </span>
            )}
        </div>
      </div>
    </article>
  );
}

/* ── Shared select style ─────────────────────────────────── */

const darkSelectCls =
  'border border-white/10 bg-white/[0.05] px-4 py-2.5 font-ui text-[0.82rem] text-white focus:border-[var(--app-primary)] focus:outline-none transition';

/* ── Main component ──────────────────────────────────────── */

const SermonUtil = () => {
  const {
    videos,
    displayedVideos,
    filteredVideos,
    loading,
    searchTerm,
    selectedSeries,
    selectedPreacher,
    selectedYear,
    sortBy,
    groupedSeries,
    ungroupedSeries,
    hasMoreVideos,
    seriesOptions,
    preacherOptions,
    yearOptions,
    recentVideos,
    currentVideo,
    playerKey,
    cardsRef,
    gridRef,
    handleGroupClick,
    handleSeriesClick,
    handleLoadMore,
    handleSearchChange,
    handleSeriesFilterChange,
    handlePreacherChange,
    handleYearChange,
    handleSortChange,
    handleResetFilters,
    handleVideoSelect,
    handleWatchSeries,
  } = useSermonUtil();

  const [modalVideo, setModalVideo] = useState<YouTubeVideo | null>(null);

  const openModal = useCallback(
    (video: YouTubeVideo) => setModalVideo(video),
    []
  );
  const closeModal = useCallback(() => setModalVideo(null), []);

  const hasActiveFilters =
    !!searchTerm ||
    selectedSeries !== 'all' ||
    selectedPreacher !== 'all' ||
    selectedYear !== 'all';

  const hasSeries = groupedSeries.length > 0 || ungroupedSeries.length > 0;

  return (
    <main className="min-h-screen">
      {/* ── 1. Hero ───────────────────────────────────────────── */}
      <PageHero
        eyebrow="Sermons & Teachings"
        title="Messages from the house."
        subtitle="Watch, listen, and grow — every sermon from Sunday services, conferences, and midweek gatherings."
        compact
      />

      {/* ── 2. Featured player — dark ─────────────────────────── */}
      <section className="border-b border-white/8 bg-[var(--app-dark)]">
        <Container size="xl">
          {loading && !currentVideo ? (
            <div className="grid gap-14 py-14 lg:grid-cols-[1.3fr_1fr] lg:py-18">
              <div className="space-y-4">
                <div className="aspect-video animate-pulse bg-white/[0.05]" />
                <div className="h-5 w-1/4 animate-pulse bg-white/[0.04]" />
                <div className="h-7 w-3/4 animate-pulse bg-white/[0.05]" />
                <div className="h-4 w-1/3 animate-pulse bg-white/[0.03]" />
              </div>
              <div className="space-y-4">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="h-14 w-20 shrink-0 animate-pulse bg-white/[0.04]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 animate-pulse bg-white/[0.04]" />
                      <div className="h-3 w-2/3 animate-pulse bg-white/[0.03]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : currentVideo ? (
            <ScrollFadeIn>
              <div className="grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-14 lg:py-18">
                {/* Player column */}
                <div>
                  <p className="mb-4 font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                    {currentVideo === videos[0]
                      ? 'Latest message'
                      : 'Now playing'}
                  </p>
                  <div className="aspect-video w-full overflow-hidden bg-black">
                    <YouTubePlayer
                      key={String(playerKey)}
                      videoId={currentVideo.id}
                      title={currentVideo.title}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="mt-6">
                    {currentVideo.series && (
                      <p className="mb-1.5 font-ui text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
                        {currentVideo.series}
                      </p>
                    )}
                    <h2 className="font-headline text-[1.45rem] font-normal leading-snug text-white sm:text-[1.8rem]">
                      {currentVideo.title}
                    </h2>
                    <p className="mt-2 font-ui text-[0.78rem] text-white/38">
                      {currentVideo.preacher}
                      {currentVideo.publishedAt &&
                        ` · ${new Date(
                          currentVideo.publishedAt
                        ).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}`}
                    </p>
                    {currentVideo.description && (
                      <p className="mt-3 font-ui text-[0.83rem] leading-[1.85] text-white/45 line-clamp-3">
                        {currentVideo.description}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleWatchSeries}
                      className="mt-5 inline-flex items-center gap-2 border border-white/18 px-5 py-2.5 font-ui text-[0.72rem] font-semibold text-white/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                    >
                      View full series <Arrow />
                    </button>
                  </div>
                </div>

                {/* Recent sidebar */}
                {recentVideos.length > 0 && (
                  <div>
                    <div className="mb-5 flex items-center justify-between">
                      <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                        Recent uploads
                      </p>
                      <span className="font-ui text-[0.68rem] text-white/28">
                        {recentVideos.length} videos
                      </span>
                    </div>
                    <div className="divide-y divide-white/8">
                      {recentVideos.map((video, idx) => {
                        const isActive = currentVideo?.id === video.id;
                        return (
                          <div
                            key={video.id}
                            className={`group flex cursor-pointer items-center gap-4 py-4 transition ${
                              isActive
                                ? 'opacity-100'
                                : 'opacity-55 hover:opacity-100'
                            }`}
                            onClick={() => handleVideoSelect(video)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e =>
                              e.key === 'Enter' && handleVideoSelect(video)
                            }
                          >
                            <div className="relative shrink-0">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="h-14 w-20 object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                              {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/55 pl-0.5 text-white">
                                  <PlayIcon />
                                </div>
                              )}
                              {idx === 0 && !isActive && (
                                <span className="absolute -right-1 -top-1 bg-[var(--app-primary)] px-1.5 py-0.5 font-ui text-[0.5rem] font-bold uppercase tracking-wide text-[var(--app-ink)]">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className={`font-headline text-[0.9rem] font-normal leading-snug line-clamp-2 ${
                                  isActive ? 'text-white' : 'text-white/78'
                                }`}
                              >
                                {video.title}
                              </p>
                              <p className="mt-0.5 font-ui text-[0.68rem] text-white/32 truncate">
                                {video.series}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollFadeIn>
          ) : (
            <ScrollFadeIn>
              <div className="flex flex-col items-center gap-5 py-20 text-center">
                <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/50" />
                <h2 className="font-headline text-[1.5rem] font-normal text-white">
                  Sermons loading soon.
                </h2>
                <p className="max-w-sm font-ui text-[0.82rem] leading-[1.85] text-white/40">
                  Our full sermon library will appear here. In the meantime,
                  visit our YouTube channel.
                </p>
                <a
                  href="https://www.youtube.com/@wisdomhousehq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/18 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-white/55 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                >
                  Visit YouTube channel <Arrow />
                </a>
              </div>
            </ScrollFadeIn>
          )}
        </Container>
      </section>

      {/* ── 3. Series categories — canvas ─────────────────────── */}
      {hasSeries && (
        <section className="bg-[var(--app-canvas)] py-16 lg:py-20">
          <Container size="xl">
            <ScrollFadeIn className="mb-10">
              <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Browse by category
              </p>
              <h2 className="mt-2 font-headline text-[1.6rem] font-normal text-[var(--app-ink)] sm:text-[2rem]">
                Explore the sermon library.
              </h2>
            </ScrollFadeIn>

            {groupedSeries.length > 0 && (
              <div
                ref={cardsRef}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {groupedSeries.map((group, i) => (
                  <ScrollFadeIn key={group.name} delay={i * 0.05}>
                    <div className="series-card h-full">
                      <CategoryCard
                        group={group}
                        onClick={() =>
                          handleGroupClick(group.searchTerms, group.name)
                        }
                      />
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
            )}

            {ungroupedSeries.length > 0 && (
              <>
                <ScrollFadeIn className="mb-6 mt-12">
                  <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                    More series
                  </p>
                </ScrollFadeIn>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {ungroupedSeries.map((series, i) => (
                    <ScrollFadeIn key={series.name} delay={i * 0.04}>
                      <div className="series-card h-full">
                        <CategoryCard
                          group={series}
                          isUngrouped
                          onClick={() => handleSeriesClick(series.name)}
                        />
                      </div>
                    </ScrollFadeIn>
                  ))}
                </div>
              </>
            )}

            <ScrollFadeIn className="mt-10 text-center">
              <button
                type="button"
                onClick={() => handleSeriesClick('all')}
                className="inline-flex items-center gap-2 border border-[var(--app-ink)]/18 px-8 py-3.5 font-ui text-[0.75rem] font-semibold text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
              >
                View all sermons <Arrow />
              </button>
            </ScrollFadeIn>
          </Container>
        </section>
      )}

      {/* ── 4. Filter + Sermon grid — dark ────────────────────── */}
      <section
        id="sermons-grid"
        className="bg-[var(--app-dark)] py-16 lg:py-20"
      >
        <Container size="xl">
          {/* Filters */}
          <ScrollFadeIn className="mb-10">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
              <input
                type="text"
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search sermons..."
                className="border border-white/10 bg-white/[0.05] px-4 py-2.5 font-ui text-[0.82rem] text-white placeholder-white/28 focus:border-[var(--app-primary)] focus:outline-none transition"
              />
              <select
                aria-label="Filter by series"
                value={selectedSeries}
                onChange={e => handleSeriesFilterChange(e.target.value)}
                className={darkSelectCls}
              >
                {seriesOptions.map(s => (
                  <option key={s} value={s} className="bg-[#07060a]">
                    {s === 'all'
                      ? 'All series'
                      : s.startsWith('group:')
                        ? `Group: ${s.replace('group:', '').trim()}`
                        : s}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter by preacher"
                value={selectedPreacher}
                onChange={e => handlePreacherChange(e.target.value)}
                className={darkSelectCls}
              >
                {preacherOptions.map(p => (
                  <option key={p} value={p} className="bg-[#07060a]">
                    {p === 'all' ? 'All preachers' : p}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter by year"
                value={selectedYear}
                onChange={e => handleYearChange(e.target.value)}
                className={darkSelectCls}
              >
                {yearOptions.map(y => (
                  <option key={y} value={y} className="bg-[#07060a]">
                    {y === 'all' ? 'All years' : y}
                  </option>
                ))}
              </select>
              <select
                aria-label="Sort sermons"
                value={sortBy}
                onChange={e =>
                  handleSortChange(
                    e.target.value as 'newest' | 'oldest' | 'popular'
                  )
                }
                className={darkSelectCls}
              >
                <option value="newest" className="bg-[#07060a]">
                  Newest
                </option>
                <option value="oldest" className="bg-[#07060a]">
                  Oldest
                </option>
                <option value="popular" className="bg-[#07060a]">
                  Popular
                </option>
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="font-ui text-[0.78rem] text-white/35">
                {filteredVideos.length}{' '}
                {filteredVideos.length === 1 ? 'message' : 'messages'}
                {hasActiveFilters && ' found'}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="font-ui text-[0.72rem] text-[var(--app-primary)] transition hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </ScrollFadeIn>

          {/* Loading skeleton */}
          {loading && displayedVideos.length === 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-white/[0.05]" />
                  <div className="mt-3 h-4 w-3/4 bg-white/[0.05]" />
                  <div className="mt-2 h-3 w-1/2 bg-white/[0.03]" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredVideos.length === 0 && (
            <ScrollFadeIn>
              <div className="flex flex-col items-center gap-5 border border-white/8 bg-white/[0.025] px-8 py-16 text-center">
                <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/50" />
                <h3 className="font-headline text-[1.4rem] font-normal text-white">
                  No sermons match your search.
                </h3>
                <p className="max-w-sm font-ui text-[0.82rem] leading-[1.85] text-white/40">
                  Try adjusting your filters or searching with different
                  keywords.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 border border-white/18 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-white/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                >
                  Clear all filters <Arrow />
                </button>
              </div>
            </ScrollFadeIn>
          )}

          {/* Sermon grid */}
          {!loading && displayedVideos.length > 0 && (
            <div
              ref={gridRef}
              className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {displayedVideos.map(video => (
                <div key={video.id} className="sermon-card">
                  <SermonCard video={video} onClick={() => openModal(video)} />
                </div>
              ))}
            </div>
          )}

          {/* Loading more */}
          {loading && displayedVideos.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-[var(--app-primary)]" />
            </div>
          )}

          {/* Load more */}
          {hasMoreVideos && !loading && filteredVideos.length > 0 && (
            <ScrollFadeIn className="mt-12 text-center">
              <button
                type="button"
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 border border-white/18 px-8 py-3.5 font-ui text-[0.75rem] font-semibold text-white/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
              >
                Load more sermons
              </button>
            </ScrollFadeIn>
          )}
        </Container>
      </section>

      {/* ── 5. CTA — canvas ───────────────────────────────────── */}
      <ScrollFadeIn>
        <section className="bg-[var(--app-canvas)] py-20 lg:py-24">
          <Container size="lg">
            <div className="flex flex-col items-center gap-7 text-center">
              <p className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Stay connected
              </p>
              <h2 className="font-headline text-[1.9rem] font-normal leading-snug text-[var(--app-ink)] sm:text-[2.4rem]">
                Never miss a message
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  from the house.
                </em>
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/40" />
              <p className="max-w-md font-ui text-[0.85rem] leading-[1.9] text-[var(--app-ink)]/50">
                Subscribe to the Wisdom Church YouTube channel and receive new
                sermons, conference messages, and live service alerts every
                week.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.youtube.com/@wisdomhousehq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--app-ink)] px-8 py-3.5 font-ui text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--app-primary)] hover:text-[var(--app-ink)]"
                >
                  Subscribe on YouTube <Arrow />
                </a>
                <Link
                  href="/events/weekly"
                  className="inline-flex items-center justify-center gap-2 border border-[var(--app-ink)]/18 px-8 py-3.5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                >
                  View service times
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>

      {/* Video modal */}
      {modalVideo && <VideoModal video={modalVideo} onClose={closeModal} />}
    </main>
  );
};

export default SermonUtil;
