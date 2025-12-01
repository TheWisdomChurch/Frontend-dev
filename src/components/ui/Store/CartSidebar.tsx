'use client';

import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
import { useAppDispatch, useAppSelector } from '@/components/utils/hooks/redux';
import {
  removeFromCart,
  updateQuantity,
  toggleCart,
  clearCart,
} from '@/lib/store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import Button from '@/components/utils/CustomButton';
import { BaseText, LightText } from '@/components/text';
import { FlexboxLayout } from '@/components/layout';
import { useTheme } from '@/components/contexts/ThemeContext';

const CartSidebar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total, itemCount, isCartOpen } = useAppSelector(
    state => state.cart
  );
  const { colorScheme } = useTheme();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const sidebarBackground = isDarkMode ? colorScheme.black : colorScheme.white;
  const textColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const borderColor = isDarkMode ? colorScheme.border : colorScheme.borderLight;
  const itemBackground = isDarkMode
    ? colorScheme.surface
    : colorScheme.backgroundSecondary;
  const hoverBackground = isDarkMode
    ? colorScheme.opacity.white10
    : colorScheme.opacity.black10;

  useEffect(() => {
    if (sidebarRef.current && overlayRef.current) {
      if (isCartOpen) {
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
        gsap.fromTo(
          sidebarRef.current,
          { x: 400, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
        );
      } else {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
        gsap.to(sidebarRef.current, {
          x: 400,
          opacity: 0,
          duration: 0.3,
        });
      }
    }
  }, [isCartOpen]);

  const handleOverlayClick = () => {
    dispatch(toggleCart());
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    dispatch(toggleCart());
    router.push('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40 opacity-0"
        onClick={handleOverlayClick}
      />

      <div
        ref={sidebarRef}
        className="fixed right-0 top-0 h-full w-full max-w-md z-50 shadow-2xl flex flex-col"
        style={{
          backgroundColor: sidebarBackground,
          borderLeft: `1px solid ${borderColor}`,
        }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: borderColor }}>
          <FlexboxLayout justify="between" align="center">
            <BaseText
              fontFamily="bricolage"
              weight="bold"
              className="text-2xl"
              style={{ color: textColor }}
            >
              Your Cart ({itemCount})
            </BaseText>
            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 rounded-full transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: textColor,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = hoverBackground;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </FlexboxLayout>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <FlexboxLayout
              direction="column"
              justify="center"
              align="center"
              gap="md"
              className="h-full text-center"
            >
              <ShoppingBag
                className="w-16 h-16"
                style={{ color: secondaryTextColor }}
              />
              <BaseText
                weight="semibold"
                className="text-xl"
                style={{ color: textColor }}
              >
                Your cart is empty
              </BaseText>
              <LightText style={{ color: secondaryTextColor }}>
                Add some items to get started
              </LightText>
            </FlexboxLayout>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 space-y-3"
                  style={{ backgroundColor: itemBackground }}
                >
                  <FlexboxLayout justify="between" align="start">
                    <div className="flex-1">
                      <BaseText
                        weight="semibold"
                        className="text-lg"
                        style={{ color: textColor }}
                      >
                        {item.name}
                      </BaseText>
                      <LightText
                        className="text-sm"
                        style={{ color: secondaryTextColor }}
                      >
                        {item.selectedSize} • {item.selectedColor}
                      </LightText>
                      <BaseText
                        weight="bold"
                        className="mt-1"
                        style={{ color: colorScheme.primary }}
                      >
                        {item.price}
                      </BaseText>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 rounded-full transition-colors"
                      style={{
                        color: colorScheme.error,
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = isDarkMode
                          ? colorScheme.opacity.error10
                          : colorScheme.opacity.error5;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </FlexboxLayout>

                  <FlexboxLayout justify="between" align="center">
                    <FlexboxLayout align="center" gap="sm">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
                        style={{
                          borderColor: borderColor,
                          color: textColor,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor =
                            colorScheme.primary;
                          e.currentTarget.style.backgroundColor =
                            hoverBackground;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = borderColor;
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <BaseText
                        weight="bold"
                        className="w-8 text-center"
                        style={{ color: textColor }}
                      >
                        {item.quantity}
                      </BaseText>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
                        style={{
                          borderColor: borderColor,
                          color: textColor,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor =
                            colorScheme.primary;
                          e.currentTarget.style.backgroundColor =
                            hoverBackground;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = borderColor;
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </FlexboxLayout>

                    <BaseText
                      weight="bold"
                      className="text-lg"
                      style={{ color: textColor }}
                    >
                      ₦
                      {(
                        parseFloat(item.price.replace(/[^\d.]/g, '')) *
                        item.quantity
                      ).toLocaleString()}
                    </BaseText>
                  </FlexboxLayout>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="p-6 border-t space-y-4"
            style={{ borderColor: borderColor }}
          >
            <FlexboxLayout justify="between" align="center">
              <BaseText
                weight="semibold"
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
            <Button
              variant="primary"
              size="lg"
              curvature="full"
              elevated={true}
              onClick={handleCheckout}
              className="w-full transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
              }}
              onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = colorScheme.primaryDark;
              }}
              onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = colorScheme.primary;
              }}
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              size="md"
              curvature="full"
              onClick={() => dispatch(clearCart())}
              className="w-full"
              style={{
                borderColor: borderColor,
                color: textColor,
              }}
              onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = hoverBackground;
              }}
              onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Clear Cart
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
