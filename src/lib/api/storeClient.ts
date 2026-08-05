import type { Product } from '@/domain/store/types';
import { resolveConfiguredApiOrigin } from '@/lib/apiOrigin';
import { createHttpClient, HttpError, isHttpError, isRecord } from '@/lib/http';

type OrderStatus =
  'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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
  paymentSlipUrl?: string;
}

export interface StoreOrder extends StoreOrderPayload {
  status: OrderStatus;
  orderDate: string;
}

const API_ORIGIN = resolveConfiguredApiOrigin();
const API_V1_BASE_URL = `${API_ORIGIN}/api/v1`;
const storeHttp = createHttpClient({ baseUrl: API_V1_BASE_URL });

const inMemoryFallback: { lastOrder: StoreOrder | null } = {
  lastOrder: null,
};

export { HttpError as StoreApiError };

export function normalizeProducts(value: unknown): Product[] {
  return (Array.isArray(value) ? value : []).filter(isRecord).map(item => ({
    id: Number(item.id),
    name: String(item.name || ''),
    category: String(item.category || 'general'),
    price: String(item.price || 'N0'),
    originalPrice:
      typeof item.originalPrice === 'string' ? item.originalPrice : undefined,
    image: String(item.image || ''),
    description: String(item.description || ''),
    sizes: Array.isArray(item.sizes) ? item.sizes.map(String) : [],
    colors: Array.isArray(item.colors) ? item.colors.map(String) : [],
    tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
    stock: Number(item.stock || 0),
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
  }));
}

export const storeClient = {
  async uploadPaymentSlip(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    form.append('kind', 'document');
    form.append('module', 'store-orders');

    const data = await storeHttp.request<unknown>('/uploads/files', {
      method: 'POST',
      body: form,
      unwrap: true,
    });

    const url = isRecord(data) ? (data.url ?? data.publicUrl) : undefined;
    if (typeof url !== 'string' || !url) {
      throw new HttpError('Upload succeeded but returned no file URL', {
        statusCode: 502,
        details: data,
      });
    }
    return url;
  },

  async listProducts(signal?: AbortSignal): Promise<Product[]> {
    const data = await storeHttp.request<unknown>('/store/products', {
      method: 'GET',
      signal,
      unwrap: true,
    });

    return normalizeProducts(data);
  },

  async createOrder(payload: StoreOrderPayload): Promise<StoreOrder> {
    const order = await storeHttp.request<StoreOrder>('/store/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
      unwrap: true,
    });
    inMemoryFallback.lastOrder = order;
    return order;
  },

  async getOrder(orderId: string): Promise<StoreOrder | null> {
    if (!orderId) return null;
    try {
      const order = await storeHttp.request<StoreOrder>(
        `/store/orders/${encodeURIComponent(orderId)}`,
        { method: 'GET', unwrap: true }
      );
      inMemoryFallback.lastOrder = order;
      return order;
    } catch (error) {
      if (isHttpError(error) && error.statusCode === 404) return null;
      throw error;
    }
  },

  async getLastOrder(): Promise<StoreOrder | null> {
    return inMemoryFallback.lastOrder;
  },
};
