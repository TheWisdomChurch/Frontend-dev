import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '@/lib/types';

type AddToCartPayload = {
  productId: number;
  name: string;
  price: string;
  image: string;
  selectedSize: string;
  selectedColor: string;
  quantity?: number;
};

type UpdateQuantityPayload = {
  id: string;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isCartOpen: false,
};

const normalizeOption = (value: string) => value.trim();

const createCartItemId = (
  productId: number,
  selectedSize: string,
  selectedColor: string
) =>
  `${productId}-${normalizeOption(selectedSize).toLowerCase()}-${normalizeOption(
    selectedColor
  ).toLowerCase()}`;

const parsePrice = (price: string): number => {
  const numeric = Number.parseFloat(String(price).replace(/[^\d.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
};

const normalizeQuantity = (quantity?: number): number => {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.floor(quantity ?? 1));
};

const recalculateCart = (state: CartState) => {
  state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  state.total = state.items.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity;
  }, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const {
        productId,
        name,
        price,
        image,
        selectedSize,
        selectedColor,
        quantity,
      } = action.payload;

      const safeQuantity = normalizeQuantity(quantity);
      const safeSize = normalizeOption(selectedSize);
      const safeColor = normalizeOption(selectedColor);
      const id = createCartItemId(productId, safeSize, safeColor);

      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        existingItem.quantity += safeQuantity;
        recalculateCart(state);
        return;
      }

      const newItem: CartItem = {
        id,
        productId,
        name,
        price,
        image,
        selectedSize: safeSize,
        selectedColor: safeColor,
        size: safeSize,
        color: safeColor,
        quantity: safeQuantity,
      };

      state.items.push(newItem);
      state.isCartOpen = true;

      recalculateCart(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      recalculateCart(state);
    },

    updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(cartItem => cartItem.id === id);

      if (!item) return;

      const nextQuantity = Math.floor(quantity);

      if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
        state.items = state.items.filter(cartItem => cartItem.id !== id);
        recalculateCart(state);
        return;
      }

      item.quantity = nextQuantity;
      recalculateCart(state);
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(cartItem => cartItem.id === action.payload);

      if (!item) return;

      item.quantity += 1;
      recalculateCart(state);
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(cartItem => cartItem.id === action.payload);

      if (!item) return;

      if (item.quantity <= 1) {
        state.items = state.items.filter(
          cartItem => cartItem.id !== action.payload
        );
      } else {
        item.quantity -= 1;
      }

      recalculateCart(state);
    },

    clearCart: state => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.isCartOpen = false;
    },

    openCart: state => {
      state.isCartOpen = true;
    },

    closeCart: state => {
      state.isCartOpen = false;
    },

    toggleCart: state => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;
