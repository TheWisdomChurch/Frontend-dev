'use client';

import Image from 'next/image';

import { whatWeDoData, missionStatement } from '@/lib/data';
import type { ServiceBox } from '@/lib/types';
import { H2, BodySM } from '@/shared/text';
import { useWhatWeDo } from '@/shared/utils/hooks/useWhatwedo';
import { Section, Container } from '@/shared/layout';

export default function WhatWeDo() {
  const { sectionRef, headingRef, textRef, addToBoxesRef } = useWhatWeDo();

  const renderBox = (box: ServiceBox, index: number, featured = false) => {
    return (
      <article
        key={box.id}
        ref={el => addToBoxesRef(el as HTMLDivElement | null, index)}
        className={[
          'group relative flex h-full min-h-0 overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0b0b0b] shadow-[0_18px_55px_rgba(0,0,0,0.32)] transition duration-500 hover:-translate-y-1 hover:border-white/18 hover:bg-[#101010] hover:shadow-[0_24px_75px_rgba(0,0,0,0.42)]',
          featured
            ? 'flex-col lg:min-h-[430px] lg:flex-row'
            : 'flex-col min-h-[420px]',
        ].join(' ')}
      >
        <div
          className={[
            'relative shrink-0 overflow-hidden bg-black',
            featured
              ? 'h-64 sm:h-72 lg:h-auto lg:w-[52%]'
              : 'h-56 sm:h-60 lg:h-64',
          ].join(' ')}
        >
          <Image
            src={box.image}
            alt={box.imageAlt}
            fill
            sizes={
              featured
                ? '(max-width: 1024px) 100vw, 52vw'
                : '(max-width: 768px) 100vw, 50vw'
            }
            quality={88}
            className="object-cover transition duration-700 ease-out group-hover:scale-105"
            style={{
              objectPosition: 'center top',
              opacity: box.imageOpacity ? box.imageOpacity / 100 : 1,
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/20" />
        </div>

        <div
          className={[
            'relative flex min-h-0 flex-1 flex-col justify-between p-5 sm:p-6',
            featured ? 'lg:p-8' : '',
          ].join(' ')}
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 rounded-full bg-[#f7de12]" />
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/45">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <h3
              className={[
                'font-semibold tracking-[-0.02em] text-white',
                featured
                  ? 'text-xl leading-tight sm:text-2xl'
                  : 'text-lg leading-snug sm:text-xl',
              ].join(' ')}
            >
              {box.title}
            </h3>

            <BodySM className="mt-3 max-w-2xl text-sm leading-7 text-white/68 sm:text-[0.95rem]">
              {box.description}
            </BodySM>
          </div>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-[#f7de12]/45 via-white/10 to-transparent" />
        </div>
      </article>
    );
  };

  return (
    <Section
      id="what-we-do"
      ref={sectionRef}
      padding="none"
      fullHeight={false}
      perf="none"
      className="relative overflow-hidden bg-[#070707] py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-[#f7de12]/[0.07] blur-3xl" />
        <div className="absolute right-[-8%] top-1/3 h-80 w-80 rounded-full bg-white/[0.045] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />
      </div>

      <Container size="xl" className="relative z-10 px-4 sm:px-6 lg:px-10">
        <div className="mb-8 grid gap-5 lg:mb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="min-w-0">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/60">
              What to expect
            </div>

            <H2
              ref={headingRef}
              className="max-w-2xl text-left text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.75rem]"
              useThemeColor={false}
              weight="semibold"
            >
              A Sunday experience that feels personal
            </H2>
          </div>

          <div
            ref={textRef}
            className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5"
          >
            <BodySM className="max-w-3xl text-sm leading-7 text-white/68 sm:text-base">
              {missionStatement}
            </BodySM>
          </div>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          {whatWeDoData.map((box, index) => {
            const featured = index === 0 || index === whatWeDoData.length - 1;

            return (
              <div
                key={box.id}
                className={featured ? 'lg:col-span-2' : 'min-h-0'}
              >
                {renderBox(box, index, featured)}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
