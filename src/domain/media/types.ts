export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnails?: {
    medium?: { url?: string };
  };
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount?: string;
  commentCount?: string;
  tags?: string[];
  url: string;
  embedUrl: string;
  series: string;
  preacher: string;
}

export interface SermonCollection {
  id: string;
  title: string;
  description: string;
  items: YouTubeVideo[];
}

export interface SermonDiscovery {
  featured?: YouTubeVideo;
  recommended: YouTubeVideo[];
  latest: YouTubeVideo[];
  collections: SermonCollection[];
  topics: string[];
  generatedAt: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
}

export interface VideoFilters {
  searchTerm: string;
  sortBy: 'newest' | 'oldest' | 'popular';
  category?: string;
}

export interface SeriesGroup {
  name: string;
  searchTerms: string[];
  description: string;
  color: string;
}

export interface GroupedSeriesData {
  name: string;
  description: string;
  count: number;
  latestThumbnail?: string;
  color: string;
  uniqueSeries: string[];
  videos: YouTubeVideo[];
  searchTerms: string[];
}

export interface UngroupedSeriesData {
  name: string;
  count: number;
  latestThumbnail?: string;
  isUngrouped: boolean;
}
