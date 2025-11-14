'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/components/utils/hooks/redux';
import { createOrder, clearCurrentOrder } from '@/lib/store/slices/orderSlice';
import { clearCart } from '@/lib/store/slices/cartSlice';
import Button from '@/components/utils/CustomButton';
import { BaseText, LightText } from '@/components/text';
import { FlexboxLayout, GridboxLayout } from '@/components/layout';

const CheckoutForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector(state => state.cart);
  const { currentOrder } = useAppSelector(state => state.orders);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    deliveryInstructions: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    dispatch(
      createOrder({
        items,
        customerInfo: formData,
      })
    );

    dispatch(clearCart());
  };

  if (currentOrder) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-green-50 rounded-3xl p-8 border border-green-200">
          <div className="text-6xl mb-4">🎉</div>
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-3xl mb-4"
          >
            Order Confirmed!
          </BaseText>
          <BaseText weight="semibold" className="text-xl mb-2">
            Order ID: {currentOrder.id}
          </BaseText>
          <LightText className="text-lg mb-6">
            Thank you for your purchase! We'll send you a confirmation email
            shortly.
          </LightText>

          <FlexboxLayout justify="center" gap="md">
            <Button
              variant="primary"
              size="lg"
              curvature="full"
              onClick={() => dispatch(clearCurrentOrder())}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              size="lg"
              curvature="full"
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
          </FlexboxLayout>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-2xl mb-6"
          >
            Personal Information
          </BaseText>

          {/* FIXED: Use responsive prop instead of mdColumns */}
          <GridboxLayout columns={1} responsive={{ md: 2 }} gap="lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </GridboxLayout>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-2xl mb-6"
          >
            Delivery Address
          </BaseText>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* FIXED: Use responsive prop instead of mdColumns */}
            <GridboxLayout columns={1} responsive={{ md: 3 }} gap="lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
            </GridboxLayout>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Instructions (Optional)
              </label>
              <textarea
                name="deliveryInstructions"
                rows={3}
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-2xl mb-6"
          >
            Order Summary
          </BaseText>

          <div className="space-y-3">
            {items.map(item => (
              <FlexboxLayout key={item.id} justify="between" align="center">
                <div>
                  <BaseText weight="semibold">{item.name}</BaseText>
                  <LightText className="text-sm">
                    {item.selectedSize} • {item.selectedColor} • Qty:{' '}
                    {item.quantity}
                  </LightText>
                </div>
                <BaseText weight="bold">
                  ₦
                  {(
                    parseFloat(item.price.replace(/[^\d.]/g, '')) *
                    item.quantity
                  ).toLocaleString()}
                </BaseText>
              </FlexboxLayout>
            ))}

            <div className="border-t border-gray-200 pt-3">
              <FlexboxLayout justify="between" align="center">
                <BaseText weight="bold" className="text-xl">
                  Total:
                </BaseText>
                <BaseText weight="bold" className="text-2xl text-yellow-600">
                  ₦{total.toLocaleString()}
                </BaseText>
              </FlexboxLayout>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          curvature="full"
          elevated={true}
          disabled={items.length === 0}
          className="w-full transition-all duration-300 transform hover:scale-105"
        >
          Place Order - ₦{total.toLocaleString()}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
