'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bgImage?: string;
  bgColor: string;
}

const slides: Slide[] = [
  {
    id: 'slide-1',
    title: "Experience God's Transforming Power",
    subtitle: 'Welcome Home',
    description:
      'Join a vibrant, Spirit-filled community where worship is powerful, teaching is biblical, and lives are transformed.',
    buttonText: 'Plan Your Visit',
    buttonLink: '/contact',
    bgColor: 'rgba(5, 5, 5, 0.7)',
  },
  {
    id: 'slide-2',
    title: 'Powerful Worship Experience',
    subtitle: 'Feel His Presence',
    description:
      'Encounter the living God through authentic worship, dynamic preaching, and genuine community fellowship.',
    buttonText: 'Watch Sermons',
    buttonLink: '/resources/sermons',
    bgColor: 'rgba(139, 105, 20, 0.6)',
  },
  {
    id: 'slide-3',
    title: 'Growing In Faith Together',
    subtitle: 'Our Mission',
    description:
      "We're committed to raising leaders, strengthening faith, and serving the nations with the love of Christ.",
    buttonText: 'Learn More',
    buttonLink: '/about',
    bgColor: 'rgba(5, 5, 5, 0.75)',
  },
];

export default function SliderHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-in-out',
              index === currentSlide
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            )}
          >
            {/* Background overlay */}
            <div
              className="absolute inset-0 z-10"
              style={{
                backgroundColor: slide.bgColor,
              }}
            />

            {/* Background gradient */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background:
                  'radial-gradient(circle at top right, rgba(215, 187, 117, 0.2), transparent 70%)',
              }}
            />

            {/* Content */}
            <div className="relative z-20 h-full flex items-center justify-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="max-w-3xl mx-auto lg:mx-0 lg:max-w-2xl">
                  {/* Subtitle */}
                  <p
                    className="text-sm uppercase tracking-widest font-semibold mb-6 transition-all duration-700"
                    style={{
                      color: 'var(--color-gold)',
                      opacity: index === currentSlide ? 1 : 0,
                      transform:
                        index === currentSlide
                          ? 'translateY(0)'
                          : 'translateY(20px)',
                    }}
                  >
                    {slide.subtitle}
                  </p>

                  {/* Title */}
                  <h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-6 transition-all duration-700"
                    style={{
                      color: 'var(--color-text-primary)',
                      opacity: index === currentSlide ? 1 : 0,
                      transform:
                        index === currentSlide
                          ? 'translateY(0)'
                          : 'translateY(30px)',
                    }}
                  >
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p
                    className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl transition-all duration-700"
                    style={{
                      color: 'var(--color-text-secondary)',
                      opacity: index === currentSlide ? 1 : 0,
                      transform:
                        index === currentSlide
                          ? 'translateY(0)'
                          : 'translateY(30px)',
                    }}
                  >
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div
                    className="flex flex-col sm:flex-row gap-4 transition-all duration-700"
                    style={{
                      opacity: index === currentSlide ? 1 : 0,
                      transform:
                        index === currentSlide
                          ? 'translateY(0)'
                          : 'translateY(30px)',
                    }}
                  >
                    <Link
                      href={slide.buttonLink}
                      className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      {slide.buttonText}
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      href="/events/upcoming"
                      className="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      Upcoming Events
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="group p-2 rounded-full border transition-all duration-300 hover:bg-white/10"
          style={{
            borderColor: 'var(--color-border-white)',
            color: 'var(--color-text-primary)',
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Dots Indicator */}
        <div className="flex gap-2 items-center">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="transition-all duration-300"
              style={{
                width: index === currentSlide ? '12px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor:
                  index === currentSlide
                    ? 'var(--color-gold)'
                    : 'var(--color-border-white)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="group p-2 rounded-full border transition-all duration-300 hover:bg-white/10"
          style={{
            borderColor: 'var(--color-border-white)',
            color: 'var(--color-text-primary)',
          }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-30 text-sm font-light tracking-wider">
        <span style={{ color: 'var(--color-gold)' }}>
          {String(currentSlide + 1).padStart(2, '0')}
        </span>
        <span style={{ color: 'var(--color-text-muted)' }}>
          {' '}
          / {String(slides.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}
