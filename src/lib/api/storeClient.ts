/* eslint-disable @typescript-eslint/no-explicit-any */
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
  productId?: number;
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

const DEFAULT_LOCAL_API_ORIGIN = 'http://localhost:8080';
const DEFAULT_PROD_API_ORIGIN = 'https://api.wisdomchurchhq.org';

function normalizeOrigin(raw?: string | null): string {
  const isProd = process.env.NODE_ENV === 'production';

  if (!raw || !raw.trim()) {
    return isProd ? DEFAULT_PROD_API_ORIGIN : DEFAULT_LOCAL_API_ORIGIN;
  }

  let base = raw.trim().replace(/\/+$/, '');
  if (base.endsWith('/api/v1')) base = base.slice(0, -'/api/v1'.length);
  return base;
}

const API_ORIGIN = normalizeOrigin(
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL
);
const API_V1_BASE_URL = `${API_ORIGIN}/api/v1`;

const inMemoryFallback: { lastOrder: StoreOrder | null } = {
  lastOrder: null,
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_V1_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const json = (await res.json().catch(() => null)) as any;
  if (!res.ok) {
    const message = json?.message || json?.error || 'Request failed';
    throw new Error(message);
  }

  const payload = json?.data ?? json;
  return payload as T;
}

export const storeClient = {
  async listProducts(): Promise<Product[]> {
    const data = await request<any[]>('/store/products', { method: 'GET' });

    return (Array.isArray(data) ? data : []).map(item => ({
      id: Number(item.id),
      name: String(item.name || ''),
      category: String(item.category || 'general'),
      price: String(item.price || 'N0'),
      originalPrice:
        typeof item.originalPrice === 'string' ? item.originalPrice : undefined,
      image: String(item.image || '/images/placeholder.jpg'),
      description: String(item.description || ''),
      sizes: Array.isArray(item.sizes) ? item.sizes.map(String) : [],
      colors: Array.isArray(item.colors) ? item.colors.map(String) : [],
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      stock: Number(item.stock || 0),
    }));
  },

  async createOrder(payload: StoreOrderPayload): Promise<StoreOrder> {
    const order = await request<StoreOrder>('/store/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    inMemoryFallback.lastOrder = order;
    return order;
  },

  async getOrder(orderId: string): Promise<StoreOrder | null> {
    if (!orderId) return null;
    try {
      const order = await request<StoreOrder>(
        `/store/orders/${encodeURIComponent(orderId)}`,
        { method: 'GET' }
      );
      inMemoryFallback.lastOrder = order;
      return order;
    } catch {
      return null;
    }
  },

  async getLastOrder(): Promise<StoreOrder | null> {
    return inMemoryFallback.lastOrder;
  },
};
