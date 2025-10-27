'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { H1 } from '../../text';
import { Banner_1, Banner_2, Banner_3 } from '../../assets';
import { ChevronDown } from 'lucide-react';

import Header from '@/components/layout/header';

const slides = [
  {
    image: Banner_1,
    title: 'We Are Transformed',
    subtitle: "Experience God's Transforming Power",
    description:
      'Welcome to The Wisdom House Church where lives are transformed through faith, community, and divine guidance.',
  },
  {
    image: Banner_2,
    title: 'Growing In Faith',
    subtitle: 'Deepen Your Spiritual Journey',
    description:
      'Join our vibrant community as we grow together in faith, love, and service to others.',
  },
  {
    image: Banner_3,
    title: 'Building Community',
    subtitle: 'Connect With Believers',
    description:
      'Experience the warmth of genuine fellowship and build lasting relationships in Christ.',
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 500);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (index: SetStateAction<number>) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Header integrated inside HeroSection */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <Header />
      </div>

      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Optimized Image */}
          <img
            src={slide.image.src}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            style={{
              objectPosition: 'center center',
              width: '100%',
              height: '100%',
            }}
          />
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
          {/* Additional color overlay for better text contrast */}
          <div className="absolute inset-0 bg-[#001910]/40 mix-blend-overlay" />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Content - Added padding top to account for header */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-7xl mx-auto">
          <div
            className={`text-center text-white transition-all duration-500 transform ${
              isTransitioning
                ? 'translate-y-4 opacity-0'
                : 'translate-y-0 opacity-100'
            }`}
          >
            {/* Main Title */}
            <H1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 leading-tight tracking-tight">
              {slides[currentSlide].title}
            </H1>

            {/* Accent Line */}
            <div className="h-1 w-20 bg-[#8bea19] mx-auto mb-6 rounded-full"></div>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6 text-[#8bea19] leading-tight">
              {slides[currentSlide].subtitle}
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto mb-8 leading-relaxed sm:leading-loose">
              {slides[currentSlide].description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button className="bg-[#8bea19] text-[#001910] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#7ad017] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto">
                Join Us This Sunday
              </button>
              <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white hover:text-[#001910] transition-all duration-300 w-full sm:w-auto">
                Watch Live Stream
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
        {/* Slide Dots */}
        <div className="flex space-x-3 order-2 sm:order-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-[#8bea19] scale-125 shadow-lg'
                  : 'bg-white/60 hover:bg-white/80 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-white text-sm font-medium order-1 sm:order-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
          <span className="text-[#8bea19] font-bold">{currentSlide + 1}</span>
          <span className="mx-1">/</span>
          <span>{slides.length}</span>
        </div>
      </div>

      {/* Bouncing Chevron Down Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 hidden sm:block">
        <div className="animate-bounce flex flex-col items-center">
          <span className="text-white text-sm mb-2 font-medium">
            Scroll Down
          </span>
          <ChevronDown className="w-6 h-6 text-white animate-pulse" />
        </div>
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 sm:hidden">
        <div className="animate-bounce flex flex-col items-center">
          <ChevronDown className="w-5 h-5 text-white" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
