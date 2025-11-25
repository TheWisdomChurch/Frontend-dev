// app/ministries/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H1, H2, BodyLG, BodyMD, Caption } from '@/components/text';
import { Section, Container, GridboxLayout } from '@/components/layout';
import { hero_bg_3 } from '@/components/assets';
import HeroSection from '@/components/ui/Homepage/Herosection';

gsap.registerPlugin(ScrollTrigger);

const ministries = [
  {
    title: "Children's Ministry",
    subtitle: 'Nurturing Young Hearts in Faith',
    description:
      "Where kids discover God's love through fun, stories, and truth.",
    path: '/ministries/children',
  },
  {
    title: 'Youth Ministry',
    subtitle: 'Igniting the Next Generation',
    description:
      'A place for teens to belong, believe, and become who God made them to be.',
    path: '/ministries/youth',
  },
  {
    title: "Women's Ministry",
    subtitle: 'Growing Together in Grace',
    description: 'Women supporting women — in prayer, study, and sisterhood.',
    path: '/ministries/women',
  },
  {
    title: "Men's Ministry",
    subtitle: 'Iron Sharpens Iron',
    description:
      'Building godly men who lead, serve, and stand strong in faith.',
    path: '/ministries/men',
  },
  {
    title: 'Outreach Ministry',
    subtitle: 'Hands Extended, Hearts Transformed',
    description: "Taking God's love beyond walls — locally and globally.",
    path: '/ministries/outreach',
  },
];

export default function MinistryPage() {
  const { colorScheme } = useTheme();
  const isDarkMode = colorScheme.background === '#000000';
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection
        title="Our Ministries"
        subtitle="One Family. Many Expressions of Faith."
        description="Discover a place to belong, grow, serve, and become everything God has called you to be."
        backgroundImage={hero_bg_3.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Ministries Grid */}
      <Section
        padding="xl"
        className="relative overflow-hidden"
        style={{
          backgroundColor: isDarkMode
            ? '#000000'
            : colorScheme.backgroundSecondary,
        }}
      >
        <Container size="xl">
          <div className="text-center mb-12">
            {/* Main Header - Single line on mobile */}
            <H1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 whitespace-nowrap"
              style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
            >
              Find Your Place
            </H1>
            <BodyLG
              className="text-sm sm:text-base max-w-3xl mx-auto px-4 font-normal"
              style={{
                color: isDarkMode
                  ? colorScheme.textSecondary
                  : colorScheme.textTertiary,
              }}
            >
              Every ministry is designed to help you connect deeply with God and
              others — no matter your age or stage of life.
            </BodyLG>
          </div>

          {/* Single Responsive Grid */}
          <GridboxLayout
            columns={1}
            responsive={{ sm: 2, lg: 3 }}
            gap="md"
            className="relative z-10"
          >
            {ministries.map((ministry, i) => (
              <Link href={ministry.path} key={i} className="block group">
                <div
                  ref={el => {
                    cardRefs.current[i] = el;
                  }}
                  className="group relative h-full rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: isDarkMode
                      ? `linear-gradient(145deg, ${colorScheme.surface}ee, ${colorScheme.surfaceVariant}cc)`
                      : `linear-gradient(145deg, #ffffff, ${colorScheme.backgroundSecondary})`,
                    border: `1px solid ${isDarkMode ? colorScheme.border : '#E5E7EB'}`,
                    boxShadow: isDarkMode
                      ? '0 8px 25px rgba(0,0,0,0.4)'
                      : '0 4px 20px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Gradient hover overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-yellow-400/5 via-amber-500/3 to-transparent" />

                  {/* Floating glow orb - Smaller on mobile */}
                  <div
                    className="absolute top-4 right-4 w-12 h-12 lg:w-20 lg:h-20 rounded-full blur-lg lg:blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ backgroundColor: colorScheme.primary }}
                  />

                  <div className="relative p-4 sm:p-5 lg:p-6 h-full flex flex-col justify-between">
                    <div>
                      {/* Title - Smaller to prevent line breaks */}
                      <BodyMD
                        className="text-base sm:text-lg lg:text-xl font-semibold mb-2 leading-tight"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        {ministry.title}
                      </BodyMD>

                      {/* Subtitle - Much smaller to stay on one line */}
                      <BodyMD
                        className="text-xs sm:text-sm font-normal mb-2 lg:mb-3 opacity-80 leading-tight"
                        style={{ color: colorScheme.primary }}
                      >
                        {ministry.subtitle}
                      </BodyMD>

                      {/* Description - Compact on mobile */}
                      <Caption
                        className="text-xs leading-relaxed opacity-70 line-clamp-3"
                        style={{
                          color: isDarkMode
                            ? colorScheme.textSecondary
                            : colorScheme.textTertiary,
                        }}
                      >
                        {ministry.description}
                      </Caption>
                    </div>

                    {/* CTA - Smaller and more compact */}
                    <div className="mt-3 lg:mt-4 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-all duration-300">
                      <span
                        className="text-xs font-normal uppercase tracking-wide"
                        style={{ color: colorScheme.primary }}
                      >
                        Learn More
                      </span>
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                        <svg
                          className="w-2.5 h-2.5 lg:w-3 lg:h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: colorScheme.primary }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </GridboxLayout>

          {/* Closing Statement - Smaller on mobile */}
          <div className="mt-12 text-center">
            <div
              className="inline-block p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl shadow-lg"
              style={{
                background: colorScheme.primaryGradient,
                boxShadow: `0 0 40px ${colorScheme.primary}30`,
              }}
            >
              <H2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-2">
                There's a Place for You Here
              </H2>
              <BodyLG className="text-black/80 text-xs sm:text-sm lg:text-base max-w-2xl font-normal">
                No matter where you are in your faith journey — you belong at
                The Wisdom House.
              </BodyLG>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
