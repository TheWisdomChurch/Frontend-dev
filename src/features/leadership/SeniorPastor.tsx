'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Bishop } from '@/shared/assets';
import { Section, Container } from '@/shared/layout';
import { seniorPastorData } from '@/lib/data';

export default function SeniorPastor() {
  const description =
    seniorPastorData?.description?.[0] ||
    'Bishop Gabriel Ayilara leads The Wisdom Church with powerful teaching, fervent prayer, and a heart for raising strong believers and transforming families.';

  const vision =
    seniorPastorData?.vision ||
    "To build a generation of believers empowered by God's word and committed to spiritual excellence.";

  return (
    <Section
      padding="lg"
      className="py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div
              className="rounded-2xl overflow-hidden aspect-[3/4]"
              style={{
                border: '1px solid var(--color-border-light)',
              }}
            >
              <Image
                src={Bishop}
                alt="Bishop Gabriel Ayilara | Senior Pastor"
                fill
                className="object-cover"
                quality={90}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Decorative Element */}
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-lg opacity-30"
              style={{
                backgroundColor: 'var(--color-gold)',
              }}
            />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-7">
            <div>
              <p
                className="text-sm uppercase tracking-widest font-semibold mb-3"
                style={{ color: 'var(--color-gold)' }}
              >
                Our Leadership
              </p>
              <h2
                className="font-serif leading-tight"
                style={{
                  fontSize: 'clamp(2rem, 6vw, 3rem)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Bishop Gabriel Ayilara
              </h2>
              <p
                className="mt-3 text-sm uppercase tracking-wider font-semibold"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Senior Pastor & Visionary
              </p>
            </div>

            {/* Description */}
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {description}
            </p>

            {/* Vision */}
            <div
              className="rounded-xl p-6 sm:p-7"
              style={{
                backgroundColor: 'rgba(215, 187, 117, 0.08)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <p
                className="text-xs uppercase tracking-widest font-semibold mb-3"
                style={{ color: 'var(--color-gold)' }}
              >
                His Vision
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-primary)' }}
              >
                "{vision}"
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/leadership"
              className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Meet Our Leadership Team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
