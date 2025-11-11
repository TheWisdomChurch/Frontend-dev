import { YouTubeVideo } from '@/lib/types';
import { useEffect, useState } from 'react';

// components/utils/hooks/useSermon.ts
export const useSermonUtil = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [displayedVideos, setDisplayedVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const loadVideos = async (pageNum: number = 1, filters: any = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        limit: (pageNum * pageSize).toString(),
        ...filters,
      });

      const response = await fetch(`/api/sermons?${params}`);
      const data = await response.json();

      if (data.videos) {
        setVideos(data.videos);
        setDisplayedVideos(data.videos);
        setHasMore(data.hasMore);

        // Cache in localStorage for offline use
        if (pageNum === 1) {
          localStorage.setItem('sermons-cache', JSON.stringify(data));
          localStorage.setItem('sermons-cache-time', Date.now().toString());
        }
      }
    } catch (error) {
      console.error('Error loading sermons:', error);

      // Try to use cached data
      const cached = localStorage.getItem('sermons-cache');
      if (cached) {
        const data = JSON.parse(cached);
        setVideos(data.videos);
        setDisplayedVideos(data.videos.slice(0, pageNum * pageSize));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadVideos(nextPage);
  };

  // Load initial data
  useEffect(() => {
    loadVideos(1);
  }, []);

  return {
    videos,
    displayedVideos,
    loading,
    hasMoreVideos: hasMore,
    handleLoadMore,
    // ... other functions
  };
};
