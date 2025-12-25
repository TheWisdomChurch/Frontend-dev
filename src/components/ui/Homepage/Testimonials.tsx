'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H3, Caption } from '@/components/text';
import Button from '@/components/utils/buttons/CustomButton';
import { Section, Container, FlexboxLayout } from '@/components/layout';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Quote,
} from 'lucide-react';
import { gsap } from 'gsap';
import Link from 'next/link';

// Type definition WITHOUT role and rating
interface TestimonialType {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  image: string;
  testimony: string;
  date: string;
  anonymous: boolean;
}

// Demo testimonials data WITHOUT role and rating
const churchTestimonials: TestimonialType[] = [
  {
    id: 1,
    firstName: 'Michael',
    lastName: 'Johnson',
    fullName: 'Michael Johnson',
    image: '/images/testimonials/michael.jpg',
    testimony:
      "I was lost in addiction for 15 years. Through the prayer ministry of this church and God's grace, I've been sober for 3 years now. The support I received here changed my life completely.",
    date: '2024-01-15',
    anonymous: false,
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Williams',
    fullName: 'Sarah Williams',
    image: '/images/testimonials/sarah.jpg',
    testimony:
      "My family was going through a difficult financial season. Through the church's benevolence ministry and the prayers of the saints, God miraculously provided for all our needs. To God be the glory!",
    date: '2024-02-20',
    anonymous: false,
  },
  {
    id: 3,
    firstName: 'Robert',
    lastName: 'Chen',
    fullName: 'Robert Chen',
    image: '/images/testimonials/robert.jpg',
    testimony:
      'After losing my job, I fell into depression. The counseling ministry and Bible study groups helped me find hope in God&apos;s promises. Today, I have a better job and a stronger faith.',
    date: '2024-03-10',
    anonymous: false,
  },
  {
    id: 4,
    firstName: 'Grace',
    lastName: 'Okon',
    fullName: 'Grace Okon',
    image: '/images/testimonials/grace.jpg',
    testimony:
      'God healed me from a terminal illness after the church prayed for me. The doctors called it a miracle. I&apos;m here today as a living testimony of God&apos;s healing power.',
    date: '2024-03-25',
    anonymous: false,
  },
];

interface TestimonialCardProps {
  testimonial: TestimonialType;
  isActive: boolean;
  colorScheme: any;
  index: number;
}

