/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H3, Caption } from '@/components/text';
import Button from '@/components/utils/buttons/CustomButton';
import { Section, Container, FlexboxLayout } from '@/components/layout';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
  ArrowRight,
} from 'lucide-react';
import { gsap } from 'gsap';
import Link from 'next/link';

// Demo testimonials data
const churchTestimonials = [
  {
    id: 1,
    firstName: 'Michael',
    lastName: 'Johnson',
    fullName: 'Michael Johnson',
    role: 'Church Member',
    image: '/images/testimonials/michael.jpg',
    testimony:
      "I was lost in addiction for 15 years. Through the prayer ministry of this church and God's grace, I've been sober for 3 years now. The support I received here changed my life completely.",
    rating: 5,
    date: '2024-01-15',
    anonymous: false,
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Williams',
    fullName: 'Sarah Williams',
    role: 'Youth Leader',
    image: '/images/testimonials/sarah.jpg',
    testimony:
      "My family was going through a difficult financial season. Through the church's benevolence ministry and the prayers of the saints, God miraculously provided for all our needs. To God be the glory!",
    rating: 5,
    date: '2024-02-20',
    anonymous: false,
  },
  {
    id: 3,
    firstName: 'Robert',
    lastName: 'Chen',
    fullName: 'Robert Chen',
    role: 'Volunteer',
    image: '/images/testimonials/robert.jpg',
    testimony:
      "After losing my job, I fell into depression. The counseling ministry and Bible study groups helped me find hope in God's promises. Today, I have a better job and a stronger faith.",
    rating: 5,
    date: '2024-03-10',
    anonymous: false,
  },
  {
    id: 4,
    firstName: 'Grace',
    lastName: 'Okon',
    fullName: 'Grace Okon',
    role: 'Prayer Warrior',
    image: '/images/testimonials/grace.jpg',
    testimony:
      "God healed me from a terminal illness after the church prayed for me. The doctors called it a miracle. I'm here today as a living testimony of God's healing power.",
    rating: 5,
    date: '2024-03-25',
    anonymous: false,
  },
];

function TestimonialCard({ testimonial, isActive, colorScheme }: any) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    if (isActive) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.2)',
        }
      );
    }
  }, [isActive]);

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : ''}`}
        style={{
          color: i < testimonial.rating ? colorScheme.primary : '#d1d5db',
        }}
      />
    ));
  };

  return (
    <div
      ref={cardRef}
      className={`w-full transition-all duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-0 absolute pointer-events-none'}`}
    >
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full">
        {/* Quote Icon */}
        <div className="mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colorScheme.primary}15` }}
          >
            <MessageSquare
              className="w-5 h-5"
              style={{ color: colorScheme.primary }}
            />
          </div>
        </div>

        {/* Testimonial Content */}
        <div className="flex-grow">
          <p className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-4">
            "{testimonial.testimony}"
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">{renderStars()}</div>
            <span className="text-sm text-gray-500">
              {new Date(testimonial.date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center pt-4 border-t border-gray-100">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <Image
              src={testimonial.image || '/images/avatar-placeholder.jpg'}
              alt={testimonial.fullName}
              width={48}
              height={48}
              className="object-cover"
              loading="lazy"
              sizes="48px"
            />
          </div>
          <div className="ml-3">
            <p className="font-semibold text-gray-900 text-sm">
              {testimonial.fullName}
            </p>
            <p className="text-gray-600 text-xs">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonial() {
  const { colorScheme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % churchTestimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  // GSAP Animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.section-title',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8 }
      );

      gsap.fromTo(
        '.section-description',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
      );

      gsap.fromTo(
        '.testimonial-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, delay: 0.4 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePrev = () => {
    setActiveIndex(prev =>
      prev === 0 ? churchTestimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % churchTestimonials.length);
  };

  // Function to handle button click
  const handleShareTestimony = (e: React.MouseEvent) => {
    e.preventDefault();
    // You can add any additional logic here before navigation
    console.log('Navigating to testimonies page');
    // The Link will handle the navigation
  };

  return (
    <Section
      ref={sectionRef}
      padding="lg"
      fullHeight={false}
      className="relative overflow-hidden bg-gray-50"
    >
      <Container size="lg" className="relative z-10">
        {/* Header */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="md"
          className="text-center mb-12"
        >
          <H3
            className="section-title text-2xl sm:text-3xl lg:text-4xl"
            style={{ color: colorScheme.primary }}
            useThemeColor={false}
            weight="bold"
          >
            Testimonies of God's Faithfulness
          </H3>
          <Caption
            className="section-description max-w-2xl mx-auto text-gray-600 mt-2"
            useThemeColor={false}
          >
            Hear how God is transforming lives in our community
          </Caption>
        </FlexboxLayout>

        {/* Slider Section */}
        <div className="mb-12">
          {/* Bible Verse */}
          <div className="text-center mb-8">
            <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-700 italic">
                "They triumphed by the blood of the Lamb and by the word of
                their testimony."
              </p>
              <p className="text-gray-500 text-sm mt-1">— Revelation 12:11</p>
            </div>
          </div>

          {/* Testimonial Slider */}
          <div className="max-w-3xl mx-auto">
            <div className="relative h-[350px]">
              {churchTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="testimonial-card absolute inset-0"
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    isActive={index === activeIndex}
                    colorScheme={colorScheme}
                  />
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            <FlexboxLayout
              justify="center"
              align="center"
              gap="lg"
              className="mt-6"
            >
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                style={{
                  borderColor: colorScheme.primary,
                  color: colorScheme.primary,
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Indicators */}
              <div className="flex gap-2 px-4">
                {churchTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        index === activeIndex ? colorScheme.primary : '#d1d5db',
                      transform:
                        index === activeIndex ? 'scale(1.5)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                style={{
                  borderColor: colorScheme.primary,
                  color: colorScheme.primary,
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </FlexboxLayout>
          </div>
        </div>

        {/* Share Testimony CTA - FIXED LINK */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Share Your Testimony
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your story can inspire others and bring glory to God. Share what
              He has done in your life.
            </p>

            {/* Option 1: Use Link as a wrapper (Recommended) */}
            <Link href="/testimonies" className="inline-block">
              <Button
                variant="primary"
                size="md"
                curvature="xl"
                className="px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: '#000000',
                }}
                rightIcon={<ArrowRight className="w-5 h-5 ml-2" />}
                onClick={handleShareTestimony}
              >
                Share Your Testimony
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      {/* Background Elements */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colorScheme.primary}05 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colorScheme.primary}05 0%, transparent 70%)`,
          transform: 'translate(-30%, 30%)',
        }}
      />
    </Section>
  );
}
