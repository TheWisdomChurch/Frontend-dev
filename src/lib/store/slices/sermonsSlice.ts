import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { YouTubeVideo } from '@/lib/types';

interface SermonsState {
  videos: YouTubeVideo[];
  filteredVideos: YouTubeVideo[];
  displayedVideos: YouTubeVideo[];
  featuredSeries: YouTubeVideo[];
  searchTerm: string;
  selectedSeries: string;
  selectedPreacher: string;
  selectedYear: string;
  sortBy: 'newest' | 'oldest' | 'popular';
  loading: boolean;
  error: string | null;
  visibleCount: number;
  currentPage: string;
}

const initialState: SermonsState = {
  videos: [],
  filteredVideos: [],
  displayedVideos: [],
  featuredSeries: [],
  searchTerm: '',
  selectedSeries: 'all',
  selectedPreacher: 'all',
  selectedYear: 'all',
  sortBy: 'newest',
  loading: false,
  error: null,
  visibleCount: 12,
  currentPage: 'all',
};

// Async thunk for fetching sermons
export const fetchSermons = createAsyncThunk(
  'sermons/fetchSermons',
  async () => {
    const response = await fetch('/api/sermons');
    if (!response.ok) throw new Error('Failed to fetch sermons');
    return await response.json();
  }
);

// Helper function to apply all filters
const applyFilters = (
  videos: YouTubeVideo[],
  filters: {
    searchTerm: string;
    selectedSeries: string;
    selectedPreacher: string;
    selectedYear: string;
    sortBy: 'newest' | 'oldest' | 'popular';
  }
) => {
  let filtered = [...videos];

  // Apply search filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      video =>
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.series.toLowerCase().includes(searchLower) ||
        video.preacher.toLowerCase().includes(searchLower)
    );
  }

  // Apply series filter
  if (filters.selectedSeries !== 'all') {
    filtered = filtered.filter(video =>
      video.series.toLowerCase().includes(filters.selectedSeries.toLowerCase())
    );
  }

  // Apply preacher filter
  if (filters.selectedPreacher !== 'all') {
    filtered = filtered.filter(video =>
      video.preacher
        .toLowerCase()
        .includes(filters.selectedPreacher.toLowerCase())
    );
  }

  // Apply year filter
  if (filters.selectedYear !== 'all') {
    filtered = filtered.filter(
      video =>
        new Date(video.publishedAt).getFullYear().toString() ===
        filters.selectedYear
    );
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'oldest':
      filtered.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
      break;
    case 'popular':
      filtered.sort((a, b) => parseInt(b.viewCount) - parseInt(a.viewCount));
      break;
    case 'newest':
    default:
      filtered.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      break;
  }

  return filtered;
};

const sermonsSlice = createSlice({
  name: 'sermons',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredVideos = applyFilters(state.videos, {
        searchTerm: action.payload,
        selectedSeries: state.selectedSeries,
        selectedPreacher: state.selectedPreacher,
        selectedYear: state.selectedYear,
        sortBy: state.sortBy,
      });
      state.displayedVideos = state.filteredVideos.slice(0, state.visibleCount);
    },
    setSelectedSeries: (state, action: PayloadAction<string>) => {
      state.selectedSeries = action.payload;
      state.filteredVideos = applyFilters(state.videos, {
        searchTerm: state.searchTerm,
        selectedSeries: action.payload,
        selectedPreacher: state.selectedPreacher,
        selectedYear: state.selectedYear,
        sortBy: state.sortBy,
      });
      state.displayedVideos = state.filteredVideos.slice(0, state.visibleCount);
    },
    setSelectedPreacher: (state, action: PayloadAction<string>) => {
      state.selectedPreacher = action.payload;
      state.filteredVideos = applyFilters(state.videos, {
        searchTerm: state.searchTerm,
        selectedSeries: state.selectedSeries,
        selectedPreacher: action.payload,
        selectedYear: state.selectedYear,
        sortBy: state.sortBy,
      });
      state.displayedVideos = state.filteredVideos.slice(0, state.visibleCount);
    },
    setSelectedYear: (state, action: PayloadAction<string>) => {
      state.selectedYear = action.payload;
      state.filteredVideos = applyFilters(state.videos, {
        searchTerm: state.searchTerm,
        selectedSeries: state.selectedSeries,
        selectedPreacher: state.selectedPreacher,
        selectedYear: action.payload,
        sortBy: state.sortBy,
      });
      state.displayedVideos = state.filteredVideos.slice(0, state.visibleCount);
    },
    setSortBy: (
      state,
      action: PayloadAction<'newest' | 'oldest' | 'popular'>
    ) => {
      state.sortBy = action.payload;
      state.filteredVideos = applyFilters(state.videos, {
        searchTerm: state.searchTerm,
        selectedSeries: state.selectedSeries,
        selectedPreacher: state.selectedPreacher,
        selectedYear: state.selectedYear,
        sortBy: action.payload,
      });
      state.displayedVideos = state.filteredVideos.slice(0, state.visibleCount);
    },
    loadMoreVideos: state => {
      state.visibleCount += 12;
      state.displayedVideos = state.filteredVideos.slice(0, state.visibleCount);
    },
    resetFilters: state => {
      state.searchTerm = '';
      state.selectedSeries = 'all';
      state.selectedPreacher = 'all';
      state.selectedYear = 'all';
      state.sortBy = 'newest';
      state.visibleCount = 12;
      state.filteredVideos = state.videos;
      state.displayedVideos = state.videos.slice(0, state.visibleCount);
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
      if (action.payload === 'all') {
        state.filteredVideos = applyFilters(state.videos, {
          searchTerm: state.searchTerm,
          selectedSeries: state.selectedSeries,
          selectedPreacher: state.selectedPreacher,
          selectedYear: state.selectedYear,
          sortBy: state.sortBy,
        });
      } else {
        // When a specific series page is selected
        state.filteredVideos = applyFilters(state.videos, {
          searchTerm: '',
          selectedSeries: action.payload,
          selectedPreacher: 'all',
          selectedYear: 'all',
          sortBy: 'newest',
        });
        // Update featured series to show videos from this series
        const seriesVideos = state.videos
          .filter(video =>
            video.series.toLowerCase().includes(action.payload.toLowerCase())
          )
          .slice(0, 4);
        state.featuredSeries = seriesVideos;
      }
      state.visibleCount = 12;
      state.displayedVideos = state.filteredVideos.slice(0, state.visibleCount);
    },
    setFeaturedSeries: (state, action: PayloadAction<string>) => {
      const seriesVideos = state.videos
        .filter(video =>
          video.series.toLowerCase().includes(action.payload.toLowerCase())
        )
        .slice(0, 4);
      state.featuredSeries = seriesVideos;
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
        state.videos = action.payload;
        state.filteredVideos = action.payload;
        state.displayedVideos = action.payload.slice(0, state.visibleCount);

        // Set initial featured series (most recent series)
        const mostRecentSeries = action.payload[0]?.series || 'Sunday Teaching';
        const seriesVideos = action.payload
          .filter((video: { series: string }) =>
            video.series.toLowerCase().includes(mostRecentSeries.toLowerCase())
          )
          .slice(0, 4);
        state.featuredSeries = seriesVideos;
      })
      .addCase(fetchSermons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sermons';
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
} = sermonsSlice.actions;

export default sermonsSlice.reducer;
