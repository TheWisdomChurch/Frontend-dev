import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { FiltersState, Product } from '@/lib/types';

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  filters: FiltersState;
  loading: boolean;
  error: string | null;
}

type SortBy = 'name' | 'price-low' | 'price-high' | 'newest';

const defaultFilters: FiltersState = {
  searchTerm: '',
  selectedCategory: 'all',
  sortBy: 'name',
};

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  filters: defaultFilters,
  loading: false,
  error: null,
};

const parsePrice = (price: string): number => {
  const value = Number.parseFloat(String(price).replace(/[^\d.]/g, ''));
  return Number.isFinite(value) ? value : 0;
};

const getCreatedTime = (product: Product): number => {
  const productWithDates = product as Product & {
    createdAt?: string;
    created_at?: string;
    updatedAt?: string;
    updated_at?: string;
  };

  const dateValue =
    productWithDates.createdAt ||
    productWithDates.created_at ||
    productWithDates.updatedAt ||
    productWithDates.updated_at;

  if (!dateValue) return 0;

  const timestamp = new Date(dateValue).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const normalizeText = (value: string): string => value.trim().toLowerCase();

const productMatchesSearch = (
  product: Product,
  searchTerm: string
): boolean => {
  const query = normalizeText(searchTerm);
  if (!query) return true;

  const tags = Array.isArray(product.tags) ? product.tags : [];

  const searchableText = [
    product.name,
    product.description,
    product.category,
    ...tags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchableText.includes(query);
};

const productMatchesCategory = (
  product: Product,
  selectedCategory: string
): boolean => {
  if (!selectedCategory || selectedCategory === 'all') return true;
  return product.category === selectedCategory;
};

const sortProducts = (products: Product[], sortBy: SortBy): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));

    case 'price-high':
      return sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

    case 'newest':
      return sorted.sort((a, b) => getCreatedTime(b) - getCreatedTime(a));

    case 'name':
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
};

const applyProductFilters = (
  products: Product[],
  filters: FiltersState
): Product[] => {
  const sortBy = (filters.sortBy || 'name') as SortBy;

  const filtered = products.filter(product => {
    return (
      productMatchesSearch(product, filters.searchTerm) &&
      productMatchesCategory(product, filters.selectedCategory)
    );
  });

  return sortProducts(filtered, sortBy);
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = Array.isArray(action.payload) ? action.payload : [];
      state.filteredProducts = applyProductFilters(
        state.products,
        state.filters
      );
      state.error = null;
    },

    setProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setProductsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
      state.filteredProducts = applyProductFilters(
        state.products,
        state.filters
      );
    },

    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.filters.selectedCategory = action.payload || 'all';
      state.filteredProducts = applyProductFilters(
        state.products,
        state.filters
      );
    },

    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.filters.sortBy = action.payload;
      state.filteredProducts = applyProductFilters(
        state.products,
        state.filters
      );
    },

    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };

      state.filteredProducts = applyProductFilters(
        state.products,
        state.filters
      );
    },

    filterProducts: state => {
      state.filteredProducts = applyProductFilters(
        state.products,
        state.filters
      );
    },

    clearFilters: state => {
      state.filters = defaultFilters;
      state.filteredProducts = applyProductFilters(
        state.products,
        state.filters
      );
    },
  },
});

export const {
  setProducts,
  setProductsLoading,
  setProductsError,
  setSearchTerm,
  setSelectedCategory,
  setSortBy,
  setFilters,
  filterProducts,
  clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
