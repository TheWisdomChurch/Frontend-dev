'use client';

import { useEffect, useRef, useState } from 'react';
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
import { H2, BaseText, LightText } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';
import { gsap } from 'gsap';
import { Search, X, Filter, ShoppingBag, Heart } from 'lucide-react';
import Button from '@/components/utils/CustomButton';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import CartSidebar from '@/components/ui/Store/CartSidebar';
import { Product } from '@/lib/types';

const StorePage = () => {
  const dispatch = useAppDispatch();
  const { filteredProducts, filters } = useAppSelector(state => state.products);
  const { itemCount } = useAppSelector(state => state.cart);

  const [showSearchAlert, setShowSearchAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Sample products data with stock
  const merchandise: Product[] = [
    {
      id: 1,
      name: 'Wisdom House Polo Shirt',
      category: 'clothing',
      price: '₦12,500',
      originalPrice: '₦15,000',
      image: '/merch/polo-shirt.jpg',
      description: 'Premium quality polo shirt with Wisdom House logo',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Navy', 'Black', 'White', 'Gray'],
      tags: ['polo', 'shirt', 'clothing', 'premium'],
      stock: 50,
    },
    // ... include all other products with stock property
  ];

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
      name: 'Books',
      count: merchandise.filter(item => item.category === 'books').length,
      value: 'books',
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
      <Section background="light" padding="lg" fullHeight={false}>
        <Container size="xl">
          <FlexboxLayout direction="column" gap="lg" className="w-full">
            <FlexboxLayout
              direction="column"
              responsiveDirection={{ lg: 'row' }}
              justify="between"
              align="center"
              gap="md"
              className="w-full"
            >
              {/* Search Bar */}
              <div className="flex-1 w-full max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for products (polo, mug, cap, book, etc.)..."
                    value={filters.searchTerm}
                    onChange={e => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                  {filters.searchTerm && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <FlexboxLayout align="center" gap="sm">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={filters.selectedCategory}
                  onChange={e => handleCategoryClick(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </FlexboxLayout>
            </FlexboxLayout>

            {/* Search Alert */}
            {showSearchAlert && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl animate-pulse">
                <LightText className="text-yellow-800 text-sm font-medium">
                  {alertMessage}
                </LightText>
              </div>
            )}
          </FlexboxLayout>
        </Container>
      </Section>

      {/* Categories Navigation */}
      <Section
        background="custom"
        padding="lg"
        fullHeight={false}
        customBackground="#f9fafb"
      >
        <Container size="xl">
          <FlexboxLayout justify="center" className="w-full">
            <div ref={categoriesRef}>
              <FlexboxLayout justify="center" gap="sm" className="flex-wrap">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryClick(category.value)}
                    className={`category-card px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      filters.selectedCategory === category.value
                        ? 'bg-yellow-400 text-gray-900 shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-yellow-50 shadow-md'
                    }`}
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
      <Section background="light" padding="lg" fullHeight={false}>
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            gap="lg"
            className="text-center mb-12"
          >
            <H2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              {filters.selectedCategory === 'all'
                ? 'All Products'
                : categories.find(c => c.value === filters.selectedCategory)
                    ?.name}
            </H2>
            <LightText className="text-xl">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? 's' : ''} found
            </LightText>
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
                <ShoppingBag className="w-24 h-24 text-gray-300" />
                <BaseText
                  fontFamily="bricolage"
                  weight="bold"
                  className="text-2xl text-gray-600"
                >
                  No products found
                </BaseText>
                <LightText className="text-gray-500 mb-8">
                  Try adjusting your search terms or browse different categories
                </LightText>
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
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="product-card bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                  >
                    {/* Product Image */}
                    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <Button
                          variant="primary"
                          size="md"
                          curvature="full"
                          className="w-full transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleQuickView(product)}
                        >
                          Quick View
                        </Button>
                      </div>

                      {/* Discount Badge */}
                      {product.originalPrice && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          SALE
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <BaseText
                          fontFamily="bricolage"
                          weight="bold"
                          className="text-lg text-gray-900 leading-tight"
                        >
                          {product.name}
                        </BaseText>
                      </div>

                      <LightText className="text-sm mb-4 leading-relaxed">
                        {product.description}
                      </LightText>

                      {/* Price */}
                      <FlexboxLayout align="center" gap="sm" className="mb-4">
                        <BaseText
                          weight="bold"
                          className="text-2xl text-yellow-600"
                        >
                          {product.price}
                        </BaseText>
                        {product.originalPrice && (
                          <LightText className="text-lg line-through">
                            {product.originalPrice}
                          </LightText>
                        )}
                      </FlexboxLayout>

                      {/* Product Meta */}
                      <FlexboxLayout
                        justify="between"
                        className="text-xs text-gray-500 mb-6"
                      >
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {product.sizes.length} sizes
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {product.colors.length} colors
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
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
                        >
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          curvature="full"
                          className="w-14 transition-all duration-300 transform hover:scale-105"
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

      {/* Keep the existing Special Offer Banner, Why Shop With Us, and Newsletter sections */}

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
