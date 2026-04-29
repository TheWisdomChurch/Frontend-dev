import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CartItem, CustomerInfo, Order } from '@/lib/types';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
}

type CreateOrderPayload = {
  items: CartItem[];
  customerInfo: CustomerInfo;
};

type UpdateOrderStatusPayload = {
  orderId: string;
  status: Order['status'];
};

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
};

const parsePrice = (price: string): number => {
  const value = Number.parseFloat(String(price).replace(/[^\d.]/g, ''));
  return Number.isFinite(value) ? value : 0;
};

const calculateOrderTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    const quantity = Number.isFinite(item.quantity)
      ? Math.max(0, Math.floor(item.quantity))
      : 0;

    return sum + parsePrice(item.price) * quantity;
  }, 0);
};

const cloneOrderItems = (items: CartItem[]): CartItem[] => {
  return items.map(item => ({
    ...item,
    quantity: Number.isFinite(item.quantity)
      ? Math.max(1, Math.floor(item.quantity))
      : 1,
  }));
};

const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8).toUpperCase()
      : Math.random().toString(36).slice(2, 10).toUpperCase();

  return `WH-${timestamp}-${random}`;
};

const getEstimatedDeliveryDate = (): string => {
  const estimated = new Date();
  estimated.setDate(estimated.getDate() + 7);
  return estimated.toISOString();
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<CreateOrderPayload>) => {
      const { items, customerInfo } = action.payload;

      const safeItems = cloneOrderItems(items);

      if (safeItems.length === 0) return;

      const newOrder: Order = {
        id: generateOrderId(),
        items: safeItems,
        total: calculateOrderTotal(safeItems),
        customerInfo,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDelivery: getEstimatedDeliveryDate(),
      };

      state.orders.unshift(newOrder);
      state.currentOrder = newOrder;
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<UpdateOrderStatusPayload>
    ) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(item => item.id === orderId);

      if (!order) return;

      order.status = status;

      if (state.currentOrder?.id === orderId) {
        state.currentOrder.status = status;
      }
    },

    setCurrentOrder: (state, action: PayloadAction<string>) => {
      state.currentOrder =
        state.orders.find(order => order.id === action.payload) ?? null;
    },

    clearCurrentOrder: state => {
      state.currentOrder = null;
    },

    clearOrders: state => {
      state.orders = [];
      state.currentOrder = null;
    },
  },
});

export const {
  createOrder,
  updateOrderStatus,
  setCurrentOrder,
  clearCurrentOrder,
  clearOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
