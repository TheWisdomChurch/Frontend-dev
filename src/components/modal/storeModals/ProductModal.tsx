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
import { Button } from '@/components/utils/buttons';
import {
  H4,
  BodyMD,
  RegularText,
  MediumText,
  Caption,
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
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
        );
      } else {
        tl.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
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
          duration: 0.3,
          ease: 'power2.in',
          onComplete: onClose,
        });
      } else {
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 20,
          duration: 0.3,
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
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-3 ${isMobile ? 'pb-0' : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          w-full mx-auto overflow-hidden border shadow-xl
          ${isMobile ? 'rounded-t-2xl rounded-b-none max-h-[85vh]' : 'rounded-2xl max-w-md max-h-[85vh]'}
        `}
        style={{ backgroundColor: modalBackground, borderColor: borderColor }}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing">
            <div
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </div>
        )}

        <div className="flex flex-col h-full">
          {/* Product Image â€” Reduced height */}
          <div
            className={`relative ${isMobile ? 'h-32' : 'h-40'} overflow-hidden`}
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
              className={`absolute z-20 rounded-lg transition-all ${isMobile ? 'top-1 right-1 p-1' : 'top-2 right-2 p-1.5'}`}
              style={{ backgroundColor: colorScheme.opacity.primary10 }}
            >
              <X
                className={isMobile ? 'w-3 h-3' : 'w-4 h-4'}
                style={{ color: textColor }}
              />
            </button>
          </div>

          {/* Product Details */}
          <div
            className={`overflow-y-auto ${isMobile ? 'p-3 max-h-[calc(85vh-10rem)]' : 'p-4 max-h-[calc(85vh-12rem)]'}`}
          >
            <div className="space-y-4">
              <div>
                <H4
                  fontFamily="bricolage"
                  className={`mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}
                  style={{ color: textColor }}
                  useThemeColor={false}
                  weight="bold"
                >
                  {product.name}
                </H4>
                <BodyMD
                  className="text-xs"
                  style={{ color: subtitleTextColor }}
                  useThemeColor={false}
                >
                  {product.description}
                </BodyMD>
              </div>

              <FlexboxLayout align="center" gap="md">
                <MediumText
                  className={isMobile ? 'text-xl' : 'text-2xl'}
                  style={{ color: colorScheme.primary }}
                  useThemeColor={false}
                >
                  {product.price}
                </MediumText>
                {product.originalPrice && (
                  <RegularText
                    className={
                      isMobile
                        ? 'text-sm line-through'
                        : 'text-base line-through'
                    }
                    style={{ color: subtitleTextColor }}
                    useThemeColor={false}
                  >
                    {product.originalPrice}
                  </RegularText>
                )}
              </FlexboxLayout>

              {/* Size */}
              <div>
                <MediumText
                  className="block mb-2 text-xs"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Select Size
                </MediumText>
                <FlexboxLayout gap="sm" className="flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg border transition-all px-3 py-1.5 text-xs ${
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
                      {size}
                    </button>
                  ))}
                </FlexboxLayout>
              </div>

              {/* Color */}
              <div>
                <MediumText
                  className="block mb-2 text-xs"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Select Color
                </MediumText>
                <FlexboxLayout gap="sm" className="flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-lg border transition-all px-3 py-1.5 text-xs ${
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
                      {color}
                    </button>
                  ))}
                </FlexboxLayout>
              </div>

              {/* Quantity */}
              <div>
                <MediumText
                  className="block mb-2 text-xs"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Quantity
                </MediumText>
                <FlexboxLayout align="center" gap="md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`rounded-full border flex items-center justify-center transition-all ${isMobile ? 'w-8 h-8' : 'w-9 h-9'}`}
                    style={{ borderColor: inputBorderColor }}
                  >
                    <Minus
                      className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}
                      style={{ color: subtitleTextColor }}
                    />
                  </button>
                  <MediumText
                    className={`text-center ${isMobile ? 'text-lg w-8' : 'text-xl w-10'}`}
                    style={{ color: textColor }}
                    useThemeColor={false}
                  >
                    {quantity}
                  </MediumText>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`rounded-full border flex items-center justify-center transition-all ${isMobile ? 'w-8 h-8' : 'w-9 h-9'}`}
                    style={{ borderColor: inputBorderColor }}
                  >
                    <Plus
                      className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}
                      style={{ color: subtitleTextColor }}
                    />
                  </button>
                  <Caption
                    style={{ color: subtitleTextColor }}
                    useThemeColor={false}
                  >
                    {product.stock} in stock
                  </Caption>
                </FlexboxLayout>
              </div>

              {/* Add to Cart */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  curvature="xl"
                  elevated={true}
                  leftIcon={
                    <ShoppingBag className={isMobile ? 'w-4 h-4' : 'w-4 h-4'} />
                  }
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor}
                  className={`w-full transition-all ${isMobile ? 'py-2 text-sm' : 'py-2.5 text-sm'}`}
                  style={{
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                  }}
                >
                  <MediumText className="text-sm" useThemeColor={false}>
                    Add to Cart â€¢ {product.price}
                  </MediumText>
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

