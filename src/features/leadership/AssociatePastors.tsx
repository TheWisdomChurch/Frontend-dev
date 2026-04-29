'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Users } from 'lucide-react';

import { Container, Section } from '@/shared/layout';
import { BodySM, Caption, H3, SmallText } from '@/shared/text';
import CustomButton from '@/shared/utils/buttons/CustomButton';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { useLeadership } from '@/hooks/useLeadership';
import { pastorsData } from '@/lib/data';

type Leader = (typeof pastorsData)[number] & {
  id?: string | number;
  name?: string;
  firstName?: string;
  lastName?: string;
  image?: any;
  imageUrl?: string;
  role?: string;
  description?: string;
  bio?: string;
};

function getLeaderName(leader: Leader) {
  return (
    leader.name ||
    `${leader.firstName || ''} ${leader.lastName || ''}`.trim() ||
    'Leader'
  );
}

function LeaderCard({
  leader,
  index,
  accent,
}: {
  leader: Leader;
  index: number;
  accent: string;
}) {
  const displayName = getLeaderName(leader);
  const displayImage = leader.image || leader.imageUrl;
  const displayRole = leader.role || 'Leadership';
  const displayDescription = leader.description || leader.bio;

  return (
    <article className="group relative h-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045] shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.065] hover:shadow-[0_28px_75px_rgba(0,0,0,0.45)]">
      <div className="relative h-64 overflow-hidden bg-black sm:h-72 lg:h-76">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={displayName}
            fill
            className="object-cover transition duration-700 ease-out group-hover:scale-105"
            style={{ objectPosition: 'center 18%' }}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 25vw"
            quality={88}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#111]">
            <Users className="h-10 w-10 text-white/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

        <div className="absolute left-4 top-4 rounded-full border border-black/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-black shadow-lg">
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: accent }}
          />
          <span className="relative z-10">{displayRole}</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/70 backdrop-blur-md">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent }}
            />
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex min-h-[170px] flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <SmallText
                weight="semibold"
                className="block truncate text-base text-white sm:text-lg"
              >
                {displayName}
              </SmallText>

              <Caption className="mt-1 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                Pastoral leadership
              </Caption>
            </div>

            <div
              className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-white/10 bg-white/[0.06]"
              style={{ color: accent }}
            >
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          {displayDescription ? (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/62">
              {displayDescription}
            </p>
          ) : (
            <p className="mt-4 text-sm leading-6 text-white/45">
              Serving the house with care, excellence, and spiritual oversight.
            </p>
          )}
        </div>

        <div className="mt-5 h-px w-full bg-gradient-to-r from-white/5 via-white/14 to-transparent" />
      </div>
    </article>
  );
}

export default function AssociatePastors() {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const { leaders } = useLeadership();

  const primary = colorScheme.primary;

  const highlights = useMemo<Leader[]>(() => {
    const source =
      Array.isArray(leaders) && leaders.length > 0 ? leaders : pastorsData;
    return source.slice(0, 4) as Leader[];
  }, [leaders]);

  return (
    <Section
      id="leadership"
      padding="none"
      fullHeight={false}
      perf="none"
      className="relative overflow-hidden bg-[#070707] py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[-10%] top-16 h-72 w-72 rounded-full blur-3xl"
          style={{ background: `${primary}14` }}
        />
        <div className="absolute right-[-8%] top-1/3 h-96 w-96 rounded-full bg-white/[0.045] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      </div>

      <Container size="xl" className="relative z-10 px-4 sm:px-6 lg:px-10">
        <div className="mb-8 grid gap-5 lg:mb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: primary }}
              />
              <Caption
                className="text-[0.68rem] font-bold uppercase tracking-[0.18em]"
                style={{ color: primary }}
              >
                Leadership
              </Caption>
            </div>

            <H3
              className="max-w-2xl text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.75rem]"
              useThemeColor={false}
            >
              Meet our associate pastors
            </H3>
          </div>

          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <BodySM className="max-w-3xl text-sm leading-7 text-white/68 sm:text-base">
              Trusted voices helping steward the vision. Each carries a unique
              grace for the house.
            </BodySM>
          </div>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {highlights.map((leader, index) => (
            <LeaderCard
              key={leader.id || getLeaderName(leader)}
              leader={leader}
              index={index}
              accent={primary}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center lg:justify-end">
          <CustomButton
            variant="primary"
            size="sm"
            curvature="full"
            className="px-6 py-3 text-sm font-bold text-black transition duration-300 hover:-translate-y-0.5"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            style={{
              background: `linear-gradient(135deg, ${primary}, ${colorScheme.primaryDark})`,
              boxShadow: `0 16px 38px ${colorScheme.opacity.primary20}`,
            }}
            onClick={() => router.push('/leadership')}
          >
            View more
          </CustomButton>
        </div>
      </Container>
    </Section>
  );
}
