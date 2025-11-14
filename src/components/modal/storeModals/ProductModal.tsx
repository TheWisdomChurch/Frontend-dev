'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
import { useAppDispatch } from '@/components/utils/hooks/redux';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { Product } from '@/lib/types';
import Button from '@/components/utils/CustomButton';
import { BaseText, LightText } from '@/components/text';
import { FlexboxLayout } from '@/components/layout';

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
          { opacity: 0, scale: 0.8, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
        );
      } else {
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.8,
          y: 50,
          duration: 0.3,
        });
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
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Product Image */}
          <div className="lg:w-1/2 h-80 lg:h-auto bg-gradient-to-br from-gray-100 to-gray-200 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <BaseText
                  fontFamily="bricolage"
                  weight="bold"
                  className="text-2xl lg:text-3xl"
                >
                  {product.name}
                </BaseText>
                <LightText className="text-lg mt-2">
                  {product.description}
                </LightText>
              </div>

              {/* Price */}
              <FlexboxLayout align="center" gap="sm">
                <BaseText weight="bold" className="text-3xl text-yellow-600">
                  {product.price}
                </BaseText>
                {product.originalPrice && (
                  <LightText className="text-xl line-through">
                    {product.originalPrice}
                  </LightText>
                )}
              </FlexboxLayout>

              {/* Size Selection */}
              <div>
                <BaseText weight="semibold" className="text-lg mb-3">
                  Size
                </BaseText>
                <FlexboxLayout gap="sm" className="flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-yellow-400 bg-yellow-50 text-gray-900'
                          : 'border-gray-200 hover:border-yellow-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </FlexboxLayout>
              </div>

              {/* Color Selection */}
              <div>
                <BaseText weight="semibold" className="text-lg mb-3">
                  Color
                </BaseText>
                <FlexboxLayout gap="sm" className="flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                        selectedColor === color
                          ? 'border-yellow-400 bg-yellow-50 text-gray-900'
                          : 'border-gray-200 hover:border-yellow-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </FlexboxLayout>
              </div>

              {/* Quantity Selection */}
              <div>
                <BaseText weight="semibold" className="text-lg mb-3">
                  Quantity
                </BaseText>
                <FlexboxLayout align="center" gap="md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-yellow-400 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <BaseText weight="bold" className="text-xl w-8 text-center">
                    {quantity}
                  </BaseText>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-yellow-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <LightText className="text-sm text-gray-500">
                    {product.stock} available
                  </LightText>
                </FlexboxLayout>
              </div>

              {/* Add to Cart Button */}
              <Button
                variant="primary"
                size="lg"
                curvature="full"
                elevated={true}
                leftIcon={<ShoppingBag className="w-5 h-5" />}
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="w-full transition-all duration-300 transform hover:scale-105"
              >
                Add to Cart - {product.price}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
