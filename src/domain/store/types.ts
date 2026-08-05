export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryInstructions?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery?: string;
}

export interface ProductFilters {
  searchTerm: string;
  selectedCategory: string;
  sortBy: 'name' | 'price-low' | 'price-high' | 'newest';
}
