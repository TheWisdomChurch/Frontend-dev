'use client';

import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Flame,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useAppDispatch } from '@/shared/utils/hooks/redux';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { Button } from '@/shared/ui/button';
import { H4, BodyMD, RegularText, MediumText, Caption } from '@/shared/text';
import { Flex } from '@/shared/ui/Flex';
import { cn } from '@/lib/cn';
import { BaseModal } from '@/shared/ui/modals/Modal';
import { Media } from '@/shared/ui/Media';
import type { Product } from '@/domain/store/types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const parsePrice = (price: string): number => {
  const value = Number.parseFloat(String(price).replace(/[^\d.]/g, ''));
  return Number.isFinite(value) ? value : 0;
};

const trustBadges = [
  { icon: Truck, label: 'Fast dispatch' },
  { icon: ShieldCheck, label: 'Secure checkout' },
  { icon: RotateCcw, label: 'Easy returns' },
];

const contentStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const contentItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const dispatch = useAppDispatch();

  // Parent remounts this component (via `key={product.id}`) whenever the
  // product changes, so these initial values are always fresh per product.
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const unitPrice = useMemo(
    () => (product ? parsePrice(product.price) : 0),
    [product]
  );
  const currencyPrefix = useMemo(
    () => product?.price.match(/^\D+/)?.[0]?.trim() || '',
    [product]
  );
  const totalPrice = unitPrice * quantity;
  const lowStock = !!product && product.stock > 0 && product.stock <= 5;

  const handleShare = useCallback(async () => {
    if (!product) return;
    const shareData = {
      title: product.name,
      text: product.description,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      if (shareData.url) {
        await navigator.clipboard.writeText(shareData.url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1800);
      }
    } catch {
      // User cancelled the native share sheet — nothing to report.
    }
  }, [product]);

  if (!product) return null;

  const soldOut = product.stock <= 0;

  const handleAddToCart = () => {
    if (soldOut || justAdded) return;
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
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 650);
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
      <motion.div
        variants={contentStagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div
          variants={contentItem}
          className="relative w-full aspect-square h-auto lg:aspect-auto lg:h-full rounded-2xl overflow-hidden bg-[var(--app-dark-2)]"
        >
          <Media
            src={product.image}
            alt={product.name}
            fit="contain"
            className="p-4 transition duration-500 hover:scale-105 sm:p-6"
            frameClassName="bg-[var(--app-dark-2)]"
            sizes="(max-width: 768px) 100vw, 50vw"
            fallback={<ShoppingBag className="h-12 w-12 text-white/40" />}
          />

          <div className="absolute right-3 top-3 flex gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => setWishlisted(v => !v)}
              aria-label={
                wishlisted ? 'Remove from wishlist' : 'Add to wishlist'
              }
              aria-pressed={wishlisted}
              className={cn(
                'grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition',
                wishlisted
                  ? 'border-[var(--app-primary)]/40 bg-[var(--app-primary)]/10 text-[var(--app-primary)]'
                  : 'border-white/12 bg-white/[0.04] text-white/70 hover:text-white'
              )}
            >
              <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
            </motion.button>

            <div className="relative">
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={handleShare}
                aria-label="Share this product"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-white/70 backdrop-blur-md transition hover:text-white"
              >
                <Share2 className="h-4 w-4" />
              </motion.button>

              <AnimatePresence>
                {shareCopied && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute right-0 top-12 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white shadow-lg"
                  >
                    Link copied
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {lowStock ? (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-[var(--status-warning)]/40 bg-[var(--status-warning)]/10 px-3 py-1 text-xs font-bold text-[var(--status-warning)] backdrop-blur-md">
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <Flame className="h-3.5 w-3.5" />
              </motion.span>
              Only {product.stock} left
            </div>
          ) : null}
        </motion.div>

        <motion.div variants={contentItem} className="space-y-4">
          <div>
            <H4 className="mb-1 text-white">{product.name}</H4>
            <Caption className="text-white/70">{product.category}</Caption>
          </div>

          <BodyMD className="text-white/70">{product.description}</BodyMD>

          <div className="flex items-center gap-3">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={totalPrice}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                <MediumText className="text-xl text-white">
                  {currencyPrefix}
                  {totalPrice.toFixed(2)}
                </MediumText>
              </motion.span>
            </AnimatePresence>
            {product.originalPrice && (
              <RegularText className="line-through text-white/40">
                {product.originalPrice}
              </RegularText>
            )}
            {quantity > 1 && (
              <Caption className="text-white/40">
                ({currencyPrefix}
                {unitPrice.toFixed(2)} each)
              </Caption>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {trustBadges.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/70"
              >
                <Icon className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                {label}
              </span>
            ))}
          </div>

          {product.sizes.length > 0 && (
            <div>
              <Caption className="mb-2 text-white/70">Select Size</Caption>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => {
                  const selected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'relative overflow-hidden rounded-full border px-3 py-1.5 text-sm font-medium transition',
                        selected
                          ? 'border-[var(--app-primary)] text-[var(--app-primary)]'
                          : 'border-white/12 text-white/70 hover:border-white/25'
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId="size-highlight"
                          className="absolute inset-0 bg-[var(--app-primary)]/10"
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                      <span className="relative inline-flex items-center gap-1.5">
                        {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {size}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div>
              <Caption className="mb-2 text-white/70">Select Color</Caption>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => {
                  const selected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'relative flex items-center gap-2 overflow-hidden rounded-full border px-3 py-1.5 text-sm font-medium transition',
                        selected
                          ? 'border-[var(--app-primary)] text-[var(--app-primary)]'
                          : 'border-white/12 text-white/70 hover:border-white/25'
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId="color-highlight"
                          className="absolute inset-0 bg-[var(--app-primary)]/10"
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                      <span
                        // eslint-disable-next-line no-restricted-syntax -- CSS named-color lookup driven by admin-entered color name, not expressible as a Tailwind class
                        style={{ backgroundColor: color.toLowerCase() }}
                        className="relative h-3 w-3 shrink-0 rounded-full border border-white/12"
                        aria-hidden="true"
                      />
                      <span className="relative">{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Flex justify="between" align="center" className="gap-3">
            <Caption className="text-white/70">Quantity</Caption>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"

                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="h-9 w-9 border border-white/12 text-white/70 hover:border-white/25"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={quantity}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                  className="min-w-[32px] text-center text-white"
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>
              <Button
                type="button"
                variant="ghost"
                size="icon"

                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
                className="h-9 w-9 border border-white/12 text-white/70 hover:border-white/25"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Flex>

          <Button
            variant="primary"
            size="md"
            className={
              justAdded
                ? 'w-full !bg-[var(--status-success)] !text-white'
                : 'w-full'
            }
            onClick={handleAddToCart}
            disabled={soldOut}
            leftIcon={
              !soldOut && (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={justAdded ? 'added' : 'bag'}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex"
                  >
                    {justAdded ? <CheckCircle2 /> : <ShoppingBag />}
                  </motion.span>
                </AnimatePresence>
              )
            }
          >
            {soldOut ? 'Out of Stock' : justAdded ? 'Added!' : 'Add to Cart'}
          </Button>
        </motion.div>
      </motion.div>
    </BaseModal>
  );
};

export default ProductModal;
