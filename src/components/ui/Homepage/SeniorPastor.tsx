// components/sections/SeniorPastor.tsx
'use client';

import { Banner_2 } from '@/components/assets';
import Image from 'next/image';
import { LightText } from '@/components/text';
import { Button } from '../button';
import { useSeniorPastor } from '@/components/utils/hooks/useSeniorPastor';
import { seniorPastorData } from '@/lib/data';

interface SeniorPastorProps {
  className?: string;
}

export default function SeniorPastor({ className = '' }: SeniorPastorProps) {
  const { isVisible, sectionRef, handleLearnMore } = useSeniorPastor();

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen w-full flex items-center justify-center ${className}`}
    >
      {/* Main Background Image with Black Gradient */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={Banner_2}
          alt="Senior Pastor background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col items-center">
          {/* Header */}
          <div className="w-full text-center mb-8 md:mb-10 lg:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
              {seniorPastorData.title}
            </h1>
          </div>

          {/* Content Card - Clean without background image */}
          <div
            className={`w-full max-w-3xl lg:max-w-2xl xl:max-w-2xl transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/30 bg-black/60 backdrop-blur-sm">
              {/* Content */}
              <div className="relative z-10 p-6 sm:p-7 md:p-8 lg:p-10">
                {/* Text Content */}
                <div className="space-y-5 md:space-y-6 lg:space-y-6">
                  {seniorPastorData.description.map((paragraph, index) => (
                    <div key={index} className="text-center md:text-left">
                      <LightText className="text-white text-base sm:text-lg md:text-lg lg:text-lg leading-relaxed md:leading-loose">
                        {paragraph}
                      </LightText>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <div className="text-center mt-6 md:mt-7 lg:mt-8">
                  <Button
                    onClick={handleLearnMore}
                    variant="primary"
                    size="lg"
                    className="min-w-[180px] px-6 py-2.5 text-sm sm:text-base md:text-base"
                  >
                    {seniorPastorData.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
