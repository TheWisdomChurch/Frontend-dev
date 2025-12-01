/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/components/utils/hooks/redux';
import { clearCart } from '@/lib/store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import Button from '@/components/utils/CustomButton';
import { FlexboxLayout } from '@/components/layout';
import { BaseText, LightText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';

const CheckoutForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector(state => state.cart);
  const { colorScheme } = useTheme();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const cardBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const inputBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const inputBorderColor = isDarkMode
    ? colorScheme.border
    : colorScheme.borderLight;
  const textColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const labelColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const borderColor = isDarkMode ? colorScheme.border : colorScheme.borderLight;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Process order here
      console.log('Order submitted:', { formData, items, total });

      // Clear cart and redirect
      dispatch(clearCart());
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    formData.address &&
    formData.city &&
    formData.state &&
    formData.zipCode;

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{
            backgroundColor: cardBackground,
            borderColor: borderColor,
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: labelColor }}
              >
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
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
                style={{ color: labelColor }}
              >
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
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
                style={{ color: labelColor }}
              >
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
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
                style={{ color: labelColor }}
              >
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
                style={{
                  backgroundColor: inputBackground,
                  borderColor: inputBorderColor,
                  color: textColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{
            backgroundColor: cardBackground,
            borderColor: borderColor,
          }}
        >
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-2xl mb-6"
            style={{ color: textColor }}
          >
            Shipping Address
          </BaseText>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: labelColor }}
              >
                Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
                style={{
                  backgroundColor: inputBackground,
                  borderColor: inputBorderColor,
                  color: textColor,
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: labelColor }}
                >
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
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
                  style={{ color: labelColor }}
                >
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
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
                  style={{ color: labelColor }}
                >
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
                  style={{
                    backgroundColor: inputBackground,
                    borderColor: inputBorderColor,
                    color: textColor,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Notice */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{
            backgroundColor: cardBackground,
            borderColor: borderColor,
          }}
        >
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-2xl mb-6"
            style={{ color: textColor }}
          >
            Payment Method
          </BaseText>

          <div
            className="p-4 rounded-2xl mb-4"
            style={{
              backgroundColor: isDarkMode
                ? colorScheme.opacity.info10
                : colorScheme.opacity.info5,
              border: `1px solid ${colorScheme.info}40`,
            }}
          >
            <LightText className="text-sm" style={{ color: colorScheme.info }}>
              💳 <strong>Pay on Delivery</strong> - You can pay with cash or
              card when your order arrives. Our delivery agent will bring a POS
              machine for card payments.
            </LightText>
          </div>

          <LightText style={{ color: labelColor }} className="text-sm">
            After submitting your order, our team will contact you within 24
            hours to confirm delivery details and payment method.
          </LightText>
        </div>

        {/* Order Summary */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{
            backgroundColor: cardBackground,
            borderColor: borderColor,
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

          <div className="space-y-4">
            {items.map(item => (
              <FlexboxLayout key={item.id} justify="between" align="center">
                <div className="flex-1">
                  <BaseText weight="semibold" style={{ color: textColor }}>
                    {item.name}
                  </BaseText>
                  <LightText style={{ color: labelColor }} className="text-sm">
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

            <div className="border-t pt-4" style={{ borderColor: borderColor }}>
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

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          curvature="full"
          elevated={true}
          disabled={!isFormValid || isSubmitting}
          className="w-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            backgroundColor:
              isFormValid && !isSubmitting
                ? colorScheme.primary
                : colorScheme.textTertiary,
            color: colorScheme.black,
          }}
          onMouseEnter={(e: any) => {
            if (isFormValid && !isSubmitting) {
              e.currentTarget.style.backgroundColor = colorScheme.primaryDark;
            }
          }}
          onMouseLeave={(e: any) => {
            if (isFormValid && !isSubmitting) {
              e.currentTarget.style.backgroundColor = colorScheme.primary;
            }
          }}
        >
          {isSubmitting ? (
            <FlexboxLayout align="center" gap="sm">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Order...
            </FlexboxLayout>
          ) : (
            `Complete Order - ₦${total.toLocaleString()}`
          )}
        </Button>

        {/* Form validation notice */}
        {!isFormValid && (
          <LightText
            className="text-center text-sm"
            style={{ color: colorScheme.warning }}
          >
            Please fill in all required fields to complete your order.
          </LightText>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
