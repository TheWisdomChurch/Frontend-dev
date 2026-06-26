'use client';

import { useEffect, useRef } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
import { useAppDispatch, useAppSelector } from '@/shared/utils/hooks/redux';
import {
  removeFromCart,
  updateQuantity,
  toggleCart,
  clearCart,
} from '@/lib/store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/utils/buttons';
import { BaseText, LightText } from '@/shared/text';
import { FlexboxLayout } from '@/shared/layout';

const CartSidebar: React.FC = () => {
  const router = useRouter();
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
        className="fixed inset-0 z-40 bg-black/50 opacity-0"
        onClick={() => dispatch(toggleCart())}
      />

      <div
        ref={sidebarRef}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/[0.12] bg-[var(--app-surface)] shadow-2xl"
      >
        {/* Header */}
        <div className="border-b border-white/[0.12] p-6">
          <FlexboxLayout justify="between" align="center">
            <BaseText
              fontFamily="bricolage"
              weight="bold"
              className="text-2xl text-white"
            >
              Your Cart ({itemCount})
            </BaseText>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleCart())}
              className="rounded-full text-white hover:bg-white/10"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </Button>
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
              <ShoppingBag className="h-16 w-16 text-white/60" />
              <BaseText weight="semibold" className="text-xl text-white">
                Your cart is empty
              </BaseText>
              <LightText className="text-white/60">
                Add some items to get started
              </LightText>
            </FlexboxLayout>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="space-y-3 rounded-2xl bg-white/[0.04] p-4"
                >
                  <FlexboxLayout justify="between" align="start">
                    <div className="flex-1">
                      <BaseText
                        weight="semibold"
                        className="text-lg text-white"
                      >
                        {item.name}
                      </BaseText>
                      <LightText className="text-sm text-white/60">
                        {item.selectedSize} • {item.selectedColor}
                      </LightText>
                      <BaseText
                        weight="bold"
                        className="mt-1 text-[var(--app-primary)]"
                      >
                        {item.price}
                      </BaseText>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="rounded-full text-red-500 hover:bg-red-500/10"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </FlexboxLayout>

                  <FlexboxLayout justify="between" align="center">
                    <FlexboxLayout align="center" gap="sm">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="h-8 w-8 rounded-full border border-white/[0.12] text-white hover:border-[var(--app-primary)] hover:bg-white/10"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <BaseText
                        weight="bold"
                        className="w-8 text-center text-white"
                      >
                        {item.quantity}
                      </BaseText>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="h-8 w-8 rounded-full border border-white/[0.12] text-white hover:border-[var(--app-primary)] hover:bg-white/10"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </FlexboxLayout>

                    <BaseText weight="bold" className="text-lg text-white">
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
          <div className="space-y-4 border-t border-white/[0.12] p-6">
            <FlexboxLayout justify="between" align="center">
              <BaseText weight="semibold" className="text-xl text-white">
                Total:
              </BaseText>
              <BaseText
                weight="bold"
                className="text-2xl text-[var(--app-primary)]"
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
              className="w-full transition-all duration-300 hover:scale-105"
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              size="md"
              curvature="full"
              onClick={() => dispatch(clearCart())}
              className="w-full text-white hover:bg-white/10"
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
