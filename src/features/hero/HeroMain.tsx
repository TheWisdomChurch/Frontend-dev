'use client';

import Link from 'next/link';
import { CalendarClock, MapPin, PlayCircle, ArrowRight } from 'lucide-react';

import { Section, Container } from '@/shared/layout';

interface HeroMainProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
}

export default function HeroMain({
  primaryButtonText = 'Plan Your Visit',
  secondaryButtonText = 'Watch Messages',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
}: HeroMainProps) {
  return (
    <Section
      padding="none"
      className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32"
      style={{ backgroundColor: 'var(--color-bg-deep)' }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 -z-30">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/placeholder.jpg"
        >
          <source src="/videos/videoBg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlays */}
      <div
        className="absolute inset-0 -z-20"
        style={{ backgroundColor: 'rgba(5, 5, 5, 0.65)' }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at top, rgba(215, 187, 117, 0.25), transparent 50%)',
        }}
      />

      <Container size="xl" className="pb-16 sm:pb-20 lg:pb-24">
        <div className="grid items-end gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p
                className="text-sm uppercase tracking-widest font-semibold"
                style={{ color: 'var(--color-gold)' }}
              >
                Welcome Home
              </p>
              <h1
                className="font-serif leading-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Experience God's Transforming Power
              </h1>
            </div>

            <p
              className="max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Join a vibrant, Spirit-filled community where worship is powerful,
              teaching is biblical, and lives are transformed. We're committed
              to raising leaders, strengthening faith, and serving the nations
              with wisdom and love.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={onPrimaryButtonClick}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                {primaryButtonText}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onSecondaryButtonClick}
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                {secondaryButtonText}
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div
              className="rounded-2xl p-6 transition-all duration-300 hover:border-opacity-100"
              style={{
                backgroundColor: 'rgba(215, 187, 117, 0.08)',
                border: '1px solid var(--color-border-light)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor =
                  'rgba(215, 187, 117, 0.12)';
                e.currentTarget.style.borderColor = 'var(--color-gold)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor =
                  'rgba(215, 187, 117, 0.08)';
                e.currentTarget.style.borderColor = 'var(--color-border-light)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-center gap-3">
                <CalendarClock
                  className="h-5 w-5"
                  style={{ color: 'var(--color-gold)' }}
                />
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Sunday Worship
                  </p>
                  <p
                    className="text-sm font-semibold mt-1"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    9:00 AM
                  </p>
                </div>
              </div>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Spirit-filled worship, prayer, and biblical teaching.
              </p>
            </div>

            <div
              className="rounded-2xl p-6 transition-all duration-300 hover:border-opacity-100"
              style={{
                backgroundColor: 'rgba(215, 187, 117, 0.08)',
                border: '1px solid var(--color-border-light)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor =
                  'rgba(215, 187, 117, 0.12)';
                e.currentTarget.style.borderColor = 'var(--color-gold)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor =
                  'rgba(215, 187, 117, 0.08)';
                e.currentTarget.style.borderColor = 'var(--color-border-light)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-center gap-3">
                <CalendarClock
                  className="h-5 w-5"
                  style={{ color: 'var(--color-gold)' }}
                />
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Midweek Service
                  </p>
                  <p
                    className="text-sm font-semibold mt-1"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Thursday, 6:00 PM
                  </p>
                </div>
              </div>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Refreshing word, worship, and focused prayer.
              </p>
            </div>

            <div
              className="rounded-2xl p-6 transition-all duration-300 hover:border-opacity-100 sm:col-span-2"
              style={{
                backgroundColor: 'rgba(215, 187, 117, 0.08)',
                border: '1px solid var(--color-border-light)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor =
                  'rgba(215, 187, 117, 0.12)';
                e.currentTarget.style.borderColor = 'var(--color-gold)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor =
                  'rgba(215, 187, 117, 0.08)';
                e.currentTarget.style.borderColor = 'var(--color-border-light)';
              }}
            >
              <div className="flex items-center gap-3">
                <MapPin
                  className="h-5 w-5"
                  style={{ color: 'var(--color-gold)', flexShrink: 0 }}
                />
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Find us in Lagos
                </p>
              </div>
              <p
                className="mt-3 font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Honor Gardens, opposite Dominion City, Alasia, Lekki-Epe
                Expressway
              </p>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Easy access from the Lekki-Epe corridor with dedicated parking
                and welcome teams on-site.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
