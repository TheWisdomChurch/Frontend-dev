'use client';

import { whatWeDoData, missionStatement } from '@/lib/data';
import { ServiceBox } from '@/lib/types';
import Image from 'next/image';
import { LightText } from '@/components/text';
import { useWhatWeDo } from '@/components/utils/hooks/useWhatwedo';

export default function WhatWeDo() {
  const { sectionRef, headingRef, textRef, addToBoxesRef } = useWhatWeDo();

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
          addToBoxesRef(el, index);
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