function TestimonialCard({ testimonial, isActive, colorScheme, index }: TestimonialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !isActive) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: index * 0.1,
      }
    );
  }, [isActive, index]);

  return (
    <div
      ref={cardRef}
      className={`w-full transition-all duration-300 ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible absolute'}`}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm sm:shadow-lg border border-gray-100 dark:border-gray-700 h-full hover:shadow-md transition-shadow"
        style={{
          backgroundColor: colorScheme.surface,
          borderColor: colorScheme.border,
        }}
      >
        {/* Quote Icon */}
        <div className="mb-3 sm:mb-4">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colorScheme.primary}15` }}
          >
            <Quote className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colorScheme.primary }} />
          </div>
        </div>

        {/* Testimonial Content */}
        <div className="flex-grow">
          <p 
            className="text-gray-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-4 sm:line-clamp-5"
            style={{ color: colorScheme.textSecondary }}
          >
            &quot;{testimonial.testimony}&quot;
          </p>
        </div>

        {/* Author Info with Date - NO ROLE */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: colorScheme.border }}>
          <div className="flex items-center">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2" 
              style={{ borderColor: colorScheme.white }}>
              <Image
                src={testimonial.image || '/images/avatar-placeholder.jpg'}
                alt={testimonial.fullName}
                width={48}
                height={48}
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 640px) 40px, 48px"
              />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="font-semibold text-sm sm:text-base" style={{ color: colorScheme.text }}>
                {testimonial.fullName}
              </p>
              {/* ROLE LINE REMOVED - Only shows name */}
            </div>
          </div>
          
          {/* Date */}
          <span 
            className="text-xs sm:text-sm italic"
            style={{ color: colorScheme.textTertiary }}
          >
            {new Date(testimonial.date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonial() {
  const { colorScheme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotation with pause on hover
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % churchTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // GSAP animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );

      const tl = gsap.timeline();
      tl.from('.section-title', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
      .from('.section-description', {
        y: 10,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.testimonial-card', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.2)',
      }, '-=0.2');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex(prev => 
      prev === 0 ? churchTestimonials.length - 1 : prev - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % churchTestimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  }, []);

  // Responsive layout config
  const containerConfig = useMemo(() => ({
    padding: isMobile ? 'px-4' : 'px-6',
    gap: isMobile ? 'gap-4' : 'gap-8',
    textSize: {
      title: isMobile ? 'text-xl' : 'text-3xl lg:text-4xl',
      description: isMobile ? 'text-xs' : 'text-sm lg:text-base',
    },
  }), [isMobile]);

  return (
    <Section
      ref={sectionRef}
      padding={isMobile ? "md" : "lg"}
      fullHeight={false}
      className="relative overflow-hidden"
      style={{ 
        backgroundColor: colorScheme.backgroundSecondary,
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 rounded-full"
          style={{ 
            backgroundColor: colorScheme.primary,
            opacity: 0.08,
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 rounded-full"
          style={{ 
            backgroundColor: colorScheme.primary,
            opacity: 0.08,
          }}
        />
      </div>

      <Container size="lg" className={`relative z-10 ${containerConfig.padding}`}>
        {/* Header */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="sm"
          className={`text-center mb-6 sm:mb-10 ${containerConfig.gap}`}
        >
          <div className={isMobile ? 'mt-6' : 'mt-10'}>
            <H3
              className={`section-title font-bold ${containerConfig.textSize.title} leading-tight`}
              style={{ 
                color: colorScheme.heading,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Testimonies of{' '}
              <span style={{ 
                color: colorScheme.primary,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                God&apos;s Faithfulness
              </span>
            </H3>
          </div>
          <Caption
            className={`section-description ${containerConfig.textSize.description} max-w-xl mx-auto`}
            style={{ 
              color: colorScheme.textSecondary,
              opacity: 0.9
            }}
          >
            Hear how God is transforming lives in our community
          </Caption>
        </FlexboxLayout>

        {/* Bible Verse */}
        <div className="text-center mb-6 sm:mb-8">
          <div 
            className="inline-block px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-sm border"
            style={{ 
              backgroundColor: colorScheme.surface,
              borderColor: colorScheme.border,
              borderWidth: '1px',
            }}
          >
            <p 
              className="italic text-sm sm:text-base"
              style={{ color: colorScheme.textSecondary }}
            >
              &quot;They triumphed by the blood of the Lamb and by the word of their testimony.&quot;
            </p>
            <p 
              className="text-xs sm:text-sm mt-1"
              style={{ color: colorScheme.textTertiary }}
            >
              — Revelation 12:11
            </p>
          </div>
        </div>

        {/* Testimonial Slider */}
        <div className="max-w-4xl mx-auto">
          {/* Cards Container */}
          <div 
            ref={sliderRef}
            className={`relative ${isMobile ? 'h-[280px]' : 'h-[320px]'} mb-6 sm:mb-8`}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {churchTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonial-card absolute inset-0 ${isMobile ? 'px-2' : 'px-4'}`}
              >
                <TestimonialCard
                  testimonial={testimonial}
                  isActive={index === activeIndex}
                  colorScheme={colorScheme}
                  index={index}
                />
              </div>
            ))}
          </div>

          {/* Slider Controls */}
          <FlexboxLayout
            justify="center"
            align="center"
            gap="sm"
            className="sm:gap-6"
          >
            <button
              onClick={handlePrev}
              className={`flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}
              style={{
                color: colorScheme.primary,
                backgroundColor: colorScheme.opacity.primary10,
                borderRadius: '50%',
              }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
            </button>

            {/* Indicators */}
            <div className="flex gap-1.5 sm:gap-2 px-2 sm:px-4">
              {churchTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 3000);
                  }}
                  className="transition-all duration-300"
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${index === activeIndex ? (isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5') : (isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2')}`}
                    style={{
                      backgroundColor: index === activeIndex 
                        ? colorScheme.primary 
                        : colorScheme.gray[300],
                    }}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className={`flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}
              style={{
                color: colorScheme.primary,
                backgroundColor: colorScheme.opacity.primary10,
                borderRadius: '50%',
              }}
              aria-label="Next testimonial"
            >
              <ChevronRight className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
            </button>
          </FlexboxLayout>
        </div>

        {/* Share Testimony CTA */}
        <div className={`text-center pt-8 sm:pt-10 ${containerConfig.padding}`}>
          <div 
            className={`rounded-xl sm:rounded-2xl ${isMobile ? 'p-4' : 'p-6 sm:p-8'} shadow-sm max-w-2xl mx-auto border`}
            style={{ 
              backgroundColor: colorScheme.surface,
              borderColor: colorScheme.border,
              borderWidth: '1px',
            }}
          >
            <h3 
              className={`font-bold ${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'} mb-2 sm:mb-4`}
              style={{ color: colorScheme.heading }}
            >
              Share Your Testimony
            </h3>
            <p 
              className={`${isMobile ? 'text-xs' : 'text-sm sm:text-base'} mb-4 sm:mb-6 max-w-md mx-auto`}
              style={{ color: colorScheme.textSecondary }}
            >
              Your story can inspire others and bring glory to God. Share what He has done in your life.
            </p>

            <Link href="/testimonies" className="inline-block">
              <Button
                variant="primary"
                size={isMobile ? "sm" : "md"}
                curvature="xl"
                className="font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.buttonText,
                }}
                rightIcon={<ArrowRight className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />}
              >
                <span className={isMobile ? 'text-sm' : 'text-base'}>
                  Share Your Testimony
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty space at the bottom */}
        <div className="h-12 sm:h-16 lg:h-20"></div>
      </Container>
    </Section>
  );
}