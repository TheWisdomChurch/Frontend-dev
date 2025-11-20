/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/components/utils/hooks/redux';
import { createOrder, clearCurrentOrder } from '@/lib/store/slices/orderSlice';
import { clearCart } from '@/lib/store/slices/cartSlice';
import Button from '@/components/utils/CustomButton';
import { BaseText, LightText } from '@/components/text';
import { FlexboxLayout, GridboxLayout } from '@/components/layout';
import { useTheme } from '@/components/contexts/ThemeContext';

const CheckoutForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector(state => state.cart);
  const { currentOrder } = useAppSelector(state => state.orders);
  const { colorScheme } = useTheme();

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const cardBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const textColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const borderColor = isDarkMode
    ? colorScheme.border
    : colorScheme.primary + '40';
  const inputBackground = isDarkMode ? colorScheme.white : colorScheme.surface;
  const inputBorderColor = isDarkMode
    ? colorScheme.borderLight
    : colorScheme.border;
  const successBackground = isDarkMode
    ? colorScheme.opacity.success10
    : colorScheme.opacity.success20;
  const successBorderColor = isDarkMode
    ? colorScheme.opacity.success20
    : colorScheme.opacity.success10;

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
        <div
          className="rounded-3xl p-8 border"
          style={{
            backgroundColor: successBackground,
            borderColor: successBorderColor,
          }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-3xl mb-4"
            style={{ color: textColor }}
          >
            Order Confirmed!
          </BaseText>
          <BaseText
            weight="semibold"
            className="text-xl mb-2"
            style={{ color: textColor }}
          >
            Order ID: {currentOrder.id}
          </BaseText>
          <LightText
            className="text-lg mb-6"
            style={{ color: secondaryTextColor }}
          >
            Thank you for your purchase! We'll send you a confirmation email
            shortly.
          </LightText>

          <FlexboxLayout justify="center" gap="md">
            <Button
              variant="primary"
              size="lg"
              curvature="full"
              onClick={() => dispatch(clearCurrentOrder())}
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor = colorScheme.primaryDark;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = colorScheme.primary;
              }}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              size="lg"
              curvature="full"
              onClick={() => window.print()}
              style={{
                borderColor: borderColor,
                color: textColor,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? colorScheme.opacity.black10
                  : colorScheme.opacity.white10;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
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
        <div
          className="rounded-3xl p-6 shadow-lg"
          style={{
            backgroundColor: cardBackground,
            border: `1px solid ${borderColor}`,
          }}
        >
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-2xl mb-6"
            style={{ color: textColor }}
          >
            Personal Information
          </BaseText>

          <GridboxLayout columns={1} responsive={{ md: 2 }} gap="lg">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: textColor }}
              >
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                style={{
                  backgroundColor: inputBackground,
                  borderColor: inputBorderColor,
                  color: textColor,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: textColor }}
              >
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                style={{
                  backgroundColor: inputBackground,
                  borderColor: inputBorderColor,
                  color: textColor,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: textColor }}
              >
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                style={{
                  backgroundColor: inputBackground,
                  borderColor: inputBorderColor,
                  color: textColor,
                }}
              />
            </div>
          </GridboxLayout>
        </div>

        {/* Delivery Address */}
        <div
          className="rounded-3xl p-6 shadow-lg"
          style={{
            backgroundColor: cardBackground,
            border: `1px solid ${borderColor}`,
          }}
        >
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-2xl mb-6"
            style={{ color: textColor }}
          >
            Delivery Address
          </BaseText>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: textColor }}
              >
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                style={{
                  backgroundColor: inputBackground,
                  borderColor: inputBorderColor,
                  color: textColor,
                }}
              />
            </div>

            <GridboxLayout columns={1} responsive={{ md: 3 }} gap="lg">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textColor }}
                >
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  style={{
                    backgroundColor: inputBackground,
                    borderColor: inputBorderColor,
                    color: textColor,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textColor }}
                >
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  style={{
                    backgroundColor: inputBackground,
                    borderColor: inputBorderColor,
                    color: textColor,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textColor }}
                >
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  style={{
                    backgroundColor: inputBackground,
                    borderColor: inputBorderColor,
                    color: textColor,
                  }}
                />
              </div>
            </GridboxLayout>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: textColor }}
              >
                Delivery Instructions (Optional)
              </label>
              <textarea
                name="deliveryInstructions"
                rows={3}
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                style={{
                  backgroundColor: inputBackground,
                  borderColor: inputBorderColor,
                  color: textColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div
          className="rounded-3xl p-6 shadow-lg"
          style={{
            backgroundColor: cardBackground,
            border: `1px solid ${borderColor}`,
          }}
        >
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-2xl mb-6"
            style={{ color: textColor }}
          >
            Order Summary
          </BaseText>

          <div className="space-y-3">
            {items.map(item => (
              <FlexboxLayout key={item.id} justify="between" align="center">
                <div>
                  <BaseText weight="semibold" style={{ color: textColor }}>
                    {item.name}
                  </BaseText>
                  <LightText
                    className="text-sm"
                    style={{ color: secondaryTextColor }}
                  >
                    {item.selectedSize} • {item.selectedColor} • Qty:{' '}
                    {item.quantity}
                  </LightText>
                </div>
                <BaseText weight="bold" style={{ color: textColor }}>
                  ₦
                  {(
                    parseFloat(item.price.replace(/[^\d.]/g, '')) *
                    item.quantity
                  ).toLocaleString()}
                </BaseText>
              </FlexboxLayout>
            ))}

            <div className="border-t pt-3" style={{ borderColor: borderColor }}>
              <FlexboxLayout justify="between" align="center">
                <BaseText
                  weight="bold"
                  className="text-xl"
                  style={{ color: textColor }}
                >
                  Total:
                </BaseText>
                <BaseText
                  weight="bold"
                  className="text-2xl"
                  style={{ color: colorScheme.primary }}
                >
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
          style={{
            backgroundColor: colorScheme.primary,
            color: colorScheme.black,
          }}
          onMouseEnter={(e: any) => {
            if (items.length > 0) {
              e.currentTarget.style.backgroundColor = colorScheme.primaryDark;
            }
          }}
          onMouseLeave={(e: any) => {
            e.currentTarget.style.backgroundColor = colorScheme.primary;
          }}
        >
          Place Order - ₦{total.toLocaleString()}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
