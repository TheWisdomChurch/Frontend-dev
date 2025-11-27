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

export default function WhatWeDo() {
  const { sectionRef, headingRef, textRef, addToBoxesRef } = useWhatWeDo();
  const { colorScheme } = useTheme();

  // Detect dark mode
  const isDarkMode = colorScheme.pageBackground === '#000000';

  // Heading & Mission text color: yellow in dark, black in light
  const accentTextColor = isDarkMode ? colorScheme.primary : '#000000';

  const renderBox = (box: ServiceBox, index: number) => {
    const isLargeBox = index < 2;

    return (
      <div
        key={box.id}
        ref={el => addToBoxesRef(el, index)}
        className={`group relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl ${
          isLargeBox
            ? 'md:col-span-2 aspect-[4/3] md:aspect-[21/9]'
            : 'aspect-[4/3]'
        }`}
      >
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

        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/50 z-10"></div>

        <div className="absolute inset-0 flex items-end z-20 p-6 sm:p-8 lg:p-10">
          <div className="text-left w-full pt-16 sm:pt-20 lg:pt-24 pb-4">
            <h3
              className="font-bold mb-3 sm:mb-4 drop-shadow-2xl"
              style={{
                color: colorScheme.primary,
                textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              {box.title}
            </h3>

            <BodyMD
              className="text-white/95 leading-relaxed drop-shadow-lg max-w-2xl"
              style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.9)' }}
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
      padding="xl"
      fullHeight={false}
      style={{ backgroundColor: '#FFFFFF' }}
      className="relative overflow-hidden"
    >
      <Container size="xl" className="relative z-10">
        {/* Header */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="xl"
          className="text-center pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 lg:pb-16"
        >
          <H2
            ref={headingRef}
            className="leading-tight"
            style={{ color: accentTextColor }}
            useThemeColor={false}
            weight="bold"
            smWeight="extrabold"
          >
            What To Expect
          </H2>
        </FlexboxLayout>

        {/* Service Boxes */}
        <GridboxLayout
          columns={1}
          gap="xl"
          responsive={{ sm: 1, md: 2, lg: 2 }}
          className="w-full mb-16 lg:mb-20"
        >
          {whatWeDoData.map((box, index) => renderBox(box, index))}
        </GridboxLayout>

        {/* Mission Statement - Fixed Structure */}
        <FlexboxLayout
          ref={textRef}
          direction="column"
          justify="center"
          align="center"
          className="text-center pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-10 lg:pb-12"
        >
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <BodySM
              className="text-xs sm:text-sm md:text-base leading-relaxed font-normal text-left"
              style={{ color: accentTextColor }}
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
