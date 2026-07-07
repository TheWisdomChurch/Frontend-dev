'use client';

import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import {
  Bell,
  CheckCircle2,
  Filter,
  Heart,
  Mail,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/shared/utils/hooks/redux';
import { toggleCart } from '@/lib/store/slices/cartSlice';
import {
  setProducts,
  setSearchTerm,
  setSelectedCategory,
  filterProducts,
} from '@/lib/store/slices/productSlice';

import ProductModal from '@/features/store/modals/ProductModal';
import {
  H3,
  H4,
  BodyLG,
  BodySM,
  SmallText,
  Caption,
  Eyebrow,
} from '@/shared/text';
import { hero_bg_1 } from '@/shared/assets';
import { Button } from '@/shared/utils/buttons';
import { Section, Container } from '@/shared/layout';
import GridBackground from '@/shared/ui/GridBackground';
import CartSidebar from '@/features/store/Store/CartSidebar';
import type { Product } from '@/lib/types';
import { IMAGE_QUALITY } from '@/shared/constants';
import { storeClient } from '@/lib/api/storeClient';
import PageHero from '@/features/hero/PageHero';
import ReduxProvider from '@/shared/providers/ReduxProvider';

const categoryLabels: Record<string, string> = {
  all: 'All Products',
  clothing: 'Clothing',
  accessories: 'Accessories',
  utilities: 'Utilities',
};

function StorePageContent() {
  const dispatch = useAppDispatch();

  const { products, filteredProducts, filters } = useAppSelector(
    state => state.products
  );
  const { itemCount } = useAppSelector(state => state.cart);
  const [showSearchAlert, setShowSearchAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const productsRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => [
      { name: 'All Products', count: products.length, value: 'all' },
      {
        name: 'Clothing',
        count: products.filter(item => item.category === 'clothing').length,
        value: 'clothing',
      },
      {
        name: 'Accessories',
        count: products.filter(item => item.category === 'accessories').length,
        value: 'accessories',
      },
      {
        name: 'Utilities',
        count: products.filter(item => item.category === 'utilities').length,
        value: 'utilities',
      },
    ],
    [products]
  );

  const activeCategoryName =
    categoryLabels[filters.selectedCategory] || 'Products';

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const data = await storeClient.listProducts();

        if (isMounted && Array.isArray(data)) {
          dispatch(setProducts(data));
        }
      } catch {
        if (isMounted) dispatch(setProducts([]));
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterProducts());
  }, [filters, dispatch]);

  useEffect(() => {
    if (!productsRef.current) return;

    const productCards = productsRef.current.querySelectorAll('.product-card');

    gsap.fromTo(
      productCards,
      { opacity: 0, y: 24, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.055,
        ease: 'power3.out',
      }
    );
  }, [filteredProducts]);

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term));

    if (term.trim().length > 2) {
      const lower = term.toLowerCase();

      const matchingProducts = products.filter(product => {
        const tags = Array.isArray(product.tags) ? product.tags : [];

        return (
          product.name.toLowerCase().includes(lower) ||
          product.description.toLowerCase().includes(lower) ||
          tags.some(tag => tag.toLowerCase().includes(lower))
        );
      });

      if (matchingProducts.length === 0) {
        const suggestions = products.flatMap(product =>
          Array.isArray(product.tags) ? product.tags : []
        );
        const uniqueSuggestions = [...new Set(suggestions)].slice(0, 5);

        setAlertMessage(
          uniqueSuggestions.length
            ? `No products found for "${term}". Try: ${uniqueSuggestions.join(', ')}`
            : `No products found for "${term}". Try another keyword or browse categories.`
        );

        setShowSearchAlert(true);
        window.setTimeout(() => setShowSearchAlert(false), 5000);
      }
    }
  };

  const handleCategoryClick = (categoryValue: string) => {
    dispatch(setSelectedCategory(categoryValue));
    dispatch(setSearchTerm(''));

    if (productsRef.current) {
      gsap.fromTo(
        productsRef.current,
        { opacity: 0.75, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmittingEmail(true);

    await new Promise(resolve => setTimeout(resolve, 1200));

    setEmailSubmitted(true);
    setEmail('');
    setIsSubmittingEmail(false);

    window.setTimeout(() => setEmailSubmitted(false), 5000);
  };

  const resetFilters = () => {
    dispatch(setSearchTerm(''));
    dispatch(setSelectedCategory('all'));
  };

  return (
    <div className="min-h-screen bg-[var(--app-dark)] text-white">
      <PageHero
        title="Wisdom Church Store"
        subtitle="Wear Your Faith, Share The Message"
        description="Discover our exclusive collection of merchandise designed to inspire and uplift. Each item carries a message of faith, hope, and wisdom for your daily journey."
        backgroundImage={hero_bg_1.src}
        // showButtons
        // primaryButtonText="Shop New Arrivals"
        // secondaryButtonText="View Categories"
        showScrollIndicator
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        curvature="full"
        onClick={() => dispatch(toggleCart())}
        className="fixed bottom-6 right-5 z-50 relative h-14 w-14 bg-[linear-gradient(135deg,var(--app-primary),var(--app-primary-dark))] text-black shadow-[0_20px_60px_rgba(0,0,0,0.45)] hover:-translate-y-1 hover:scale-105 sm:right-6 sm:h-16 sm:w-16"
        aria-label="Open cart"
      >
        <ShoppingBag className="h-6 w-6" />

        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white ring-4 ring-[#050505]">
            {itemCount}
          </span>
        )}
      </Button>

      <Section
        padding="lg"
        fullHeight={false}
        className="relative bg-[var(--app-dark)]"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(201,150,26,0.10),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.07),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(201,150,26,0.06),transparent_34%)]" />
          <GridBackground />
        </div>

        <Container size="xl" className="relative z-10 space-y-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--app-primary)]/20 bg-[var(--app-primary)]/[0.07] px-3 py-1.5 text-[var(--app-primary)]">
                <Sparkles className="h-3.5 w-3.5" />
                <Caption className="text-[10px] font-bold uppercase tracking-[0.24em]">
                  Wisdom Church Store
                </Caption>
              </div>

              <H3
                className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
                useThemeColor={false}
              >
                Shop faith-inspired essentials with a premium experience.
              </H3>

              <Caption
                className="mt-4 block max-w-xl text-sm leading-7 text-white/62 sm:text-base"
                useThemeColor={false}
              >
                Browse clothing, accessories, and ministry utilities designed to
                carry a message of faith into everyday life.
              </Caption>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
              {[
                ['Products', products.length],
                ['Showing', filteredProducts.length],
                ['Cart', itemCount],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-center backdrop-blur-xl"
                >
                  <BodyLG weight="bold" className="text-[var(--app-primary)]">
                    {value}
                  </BodyLG>
                  <Eyebrow className="mt-1 text-white/42">{label}</Eyebrow>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky top-3 z-30 rounded-[1.75rem] border border-white/10 bg-[var(--app-dark-2)]/85 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_280px_auto] lg:items-center">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/38" />
                <input
                  type="text"
                  placeholder="Search products, scripture, gifts..."
                  value={filters.searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-white/12 bg-white/[0.06] pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-4 focus:ring-[var(--app-primary)]/10"
                />

                {filters.searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 min-h-0 h-auto w-auto p-0 text-white/45 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </label>

              <label className="relative block">
                <span className="sr-only">Filter by category</span>
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/38" />
                <select
                  value={filters.selectedCategory}
                  onChange={e => handleCategoryClick(e.target.value)}
                  aria-label="Filter by category"
                  className="h-12 w-full appearance-none rounded-2xl border border-white/12 bg-[#111] pl-11 pr-10 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--app-primary)]/70 focus:ring-4 focus:ring-[var(--app-primary)]/10"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/38" />
              </label>

              <Button
                type="button"
                variant="ghost"
                onClick={resetFilters}
                className="h-12 rounded-2xl border border-white/12 bg-white/[0.04] px-5 text-sm font-bold text-white/72 hover:bg-white/[0.08] hover:text-white"
              >
                Reset
              </Button>
            </div>

            {showSearchAlert && (
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
                <Search className="mt-0.5 h-4 w-4 shrink-0 text-yellow-300" />
                <div className="min-w-0 flex-1">
                  <Caption
                    className="text-sm font-medium text-yellow-100"
                    useThemeColor={false}
                  >
                    {alertMessage}
                  </Caption>
                  <SmallText className="mt-1 block text-xs text-yellow-100/65">
                    Try different keywords or browse categories.
                  </SmallText>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearchAlert(false)}
                  aria-label="Dismiss alert"
                  className="min-h-0 h-auto w-auto p-0 text-yellow-100/70 hover:text-yellow-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(category => {
              const active = filters.selectedCategory === category.value;

              return (
                <Button
                  key={category.value}
                  type="button"
                  variant={active ? 'primary' : 'ghost'}
                  curvature="full"
                  onClick={() => handleCategoryClick(category.value)}
                  className={`shrink-0 px-4 py-2.5 min-h-0 h-auto text-sm font-bold ${
                    active
                      ? 'shadow-[0_14px_35px_rgba(201,150,26,0.13)]'
                      : 'border border-white/12 bg-white/[0.045] text-white/64 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 opacity-70">({category.count})</span>
                </Button>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section padding="lg" fullHeight={false} className="bg-[var(--app-dark)]">
        <Container size="xl">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <H3
                className="text-2xl font-semibold text-white sm:text-3xl"
                useThemeColor={false}
              >
                {activeCategoryName}
              </H3>
              <Caption
                className="mt-2 block text-sm text-white/55"
                useThemeColor={false}
              >
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? 's' : ''} found
              </Caption>
            </div>

            <Caption className="text-sm text-white/45" useThemeColor={false}>
              Click a product to view sizes, colors, and cart options.
            </Caption>
          </div>

          <div ref={productsRef}>
            {loadingProducts ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[420px] animate-pulse rounded-[1.75rem] border border-white/10 bg-white/[0.045]"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.045] p-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-xl">
                <ShoppingBag className="h-14 w-14 text-white/35" />
                <H4
                  className="mt-5 text-2xl font-semibold text-white"
                  useThemeColor={false}
                >
                  No products found
                </H4>
                <Caption
                  className="mt-2 max-w-sm text-sm leading-6 text-white/55"
                  useThemeColor={false}
                >
                  Try adjusting your search terms or browse a different
                  category.
                </Caption>

                <Button
                  onClick={resetFilters}
                  variant="primary"
                  size="lg"
                  curvature="full"
                  elevated
                  className="mt-6 font-bold"
                >
                  View All Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map(product => {
                  const soldOut = product.stock <= 0;
                  const sizes = Array.isArray(product.sizes)
                    ? product.sizes.length
                    : 0;
                  const colors = Array.isArray(product.colors)
                    ? product.colors.length
                    : 0;

                  return (
                    <article
                      key={product.id}
                      className="product-card group overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-white/[0.055] shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.085]"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleQuickView(product)}
                        className="relative block aspect-square w-full min-h-0 h-auto p-0 overflow-hidden bg-[#0d0d0d] rounded-none"
                      >
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-5 transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            quality={IMAGE_QUALITY}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag className="h-12 w-12 text-white/35" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                        <div className="absolute left-4 top-4 flex flex-col gap-2">
                          {product.originalPrice && (
                            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                              SALE
                            </span>
                          )}

                          {soldOut && (
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black shadow-lg">
                              OUT OF STOCK
                            </span>
                          )}
                        </div>

                        <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <span className="flex h-11 w-full items-center justify-center rounded-full text-sm font-bold text-black bg-[var(--app-primary)]">
                            {soldOut ? 'View Product' : 'Quick View'}
                          </span>
                        </div>
                      </Button>

                      <div className="p-5">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <SmallText
                            weight="bold"
                            className="line-clamp-2 text-base leading-snug text-white"
                            useThemeColor={false}
                          >
                            {product.name}
                          </SmallText>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            curvature="full"
                            className="h-9 w-9 shrink-0 border border-white/10 bg-white/[0.045] text-white/62 hover:bg-white/[0.09] hover:text-white"
                            aria-label="Add to wishlist"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>

                        <Caption
                          className="line-clamp-2 text-sm leading-6 text-white/58"
                          useThemeColor={false}
                        >
                          {product.description}
                        </Caption>

                        <div className="mt-4 flex items-end gap-2">
                          <BodyLG
                            weight="bold"
                            className="text-2xl text-[var(--app-primary)]"
                            useThemeColor={false}
                          >
                            {product.price}
                          </BodyLG>

                          {product.originalPrice && (
                            <Caption
                              className="pb-1 text-sm line-through text-white/38"
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
                              className="rounded-2xl border border-white/8 bg-black/25 px-2 py-2 text-center"
                            >
                              <BodySM weight="bold" className="text-white">
                                {value}
                              </BodySM>
                              <Eyebrow className="mt-0.5 text-white/38">
                                {label}
                              </Eyebrow>
                            </div>
                          ))}
                        </div>

                        <Button
                          variant="primary"
                          size="md"
                          curvature="full"
                          elevated
                          leftIcon={<ShoppingBag className="h-4 w-4" />}
                          onClick={() => handleQuickView(product)}
                          disabled={soldOut}
                          className="mt-5 h-11 w-full font-bold transition hover:scale-[1.01]"
                          onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.style.backgroundColor =
                              'var(--app-primary-dark)';
                          }}
                          onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.style.backgroundColor =
                              'var(--app-primary)';
                          }}
                        >
                          {soldOut ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section
        padding="lg"
        fullHeight={false}
        className="relative overflow-hidden bg-[var(--app-dark-2)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,150,26,0.10),transparent_34%)]" />

        <Container size="xl" className="relative z-10">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 text-center shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-8 lg:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--app-primary)]/[0.09]">
              <Tag className="h-7 w-7 text-[var(--app-primary)]" />
            </div>

            <H3
              className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl"
              useThemeColor={false}
            >
              Never miss our offers
            </H3>

            <Caption
              className="mx-auto mt-4 block max-w-xl text-sm leading-7 text-white/62 sm:text-base"
              useThemeColor={false}
            >
              Get exclusive discounts, new arrivals, and faith-inspired deals in
              your inbox.
              <strong className="mt-1 block text-white">
                Join now — get 10% off instantly.
              </strong>
            </Caption>

            <div className="mt-8">
              {emailSubmitted ? (
                <div className="mx-auto max-w-md rounded-2xl border border-green-500/20 bg-green-500/[0.07] p-6">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
                  <SmallText
                    weight="bold"
                    className="mt-3 block text-lg text-green-500"
                  >
                    You&apos;re In!
                  </SmallText>
                  <Caption
                    className="mt-1.5 block text-white/62"
                    useThemeColor={false}
                  >
                    Your 10% discount code is on its way.
                  </Caption>
                </div>
              ) : (
                <form
                  onSubmit={handleEmailSubmit}
                  className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row"
                >
                  <label className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="h-12 w-full rounded-2xl border border-white/[0.14] bg-white/[0.06] pl-12 pr-4 text-base text-white outline-none transition placeholder:text-white/40 focus:ring-4 focus:ring-yellow-400/10"
                    />
                  </label>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    curvature="full"
                    elevated
                    disabled={isSubmittingEmail || !email}
                    className="h-12 px-6 font-bold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingEmail ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-transparent" />
                        Sending...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        Get 10% Off
                        <Bell className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}

              <Caption
                className="mt-5 block text-xs text-white/42"
                useThemeColor={false}
              >
                No spam · Unsubscribe anytime · 100% private
              </Caption>
            </div>
          </div>
        </Container>
      </Section>

      <ProductModal
        key={selectedProduct?.id ?? 'none'}
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <CartSidebar />
    </div>
  );
}

export default function StorePage() {
  return (
    <ReduxProvider>
      <StorePageContent />
    </ReduxProvider>
  );
}
