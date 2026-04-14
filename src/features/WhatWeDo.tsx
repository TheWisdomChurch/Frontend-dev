'use client';

import { whatWeDoData, missionStatement } from '@/lib/data';
import { ServiceBox } from '@/lib/types';
import Image from 'next/image';
import { H2, BodySM } from '@/shared/text';
import { useWhatWeDo } from '@/shared/utils/hooks/useWhatwedo';
import { Section, Container } from '@/shared/layout';

export default function WhatWeDo() {
  const { sectionRef, headingRef, textRef, addToBoxesRef } = useWhatWeDo();

  const renderBox = (box: ServiceBox, index: number) => {
    return (
      <div
        key={box.id}
        ref={el => addToBoxesRef(el, index)}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.45)]"
      >
        <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/85" />
        </div>

        <div className="relative z-10 px-5 pb-6 pt-5 sm:px-6">
          <div className="mb-2 h-1 w-10 rounded-full bg-primary/70" />
          <h3 className="text-base sm:text-lg font-semibold text-white">
            {box.title}
          </h3>
          <BodySM className="mt-3 text-sm leading-relaxed text-white/70">
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
      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_12%_20%,rgba(255,255,255,0.07),transparent_45%),radial-gradient(circle_at_88%_10%,rgba(255,255,255,0.05),transparent_40%)]" />
      <Container size="xl" className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end pb-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-white/70">
              What to expect
            </div>
            <H2
              ref={headingRef}
              className="leading-tight text-left text-2xl sm:text-3xl lg:text-4xl font-semibold text-white"
              useThemeColor={false}
              weight="semibold"
            >
              A Sunday experience that feels personal
            </H2>
          </div>
          <div ref={textRef}>
            <BodySM className="leading-relaxed text-sm sm:text-base text-white/70">
              {missionStatement}
            </BodySM>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6 pb-2">
          {whatWeDoData.map((box, index) => renderBox(box, index))}
        </div>
      </Container>
    </Section>
  );
}
