'use client';

import { useEffect, useRef, useState } from 'react';
import { Banner_2 } from '@/components/assets';
import Image from 'next/image';
import { LightText } from '@/components/text';
import Button from '../../utils/CustomButton';
// Adjust import path as needed

export default function SeniorPastor() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen md:min-h-[800px] lg:min-h-[900px]"
    >
      {/* Background Image - Responsive height */}
      <div className="absolute inset-0 h-[110%] -top-[5%] md:h-[115%] md:-top-[7.5%] lg:h-[120%] lg:-top-[10%]">
        <div className="relative w-full h-full">
          <Image
            src={Banner_2}
            alt="Senior Pastor background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-purple-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center py-16 md:py-20 lg:py-32">
        <div
          className={`w-full max-w-4xl transition-all duration-1000 ${
            isVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-10 scale-95'
          }`}
        >
          {/* H1 Header - Centered and responsive */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 md:mb-12 lg:mb-16 text-center">
            Meet Our Senior Pastor
          </h1>

          {/* Content box - Responsive sizing */}
          <div className="relative rounded-2xl md:rounded-3xl border border-white/30 overflow-hidden shadow-xl md:shadow-2xl mx-auto">
            {/* Background - Responsive extension */}
            <div className="absolute inset-0 h-[110%] -top-[5%] md:h-[115%] md:-top-[7.5%] lg:h-[120%] lg:-top-[10%]">
              <div className="relative w-full h-full">
                <Image
                  src={Banner_2}
                  alt="Content background"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 95vw, (max-width: 1024px) 80vw, 70vw"
                />
              </div>
              {/* Identical gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-purple-900/60" />
              {/* Overlay for text contrast */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
            </div>

            {/* Content - Responsive padding and spacing */}
            <div className="relative z-10 p-6 md:p-10 lg:p-12 xl:p-16">
              <div className="space-y-6 md:space-y-8 lg:space-y-10">
                <LightText className="text-white text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed md:leading-relaxed font-light text-center md:text-left">
                  Our dear esteemed Pastor Bishop Gabriel Ayilara, is the Senior
                  Pastor of the Wisdom House Church. Over the years, he has
                  faithfully discipled and mentored countless individuals,
                  demonstrating the practical workings of God's Word in everyday
                  life. He is lawfully wedded to Pastor Kenny Ayilara, and
                  together they are blessed with godly children. Through their
                  exemplary marriage and ministry, they continue to inspire,
                  equip, and impact lives for the Kingdom of God.
                </LightText>
                <LightText className="text-white text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed md:leading-relaxed font-light text-center md:text-left">
                  His vision for The Wisdom Church is to create a place where
                  everyone can encounter God's transformative love and discover
                  their unique purpose. Through powerful preaching, genuine
                  relationships, and Spirit-led worship, Our Senior Pastor
                  guides our church family toward a deeper relationship with
                  Christ.
                </LightText>
              </div>

              {/* Centered Custom Button - Responsive */}
              <div className="text-center mt-8 md:mt-12 lg:mt-16">
                <Button
                  onClick={() => console.log('Learn more clicked')}
                  className="text-sm md:text-base lg:text-lg px-6 md:px-10 lg:px-14 py-3 md:py-4"
                >
                  Learn More About Our Pastor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
