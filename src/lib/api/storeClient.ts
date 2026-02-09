/* eslint-disable @typescript-eslint/no-explicit-any */
import { merchandise } from '@/lib/data';
import type { Product } from '@/lib/types';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentMethod = 'transfer' | 'online' | 'delivery';

export interface StoreOrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface StoreOrderPayload {
  orderId: string;
  items: StoreOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  bankDetails?: {
    customerAccountName?: string;
    customerBankName?: string;
  };
}

export interface StoreOrder extends StoreOrderPayload {
  status: OrderStatus;
  orderDate: string;
}

const ORDERS_KEY = 'storeOrders';
const LAST_ORDER_KEY = 'lastOrderData';

const readOrders = (): StoreOrder[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as StoreOrder[]) : [];
  } catch {
    return [];
  }
};

const writeOrders = (orders: StoreOrder[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const storeClient = {
  async listProducts(): Promise<Product[]> {
    // TODO: Replace with real API call when endpoints are ready.
    return new Promise(resolve => {
      setTimeout(() => resolve(merchandise), 250);
    });
  },

  async createOrder(payload: StoreOrderPayload): Promise<StoreOrder> {
    // TODO: Replace with POST /orders when backend is available.
    const order: StoreOrder = {
      ...payload,
      status: 'pending',
      orderDate: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const orders = readOrders();
      orders.unshift(order);
      writeOrders(orders);
      window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    }

    return new Promise(resolve => {
      setTimeout(() => resolve(order), 400);
    });
  },

  async getOrder(orderId: string): Promise<StoreOrder | null> {
    if (typeof window === 'undefined') return null;
    const orders = readOrders();
    const found = orders.find(order => order.orderId === orderId);
    return found || null;
  },

  async getLastOrder(): Promise<StoreOrder | null> {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoreOrder;
    } catch {
      return null;
    }
  },
};
