'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import {
  setSelectedSeries,
  setSelectedPreacher,
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
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for animations
  const cardsRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const horizontalGridRef = useRef<HTMLDivElement>(null);
  const featuredCategoriesRef = useRef<HTMLElement>(null);

  // Enhanced scroll function with GSAP
  const smoothScrollToElement = useCallback(
    (element: HTMLElement | null, offset = 80) => {
      if (!element) return;

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
    []
  );

  // Featured Series Handlers
  const handleVideoSelect = useCallback((video: YouTubeVideo) => {
    setCurrentVideo(video);
    setPlayerKey(prev => prev + 1);
  }, []);

  const handleWatchSeries = useCallback(() => {
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
  }, [dispatch, featuredSeries, smoothScrollToElement]);

  const handleViewMore = useCallback(() => {
    smoothScrollToElement(featuredCategoriesRef.current, 120);
  }, [smoothScrollToElement]);

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

  // Enhanced Series Cards Handlers with better animations
  const handleSeriesClick = useCallback(
    (seriesName: string) => {
      if (isAnimating) return;

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
    [dispatch, isAnimating, smoothScrollToElement]
  );

  const handleGroupClick = useCallback(
    (searchTerms: string[]) => {
      if (isAnimating) return;

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

      dispatch(setSelectedSeries(searchTerms[0]));

      // Enhanced scroll with coordinated timing
      setTimeout(() => {
        const gridSection = document.getElementById('sermons-grid');
        smoothScrollToElement(gridSection, 100);
      }, 400);
    },
    [dispatch, isAnimating, smoothScrollToElement]
  );

  // Sermons Grid Handlers
  const hasMoreVideos = visibleCount < filteredVideos.length;

  const handleLoadMore = useCallback(() => {
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

  // Enhanced GSAP Animations with better timing and safety checks
  useEffect(() => {
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
  }, [groupedSeries]);

  useEffect(() => {
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
  }, [displayedVideos]);

  useEffect(() => {
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
  }, [displayedVideos]);

  // Enhanced horizontal scroll animation for mobile
  useEffect(() => {
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
  }, [groupedSeries]);

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
    isAnimating,

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
    handleSortChange,
    handleResetFilters,
    smoothScrollToElement,

    // Setters
    setCurrentVideo,
    setPlayerKey,
  };
};
