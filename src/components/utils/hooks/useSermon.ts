'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import {
  setSelectedSeries,
  setSelectedPreacher,
  setSelectedYear,
  setSortBy,
  setSearchTerm,
  loadMoreVideos,
  resetFilters,
} from '@/lib/store/slices/sermonsSlice';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { seriesGroups } from '@/lib/data';
import {
  YouTubeVideo,
  SeriesGroup,
  GroupedSeriesData,
  UngroupedSeriesData,
} from '@/lib/types';

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

// Suppress GSAP warnings in development
if (process.env.NODE_ENV === 'development') {
  gsap.config({
    nullTargetWarn: false,
  });
}

export const useSermonUtil = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isClient, setIsClient] = useState(false);

  // Initialize with empty/default values for SSR
  const sermonsState = useSelector((state: RootState) =>
    isClient
      ? state.sermons
      : {
          videos: [],
          featuredSeries: [],
          displayedVideos: [],
          filteredVideos: [],
          visibleCount: 0,
          loading: false,
          searchTerm: '',
          selectedSeries: 'all',
          selectedPreacher: 'all',
          selectedYear: 'all',
          sortBy: 'newest' as const,
        }
  );

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
    selectedYear,
    sortBy,
  } = sermonsState;

  // Featured Series State
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | undefined>(
    undefined
  );
  const [playerKey, setPlayerKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for animations
  const cardsRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const horizontalGridRef = useRef<HTMLDivElement>(null);
  const featuredCategoriesRef = useRef<HTMLElement>(null);

  // Set client state on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set current video when videos are loaded
  useEffect(() => {
    if (isClient && videos.length > 0 && !currentVideo) {
      setCurrentVideo(videos[0]);
    }
  }, [isClient, videos, currentVideo]);

  // Enhanced scroll function with GSAP
  const smoothScrollToElement = useCallback(
    (element: HTMLElement | null, offset = 80) => {
      if (!element || !isClient) return;

      setIsAnimating(true);

      gsap.to(window, {
        duration: 1.2,
        scrollTo: {
          y: element,
          offsetY: offset,
          autoKill: true,
        },
        ease: 'power2.inOut',
        onComplete: () => {
          setIsAnimating(false);
        },
      });
    },
    [isClient]
  );

  // Featured Series Handlers
  const handleVideoSelect = useCallback(
    (video: YouTubeVideo) => {
      if (!isClient) return;
      setCurrentVideo(video);
      setPlayerKey(prev => prev + 1);
    },
    [isClient]
  );

  const handleWatchSeries = useCallback(() => {
    if (!isClient) return;

    if (featuredSeries.length > 0) {
      dispatch(
        setSelectedSeries(featuredSeries[0]?.series || 'Latest Content')
      );

      // Enhanced scroll with delay for better UX
      setTimeout(() => {
        const gridSection = document.getElementById('sermons-grid');
        smoothScrollToElement(gridSection, 100);
      }, 300);
    }
  }, [dispatch, featuredSeries, smoothScrollToElement, isClient]);

  const handleViewMore = useCallback(() => {
    if (!isClient) return;
    smoothScrollToElement(featuredCategoriesRef.current, 120);
  }, [smoothScrollToElement, isClient]);

  // Series Cards Logic
  const getGroupVideos = useCallback(
    (searchTerms: string[]): YouTubeVideo[] => {
      if (!isClient) return [];
      return videos.filter(video => {
        const videoSeries = video.series.toUpperCase();
        return searchTerms.some(term =>
          videoSeries.includes(term.toUpperCase())
        );
      });
    },
    [videos, isClient]
  );

  const groupedSeries: GroupedSeriesData[] = isClient
    ? seriesGroups
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
        .sort((a, b) => b.count - a.count)
    : [];

  const allIndividualSeries = isClient
    ? Array.from(new Set(videos.map(video => video.series).filter(Boolean)))
    : [];

  const groupedSeriesNames = groupedSeries.flatMap(group => group.searchTerms);
  const ungroupedSeries: UngroupedSeriesData[] = isClient
    ? allIndividualSeries
        .filter(
          series =>
            !groupedSeriesNames.some(term =>
              series.toUpperCase().includes(term.toUpperCase())
            )
        )
        .map(series => ({
          name: series,
          count: videos.filter(video => video.series === series).length,
          latestThumbnail: videos.find(video => video.series === series)
            ?.thumbnail,
          isUngrouped: true,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
    : [];

  // Enhanced Series Cards Handlers with better animations
  const handleSeriesClick = useCallback(
    (seriesName: string) => {
      if (isAnimating || !isClient) return;

      // Add click animation feedback
      if (featuredCategoriesRef.current) {
        gsap.to(featuredCategoriesRef.current, {
          scale: 0.98,
          duration: 0.2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        });
      }

      dispatch(setSelectedSeries(seriesName));

      // Enhanced scroll with coordinated timing
      setTimeout(() => {
        const gridSection = document.getElementById('sermons-grid');
        smoothScrollToElement(gridSection, 100);
      }, 400);
    },
    [dispatch, isAnimating, smoothScrollToElement, isClient]
  );

  const handleGroupClick = useCallback(
    (searchTerms: string[], groupName?: string) => {
      if (isAnimating || !isClient) return;

      // Add click animation feedback
      if (featuredCategoriesRef.current) {
        gsap.to(featuredCategoriesRef.current, {
          scale: 0.98,
          duration: 0.2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        });
      }

      if (groupName) {
        dispatch(setSelectedSeries(`group:${groupName}`));
      } else {
        dispatch(setSelectedSeries(searchTerms[0]));
      }

      // Enhanced scroll with coordinated timing
      setTimeout(() => {
        const gridSection = document.getElementById('sermons-grid');
        smoothScrollToElement(gridSection, 100);
      }, 400);
    },
    [dispatch, isAnimating, smoothScrollToElement, isClient]
  );

  // Sermons Grid Handlers
  const hasMoreVideos = isClient ? visibleCount < filteredVideos.length : false;

  const handleLoadMore = useCallback(() => {
    if (!isClient) return;

    dispatch(loadMoreVideos());

    setTimeout(() => {
      // Enhanced animations for new cards
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.sermon-card');
        const newCards = Array.from(cards).slice(-12);

        if (newCards.length > 0) {
          gsap.fromTo(
            newCards,
            {
              opacity: 0,
              y: 60,
              scale: 0.85,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: {
                amount: 0.6,
                from: 'random',
              },
              ease: 'back.out(1.7)',
            }
          );
        }
      }

      if (horizontalGridRef.current) {
        const cards =
          horizontalGridRef.current.querySelectorAll('.sermon-card');
        const newCards = Array.from(cards).slice(-12);

        if (newCards.length > 0) {
          gsap.fromTo(
            newCards,
            {
              opacity: 0,
              x: 80,
              scale: 0.9,
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.6,
              stagger: {
                amount: 0.5,
                from: 'center',
              },
              ease: 'power3.out',
            }
          );
        }
      }
    }, 150);
  }, [dispatch, isClient]);

  // Search Filters Handlers
  const baseSeriesOptions = isClient
    ? [
        'all',
        ...new Set(videos.map(video => video.series).filter(Boolean)),
      ].sort()
    : ['all'];

  const seriesOptions = isClient
    ? selectedSeries.startsWith('group:')
      ? baseSeriesOptions.includes(selectedSeries)
        ? baseSeriesOptions
        : [selectedSeries, ...baseSeriesOptions]
      : baseSeriesOptions
    : ['all'];

  const preacherOptions = isClient
    ? [
        'all',
        ...new Set(videos.map(video => video.preacher).filter(Boolean)),
      ].sort()
    : ['all'];

  const handleSearchChange = useCallback(
    (term: string) => {
      if (!isClient) return;
      dispatch(setSearchTerm(term));
    },
    [dispatch, isClient]
  );

  const handleSeriesFilterChange = useCallback(
    (series: string) => {
      if (!isClient) return;
      dispatch(setSelectedSeries(series));
    },
    [dispatch, isClient]
  );

  const handlePreacherChange = useCallback(
    (preacher: string) => {
      if (!isClient) return;
      dispatch(setSelectedPreacher(preacher));
    },
    [dispatch, isClient]
  );

  const handleYearChange = useCallback(
    (year: string) => {
      if (!isClient) return;
      dispatch(setSelectedYear(year));
    },
    [dispatch, isClient]
  );

  const handleSortChange = useCallback(
    (sort: 'newest' | 'oldest' | 'popular') => {
      if (!isClient) return;
      dispatch(setSortBy(sort));
    },
    [dispatch, isClient]
  );

  const handleResetFilters = useCallback(() => {
    if (!isClient) return;
    dispatch(resetFilters());
  }, [dispatch, isClient]);

  // Enhanced GSAP Animations with better timing and safety checks
  useEffect(() => {
    if (!isClient) return;

    const animateCards = () => {
      if (cardsRef.current && groupedSeries.length > 0) {
        const cards = cardsRef.current.querySelectorAll('.series-card');
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            {
              opacity: 0,
              y: 80,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              stagger: {
                amount: 0.8,
                from: 'start',
              },
              ease: 'back.out(1.7)',
            }
          );
        }
      }
    };

    // Use a timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      requestAnimationFrame(animateCards);
    }, 100);

    return () => clearTimeout(timer);
  }, [groupedSeries, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const animateGrid = () => {
      if (gridRef.current && displayedVideos.length > 0) {
        const cards = gridRef.current.querySelectorAll('.sermon-card');
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            {
              opacity: 0,
              y: 80,
              scale: 0.85,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: {
                amount: 0.7,
                from: 'random',
              },
              ease: 'back.out(1.7)',
            }
          );
        }
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animateGrid);
    }, 50);

    return () => clearTimeout(timer);
  }, [displayedVideos, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const animateHorizontalGrid = () => {
      if (horizontalGridRef.current && displayedVideos.length > 0) {
        const cards =
          horizontalGridRef.current.querySelectorAll('.sermon-card');
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            {
              opacity: 0,
              x: 100,
              scale: 0.9,
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.7,
              stagger: {
                amount: 0.6,
                from: 'start',
              },
              ease: 'power3.out',
            }
          );
        }
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animateHorizontalGrid);
    }, 50);

    return () => clearTimeout(timer);
  }, [displayedVideos, isClient]);

  // Enhanced horizontal scroll animation for mobile
  useEffect(() => {
    if (!isClient) return;

    const animateHorizontalScroll = () => {
      if (horizontalScrollRef.current && groupedSeries.length > 0) {
        const cards =
          horizontalScrollRef.current.querySelectorAll('.series-card');
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            {
              opacity: 0,
              x: 120,
              scale: 0.9,
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              stagger: {
                amount: 0.7,
                from: 'start',
              },
              ease: 'power3.out',
            }
          );
        }
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animateHorizontalScroll);
    }, 150);

    return () => clearTimeout(timer);
  }, [groupedSeries, isClient]);

  // Featured Series Data
  const featuredSeriesName = isClient
    ? featuredSeries[0]?.series || 'Latest Content'
    : 'Latest Content';
  const recentVideos = isClient ? videos.slice(0, 5) : [];
  const yearOptions = isClient
    ? [
        'all',
        ...new Set(
          videos
            .map(video => new Date(video.publishedAt).getFullYear().toString())
            .filter(Boolean)
        ),
      ].sort((a, b) => (a === 'all' || b === 'all' ? 0 : Number(b) - Number(a)))
    : ['all'];

  return {
    // State
    videos,
    displayedVideos,
    filteredVideos,
    loading,
    searchTerm,
    selectedSeries,
    selectedPreacher,
    selectedYear,
    sortBy,
    currentVideo,
    playerKey,
    groupedSeries,
    ungroupedSeries,
    hasMoreVideos,
    seriesOptions,
    preacherOptions,
    yearOptions,
    recentVideos,
    featuredSeriesName,
    isAnimating,
    isClient, // Return this to use in components

    // Refs
    cardsRef,
    horizontalScrollRef,
    gridRef,
    horizontalGridRef,
    featuredCategoriesRef,

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
    handleYearChange,
    handleSortChange,
    handleResetFilters,
    smoothScrollToElement,

    // Setters
    setCurrentVideo,
    setPlayerKey,
  };
};
