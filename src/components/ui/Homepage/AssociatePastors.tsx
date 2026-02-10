// components/ui/Homepage/AssociatePastors.tsx
'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Section, Container } from '@/components/layout';
import { Caption, H3, BodySM, SmallText } from '@/components/text';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import { pastorsData, ministryLeadersData } from '@/lib/data';
import { ArrowRight, Sparkles, Users } from 'lucide-react';

type Leader = (typeof pastorsData)[number];

function LeaderCard({ leader, accent }: { leader: Leader; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl group">
      <div className="relative h-64 md:h-72">
        <Image
          src={leader.image}
          alt={leader.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-black"
          style={{ background: accent }}>
          {leader.role}
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <SmallText weight="bold" className="text-white text-lg">
              {leader.name}
            </SmallText>
            <Caption className="text-white/60">{leader.description}</Caption>
          </div>
          <Sparkles className="w-5 h-5 text-white/40" />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
          <Caption className="text-white/60">Pastoral leadership</Caption>
        </div>
      </div>
    </div>
  );
}

export default function AssociatePastors() {
  const { colorScheme } = useTheme();
  const router = useRouter();

  const primary = colorScheme.primary;
  const highlights = useMemo(() => pastorsData.slice(0, 4), []);

  return (
    <Section
      id="leadership"
      padding="lg"
      className="relative overflow-hidden"
      style={{
        background: '#0b0b0b',
      }}
    >
      <Container size="xl" className="relative z-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <Caption className="uppercase tracking-[0.2em] text-xs" style={{ color: primary }}>
              Leadership
            </Caption>
            <H3 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
              Meet our associate pastors
            </H3>
            <BodySM className="text-white/75 max-w-2xl text-sm sm:text-base">
              Trusted voices helping steward the vision. Each carries a unique grace for the house.
            </BodySM>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map(item => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/15 bg-[#111] p-4 space-y-3 shadow-xl"
            >
              <div className="relative w-full h-44 sm:h-48 md:h-52 lg:h-60 rounded-xl overflow-hidden border border-white/10">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 18%' }}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                />
              </div>
              <div className="space-y-1">
                <SmallText weight="medium" className="text-white text-[14px] sm:text-base">
                  {item.name}
                </SmallText>
                <Caption className="text-white/65 text-sm">{item.role}</Caption>
              </div>
              {item.description && (
                <Caption className="text-white/60 text-sm line-clamp-3">{item.description}</Caption>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center lg:justify-end pt-2">
          <CustomButton
            variant="primary"
            size="sm"
            curvature="full"
            className="text-black font-semibold px-5 py-2 sm:px-6 sm:py-2.5"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            style={{ backgroundColor: primary }}
            onClick={() => router.push('/leadership')}
          >
            View more
          </CustomButton>
        </div>
      </Container>
    </Section>
  );
}
