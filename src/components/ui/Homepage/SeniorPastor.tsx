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
  const { isVisible, sectionRef, handleLearnMore } = useSeniorPastor();

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

      {/* Dark overlay - balanced for readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <Container size="xl" className="relative z-20 h-full">
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          className="h-full min-h-screen py-20 lg:py-24 px-4"
        >
          <div
            className={`w-full max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {/* Main Title */}
            <H1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight mb-6 lg:mb-8 drop-shadow-2xl"
              style={{ color: '#FFFFFF' }}
            >
              {seniorPastorData.title}
            </H1>

            {/* Description Paragraphs */}
            <div className="max-w-4xl mx-auto mb-8 lg:mb-12 text-left">
              {/* First paragraph */}
              <P
                className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-100 mb-6 opacity-95"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
              >
                {firstParagraph}
              </P>

              {/* Second paragraph */}
              <P
                className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-100 mb-6 opacity-95"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
              >
                {secondParagraph}
              </P>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleLearnMore}
                variant="primary"
                size="lg"
                curvature="full"
                elevated={true}
                className="px-10 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl lg:text-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, #F7DE12, #D4BC0F)`,
                  color: '#000000',
                }}
              >
                {seniorPastorData.buttonText}
              </Button>
            </div>
          </div>

          {/* Floating Pastor Portrait — Bottom Right */}
          <div className="hidden md:block absolute bottom-6 right-6 lg:bottom-8 lg:right-8 xl:bottom-10 xl:right-10 z-30">
            <div className="relative">
              {/* Glow effect - smaller */}
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl scale-105" />

              {/* Portrait - smaller */}
              <div className="relative w-32 h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full overflow-hidden ring-2 ring-white/80 shadow-lg">
                <Image
                  src={Bishop}
                  alt="Senior Pastor"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Smaller badge */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                Senior Pastor
              </div>
            </div>
          </div>
        </FlexboxLayout>
      </Container>
    </Section>
  );
}
