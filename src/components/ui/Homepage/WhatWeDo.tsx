'use client';

import { useEffect, useRef } from 'react';
import { whatWeDoData, missionStatement, ServiceBox } from '@/lib/data';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LightText } from '@/components/text';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate main heading
      gsap.fromTo(
        headingRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate boxes with staggered effect
      boxesRef.current.forEach((box, index) => {
        if (box) {
          gsap.fromTo(
            box,
            {
              y: 100,
              opacity: 0,
              rotationY: 15,
              scale: 0.9,
            },
            {
              y: 0,
              opacity: 1,
              rotationY: 0,
              scale: 1,
              duration: 1.2,
              delay: index * 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: box,
                start: 'top 75%',
                end: 'bottom 25%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          // Hover animation for boxes
          box.addEventListener('mouseenter', () => {
            gsap.to(box, {
              scale: 1.02,
              y: -8,
              duration: 0.6,
              ease: 'power2.out',
            });
          });

          box.addEventListener('mouseleave', () => {
            gsap.to(box, {
              scale: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
            });
          });
        }
      });

      // Animate mission statement text
      gsap.fromTo(
        textRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderBox = (box: ServiceBox, index: number) => {
    // Responsive heights - first two boxes are taller
    const boxHeight =
      index < 2
        ? 'h-80 md:h-[500px] lg:h-[550px]'
        : 'h-72 md:h-96 lg:h-[400px]';

    return (
      <div
        key={box.id}
        ref={el => {
          boxesRef.current[index] = el;
        }}
        className={`${boxHeight} transform will-change-transform`}
      >
        <div
          className={`relative overflow-hidden rounded-3xl border border-gray-200/50 shadow-2xl h-full backdrop-blur-sm ${
            box.gradient ? `bg-gradient-to-br ${box.gradient}` : 'bg-white/5'
          }`}
        >
          {/* Background Image */}
          <div className="relative w-full h-full">
            <Image
              src={box.image}
              alt={box.imageAlt}
              fill
              style={
                box.imageOpacity ? { opacity: box.imageOpacity / 100 } : {}
              }
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0"></div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10 p-8">
            <div className="text-center">
              {/* Title with yellow gradient */}
              <h3 className="text-3xl md:text-4xl font-bold font-work-sans mb-4 md:mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
                {box.title}
              </h3>

              {/* Description */}
              <LightText className="text-white/90 text-lg md:text-xl leading-relaxed font-work-sans font-light drop-shadow-lg max-w-md">
                {box.description}
              </LightText>
            </div>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:translate-x-[100%]"></div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="what-we-do"
      ref={sectionRef}
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2
          ref={headingRef}
          className="text-4xl md:text-6xl font-bold text-center font-work-sans mb-16 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm"
        >
          What To Expect
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {whatWeDoData.map((box, index) => renderBox(box, index))}
        </div>

        <div ref={textRef} className="mt-16 md:mt-20 text-center">
          <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed font-work-sans text-lg md:text-xl font-light">
            {missionStatement}
          </p>
        </div>
      </div>
    </section>
  );
}
