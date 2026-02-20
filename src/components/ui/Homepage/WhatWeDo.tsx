'use client';

import { whatWeDoData, missionStatement } from '@/lib/data';
import { ServiceBox } from '@/lib/types';
import Image from 'next/image';
import { H2, BodySM } from '@/components/text';
import { useWhatWeDo } from '@/components/utils/hooks/useWhatwedo';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';

export default function WhatWeDo() {
  const { sectionRef, headingRef, textRef, addToBoxesRef } = useWhatWeDo();
  const { colorScheme } = useTheme();

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
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/55 to-black/70 z-10 group-hover:from-black/65 group-hover:via-black/45 group-hover:to-black/60 transition-all duration-500"></div>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end z-20 p-4 sm:p-6 lg:p-8">
          <div className="relative w-full pt-12 sm:pt-16 lg:pt-20 pb-2 sm:pb-3 lg:pb-4">
            {/* Title */}
            <h3
              className="font-semibold mb-2 sm:mb-3 drop-shadow-lg text-sm sm:text-[15px] lg:text-base"
              style={{
                color: colorScheme.primary,
                textShadow: '1px 1px 6px rgba(0,0,0,0.85)',
                lineHeight: 1.3
              }}
            >
              {box.title}
            </h3>

            {/* Description */}
            <BodySM
              className="text-white/90 leading-relaxed drop-shadow-lg max-w-2xl text-xs sm:text-[13px] lg:text-sm line-clamp-2 sm:line-clamp-3 lg:line-clamp-4"
              style={{
                textShadow: '1px 1px 5px rgba(0,0,0,0.85)',
                lineHeight: 1.6
              }}
              useThemeColor={false}
            >
              {box.description}
            </BodySM>
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
      <Container size="xl" className="relative z-10">
        {/* Header - Centered */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="md"
          className="text-center pt-6 sm:pt-8 lg:pt-10 pb-4 sm:pb-6"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-[0.18em]"
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
            className="leading-tight text-center text-xl sm:text-2xl lg:text-3xl font-semibold"
            style={{ color: '#FFFFFF' }}
            useThemeColor={false}
            weight="semibold"
          >
            Sundays that feel alive in every lane
          </H2>
        </FlexboxLayout>

        {/* Service Boxes - Responsive Grid */}
        <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 lg:p-5">
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
          className="text-center pt-2 sm:pt-4 pb-4 sm:pb-6"
        >
          <div className="w-full max-w-3xl mx-auto">
            <BodySM
              className="leading-relaxed font-normal text-left sm:text-center lg:text-left text-xs sm:text-sm lg:text-base text-white/70 px-4 sm:px-6"
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
