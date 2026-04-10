'use client';

import { whatWeDoData, missionStatement } from '@/lib/data';
import { ServiceBox } from '@/lib/types';
import Image from 'next/image';
import { H2, BodySM } from '@/shared/text';
import { useWhatWeDo } from '@/shared/utils/hooks/useWhatwedo';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { Section, Container } from '@/shared/layout';

export default function WhatWeDo() {
  const { sectionRef, headingRef, textRef, addToBoxesRef } = useWhatWeDo();
  const { colorScheme } = useTheme();

  const renderBox = (box: ServiceBox, index: number) => {
    return (
      <div
        key={box.id}
        ref={el => addToBoxesRef(el, index)}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_22px_60px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="relative h-52 sm:h-60 lg:h-64 overflow-hidden">
          <Image
            src={box.image}
            alt={box.imageAlt}
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
              ...(box.imageOpacity ? { opacity: box.imageOpacity / 100 } : {}),
            }}
            className="transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/80" />
        </div>

        <div className="relative z-10 px-5 pb-6 pt-5 sm:px-6">
          <h3
            className="text-base sm:text-lg font-semibold"
            style={{ color: colorScheme.primary }}
          >
            {box.title}
          </h3>
          <BodySM
            className="mt-3 text-sm sm:text-base leading-relaxed text-white/70"
            useThemeColor={false}
          >
            {box.description}
          </BodySM>
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
      style={{ background: '#080808' }}
      className="relative overflow-hidden"
    >
      <Container size="xl" className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end pb-4">
          <div className="space-y-5">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-white/70"
              style={{ color: '#fff' }}
            >
              What to expect
            </div>
            <H2
              ref={headingRef}
              className="leading-tight text-left text-2xl sm:text-3xl lg:text-4xl font-semibold"
              style={{ color: '#FFFFFF' }}
              useThemeColor={false}
              weight="semibold"
            >
              Sundays that feel alive in every lane
            </H2>
          </div>
          <div ref={textRef}>
            <BodySM
              className="leading-relaxed text-sm sm:text-base text-white/70"
              useThemeColor={false}
            >
              {missionStatement}
            </BodySM>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-2">
          {whatWeDoData.map((box, index) => renderBox(box, index))}
        </div>
      </Container>
    </Section>
  );
}
