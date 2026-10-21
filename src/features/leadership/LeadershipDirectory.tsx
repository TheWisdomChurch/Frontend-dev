'use client';

import { useEffect, useMemo, useState } from 'react';
import type { LeadershipMember } from '@/domain/leadership/types';
import { apiClient } from '@/lib/api';
import { Container, Section, SectionHeader } from '@/shared/ui/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { LeaderCard } from '@/features/leadership/LeadershipCards';
import { LeaderBioModal } from '@/features/leadership/LeaderBioModal';
import { SeniorPastorsSpotlight } from '@/features/leadership/SeniorPastorsSpotlight';
import { ExploreMoreBand } from '@/features/resources/ExploreMoreBand';
import {
  CANONICAL_SENIOR_PASTORS,
  CANONICAL_CO_MINISTERS,
  CANONICAL_DEACONS,
} from './canonicalData';

interface LeadershipDirectoryProps {
  cmsLeaders: LeadershipMember[];
}

function matchesName(leader: LeadershipMember, fragment: string): boolean {
  const full = `${leader.firstName} ${leader.lastName}`.toLowerCase();
  return full.includes(fragment.toLowerCase());
}

export function LeadershipDirectory({ cmsLeaders }: LeadershipDirectoryProps) {
  const [clientLeaders, setClientLeaders] = useState<LeadershipMember[] | null>(
    null
  );
  const [selectedLeader, setSelectedLeader] = useState<LeadershipMember | null>(
    null
  );
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const leaders = clientLeaders ?? cmsLeaders;

  // Live client-side revalidation: ensures any new updates on the live website / admin are instantly reflected
  useEffect(() => {
    let cancelled = false;
    apiClient
      .listLeadership()
      .then(fetched => {
        if (!cancelled && Array.isArray(fetched) && fetched.length > 0) {
          setClientLeaders(fetched);
        }
      })
      .catch(() => {
        // Retain initial SSR data gracefully
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openBio = (leader: LeadershipMember) => {
    setSelectedLeader(leader);
    setIsBioOpen(true);
  };

  const closeBio = () => {
    setIsBioOpen(false);
    setSelectedLeader(null);
  };

  // ── 1. Senior Pastors ──────────────────────────────────────────────────────
  // Bishop Gabriel Ayilara & Pastor Kehinde Ayilara spotlight
  const seniorPastors = useMemo(() => {
    const cmsSeniors = leaders.filter(
      l =>
        l.role === 'senior_pastor' ||
        matchesName(l, 'gabriel') ||
        matchesName(l, 'kehinde')
    );

    const merged = CANONICAL_SENIOR_PASTORS.map(canon => {
      const match = cmsSeniors.find(
        c =>
          matchesName(c, canon.lastName) ||
          matchesName(c, canon.firstName.split(' ').pop() || '')
      );
      if (!match) return canon;
      return {
        ...canon,
        ...match,
        imageUrl: match.imageUrl || canon.imageUrl,
        bio: match.bio || canon.bio,
      };
    });

    const matchedIds = new Set(
      CANONICAL_SENIOR_PASTORS.map(c => {
        const m = cmsSeniors.find(
          cs =>
            matchesName(cs, c.lastName) ||
            matchesName(cs, c.firstName.split(' ').pop() || '')
        );
        return m?.id;
      }).filter(Boolean) as string[]
    );
    const extraSeniors = cmsSeniors.filter(c => !matchedIds.has(c.id));
    return [...merged, ...extraSeniors];
  }, [leaders]);

  // ── 2. Co-Ministers & Pastoral Oversight ───────────────────────────────────
  // Rev. Victor Jimba, Pastor Bamidele + any additional associate pastors
  const coMinisters = useMemo(() => {
    const cmsPastors = leaders.filter(
      l =>
        (l.role === 'associate_pastor' ||
          l.role === 'reverend' ||
          matchesName(l, 'jimba') ||
          matchesName(l, 'bamidele')) &&
        !matchesName(l, 'gabriel') &&
        !matchesName(l, 'kehinde')
    );

    const merged = CANONICAL_CO_MINISTERS.map(canon => {
      const match = cmsPastors.find(
        c =>
          matchesName(c, canon.lastName) ||
          matchesName(c, canon.firstName.split(' ').pop() || '')
      );
      if (!match) return canon;
      return {
        ...canon,
        ...match,
        imageUrl: match.imageUrl || canon.imageUrl,
        bio: match.bio || canon.bio,
      };
    });

    const matchedIds = new Set(
      CANONICAL_CO_MINISTERS.map(c => {
        const m = cmsPastors.find(
          cs =>
            matchesName(cs, c.lastName) ||
            matchesName(cs, c.firstName.split(' ').pop() || '')
        );
        return m?.id;
      }).filter(Boolean) as string[]
    );
    const extraPastors = cmsPastors.filter(c => !matchedIds.has(c.id));
    return [...merged, ...extraPastors];
  }, [leaders]);

  // ── 3. Board of Deacons & Deaconesses ──────────────────────────────────────
  // Deacon Adeyemi, Deaconess Temisan Adeniran, Deaconess Bimbo Adeyemi + CMS deacons
  const deacons = useMemo(() => {
    const cmsDeacons = leaders.filter(
      l =>
        l.role === 'deacon' ||
        l.role === 'deaconess' ||
        matchesName(l, 'temisan') ||
        matchesName(l, 'bimbo')
    );

    const merged = CANONICAL_DEACONS.map(canon => {
      const match = cmsDeacons.find(
        c =>
          matchesName(c, canon.lastName) ||
          matchesName(c, canon.firstName.split(' ').pop() || '')
      );
      if (!match) return canon;
      return {
        ...canon,
        ...match,
        imageUrl: match.imageUrl || canon.imageUrl,
        bio: match.bio || canon.bio,
      };
    });

    const matchedIds = new Set(
      CANONICAL_DEACONS.map(c => {
        const m = cmsDeacons.find(
          cs =>
            matchesName(cs, c.lastName) ||
            matchesName(cs, c.firstName.split(' ').pop() || '')
        );
        return m?.id;
      }).filter(Boolean) as string[]
    );
    const extraDeacons = cmsDeacons.filter(c => !matchedIds.has(c.id));
    return [...merged, ...extraDeacons];
  }, [leaders]);

  // ── 4. Departmental & Ministry Leaders (Direct from Endpoint) ──────────────
  // All other leaders returned by apiClient.listLeadership() — NO mock data!
  const departmentLeaders: LeadershipMember[] = useMemo(() => {
    const topIds = new Set([
      ...seniorPastors.map(l => l.id),
      ...coMinisters.map(l => l.id),
      ...deacons.map(l => l.id),
    ]);

    return leaders.filter(l => {
      if (topIds.has(l.id)) return false;
      if (matchesName(l, 'gabriel') || matchesName(l, 'kehinde')) return false;
      if (matchesName(l, 'jimba') || matchesName(l, 'bamidele')) return false;
      if (matchesName(l, 'temisan') || matchesName(l, 'bimbo')) return false;
      if (
        l.role === 'senior_pastor' ||
        l.role === 'associate_pastor' ||
        l.role === 'reverend' ||
        l.role === 'deacon' ||
        l.role === 'deaconess'
      ) {
        return false;
      }
      return true;
    });
  }, [leaders, seniorPastors, coMinisters, deacons]);

  // Distinct department names extracted from actual endpoint leaders
  const departmentCategories = useMemo(() => {
    const categories = new Set<string>();
    departmentLeaders.forEach(l => {
      const dept = l.department?.trim();
      if (dept) categories.add(dept);
    });
    return Array.from(categories);
  }, [departmentLeaders]);

  const filteredDepartmentLeaders = useMemo(() => {
    if (activeFilter === 'all') return departmentLeaders;
    return departmentLeaders.filter(l => l.department?.trim() === activeFilter);
  }, [departmentLeaders, activeFilter]);

  return (
    <>
      {/* ── 1. Senior Pastors Spotlight ─────────────────────── */}
      <div id="senior-pastor" className="scroll-mt-24">
        <SeniorPastorsSpotlight
          seniorPastors={seniorPastors}
          onOpenBio={openBio}
        />
      </div>

      {/* ── 2. Leadership Organogram & Resident Pastors ───────── */}
      <Section
        id="resident-pastors"
        tone="canvas"
        className="scroll-mt-24 relative overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,color-mix(in_srgb,var(--app-primary-10)_80%,transparent)_0%,transparent_65%),var(--app-canvas-2)] py-20 sm:py-28"
      >
        <Container>
          <SectionHeader
            eyebrow="Leadership Organogram"
            title="Have a glimpse of our leadership organogram,"
            accent="who comes together to form the leadership structure of the wisdom church."
            description="Our ordained resident pastors serve faithfully under senior apostolic oversight, shepherding the congregation, teaching biblical doctrine, and directing church ministries."
            size="lg"
            className="max-w-4xl"
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 max-w-4xl">
            {coMinisters.map((leader, i) => (
              <ScrollFadeIn key={leader.id} delay={i * 0.1}>
                <LeaderCard leader={leader} tone="canvas" onOpenBio={openBio} />
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 3. Deacons & Deaconess Section ───────────────────── */}
      <Section
        id="deacons"
        tone="dark"
        className="scroll-mt-24 border-t border-white/10 bg-[radial-gradient(ellipse_75%_55%_at_50%_25%,color-mix(in_srgb,var(--app-primary)_12%,transparent)_0%,transparent_70%),var(--app-dark)] py-20 sm:py-28 text-white"
      >
        <Container>
          <SectionHeader
            eyebrow="Servant Leadership"
            title="Deacons &"
            accent="Deaconesses."
            description="Dedicated servant leaders who coordinate day-to-day church stewardship, welfare, and congregational care."
            tone="dark"
            size="lg"
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {deacons.map((leader, i) => (
              <ScrollFadeIn key={leader.id} delay={i * 0.08}>
                <LeaderCard leader={leader} tone="dark" onOpenBio={openBio} />
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 4. Departmental & Ministry Leaders (Appears when endpoint is active) ── */}
      {departmentLeaders.length > 0 && (
        <Section
          tone="canvas"
          className="border-t border-[var(--app-border)] py-16 sm:py-24"
        >
          <Container>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeader
                eyebrow="Ministry Operations"
                title="Departmental &"
                accent="Ministry Leaders."
                description="Faithful believers heading worship, children, hospitality, media, and outreach operations across the church."
              />

              {/* Department Filter Pills (Dynamic from Endpoint Data) */}
              {departmentCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveFilter('all')}
                    className={`inline-flex min-h-[44px] items-center rounded-full px-5 font-ui text-caption font-bold uppercase tracking-wider transition-all duration-200 ${
                      activeFilter === 'all'
                        ? 'bg-[var(--app-dark)] text-white shadow-sm'
                        : 'border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)] hover:border-[var(--app-primary)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    All ({departmentLeaders.length})
                  </button>
                  {departmentCategories.map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveFilter(category)}
                      className={`inline-flex min-h-[44px] items-center rounded-full px-5 font-ui text-caption font-bold uppercase tracking-wider transition-all duration-200 ${
                        activeFilter === category
                          ? 'bg-[var(--app-dark)] text-white shadow-sm'
                          : 'border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)] hover:border-[var(--app-primary)] hover:text-[var(--app-text)]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDepartmentLeaders.map((leader, i) => (
                <ScrollFadeIn key={leader.id} delay={i * 0.08}>
                  <LeaderCard
                    leader={leader}
                    tone="canvas"
                    onOpenBio={openBio}
                  />
                </ScrollFadeIn>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── 5. Explore More Band ────────────────────────────── */}
      <ExploreMoreBand tone="canvas" />

      {/* ── 6. Full Biography Modal ─────────────────────────── */}
      <LeaderBioModal
        leader={selectedLeader}
        isOpen={isBioOpen}
        onClose={closeBio}
      />
    </>
  );
}
