// components/ui/Homepage/Testimonials.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Section, Container } from '@/components/layout';
import { Caption, H3, BodySM, SmallText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { testimonialsData } from '@/lib/data';
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const fallbackImage = '/images/avatar-placeholder.jpg';

export default function Testimonials() {
  const { colorScheme } = useTheme();
  const [active, setActive] = useState(0);

  const items = useMemo(() => testimonialsData.slice(0, 6), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % items.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[active];
  const nextList = items
    .map((item, idx) => ({ ...item, idx }))
    .filter(i => i.idx !== active);

  return (
    <Section
      id="stories"
      padding="xl"
      className="relative overflow-hidden"
      style={{
        background: '#0b0b0b',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 15% 30%, rgba(255,255,255,0.08) 0%, transparent 45%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%), radial-gradient(circle at 60% 85%, rgba(255,255,255,0.06) 0%, transparent 45%)',
          filter: 'blur(70px)',
        }}
        data-parallax-global="0.2"
      />
      <Container size="xl" className="relative z-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2.5">
            <Caption className="uppercase tracking-[0.2em] text-xs" style={{ color: colorScheme.primary }}>
              Stories of transformation
            </Caption>
            <H3 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              God is moving in our house
            </H3>
            <BodySM className="text-white/75 max-w-2xl">
              Real moments of healing, provision, and restoration from the Wisdom House community.
            </BodySM>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActive(prev => (prev - 1 + items.length) % items.length)}
              className="p-2 rounded-full border border-white/15 hover:border-white/40 transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setActive(prev => (prev + 1) % items.length)}
              className="p-2 rounded-full border border-white/15 hover:border-white/40 transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
            <Link
              href="/testimonies"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:scale-[1.02] transition"
            >
              Share your testimony <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5 items-start">
          <article className="relative overflow-hidden rounded-3xl border border-white/12 bg-[#101010] p-6 sm:p-7 shadow-2xl min-h-[340px]">
            <Quote
              className="absolute -top-6 -right-6 h-20 w-20 text-white/10"
              data-parallax-global="0.18"
            />
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(120deg, rgba(255,255,255,0.08), transparent 45%), radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 50%)',
              }}
              data-parallax-global="0.1"
            />
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-14 w-14 rounded-full overflow-hidden border border-white/15 shadow-inner">
                <Image
                  src={current.image || fallbackImage}
                  alt={current.fullName}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <SmallText weight="semibold" className="text-white text-base">
                  {current.fullName}
                </SmallText>
                <Caption className="text-white/60">{current.role}</Caption>
                <Caption className="text-white/50">
                  {new Date(current.date).toLocaleDateString()}
                </Caption>
              </div>
            </div>
            <p className="text-white/85 text-base leading-relaxed mb-4">
              “{current.testimony}”
            </p>
            <div className="flex flex-wrap gap-2">
              {(current.tags || current.testimony.split(' ').slice(0, 4)).map((tag: string, i: number) => (
                <span
                  key={`${tag}-${i}`}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{
                    backgroundColor: colorScheme.opacity.primary10,
                    color: colorScheme.primary,
                  }}
                >
                  {tag.replace(/[^a-zA-Z]/g, '') || 'Grace'}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <span className="h-2 w-2 rounded-full" style={{ background: colorScheme.primary }} />
                <span>Fresh every week</span>
              </div>
              <Link href="/testimonies" className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {nextList.slice(0, 4).map(item => (
              <button
                key={item.id}
                onClick={() => setActive(item.idx)}
                className="text-left relative overflow-hidden rounded-2xl border border-white/12 bg-[#0f0f0f] p-4 flex items-start gap-3 shadow-lg hover:-translate-y-1 transition-transform"
                data-parallax-global={item.idx % 2 === 0 ? '0.12' : '0.18'}
              >
                <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/15">
                  <Image
                    src={item.image || fallbackImage}
                    alt={item.fullName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <SmallText weight="semibold" className="text-white">
                    {item.fullName}
                  </SmallText>
                  <Caption className="text-white/65 line-clamp-2">
                    “{item.testimony}”
                  </Caption>
                </div>
                <ArrowRight className="w-4 h-4 text-white/50" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActive(idx)}
                className={`h-2.5 rounded-full transition-all duration-200 ${
                idx === active ? 'w-8 bg-white' : 'w-2.5 bg-white/30'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
