'use client';

import { testimonialData } from '@/lib/data';
import { Section, Container } from '@/shared/layout';
import { StarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonialData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex(prev =>
      prev === 0 ? testimonialData.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex(prev => (prev + 1) % testimonialData.length);
  };

  return (
    <Section
      padding="lg"
      className="py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      <Container size="xl" className="space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <p
            className="text-sm uppercase tracking-widest font-semibold"
            style={{ color: 'var(--color-gold)' }}
          >
            Testimonies
          </p>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              color: 'var(--color-text-primary)',
            }}
          >
            Stories of Transformation
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Hear how faith and community have changed lives
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div
            className="rounded-2xl p-8 sm:p-12 lg:p-14 min-h-96"
            style={{
              backgroundColor: 'rgba(215, 187, 117, 0.08)',
              border: '1px solid var(--color-border-light)',
            }}
          >
            {testimonialData.length > 0 && (
              <div className="space-y-6">
                {/* Star Rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-5 w-5"
                      style={{
                        color: 'var(--color-gold)',
                        fill: 'var(--color-gold)',
                      }}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote
                  className="text-lg sm:text-xl leading-relaxed italic"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  "{testimonialData[activeIndex].quote}"
                </blockquote>

                {/* Testimonial Author */}
                <div
                  className="flex items-center gap-4 pt-6 border-t"
                  style={{ borderColor: 'var(--color-border-light)' }}
                >
                  <div
                    className="w-12 h-12 rounded-full"
                    style={{
                      backgroundColor: 'rgba(215, 187, 117, 0.2)',
                    }}
                  />
                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {testimonialData[activeIndex].author}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {testimonialData[activeIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 sm:mt-10">
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="p-3 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(215, 187, 117, 0.1)',
                  color: 'var(--color-gold)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(215, 187, 117, 0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(215, 187, 117, 0.1)';
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(215, 187, 117, 0.1)',
                  color: 'var(--color-gold)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(215, 187, 117, 0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(215, 187, 117, 0.1)';
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonialData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAutoplay(false);
                    setActiveIndex(idx);
                  }}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: idx === activeIndex ? '24px' : '8px',
                    backgroundColor:
                      idx === activeIndex
                        ? 'var(--color-gold)'
                        : 'rgba(215, 187, 117, 0.3)',
                  }}
                />
              ))}
            </div>

            {/* Resume Autoplay */}
            <button
              onMouseEnter={() => setAutoplay(true)}
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: 'rgba(215, 187, 117, 0.1)',
                color: 'var(--color-gold)',
              }}
            >
              Resume
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
