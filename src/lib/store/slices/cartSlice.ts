import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/lib/types';

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

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        productId: number;
        name: string;
        price: string;
        image: string;
        selectedSize: string;
        selectedColor: string;
        quantity: number;
      }>
    ) => {
      const { productId, selectedSize, selectedColor, ...productData } =
        action.payload;
      const existingItem = state.items.find(
        item =>
          item.productId === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        const newItem: CartItem = {
          id: `${productId}-${selectedSize}-${selectedColor}-${Date.now()}`,
          productId,
          selectedSize,
          selectedColor,
          size: selectedSize, // Add this line
          color: selectedColor, // Add this line
          ...productData,
          quantity: action.payload.quantity,
        };
        state.items.push(newItem);
      }

      state.itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.total = state.items.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return total + price * item.quantity;
      }, 0);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.total = state.items.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return total + price * item.quantity;
      }, 0);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.itemCount = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.total = state.items.reduce((total, item) => {
          const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
          return total + price * item.quantity;
        }, 0);
      }
    },

    clearCart: state => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
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
  clearCart,
  toggleCart,
} = cartSlice.actions;
export default cartSlice.reducer;
