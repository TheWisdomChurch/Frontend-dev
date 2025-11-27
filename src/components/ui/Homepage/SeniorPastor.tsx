'use client';

import Image from 'next/image';
import { Bishop } from '@/components/assets';
import { H1, P } from '@/components/text';
import Button from '@/components/utils/CustomButton';
import { useSeniorPastor } from '@/components/utils/hooks/useSeniorPastor';
import { seniorPastorData } from '@/lib/data';
import { Section, Container, FlexboxLayout } from '@/components/layout';

interface SeniorPastorProps {
  className?: string;
}

export default function SeniorPastor({ className = '' }: SeniorPastorProps) {
  const { isVisible, sectionRef } = useSeniorPastor();

  // Split the description into exactly two paragraphs
  const descriptionText = seniorPastorData.description[0];
  const sentences = descriptionText
    .split('. ')
    .filter(sentence => sentence.trim() !== '');

  // Create two balanced paragraphs
  const midPoint = Math.ceil(sentences.length / 2);
  const firstParagraph = sentences.slice(0, midPoint).join('. ') + '.';
  const secondParagraph = sentences.slice(midPoint).join('. ');

  return (
    <Section
      ref={sectionRef}
      padding="none"
      fullHeight={true}
      className={`relative w-full overflow-hidden ${className}`}
    >
      {/* Background Image - Full bleed, optimized */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${Bishop.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Enhanced dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* Content Container with Semi-transparent Background */}
      <Container size="xl" className="relative z-20 h-full">
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          className="h-full min-h-screen py-12 lg:py-16 px-4"
        >
          {/* Content Box with Dark Background */}
          <div
            className={`w-full max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="bg-black/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-xl">
              {/* Main Title - Smaller */}
              <H1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-3 lg:mb-4 text-center"
                style={{ color: '#FFFFFF' }}
              >
                {seniorPastorData.title}
              </H1>

              {/* Description Paragraphs - Smaller */}
              <div className="max-w-2xl mx-auto mb-4 lg:mb-6">
                {/* First paragraph */}
                <P
                  className="text-sm sm:text-base leading-relaxed text-gray-100 mb-3 opacity-95 text-justify"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
                >
                  {firstParagraph}
                </P>

                {/* Second paragraph */}
                <P
                  className="text-sm sm:text-base leading-relaxed text-gray-100 mb-3 opacity-95 text-justify"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
                >
                  {secondParagraph}
                </P>
              </div>

              {/* CTA Button - Smaller */}
              <div className="flex justify-center">
                <Button
                  onClick={() =>
                    window.open(seniorPastorData.instagramUrl, '_blank')
                  }
                  variant="primary"
                  size="sm"
                  curvature="full"
                  elevated={true}
                  className="px-6 sm:px-8 py-3 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, #F7DE12, #D4BC0F)`,
                    color: '#000000',
                  }}
                >
                  {seniorPastorData.buttonText}
                </Button>
              </div>
            </div>
          </div>
        </FlexboxLayout>
      </Container>

      {/* Floating Pastor Portrait — Smaller and More Responsive */}
      <div className="hidden md:block absolute bottom-4 right-4 lg:bottom-6 lg:right-6 xl:bottom-8 xl:right-8 z-30">
        <div className="relative">
          {/* Glow effect - smaller */}
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl scale-105" />

          {/* Portrait - smaller */}
          <div className="relative w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full overflow-hidden ring-1 ring-white/60 shadow-md">
            <Image
              src={Bishop}
              alt="Senior Pastor"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Smaller badge */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
            Senior Pastor
          </div>
        </div>
      </div>
    </Section>
  );
}
