'use client';

import { Bishop } from '@/components/assets';
import { H1, LightText } from '@/components/text';
import Button from '@/components/utils/CustomButton';
import { useSeniorPastor } from '@/components/utils/hooks/useSeniorPastor';
import { seniorPastorData } from '@/lib/data';
import { Section, Container, FlexboxLayout } from '@/components/layout';

interface SeniorPastorProps {
  className?: string;
}

export default function SeniorPastor({ className = '' }: SeniorPastorProps) {
  const { isVisible, sectionRef, handleLearnMore } = useSeniorPastor();

  return (
    <Section
      ref={sectionRef}
      className={`
        relative min-h-screen w-full overflow-hidden
        bg-cover bg-center bg-no-repeat lg:bg-none
        ${className}
      `}
      style={{
        backgroundImage: `url(${Bishop.src})`,
      }}
    >
      {/* Black Linear Gradient Overlay - Hidden on large screens */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 pointer-events-none lg:hidden" />

      {/* White background for large screens */}
      <div className="hidden lg:block absolute inset-0 bg-white pointer-events-none" />

      <Container
        size="xl"
        className="relative z-10 h-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8"
      >
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="xl"
          className="w-full text-center"
        >
          {/* Title - Full width with proper spacing */}
          <div className="w-full max-w-6xl">
            <H1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white lg:text-gray-900 drop-shadow-2xl mb-4">
              {seniorPastorData.title}
            </H1>
          </div>

          {/* Content Card - Full width container */}
          <div
            className={`
              w-full max-w-6xl transition-all duration-1000
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/30 lg:border-gray-200 bg-black/90 lg:bg-white backdrop-blur-lg relative min-h-[400px] flex items-center">
              {/* Content - Centered and properly spaced */}
              <div className="relative z-10 w-full p-8 sm:p-12 lg:p-16">
                <FlexboxLayout direction="column" gap="lg" className="w-full">
                  {/* Paragraphs - Left aligned */}
                  <FlexboxLayout
                    direction="column"
                    gap="md"
                    className="w-full max-w-4xl mx-auto"
                  >
                    {seniorPastorData.description.slice(0, 2).map((p, i) => (
                      <LightText
                        key={i}
                        className="text-white lg:text-gray-700 text-lg sm:text-xl md:text-2xl leading-relaxed font-light text-left"
                      >
                        {p}
                      </LightText>
                    ))}
                  </FlexboxLayout>

                  {/* Button - Properly centered */}
                  <div className="mt-10 flex justify-center">
                    <Button
                      onClick={handleLearnMore}
                      variant="primary"
                      size="xl"
                      curvature="full"
                      elevated={true}
                      className="min-w-[200px] px-8 py-4 text-lg sm:text-xl font-semibold hover:scale-105 transition-transform duration-300"
                    >
                      {seniorPastorData.buttonText}
                    </Button>
                  </div>
                </FlexboxLayout>
              </div>
            </div>
          </div>
        </FlexboxLayout>
      </Container>
    </Section>
  );
}
