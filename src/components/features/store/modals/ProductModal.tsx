'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { useAppDispatch } from '@/components/utils/hooks/redux';
import { addToCart } from '@/lib/store/slices/cartSlice';
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
import { useWindowSize } from '@/components/utils/hooks/useWindowSize';
import { BaseModal } from '@/components/modal/Base';
import type { ProductModalProps } from '@/lib/types';

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { colorScheme } = useTheme();
  const dispatch = useAppDispatch();
  const windowSize = useWindowSize();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const isMobile = useMemo(() => {
    if (!windowSize.width) return false;
    return windowSize.width < 640;
  }, [windowSize.width]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
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

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      subtitle={product.category}
      maxWidth="max-w-3xl"
      forceBottomSheet={isMobile}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative w-full h-64 sm:h-72 lg:h-full rounded-2xl overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>

        <div className="space-y-4">
          <div>
            <H4 className="mb-1">{product.name}</H4>
            <Caption className="text-white/70">{product.category}</Caption>
          </div>

          <BodyMD className="text-white/80">{product.description}</BodyMD>

          <div className="flex items-center gap-3">
            <MediumText className="text-xl text-white">
              {product.price}
            </MediumText>
            {product.originalPrice && (
              <RegularText className="line-through text-white/40">
                {product.originalPrice}
              </RegularText>
            )}
          </div>

          <div>
            <Caption className="mb-2 text-white/70">Select Size</Caption>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    selectedSize === size
                      ? 'border-yellow-400 text-yellow-100 bg-yellow-400/10'
                      : 'border-white/20 text-white/70 hover:border-white/40'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Caption className="mb-2 text-white/70">Select Color</Caption>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    selectedColor === color
                      ? 'border-yellow-400 text-yellow-100 bg-yellow-400/10'
                      : 'border-white/20 text-white/70 hover:border-white/40'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <FlexboxLayout justify="between" align="center" className="gap-3">
            <Caption className="text-white/70">Quantity</Caption>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-white/40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[32px] text-center text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-white/40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </FlexboxLayout>

          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ProductModal;
