// app/ministries/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H2, BodyLG, BodyMD, Caption } from '@/components/text';
import { Section, Container, GridboxLayout } from '@/components/layout';
import { hero_bg_3 } from '@/components/assets';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { Ministries } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function MinistryPage() {
  const { colorScheme } = useTheme();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: card, start: 'top 85%' },
        }
      );
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <HeroSection
        title="Our Ministries"
        subtitle="One family. Many expressions of faith."
        description="Discover a place to belong, grow, serve, and become everything God has called you to be."
        backgroundImage={hero_bg_3.src}
        showButtons={false}
        showScrollIndicator={false}
      />

      <Section
        padding="lg"
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #060606 0%, #0b0b0b 60%, #060606 100%)',
        }}
      >
        <Container size="xl">
          <div className="text-center mb-8">
            <H2 className="text-3xl sm:text-4xl font-bold mb-3">
              Find Your Place
            </H2>
            <BodyLG className="text-white/70 max-w-3xl mx-auto px-4 font-normal">
              Every ministry is designed to help you connect deeply with God and others — no matter your age or stage of life.
            </BodyLG>
          </div>

          <GridboxLayout columns={1} responsive={{ sm: 2, lg: 3 }} gap="md" className="relative z-10">
            {Ministries.map((ministry, i) => (
              <Link href={ministry.path} key={i} className="block group">
                <div
                  ref={el => {
                    cardRefs.current[i] = el;
                  }}
                  className="group relative h-full rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-yellow-400/5 via-amber-500/3 to-transparent" />
                  <div className="relative p-4 sm:p-5 lg:p-6 h-full flex flex-col justify-between">
                    <div>
                      <BodyMD className="text-base sm:text-lg lg:text-xl font-semibold mb-2 leading-tight">
                        {ministry.title}
                      </BodyMD>
                      <BodyMD className="text-xs sm:text-sm font-normal mb-2 lg:mb-3 opacity-80 leading-tight" style={{ color: colorScheme.primary }}>
                        {ministry.subtitle}
                      </BodyMD>
                      <Caption className="text-xs leading-relaxed opacity-70 line-clamp-3 text-white/70">
                        {ministry.description}
                      </Caption>
                    </div>
                    <div className="mt-3 lg:mt-4 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-xs font-normal uppercase tracking-wide" style={{ color: colorScheme.primary }}>
                        Learn More
                      </span>
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                        <ChevronRight size={14} className="lg:w-3 lg:h-3" style={{ color: colorScheme.primary }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </GridboxLayout>

          <div className="mt-10 text-center">
            <div
              className="inline-block p-5 sm:p-6 lg:p-7 rounded-xl lg:rounded-2xl shadow-lg bg-white text-black"
              style={{ boxShadow: `0 0 30px ${colorScheme.primary}30` }}
            >
              <H2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
                There's a Place for You Here
              </H2>
              <BodyLG className="text-black/80 text-sm sm:text-base max-w-2xl font-normal">
                No matter where you are in your faith journey — you belong at The Wisdom House.
              </BodyLG>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
