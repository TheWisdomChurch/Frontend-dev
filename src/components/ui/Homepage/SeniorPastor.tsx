'use client';

import { useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { Bishop } from '@/components/assets';
import { H1, P } from '@/components/text';
import Button from '@/components/utils/buttons/CustomButton';
import { useSeniorPastor } from '@/components/utils/hooks/useSeniorPastor';
import { Section, Container, FlexboxLayout } from '@/components/layout';
import { cn } from '@/lib/cn';
import { gsap } from 'gsap';
import { useTheme } from '@/components/contexts/ThemeContext';
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
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
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
        'relative w-full overflow-hidden bg-slate-950 text-white',
        'min-h-[420px] md:min-h-[480px]',
        className
      )}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.86), rgba(0,0,0,0.92)), url(${Bishop.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/85" />

      <Container size="xl" className="relative z-10 py-6 md:py-8">
        <FlexboxLayout direction="column" justify="center" align="center" className="w-full h-full">
          <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-center w-full">
            {/* Text column */}
            <div ref={textRef} className="space-y-2.5 md:space-y-4 order-2 md:order-1">
              <P className="text-[11px] md:text-xs uppercase tracking-[0.18em] text-white/70">
                Meet our Senior Pastor
              </P>

              <div className="space-y-2">
                <H1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-tight">
                  Bishop Gabriel Ayilara
                </H1>
                <P className="text-sm md:text-base text-white/80">
                  Senior Pastor, The Wisdom House Church
                </P>
              </div>

              <div className="h-1 w-20 rounded-full" style={{ background: primary }} />

              <div className="space-y-3">
                <P className="text-sm md:text-base text-white/75 max-w-3xl leading-relaxed">
                  {summary}
                </P>

                {/* Social buttons (Senior Pastor only) */}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <Button
                    onClick={() =>
                      window.open(
                        'https://www.instagram.com/gabrielayilara',
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                    variant="primary"
                    size="xs"
                    curvature="full"
                    leftIcon={<Instagram className="w-4 h-4" />}
                    className="px-5 py-2 text-[13px] font-semibold shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #E4405F, #C13584)',
                      color: '#fff',
                    }}
                  >
                    Instagram
                  </Button>

                  <Button
                    onClick={() => window.open('https://facebook.com', '_blank', 'noopener,noreferrer')}
                    variant="outline"
                    size="xs"
                    curvature="full"
                    leftIcon={<Facebook className="w-4 h-4" />}
                    className="px-4 py-2 text-[13px] font-semibold"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    Facebook
                  </Button>

                  <Button
                    onClick={() => window.open('https://twitter.com', '_blank', 'noopener,noreferrer')}
                    variant="outline"
                    size="xs"
                    curvature="full"
                    leftIcon={<Twitter className="w-4 h-4" />}
                    className="px-4 py-2 text-[13px] font-semibold"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    X (Twitter)
                  </Button>
                </div>
              </div>

            </div>

            {/* Portrait column */}
            <div ref={imageRef} className="flex justify-center md:justify-end order-1 md:order-2">
              <div className="relative w-full max-w-[200px] sm:max-w-[230px] md:max-w-[300px] aspect-[3/4] rounded-full md:rounded-3xl overflow-hidden border border-white/12 shadow-2xl">
                <Image
                  src={Bishop}
                  alt="Bishop Gabriel Ayilara"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                  className="object-cover"
                  style={{ objectPosition: 'center 20%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                {/* Hide badge on mobile for cleaner circle */}
                <div className="hidden md:flex absolute bottom-4 left-4 right-4 items-center justify-between text-sm font-semibold text-white">
                  <span className="text-white/90">Bishop Gabriel Ayilara</span>
                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md"
                    style={{
                      background: colorScheme.opacity?.primary20 ?? 'rgba(255,255,255,0.14)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    Senior Pastor
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Leadership section at the bottom */}
          <div className="mt-8 md:mt-10 w-full">
            <div className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-5 md:p-6">
              <P className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/60">
                Leadership
              </P>
              <H1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight mt-2">
                Guided with vision, prayer, and care.
              </H1>
              <P className="text-sm md:text-base text-white/75 max-w-3xl leading-relaxed mt-3">
                Our leaders are devoted to building a Spirit‑filled community rooted in
                the Word, integrity, and compassionate service.
              </P>
              <div className="pt-4">
                <Button
                  onClick={goToLeadership}
                  variant="primary"
                  size="xs"
                  curvature="full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto px-5 py-2 text-[13px] font-semibold shadow-lg"
                  style={{ backgroundColor: primary, color: '#0b0b0b' }}
                >
                  View leadership
                </Button>
              </div>
            </div>
          </div>
        </FlexboxLayout>
      </Container>
    </Section>
  );
}
