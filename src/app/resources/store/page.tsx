'use client';

import { useEffect, useRef, useState } from 'react';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2 } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';
import { gsap } from 'gsap';
import { Search, X, Filter, ShoppingBag } from 'lucide-react';

const StorePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSearchAlert, setShowSearchAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const productsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const merchandise = [
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
    },
    {
      id: 2,
      name: 'Faith T-Shirt',
      category: 'clothing',
      price: '₦8,500',
      originalPrice: '₦10,000',
      image: '/merch/tshirt.jpg',
      description: 'Comfortable cotton t-shirt with inspirational design',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'White', 'Royal Blue', 'Red'],
      tags: ['t-shirt', 'tshirt', 'clothing', 'cotton'],
    },
    {
      id: 3,
      name: 'Wisdom House Cap',
      category: 'accessories',
      price: '₦7,500',
      originalPrice: '₦9,000',
      image: '/merch/cap.jpg',
      description: 'Adjustable baseball cap with embroidered logo',
      sizes: ['One Size'],
      colors: ['Black', 'Navy', 'Khaki', 'White'],
      tags: ['cap', 'hat', 'accessories', 'baseball'],
    },
    {
      id: 4,
      name: 'Inspirational Mug',
      category: 'utilities',
      price: '₦4,500',
      originalPrice: '₦5,500',
      image: '/merch/mug.jpg',
      description: 'Ceramic mug with daily inspirational quote',
      sizes: ['11oz', '15oz'],
      colors: ['White', 'Black', 'Blue'],
      tags: ['mug', 'cup', 'utilities', 'ceramic'],
    },
    {
      id: 5,
      name: 'Daily Devotional Book',
      category: 'books',
      price: '₦6,500',
      originalPrice: '₦7,500',
      image: '/merch/book.jpg',
      description: '365-day devotional for spiritual growth',
      sizes: ['Paperback', 'Hardcover'],
      colors: ['Standard'],
      tags: ['book', 'devotional', 'books', 'spiritual'],
    },
    {
      id: 6,
      name: 'Wisdom House Tote Bag',
      category: 'accessories',
      price: '₦9,500',
      originalPrice: '₦11,000',
      image: '/merch/tote-bag.jpg',
      description: 'Eco-friendly tote bag for everyday use',
      sizes: ['One Size'],
      colors: ['Natural', 'Black', 'Navy'],
      tags: ['tote', 'bag', 'accessories', 'eco-friendly'],
    },
    {
      id: 7,
      name: 'Bible Study Journal',
      category: 'books',
      price: '₦8,000',
      originalPrice: '₦9,500',
      image: '/merch/journal.jpg',
      description: 'Guided journal for Bible study and reflection',
      sizes: ['A5', 'A4'],
      colors: ['Brown', 'Black', 'Blue'],
      tags: ['journal', 'book', 'bible', 'study'],
    },
    {
      id: 8,
      name: 'Stainless Steel Water Bottle',
      category: 'utilities',
      price: '₦11,500',
      originalPrice: '₦13,500',
      image: '/merch/water-bottle.jpg',
      description: 'Insulated water bottle with Wisdom House design',
      sizes: ['20oz', '32oz'],
      colors: ['Black', 'Silver', 'Blue', 'Green'],
      tags: ['water bottle', 'bottle', 'utilities', 'insulated'],
    },
  ];

  const categories = [
    {
      name: 'All Products',
      count: merchandise.length,
      value: 'all',
    },
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

  // Filter products based on search and category
  const filteredProducts = merchandise.filter(product => {
    const matchesSearch =
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Search functionality with suggestions
  const handleSearch = (term: string) => {
    setSearchTerm(term);

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
    setSelectedCategory(categoryValue);
    setSearchTerm('');

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

  return (
    <div>
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

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 w-full max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for products (polo, mug, cap, book, etc.)..."
                    value={searchTerm}
                    onChange={e => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={selectedCategory}
                  onChange={e => handleCategoryClick(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Alert */}
            {showSearchAlert && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl animate-pulse">
                <p className="text-yellow-800 text-sm font-medium">
                  {alertMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Navigation */}
      <section ref={categoriesRef} className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryClick(category.value)}
                  className={`category-card px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.value
                      ? 'bg-yellow-400 text-gray-900 shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-yellow-50 shadow-md'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <H2>
              {selectedCategory === 'all'
                ? 'All Products'
                : categories.find(c => c.value === selectedCategory)?.name}
            </H2>
            <p className="text-xl text-gray-600 mt-4">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div ref={productsRef} className="max-w-6xl mx-auto">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-4">
                  No products found
                </h3>
                <p className="text-gray-500 mb-8">
                  Try adjusting your search terms or browse different categories
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="product-card bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                  >
                    {/* Product Image */}
                    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg w-full">
                          Quick View
                        </button>
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
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                          {product.name}
                        </h3>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-yellow-600">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Product Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {product.sizes.length} sizes
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {product.colors.length} colors
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button className="flex-1 bg-yellow-400 text-gray-900 py-4 rounded-full font-bold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button className="w-14 border-2 border-gray-200 text-gray-400 py-4 rounded-full font-semibold hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                          ♡
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-5xl font-bold mb-6">Limited Time Offer</h2>
            <p className="text-2xl mb-10 opacity-95">
              Get 20% off on your first order when you spend ₦15,000 or more
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-white text-yellow-600 px-10 py-5 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg">
                Shop Now & Save
              </button>
              <button className="border-3 border-white text-white px-10 py-5 rounded-full font-bold hover:bg-white/10 transition-all duration-300 transform hover:scale-105 text-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-16">Why Choose Wisdom House Merchandise?</H2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: '✨',
                  title: 'Premium Quality',
                  description:
                    'Exceptional materials crafted with attention to detail and durability',
                },
                {
                  icon: '🙏',
                  title: 'Faith-Inspired',
                  description:
                    'Every item carries meaningful messages of hope and inspiration',
                },
                {
                  icon: '🚚',
                  title: 'Fast Nationwide Delivery',
                  description:
                    'Quick, secure delivery across Nigeria with real-time tracking',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105"
                >
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Be the first to know about new merchandise, exclusive offers, and
              special discounts
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
              />
              <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap">
                Subscribe Now
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StorePage;
