'use client';

import Image from 'next/image';

import { whatWeDoData } from '@/lib/data';
import type { ServiceBox } from '@/lib/types';
import { H2, H3 } from '@/shared/text';
import { useWhatWeDo } from '@/shared/utils/hooks/useWhatwedo';
import { Section, Container } from '@/shared/layout';

export default function WhatWeDo() {
  const { sectionRef, headingRef, addToBoxesRef } = useWhatWeDo();

  const renderBox = (box: ServiceBox, index: number, featured = false) => {
    return (
      <article
        key={box.id}
        ref={el => addToBoxesRef(el as HTMLDivElement | null, index)}
        className={[
          'group relative flex h-full min-h-0 overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] transition duration-300 hover:border-white/18 hover:bg-[#101010]',
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
            className="object-cover [object-position:center_top] transition duration-700 ease-out group-hover:scale-105"
            // eslint-disable-next-line no-restricted-syntax
            style={{ opacity: box.imageOpacity ? box.imageOpacity / 100 : 1 }}
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
              <span className="h-px w-8 rounded-full bg-[var(--app-primary)]" />
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/45">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <H3
              className={[
                'text-white',
                featured ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl',
              ].join(' ')}
            >
              {box.title}
            </H3>
          </div>
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
      className="bg-[var(--app-dark-2)] py-16 sm:py-20 lg:py-24"
    >
      <Container size="xl" className="px-4 sm:px-6 lg:px-10">
        <div className="mb-10 lg:mb-12">
          <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
            What to expect
          </p>
          <H2
            ref={headingRef}
            className="max-w-xl text-left text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
            useThemeColor={false}
            weight="semibold"
          >
            A Sunday experience that feels personal
          </H2>
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
