'use client';

import React from 'react';
import {
  CheckCircle2,
  Users2,
  Heart,
  Zap,
  MessageSquare,
  Volume2,
  ArrowRight,
} from 'lucide-react';
import { Container, Section } from '@/shared/layout';

/**
 * ENGAGEMENT SECTION - Call to Action
 * Highlights key features and benefits with engaging design
 * Uses CSS variables from design system
 */
export default function EngagementSection() {
  const features = [
    {
      icon: Volume2,
      title: 'Inspiring Messages',
      description:
        'Powerful teachings that transform lives and strengthen faith',
      cta: 'Listen Now',
      action: '/resources/sermons',
    },
    {
      icon: Users2,
      title: 'Vibrant Community',
      description:
        'Join a family of believers across online and in-person gatherings',
      cta: 'Join Us',
      action: '/contact',
    },
    {
      icon: Heart,
      title: 'Service Opportunities',
      description: 'Discover ways to use your gifts and make a real impact',
      cta: 'Get Involved',
      action: '/ministries',
    },
    {
      icon: Zap,
      title: 'Spiritual Growth',
      description:
        'Resources, events, and mentorship to deepen your faith journey',
      cta: 'Explore',
      action: '/resources',
    },
  ];

  return (
    <Section
      padding="lg"
      className="py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      <Container size="xl" className="space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <p
            className="text-sm uppercase tracking-widest font-semibold"
            style={{ color: 'var(--color-gold)' }}
          >
            Why Join Us
          </p>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              color: 'var(--color-text-primary)',
            }}
          >
            Experience the Power of Faith & Community
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Whether you're seeking spiritual growth, meaningful connections, or
            ways to serve, we have something special for you here.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <a
                key={idx}
                href={feature.action}
                className="group relative overflow-hidden rounded-2xl p-8 sm:p-10 transition-all duration-300 hover:border-opacity-100 hover:shadow-lg cursor-pointer"
                style={{
                  backgroundColor: 'rgba(215, 187, 117, 0.08)',
                  border: '1px solid var(--color-border-light)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = 'rgba(215, 187, 117, 0.12)';
                  el.style.borderColor = 'var(--color-gold)';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = 'rgba(215, 187, 117, 0.08)';
                  el.style.borderColor = 'var(--color-border-light)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                {/* Icon */}
                <div className="mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(215, 187, 117, 0.15)',
                    }}
                  >
                    <IconComponent
                      className="h-6 w-6"
                      style={{ color: 'var(--color-gold)' }}
                    />
                  </div>
                </div>

                {/* Content */}
                <h3
                  className="text-xl sm:text-2xl font-semibold mb-3 leading-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm sm:text-base leading-relaxed mb-6"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {feature.description}
                </p>

                {/* CTA */}
                <div
                  className="inline-flex items-center gap-2 font-semibold text-sm sm:text-base transition-all group-hover:gap-3"
                  style={{ color: 'var(--color-gold)' }}
                >
                  {feature.cta}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className="rounded-2xl p-10 sm:p-12 lg:p-14 text-center"
          style={{
            backgroundColor: 'rgba(215, 187, 117, 0.1)',
            border: '1px solid var(--color-border-default)',
          }}
        >
          <h3
            className="text-2xl sm:text-3xl font-serif mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Ready to Find Your Place?
          </h3>
          <p
            className="max-w-2xl mx-auto text-base sm:text-lg mb-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Connect with us today and become part of a vibrant community
            committed to spiritual growth and transformation.
          </p>
          <a
            href="/contact"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            Plan Your Visit
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </Container>
    </Section>
  );
}
