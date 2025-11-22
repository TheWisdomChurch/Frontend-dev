/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
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
import { useEffect, useRef, useState } from 'react';

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
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Theme-based styles - Always dark theme
  const modalBackground = colorScheme.black;
  const textColor = colorScheme.primary;
  const subtitleTextColor = colorScheme.white;
  const buttonBackground = colorScheme.primary;
  const buttonTextColor = colorScheme.black;
  // const surfaceBackground = colorScheme.surface;
  const borderColor = colorScheme.primary;
  const inputBorderColor = colorScheme.border;

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (modalRef.current && isOpen && product) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.85, y: 100 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen, product]);

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
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border"
        style={{
          backgroundColor: modalBackground,
          borderColor: borderColor,
        }}
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* Product Image */}
          <div className="relative lg:w-1/2 h-64 lg:h-full overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 rounded-full p-3 transition-all"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary20;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary10;
              }}
            >
              <X className="w-6 h-6" style={{ color: textColor }} />
            </button>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-6 lg:p-10 overflow-y-auto">
            <div className="space-y-8">
              <div>
                <BaseText
                  fontFamily="bricolage"
                  weight="bold"
                  className="text-3xl lg:text-4xl"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  {product.name}
                </BaseText>
                <BodyLG
                  className="mt-3 leading-relaxed"
                  style={{ color: subtitleTextColor }}
                  useThemeColor={false}
                >
                  {product.description}
                </BodyLG>
              </div>

              <FlexboxLayout align="center" gap="md">
                <SemiBoldText
                  className="text-4xl"
                  style={{ color: colorScheme.primary }}
                  useThemeColor={false}
                >
                  {product.price}
                </SemiBoldText>
                {product.originalPrice && (
                  <LightText
                    className="text-2xl line-through"
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
                  className="mb-4"
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
                      className={`px-6 py-3 rounded-xl border-2 transition-all ${
                        selectedSize === size
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                          : `border-gray-600 hover:border-yellow-500/50 text-gray-300`
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
                      <BodyMD weight="medium" useThemeColor={false}>
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
                  className="mb-4"
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
                      className={`px-6 py-3 rounded-xl border-2 transition-all ${
                        selectedColor === color
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                          : `border-gray-600 hover:border-yellow-500/50 text-gray-300`
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
                      <BodyMD weight="medium" useThemeColor={false}>
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
                  className="mb-4"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  Quantity
                </BodyLG>
                <FlexboxLayout align="center" gap="lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110"
                    style={{ borderColor: inputBorderColor }}
                  >
                    <Minus
                      className="w-5 h-5"
                      style={{ color: subtitleTextColor }}
                    />
                  </button>
                  <SemiBoldText
                    className="text-2xl w-16 text-center"
                    style={{ color: textColor }}
                    useThemeColor={false}
                  >
                    {quantity}
                  </SemiBoldText>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110"
                    style={{ borderColor: inputBorderColor }}
                  >
                    <Plus
                      className="w-5 h-5"
                      style={{ color: subtitleTextColor }}
                    />
                  </button>
                  <BodySM
                    style={{ color: subtitleTextColor }}
                    useThemeColor={false}
                  >
                    {product.stock} in stock
                  </BodySM>
                </FlexboxLayout>
              </div>

              {/* Add to Cart */}
              <Button
                variant="primary"
                size="lg"
                curvature="full"
                elevated={true}
                leftIcon={<ShoppingBag className="w-6 h-6" />}
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="w-full py-5 font-bold transition-all hover:scale-105 shadow-2xl"
                style={{
                  backgroundColor: buttonBackground,
                  color: buttonTextColor,
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.primaryLight;
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.backgroundColor = buttonBackground;
                }}
              >
                <SemiBoldText
                  className="text-lg"
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
  );
};

export default ProductModal;
