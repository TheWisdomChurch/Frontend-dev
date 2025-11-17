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
        className={`group relative overflow-hidden rounded-2xl shadow-lg ${
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
            className="object-cover"
            sizes={
              isLargeBox
                ? '(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 80vw'
                : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw'
            }
            priority={index < 2}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60 z-0"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end z-10 p-6 md:p-8">
          <div className="text-left w-full">
            {/* Title */}
            <h3
              className="text-2xl md:text-4xl font-bold font-work-sans mb-3 md:mb-4 text-white drop-shadow-lg"
              style={{
                color: colorScheme.primary,
              }}
            >
              {box.title}
            </h3>

            {/* Description */}
            <LightText className="text-white/90 text-base md:text-lg leading-relaxed font-work-sans font-light drop-shadow-md max-w-2xl">
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
      padding="lg"
      fullHeight={false}
      style={{ backgroundColor: colorScheme.background }}
      className="relative overflow-hidden py-16 lg:py-20"
    >
      {/* Subtle background elements */}
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
        style={{ backgroundColor: colorScheme.primary }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
        style={{ backgroundColor: colorScheme.primaryLight }}
      ></div>

      <Container size="xl" className="relative z-10">
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="lg"
          className="text-center mb-12 lg:mb-16"
        >
          <H2
            ref={headingRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-work-sans"
            style={{
              color: colorScheme.text,
            }}
          >
            What To Expect
          </H2>
        </FlexboxLayout>

        {/* Grid Layout */}
        <GridboxLayout
          columns={1}
          gap="lg"
          responsive={{
            sm: 1,
            md: 2,
            lg: 2,
          }}
          className="w-full"
        >
          {whatWeDoData.map((box, index) => renderBox(box, index))}
        </GridboxLayout>

        <FlexboxLayout
          ref={textRef}
          justify="center"
          align="center"
          className="mt-12 lg:mt-16 text-center"
        >
          <LightText
            className="max-w-4xl mx-auto leading-relaxed font-work-sans text-lg md:text-xl font-light"
            style={{ color: colorScheme.textSecondary }}
          >
            {missionStatement}
          </LightText>
        </FlexboxLayout>
      </Container>
    </Section>
  );
}
