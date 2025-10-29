/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Workforce_bg,
  Dept_1,
  Dept_2,
  Dept_3,
  Dept_4,
  Whatwedo_2,
} from '@/components/assets';
import { BaseText, LightText } from '@/components/text';
import Button from '@/components/utils/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';

export default function JoinWisdomHouse() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { colorScheme } = useTheme();

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

  const photos = [
    {
      title: 'Media Department',
      image: Dept_3,
      link: '#',
    },
    {
      title: 'ServicePreparatory Unit',
      image: Dept_2,
      link: '#',
    },
    {
      title: 'Music(WaveCityMusic)',
      image: Dept_1,
      link: '#',
    },
    {
      title: 'Prayer/Intercessory Unit',
      image: Whatwedo_2,
      link: '#',
    },
    {
      title: 'Protocol/Ushering Department',
      image: Dept_4,
      link: '#',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${Workforce_bg.src})`,
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-2 font-bold leading-tight">
            Join Our{' '}
            <BaseText
              weight="regular"
              fontFamily="playfair"
              style={{
                fontStyle: 'italic',
                color: colorScheme.primary,
                display: 'inline',
                fontSize: 'inherit', // ✅ keeps same size as h2
                lineHeight: 'inherit',
              }}
            >
              Workforce
            </BaseText>
          </h2>

          <LightText
            className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg 
  lg:text-xl xl:text-2xl
  text-center leading-relaxed text-gray-300"
            style={{ color: colorScheme.textSecondary }}
          >
            "Each of you should use whatever gift you have received to serve
            others, as faithful stewards of God's grace in its various forms." –
            1 Peter 4:10
          </LightText>
        </div>

        {/* Mobile Layout - Simple Row */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto pb-4 space-x-4 snap-x snap-mandatory">
            {photos.map((photo, index) => (
              <div
                key={photo.title}
                className={`flex-shrink-0 w-64 snap-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className="group relative w-64 h-72 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    borderColor: `${colorScheme.primary}66`,
                    borderWidth: '2px',
                  }}
                >
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Smooth door-like overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/95 via-black/70 to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
                    {/* Top door slide-in */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1/2 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100"
                      style={{
                        background: `linear-gradient(to bottom, ${colorScheme.primary}20, transparent)`,
                      }}
                    ></div>

                    {/* Bottom door slide-in */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1/2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100"
                      style={{
                        background: `linear-gradient(to top, ${colorScheme.primary}20, transparent)`,
                      }}
                    ></div>

                    {/* Content that appears in the middle */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out delay-200">
                      <BaseText
                        className="text-white font-bold mb-4 px-4 text-center transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-300"
                        style={{
                          fontSize: '1.125rem',
                          lineHeight: '1.75rem',
                          color: colorScheme.white,
                        }}
                      >
                        {photo.title}
                      </BaseText>
                      <Button
                        variant="primary"
                        size="md"
                        curvature="full"
                        className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out delay-400"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                        }}
                        onMouseEnter={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.heading;
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.primary;
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout - X-shape */}
        <div className="hidden md:flex flex-col items-center justify-center min-h-[550px]">
          <div className="flex justify-between w-full max-w-4xl mb-12">
            {photos.slice(0, 2).map((photo, index) => (
              <div
                key={photo.title}
                className={`group relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className="w-64 h-72 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    borderColor: `${colorScheme.primary}66`,
                    borderWidth: '2px',
                  }}
                >
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Smooth door-like overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/95 via-black/70 to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
                    {/* Top door slide-in */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1/2 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100"
                      style={{
                        background: `linear-gradient(to bottom, ${colorScheme.primary}20, transparent)`,
                      }}
                    ></div>

                    {/* Bottom door slide-in */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1/2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100"
                      style={{
                        background: `linear-gradient(to top, ${colorScheme.primary}20, transparent)`,
                      }}
                    ></div>

                    {/* Content that appears in the middle */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out delay-200">
                      <BaseText
                        className="text-white font-bold mb-4 px-4 text-center transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-300"
                        style={{
                          fontSize: '1.125rem',
                          lineHeight: '1.75rem',
                          color: colorScheme.white,
                        }}
                      >
                        {photo.title}
                      </BaseText>
                      <Button
                        variant="primary"
                        size="md"
                        curvature="full"
                        className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out delay-400"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                        }}
                        onMouseEnter={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.heading;
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.primary;
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center my-8">
            {photos.slice(2, 3).map((photo, index) => (
              <div
                key={photo.title}
                className={`group relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${(index + 2) * 100}ms` }}
              >
                <div
                  className="w-64 h-72 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    borderColor: colorScheme.primary,
                    borderWidth: '2px',
                  }}
                >
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Smooth door-like overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/95 via-black/70 to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
                    {/* Top door slide-in */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1/2 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100"
                      style={{
                        background: `linear-gradient(to bottom, ${colorScheme.primary}20, transparent)`,
                      }}
                    ></div>

                    {/* Bottom door slide-in */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1/2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100"
                      style={{
                        background: `linear-gradient(to top, ${colorScheme.primary}20, transparent)`,
                      }}
                    ></div>

                    {/* Content that appears in the middle */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out delay-200">
                      <BaseText
                        className="text-white font-bold mb-4 px-4 text-center transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-300"
                        style={{
                          fontSize: '1.125rem',
                          lineHeight: '1.75rem',
                          color: colorScheme.white,
                        }}
                      >
                        {photo.title}
                      </BaseText>
                      <Button
                        variant="primary"
                        size="md"
                        curvature="full"
                        className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out delay-400"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                        }}
                        onMouseEnter={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.heading;
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.primary;
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between w-full max-w-4xl mt-12">
            {photos.slice(3, 5).map((photo, index) => (
              <div
                key={photo.title}
                className={`group relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div
                  className="w-64 h-72 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    borderColor: `${colorScheme.primary}66`,
                    borderWidth: '2px',
                  }}
                >
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Smooth door-like overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/95 via-black/70 to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
                    {/* Top door slide-in */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1/2 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100"
                      style={{
                        background: `linear-gradient(to bottom, ${colorScheme.primary}20, transparent)`,
                      }}
                    ></div>

                    {/* Bottom door slide-in */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1/2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100"
                      style={{
                        background: `linear-gradient(to top, ${colorScheme.primary}20, transparent)`,
                      }}
                    ></div>

                    {/* Content that appears in the middle */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out delay-200">
                      <BaseText
                        className="text-white font-bold mb-4 px-4 text-center transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-300"
                        style={{
                          fontSize: '1.125rem',
                          lineHeight: '1.75rem',
                          color: colorScheme.white,
                        }}
                      >
                        {photo.title}
                      </BaseText>
                      <Button
                        variant="primary"
                        size="md"
                        curvature="full"
                        className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out delay-400"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.black,
                        }}
                        onMouseEnter={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.heading;
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            colorScheme.primary;
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
