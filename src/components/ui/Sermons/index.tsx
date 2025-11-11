/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState } from 'react';
import { H2, BaseText, LightText } from '@/components/text';
import YouTubePlayer from './YoutubePlayer';
import Image from 'next/image';
import { WisdomeHouseLogo } from '@/components/assets';
import { useSermonUtil } from '@/components/utils/hooks/useSermon';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  YouTubeVideo,
  GroupedSeriesData,
  UngroupedSeriesData,
} from '@/lib/types';
import Button from '@/components/utils/CustomButton';
// Sub-components
interface SeriesCardProps {
  group: GroupedSeriesData | UngroupedSeriesData;
  isUngrouped?: boolean;
  onClick: () => void;
}
const SeriesCard = ({
  group,
  isUngrouped = false,
  onClick,
}: SeriesCardProps) => {
  const { colorScheme } = useTheme();
  return (
    <div
      className="series-card group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-borderLight dark:border-border rounded-2xl p-4 sm:p-6 flex-shrink-0 w-[280px] sm:w-auto"
      onClick={onClick}
      style={{
        backgroundColor: colorScheme.text,
        borderColor: colorScheme.primary,
      }}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${'color' in group ? group.color : 'from-gray-400 to-gray-600'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md border-2 border-primary`}
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-primary/30">
            <Image
              src={WisdomeHouseLogo}
              alt="WisdomHouse"
              fill
              className="object-cover"
            />
          </div>
        </div>
        {group.latestThumbnail && (
          <img
            src={group.latestThumbnail}
            alt={group.name}
            className="w-12 h-10 sm:w-16 sm:h-12 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
          />
        )}
      </div>

      <BaseText className="text-base md:text-lg lg:text-xl font-semibold md:font-bold text-heading dark:text-white mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-2">
        {group.name}
      </BaseText>

      <LightText className="text-textSecondary dark:text-textTertiary text-xs md:text-sm mb-2 sm:mb-3 leading-relaxed line-clamp-2">
        {'description' in group
          ? group.description
          : `${group.count} messages available`}
      </LightText>

      {!isUngrouped && 'uniqueSeries' in group && (
        <div className="mb-2">
          <span className="bg-primary/10 text-primaryDark dark:text-primary px-2 py-1 rounded-full text-xs md:text-sm font-medium">
            {group.uniqueSeries.length} series
          </span>
        </div>
      )}

      <LightText className="text-textTertiary dark:text-textSecondary text-sm md:text-base mb-3 sm:mb-4">
        {group.count} {group.count === 1 ? 'message' : 'messages'}
      </LightText>

      {!isUngrouped &&
        'uniqueSeries' in group &&
        group.uniqueSeries.length > 0 && (
          <div className="mt-2">
            <LightText className="text-subtleText dark:text-textTertiary text-xs md:text-sm font-medium mb-1">
              Includes:
            </LightText>
            <div className="space-y-1">
              {group.uniqueSeries
                .slice(0, 2)
                .map((seriesName: string, idx: number) => (
                  <div
                    key={`${seriesName}-${idx}`}
                    className="flex items-center"
                  >
                    <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                    <LightText className="text-textSecondary dark:text-textTertiary text-xs md:text-sm truncate">
                      {seriesName}
                    </LightText>
                  </div>
                ))}
              {group.uniqueSeries.length > 2 && (
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-borderLight dark:bg-border rounded-full mr-2"></div>
                  <LightText className="text-subtleText dark:text-textTertiary text-xs md:text-sm">
                    +{group.uniqueSeries.length - 2} more
                  </LightText>
                </div>
              )}
            </div>
          </div>
        )}

      <div className="flex items-center justify-between pt-3 border-t border-borderLight dark:border-border mt-2">
        <BaseText className="text-primary hover:text-primaryDark font-semibold md:font-bold text-sm md:text-base group-hover:text-primaryDark transition-colors">
          {isUngrouped ? 'View Series' : 'View Category'}
        </BaseText>
        <span className="transform group-hover:translate-x-1 transition-transform text-primary">
          →
        </span>
      </div>
    </div>
  );
};
const SermonCardComponent = ({ video }: { video: YouTubeVideo }) => {
  const { colorScheme } = useTheme();
  const [showPlayer, setShowPlayer] = useState(false);
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  const formatViewCount = (count: string): string => {
    return parseInt(count).toLocaleString();
  };
  return (
    <div className="bg-card dark:bg-surface rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-borderLight dark:border-border overflow-hidden">
      <div
        className="h-48 relative overflow-hidden cursor-pointer"
        onClick={() => setShowPlayer(true)}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              curvature="full"
              className="px-4 py-2 font-semibold transition-colors text-sm shadow-md"
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor = colorScheme.heading;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = colorScheme.primary;
              }}
            >
              Watch Now
            </Button>
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
          {formatViewCount(video.viewCount)} views
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30">
            <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-primary/10 text-primaryDark dark:text-primary text-xs px-2 py-1 rounded font-medium">
            {video.series}
          </span>
          <span className="bg-surfaceVariant dark:bg-gray-700 text-textSecondary dark:text-textTertiary text-xs px-2 py-1 rounded font-medium">
            {video.preacher}
          </span>
        </div>
        <BaseText className="text-lg md:text-xl lg:text-2xl font-bold text-heading dark:text-white mb-3 line-clamp-2 leading-tight">
          {video.title}
        </BaseText>
        <LightText className="text-textSecondary dark:text-textTertiary text-sm md:text-base mb-4 line-clamp-2 leading-relaxed">
          {video.description}
        </LightText>
        <div className="flex items-center justify-between text-sm md:text-base text-subtleText dark:text-textTertiary">
          <span>{formatDate(video.publishedAt)}</span>
          <span>{video.duration}</span>
        </div>
      </div>
      {showPlayer && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-surface rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-borderLight dark:border-border">
            <div className="flex justify-between items-center p-4 border-b border-borderLight dark:border-border">
              <BaseText className="text-lg md:text-xl font-semibold text-heading dark:text-white">
                {video.title}
              </BaseText>
              <button
                onClick={() => setShowPlayer(false)}
                className="text-textTertiary hover:text-text dark:hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <YouTubePlayer
                videoId={video.id}
                title={video.title}
                height="400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const SermonUtil = () => {
  const { colorScheme } = useTheme();
  const {
    // State
    videos,
    displayedVideos,
    filteredVideos,
    loading,
    searchTerm,
    selectedSeries,
    selectedPreacher,
    sortBy,
    currentVideo,
    playerKey,
    groupedSeries,
    ungroupedSeries,
    hasMoreVideos,
    seriesOptions,
    preacherOptions,
    recentVideos,
    featuredSeriesName,

    // Refs
    cardsRef,
    horizontalScrollRef,
    gridRef,
    horizontalGridRef,

    // Handlers
    handleVideoSelect,
    handleWatchSeries,
    handleViewMore,
    handleSeriesClick,
    handleGroupClick,
    handleLoadMore,
    handleSearchChange,
    handleSeriesFilterChange,
    handlePreacherChange,
    handleSortChange,
    handleResetFilters,
  } = useSermonUtil();
  const SearchFiltersComponent = () => (
    <div className="max-w-6xl mx-auto mb-12">
      <div className="bg-surfaceVariant dark:bg-surface rounded-2xl p-6 border border-borderLight dark:border-border">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm md:text-base font-medium text-text dark:text-white mb-2">
              Search Messages
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search by title, description, series, or preacher..."
              className="w-full px-4 py-2 border border-borderLight dark:border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surfaceVariant text-text dark:text-white placeholder-textTertiary"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium text-text dark:text-white mb-2">
              Series
            </label>
            <select
              value={selectedSeries}
              onChange={e => handleSeriesFilterChange(e.target.value)}
              className="w-full px-4 py-2 border border-borderLight dark:border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surfaceVariant text-text dark:text-white"
            >
              {seriesOptions.map(series => (
                <option key={series} value={series}>
                  {series === 'all' ? 'All Series' : series}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium text-text dark:text-white mb-2">
              Preacher
            </label>
            <select
              value={selectedPreacher}
              onChange={e => handlePreacherChange(e.target.value)}
              className="w-full px-4 py-2 border border-borderLight dark:border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surfaceVariant text-text dark:text-white"
            >
              {preacherOptions.map(preacher => (
                <option key={preacher} value={preacher}>
                  {preacher === 'all' ? 'All Preachers' : preacher}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium text-text dark:text-white mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e =>
                handleSortChange(
                  e.target.value as 'newest' | 'oldest' | 'popular'
                )
              }
              className="w-full px-4 py-2 border border-borderLight dark:border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surfaceVariant text-text dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          <div className="text-center lg:text-right">
            <LightText className="text-sm md:text-base text-textSecondary dark:text-textTertiary">
              Showing{' '}
              <BaseText className="font-semibold md:font-bold text-text dark:text-white inline">
                {filteredVideos.length}
              </BaseText>{' '}
              messages
            </LightText>
            {(searchTerm ||
              selectedSeries !== 'all' ||
              selectedPreacher !== 'all' ||
              sortBy !== 'newest') && (
              <button
                onClick={handleResetFilters}
                className="text-primary hover:text-primaryDark text-sm md:text-base font-medium mt-1 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  const MobileHorizontalScroll = () => (
    <div className="block lg:hidden">
      <div
        ref={horizontalScrollRef}
        className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pl-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {groupedSeries.map(group => (
          <div key={group.name} className="snap-start">
            <SeriesCard
              group={group}
              onClick={() => handleGroupClick(group.searchTerms)}
            />
          </div>
        ))}
      </div>
      <div className="text-center mt-2">
        <LightText className="text-subtleText dark:text-textTertiary text-sm md:text-base">
          ← Scroll horizontally →
        </LightText>
      </div>
    </div>
  );
  const DesktopGridSeries = () => (
    <div
      ref={cardsRef}
      className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
    >
      {groupedSeries.map(group => (
        <SeriesCard
          key={group.name}
          group={group}
          onClick={() => handleGroupClick(group.searchTerms)}
        />
      ))}
    </div>
  );
  const MobileHorizontalGrid = () => (
    <div className="block lg:hidden">
      <div
        ref={horizontalGridRef}
        className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pl-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayedVideos.map(video => (
          <div
            key={video.id}
            className="sermon-card flex-shrink-0 w-[280px] snap-start"
          >
            <SermonCardComponent video={video} />
          </div>
        ))}
      </div>
      {displayedVideos.length > 1 && (
        <div className="text-center mt-2">
          <LightText className="text-subtleText dark:text-textTertiary text-sm md:text-base">
            ← Scroll horizontally →
          </LightText>
        </div>
      )}
    </div>
  );
  const DesktopSermonsGrid = () => (
    <div
      ref={gridRef}
      className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
    >
      {displayedVideos.map(video => (
        <div key={video.id} className="sermon-card">
          <SermonCardComponent video={video} />
        </div>
      ))}
    </div>
  );
  return (
    <div className="sermon-util">
      {/* Featured Series Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-backgroundSecondary dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <H2 className="text-center mb-8 md:mb-12 text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-heading dark:text-white font-bold md:font-extrabold">
              Latest from WisdomHouse
            </H2>

            <div className="bg-card dark:bg-surface rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-borderLight dark:border-border">
              <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 items-start">
                <div className="w-full xl:w-8/12 2xl:w-7/12">
                  <div className="rounded-2xl overflow-hidden shadow-xl bg-black border-2 border-primary/20">
                    {currentVideo ? (
                      <div className="relative aspect-video w-full">
                        <YouTubePlayer
                          key={playerKey}
                          videoId={currentVideo.id}
                          title={currentVideo.title}
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-surfaceVariant dark:bg-surface rounded-2xl flex items-center justify-center">
                        <LightText className="text-textTertiary text-sm md:text-base">
                          Loading latest content...
                        </LightText>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full xl:w-4/12 2xl:w-5/12">
                  <div className="mb-2">
                    <BaseText className="text-primary font-semibold md:font-bold text-sm md:text-base uppercase tracking-wide">
                      {currentVideo === videos[0]
                        ? 'Latest Upload'
                        : 'Now Playing'}
                    </BaseText>
                  </div>

                  <BaseText className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold md:font-extrabold text-heading dark:text-white mb-3 lg:mb-4 leading-tight">
                    {currentVideo?.title || 'New Content Coming Soon'}
                  </BaseText>

                  {currentVideo && (
                    <>
                      <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
                        <span className="bg-primary/10 text-primaryDark dark:text-primary px-2 py-1 rounded-full text-xs sm:text-sm md:text-base font-medium">
                          {currentVideo.series}
                        </span>
                        <span className="bg-surfaceVariant dark:bg-gray-700 text-textSecondary dark:text-textTertiary px-2 py-1 rounded-full text-xs sm:text-sm md:text-base font-medium">
                          {currentVideo.preacher}
                        </span>
                        <span className="bg-info/10 text-info px-2 py-1 rounded-full text-xs sm:text-sm md:text-base font-medium">
                          {new Date(
                            currentVideo.publishedAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mb-4 lg:mb-6">
                        <LightText className="text-textSecondary dark:text-textTertiary text-base md:text-lg lg:text-xl leading-relaxed max-h-32 overflow-y-auto pr-2 text-sm md:text-base">
                          {currentVideo.description ||
                            'Watch our latest content from WisdomHouse.'}
                        </LightText>
                      </div>
                    </>
                  )}
                  <div className="xl:hidden mb-6">
                    <Button
                      variant="primary"
                      size="md"
                      curvature="full"
                      className="w-full py-3 font-semibold transition-colors"
                      style={{
                        backgroundColor: colorScheme.primary,
                        color: colorScheme.black,
                      }}
                      onClick={handleWatchSeries}
                      onMouseEnter={(e: any) => {
                        e.currentTarget.style.backgroundColor =
                          colorScheme.heading;
                      }}
                      onMouseLeave={(e: any) => {
                        e.currentTarget.style.backgroundColor =
                          colorScheme.primary;
                      }}
                    >
                      View Full Series
                    </Button>
                  </div>
                  {recentVideos.length > 0 && (
                    <div className="mt-4 lg:mt-6">
                      <div className="flex items-center justify-between mb-3 lg:mb-4">
                        <BaseText className="text-lg md:text-xl lg:text-2xl font-semibold md:font-bold text-heading dark:text-white">
                          Recent Uploads
                        </BaseText>
                        <span className="text-xs md:text-sm text-textTertiary bg-surfaceVariant dark:bg-surface px-2 py-1 rounded font-medium">
                          {recentVideos.length} videos
                        </span>
                      </div>

                      <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto pr-2">
                        {recentVideos.map(video => (
                          <div
                            key={video.id}
                            className={`flex items-center gap-3 p-2 sm:p-3 rounded-lg transition-all cursor-pointer group border ${
                              currentVideo?.id === video.id
                                ? 'bg-primary/10 border-primary/30 shadow-sm'
                                : 'bg-surfaceVariant dark:bg-surface border-borderLight dark:border-border hover:bg-surfaceVariant/50 dark:hover:bg-surface/50'
                            }`}
                            onClick={() => handleVideoSelect(video)}
                          >
                            <div className="relative flex-shrink-0">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-12 h-9 sm:w-16 sm:h-12 rounded object-cover border border-borderLight dark:border-border"
                              />
                              <div
                                className={`absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center transition-opacity ${
                                  currentVideo?.id === video.id
                                    ? 'opacity-100'
                                    : 'opacity-0 group-hover:opacity-100'
                                }`}
                              >
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                              {currentVideo?.id === video.id && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full border border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <BaseText className="text-xs md:text-sm lg:text-base font-medium md:font-semibold text-text dark:text-white truncate leading-tight">
                                {video.title}
                              </BaseText>
                              <div className="flex items-center gap-1 sm:gap-2 mt-0.5">
                                <LightText className="text-xs md:text-sm text-textSecondary dark:text-textTertiary truncate">
                                  {video.series}
                                </LightText>
                                <span className="text-xs md:text-sm text-border dark:text-borderLight hidden sm:inline">
                                  •
                                </span>
                                <LightText className="text-xs md:text-sm text-textSecondary dark:text-textTertiary hidden sm:block">
                                  {new Date(
                                    video.publishedAt
                                  ).toLocaleDateString()}
                                </LightText>
                              </div>
                            </div>
                            {video === videos[0] && (
                              <span className="bg-error/10 text-error px-1.5 py-0.5 rounded text-xs md:text-sm font-medium flex-shrink-0">
                                NEW
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      {videos.length > 5 && (
                        <div className="mt-4 text-center">
                          <button
                            onClick={handleViewMore}
                            className="text-primary hover:text-primaryDark font-semibold md:font-bold text-sm md:text-base transition-colors flex items-center justify-center gap-1 mx-auto"
                          >
                            View More Series
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Series Cards Section */}
      <section
        id="series-section"
        className="py-12 sm:py-16 bg-background dark:bg-black"
      >
        <div className="container mx-auto px-3 sm:px-4">
          {!videos.length ? (
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-surfaceVariant dark:bg-surface rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-surfaceVariant dark:bg-surface rounded w-1/2 mx-auto mb-12"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className="bg-surfaceVariant dark:bg-surface rounded-2xl h-64 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10 sm:mb-12">
                <BaseText className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold md:font-extrabold text-heading dark:text-white mb-4 sm:mb-6 text-center">
                  Featured Categories
                </BaseText>

                <MobileHorizontalScroll />
                <DesktopGridSeries />
              </div>
              {ungroupedSeries.length > 0 && (
                <div className="mb-10 sm:mb-12">
                  <BaseText className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold md:font-extrabold text-heading dark:text-white mb-4 sm:mb-6 text-center">
                    More Sermons
                  </BaseText>

                  <div className="block lg:hidden">
                    <div
                      className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pl-4"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                      }}
                    >
                      {ungroupedSeries.map(series => (
                        <div key={series.name} className="snap-start">
                          <SeriesCard
                            group={series}
                            isUngrouped={true}
                            onClick={() => handleSeriesClick(series.name)}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-2">
                      <LightText className="text-subtleText dark:text-textTertiary text-sm md:text-base">
                        ← Scroll horizontally →
                      </LightText>
                    </div>
                  </div>
                  <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {ungroupedSeries.map(series => (
                      <SeriesCard
                        key={series.name}
                        group={series}
                        isUngrouped={true}
                        onClick={() => handleSeriesClick(series.name)}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="text-center mt-8 sm:mt-12">
                <Button
                  variant="primary"
                  size="lg"
                  curvature="full"
                  className="px-6 sm:px-8 py-3 sm:py-4 font-semibold transition-colors transform hover:scale-105 duration-200 shadow-lg hover:shadow-xl text-sm md:text-base lg:text-lg"
                  style={{
                    backgroundColor: colorScheme.primary,
                    color: colorScheme.black,
                  }}
                  onClick={() => handleSeriesClick('all')}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.backgroundColor = colorScheme.heading;
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.backgroundColor = colorScheme.primary;
                  }}
                >
                  View Complete Library
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      {/* Sermons Grid Section */}
      <section
        id="sermons-grid"
        className="py-12 sm:py-16 bg-backgroundSecondary dark:bg-background"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="mb-6 sm:mb-8">
            <SearchFiltersComponent />
          </div>
          <MobileHorizontalGrid />
          <DesktopSermonsGrid />
          {filteredVideos.length === 0 && !loading && (
            <div className="text-center py-8 sm:py-12">
              <LightText className="text-textTertiary text-base md:text-lg lg:text-xl mb-3 sm:mb-4">
                No sermons found matching your criteria.
              </LightText>
              <Button
                variant="primary"
                size="md"
                curvature="full"
                className="px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors text-sm md:text-base lg:text-lg shadow-md"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.black,
                }}
                onClick={handleResetFilters}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.backgroundColor = colorScheme.heading;
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.backgroundColor = colorScheme.primary;
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
          {hasMoreVideos && filteredVideos.length > 0 && (
            <div className="text-center mt-6 sm:mt-8">
              <Button
                variant="primary"
                size="lg"
                curvature="full"
                className="px-6 sm:px-8 py-2 sm:py-3 font-semibold transition-colors transform hover:scale-105 duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm md:text-base lg:text-lg shadow-md"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.black,
                }}
                onClick={handleLoadMore}
                disabled={loading}
                onMouseEnter={(e: any) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = colorScheme.heading;
                  }
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.backgroundColor = colorScheme.primary;
                }}
              >
                {loading ? 'Loading...' : `Load More Videos`}
              </Button>
            </div>
          )}
          {loading && (
            <div className="text-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          )}
        </div>
      </section>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
export default SermonUtil;
