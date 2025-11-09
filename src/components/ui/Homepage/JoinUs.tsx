/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Workforce_bg } from '@/components/assets';
import { BaseText, LightText } from '@/components/text';
import { photos } from '@/lib/data';
import Button from '@/components/utils/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faXmark,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FormModal } from '@/components/modal/FormModal';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function JoinWisdomHouse() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [currentScroll, setCurrentScroll] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { colorScheme } = useTheme();

  // Add card to ref array
  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current[index] = el;
    }
  };

  const handleLearnMore = (department: string) => {
    setSelectedDepartment(department);
    setShowForm(true);
  };

  // Scroll functions for mobile
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // GSAP animations for cards entrance only
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        {
          y: 80,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle card hover with proper event handling
  const handleCardEnter = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCard(index);
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.killTweensOf(card);
    gsap.killTweensOf(card.querySelector('img'));
    gsap.killTweensOf(card.querySelector('.card-content'));

    gsap.to(card, {
      y: -12,
      scale: 1.03,
      duration: 0.5,
      ease: 'power2.out',
    });

    const image = card.querySelector('img');
    if (image) {
      gsap.to(image, {
        scale: 1.1,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    const content = card.querySelector('.card-content');
    if (content) {
      gsap.to(content, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  const handleCardLeave = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCard(null);
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.killTweensOf(card);
    gsap.killTweensOf(card.querySelector('img'));
    gsap.killTweensOf(card.querySelector('.card-content'));

    gsap.to(card, {
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });

    const image = card.querySelector('img');
    if (image) {
      gsap.to(image, {
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    const content = card.querySelector('.card-content');
    if (content) {
      gsap.to(content, {
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-16 md:py-24 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${Workforce_bg.src})`,
          }}
        >
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-2 font-bold leading-tight">
              Join Our{' '}
              <BaseText
                weight="regular"
                fontFamily="playfair"
                style={{
                  fontStyle: 'italic',
                  color: colorScheme.primary,
                  display: 'inline',
                  fontSize: 'inherit',
                  lineHeight: 'inherit',
                }}
              >
                Workforce
              </BaseText>
            </h2>

            <LightText
              className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-center leading-relaxed text-gray-300"
              style={{ color: colorScheme.textSecondary }}
            >
              "Each of you should use whatever gift you have received to serve
              others, as faithful stewards of God's grace in its various forms."
              – 1 Peter 4:10
            </LightText>
          </div>

          {/* Desktop Layout - Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {photos.map((photo, index) => (
              <div
                key={photo.title}
                ref={el => addToRefs(el, index)}
                onMouseEnter={e => handleCardEnter(index, e)}
                onMouseLeave={e => handleCardLeave(index, e)}
                className="relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 cursor-pointer"
                style={{
                  transform: 'translateY(0) scale(1)',
                }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    fill
                    className="object-cover"
                    style={{ transform: 'scale(1)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Main Content Section - Always Visible */}
                <div className="p-6 bg-gradient-to-b from-white/5 to-transparent">
                  <BaseText
                    className="text-white font-bold text-lg mb-4 text-center"
                    style={{ color: colorScheme.white }}
                  >
                    {photo.title}
                  </BaseText>
                </div>

                {/* Hover Overlay Content */}
                <div
                  className="card-content absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 opacity-0 translate-y-30"
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="text-center">
                    <BaseText
                      className="text-white font-bold text-xl mb-4"
                      style={{ color: colorScheme.white }}
                    >
                      {photo.title}
                    </BaseText>

                    <p className="text-gray-200 text-center mb-6 text-sm leading-relaxed max-w-xs">
                      Discover how you can contribute to our ministry through{' '}
                      {photo.title.toLowerCase()}. Join us in making a
                      difference in our community.
                    </p>

                    <Button
                      variant="primary"
                      size="md"
                      curvature="full"
                      className="inline-flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: colorScheme.primary,
                        color: colorScheme.black,
                        pointerEvents: 'auto',
                      }}
                      onClick={() => handleLearnMore(photo.title)}
                      onMouseEnter={(e: any) => {
                        e.currentTarget.style.backgroundColor =
                          colorScheme.heading;
                      }}
                      onMouseLeave={(e: any) => {
                        e.currentTarget.style.backgroundColor =
                          colorScheme.primary;
                      }}
                    >
                      <span className="font-medium">Learn More</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile & Tablet Layout - Horizontal Scroll */}
          <div className="md:hidden relative">
            {/* Scroll Navigation Buttons */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={scrollLeft}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 z-10"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
              </button>

              <span className="text-white text-sm font-medium px-4">
                Scroll to Choose Your Preferred Department
              </span>

              <button
                onClick={scrollRight}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 z-10"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal Scroll Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {photos.map((photo, index) => (
                <div
                  key={photo.title}
                  className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <BaseText
                      className="text-white font-bold text-lg mb-4 text-center"
                      style={{ color: colorScheme.white }}
                    >
                      {photo.title}
                    </BaseText>

                    <p className="text-gray-200 text-center mb-4 text-sm leading-relaxed">
                      Discover how you can contribute to our ministry through{' '}
                      {photo.title.toLowerCase()}.
                    </p>

                    <div className="flex justify-center">
                      <Button
                        variant="primary"
                        size="sm"
                        curvature="full"
                        className="inline-flex items-center justify-center gap-2 w-full"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                        }}
                        onClick={() => handleLearnMore(photo.title)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add some extra space at the end for better scrolling */}
              <div className="flex-shrink-0 w-4" />
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300"
                />
              ))}
            </div>
          </div>

          {/* Tablet Layout - 2 columns with horizontal scroll for overflow */}
          <div className="hidden md:block lg:hidden">
            <div className="flex gap-6 overflow-x-auto pb-8 px-2 scrollbar-hide">
              {photos.map((photo, index) => (
                <div
                  key={photo.title}
                  className="flex-shrink-0 w-96 bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 cursor-pointer"
                  onMouseEnter={e => handleCardEnter(index, e)}
                  onMouseLeave={e => handleCardLeave(index, e)}
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <BaseText
                      className="text-white font-bold text-lg mb-4 text-center"
                      style={{ color: colorScheme.white }}
                    >
                      {photo.title}
                    </BaseText>

                    <div className="flex justify-center">
                      <Button
                        variant="primary"
                        size="sm"
                        curvature="full"
                        className="inline-flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                        }}
                        onClick={() => handleLearnMore(photo.title)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add some extra space at the end for better scrolling */}
              <div className="flex-shrink-0 w-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Form Modal */}
      <FormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        department={selectedDepartment || ''}
        colorScheme={colorScheme}
      />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
