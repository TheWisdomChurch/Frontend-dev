'use client';

import { useState } from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { useAppDispatch } from '@/shared/utils/hooks/redux';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { Button } from '@/shared/utils/buttons';
import { H4, BodyMD, RegularText, MediumText, Caption } from '@/shared/text';
import { FlexboxLayout } from '@/shared/layout';
import { BaseModal } from '@/shared/ui/modals/Base';
import { Media } from '@/shared/ui/Media';
import type { Product } from '@/domain/store/types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const dispatch = useAppDispatch();

  // Parent remounts this component (via `key={product.id}`) whenever the
  // product changes, so these initial values are always fresh per product.
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
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
      headerIcon={<ShoppingBag />}
      maxWidth="max-w-3xl"
      forceBottomSheet
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative w-full aspect-square h-auto lg:aspect-auto lg:h-full rounded-card overflow-hidden bg-[var(--app-dark-2)]">
          <Media
            src={product.image}
            alt={product.name}
            fit="contain"
            className="p-4 sm:p-6"
            frameClassName="bg-[var(--app-dark-2)]"
            sizes="(max-width: 768px) 100vw, 50vw"
            fallback={<ShoppingBag className="h-12 w-12 text-white/35" />}
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
                <Button
                  key={size}
                  type="button"
                  variant="ghost"
                  curvature="full"
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 min-h-0 h-auto text-sm border ${
                    selectedSize === size
                      ? 'border-yellow-400 text-yellow-100 bg-yellow-400/10'
                      : 'border-white/20 text-white/70 hover:border-white/40'
                  }`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Caption className="mb-2 text-white/70">Select Color</Caption>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <Button
                  key={color}
                  type="button"
                  variant="ghost"
                  curvature="full"
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 min-h-0 h-auto text-sm border ${
                    selectedColor === color
                      ? 'border-yellow-400 text-yellow-100 bg-yellow-400/10'
                      : 'border-white/20 text-white/70 hover:border-white/40'
                  }`}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          <FlexboxLayout justify="between" align="center" className="gap-3">
            <Caption className="text-white/70">Quantity</Caption>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                curvature="full"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="h-9 w-9 border border-white/20 text-white/80 hover:border-white/40"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[32px] text-center text-white">
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                curvature="full"
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
                className="h-9 w-9 border border-white/20 text-white/80 hover:border-white/40"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </FlexboxLayout>

          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            leftIcon={product.stock > 0 && <ShoppingBag />}
          >
            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ProductModal;
