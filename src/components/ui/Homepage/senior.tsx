'use client';

import React from 'react';
import { H1, LightText } from '@/components/text';
import Button from '@/components/utils/CustomButton';
import { useSeniorPastor } from '@/components/utils/hooks/useSeniorPastor';
import { seniorPastorData } from '@/lib/data';

const Senior = () => {
  const { isVisible, sectionRef, handleLearnMore } = useSeniorPastor();

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-4xl text-center flex flex-col items-center justify-center gap-8">
          {/* Title */}
          <H1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            {seniorPastorData.title}
          </H1>

          {/* Content Card */}
          <div
            className={`
              w-full transition-all duration-1000 mt-8
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700 bg-black p-6 sm:p-8 lg:p-10">
              {/* Paragraphs */}
              <div className="flex flex-col gap-6">
                {seniorPastorData.description.slice(0, 2).map((p, i) => (
                  <LightText
                    key={i}
                    className="text-white text-base sm:text-lg md:text-xl leading-relaxed font-light"
                  >
                    {p}
                  </LightText>
                ))}
              </div>

              {/* Button */}
              <div className="mt-8">
                <Button
                  onClick={handleLearnMore}
                  variant="primary"
                  size="lg"
                  curvature="full"
                  elevated={true}
                  className="min-w-[160px] px-6 py-3 text-base sm:text-lg font-semibold hover:scale-105 transition-transform"
                >
                  {seniorPastorData.buttonText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Senior;