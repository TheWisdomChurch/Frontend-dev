import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Order, CartItem, CustomerInfo } from '@/lib/types';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
};

const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `WH-${timestamp}-${random}`.toUpperCase();
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (
      state,
      action: PayloadAction<{
        items: CartItem[];
        customerInfo: CustomerInfo;
      }>
    ) => {
      const { items, customerInfo } = action.payload;

      const total = items.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return sum + price * item.quantity;
      }, 0);

      const newOrder: Order = {
        id: generateOrderId(),
        items,
        total,
        customerInfo,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days from now
      };

      state.orders.unshift(newOrder);
      state.currentOrder = newOrder;
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: Order['status'] }>
    ) => {
      const order = state.orders.find(
        order => order.id === action.payload.orderId
      );
      if (order) {
        order.status = action.payload.status;
      }
    },

    clearCurrentOrder: state => {
      state.currentOrder = null;
    },
  },
});

export const { createOrder, updateOrderStatus, clearCurrentOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;
