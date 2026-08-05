import { describe, expect, it } from 'vitest';

import cartReducer, {
  addToCart,
  decrementQuantity,
  updateQuantity,
} from '@/lib/store/slices/cartSlice';
import { normalizeProducts } from '@/lib/api/storeClient';

describe('cart state invariants', () => {
  const item = {
    productId: 7,
    name: 'Wisdom Shirt',
    price: 'NGN 12,500',
    image: '/shirt.webp',
    selectedSize: ' L ',
    selectedColor: ' Black ',
  };

  it('normalizes variants and combines identical cart lines', () => {
    const once = cartReducer(undefined, addToCart(item));
    const twice = cartReducer(once, addToCart({ ...item, quantity: 2 }));

    expect(twice.items).toHaveLength(1);
    expect(twice.items[0]).toMatchObject({
      id: '7-l-black',
      selectedSize: 'L',
      selectedColor: 'Black',
      quantity: 3,
    });
    expect(twice.itemCount).toBe(3);
    expect(twice.total).toBe(37_500);
  });

  it('removes lines when quantity becomes invalid or reaches zero', () => {
    const populated = cartReducer(undefined, addToCart(item));
    const id = populated.items[0].id;

    expect(
      cartReducer(populated, updateQuantity({ id, quantity: 0 })).items
    ).toHaveLength(0);
    expect(cartReducer(populated, decrementQuantity(id)).items).toHaveLength(0);
  });
});

describe('store API normalization', () => {
  it('normalizes unknown backend product records into the domain model', () => {
    const products = normalizeProducts([
      {
        id: '42',
        name: 'Book',
        price: 5000,
        sizes: ['one-size'],
        colors: null,
        tags: ['publication', 2026],
        stock: '3',
      },
      null,
    ]);

    expect(products).toEqual([
      {
        id: 42,
        name: 'Book',
        category: 'general',
        price: '5000',
        originalPrice: undefined,
        image: '',
        description: '',
        sizes: ['one-size'],
        colors: [],
        tags: ['publication', '2026'],
        stock: 3,
        createdAt: undefined,
        updatedAt: undefined,
      },
    ]);
  });

  it('returns an empty collection for malformed payloads', () => {
    expect(normalizeProducts({ data: 'not-an-array' })).toEqual([]);
    expect(normalizeProducts(null)).toEqual([]);
  });
});
