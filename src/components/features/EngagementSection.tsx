'use client';

import React from 'react';
import {
  CheckCircle2,
  Users2,
  Heart,
  Zap,
  MessageSquare,
  Volume2,
} from 'lucide-react';
import { Container, Section } from '@/components/layout';
import { H2, H3, BodyMD, BodySM, Caption } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';

/**
 * IMPROVED ENGAGEMENT SECTION
 * Highlights key features and CTAs for user engagement
 * Uses design system colors, spacing, and typography
 */
export default function EngagementSection() {
  const { colorScheme } = useTheme();

  const primary = colorScheme?.primary ?? '#f7de12';
  const features = [
    {
      icon: Volume2,
      title: 'Inspiring Messages',
      description:
        'Powerful teachings that transform lives and strengthen faith',
      color: primary,
      cta: 'Listen Now',
      action: () => (window.location.href = '/resources/sermons'),
    },
    {
      icon: Users2,
      title: 'Community',
      description:
        'Join our vibrant family of believers across online and in-person',
      color: primary,
      cta: 'Join Us',
      action: () => (window.location.href = '#join'),
    },
    {
      icon: Heart,
      title: 'Service Opportunities',
      description: 'Discover ways to use your gifts and make a real impact',
      color: primary,
      cta: 'Serve with Us',
      action: () =>
        document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      icon: Zap,
      title: 'Spiritual Growth',
      description:
        'Resources, events, and mentorship to deepen your faith journey',
      color: primary,
      cta: 'Explore Resources',
      action: () => (window.location.href = '/resources'),
    },
  ];

  return (
    <Section
      padding="lg"
      className="py-12 sm:py-16 md:py-20"
      style={{ background: '#0a0a0a' }}
    >
      <Container size="xl" className="space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Caption
            className="uppercase tracking-[0.2em] text-xs font-semibold"
            style={{ color: primary }}
          >
            Why Choose Us
          </Caption>
          <H2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Experience the Power of Faith
          </H2>
          <BodyMD className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
            Whether you're seeking spiritual growth, community connection, or
            ways to serve others, we've got something meaningful for you.
          </BodyMD>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:from-white/8 hover:to-white/[0.05]"
              >
                {/* Accent border on hover */}
                <div
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${primary}20 0%, transparent 100%)`,
                  }}
                />

                <div className="relative space-y-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${primary}15`,
                      borderColor: `${primary}30`,
                      borderWidth: '1px',
                    }}
                  >
                    <IconComponent
                      className="w-6 h-6"
                      style={{ color: primary }}
                    />
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-2">
                    <H3 className="text-xl font-bold text-white">
                      {feature.title}
                    </H3>
                    <BodySM className="text-white/60 leading-relaxed">
                      {feature.description}
                    </BodySM>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={feature.action}
                    className="inline-flex items-center gap-2 font-semibold text-sm py-2 px-0 transition-all duration-300 group/cta"
                    style={{ color: primary }}
                  >
                    {feature.cta}
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button
            onClick={() => (window.location.href = '/about')}
            className="px-8 py-4 rounded-xl font-semibold text-black transition-all duration-300 hover:scale-105 shadow-lg"
            style={{
              background: primary,
            }}
          >
            Learn More About Us
          </button>
          <button
            onClick={() => (window.location.href = '#join')}
            className="px-8 py-4 rounded-xl font-semibold border-2 text-white transition-all duration-300 hover:bg-white/10"
            style={{ borderColor: primary }}
          >
            Get Involved
          </button>
        </div>
      </Container>
    </Section>
  );
}
