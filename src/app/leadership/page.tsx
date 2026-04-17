'use client';

import { useEffect, useMemo, useState } from 'react';
import { Container, Section } from '@/shared/layout';
import PageHero from '@/features/hero/PageHero';
import { H3, BodySM, Caption, SmallText } from '@/shared/text';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { apiClient } from '@/lib/api';
import type { LeadershipMember, LeadershipRole } from '@/lib/types';

const ROLE_LABELS: Record<LeadershipRole, string> = {
  senior_pastor: 'Senior Pastor',
  associate_pastor: 'Associate Pastor',
  deacon: 'Deacon',
  deaconess: 'Deaconness',
  reverend: 'Reverend',
};

const ROLE_ORDER: LeadershipRole[] = [
  'senior_pastor',
  'associate_pastor',
  'reverend',
  'deacon',
  'deaconess',
];

function initials(firstName?: string, lastName?: string) {
  const a = (firstName || '').trim()[0] || '';
  const b = (lastName || '').trim()[0] || '';
  return `${a}${b}`.toUpperCase() || 'LC';
}

export default function LeadershipPage() {
  const { colorScheme } = useTheme();
  const [leaders, setLeaders] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    apiClient
      .listLeadership()
      .then(items => {
        if (!active) return;
        setLeaders(Array.isArray(items) ? items : []);
        setLoadError(null);
      })
      .catch((err: any) => {
        if (!active) return;
        setLoadError(err?.message || 'Unable to load leadership.');
        setLeaders([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const grouped = useMemo(
    () =>
      ROLE_ORDER.map(role => ({
        role,
        label: ROLE_LABELS[role],
        items: leaders.filter(leader => leader.role === role),
      })),
    [leaders]
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Leadership at Wisdom Church"
        subtitle="Guided by vision, grounded in service."
        description="Meet the leaders stewarding our house."
        compact
      />

      <Section padding="lg" className="relative overflow-hidden bg-[#0b0b0b]">
        <Container size="xl" className="space-y-8">
          <div className="flex flex-col gap-2 fade-up">
            <H3 className="text-2xl sm:text-3xl font-bold">
              Meet the leadership
            </H3>
            <Caption className="text-white/60">
              Approved leaders are displayed here.
            </Caption>
          </div>

          {loading && (
            <BodySM className="text-white/60">Loading leadership...</BodySM>
          )}
          {loadError && <BodySM className="text-red-300">{loadError}</BodySM>}

          {!loading &&
            !loadError &&
            grouped.map(group => (
              <div key={group.role} className="space-y-4">
                <SmallText className="text-white/70 uppercase tracking-[0.2em] text-xs">
                  {group.label}
                </SmallText>

                {group.items.length === 0 ? (
                  <Caption className="text-white/50">
                    No approved leaders yet.
                  </Caption>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.items.map(leader => (
                      <div
                        key={leader.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-xl fade-up"
                      >
                        <div className="flex items-center gap-4">
                          {leader.imageUrl ? (
                            <img
                              src={leader.imageUrl}
                              alt={`${leader.firstName} ${leader.lastName}`}
                              className="h-14 w-14 rounded-full object-cover border border-white/15"
                            />
                          ) : (
                            <div
                              className="h-14 w-14 rounded-full flex items-center justify-center text-sm font-semibold"
                              style={{
                                background: `linear-gradient(140deg, ${colorScheme.primary} 0%, #1f2937 100%)`,
                              }}
                            >
                              {initials(leader.firstName, leader.lastName)}
                            </div>
                          )}

                          <div className="space-y-1">
                            <SmallText weight="bold" className="text-white">
                              {leader.firstName} {leader.lastName}
                            </SmallText>
                            <Caption className="text-white/60">
                              {ROLE_LABELS[leader.role]}
                            </Caption>
                          </div>
                        </div>

                        {leader.bio && (
                          <Caption className="text-white/65 mt-3 leading-relaxed">
                            {leader.bio}
                          </Caption>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </Container>
      </Section>
    </div>
  );
}
