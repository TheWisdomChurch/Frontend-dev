 
'use client';

import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
import { useAppDispatch } from '@/components/utils/hooks/redux';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { Product } from '@/lib/types';
import Button from '@/components/utils/CustomButton';
import { BaseText, LightText } from '@/components/text';
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

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (modalRef.current) {
      if (isOpen && product) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.85, y: 100 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
        );
      }
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
        className="bg-black rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-yellow-600/20"
        style={{ backgroundColor: '#000000f0', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* Product Image - Full height on mobile */}
          <div className="relative lg:w-1/2 h-64 lg:h-full bg-gradient-to-br from-gray-900 to-black overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-6 lg:p-10 overflow-y-auto bg-gradient-to-b from-black/95 to-black">
            <div className="space-y-8">
              {/* Title & Description */}
              <div>
                <BaseText
                  fontFamily="bricolage"
                  weight="bold"
                  className="text-3xl lg:text-4xl text-white"
                >
                  {product.name}
                </BaseText>
                <LightText className="text-gray-300 text-base lg:text-lg mt-3 leading-relaxed">
                  {product.description}
                </LightText>
              </div>

              {/* Price */}
              <FlexboxLayout align="center" gap="md">
                <BaseText
                  weight="bold"
                  className="text-4xl"
                  style={{ color: colorScheme.primary }}
                >
                  {product.price}
                </BaseText>
                {product.originalPrice && (
                  <LightText className="text-2xl line-through text-gray-500">
                    {product.originalPrice}
                  </LightText>
                )}
              </FlexboxLayout>

              {/* Size Selection */}
              <div>
                <BaseText weight="semibold" className="text-xl text-white mb-4">
                  Select Size
                </BaseText>
                <FlexboxLayout gap="sm" className="flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                          : 'border-gray-600 hover:border-yellow-500/50 text-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </FlexboxLayout>
              </div>

              {/* Color Selection */}
              <div>
                <BaseText weight="semibold" className="text-xl text-white mb-4">
                  Select Color
                </BaseText>
                <FlexboxLayout gap="sm" className="flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 ${
                        selectedColor === color
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                          : 'border-gray-600 hover:border-yellow-500/50 text-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </FlexboxLayout>
              </div>

              {/* Quantity */}
              <div>
                <BaseText weight="semibold" className="text-xl text-white mb-4">
                  Quantity
                </BaseText>
                <FlexboxLayout align="center" gap="lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full border-2 border-gray-600 hover:border-yellow-500 flex items-center justify-center transition-all"
                  >
                    <Minus className="w-5 h-5 text-gray-300" />
                  </button>
                  <BaseText
                    weight="bold"
                    className="text-2xl text-white w-16 text-center"
                  >
                    {quantity}
                  </BaseText>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full border-2 border-gray-600 hover:border-yellow-500 flex items-center justify-center transition-all"
                  >
                    <Plus className="w-5 h-5 text-gray-300" />
                  </button>
                  <LightText className="text-sm text-gray-400">
                    {product.stock} in stock
                  </LightText>
                </FlexboxLayout>
              </div>

              {/* Add to Cart Button */}
              <Button
                variant="primary"
                size="lg"
                curvature="full"
                elevated={true}
                leftIcon={<ShoppingBag className="w-6 h-6" />}
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="w-full py-5 text-lg font-bold transition-all duration-300 hover:scale-105 shadow l-2xl"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: '#000000',
                }}
              >
                Add to Cart • {product.price}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
