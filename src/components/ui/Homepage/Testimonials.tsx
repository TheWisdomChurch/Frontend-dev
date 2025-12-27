'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H3, Caption, BodySM } from '@/components/text';
import Button from '@/components/utils/buttons/CustomButton';
import { Section, Container, FlexboxLayout } from '@/components/layout';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Quote,
  Play,
  Pause,
  Sparkles,
  Heart
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

// Demo testimonials data with responsive images
const churchTestimonials = [
  {
    id: 1,
    firstName: 'Michael',
    lastName: 'Johnson',
    fullName: 'Michael Johnson',
    role: 'Church Member',
    image: '/images/testimonials/michael.jpg',
    testimony: "I was lost in addiction for 15 years. Through the prayer ministry of this church and God's grace, I've been sober for 3 years now. The support I received here changed my life completely.",
    date: '2024-01-15',
    tags: ['Transformation', 'Healing'],
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Williams',
    fullName: 'Sarah Williams',
    role: 'Youth Leader',
    image: '/images/testimonials/sarah.jpg',
    testimony: "My family was going through a difficult financial season. Through the church's benevolence ministry and the prayers of the saints, God miraculously provided for all our needs.",
    date: '2024-02-20',
    tags: ['Provision', 'Miracle'],
  },
  {
    id: 3,
    firstName: 'Robert',
    lastName: 'Chen',
    fullName: 'Robert Chen',
    role: 'Volunteer',
    image: '/images/testimonials/robert.jpg',
    testimony: "After losing my job, I fell into depression. The counseling ministry and Bible study groups helped me find hope in God's promises. Today, I have a better job and a stronger faith.",
    date: '2024-03-10',
    tags: ['Hope', 'Restoration'],
  },
  {
    id: 4,
    firstName: 'Grace',
    lastName: 'Okon',
    fullName: 'Grace Okon',
    role: 'Prayer Warrior',
    image: '/images/testimonials/grace.jpg',
    testimony: 'God healed me from a terminal illness after the church prayed for me. The doctors called it a miracle. I\'m here today as a living testimony of God\'s healing power.',
    date: '2024-03-25',
    tags: ['Healing', 'Miracle'],
  },
  {
    id: 5,
    firstName: 'David',
    lastName: 'Martinez',
    fullName: 'David Martinez',
    role: 'Worship Leader',
    image: '/images/testimonials/david.jpg',
    testimony: 'Coming from a broken family, I found a spiritual family here. The love and acceptance I experienced helped me understand God\'s love in a tangible way.',
    date: '2024-04-05',
    tags: ['Family', 'Love'],
  },
  {
    id: 6,
    firstName: 'Amina',
    lastName: 'Hassan',
    fullName: 'Amina Hassan',
    role: 'Sunday School Teacher',
    image: '/images/testimonials/amina.jpg',
    testimony: 'As an immigrant, I felt isolated. This church became my home. The community support and spiritual guidance helped me establish roots in a new country.',
    date: '2024-04-18',
    tags: ['Community', 'Support'],
  },
];

interface TestimonialCardProps {
  testimonial: (typeof churchTestimonials)[0];
  isActive: boolean;
  colorScheme: any;
  index: number;
  isMobile: boolean;
}

