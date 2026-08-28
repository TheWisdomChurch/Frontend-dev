'use client';

import { memo, type MouseEvent } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { BodyLG, BodySM, SmallText, Caption, Eyebrow } from '@/shared/text';
import { Media } from '@/shared/ui/Media';
import type { Product } from '@/domain/store/types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

// Memoized so opening/closing the product modal — state owned by the parent
// store page — doesn't re-render every card in the grid, only the one that
// actually changed.
function ProductCard({ product, onQuickView }: ProductCardProps) {
  const soldOut = product.stock <= 0;
  const sizes = Array.isArray(product.sizes) ? product.sizes.length : 0;
  const colors = Array.isArray(product.colors) ? product.colors.length : 0;

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[var(--app-border)] bg-[var(--app-surface)] shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[var(--app-primary)]/45 hover:bg-[var(--app-canvas)]">
      <Button
        type="button"
        variant="ghost"
        onClick={() => onQuickView(product)}
        className="relative block aspect-square w-full min-h-0 h-auto p-0 overflow-hidden bg-[var(--app-canvas-2)] rounded-none"
      >
        <Media
          src={product.image}
          alt={product.name}
          fit="contain"
          className="p-4 transition duration-500 group-hover:scale-105 sm:p-5"
          frameClassName="bg-[var(--app-canvas-2)]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          fallback={
            <ShoppingBag className="h-12 w-12 text-[var(--app-subtle)]" />
          }
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.originalPrice && (
            <span className="rounded-full bg-[var(--status-error)] px-3 py-1 text-xs font-bold text-white shadow-sm">
              SALE
            </span>
          )}

          {soldOut && (
            <span className="rounded-full bg-[var(--app-ink)] px-3 py-1 text-xs font-bold text-white shadow-sm">
              OUT OF STOCK
            </span>
          )}
        </div>

        <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex h-11 w-full items-center justify-center rounded-full text-sm font-bold text-[var(--app-ink)] bg-[var(--app-primary)]">
            {soldOut ? 'View Product' : 'Quick View'}
          </span>
        </div>
      </Button>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <SmallText
            weight="bold"
            className="line-clamp-2 text-base leading-snug text-[var(--app-ink)]"
            useThemeColor={false}
          >
            {product.name}
          </SmallText>
        </div>

        <Caption
          className="line-clamp-2 text-sm leading-6 text-[var(--app-muted)]"
          useThemeColor={false}
        >
          {product.description}
        </Caption>

        <div className="mt-4 flex items-end gap-2">
          <BodyLG
            weight="bold"
            className="text-2xl text-[var(--app-primary-dark)]"
            useThemeColor={false}
          >
            {product.price}
          </BodyLG>

          {product.originalPrice && (
            <Caption
              className="pb-1 text-sm line-through text-[var(--app-subtle)]"
              useThemeColor={false}
            >
              {product.originalPrice}
            </Caption>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            [`${sizes}`, 'Sizes'],
            [`${colors}`, 'Colors'],
            [soldOut ? '0' : `${product.stock}`, 'Stock'],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-canvas)] px-2 py-2 text-center"
            >
              <BodySM weight="bold" className="text-[var(--app-ink)]">
                {value}
              </BodySM>
              <Eyebrow className="mt-0.5 text-[var(--app-subtle)]">
                {label}
              </Eyebrow>
            </div>
          ))}
        </div>

        <Button
          variant="primary"
          size="md"

          elevated
          leftIcon={<ShoppingBag className="h-4 w-4" />}
          onClick={() => onQuickView(product)}
          disabled={soldOut}
          className="mt-5 h-11 w-full font-bold transition hover:scale-[1.01]"
          onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = 'var(--app-primary-dark)';
          }}
          onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = 'var(--app-primary)';
          }}
        >
          {soldOut ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </article>
  );
}

export default memo(ProductCard);
