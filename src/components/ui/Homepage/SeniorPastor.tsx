'use client';

import { Banner_2 } from '@/components/assets';
import Image from 'next/image';
import { LightText } from '@/components/text';
import Button from '../../utils/CustomButton';
import { useSeniorPastor } from '@/components/utils/hooks/useSeniorPastor';

export default function SeniorPastor() {
  const { isVisible, sectionRef, handleLearnMore } = useSeniorPastor();

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center"
    >
      {/* Main Background Image with Black Gradient */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={Banner_2}
          alt="Senior Pastor background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col items-center">
          {/* Header */}
          <div className="w-full text-center mb-8 md:mb-10 lg:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
              Meet Our Senior Pastor
            </h1>
          </div>

          {/* Content Card - Clean without background image */}
          <div
            className={`w-full max-w-3xl lg:max-w-2xl xl:max-w-2xl transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/30 bg-black/60 backdrop-blur-sm">
              {/* Content */}
              <div className="relative z-10 p-6 sm:p-7 md:p-8 lg:p-10">
                {/* Text Content */}
                <div className="space-y-5 md:space-y-6 lg:space-y-6">
                  <div className="text-center md:text-left">
                    <LightText className="text-white text-base sm:text-lg md:text-lg lg:text-lg leading-relaxed md:leading-loose">
                      Our dear esteemed Pastor Bishop Gabriel Ayilara, is the
                      Senior Pastor of the Wisdom House Church. Over the years,
                      he has faithfully discipled and mentored countless
                      individuals, demonstrating the practical workings of God's
                      Word in everyday life. He is lawfully wedded to Pastor
                      Kenny Ayilara, and together they are blessed with godly
                      children. Through their exemplary marriage and ministry,
                      they continue to inspire, equip, and impact lives for the
                      Kingdom of God.
                    </LightText>
                  </div>

                  <div className="text-center md:text-left">
                    <LightText className="text-white text-base sm:text-lg md:text-lg lg:text-lg leading-relaxed md:leading-loose">
                      His vision for The Wisdom Church is to create a place
                      where everyone can encounter God's transformative love and
                      discover their unique purpose. Through powerful preaching,
                      genuine relationships, and Spirit-led worship, Our Senior
                      Pastor guides our church family toward a deeper
                      relationship with Christ.
                    </LightText>
                  </div>
                </div>

                {/* Button */}
                <div className="text-center mt-6 md:mt-7 lg:mt-8">
                  <Button
                    onClick={handleLearnMore}
                    variant="primary"
                    size="lg"
                    className="min-w-[180px] px-6 py-2.5 text-sm sm:text-base md:text-base"
                  >
                    Learn More About Our Pastor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