function TestimonialCard({ testimonial, isActive, colorScheme, index, isMobile }: TestimonialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!cardRef.current || !isActive) return;

    const ctx = gsap.context(() => {
      // Reset animations
      gsap.set(cardRef.current, { opacity: 0, scale: 0.9, y: 20 });
      if (contentRef.current?.children) {
        gsap.set(contentRef.current.children, { opacity: 0, y: 10 });
      }

      // Main card animation
      gsap.to(cardRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: index * 0.05,
      });

      // Staggered content animation
      if (contentRef.current?.children) {
        gsap.to(contentRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.2 + index * 0.05,
          ease: 'power2.out',
        });
      }

      // Text animation
      if (textRef.current) {
        gsap.fromTo(textRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.3 }
        );
      }
    });

    return () => ctx.revert();
  }, [isActive, index]);

  return (
    <div
      ref={cardRef}
      className={`relative w-full transition-all duration-500 ${isActive ? 'opacity-100 visible z-10' : 'opacity-0 invisible z-0'}`}
      style={{
        perspective: '1000px',
      }}
    >
      {/* Animated Border Glow */}
      <div className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(45deg, ${colorScheme.primary}15, transparent, ${colorScheme.primary}15)`,
          filter: 'blur(8px)',
          transform: 'translateZ(-1px)',
        }}
      />

      {/* Main Card */}
      <div 
        ref={contentRef}
        className="relative rounded-2xl p-5 sm:p-7 backdrop-blur-sm border h-full"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.surface} 0%, ${colorScheme.background} 100%)`,
          borderColor: `${colorScheme.border}50`,
          boxShadow: `0 4px 24px ${colorScheme.primary}08, 0 1px 4px rgba(0,0,0,0.05)`,
        }}
      >
       

        {/* Testimonial Content */}
        <div className="mb-5 sm:mb-6">
          <p 
            ref={textRef}
            className="text-sm sm:text-base leading-relaxed mb-4 line-clamp-4 sm:line-clamp-5 font-normal"
            style={{ 
              color: colorScheme.textSecondary,
            }}
          >
            &quot;{testimonial.testimony}&quot;
          </p>

          {/* Tags - Simplified */}
          <div className="flex flex-wrap gap-1.5">
            {testimonial.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-normal"
                style={{
                  backgroundColor: `${colorScheme.primary}08`,
                  color: colorScheme.primary,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center pt-4 border-t" style={{ borderColor: `${colorScheme.border}30` }}>
          <div className="relative">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden"
              style={{ 
                border: `2px solid ${colorScheme.primary}30`,
                boxShadow: `0 2px 8px ${colorScheme.primary}15`,
              }}>
              <Image
                src={testimonial.image || '/images/avatar-placeholder.jpg'}
                alt={testimonial.fullName}
                width={44}
                height={44}
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 640px) 36px, 44px"
              />
            </div>
          </div>
          <div className="ml-3 sm:ml-4">
            <p 
              className="font-medium text-sm sm:text-base"
              style={{ color: colorScheme.text }}
            >
              {testimonial.fullName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <p 
                className="text-xs sm:text-sm font-light"
                style={{ color: colorScheme.textTertiary }}
              >
                {testimonial.role}
              </p>
              <span 
                className="text-xs"
                style={{ color: `${colorScheme.textTertiary}60` }}
              >
                •
              </span>
              <p 
                className="text-xs font-light"
                style={{ color: colorScheme.textTertiary }}
              >
                {new Date(testimonial.date).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialSection() {
  const { colorScheme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create animated background pattern
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !sectionRef.current) return;

    const section = sectionRef.current;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.03';
    
    section.appendChild(canvas);

    // Draw subtle grid pattern
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = colorScheme.primary;
      ctx.lineWidth = 0.5;
      
      const gridSize = 40;
      const offset = (Date.now() / 10000) * gridSize;
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + offset % gridSize, 0);
        ctx.lineTo(x + offset % gridSize, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + offset % gridSize);
        ctx.lineTo(canvas.width, y + offset % gridSize);
        ctx.stroke();
      }
    };

    let animationFrame: number;
    const animate = () => {
      drawGrid();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      if (section.contains(canvas)) {
        section.removeChild(canvas);
      }
    };
  }, [colorScheme]);

  // GSAP animations for entrance
  useEffect(() => {
    if (!sectionRef.current) return;

    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });

    timelineRef.current
      .fromTo('.section-title', {
        y: 40,
        opacity: 0,
        scale: 0.95,
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      })
      .fromTo('.section-description', {
        y: 30,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4')
      .fromTo('.testimonial-card', {
        y: 50,
        opacity: 0,
        scale: 0.9,
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.1)',
      }, '-=0.2');

    return () => {
      timelineRef.current?.kill();
    };
  }, [colorScheme]);

  // Auto-rotation
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % churchTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex(prev => 
      prev === 0 ? churchTestimonials.length - 1 : prev - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 6000);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % churchTestimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 6000);
  }, []);

  const handleIndicatorClick = useCallback((index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 6000);
  }, []);

  // Responsive values
  const responsiveValues = useMemo(() => ({
    titleSize: isMobile ? 'text-xl sm:text-2xl' : 'text-2xl lg:text-3xl',
    descriptionSize: isMobile ? 'text-xs sm:text-sm' : 'text-sm lg:text-base',
    buttonSize: isMobile ? 'text-sm px-3 py-1.5' : 'text-base px-4 py-2',
    cardPadding: isMobile ? 'p-4' : 'p-5 sm:p-6',
  }), [isMobile]);

  return (
    <>
      <style jsx global>{`
        @keyframes subtle-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .subtle-float {
          animation: subtle-float 8s ease-in-out infinite;
        }
      `}</style>

      <Section
        ref={sectionRef}
        padding="none"
        fullHeight={false}
        className="relative overflow-hidden"
      >
        {/* Subtle Gradient Background */}
        <div className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.background} 0%, ${colorScheme.backgroundSecondary} 100%)`,
          }}
        />

        {/* Decorative Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full subtle-float"
            style={{
              background: `radial-gradient(circle, ${colorScheme.primary}05 0%, transparent 70%)`,
            }}
          />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full subtle-float"
            style={{
              background: `radial-gradient(circle, ${colorScheme.secondary}05 0%, transparent 70%)`,
              animationDelay: '2s',
            }}
          />
        </div>

        <Container size="xl" className={`relative z-10 ${isMobile ? 'px-4 py-12' : 'px-6 py-16 lg:py-20'}`}>
          {/* Header */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="sm"
            className="text-center mb-8 sm:mb-12"
          >
            {/* Decorative Element */}
            <div className="relative mb-4">
              <Heart 
                className="w-5 h-5 mx-auto"
                style={{ 
                  color: colorScheme.primary,
                  opacity: 0.8,
                }}
              />
            </div>

            <div className="max-w-2xl mx-auto">
              <H3
                className={`section-title font-medium ${responsiveValues.titleSize} mb-3`}
                style={{ 
                  color: colorScheme.heading,
                  lineHeight: 1.3,
                  fontWeight: 500,
                }}
              >
                Stories of{' '}
                <span 
                  className="font-semibold"
                  style={{ 
                    color: colorScheme.primary,
                  }}
                >
                  Faith & Transformation
                </span>
              </H3>
              
              <Caption
                className={`section-description ${responsiveValues.descriptionSize} max-w-xl mx-auto font-light`}
                style={{ 
                  color: colorScheme.textSecondary,
                  opacity: 0.9,
                  lineHeight: 1.6,
                }}
              >
                Real stories from our community about God&apos;s faithfulness and grace
              </Caption>
            </div>
          </FlexboxLayout>

          {/* Bible Verse - Elegant */}
          <div className="text-center mb-8 sm:mb-12 max-w-lg mx-auto">
            <div 
              className="inline-block px-4 py-2.5 rounded-lg"
              style={{ 
                backgroundColor: `${colorScheme.surface}80`,
                border: `1px solid ${colorScheme.border}40`,
                backdropFilter: 'blur(4px)',
              }}
            >
              <p 
                className="italic font-light"
                style={{ 
                  color: colorScheme.textSecondary,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                }}
              >
                &quot;They triumphed by the blood of the Lamb and by the word of their testimony.&quot;
              </p>
              <p 
                className="text-xs mt-1 font-light"
                style={{ 
                  color: colorScheme.textTertiary,
                }}
              >
                Revelation 12:11
              </p>
            </div>
          </div>

          {/* Testimonial Slider */}
          <div 
            className="testimonial-slider max-w-4xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Cards Container */}
            <div className="relative mb-8 sm:mb-10">
              <div className="relative h-[260px] sm:h-[300px] lg:h-[320px]">
                {churchTestimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`testimonial-card absolute inset-0 ${index === activeIndex ? 'pointer-events-auto' : 'pointer-events-none'}`}
                  >
                    <TestimonialCard
                      testimonial={testimonial}
                      isActive={index === activeIndex}
                      colorScheme={colorScheme}
                      index={index}
                      isMobile={isMobile}
                    />
                  </div>
                ))}
              </div>

              {/* Progress Bar - Minimal */}
              <div className="mt-6 sm:mt-7">
                <div className="h-px rounded-full overflow-hidden bg-gray-200/20">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${((activeIndex + 1) / churchTestimonials.length) * 100}%`,
                      backgroundColor: colorScheme.primary,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Controls */}
            <FlexboxLayout
              justify="center"
              align="center"
              gap="lg"
              className="mb-6 sm:mb-8"
            >
       

              {/* Navigation Arrows */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={handlePrev}
                  className="flex items-center justify-center transition-all duration-300 hover:opacity-80 active:scale-95"
                  style={{
                    color: colorScheme.text,
                    width: isMobile ? '34px' : '40px',
                    height: isMobile ? '34px' : '40px',
                  }}
                  aria-label="Previous testimonial"
                >
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: colorScheme.surface,
                      border: `1px solid ${colorScheme.border}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <ChevronLeft className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                  </div>
                </button>

                {/* Indicators - Minimal */}
                <div className="flex gap-1.5 sm:gap-2">
                  {churchTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleIndicatorClick(index)}
                      className="transition-all duration-300"
                      aria-label={`Go to testimonial ${index + 1}`}
                    >
                      <div
                        className={`rounded-full transition-all duration-300 ${
                          index === activeIndex 
                            ? (isMobile ? 'w-6 h-1.5' : 'w-8 h-2') 
                            : (isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2')
                        }`}
                        style={{
                          backgroundColor: index === activeIndex 
                            ? colorScheme.primary 
                            : `${colorScheme.textTertiary}40`,
                        }}
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center justify-center transition-all duration-300 hover:opacity-80 active:scale-95"
                  style={{
                    color: colorScheme.text,
                    width: isMobile ? '34px' : '40px',
                    height: isMobile ? '34px' : '40px',
                  }}
                  aria-label="Next testimonial"
                >
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: colorScheme.surface,
                      border: `1px solid ${colorScheme.border}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <ChevronRight className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                  </div>
                </button>
              </div>
            </FlexboxLayout>

            {/* Counter - Elegant */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{ 
                  backgroundColor: `${colorScheme.surface}80`,
                  border: `1px solid ${colorScheme.border}40`,
                }}
              >
                <div className="text-center">
                  <div 
                    className="font-medium text-lg sm:text-xl"
                    style={{ color: colorScheme.primary }}
                  >
                    {churchTestimonials.length}
                  </div>
                  <div 
                    className="text-xs font-light"
                    style={{ color: colorScheme.textTertiary }}
                  >
                    Stories
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section - Minimal */}
          <div className={`text-center ${isMobile ? 'px-4' : 'px-6'}`}>
            <div className="max-w-sm mx-auto">
              <p 
                className={`font-normal mb-4`}
                style={{ 
                  color: colorScheme.textSecondary,
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  lineHeight: 1.5,
                }}
              >
                Has God done something remarkable in your life?
              </p>

              <Link href="/testimonies" className="inline-block">
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "md"}
                  curvature="lg"
                  className="font-normal hover:opacity-90 active:scale-95 transition-all duration-300"
                  style={{
                    backgroundColor: 'transparent',
                    color: colorScheme.primary,
                    border: `1px solid ${colorScheme.primary}40`,
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    padding: isMobile ? '0.5rem 1.25rem' : '0.625rem 1.5rem',
                  }}
                  rightIcon={<ArrowRight className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
                >
                  Share Your Testimony
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}