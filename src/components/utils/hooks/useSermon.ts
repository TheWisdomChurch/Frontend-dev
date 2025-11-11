'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import {
  setCurrentPage,
  setSelectedSeries,
  setSelectedPreacher,
  setSortBy,
  setSearchTerm,
  loadMoreVideos,
  resetFilters,
} from '@/lib/store/slices/sermonsSlice';
import gsap from 'gsap';
import { seriesGroups } from '@/lib/data';
import {
  YouTubeVideo,
  SeriesGroup,
  GroupedSeriesData,
  UngroupedSeriesData,
} from '@/lib/types';

export const useSermonUtil = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    videos,
    featuredSeries,
    displayedVideos,
    filteredVideos,
    visibleCount,
    loading,
    searchTerm,
    selectedSeries,
    selectedPreacher,
    sortBy,
  } = useSelector((state: RootState) => state.sermons);

  // Featured Series State
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | undefined>(
    videos[0]
  );
  const [playerKey, setPlayerKey] = useState(0);

  // Refs for animations
  const cardsRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const horizontalGridRef = useRef<HTMLDivElement>(null);

  // Featured Series Handlers
  const handleVideoSelect = useCallback((video: YouTubeVideo) => {
    setCurrentVideo(video);
    setPlayerKey(prev => prev + 1);
  }, []);

  const handleWatchSeries = useCallback(() => {
    dispatch(setCurrentPage(featuredSeries[0]?.series || 'Latest Content'));
  }, [dispatch, featuredSeries]);

  const handleViewMore = useCallback(() => {
    const seriesSection = document.getElementById('series-section');
    if (seriesSection) {
      seriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Series Cards Logic
  const getGroupVideos = useCallback(
    (searchTerms: string[]): YouTubeVideo[] => {
      return videos.filter(video => {
        const videoSeries = video.series.toUpperCase();
        return searchTerms.some(term =>
          videoSeries.includes(term.toUpperCase())
        );
      });
    },
    [videos]
  );

  const groupedSeries: GroupedSeriesData[] = seriesGroups
    .map((group: SeriesGroup) => {
      const groupVideos = getGroupVideos(group.searchTerms);
      const uniqueSeriesInGroup = Array.from(
        new Set(groupVideos.map(video => video.series))
      );

      return {
        name: group.name,
        description: group.description,
        count: groupVideos.length,
        latestThumbnail: groupVideos[0]?.thumbnail,
        color: group.color,
        uniqueSeries: uniqueSeriesInGroup,
        videos: groupVideos,
        searchTerms: group.searchTerms,
      };
    })
    .filter(group => group.count > 0)
    .sort((a, b) => b.count - a.count);

  const allIndividualSeries = Array.from(
    new Set(videos.map(video => video.series).filter(Boolean))
  );

  const groupedSeriesNames = groupedSeries.flatMap(group => group.searchTerms);
  const ungroupedSeries: UngroupedSeriesData[] = allIndividualSeries
    .filter(
      series =>
        !groupedSeriesNames.some(term =>
          series.toUpperCase().includes(term.toUpperCase())
        )
    )
    .map(series => ({
      name: series,
      count: videos.filter(video => video.series === series).length,
      latestThumbnail: videos.find(video => video.series === series)?.thumbnail,
      isUngrouped: true,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Series Cards Handlers
  const handleSeriesClick = useCallback(
    (seriesName: string) => {
      dispatch(setSelectedSeries(seriesName));

      setTimeout(() => {
        const gridSection = document.getElementById('sermons-grid');
        if (gridSection) {
          gridSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    },
    [dispatch]
  );

  const handleGroupClick = useCallback(
    (searchTerms: string[]) => {
      dispatch(setSelectedSeries(searchTerms[0]));

      setTimeout(() => {
        const gridSection = document.getElementById('sermons-grid');
        if (gridSection) {
          gridSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    },
    [dispatch]
  );

  // Sermons Grid Handlers
  const hasMoreVideos = visibleCount < filteredVideos.length;

  const handleLoadMore = useCallback(() => {
    dispatch(loadMoreVideos());

    setTimeout(() => {
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.sermon-card');
        const newCards = Array.from(cards).slice(-12);

        gsap.fromTo(
          newCards,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
          }
        );
      }

      if (horizontalGridRef.current) {
        const cards =
          horizontalGridRef.current.querySelectorAll('.sermon-card');
        const newCards = Array.from(cards).slice(-12);

        gsap.fromTo(
          newCards,
          {
            opacity: 0,
            x: 30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
          }
        );
      }
    }, 100);
  }, [dispatch]);

  // Search Filters Handlers
  const seriesOptions = [
    'all',
    ...new Set(videos.map(video => video.series).filter(Boolean)),
  ].sort();
  const preacherOptions = [
    'all',
    ...new Set(videos.map(video => video.preacher).filter(Boolean)),
  ].sort();

  const handleSearchChange = useCallback(
    (term: string) => {
      dispatch(setSearchTerm(term));
    },
    [dispatch]
  );

  const handleSeriesFilterChange = useCallback(
    (series: string) => {
      dispatch(setSelectedSeries(series));
    },
    [dispatch]
  );

  const handlePreacherChange = useCallback(
    (preacher: string) => {
      dispatch(setSelectedPreacher(preacher));
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    (sort: 'newest' | 'oldest' | 'popular') => {
      dispatch(setSortBy(sort));
    },
    [dispatch]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // GSAP Animations
  useEffect(() => {
    if (cardsRef.current && groupedSeries.length > 0) {
      const cards = cardsRef.current.querySelectorAll('.series-card');

      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)',
          }
        );
      }
    }
  }, [groupedSeries]);

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.sermon-card');

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        }
      );
    }
  }, [displayedVideos]);

  useEffect(() => {
    if (horizontalGridRef.current && displayedVideos.length > 0) {
      const cards = horizontalGridRef.current.querySelectorAll('.sermon-card');

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          x: 30,
          scale: 0.95,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }
  }, [displayedVideos]);

  // Featured Series Data
  const featuredSeriesName = featuredSeries[0]?.series || 'Latest Content';
  const recentVideos = videos.slice(0, 5);

  return {
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

    // Setters
    setCurrentVideo,
    setPlayerKey,
  };
};
