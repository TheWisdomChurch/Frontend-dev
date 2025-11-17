/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react'; // Added useEffect
import { H2, BaseText, LightText, H1 } from '@/components/text';
import YouTubePlayer from './YoutubePlayer';
import Image from 'next/image';
import { Banner_2, WisdomeHouseLogo } from '@/components/assets';
import { useSermonUtil } from '@/components/utils/hooks/useSermon';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  YouTubeVideo,
  GroupedSeriesData,
  UngroupedSeriesData,
} from '@/lib/types';
import Button from '@/components/utils/CustomButton';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';

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
      className="series-card group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border rounded-2xl p-4 sm:p-6 flex-shrink-0 w-[280px] sm:w-auto"
      onClick={onClick}
      style={{
        backgroundColor: colorScheme.black,
        borderColor: colorScheme.primary,
      }}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${'color' in group ? group.color : 'from-gray-400 to-gray-600'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md border-2`}
          style={{ borderColor: colorScheme.primary }}
        >
          <div
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2"
            style={{ borderColor: colorScheme.primary + '30' }}
          >
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

      <BaseText
        className="text-base md:text-lg lg:text-xl font-semibold md:font-bold mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-2"
        style={{ color: colorScheme.black }}
      >
        {group.name}
      </BaseText>

      <LightText
        className="text-xs md:text-sm mb-2 sm:mb-3 leading-relaxed line-clamp-2"
        style={{ color: colorScheme.textSecondary }}
      >
        {'description' in group
          ? group.description
          : `${group.count} messages available`}
      </LightText>

      {!isUngrouped && 'uniqueSeries' in group && (
        <div className="mb-2">
          <span
            className="px-2 py-1 rounded-full text-xs md:text-sm font-medium"
            style={{
              backgroundColor: colorScheme.primary + '10',
              color: colorScheme.primaryDark,
            }}
          >
            {group.uniqueSeries.length} series
          </span>
        </div>
      )}

      <LightText
        className="text-sm md:text-base mb-3 sm:mb-4"
        style={{ color: colorScheme.textSecondary }}
      >
        {group.count} {group.count === 1 ? 'message' : 'messages'}
      </LightText>

      {!isUngrouped &&
        'uniqueSeries' in group &&
        group.uniqueSeries.length > 0 && (
          <div className="mt-2">
            <LightText
              className="text-xs md:text-sm font-medium mb-1"
              style={{ color: colorScheme.textSecondary }}
            >
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
                    <div
                      className="w-1 h-1 rounded-full mr-2"
                      style={{ backgroundColor: colorScheme.primary }}
                    ></div>
                    <LightText
                      className="text-xs md:text-sm truncate"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      {seriesName}
                    </LightText>
                  </div>
                ))}
              {group.uniqueSeries.length > 2 && (
                <div className="flex items-center">
                  <div
                    className="w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: colorScheme.border }}
                  ></div>
                  <LightText
                    className="text-xs md:text-sm"
                    style={{ color: colorScheme.textSecondary }}
                  >
                    +{group.uniqueSeries.length - 2} more
                  </LightText>
                </div>
              )}
            </div>
          </div>
        )}

      <div
        className="flex items-center justify-between pt-3 border-t mt-2"
        style={{ borderColor: colorScheme.border }}
      >
        <BaseText
          className="font-semibold md:font-bold text-sm md:text-base group-hover:text-primaryDark transition-colors"
          style={{ color: colorScheme.primary }}
        >
          {isUngrouped ? 'View Series' : 'View Category'}
        </BaseText>
        <span
          className="transform group-hover:translate-x-1 transition-transform"
          style={{ color: colorScheme.primary }}
        >
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
    <div
      className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border overflow-hidden"
      style={{
        backgroundColor: colorScheme.black,
        borderColor: colorScheme.border,
      }}
    >
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
          <FlexboxLayout gap="sm">
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
                e.currentTarget.style.backgroundColor = colorScheme.primaryDark;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = colorScheme.primary;
              }}
            >
              Watch Now
            </Button>
          </FlexboxLayout>
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
        <FlexboxLayout gap="sm" className="mb-3">
          <span
            className="text-xs px-2 py-1 rounded font-medium"
            style={{
              backgroundColor: colorScheme.primary + '10',
              color: colorScheme.primaryDark,
            }}
          >
            {video.series}
          </span>
          <span
            className="text-xs px-2 py-1 rounded font-medium"
            style={{
              backgroundColor: colorScheme.surface,
              color: colorScheme.textSecondary,
            }}
          >
            {video.preacher}
          </span>
        </FlexboxLayout>

        <H1
          className="text-lg md:text-xl lg:text-2xl font-bold mb-3 line-clamp-2 leading-tight"
          style={{ color: colorScheme.primaryDark }}
        >
          {video.title}
        </H1>

        <LightText
          className="text-sm md:text-base mb-4 line-clamp-2 leading-relaxed"
          style={{ color: colorScheme.white }}
        >
          {video.description}
        </LightText>

        <FlexboxLayout
          justify="between"
          align="center"
          className="text-sm md:text-base"
          style={{ color: colorScheme.textSecondary }}
        >
          <span>{formatDate(video.publishedAt)}</span>
          <span>{video.duration}</span>
        </FlexboxLayout>
      </div>

      {showPlayer && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div
            className="rounded-2xl max-w-6xl w-full h-[90vh] overflow-hidden shadow-2xl border flex flex-col"
            style={{
              backgroundColor: colorScheme.white,
              borderColor: colorScheme.border,
            }}
          >
            <FlexboxLayout
              justify="between"
              align="center"
              className="p-4 border-b flex-shrink-0"
              style={{
                borderColor: colorScheme.border,
                backgroundColor: colorScheme.white,
              }}
            >
              <BaseText
                className="text-lg md:text-xl font-semibold pr-4 line-clamp-1"
                style={{ color: colorScheme.black }}
              >
                {video.title}
              </BaseText>
              <button
                onClick={() => setShowPlayer(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                style={{
                  color: colorScheme.textSecondary,
                  backgroundColor: 'transparent',
                }}
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </FlexboxLayout>

            <div className="flex-1 p-0 overflow-hidden">
              <YouTubePlayer
                videoId={video.id}
                title={video.title}
                className="w-full h-full"
                iframeClassName="w-full h-full"
              />
            </div>

            <div
              className="p-4 border-t flex-shrink-0"
              style={{ borderColor: colorScheme.border }}
            >
              <FlexboxLayout direction="column" gap="sm">
                <BaseText
                  className="text-base font-semibold"
                  style={{ color: colorScheme.black }}
                >
                  {video.series} • {video.preacher}
                </BaseText>
                <LightText
                  className="text-sm"
                  style={{ color: colorScheme.textSecondary }}
                >
                  Published on {formatDate(video.publishedAt)} •{' '}
                  {formatViewCount(video.viewCount)} views
                </LightText>
              </FlexboxLayout>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// New Component: FeaturedSection
const FeaturedSection = () => {
  const { colorScheme } = useTheme();
  const {
    videos,
    currentVideo,
    playerKey,
    recentVideos,
    handleVideoSelect,
    handleWatchSeries,
    handleViewMore,
  } = useSermonUtil();

  return (
    <Section
      background="dark"
      padding="lg"
      fullHeight={false}
      style={{ backgroundColor: colorScheme.white }}
    >
      <Container size="xl">
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="lg"
          className="text-center w-full"
        >
          <H2
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold md:font-extrabold mb-8 md:mb-12"
            style={{ color: colorScheme.black }}
          >
            Latest from WisdomHouse
          </H2>

          <div
            className="rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border w-full max-w-7xl mx-auto"
            style={{
              backgroundColor: colorScheme.white,
              borderColor: colorScheme.white,
            }}
          >
            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full">
              {/* Video Player Section - Takes more space on desktop */}
              <div className="w-full lg:w-8/12 xl:w-7/12">
                <div
                  className="rounded-2xl overflow-hidden shadow-xl bg-black border-2"
                  style={{ borderColor: colorScheme.primary + '20' }}
                >
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
                    <div
                      className="w-full aspect-video rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: colorScheme.black }}
                    >
                      <LightText
                        className="text-sm md:text-base"
                        style={{ color: colorScheme.textSecondary }}
                      >
                        Loading latest content...
                      </LightText>
                    </div>
                  )}
                </div>

                {/* Video Info below player on desktop */}
                <div className="hidden lg:block mt-6 text-left">
                  <div className="mb-3">
                    <BaseText
                      className="font-semibold md:font-bold text-sm md:text-base uppercase tracking-wide"
                      style={{ color: colorScheme.black }}
                    >
                      {currentVideo === videos[0]
                        ? 'Latest Upload'
                        : 'Now Playing'}
                    </BaseText>
                  </div>

                  <BaseText
                    className="text-xl md:text-2xl lg:text-3xl font-bold md:font-extrabold mb-4 leading-tight"
                    style={{ color: colorScheme.black }}
                  >
                    {currentVideo?.title || 'New Content Coming Soon'}
                  </BaseText>

                  {currentVideo && (
                    <>
                      <FlexboxLayout
                        justify="start"
                        align="center"
                        gap="sm"
                        className="mb-4 flex-wrap"
                      >
                        <span
                          className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                          style={{
                            backgroundColor: colorScheme.primary + '10',
                            color: colorScheme.primary,
                          }}
                        >
                          {currentVideo.series}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                          style={{
                            backgroundColor: colorScheme.black,
                            color: colorScheme.primary,
                          }}
                        >
                          {currentVideo.preacher}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                          style={{
                            backgroundColor: colorScheme.primary + '10',
                            color: colorScheme.primary,
                          }}
                        >
                          {new Date(
                            currentVideo.publishedAt
                          ).toLocaleDateString()}
                        </span>
                      </FlexboxLayout>

                      <div className="mb-6">
                        <LightText
                          className="text-sm md:text-base leading-relaxed"
                          style={{ color: colorScheme.black }}
                        >
                          {currentVideo.description ||
                            'Watch our latest content from WisdomHouse.'}
                        </LightText>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          variant="primary"
                          size="md"
                          curvature="full"
                          className="flex-1 py-3 font-semibold transition-colors"
                          style={{
                            backgroundColor: colorScheme.primary,
                            color: colorScheme.black,
                          }}
                          onClick={handleWatchSeries}
                          onMouseEnter={(e: any) => {
                            e.currentTarget.style.backgroundColor =
                              colorScheme.primaryDark;
                          }}
                          onMouseLeave={(e: any) => {
                            e.currentTarget.style.backgroundColor =
                              colorScheme.primary;
                          }}
                        >
                          View Full Series
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar Content - Recent Uploads */}
              <div className="w-full lg:w-4/12 xl:w-5/12">
                {/* Mobile-only video info */}
                <div className="lg:hidden mb-6">
                  <div className="mb-3">
                    <BaseText
                      className="font-semibold md:font-bold text-sm md:text-base uppercase tracking-wide"
                      style={{ color: colorScheme.black }}
                    >
                      {currentVideo === videos[0]
                        ? 'Latest Upload'
                        : 'Now Playing'}
                    </BaseText>
                  </div>

                  <BaseText
                    className="text-xl md:text-2xl font-bold md:font-extrabold mb-4 leading-tight line-clamp-3"
                    style={{ color: colorScheme.black }}
                  >
                    {currentVideo?.title || 'New Content Coming Soon'}
                  </BaseText>

                  {currentVideo && (
                    <>
                      <FlexboxLayout
                        justify="start"
                        align="center"
                        gap="sm"
                        className="mb-4 flex-wrap"
                      >
                        <span
                          className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                          style={{
                            backgroundColor: colorScheme.primary + '10',
                            color: colorScheme.primary,
                          }}
                        >
                          {currentVideo.series}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                          style={{
                            backgroundColor: colorScheme.black,
                            color: colorScheme.primary,
                          }}
                        >
                          {currentVideo.preacher}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                          style={{
                            backgroundColor: colorScheme.primary + '10',
                            color: colorScheme.primary,
                          }}
                        >
                          {new Date(
                            currentVideo.publishedAt
                          ).toLocaleDateString()}
                        </span>
                      </FlexboxLayout>

                      <div className="mb-4">
                        <LightText
                          className="text-sm md:text-base leading-relaxed max-h-24 overflow-y-auto pr-2"
                          style={{ color: colorScheme.black }}
                        >
                          {currentVideo.description ||
                            'Watch our latest content from WisdomHouse.'}
                        </LightText>
                      </div>

                      <Button
                        variant="primary"
                        size="md"
                        curvature="full"
                        className="w-full py-3 font-semibold transition-colors mb-6"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                        }}
                        onClick={handleWatchSeries}
                        onMouseEnter={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.primaryDark;
                        }}
                        onMouseLeave={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.primary;
                        }}
                      >
                        View Full Series
                      </Button>
                    </>
                  )}
                </div>

                {/* Recent Uploads Section */}
                {recentVideos.length > 0 && (
                  <div className="lg:mt-0">
                    <FlexboxLayout
                      justify="between"
                      align="center"
                      className="mb-4"
                    >
                      <BaseText
                        className="text-lg md:text-xl font-semibold md:font-bold"
                        style={{ color: colorScheme.primaryDark }}
                      >
                        Recent Uploads
                      </BaseText>
                      <span
                        className="text-xs md:text-sm px-3 py-1 rounded font-medium"
                        style={{
                          backgroundColor: colorScheme.black,
                          color: colorScheme.textSecondary,
                        }}
                      >
                        {recentVideos.length} videos
                      </span>
                    </FlexboxLayout>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {recentVideos.map((video: YouTubeVideo) => (
                        <div
                          key={video.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer group border ${
                            currentVideo?.id === video.id
                              ? 'border-primary/30 shadow-sm'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          style={{
                            backgroundColor:
                              currentVideo?.id === video.id
                                ? colorScheme.primary + '10'
                                : colorScheme.surface,
                            borderColor:
                              currentVideo?.id === video.id
                                ? colorScheme.primary + '30'
                                : colorScheme.border,
                          }}
                          onClick={() => handleVideoSelect(video)}
                        >
                          <div className="relative flex-shrink-0">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-16 h-12 rounded object-cover border"
                              style={{ borderColor: colorScheme.border }}
                            />
                            <div
                              className={`absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center transition-opacity ${
                                currentVideo?.id === video.id
                                  ? 'opacity-100'
                                  : 'opacity-0 group-hover:opacity-100'
                              }`}
                            >
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            {currentVideo?.id === video.id && (
                              <div
                                className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                                style={{ backgroundColor: colorScheme.primary }}
                              ></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <BaseText
                              className="text-sm font-medium md:font-semibold truncate leading-tight"
                              style={{ color: colorScheme.black }}
                            >
                              {video.title}
                            </BaseText>
                            <div className="flex items-center gap-2 mt-1">
                              <LightText
                                className="text-xs truncate"
                                style={{ color: colorScheme.textSecondary }}
                              >
                                {video.series}
                              </LightText>
                              <span
                                className="text-xs"
                                style={{ color: colorScheme.border }}
                              >
                                •
                              </span>
                              <LightText
                                className="text-xs"
                                style={{ color: colorScheme.textSecondary }}
                              >
                                {new Date(
                                  video.publishedAt
                                ).toLocaleDateString()}
                              </LightText>
                            </div>
                          </div>
                          {video === videos[0] && (
                            <span
                              className="px-2 py-1 rounded text-xs font-medium flex-shrink-0"
                              style={{
                                backgroundColor: colorScheme.error + '10',
                                color: colorScheme.error,
                              }}
                            >
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
                          className="font-semibold md:font-bold text-sm md:text-base transition-colors flex items-center justify-center gap-1 mx-auto"
                          style={{ color: colorScheme.primary }}
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
        </FlexboxLayout>
      </Container>
    </Section>
  );
};

const SermonUtil = () => {
  const { colorScheme } = useTheme();
  const [isClient, setIsClient] = useState(false); // Added client check

  // Add useEffect to set client state
  useEffect(() => {
    setIsClient(true);
  }, []);

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
    groupedSeries,
    ungroupedSeries,
    hasMoreVideos,
    seriesOptions,
    preacherOptions,

    // Refs
    cardsRef,
    horizontalScrollRef,
    gridRef,
    horizontalGridRef,

    // Handlers
    handleSeriesClick,
    handleGroupClick,
    handleLoadMore,
    handleSearchChange,
    handleSeriesFilterChange,
    handlePreacherChange,
    handleSortChange,
    handleResetFilters,
  } = useSermonUtil();

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading sermons...</div>
      </div>
    );
  }

  const SearchFiltersComponent = () => (
    <div className="max-w-6xl mx-auto mb-12">
      <div
        className="rounded-2xl p-6 border"
        style={{
          backgroundColor: colorScheme.black,
          borderColor: colorScheme.border,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label
              className="block text-sm md:text-base font-medium mb-2"
              style={{ color: colorScheme.primary }}
            >
              Search Messages
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search by title, description, series, or preacher..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400"
              style={{
                backgroundColor: colorScheme.white,
                borderColor: colorScheme.primary,
                color: colorScheme.black,
              }}
            />
          </div>
          <div>
            <label
              className="block text-sm md:text-base font-medium mb-2"
              style={{ color: colorScheme.primary }}
            >
              Series
            </label>
            <select
              value={selectedSeries}
              onChange={e => handleSeriesFilterChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{
                backgroundColor: colorScheme.white,
                borderColor: colorScheme.border,
                color: colorScheme.black,
              }}
            >
              {seriesOptions.map((series: string) => (
                <option key={series} value={series}>
                  {series === 'all' ? 'All Series' : series}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block text-sm md:text-base font-medium mb-2"
              style={{ color: colorScheme.primary }}
            >
              Preacher
            </label>
            <select
              value={selectedPreacher}
              onChange={e => handlePreacherChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{
                backgroundColor: colorScheme.white,
                borderColor: colorScheme.border,
                color: colorScheme.black,
              }}
            >
              {preacherOptions.map((preacher: string) => (
                <option key={preacher} value={preacher}>
                  {preacher === 'all' ? 'All Preachers' : preacher}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block text-sm md:text-base font-medium mb-2"
              style={{ color: colorScheme.primary }}
            >
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e =>
                handleSortChange(
                  e.target.value as 'newest' | 'oldest' | 'popular'
                )
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{
                backgroundColor: colorScheme.white,
                borderColor: colorScheme.border,
                color: colorScheme.black,
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          <div className="text-center lg:text-right">
            <LightText
              className="text-sm md:text-base"
              style={{ color: colorScheme.textSecondary }}
            >
              Showing{' '}
              <BaseText
                className="font-semibold md:font-bold inline"
                style={{ color: colorScheme.primary }}
              >
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
                className="text-sm md:text-base font-medium mt-1 transition-colors"
                style={{ color: colorScheme.primary }}
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
      >
        {groupedSeries.map((group: GroupedSeriesData) => (
          <div key={group.name} className="snap-start">
            <SeriesCard
              group={group}
              onClick={() => handleGroupClick(group.searchTerms)}
            />
          </div>
        ))}
      </div>
      <div className="text-center mt-2">
        <LightText
          className="text-sm md:text-base"
          style={{ color: colorScheme.black }}
        >
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
      {groupedSeries.map((group: GroupedSeriesData) => (
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
      >
        {displayedVideos.map((video: YouTubeVideo) => (
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
          <LightText
            className="text-sm md:text-base"
            style={{ color: colorScheme.black }}
          >
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
      {displayedVideos.map((video: YouTubeVideo) => (
        <div key={video.id} className="sermon-card">
          <SermonCardComponent video={video} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="sermon-util">
      {/* Featured Section */}
      <FeaturedSection />

      {/* Series Cards Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: colorScheme.black }}
      >
        <Container size="xl">
          {!videos.length ? (
            <FlexboxLayout
              direction="column"
              justify="center"
              align="center"
              gap="md"
              className="text-center"
            >
              <div className="animate-pulse">
                <div
                  className="h-8 rounded w-1/4 mx-auto mb-4"
                  style={{ backgroundColor: colorScheme.black }}
                ></div>
                <div
                  className="h-4 rounded w-1/2 mx-auto mb-12"
                  style={{ backgroundColor: colorScheme.surface }}
                ></div>
              </div>
              <GridboxLayout
                columns={1}
                responsive={{ sm: 1, md: 2, lg: 3 }}
                gap="lg"
                className="max-w-6xl mx-auto"
              >
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className="rounded-2xl h-64 animate-pulse"
                    style={{ backgroundColor: colorScheme.surface }}
                  ></div>
                ))}
              </GridboxLayout>
            </FlexboxLayout>
          ) : (
            <>
              <FlexboxLayout
                direction="column"
                gap="lg"
                className="mb-10 sm:mb-12"
              >
                <BaseText
                  className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold md:font-extrabold text-center"
                  style={{ color: colorScheme.white }}
                >
                  Featured Categories
                </BaseText>

                <MobileHorizontalScroll />
                <DesktopGridSeries />
              </FlexboxLayout>
              {ungroupedSeries.length > 0 && (
                <FlexboxLayout
                  direction="column"
                  gap="lg"
                  className="mb-10 sm:mb-12"
                >
                  <BaseText
                    className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold md:font-extrabold text-center"
                    style={{ color: colorScheme.black }}
                  >
                    More Sermons
                  </BaseText>

                  <div className="block lg:hidden">
                    <div className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pl-4">
                      {ungroupedSeries.map((series: UngroupedSeriesData) => (
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
                      <LightText
                        className="text-sm md:text-base"
                        style={{ color: colorScheme.textSecondary }}
                      >
                        ← Scroll horizontally →
                      </LightText>
                    </div>
                  </div>
                  <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {ungroupedSeries.map((series: UngroupedSeriesData) => (
                      <SeriesCard
                        key={series.name}
                        group={series}
                        isUngrouped={true}
                        onClick={() => handleSeriesClick(series.name)}
                      />
                    ))}
                  </div>
                </FlexboxLayout>
              )}
              <FlexboxLayout justify="center" className="mt-8 sm:mt-12">
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
                    e.currentTarget.style.backgroundColor =
                      colorScheme.primaryDark;
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.backgroundColor = colorScheme.primary;
                  }}
                >
                  View Complete Library
                </Button>
              </FlexboxLayout>
            </>
          )}
        </Container>
      </Section>

      {/* Sermons Grid Section */}
      <Section
        background="image"
        backgroundImage={Banner_2.src}
        overlay={true}
        overlayOpacity={50}
        padding="lg"
        fullHeight={false}
      >
        <Container size="xl">
          <div className="mb-6 sm:mb-8">
            <SearchFiltersComponent />
          </div>
          <MobileHorizontalGrid />
          <DesktopSermonsGrid />
          {filteredVideos.length === 0 && !loading && (
            <FlexboxLayout
              direction="column"
              justify="center"
              align="center"
              gap="md"
              className="text-center py-8 sm:py-12"
            >
              <LightText
                className="text-base md:text-lg lg:text-xl mb-3 sm:mb-4"
                style={{ color: colorScheme.textSecondary }}
              >
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
                  e.currentTarget.style.backgroundColor =
                    colorScheme.primaryDark;
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.backgroundColor = colorScheme.primary;
                }}
              >
                Clear all filters
              </Button>
            </FlexboxLayout>
          )}
          {hasMoreVideos && filteredVideos.length > 0 && (
            <FlexboxLayout justify="center" className="mt-6 sm:mt-8">
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
                    e.currentTarget.style.backgroundColor =
                      colorScheme.primaryDark;
                  }
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.backgroundColor = colorScheme.primary;
                }}
              >
                {loading ? 'Loading...' : `Load More Videos`}
              </Button>
            </FlexboxLayout>
          )}
          {loading && (
            <FlexboxLayout justify="center" className="py-6 sm:py-8">
              <div
                className="animate-spin rounded-full border-b-2 mx-auto"
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderColor: colorScheme.primary,
                }}
              ></div>
            </FlexboxLayout>
          )}
        </Container>
      </Section>
    </div>
  );
};

export default SermonUtil;
