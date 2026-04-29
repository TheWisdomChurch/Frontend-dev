import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { YouTubeVideo } from '@/lib/types';
import { seriesGroups } from '@/lib/data';
import { resolveConfiguredApiOrigin } from '@/lib/apiOrigin';

type SermonSort = 'newest' | 'oldest' | 'popular';

type SermonFilters = {
  searchTerm: string;
  selectedSeries: string;
  selectedPreacher: string;
  selectedYear: string;
  sortBy: SermonSort;
};

interface SermonsState extends SermonFilters {
  videos: YouTubeVideo[];
  filteredVideos: YouTubeVideo[];
  displayedVideos: YouTubeVideo[];
  featuredSeries: YouTubeVideo[];
  loading: boolean;
  error: string | null;
  visibleCount: number;
  currentPage: string;
}

const DEFAULT_VISIBLE_COUNT = 12;

const defaultFilters: SermonFilters = {
  searchTerm: '',
  selectedSeries: 'all',
  selectedPreacher: 'all',
  selectedYear: 'all',
  sortBy: 'newest',
};

const initialState: SermonsState = {
  videos: [],
  filteredVideos: [],
  displayedVideos: [],
  featuredSeries: [],
  loading: false,
  error: null,
  visibleCount: DEFAULT_VISIBLE_COUNT,
  currentPage: 'all',
  ...defaultFilters,
};

const normalize = (value?: string | null): string =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const parseDate = (value?: string | null): number => {
  const time = new Date(value ?? '').getTime();
  return Number.isFinite(time) ? time : 0;
};

const parseViews = (value?: string | number | null): number => {
  const parsed = Number.parseInt(
    String(value ?? '0').replace(/[^\d]/g, ''),
    10
  );
  return Number.isFinite(parsed) ? parsed : 0;
};

const getFiltersFromState = (state: SermonsState): SermonFilters => ({
  searchTerm: state.searchTerm,
  selectedSeries: state.selectedSeries,
  selectedPreacher: state.selectedPreacher,
  selectedYear: state.selectedYear,
  sortBy: state.sortBy,
});

const getSeriesGroupTerms = (selectedSeries: string): string[] | null => {
  if (!selectedSeries.startsWith('group:')) return null;

  const groupName = selectedSeries.replace('group:', '').trim();

  const group = seriesGroups.find(
    item => normalize(item.name) === normalize(groupName)
  );

  return group?.searchTerms.map(normalize) ?? [];
};

const matchesSearch = (video: YouTubeVideo, searchTerm: string): boolean => {
  const query = normalize(searchTerm);
  if (!query) return true;

  const searchableText = [
    video.title,
    video.description,
    video.series,
    video.preacher,
  ]
    .map(normalize)
    .join(' ');

  return searchableText.includes(query);
};

const matchesSeries = (
  video: YouTubeVideo,
  selectedSeries: string
): boolean => {
  if (!selectedSeries || selectedSeries === 'all') return true;

  const series = normalize(video.series);
  const groupTerms = getSeriesGroupTerms(selectedSeries);

  if (groupTerms) {
    if (groupTerms.length === 0) return false;
    return groupTerms.some(term => series.includes(term));
  }

  return series.includes(normalize(selectedSeries));
};

const matchesPreacher = (
  video: YouTubeVideo,
  selectedPreacher: string
): boolean => {
  if (!selectedPreacher || selectedPreacher === 'all') return true;
  return normalize(video.preacher).includes(normalize(selectedPreacher));
};

const matchesYear = (video: YouTubeVideo, selectedYear: string): boolean => {
  if (!selectedYear || selectedYear === 'all') return true;

  const publishedYear = new Date(video.publishedAt ?? '').getFullYear();
  return (
    Number.isFinite(publishedYear) && String(publishedYear) === selectedYear
  );
};

const sortVideos = (
  videos: YouTubeVideo[],
  sortBy: SermonSort
): YouTubeVideo[] => {
  const sorted = [...videos];

  switch (sortBy) {
    case 'oldest':
      return sorted.sort(
        (a, b) => parseDate(a.publishedAt) - parseDate(b.publishedAt)
      );

    case 'popular':
      return sorted.sort(
        (a, b) => parseViews(b.viewCount) - parseViews(a.viewCount)
      );

    case 'newest':
    default:
      return sorted.sort(
        (a, b) => parseDate(b.publishedAt) - parseDate(a.publishedAt)
      );
  }
};

