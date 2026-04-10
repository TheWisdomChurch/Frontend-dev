'use client';

import Image from 'next/image';
import { whatWeDoData, missionStatement } from '@/lib/data';
import { ServiceBox } from '@/lib/types';
import { Section, Container } from '@/shared/layout';

export default function WhatWeDo() {
  const renderBox = (box: ServiceBox, index: number) => {
    return (
      <div
        key={box.id}
        className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-lg"
        style={{
          backgroundColor: 'rgba(215, 187, 117, 0.06)',
          border: '1px solid var(--color-border-light)',
        }}
      >
        {/* Image Section */}
        <div className="relative h-52 sm:h-56 lg:h-64 overflow-hidden">
          <Image
            src={box.image}
            alt={box.imageAlt}
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
              opacity: box.imageOpacity ? box.imageOpacity / 100 : 0.8,
            }}
            className="transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={80}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(5,5,5,0.2), rgba(5,5,5,0.6), rgba(5,5,5,0.9))',
            }}
          />
        </div>

        {/* Content Section */}
        <div className="relative z-10 px-6 pb-6 pt-6 sm:px-7">
          <h3
            className="text-lg sm:text-xl font-semibold leading-tight mb-3"
            style={{ color: 'var(--color-gold)' }}
          >
            {box.title}
          </h3>
          <p
            className="text-sm sm:text-base leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {box.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Section
      id="what-we-do"
      padding="lg"
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      <Container size="xl" className="relative z-10">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end pb-12 sm:pb-16">
          <div className="space-y-5">
            <p
              className="text-sm uppercase tracking-widest font-semibold"
              style={{ color: 'var(--color-gold)' }}
            >
              What to Expect
            </p>
            <h2
              className="font-serif leading-tight"
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 3.25rem)',
                color: 'var(--color-text-primary)',
              }}
            >
              Sundays That Transform Lives
            </h2>
          </div>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {missionStatement}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {whatWeDoData.map((box, index) => renderBox(box, index))}
        </div>
      </Container>
    </Section>
  );
}
