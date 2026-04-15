/* eslint-disable @typescript-eslint/no-explicit-any */
import { merchandise } from '@/lib/data';
import type { Product } from '@/lib/types';

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
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

const inMemoryOrders: StoreOrder[] = [];
let inMemoryLastOrder: StoreOrder | null = null;

const readOrders = (): StoreOrder[] => {
  return inMemoryOrders;
};

const writeOrders = (orders: StoreOrder[]) => {
  inMemoryOrders.splice(0, inMemoryOrders.length, ...orders);
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

    const orders = readOrders();
    orders.unshift(order);
    writeOrders(orders);
    inMemoryLastOrder = order;

    return new Promise(resolve => {
      setTimeout(() => resolve(order), 400);
    });
  },

  async getOrder(orderId: string): Promise<StoreOrder | null> {
    const orders = readOrders();
    const found = orders.find(order => order.orderId === orderId);
    return found || null;
  },

  async getLastOrder(): Promise<StoreOrder | null> {
    return inMemoryLastOrder;
  },
};
