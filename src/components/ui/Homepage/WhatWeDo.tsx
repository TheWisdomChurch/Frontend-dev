'use client';

import { whatWeDoData, missionStatement } from '@/lib/data';
import { ServiceBox } from '@/lib/types';
import Image from 'next/image';
import { H2, BodyMD, BodySM } from '@/components/text';
import { useWhatWeDo } from '@/components/utils/hooks/useWhatwedo';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import  { responsive,getHeroResponsiveValue } from '@/lib/responsivee';
import { useEffect, useState } from 'react';

// Viewport hook for responsive design
const useViewport = () => {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewport('mobile');
      } else if (width < 1200) {
        setViewport('tablet');
      } else {
        setViewport('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

export default function WhatWeDo() {
  const { sectionRef, headingRef, textRef, addToBoxesRef } = useWhatWeDo();
  const { colorScheme } = useTheme();
  const viewport = useViewport();

  // Detect dark mode
  const isDarkMode = colorScheme.pageBackground === '#000000';

  // Heading & Mission text color: yellow in dark, black in light
  const accentTextColor = isDarkMode ? colorScheme.primary : '#000000';

  // Get responsive values
  const headingSizes = getHeroResponsiveValue('title') as Record<string, string>;
  const bodySizes = getHeroResponsiveValue('description') as Record<string, string>;
  const containerSizes = getHeroResponsiveValue('container') as Record<string, string>;

  const renderBox = (box: ServiceBox, index: number) => {
    const isLargeBox = index < 2;

    return (
      <div
        key={box.id}
        ref={el => addToBoxesRef(el, index)}
        className={`group relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg transition-all duration-700 hover:shadow-2xl hover:scale-[1.015] ${
          isLargeBox
            ? 'md:col-span-2 aspect-[4/3] md:aspect-[21/9]'
            : 'aspect-[5/4]'
        }`}
      >
        {/* Image Container with fixed aspect ratio */}
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-0 z-0 parallax-layer">
            <Image
              src={box.image}
              alt={box.imageAlt}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center top',
                ...(box.imageOpacity ? { opacity: box.imageOpacity / 100 } : {}),
              }}
              className="transition-transform duration-700 ease-out group-hover:scale-110 md:group-hover:-translate-y-1"
              sizes={
                isLargeBox
                  ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw'
                  : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              }
              quality={90}
            />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60 z-10 group-hover:from-black/60 group-hover:via-black/40 group-hover:to-black/50 transition-all duration-500"></div>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end z-20 p-4 sm:p-6 lg:p-8">
          <div className="relative w-full pt-12 sm:pt-16 lg:pt-20 pb-2 sm:pb-3 lg:pb-4">
            {/* Title */}
            <h3
              className="font-bold mb-2 sm:mb-3 lg:mb-4 drop-shadow-lg"
              style={{
                color: colorScheme.primary,
                textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
                fontSize: viewport === 'mobile' ? '1.25rem' : 
                          viewport === 'tablet' ? '1.5rem' : '1.75rem',
                lineHeight: 1.2
              }}
            >
              {box.title}
            </h3>

            {/* Description */}
            <BodyMD
              className="text-white/95 leading-relaxed drop-shadow-lg max-w-2xl"
              style={{
                textShadow: '1px 1px 6px rgba(0,0,0,0.9)',
                fontSize: viewport === 'mobile' ? '0.875rem' : 
                          viewport === 'tablet' ? '1rem' : '1.125rem',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: viewport === 'mobile' ? 2 : 
                                viewport === 'tablet' ? 3 : 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
              useThemeColor={false}
            >
              {box.description}
            </BodyMD>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Section
      id="what-we-do"
      ref={sectionRef}
      padding="lg"
      fullHeight={false}
      style={{
        background: '#0b0b0b',
      }}
      className="relative overflow-hidden"
    >
      <Container 
        size="xl" 
        className="relative z-10"
        style={{
          paddingLeft: containerSizes.base,
          paddingRight: containerSizes.base
        }}
      >
        {/* Header - Centered */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="md"
          className="text-center pt-8 sm:pt-10 lg:pt-12 pb-4 sm:pb-6 lg:pb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.18em]"
            style={{
              color: '#fff',
              background: colorScheme.primary,
              boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
            }}
          >
            What to expect
          </div>
          <H2
            ref={headingRef}
            className="leading-tight text-center"
            style={{ 
              color: '#FFFFFF',
              fontSize: headingSizes[viewport === 'mobile' ? 'sm' : 
                                   viewport === 'tablet' ? 'md' : 'lg']
            }}
            useThemeColor={false}
            weight="bold"
            smWeight="extrabold"
          >
            Sundays that feel alive in every lane
          </H2>
        </FlexboxLayout>

        {/* Service Boxes - Responsive Grid */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-2xl bg-white/60 blur-3xl opacity-50 pointer-events-none" />
          <GridboxLayout
            columns={1}
            gap="xl"
            responsive={{ 
              sm: 1, 
              md: 2, 
              lg: 2 
            }}
            className="w-full mb-8 sm:mb-12 lg:mb-14 relative z-10"
          >
            {whatWeDoData.map((box, index) => renderBox(box, index))}
          </GridboxLayout>
        </div>

        {/* Mission Statement - Responsive Text */}
        <FlexboxLayout
          ref={textRef}
          direction="column"
          justify="center"
          align="center"
          className="text-center pt-2 sm:pt-4 lg:pt-6 pb-4 sm:pb-6 lg:pb-8"
        >
          <div className="w-full max-w-3xl mx-auto">
            <BodySM
              className="leading-relaxed font-normal text-left"
              style={{ 
                color: '#e5e7eb',
                fontSize: bodySizes[viewport === 'mobile' ? 'base' : 
                                   viewport === 'tablet' ? 'sm' : 'md'],
                padding: `0 ${viewport === 'mobile' ? '1rem' : 
                         viewport === 'tablet' ? '1.5rem' : '2rem'}`
              }}
              useThemeColor={false}
            >
              {missionStatement}
            </BodySM>
          </div>
        </FlexboxLayout>
      </Container>
    </Section>
  );
}
