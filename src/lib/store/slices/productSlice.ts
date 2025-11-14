import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Product, FiltersState } from '@/lib/types';

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  filters: FiltersState;
  loading: boolean;
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  filters: {
    searchTerm: '',
    selectedCategory: 'all',
    sortBy: 'name',
  },
  loading: false,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
    },

    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.filters.selectedCategory = action.payload;
    },

    setSortBy: (
      state,
      action: PayloadAction<'name' | 'price-low' | 'price-high' | 'newest'>
    ) => {
      state.filters.sortBy = action.payload;
    },

    filterProducts: state => {
      let filtered = state.products;

      // Filter by search term
      if (state.filters.searchTerm) {
        const searchLower = state.filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          product =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      // Filter by category
      if (state.filters.selectedCategory !== 'all') {
        filtered = filtered.filter(
          (product: { category: any }) =>
            product.category === state.filters.selectedCategory
        );
      }

      // Sort products
      switch (state.filters.sortBy) {
        case 'price-low':
          filtered = [...filtered].sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^\d.]/g, ''));
            const priceB = parseFloat(b.price.replace(/[^\d.]/g, ''));
            return priceA - priceB;
          });
          break;
        case 'price-high':
          filtered = [...filtered].sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^\d.]/g, ''));
            const priceB = parseFloat(b.price.replace(/[^\d.]/g, ''));
            return priceB - priceA;
          });
          break;
        case 'name':
          filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }

      state.filteredProducts = filtered;
    },

    clearFilters: state => {
      state.filters = {
        searchTerm: '',
        selectedCategory: 'all',
        sortBy: 'name',
      };
      state.filteredProducts = state.products;
    },
  },
});

export const {
  setProducts,
  setSearchTerm,
  setSelectedCategory,
  setSortBy,
  filterProducts,
  clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
