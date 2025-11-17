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
      padding="none"
      fullHeight={true}
      className={`
        relative w-full overflow-hidden
        ${className}
      `}
    >
      {/* Background Image - Show on mobile ONLY */}
      <div
        className="
          absolute inset-0 
          bg-cover bg-center bg-no-repeat 
          lg:hidden /* Hide on desktop */
          z-0
        "
        style={{
          backgroundImage: `url(${Bishop.src})`,
        }}
      />

      {/* Black Linear Gradient Overlay - Mobile only */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 pointer-events-none lg:hidden z-1" />

      {/* Background Image for Desktop - Full opacity */}
      <div
        className="
          hidden lg:block absolute inset-0 
          bg-cover bg-center bg-no-repeat 
          z-0
        "
        style={{
          backgroundImage: `url(${Bishop.src})`,
        }}
      />

      {/* Dark Overlay for Desktop - To tone down the background */}
      <div className="hidden lg:block absolute inset-0 bg-black/30 pointer-events-none z-1" />

      <Container size="xl" padding="none" className="relative z-10 h-full">
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="lg"
          className="w-full h-full min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8"
          fullHeight={true}
        >
          {/* Title */}
          <div className="w-full max-w-6xl mb-4 sm:mb-6 lg:mb-8">
            <H1
              className="
              text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
              font-bold 
              leading-tight sm:leading-tight md:leading-tight lg:leading-tight
              text-white /* Keep white text on both mobile and desktop */
              drop-shadow-lg
              px-2
            "
            >
              {seniorPastorData.title}
            </H1>
          </div>

          {/* Content Card */}
          <div
            className={`
              w-full max-w-4xl lg:max-w-6xl transition-all duration-1000
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
          >
            <div
              className="
              rounded-xl md:rounded-2xl lg:rounded-3xl 
              overflow-hidden 
              shadow-2xl 
              border border-white/20 
              bg-black/80 /* Keep dark background on both */
              backdrop-blur-sm
              min-h-[280px] sm:min-h-[320px] lg:min-h-[380px] 
              flex items-center
            "
            >
              {/* Content */}
              <div className="relative z-10 w-full p-4 sm:p-6 md:p-8 lg:p-12">
                <FlexboxLayout
                  direction="column"
                  gap="md"
                  className="w-full"
                  padding="none"
                >
                  {/* Paragraphs */}
                  <FlexboxLayout
                    direction="column"
                    gap="sm"
                    className="w-full max-w-3xl lg:max-w-4xl mx-auto"
                    padding="none"
                  >
                    {seniorPastorData.description.slice(0, 2).map((p, i) => (
                      <LightText
                        key={i}
                        className="
                          text-white /* Keep white text on both */
                          text-sm sm:text-base md:text-lg lg:text-xl
                          leading-relaxed sm:leading-relaxed md:leading-relaxed
                          font-light 
                          text-left
                        "
                      >
                        {p}
                      </LightText>
                    ))}
                  </FlexboxLayout>

                  {/* Button */}
                  <div className="mt-4 sm:mt-6 lg:mt-8 flex justify-center">
                    <Button
                      onClick={handleLearnMore}
                      variant="primary"
                      size="lg"
                      curvature="full"
                      elevated={true}
                      className="
                        w-full max-w-[260px] 
                        sm:max-w-[280px]
                        lg:max-w-[300px]
                        min-w-[140px] 
                        sm:min-w-[160px] 
                        lg:min-w-[180px]
                        px-4 sm:px-6 lg:px-8
                        py-3 sm:py-3.5 lg:py-4
                        text-sm sm:text-base lg:text-lg
                        font-semibold
                        hover:scale-105 
                        transition-all 
                        duration-300
                        whitespace-nowrap
                      "
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
