'use client';

import { useEffect, useRef } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
import { useAppDispatch, useAppSelector } from '@/components/utils/hooks/redux';
import {
  removeFromCart,
  updateQuantity,
  toggleCart,
  clearCart,
} from '@/lib/store/slices/cartSlice';

import Button from '@/components/utils/CustomButton';
import { BaseText, LightText } from '@/components/text';
import { FlexboxLayout } from '@/components/layout';

const CartSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, total, itemCount, isCartOpen } = useAppSelector(
    state => state.cart
  );
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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
    // Navigate to checkout page
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
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <FlexboxLayout justify="between" align="center">
            <BaseText fontFamily="bricolage" weight="bold" className="text-2xl">
              Your Cart ({itemCount})
            </BaseText>
            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
              <ShoppingBag className="w-16 h-16 text-gray-300" />
              <BaseText weight="semibold" className="text-xl text-gray-600">
                Your cart is empty
              </BaseText>
              <LightText className="text-gray-500">
                Add some items to get started
              </LightText>
            </FlexboxLayout>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-2xl p-4 space-y-3"
                >
                  <FlexboxLayout justify="between" align="start">
                    <div className="flex-1">
                      <BaseText weight="semibold" className="text-lg">
                        {item.name}
                      </BaseText>
                      <LightText className="text-sm">
                        {item.selectedSize} • {item.selectedColor}
                      </LightText>
                      <BaseText weight="bold" className="text-yellow-600 mt-1">
                        {item.price}
                      </BaseText>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 hover:bg-red-50 rounded-full transition-colors text-red-500"
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
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-yellow-400 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <BaseText weight="bold" className="w-8 text-center">
                        {item.quantity}
                      </BaseText>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-yellow-400 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </FlexboxLayout>

                    <BaseText weight="bold" className="text-lg">
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
          <div className="p-6 border-t border-gray-200 space-y-4">
            <FlexboxLayout justify="between" align="center">
              <BaseText weight="semibold" className="text-xl">
                Total:
              </BaseText>
              <BaseText weight="bold" className="text-2xl text-yellow-600">
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
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="outline"
              size="md"
              curvature="full"
              onClick={() => dispatch(clearCart())}
              className="w-full"
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