const applyFilters = (
  videos: YouTubeVideo[],
  filters: SermonFilters
): YouTubeVideo[] => {
  const filtered = videos.filter(video => {
    return (
      matchesSearch(video, filters.searchTerm) &&
      matchesSeries(video, filters.selectedSeries) &&
      matchesPreacher(video, filters.selectedPreacher) &&
      matchesYear(video, filters.selectedYear)
    );
  });

  return sortVideos(filtered, filters.sortBy);
};

const getDisplayedVideos = (
  videos: YouTubeVideo[],
  visibleCount: number
): YouTubeVideo[] => videos.slice(0, visibleCount);

const getFeaturedSeries = (
  videos: YouTubeVideo[],
  seriesName?: string
): YouTubeVideo[] => {
  const targetSeries = normalize(seriesName || videos[0]?.series || '');

  if (!targetSeries) return videos.slice(0, 4);

  return videos
    .filter(video => normalize(video.series).includes(targetSeries))
    .slice(0, 4);
};

const refreshDerivedState = (state: SermonsState) => {
  state.filteredVideos = applyFilters(state.videos, getFiltersFromState(state));
  state.displayedVideos = getDisplayedVideos(
    state.filteredVideos,
    state.visibleCount
  );
};

const isYouTubeVideoArray = (value: unknown): value is YouTubeVideo[] =>
  Array.isArray(value);

export const fetchSermons = createAsyncThunk<
  YouTubeVideo[],
  void,
  { rejectValue: string }
>('sermons/fetchSermons', async (_, { rejectWithValue }) => {
  try {
    const endpoint = `${resolveConfiguredApiOrigin()}/api/v1/sermons?sort=newest`;

    const response = await fetch(endpoint, {
      method: 'GET',
      credentials: 'omit',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return rejectWithValue(`Failed to fetch sermons (${response.status})`);
    }

    const payload = await response.json();
    const data = payload?.data ?? payload;

    if (!isYouTubeVideoArray(data)) {
      return rejectWithValue('Invalid sermons response format');
    }

    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch sermons'
    );
  }
});

const sermonsSlice = createSlice({
  name: 'sermons',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.visibleCount = DEFAULT_VISIBLE_COUNT;
      refreshDerivedState(state);
    },

    setSelectedSeries: (state, action: PayloadAction<string>) => {
      state.selectedSeries = action.payload || 'all';
      state.visibleCount = DEFAULT_VISIBLE_COUNT;
      refreshDerivedState(state);
    },

    setSelectedPreacher: (state, action: PayloadAction<string>) => {
      state.selectedPreacher = action.payload || 'all';
      state.visibleCount = DEFAULT_VISIBLE_COUNT;
      refreshDerivedState(state);
    },

    setSelectedYear: (state, action: PayloadAction<string>) => {
      state.selectedYear = action.payload || 'all';
      state.visibleCount = DEFAULT_VISIBLE_COUNT;
      refreshDerivedState(state);
    },

    setSortBy: (state, action: PayloadAction<SermonSort>) => {
      state.sortBy = action.payload;
      refreshDerivedState(state);
    },

    loadMoreVideos: state => {
      state.visibleCount += DEFAULT_VISIBLE_COUNT;
      state.displayedVideos = getDisplayedVideos(
        state.filteredVideos,
        state.visibleCount
      );
    },

    resetFilters: state => {
      Object.assign(state, defaultFilters);
      state.visibleCount = DEFAULT_VISIBLE_COUNT;
      state.currentPage = 'all';
      refreshDerivedState(state);
    },

    setCurrentPage: (state, action: PayloadAction<string>) => {
      const page = action.payload || 'all';

      state.currentPage = page;
      state.visibleCount = DEFAULT_VISIBLE_COUNT;

      if (page === 'all') {
        refreshDerivedState(state);
        return;
      }

      state.searchTerm = '';
      state.selectedSeries = page;
      state.selectedPreacher = 'all';
      state.selectedYear = 'all';
      state.sortBy = 'newest';

      refreshDerivedState(state);
      state.featuredSeries = getFeaturedSeries(state.videos, page);
    },

    setFeaturedSeries: (state, action: PayloadAction<string>) => {
      state.featuredSeries = getFeaturedSeries(state.videos, action.payload);
    },

    clearSermonsError: state => {
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchSermons.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSermons.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.videos = action.payload;

        refreshDerivedState(state);
        state.featuredSeries = getFeaturedSeries(action.payload);
      })

      .addCase(fetchSermons.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || 'Failed to fetch sermons';
      });
  },
});

export const {
  setSearchTerm,
  setSelectedSeries,
  setSelectedPreacher,
  setSelectedYear,
  setSortBy,
  loadMoreVideos,
  resetFilters,
  setCurrentPage,
  setFeaturedSeries,
  clearSermonsError,
} = sermonsSlice.actions;

export default sermonsSlice.reducer;
