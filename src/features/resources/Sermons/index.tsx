'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { H2, BaseText, LightText, H1 } from '@/shared/text';
import YouTubePlayer from './YoutubePlayer';
import Image from 'next/image';
import { Banner_2, WisdomeHouseLogo } from '@/shared/assets';
import { useSermonUtil } from '@/shared/utils/hooks/useSermon';
import { useTheme } from '@/shared/contexts/ThemeContext';
import {
  YouTubeVideo,
  GroupedSeriesData,
  UngroupedSeriesData,
} from '@/lib/types';
import { seriesGroups } from '@/lib/data';
import Button from '@/shared/utils/buttons/CustomButton';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/shared/layout';

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
  const { colorScheme, isDark } = useTheme();
  const isDarkMode = isDark;

  const themeStyles = useMemo(
    () => ({
      cardBackground: isDarkMode ? colorScheme.card : colorScheme.surface,
      textColor: isDarkMode ? colorScheme.text : colorScheme.heading,
      secondaryTextColor: isDarkMode
        ? colorScheme.textSecondary
        : colorScheme.textTertiary,
      borderColor: colorScheme.border,
    }),
    [isDarkMode, colorScheme]
  );

  return (
    <div
      className="series-card group w-[280px] flex-shrink-0 cursor-pointer rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-auto sm:p-6"
      onClick={onClick}
      style={{
        backgroundColor: themeStyles.cardBackground,
        borderColor: themeStyles.borderColor,
      }}
    >
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 bg-gradient-to-br shadow-md transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 ${
            'color' in group ? group.color : 'from-gray-400 to-gray-600'
          }`}
          style={{ borderColor: colorScheme.primary }}
        >
          <div
            className="relative h-8 w-8 overflow-hidden rounded-full border-2 sm:h-10 sm:w-10"
            style={{ borderColor: `${colorScheme.primary}30` }}
          >
            <Image
              src={WisdomeHouseLogo}
              alt="WisdomHouse"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 32px, 40px"
            />
          </div>
        </div>

        {group.latestThumbnail && (
          <img
            src={group.latestThumbnail}
            alt={group.name}
            className="h-10 w-12 rounded-lg object-cover shadow-sm transition-shadow group-hover:shadow-md sm:h-12 sm:w-16"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      <BaseText
        className="mb-2 line-clamp-2 text-base font-semibold leading-tight transition-colors group-hover:text-primary md:text-lg lg:text-xl md:font-bold"
        style={{ color: themeStyles.textColor }}
      >
        {group.name}
      </BaseText>

      <LightText
        className="mb-2 line-clamp-2 text-xs leading-relaxed md:text-sm sm:mb-3"
        style={{ color: themeStyles.secondaryTextColor }}
      >
        {'description' in group
          ? group.description
          : `${group.count} messages available`}
      </LightText>

      {!isUngrouped && 'uniqueSeries' in group && (
        <div className="mb-2">
          <span
            className="rounded-full px-2 py-1 text-xs font-medium md:text-sm"
            style={{
              backgroundColor: isDarkMode
                ? colorScheme.opacity.primary10
                : colorScheme.opacity.primary20,
              color: colorScheme.primary,
            }}
          >
            {group.uniqueSeries.length} series
          </span>
        </div>
      )}

      <LightText
        className="mb-3 text-sm md:text-base sm:mb-4"
        style={{ color: themeStyles.secondaryTextColor }}
      >
        {group.count} {group.count === 1 ? 'message' : 'messages'}
      </LightText>

      {!isUngrouped &&
        'uniqueSeries' in group &&
        group.uniqueSeries.length > 0 && (
          <div className="mt-2">
            <LightText
              className="mb-1 text-xs font-medium md:text-sm"
              style={{ color: themeStyles.secondaryTextColor }}
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
                      className="mr-2 h-1 w-1 rounded-full"
                      style={{ backgroundColor: colorScheme.primary }}
                    />
                    <LightText
                      className="truncate text-xs md:text-sm"
                      style={{ color: themeStyles.secondaryTextColor }}
                    >
                      {seriesName}
                    </LightText>
                  </div>
                ))}

              {group.uniqueSeries.length > 2 && (
                <div className="flex items-center">
                  <div
                    className="mr-2 h-1 w-1 rounded-full"
                    style={{ backgroundColor: colorScheme.primary }}
                  />
                  <LightText
                    className="text-xs md:text-sm"
                    style={{ color: themeStyles.secondaryTextColor }}
                  >
                    +{group.uniqueSeries.length - 2} more
                  </LightText>
                </div>
              )}
            </div>
          </div>
        )}

      <div
        className="mt-2 flex items-center justify-between border-t pt-3"
        style={{ borderColor: themeStyles.borderColor }}
      >
        <BaseText
          className="text-sm font-semibold transition-colors group-hover:text-primaryDark md:text-base md:font-bold"
          style={{ color: colorScheme.primary }}
        >
          {isUngrouped ? 'View Series' : 'View Category'}
        </BaseText>
        <span
          className="transform transition-transform group-hover:translate-x-1"
          style={{ color: colorScheme.primary }}
        >
          →
        </span>
      </div>
    </div>
  );
};

interface SermonCardProps {
  video: YouTubeVideo;
}

const SermonCardComponent = ({ video }: SermonCardProps) => {
  const { colorScheme, isDark } = useTheme();
  const [showPlayer, setShowPlayer] = useState(false);

  const isDarkMode = isDark;

  const themeStyles = useMemo(
    () => ({
      cardBackground: isDarkMode ? colorScheme.card : colorScheme.surface,
      textColor: isDarkMode ? colorScheme.text : colorScheme.heading,
      secondaryTextColor: isDarkMode
        ? colorScheme.textSecondary
        : colorScheme.textTertiary,
      borderColor: colorScheme.border,
      modalBackground: isDarkMode ? colorScheme.surface : colorScheme.white,
      modalTextColor: isDarkMode ? colorScheme.text : colorScheme.heading,
    }),
    [isDarkMode, colorScheme]
  );

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const formatViewCount = useCallback((count: string): string => {
    return parseInt(count || '0', 10).toLocaleString();
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = colorScheme.primaryDark;
    },
    [colorScheme.primaryDark]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = colorScheme.primary;
    },
    [colorScheme.primary]
  );

  return (
    <div
      className="overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: themeStyles.cardBackground,
        borderColor: themeStyles.borderColor,
      }}
    >
      <div
        className="relative h-40 cursor-pointer overflow-hidden sm:h-44"
        onClick={() => setShowPlayer(true)}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-4">
          <FlexboxLayout gap="sm">
            <Button
              variant="primary"
              size="sm"
              curvature="full"
              className="px-4 py-2 text-sm font-semibold shadow-md transition-colors"
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Watch Now
            </Button>
          </FlexboxLayout>
        </div>
        <div className="absolute right-3 top-3 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
          {formatViewCount(video.viewCount)} views
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30">
            <div className="ml-1 h-0 w-0 border-b-[8px] border-l-[12px] border-t-[8px] border-b-transparent border-l-white border-t-transparent" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <FlexboxLayout gap="sm" className="mb-3">
          <span
            className="rounded px-2 py-1 text-xs font-medium"
            style={{
              backgroundColor: isDarkMode
                ? colorScheme.opacity.primary10
                : colorScheme.opacity.primary20,
              color: colorScheme.primary,
            }}
          >
            {video.series}
          </span>
          <span
            className="rounded px-2 py-1 text-xs font-medium"
            style={{
              backgroundColor: isDarkMode
                ? colorScheme.surfaceVariant
                : colorScheme.opacity.black10,
              color: themeStyles.secondaryTextColor,
            }}
          >
            {video.preacher}
          </span>
        </FlexboxLayout>

        <H1
          className="mb-3 line-clamp-2 text-lg font-bold leading-tight md:text-xl lg:text-2xl"
          style={{ color: themeStyles.textColor }}
        >
          {video.title}
        </H1>

        <LightText
          className="mb-4 line-clamp-2 text-sm leading-relaxed md:text-base"
          style={{ color: themeStyles.secondaryTextColor }}
        >
          {video.description}
        </LightText>

        <FlexboxLayout
          justify="between"
          align="center"
          className="text-sm md:text-base"
          style={{ color: themeStyles.secondaryTextColor }}
        >
          <span>{formatDate(video.publishedAt)}</span>
          <span>{video.duration}</span>
        </FlexboxLayout>
      </div>

      {showPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <div
            className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              backgroundColor: themeStyles.modalBackground,
              borderColor: themeStyles.borderColor,
            }}
          >
            <FlexboxLayout
              justify="between"
              align="center"
              className="flex-shrink-0 border-b p-4"
              style={{
                borderColor: themeStyles.borderColor,
                backgroundColor: themeStyles.modalBackground,
              }}
            >
              <BaseText
                className="line-clamp-1 pr-4 text-lg font-semibold md:text-xl"
                style={{ color: themeStyles.modalTextColor }}
              >
                {video.title}
              </BaseText>

              <button
                onClick={() => setShowPlayer(false)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                style={{
                  color: themeStyles.modalTextColor,
                  backgroundColor: isDarkMode
                    ? colorScheme.opacity.white10
                    : colorScheme.opacity.black10,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = isDarkMode
                    ? colorScheme.opacity.white20
                    : colorScheme.opacity.black20;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = isDarkMode
                    ? colorScheme.opacity.white10
                    : colorScheme.opacity.black10;
                }}
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </FlexboxLayout>

            <div className="flex-1 overflow-hidden p-0">
              <YouTubePlayer
                videoId={video.id}
                title={video.title}
                className="h-full w-full"
                iframeClassName="h-full w-full"
              />
            </div>

            <div
              className="flex-shrink-0 border-t p-4"
              style={{ borderColor: themeStyles.borderColor }}
            >
              <FlexboxLayout direction="column" gap="sm">
                <BaseText
                  className="text-base font-semibold"
                  style={{ color: themeStyles.modalTextColor }}
                >
                  {video.series} • {video.preacher}
                </BaseText>
                <LightText
                  className="text-sm"
                  style={{ color: themeStyles.secondaryTextColor }}
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

interface SearchFiltersProps {
  searchTerm: string;
  selectedSeries: string;
  selectedPreacher: string;
  selectedYear: string;
  seriesOptions: string[];
  preacherOptions: string[];
  yearOptions: string[];
  handleSearchChange: (value: string) => void;
  handleSeriesFilterChange: (value: string) => void;
  handlePreacherChange: (value: string) => void;
  handleYearChange: (value: string) => void;
  handleResetFilters: () => void;
  filteredVideos: YouTubeVideo[];
}

const SearchFiltersComponent = ({
  searchTerm,
  selectedSeries,
  selectedPreacher,
  selectedYear,
  seriesOptions,
  preacherOptions,
  yearOptions,
  handleSearchChange,
  handleSeriesFilterChange,
  handlePreacherChange,
  handleYearChange,
  filteredVideos,
}: SearchFiltersProps) => {
  const { colorScheme, isDark } = useTheme();
  const isDarkMode = isDark;

  const themeStyles = useMemo(
    () => ({
      cardBackground: isDarkMode ? colorScheme.card : colorScheme.surface,
      textColor: isDarkMode ? colorScheme.text : colorScheme.heading,
      borderColor: colorScheme.border,
      inputBackground: isDarkMode ? colorScheme.surface : colorScheme.white,
      inputBorderColor: colorScheme.border,
    }),
    [isDarkMode, colorScheme]
  );

  return (
    <div className="mx-auto mb-10 max-w-6xl sm:mb-12">
      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          backgroundColor: themeStyles.cardBackground,
          borderColor: themeStyles.borderColor,
        }}
      >
        <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: themeStyles.textColor }}
            >
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Title, series, preacher, or keywords..."
              className="w-full rounded-lg border px-4 py-2 text-sm placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-primary"
              style={{
                backgroundColor: themeStyles.inputBackground,
                borderColor: themeStyles.inputBorderColor,
                color: themeStyles.textColor,
              }}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: themeStyles.textColor }}
            >
              Series
            </label>
            <select
              value={selectedSeries}
              onChange={e => handleSeriesFilterChange(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-primary"
              style={{
                backgroundColor: themeStyles.inputBackground,
                borderColor: themeStyles.inputBorderColor,
                color: themeStyles.textColor,
              }}
            >
              {seriesOptions.map((series: string) => (
                <option key={series} value={series}>
                  {series === 'all'
                    ? 'All Series'
                    : series.startsWith('group:')
                      ? `Group: ${series.replace('group:', '').trim()}`
                      : series}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: themeStyles.textColor }}
            >
              Preacher
            </label>
            <select
              value={selectedPreacher}
              onChange={e => handlePreacherChange(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-primary"
              style={{
                backgroundColor: themeStyles.inputBackground,
                borderColor: themeStyles.inputBorderColor,
                color: themeStyles.textColor,
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
              className="mb-2 block text-sm font-medium"
              style={{ color: themeStyles.textColor }}
            >
              Year
            </label>
            <select
              value={selectedYear}
              onChange={e => handleYearChange(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-primary"
              style={{
                backgroundColor: themeStyles.inputBackground,
                borderColor: themeStyles.inputBorderColor,
                color: themeStyles.textColor,
              }}
            >
              {yearOptions.map((year: string) => (
                <option key={year} value={year}>
                  {year === 'all' ? 'All Years' : year}
                </option>
              ))}
            </select>
          </div>

          <div className="text-left lg:text-right">
            <LightText
              className="text-sm"
              style={{ color: colorScheme.primary }}
            >
              Showing{' '}
              <BaseText
                className="inline font-semibold"
                style={{ color: colorScheme.primary }}
              >
                {filteredVideos.length}
              </BaseText>{' '}
              messages
            </LightText>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickFiltersProps {
  selectedSeries: string;
  onSelectGroup: (searchTerms: string[], name: string) => void;
  onReset: () => void;
}

const QuickFilters = ({
  selectedSeries,
  onSelectGroup,
  onReset,
}: QuickFiltersProps) => {
  const { colorScheme, isDark } = useTheme();
  const isDarkMode = isDark;

  const chips = useMemo(
    () => [
      'Monday Morning Prayers',
      'Celebration & Communion',
      'Sunday Services',
      'Wisdom Power Conference',
    ],
    []
  );

  const chipGroups = seriesGroups.filter(group =>
    chips.some(name => group.name.toLowerCase() === name.toLowerCase())
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chipGroups.map(group => {
        const value = `group:${group.name}`;
        const isActive = selectedSeries === value;

        return (
          <button
            key={group.name}
            onClick={() => onSelectGroup(group.searchTerms, group.name)}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm"
            style={{
              backgroundColor: isActive
                ? colorScheme.primary
                : isDarkMode
                  ? colorScheme.opacity.white10
                  : colorScheme.opacity.black10,
              color: isActive ? colorScheme.black : colorScheme.primary,
              borderColor: isActive
                ? colorScheme.primary
                : `${colorScheme.primary}50`,
            }}
          >
            {group.name}
          </button>
        );
      })}

      <button
        onClick={onReset}
        className="rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm"
        style={{
          backgroundColor: 'transparent',
          color: colorScheme.primary,
          borderColor: `${colorScheme.primary}50`,
        }}
      >
        Reset
      </button>
    </div>
  );
};

interface ResultsToolbarProps {
  totalCount: number;
  filteredCount: number;
  searchTerm: string;
  selectedSeries: string;
  selectedPreacher: string;
  selectedYear: string;
  sortBy: 'newest' | 'oldest' | 'popular';
  onSortChange: (value: 'newest' | 'oldest' | 'popular') => void;
  onClear: () => void;
}

const ResultsToolbar = ({
  totalCount,
  filteredCount,
  searchTerm,
  selectedSeries,
  selectedPreacher,
  selectedYear,
  sortBy,
  onSortChange,
  onClear,
}: ResultsToolbarProps) => {
  const { colorScheme, isDark } = useTheme();
  const isDarkMode = isDark;

  const activeFilters = [
    searchTerm ? `Search: "${searchTerm}"` : null,
    selectedSeries !== 'all'
      ? selectedSeries.startsWith('group:')
        ? `Group: ${selectedSeries.replace('group:', '').trim()}`
        : `Series: ${selectedSeries}`
      : null,
    selectedPreacher !== 'all' ? `Preacher: ${selectedPreacher}` : null,
    selectedYear !== 'all' ? `Year: ${selectedYear}` : null,
  ].filter(Boolean);

  return (
    <div
      className="mb-6 rounded-2xl border p-4 sm:mb-8 sm:p-5"
      style={{ borderColor: `${colorScheme.primary}40` }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <BaseText
            className="text-sm font-semibold"
            style={{
              color: isDarkMode ? colorScheme.text : colorScheme.heading,
            }}
          >
            Results: {filteredCount} of {totalCount}
          </BaseText>

          {activeFilters.length > 0 && (
            <LightText
              className="mt-1 text-xs sm:text-sm"
              style={{
                color: isDarkMode
                  ? colorScheme.textSecondary
                  : colorScheme.textTertiary,
              }}
            >
              {activeFilters.join(' • ')}
            </LightText>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label
              className="text-xs font-semibold sm:text-sm"
              style={{
                color: isDarkMode ? colorScheme.text : colorScheme.heading,
              }}
            >
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={e =>
                onSortChange(e.target.value as 'newest' | 'oldest' | 'popular')
              }
              className="rounded-lg border px-3 py-2 text-xs sm:text-sm"
              style={{
                backgroundColor: isDarkMode
                  ? colorScheme.surface
                  : colorScheme.white,
                borderColor: `${colorScheme.primary}40`,
                color: isDarkMode ? colorScheme.text : colorScheme.heading,
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {activeFilters.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs font-semibold sm:text-sm"
              style={{ color: colorScheme.primary }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface MobileHorizontalScrollProps {
  groupedSeries: GroupedSeriesData[];
  handleGroupClick: (searchTerms: string[], groupName?: string) => void;
}

const MobileHorizontalScroll = ({
  groupedSeries,
  handleGroupClick,
}: MobileHorizontalScrollProps) => {
  const { colorScheme, isDark } = useTheme();
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="block lg:hidden">
      <div
        ref={horizontalScrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory space-x-4 overflow-x-auto pb-4 pl-4"
      >
        {groupedSeries.map((group: GroupedSeriesData) => (
          <div key={group.name} className="snap-start">
            <SeriesCard
              group={group}
              onClick={() => handleGroupClick(group.searchTerms, group.name)}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 text-center">
        <LightText
          className="text-sm md:text-base"
          style={{
            color: isDark
              ? colorScheme.textSecondary
              : colorScheme.textTertiary,
          }}
        >
          ← Scroll horizontally →
        </LightText>
      </div>
    </div>
  );
};

interface DesktopGridSeriesProps {
  groupedSeries: GroupedSeriesData[];
  handleGroupClick: (searchTerms: string[], groupName?: string) => void;
  cardsRef: React.RefObject<HTMLDivElement | null>;
}

const DesktopGridSeries = ({
  groupedSeries,
  handleGroupClick,
  cardsRef,
}: DesktopGridSeriesProps) => (
  <div
    ref={cardsRef}
    className="hidden max-w-7xl grid-cols-1 gap-6 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
  >
    {groupedSeries.map((group: GroupedSeriesData) => (
      <SeriesCard
        key={group.name}
        group={group}
        onClick={() => handleGroupClick(group.searchTerms, group.name)}
      />
    ))}
  </div>
);

interface MobileHorizontalGridProps {
  displayedVideos: YouTubeVideo[];
  horizontalGridRef: React.RefObject<HTMLDivElement | null>;
}

const MobileHorizontalGrid = ({
  displayedVideos,
  horizontalGridRef,
}: MobileHorizontalGridProps) => {
  const { colorScheme, isDark } = useTheme();

  return (
    <div className="block lg:hidden">
      <div
        ref={horizontalGridRef}
        className="scrollbar-hide flex snap-x snap-mandatory space-x-4 overflow-x-auto pb-4 pl-4"
      >
        {displayedVideos.map((video: YouTubeVideo) => (
          <div
            key={video.id}
            className="sermon-card w-[280px] flex-shrink-0 snap-start"
          >
            <SermonCardComponent video={video} />
          </div>
        ))}
      </div>

      {displayedVideos.length > 1 && (
        <div className="mt-2 text-center">
          <LightText
            className="text-sm md:text-base"
            style={{
              color: isDark
                ? colorScheme.textSecondary
                : colorScheme.textTertiary,
            }}
          >
            ← Scroll horizontally →
          </LightText>
        </div>
      )}
    </div>
  );
};

interface DesktopSermonsGridProps {
  displayedVideos: YouTubeVideo[];
  gridRef: React.RefObject<HTMLDivElement | null>;
}

const DesktopSermonsGrid = ({
  displayedVideos,
  gridRef,
}: DesktopSermonsGridProps) => (
  <div
    ref={gridRef}
    className="mb-8 hidden grid-cols-1 gap-4 sm:mb-12 sm:gap-6 lg:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
  >
    {displayedVideos.map((video: YouTubeVideo) => (
      <div key={video.id} className="sermon-card">
        <SermonCardComponent video={video} />
      </div>
    ))}
  </div>
);

interface CuratedSectionsProps {
  videos: YouTubeVideo[];
  onSelectGroup: (searchTerms: string[], groupName?: string) => void;
}

const CuratedSections = ({ videos, onSelectGroup }: CuratedSectionsProps) => {
  const { colorScheme, isDark } = useTheme();
  const isDarkMode = isDark;

  const curatedGroups = useMemo(
    () => [
      {
        title: 'Monday Morning Prayers',
        groupName: 'Monday Morning Prayers',
        description: 'Start your week with focused prayer and declarations.',
        searchTerms: ['MONDAY MORNING PRAYER MOMENT WITH BISHOP'],
      },
      {
        title: 'Celebration Service',
        groupName: 'Celebration & Communion',
        description: 'Celebration, thanksgiving, and communion services.',
        searchTerms: [
          'CELEBRATION & COMMUNION SERVICE',
          'THANKSGIVING & COMMUNION SERVICE',
          'END OF THE YEAR THANKSGIVING',
          'NOVEMBER SUPERNATURAL SERVICE',
          'CELEBRATION SERVICE',
        ],
      },
    ],
    []
  );

  const matchesGroup = useCallback((video: YouTubeVideo, terms: string[]) => {
    const series = (video.series || '').toUpperCase();
    return terms.some(term => series.includes(term.toUpperCase()));
  }, []);

  const sections = useMemo(
    () =>
      curatedGroups.map(group => ({
        ...group,
        videos: videos.filter(video => matchesGroup(video, group.searchTerms)),
      })),
    [curatedGroups, videos, matchesGroup]
  );

  const hasAnySectionVideos = useMemo(
    () => sections.some(section => section.videos.length > 0),
    [sections]
  );

  if (!hasAnySectionVideos) {
    return null;
  }

  return (
    <div className="mb-8 sm:mb-10">
      {sections.map(section => {
        if (!section.videos.length) return null;

        const preview = section.videos.slice(0, 4);

        return (
          <div key={section.title} className="mb-8 sm:mb-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <BaseText
                  className="text-lg font-semibold sm:text-xl"
                  style={{
                    color: isDarkMode ? colorScheme.text : colorScheme.heading,
                  }}
                >
                  {section.title}
                </BaseText>
                <LightText
                  className="text-sm"
                  style={{
                    color: isDarkMode
                      ? colorScheme.textSecondary
                      : colorScheme.textTertiary,
                  }}
                >
                  {section.description}
                </LightText>
              </div>

              <button
                onClick={() =>
                  onSelectGroup(section.searchTerms, section.groupName)
                }
                className="text-sm font-semibold transition-colors"
                style={{ color: colorScheme.primary }}
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {preview.map(video => (
                <div key={video.id} className="sermon-card">
                  <SermonCardComponent video={video} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface FeaturedSectionProps {
  videos: YouTubeVideo[];
  recentVideos: YouTubeVideo[];
  currentVideo: YouTubeVideo | null;
  playerKey: string;
  handleVideoSelect: (video: YouTubeVideo) => void;
  handleWatchSeries: () => void;
  handleViewMore: () => void;
}

const FeaturedSection = ({
  videos,
  recentVideos,
  currentVideo,
  playerKey,
  handleVideoSelect,
  handleWatchSeries,
  handleViewMore,
}: FeaturedSectionProps) => {
  const { colorScheme, isDark } = useTheme();
  const isDarkMode = isDark;

  const themeStyles = useMemo(
    () => ({
      sectionBackground: isDarkMode
        ? colorScheme.background
        : colorScheme.backgroundSecondary,
      textColor: isDarkMode ? colorScheme.text : colorScheme.heading,
      secondaryTextColor: isDarkMode
        ? colorScheme.textSecondary
        : colorScheme.textTertiary,
      cardBackground: isDarkMode ? colorScheme.card : colorScheme.surface,
      borderColor: colorScheme.border,
    }),
    [isDarkMode, colorScheme]
  );

  return (
    <Section
      background="dark"
      padding="lg"
      fullHeight={false}
      style={{ backgroundColor: themeStyles.sectionBackground }}
    >
      <Container size="xl">
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="lg"
          className="w-full text-center"
        >
          <H2
            className="mb-8 text-2xl font-bold md:mb-12 md:text-3xl lg:text-4xl xl:text-5xl md:font-extrabold"
            style={{ color: themeStyles.textColor }}
          >
            Latest from WisdomHouse
          </H2>

          <div
            className="mx-auto w-full max-w-7xl rounded-2xl border p-4 shadow-lg sm:p-6 lg:p-8"
            style={{
              backgroundColor: themeStyles.cardBackground,
              borderColor: themeStyles.borderColor,
            }}
          >
            <div className="flex w-full flex-col items-start gap-8 lg:flex-row lg:gap-12">
              <div className="w-full lg:w-8/12 xl:w-7/12">
                <div
                  className="overflow-hidden rounded-2xl border-2 bg-black shadow-xl"
                  style={{ borderColor: `${colorScheme.primary}20` }}
                >
                  {currentVideo ? (
                    <div className="relative aspect-video w-full">
                      <YouTubePlayer
                        key={playerKey}
                        videoId={currentVideo.id}
                        title={currentVideo.title}
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex aspect-video w-full items-center justify-center rounded-2xl"
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

                <div className="mt-6 hidden text-left lg:block">
                  <div className="mb-3">
                    <BaseText
                      className="text-sm font-semibold uppercase tracking-wide md:text-base md:font-bold"
                      style={{ color: themeStyles.textColor }}
                    >
                      {currentVideo === videos[0]
                        ? 'Latest Upload'
                        : 'Now Playing'}
                    </BaseText>
                  </div>

                  <BaseText
                    className="mb-4 text-xl font-bold leading-tight md:text-2xl lg:text-3xl md:font-extrabold"
                    style={{ color: themeStyles.textColor }}
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
                          className="rounded-full px-3 py-1 text-xs font-medium sm:text-sm"
                          style={{
                            backgroundColor: isDarkMode
                              ? colorScheme.opacity.primary10
                              : colorScheme.opacity.primary20,
                            color: colorScheme.primary,
                          }}
                        >
                          {currentVideo.series}
                        </span>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-medium sm:text-sm"
                          style={{
                            backgroundColor: isDarkMode
                              ? colorScheme.surfaceVariant
                              : colorScheme.opacity.black10,
                            color: colorScheme.primary,
                          }}
                        >
                          {currentVideo.preacher}
                        </span>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-medium sm:text-sm"
                          style={{
                            backgroundColor: isDarkMode
                              ? colorScheme.opacity.primary10
                              : colorScheme.opacity.primary20,
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
                          className="text-sm leading-relaxed md:text-base"
                          style={{ color: themeStyles.secondaryTextColor }}
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
                        >
                          View Full Series
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-4/12 xl:w-5/12">
                <div className="mb-6 lg:hidden">
                  <div className="mb-3">
                    <BaseText
                      className="text-sm font-semibold uppercase tracking-wide md:text-base md:font-bold"
                      style={{ color: themeStyles.textColor }}
                    >
                      {currentVideo === videos[0]
                        ? 'Latest Upload'
                        : 'Now Playing'}
                    </BaseText>
                  </div>

                  <BaseText
                    className="mb-4 line-clamp-3 text-xl font-bold leading-tight md:text-2xl md:font-extrabold"
                    style={{ color: themeStyles.textColor }}
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
                          className="rounded-full px-3 py-1 text-xs font-medium sm:text-sm"
                          style={{
                            backgroundColor: isDarkMode
                              ? colorScheme.opacity.primary10
                              : colorScheme.opacity.primary20,
                            color: colorScheme.primary,
                          }}
                        >
                          {currentVideo.series}
                        </span>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-medium sm:text-sm"
                          style={{
                            backgroundColor: isDarkMode
                              ? colorScheme.surfaceVariant
                              : colorScheme.opacity.black10,
                            color: colorScheme.primary,
                          }}
                        >
                          {currentVideo.preacher}
                        </span>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-medium sm:text-sm"
                          style={{
                            backgroundColor: isDarkMode
                              ? colorScheme.opacity.primary10
                              : colorScheme.opacity.primary20,
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
                          className="max-h-24 overflow-y-auto pr-2 text-sm leading-relaxed md:text-base"
                          style={{ color: themeStyles.secondaryTextColor }}
                        >
                          {currentVideo.description ||
                            'Watch our latest content from WisdomHouse.'}
                        </LightText>
                      </div>

                      <Button
                        variant="primary"
                        size="md"
                        curvature="full"
                        className="mb-6 w-full py-3 font-semibold transition-colors"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                        }}
                        onClick={handleWatchSeries}
                      >
                        View Full Series
                      </Button>
                    </>
                  )}
                </div>

                {recentVideos.length > 0 && (
                  <div className="lg:mt-0">
                    <FlexboxLayout
                      justify="between"
                      align="center"
                      className="mb-4"
                    >
                      <BaseText
                        className="text-lg font-semibold md:text-xl md:font-bold"
                        style={{ color: themeStyles.textColor }}
                      >
                        Recent Uploads
                      </BaseText>
                      <span
                        className="rounded px-3 py-1 text-xs font-medium md:text-sm"
                        style={{
                          backgroundColor: isDarkMode
                            ? colorScheme.surfaceVariant
                            : colorScheme.opacity.black10,
                          color: themeStyles.secondaryTextColor,
                        }}
                      >
                        {recentVideos.length} videos
                      </span>
                    </FlexboxLayout>

                    <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
                      {recentVideos.map((video: YouTubeVideo) => (
                        <div
                          key={video.id}
                          className={`group flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                            currentVideo?.id === video.id
                              ? 'border-primary/30 shadow-sm'
                              : isDarkMode
                                ? 'border-white/10 hover:bg-white/5'
                                : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          style={{
                            backgroundColor:
                              currentVideo?.id === video.id
                                ? isDarkMode
                                  ? colorScheme.opacity.primary10
                                  : colorScheme.opacity.primary20
                                : themeStyles.cardBackground,
                            borderColor:
                              currentVideo?.id === video.id
                                ? `${colorScheme.primary}30`
                                : themeStyles.borderColor,
                          }}
                          onClick={() => handleVideoSelect(video)}
                        >
                          <div className="relative flex-shrink-0">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="h-12 w-16 rounded border object-cover"
                              style={{ borderColor: themeStyles.borderColor }}
                              loading="lazy"
                              decoding="async"
                            />
                            <div
                              className={`absolute inset-0 flex items-center justify-center rounded bg-black bg-opacity-50 transition-opacity ${
                                currentVideo?.id === video.id
                                  ? 'opacity-100'
                                  : 'opacity-0 group-hover:opacity-100'
                              }`}
                            >
                              <svg
                                className="h-4 w-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            {currentVideo?.id === video.id && (
                              <div
                                className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white"
                                style={{ backgroundColor: colorScheme.primary }}
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <BaseText
                              className="truncate text-sm font-medium leading-tight md:font-semibold"
                              style={{ color: themeStyles.textColor }}
                            >
                              {video.title}
                            </BaseText>
                            <div className="mt-1 flex items-center gap-2">
                              <LightText
                                className="truncate text-xs"
                                style={{
                                  color: themeStyles.secondaryTextColor,
                                }}
                              >
                                {video.series}
                              </LightText>
                              <span
                                className="text-xs"
                                style={{ color: themeStyles.borderColor }}
                              >
                                •
                              </span>
                              <LightText
                                className="text-xs"
                                style={{
                                  color: themeStyles.secondaryTextColor,
                                }}
                              >
                                {new Date(
                                  video.publishedAt
                                ).toLocaleDateString()}
                              </LightText>
                            </div>
                          </div>

                          {video === videos[0] && (
                            <span
                              className="flex-shrink-0 rounded px-2 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: isDarkMode
                                  ? colorScheme.opacity.error10
                                  : colorScheme.opacity.error20,
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
                          className="mx-auto flex items-center justify-center gap-1 text-sm font-semibold transition-colors md:text-base md:font-bold"
                          style={{ color: colorScheme.primary }}
                        >
                          View More Series
                          <svg
                            className="h-4 w-4"
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
  const { colorScheme, isDark } = useTheme();
  const isDarkMode = isDark;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsClient(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = colorScheme.primaryDark;
    },
    [colorScheme.primaryDark]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = colorScheme.primary;
    },
    [colorScheme.primary]
  );

  const sermonState = useSermonUtil();

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
    horizontalGridRef,
    handleSeriesClick,
    handleGroupClick,
    handleLoadMore,
    handleSearchChange,
    handleSeriesFilterChange,
    handlePreacherChange,
    handleYearChange,
    handleSortChange,
    handleResetFilters,
    handleVideoSelect,
    handleWatchSeries,
    handleViewMore,
  } = sermonState;

  const themeStyles = useMemo(
    () => ({
      sectionBackground: isDarkMode
        ? colorScheme.background
        : colorScheme.backgroundSecondary,
      textColor: isDarkMode ? colorScheme.text : colorScheme.heading,
      secondaryTextColor: isDarkMode
        ? colorScheme.textSecondary
        : colorScheme.textTertiary,
      cardBackground: isDarkMode ? colorScheme.card : colorScheme.surface,
      borderColor: colorScheme.border,
      inputBackground: isDarkMode ? colorScheme.surface : colorScheme.white,
      inputBorderColor: colorScheme.border,
    }),
    [isDarkMode, colorScheme]
  );

  const clientReady = isClient;

  const featuredSection = clientReady ? (
    <FeaturedSection
      videos={videos}
      recentVideos={recentVideos}
      currentVideo={currentVideo || null}
      playerKey={String(playerKey)}
      handleVideoSelect={handleVideoSelect}
      handleWatchSeries={handleWatchSeries}
      handleViewMore={handleViewMore}
    />
  ) : (
    <div className="flex min-h-screen items-center justify-center">
      <div>Loading sermons...</div>
    </div>
  );

  return (
    <div className="sermon-util">
      {featuredSection}

      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: themeStyles.sectionBackground }}
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
                  className="mx-auto mb-4 h-8 w-1/4 rounded"
                  style={{ backgroundColor: themeStyles.sectionBackground }}
                />
                <div
                  className="mx-auto mb-12 h-4 w-1/2 rounded"
                  style={{ backgroundColor: themeStyles.cardBackground }}
                />
              </div>

              <GridboxLayout
                columns={1}
                responsive={{ sm: 1, md: 2, lg: 3 }}
                gap="lg"
                className="mx-auto max-w-6xl"
              >
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className="h-64 rounded-2xl animate-pulse"
                    style={{ backgroundColor: themeStyles.cardBackground }}
                  />
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
                  className="text-center text-xl font-bold md:text-2xl lg:text-3xl xl:text-4xl md:font-extrabold"
                  style={{ color: themeStyles.textColor }}
                >
                  Featured Categories
                </BaseText>

                <MobileHorizontalScroll
                  groupedSeries={groupedSeries}
                  handleGroupClick={handleGroupClick}
                />

                <DesktopGridSeries
                  groupedSeries={groupedSeries}
                  handleGroupClick={handleGroupClick}
                  cardsRef={cardsRef}
                />
              </FlexboxLayout>

              {ungroupedSeries.length > 0 && (
                <FlexboxLayout
                  direction="column"
                  gap="lg"
                  className="mb-10 sm:mb-12"
                >
                  <BaseText
                    className="text-center text-xl font-bold md:text-2xl lg:text-3xl xl:text-4xl md:font-extrabold"
                    style={{ color: themeStyles.textColor }}
                  >
                    More Sermons
                  </BaseText>

                  <div className="block lg:hidden">
                    <div className="scrollbar-hide flex snap-x snap-mandatory space-x-4 overflow-x-auto pb-4 pl-4">
                      {ungroupedSeries.map((series: UngroupedSeriesData) => (
                        <div key={series.name} className="snap-start">
                          <SeriesCard
                            group={series}
                            isUngrouped
                            onClick={() => handleSeriesClick(series.name)}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 text-center">
                      <LightText
                        className="text-sm md:text-base"
                        style={{ color: themeStyles.secondaryTextColor }}
                      >
                        ← Scroll horizontally →
                      </LightText>
                    </div>
                  </div>

                  <div className="hidden max-w-7xl grid-cols-1 gap-6 lg:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {ungroupedSeries.map((series: UngroupedSeriesData) => (
                      <SeriesCard
                        key={series.name}
                        group={series}
                        isUngrouped
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
                  className="px-6 py-3 text-sm font-semibold shadow-lg transition-colors duration-200 hover:scale-105 hover:shadow-xl sm:px-8 sm:py-4 md:text-base lg:text-lg"
                  style={{
                    backgroundColor: colorScheme.primary,
                    color: colorScheme.black,
                  }}
                  onClick={() => handleSeriesClick('all')}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  View Complete Library
                </Button>
              </FlexboxLayout>
            </>
          )}
        </Container>
      </Section>

      <Section
        background="image"
        backgroundImage={Banner_2.src}
        overlay
        overlayOpacity={50}
        padding="lg"
        fullHeight={false}
      >
        <Container size="xl">
          <div className="mb-6 sm:mb-8">
            <SearchFiltersComponent
              searchTerm={searchTerm}
              selectedSeries={selectedSeries}
              selectedPreacher={selectedPreacher}
              selectedYear={selectedYear}
              seriesOptions={seriesOptions}
              preacherOptions={preacherOptions}
              yearOptions={yearOptions}
              handleSearchChange={handleSearchChange}
              handleSeriesFilterChange={handleSeriesFilterChange}
              handlePreacherChange={handlePreacherChange}
              handleYearChange={handleYearChange}
              handleResetFilters={handleResetFilters}
              filteredVideos={filteredVideos}
            />
          </div>

          <div className="mb-4 sm:mb-6">
            <QuickFilters
              selectedSeries={selectedSeries}
              onSelectGroup={(_, name) =>
                handleSeriesFilterChange(`group:${name}`)
              }
              onReset={handleResetFilters}
            />
          </div>

          <ResultsToolbar
            totalCount={videos.length}
            filteredCount={filteredVideos.length}
            searchTerm={searchTerm}
            selectedSeries={selectedSeries}
            selectedPreacher={selectedPreacher}
            selectedYear={selectedYear}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onClear={handleResetFilters}
          />

          <CuratedSections
            videos={filteredVideos.length ? filteredVideos : videos}
            onSelectGroup={handleGroupClick}
          />

          <MobileHorizontalGrid
            displayedVideos={displayedVideos}
            horizontalGridRef={horizontalGridRef}
          />

          <DesktopSermonsGrid
            displayedVideos={displayedVideos}
            gridRef={gridRef}
          />

          {filteredVideos.length === 0 && !loading && (
            <FlexboxLayout
              direction="column"
              justify="center"
              align="center"
              gap="md"
              className="py-8 text-center sm:py-12"
            >
              <LightText
                className="mb-3 text-base md:text-lg lg:text-xl sm:mb-4"
                style={{ color: themeStyles.secondaryTextColor }}
              >
                No sermons found matching your criteria.
              </LightText>

              <Button
                variant="primary"
                size="md"
                curvature="full"
                className="px-4 py-2 text-sm font-semibold shadow-md transition-colors sm:px-6 sm:py-3 md:text-base lg:text-lg"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.black,
                }}
                onClick={handleResetFilters}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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
                className="px-6 py-2 text-sm font-semibold shadow-md transition-colors duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none sm:px-8 sm:py-3 md:text-base lg:text-lg"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.black,
                }}
                onClick={handleLoadMore}
                disabled={loading}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {loading ? 'Loading...' : 'Load More Videos'}
              </Button>
            </FlexboxLayout>
          )}

          {loading && (
            <FlexboxLayout justify="center" className="py-6 sm:py-8">
              <div
                className="mx-auto animate-spin rounded-full border-b-2"
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderColor: colorScheme.primary,
                }}
              />
            </FlexboxLayout>
          )}
        </Container>
      </Section>
    </div>
  );
};

export default SermonUtil;
