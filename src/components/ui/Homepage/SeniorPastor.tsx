// components/sections/SeniorPastor.tsx
'use client';

import { Banner_2 } from '@/components/assets';
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
      background="image"
      customBackground={`url(${Banner_2.src})`}
      backgroundImage={Banner_2.src}
      overlay={true}
      overlayOpacity={70}
      padding="lg"
      fullHeight={false}
      className={`py-8 sm:py-12 md:py-16 lg:py-20 ${className}`}
    >
      <Container size="xl" className="relative z-10">
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="lg"
          className="min-h-[70vh] sm:min-h-[80vh] md:min-h-screen"
        >
          {/* Header */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="w-full mb-6 sm:mb-8 md:mb-10 lg:mb-12"
          >
            <H1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-center px-4"
              style={{ color: 'white' }}
            >
              {seniorPastorData.title}
            </H1>
          </FlexboxLayout>

          {/* Content Card */}
          <div
            className={`w-full max-w-3xl lg:max-w-2xl xl:max-w-2xl transition-all duration-1000 px-4 sm:px-6 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/30 bg-black/60 backdrop-blur-sm mx-auto">
              {/* Content */}
              <div className="relative z-10 p-6 sm:p-7 md:p-8 lg:p-10">
                {/* Text Content */}
                <FlexboxLayout direction="column" gap="md" className="w-full">
                  {seniorPastorData.description.map((paragraph, index) => (
                    <div key={index} className="text-center md:text-left">
                      <LightText className="text-white text-sm sm:text-base md:text-lg lg:text-lg leading-relaxed md:leading-loose">
                        {paragraph}
                      </LightText>
                    </div>
                  ))}
                </FlexboxLayout>

                {/* Button */}
                <FlexboxLayout
                  justify="center"
                  className="mt-6 md:mt-7 lg:mt-8"
                >
                  <Button
                    onClick={handleLearnMore}
                    variant="primary"
                    size="lg"
                    curvature="full"
                    elevated={true}
                    className="min-w-[160px] sm:min-w-[180px] px-4 sm:px-6 py-2.5 text-sm sm:text-base md:text-base transition-all duration-300 transform hover:scale-105"
                  >
                    {seniorPastorData.buttonText}
                  </Button>
                </FlexboxLayout>
              </div>
            </div>
          </div>
        </FlexboxLayout>
      </Container>
    </Section>
  );
}
