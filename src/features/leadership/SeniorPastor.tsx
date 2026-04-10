'use client';

import { useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { Bishop } from '@/shared/assets';
import { H1, P } from '@/shared/text';
import Button from '@/shared/utils/buttons/CustomButton';
import { useSeniorPastor } from '@/shared/utils/hooks/useSeniorPastor';
import {
  Container,
  Section,
  PageSection,
  FlexboxLayout,
  Gridbox,
} from '@/shared/layout';
import { cn } from '@/lib/cn';
import { gsap } from 'gsap';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { seniorPastorData } from '@/lib/data';

interface SeniorPastorProps {
  className?: string;
}

export default function SeniorPastor({ className = '' }: SeniorPastorProps) {
  const { colorScheme } = useTheme();
  const router = useRouter();

  const { sectionRef, isVisible } = useSeniorPastor();
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const summary = useMemo(() => {
    return (
      seniorPastorData?.description?.[0]?.replace(/\s+/g, ' ').trim() ||
      'Bishop Gabriel Ayilara leads The Wisdom House Church with practical teaching, prayer, and a heart for raising strong believers and families.'
    );
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
      }

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.1,
          }
        );
      }
    });

    return () => ctx.revert();
  }, [isVisible]);

  const goToLeadership = () => router.push('/leadership');

  const primary = colorScheme.primary || '#fbbf24';

  return (
    <Section
      ref={sectionRef}
      padding="none"
      className={cn(
        'relative w-full overflow-hidden bg-[#070707] text-white',
        'min-h-[380px] md:min-h-[440px]',
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_45%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85" />

      <Container size="xl" className="relative z-10 py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div ref={imageRef} className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[240px] sm:max-w-[300px] lg:max-w-[360px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
              <Image
                src={Bishop}
                alt="Bishop Gabriel Ayilara"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                className="object-cover"
                style={{ objectPosition: 'center 20%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            </div>
          </div>

          <div ref={textRef} className="space-y-6">
            <P className="text-[0.62rem] uppercase tracking-[0.2em] text-white/60">
              Senior Pastor
            </P>
            <div className="space-y-1.5">
              <H1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-tight">
                Bishop Gabriel Ayilara
              </H1>
              <P className="text-sm sm:text-base text-white/70">
                The Wisdom House Church
              </P>
            </div>
            <div className="h-px w-16" style={{ background: primary }} />
            <P className="text-sm sm:text-base text-white/70 leading-relaxed">
              {summary}
            </P>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={goToLeadership}
                variant="primary"
                size="sm"
                curvature="full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="px-5 py-2.5 text-[0.78rem] sm:text-sm font-semibold shadow-lg"
                style={{ backgroundColor: primary, color: '#0b0b0b' }}
              >
                View leadership
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    'https://www.instagram.com/gabrielayilara',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
                variant="outline"
                size="sm"
                curvature="full"
                leftIcon={<Instagram className="w-4 h-4" />}
                className="px-5 py-2.5 text-[0.78rem] sm:text-sm font-semibold"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                Instagram
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
