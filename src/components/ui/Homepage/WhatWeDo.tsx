'use client';

import { whatWeDoData, missionStatement } from '@/lib/data';
import { ServiceBox } from '@/lib/types';
import Image from 'next/image';
import { LightText, H2 } from '@/components/text';
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
        ref={el => {
          addToBoxesRef(el, index);
        }}
        className={`group relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl ${
          isLargeBox
            ? 'md:col-span-2 aspect-[4/3] md:aspect-[21/9]'
            : 'aspect-[4/3]'
        }`}
      >
        {/* Background Image Container */}
        <div className="relative w-full h-full">
          <Image
            src={box.image}
            alt={box.imageAlt}
            fill
            style={box.imageOpacity ? { opacity: box.imageOpacity / 100 } : {}}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={
              isLargeBox
                ? '(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 80vw'
                : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw'
            }
            priority={index < 2}
          />
        </div>

        {/* Lighter Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/40 z-0"></div>

        {/* Content Overlay - FIXED: Added top padding to push content down */}
        <div className="absolute inset-0 flex items-end z-10 p-6 sm:p-8 lg:p-10">
          <div className="text-left w-full pt-16 sm:pt-20 lg:pt-24 pb-4">
            {' '}
            {/* Added top and bottom padding */}
            {/* Title */}
            <h3
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-work-sans mb-3 sm:mb-4 text-white drop-shadow-lg"
              style={{
                color: colorScheme.primary,
              }}
            >
              {box.title}
            </h3>
            {/* Description */}
            <LightText className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-relaxed font-work-sans font-light drop-shadow-md max-w-2xl">
              {box.description}
            </LightText>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Section
      id="what-we-do"
      ref={sectionRef}
      padding="xl"
      fullHeight={false}
      style={{ backgroundColor: colorScheme.white }}
      className="relative overflow-hidden"
    >
      {/* Subtle background elements - Lighter and more subtle */}
      {/* <div
        className="absolute top-10 left-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-3"
        style={{ backgroundColor: colorScheme.primary }}
      ></div> */}
      {/* <div
        className="absolute bottom-10 right-10 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-3"
        style={{ backgroundColor: colorScheme.primaryLight }}
      ></div> */}

      <Container size="xl" className="relative z-10">
        {/* Header Section with More Spacing */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="xl"
          className="text-center pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 lg:pb-16" // Added responsive top and bottom padding
          padding="none"
        >
          <H2
            ref={headingRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-work-sans leading-tight"
            style={{
              color: colorScheme.background,
            }}
          >
            What To Expect
          </H2>

          {/* Optional Subtitle for Better Spacing */}
          {/* <div className="w-24 h-1 rounded-full opacity-20" 
       style={{ backgroundColor: colorScheme.primary }}>
  </div> */}
        </FlexboxLayout>

        {/* Grid Layout with More Spacing */}
        <GridboxLayout
          columns={1}
          gap="xl"
          responsive={{
            sm: 1,
            md: 2,
            lg: 2,
          }}
          className="w-full mb-16 lg:mb-20"
          padding="none"
        >
          {whatWeDoData.map((box, index) => renderBox(box, index))}
        </GridboxLayout>

        {/* Mission Statement with Better Spacing */}
        <FlexboxLayout
          ref={textRef}
          direction="column"
          justify="center"
          align="center"
          className="text-center pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-10 lg:pb-12" 
          padding="none"
        >
          <div className="max-w-4xl mx-auto">
            <LightText
              className="leading-relaxed sm:leading-loose font-work-sans text-base sm:text-lg md:text-xl lg:text-2xl font-light px-4 sm:px-6 lg:px-0"
              style={{ color: colorScheme.black }}
            >
              {missionStatement}
            </LightText>
          </div>
        </FlexboxLayout>
      </Container>
    </Section>
  );
}
