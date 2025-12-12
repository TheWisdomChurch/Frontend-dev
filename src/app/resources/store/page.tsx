'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/components/utils/hooks/redux';
import { toggleCart } from '@/lib/store/slices/cartSlice';
import {
  setProducts,
  setSearchTerm,
  setSelectedCategory,
  filterProducts,
} from '@/lib/store/slices/productSlice';

import ProductModal from '@/components/modal/storeModals/ProductModal';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { H3, H4, BaseText, SmallText, Caption } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';

import { gsap } from 'gsap';
import {
  Search,
  X,
  Filter,
  ShoppingBag,
  Heart,
  Mail,
  Tag,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/utils/buttons';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import CartSidebar from '@/components/ui/Store/CartSidebar';
import { useTheme } from '@/components/contexts/ThemeContext';
import Image from 'next/image';
import { merchandise } from '@/lib/data';
import { Product } from '@/lib/types';

const StorePage = () => {
  const dispatch = useAppDispatch();
  const { filteredProducts, filters } = useAppSelector(state => state.products);
  const { itemCount } = useAppSelector(state => state.cart);
  const { colorScheme } = useTheme();

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const sectionBackground = isDarkMode ? colorScheme.white : colorScheme.white;
  const textColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const cardBackground = isDarkMode ? colorScheme.black : colorScheme.white;
  const cardTextColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const borderColor = isDarkMode
    ? colorScheme.border
    : colorScheme.primary + '40';
  const inputBackground = isDarkMode ? colorScheme.white : colorScheme.surface;
  const inputBorderColor = isDarkMode
    ? colorScheme.borderLight
    : colorScheme.border;
  const imageBackground = isDarkMode ? colorScheme.white : colorScheme.white; // White background for images

  const [showSearchAlert, setShowSearchAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const productsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const promotionsRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: 'All Products', count: merchandise.length, value: 'all' },
    {
      name: 'Clothing',
      count: merchandise.filter(item => item.category === 'clothing').length,
      value: 'clothing',
    },
    {
      name: 'Accessories',
      count: merchandise.filter(item => item.category === 'accessories').length,
      value: 'accessories',
    },
    {
      name: 'Utilities',
      count: merchandise.filter(item => item.category === 'utilities').length,
      value: 'utilities',
    },
  ];

  // Initialize products in Redux
  useEffect(() => {
    dispatch(setProducts(merchandise));
  }, [dispatch]);

  // Filter products when filters change
  useEffect(() => {
    dispatch(filterProducts());
  }, [filters, dispatch]);

  // Search functionality with suggestions
  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term));

    if (term.length > 2) {
      const matchingProducts = merchandise.filter(
        product =>
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          product.description.toLowerCase().includes(term.toLowerCase()) ||
          product.tags.some(tag =>
            tag.toLowerCase().includes(term.toLowerCase())
          )
      );

      if (matchingProducts.length === 0) {
        const suggestions = merchandise.flatMap(product => product.tags);
        const uniqueSuggestions = [...new Set(suggestions)];
        setAlertMessage(
          `No products found for "${term}". Try: ${uniqueSuggestions.slice(0, 5).join(', ')}`
        );
        setShowSearchAlert(true);
        setTimeout(() => setShowSearchAlert(false), 5000);
      }
    }
  };

  // GSAP Animations
  useEffect(() => {
    if (productsRef.current) {
      const productCards =
        productsRef.current.querySelectorAll('.product-card');

      gsap.fromTo(
        productCards,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, [filteredProducts]);

  useEffect(() => {
    if (categoriesRef.current) {
      const categoryCards =
        categoriesRef.current.querySelectorAll('.category-card');

      gsap.fromTo(
        categoryCards,
        {
          opacity: 0,
          x: -30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  useEffect(() => {
    if (promotionsRef.current) {
      const elements = promotionsRef.current.querySelectorAll('.promo-element');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
      );
    }
  }, []);

  const handleCategoryClick = (categoryValue: string) => {
    dispatch(setSelectedCategory(categoryValue));
    dispatch(setSearchTerm(''));

    // Animate category transition
    if (productsRef.current) {
      gsap.to(productsRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        onComplete: () => {
          setTimeout(() => {
            if (productsRef.current) {
              gsap.to(productsRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
              });
            }
          }, 50);
        },
      });
    }
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmittingEmail(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Email submitted:', email);
    setEmailSubmitted(true);
    setEmail('');
    setIsSubmittingEmail(false);

    // Reset after 5 seconds
    setTimeout(() => {
      setEmailSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Wisdom House Store"
        subtitle="Wear Your Faith, Share The Message"
        description="Discover our exclusive collection of merchandise designed to inspire and uplift. Each item carries a message of faith, hope, and wisdom for your daily journey."
        backgroundImage={hero_bg_1.src}
        showButtons={true}
        primaryButtonText="Shop New Arrivals"
        secondaryButtonText="View Categories"
        showScrollIndicator={true}
      />

      {/* Cart FAB - Fixed to bottom right instead of top */}
      <button
        onClick={() => dispatch(toggleCart())}
        className="fixed bottom-6 right-6 z-50 bg-yellow-400 text-gray-900 rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group"
      >
        <FlexboxLayout align="center" gap="sm">
          <ShoppingBag className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </FlexboxLayout>
      </button>

      {/* Search and Filter Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: sectionBackground }}
      >
        <Container size="xl">
          {/* Minimal centered header - matches your team sections */}
          <FlexboxLayout
            direction="column"
            gap="xs"
            className="mb-8 text-center"
          >
            <H4
              weight="medium"
              smWeight="semibold"
              className="text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-200 tracking-wide"
              useThemeColor={false}
            >
              Discover Our Collection
            </H4>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mt-2" />
          </FlexboxLayout>

          {/* Compact search card */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Subtle backdrop glow */}
              <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-3xl blur-xl opacity-50" />

              <div className="relative bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg overflow-hidden">
                <FlexboxLayout
                  direction="column"
                  responsiveDirection={{ md: 'row' }}
                  align="center"
                  gap="md"
                  className="p-5 sm:p-6"
                >
                  {/* Search Input - Clean & Compact */}
                  <div className="flex-1 w-full">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 pointer-events-none z-10" />

                      <input
                        type="text"
                        placeholder="Search products, scripture, gifts..."
                        value={filters.searchTerm}
                        onChange={e => handleSearch(e.target.value)}
                        className="w-full pl-11 sm:pl-12 pr-10 py-3 sm:py-3.5 
                             bg-transparent border border-gray-300/70 dark:border-gray-600/70 
                             rounded-xl sm:rounded-2xl text-sm sm:text-base 
                             focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20
                             transition-all duration-300 placeholder:text-gray-400"
                      />

                      {/* Clear button */}
                      {filters.searchTerm && (
                        <button
                          onClick={() => handleSearch('')}
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}

                      {/* Animated underline */}
                      <div className="absolute bottom-0 left-0 h-0.5 bg-yellow-400 w-0 group-focus-within:w-full transition-all duration-500" />
                    </div>
                  </div>

                  {/* Category Filter - Matches your design system */}
                  <div className="w-full md:w-64 lg:w-72">
                    <div className="relative">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 pointer-events-none z-10" />

                      <select
                        value={filters.selectedCategory}
                        onChange={e => handleCategoryClick(e.target.value)}
                        className="w-full pl-11 sm:pl-12 pr-10 py-3 sm:py-3.5 
                             bg-gray-50/50 dark:bg-gray-800/50 border border-gray-300/70 dark:border-gray-600/70 
                             rounded-xl sm:rounded-2xl text-sm sm:text-base appearance-none cursor-pointer
                             focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20
                             transition-all duration-300"
                      >
                        <option value="all">
                          All Products ({merchandise.length})
                        </option>
                        {categories
                          .filter(cat => cat.value !== 'all')
                          .map(category => (
                            <option key={category.value} value={category.value}>
                              {category.name} ({category.count})
                            </option>
                          ))}
                      </select>

                      {/* Custom arrow */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </FlexboxLayout>
              </div>
            </div>

            {/* Compact Alert - Matches your Caption style */}
            {showSearchAlert && (
              <div className="mt-5 max-w-4xl mx-auto animate-in fade-in slide-in-from-top duration-400">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50/80 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
                    <Search className="w-4 h-4 text-yellow-700 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <Caption
                      className="text-sm font-medium text-yellow-800 dark:text-yellow-300"
                      useThemeColor={false}
                    >
                      {alertMessage}
                    </Caption>
                    <SmallText className="text-xs text-yellow-700/80 dark:text-yellow-400/70 mt-0.5">
                      Try different keywords or browse categories
                    </SmallText>
                  </div>
                  <button
                    onClick={() => setShowSearchAlert(false)}
                    className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Categories Navigation */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{
          backgroundColor: isDarkMode
            ? colorScheme.surface
            : colorScheme.backgroundSecondary,
        }}
      >
        <Container size="xl">
          <FlexboxLayout justify="center" className="w-full">
            <div ref={categoriesRef}>
              <FlexboxLayout justify="center" gap="sm" className="flex-wrap">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryClick(category.value)}
                    className={`category-card px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-base sm:text-lg ${
                      filters.selectedCategory === category.value
                        ? 'bg-yellow-400 text-gray-900 shadow-lg'
                        : 'shadow-md'
                    }`}
                    style={{
                      backgroundColor:
                        filters.selectedCategory === category.value
                          ? colorScheme.primary
                          : cardBackground,
                      color:
                        filters.selectedCategory === category.value
                          ? colorScheme.black
                          : cardTextColor,
                    }}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </FlexboxLayout>
            </div>
          </FlexboxLayout>
        </Container>
      </Section>

      {/* Products Grid */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: sectionBackground }}
      >
        <Container size="xl">
          {/* Header Section */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 lg:pb-12 text-center"
          >
            <H3
              className="text-2xl sm:text-3xl font-bold leading-tight"
              style={{ color: textColor }}
              useThemeColor={false}
              weight="bold"
              smWeight="black"
            >
              {filters.selectedCategory === 'all'
                ? 'All Products'
                : categories.find(c => c.value === filters.selectedCategory)
                    ?.name}
            </H3>
            <Caption
              className="text-base sm:text-lg leading-relaxed text-gray-600 mt-2"
              useThemeColor={false}
              style={{ color: secondaryTextColor }}
            >
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? 's' : ''} found
            </Caption>
          </FlexboxLayout>

          <div ref={productsRef} className="w-full">
            {filteredProducts.length === 0 ? (
              <FlexboxLayout
                direction="column"
                justify="center"
                align="center"
                gap="md"
                className="py-16 text-center"
              >
                <ShoppingBag
                  className="w-24 h-24"
                  style={{ color: secondaryTextColor }}
                />
                <H4
                  className="text-2xl"
                  style={{ color: textColor }}
                  useThemeColor={false}
                  weight="bold"
                  smWeight="bold"
                >
                  No products found
                </H4>
                <Caption
                  className="mb-8"
                  useThemeColor={false}
                  style={{ color: secondaryTextColor }}
                >
                  Try adjusting your search terms or browse different categories
                </Caption>
                <Button
                  onClick={() => {
                    dispatch(setSearchTerm(''));
                    dispatch(setSelectedCategory('all'));
                  }}
                  variant="primary"
                  size="lg"
                  curvature="full"
                  elevated={true}
                  className="transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundColor: colorScheme.primary,
                    color: colorScheme.black,
                  }}
                  onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.backgroundColor =
                      colorScheme.primaryDark;
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.backgroundColor = colorScheme.primary;
                  }}
                >
                  View All Products
                </Button>
              </FlexboxLayout>
            ) : (
              <GridboxLayout
                columns={1}
                responsive={{
                  md: 2,
                  lg: 3,
                  xl: 4,
                }}
                gap="lg"
              >
                {filteredProducts.map((product: Product) => (
                  <div
                    key={product.id}
                    className="product-card rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                    style={{
                      backgroundColor: cardBackground,
                      borderColor: borderColor,
                    }}
                  >
                    {/* Product Image - White background */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        paddingTop: '100%',
                        backgroundColor: imageBackground, // White background
                      }}
                    >
                      {product.image ? (
                        <div className="absolute inset-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                      )}

                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <Button
                          variant="primary"
                          size="md"
                          curvature="full"
                          className="w-full transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleQuickView(product)}
                          style={{
                            backgroundColor: colorScheme.primary,
                            color: colorScheme.black,
                          }}
                          onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.style.backgroundColor =
                              colorScheme.primaryDark;
                          }}
                          onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.style.backgroundColor =
                              colorScheme.primary;
                          }}
                        >
                          Quick View
                        </Button>
                      </div>

                      {/* Discount Badge */}
                      {product.originalPrice && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
                          SALE
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <SmallText
                          weight="semibold"
                          smWeight="bold"
                          className="text-base sm:text-lg leading-tight"
                          style={{ color: cardTextColor }}
                          useThemeColor={false}
                        >
                          {product.name}
                        </SmallText>
                      </div>

                      <Caption
                        className="text-sm mb-4 leading-relaxed line-clamp-2"
                        useThemeColor={false}
                        style={{ color: secondaryTextColor }}
                      >
                        {product.description}
                      </Caption>

                      {/* Price */}
                      <FlexboxLayout align="center" gap="sm" className="mb-4">
                        <BaseText
                          weight="bold"
                          className="text-2xl"
                          style={{ color: colorScheme.primary }}
                        >
                          {product.price}
                        </BaseText>
                        {product.originalPrice && (
                          <Caption
                            className="text-lg line-through"
                            useThemeColor={false}
                            style={{ color: secondaryTextColor }}
                          >
                            {product.originalPrice}
                          </Caption>
                        )}
                      </FlexboxLayout>

                      {/* Product Meta */}
                      <FlexboxLayout justify="between" className="text-xs mb-6">
                        <span
                          className="px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: isDarkMode
                              ? colorScheme.opacity.black10
                              : colorScheme.opacity.white10,
                            color: secondaryTextColor,
                          }}
                        >
                          {product.sizes.length} sizes
                        </span>
                        <span
                          className="px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: isDarkMode
                              ? colorScheme.opacity.black10
                              : colorScheme.opacity.white10,
                            color: secondaryTextColor,
                          }}
                        >
                          {product.colors.length} colors
                        </span>
                        <span
                          className="px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: isDarkMode
                              ? colorScheme.opacity.black10
                              : colorScheme.opacity.white10,
                            color: secondaryTextColor,
                          }}
                        >
                          {product.stock} in stock
                        </span>
                      </FlexboxLayout>

                      {/* Action Buttons */}
                      <FlexboxLayout gap="sm">
                        <Button
                          variant="primary"
                          size="md"
                          curvature="full"
                          elevated={true}
                          leftIcon={<ShoppingBag className="w-4 h-4" />}
                          onClick={() => handleQuickView(product)}
                          className="flex-1 transition-all duration-300 transform hover:scale-105"
                          style={{
                            backgroundColor: colorScheme.primary,
                            color: colorScheme.black,
                          }}
                          onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.style.backgroundColor =
                              colorScheme.primaryDark;
                          }}
                          onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.style.backgroundColor =
                              colorScheme.primary;
                          }}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          curvature="full"
                          className="w-14 transition-all duration-300 transform hover:scale-105"
                          style={{
                            borderColor: borderColor,
                            color: cardTextColor,
                          }}
                          onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.style.backgroundColor = isDarkMode
                              ? colorScheme.opacity.black10
                              : colorScheme.opacity.white10;
                          }}
                          onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.style.backgroundColor =
                              'transparent';
                          }}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </FlexboxLayout>
                    </div>
                  </div>
                ))}
              </GridboxLayout>
            )}
          </div>
        </Container>
      </Section>

      {/* Promotions & Email Signup Section */}
      <Section
        padding="2xl"
        fullHeight={false}
        style={{
          backgroundColor: isDarkMode
            ? colorScheme.surface
            : colorScheme.backgroundSecondary,
        }}
      >
        <Container size="xl">
          <div className="max-w-2xl mx-auto text-center">
            {/* Subtle Icon */}
            <div className="mb-6 flex justify-center">
              <div
                className="p-3.5 rounded-2xl"
                style={{
                  backgroundColor: isDarkMode
                    ? `${colorScheme.primary}10`
                    : `${colorScheme.primary}08`,
                }}
              >
                <Tag
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  style={{ color: colorScheme.primary }}
                />
              </div>
            </div>

            {/* Title */}
            <H3
              weight="bold"
              smWeight="black"
              className="text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight"
              style={{
                color: isDarkMode
                  ? textColor || '#ffffff'
                  : textColor || '#111111', // Force dark text on light backgrounds
              }}
              useThemeColor={false}
            >
              Never Miss our offers
            </H3>

            {/* Subtitle */}
            <Caption
              className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed max-w-xl mx-auto px-4"
              style={{ color: secondaryTextColor }}
              useThemeColor={false}
            >
              Get exclusive discounts, new arrivals, and faith-inspired deals in
              your inbox.
              <strong className="block mt-1.5">
                Join now â€” get 10% off instantly.
              </strong>
            </Caption>

            {/* Form */}
            <div className="mt-8 sm:mt-10">
              {emailSubmitted ? (
                /* Success State */
                <div
                  className="p-7 rounded-2xl border backdrop-blur-sm"
                  style={{
                    backgroundColor: isDarkMode
                      ? `${colorScheme.success}10`
                      : `${colorScheme.success}05`,
                    borderColor: `${colorScheme.success}30`,
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 mx-auto mb-4 flex items-center justify-center">
                    <Bell className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <SmallText
                    weight="bold"
                    className="text-lg"
                    style={{ color: colorScheme.success }}
                  >
                    You're In!
                  </SmallText>
                  <Caption
                    className="mt-1.5"
                    style={{ color: secondaryTextColor }}
                  >
                    Your 10% discount code is on its way.
                  </Caption>
                </div>
              ) : (
                <form
                  onSubmit={handleEmailSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-4 sm:px-0"
                >
                  {/* Email Input */}
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-base
                           border focus:outline-none focus:ring-2 focus:ring-yellow-400/30
                           transition-all duration-200 placeholder:text-gray-400"
                      style={{
                        backgroundColor: inputBackground,
                        borderColor: inputBorderColor,
                        color: textColor,
                      }}
                    />
                  </div>

                  {/* Perfectly Sized Button â€” Mobile & Desktop */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    curvature="xl"
                    elevated={true}
                    disabled={isSubmittingEmail || !email}
                    className="w-full sm:w-auto px-6 py-3 text-base font-semibold
                         transition-all duration-200 hover:scale-[1.025] active:scale-100
                         disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: colorScheme.primary,
                      color: '#000000',
                      height: '48px', // Consistent height across devices
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSubmittingEmail ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Get 10% Off</span>
                        <Bell className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              )}

              {/* Tiny Trust Line */}
              <Caption
                className="mt-5 text-xs opacity-70 px-6"
                style={{ color: secondaryTextColor }}
                useThemeColor={false}
              >
                No spam â€¢ Unsubscribe anytime â€¢ 100% private
              </Caption>
            </div>
          </div>
        </Container>
      </Section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
};

export default StorePage;

