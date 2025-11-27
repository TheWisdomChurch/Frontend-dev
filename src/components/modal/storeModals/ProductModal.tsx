/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/ProductModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useAppDispatch } from '@/components/utils/hooks/redux';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { Product } from '@/lib/types';
import Button from '@/components/utils/CustomButton';
import {
  BaseText,
  BodyLG,
  BodyMD,
  BodySM,
  SemiBoldText,
  LightText,
} from '@/components/text';
import { FlexboxLayout } from '@/components/layout';
import { useTheme } from '@/components/contexts/ThemeContext';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { colorScheme } = useTheme();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const modalBackground = colorScheme.black;
  const textColor = colorScheme.primary;
  const subtitleTextColor = colorScheme.white;
  const buttonBackground = colorScheme.primary;
  const buttonTextColor = colorScheme.black;
  const borderColor = colorScheme.primary;
  const inputBorderColor = colorScheme.border;

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
    }
  }, [product]);

  // FULL SCROLL LOCK
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'auto';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'auto';
      document.body.style.touchAction = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && modalRef.current && product) {
      const tl = gsap.timeline();
      if (isMobile) {
        tl.fromTo(
          modalRef.current,
          { y: '100%', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      } else {
        tl.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.85, y: 100 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
        );
      }
    }
  }, [isOpen, isMobile, product]);

  const handleClose = () => {
    if (modalRef.current) {
      if (isMobile) {
        gsap.to(modalRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: onClose,
        });
      } else {
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.85,
          y: 100,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: onClose,
        });
      }
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        selectedSize,
        selectedColor,
        quantity,
      })
    );
    handleClose();
  };

  if (!mounted || !isOpen || !product) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 ${isMobile ? 'pb-0' : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          w-full mx-auto overflow-hidden border shadow-2xl
          ${isMobile ? 'rounded-t-3xl rounded-b-none max-h-[92vh]' : 'rounded-3xl max-w-5xl max-h-[92vh]'}
        `}
        style={{ backgroundColor: modalBackground, borderColor: borderColor }}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div
              className="w-12 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row h-full">
          {/* Product Image — Reduced height on mobile */}
          <div
            className={`relative lg:w-1/2 ${isMobile ? 'h-48' : 'h-64 lg:h-full'} overflow-hidden`}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />

            <button
              onClick={handleClose}
              className={`absolute z-20 rounded-full transition-all ${isMobile ? 'top-2 right-2 p-2' : 'top-4 right-4 p-3'}`}
              style={{ backgroundColor: colorScheme.opacity.primary10 }}
              onMouseEnter={(e: any) =>
                (e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary20)
              }
              onMouseLeave={(e: any) =>
                (e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary10)
              }
            >
              <X
                className={isMobile ? 'w-5 h-5' : 'w-6 h-6'}
                style={{ color: textColor }}
              />
            </button>
          </div>

          {/* Product Details — FIXED HEIGHT & SCROLL */}
          <div
            className={`lg:w-1/2 overflow-y-auto scrollbar-hide ${isMobile ? 'p-5 pb-8' : 'p-6 lg:p-10'} ${isMobile ? 'max-h-[calc(92vh-14rem)]' : 'max-h-[calc(92vh-80px)]'}`}
            style={
              {
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              } as React.CSSProperties
            }
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div className="space-y-6">
              <div>
                <BaseText
                  fontFamily="bricolage"
                  weight="bold"
                  className={isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'}
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  {product.name}
                </BaseText>
                <BodyLG
                  className="mt-2 leading-relaxed text-sm"
                  style={{ color: subtitleTextColor }}
                  useThemeColor={false}
                >
                  {product.description}
                </BodyLG>
              </div>

              <FlexboxLayout align="center" gap="md">
                <SemiBoldText
                  className={isMobile ? 'text-3xl' : 'text-4xl'}
                  style={{ color: colorScheme.primary }}
                  useThemeColor={false}
                >
                  {product.price}
                </SemiBoldText>
                {product.originalPrice && (
                  <LightText
                    className={
                      isMobile
                        ? 'text-xl line-through'
                        : 'text-2xl line-through'
                    }
                    style={{ color: subtitleTextColor }}
                    useThemeColor={false}
                  >
                    {product.originalPrice}
                  </LightText>
                )}
              </FlexboxLayout>

              {/* Size */}
              <div>
                <BodyLG
                  weight="semibold"
                  className={`mb-3 ${isMobile ? 'text-base' : 'text-lg'}`}
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Select Size
                </BodyLG>
                <FlexboxLayout gap="sm" className="flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-xl border-2 transition-all ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} ${
                        selectedSize === size
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                          : 'border-gray-600 hover:border-yellow-500/50 text-gray-300'
                      }`}
                      style={{
                        borderColor:
                          selectedSize === size
                            ? colorScheme.primary
                            : inputBorderColor,
                        color:
                          selectedSize === size
                            ? colorScheme.primary
                            : subtitleTextColor,
                      }}
                    >
                      <BodyMD
                        weight="medium"
                        className={isMobile ? 'text-sm' : 'text-base'}
                        useThemeColor={false}
                      >
                        {size}
                      </BodyMD>
                    </button>
                  ))}
                </FlexboxLayout>
              </div>

              {/* Color */}
              <div>
                <BodyLG
                  weight="semibold"
                  className={`mb-3 ${isMobile ? 'text-base' : 'text-lg'}`}
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Select Color
                </BodyLG>
                <FlexboxLayout gap="sm" className="flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-xl border-2 transition-all ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} ${
                        selectedColor === color
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                          : 'border-gray-600 hover:border-yellow-500/50 text-gray-300'
                      }`}
                      style={{
                        borderColor:
                          selectedColor === color
                            ? colorScheme.primary
                            : inputBorderColor,
                        color:
                          selectedColor === color
                            ? colorScheme.primary
                            : subtitleTextColor,
                      }}
                    >
                      <BodyMD
                        weight="medium"
                        className={isMobile ? 'text-sm' : 'text-base'}
                        useThemeColor={false}
                      >
                        {color}
                      </BodyMD>
                    </button>
                  ))}
                </FlexboxLayout>
              </div>

              {/* Quantity */}
              <div>
                <BodyLG
                  weight="semibold"
                  className={`mb-3 ${isMobile ? 'text-base' : 'text-lg'}`}
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Quantity
                </BodyLG>
                <FlexboxLayout align="center" gap="lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${isMobile ? 'w-10 h-10' : 'w-12 h-12'}`}
                    style={{ borderColor: inputBorderColor }}
                  >
                    <Minus
                      className={isMobile ? 'w-4 h-4' : 'w-5 h-5'}
                      style={{ color: subtitleTextColor }}
                    />
                  </button>
                  <SemiBoldText
                    className={`text-center ${isMobile ? 'text-xl w-12' : 'text-2xl w-16'}`}
                    style={{ color: textColor }}
                    useThemeColor={false}
                  >
                    {quantity}
                  </SemiBoldText>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${isMobile ? 'w-10 h-10' : 'w-12 h-12'}`}
                    style={{ borderColor: inputBorderColor }}
                  >
                    <Plus
                      className={isMobile ? 'w-4 h-4' : 'w-5 h-5'}
                      style={{ color: subtitleTextColor }}
                    />
                  </button>
                  <BodySM
                    className="text-sm"
                    style={{ color: subtitleTextColor }}
                    useThemeColor={false}
                  >
                    {product.stock} in stock
                  </BodySM>
                </FlexboxLayout>
              </div>

              {/* Add to Cart — Always visible */}
              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  curvature="full"
                  elevated={true}
                  leftIcon={
                    <ShoppingBag className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                  }
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor}
                  className={`w-full font-bold transition-all hover:scale-105 shadow-2xl ${isMobile ? 'py-3.5 text-base' : 'py-5 text-lg'}`}
                  style={{
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                  }}
                  onMouseEnter={(e: any) =>
                    (e.currentTarget.style.backgroundColor =
                      colorScheme.primaryLight)
                  }
                  onMouseLeave={(e: any) =>
                    (e.currentTarget.style.backgroundColor = buttonBackground)
                  }
                >
                  <SemiBoldText
                    className={isMobile ? 'text-base' : 'text-lg'}
                    style={{ color: buttonTextColor }}
                    useThemeColor={false}
                  >
                    Add to Cart • {product.price}
                  </SemiBoldText>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;
