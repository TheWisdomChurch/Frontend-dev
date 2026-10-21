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
  // Bishop Gabriel Ayilara (Canonical) & Pastor Kehinde Ayilara (Live from API)
  const seniorPastors = useMemo(() => {
    const bishopGabriel = CANONICAL_SENIOR_PASTORS[0];

    // Fetch Kehinde Ayilara's live picture, bio, and data from the API endpoint
    const apiKehinde = leaders.find(l => matchesName(l, 'kehinde'));

    const pastorKehinde: LeadershipMember = apiKehinde
      ? {
          ...apiKehinde,
          role: 'senior_pastor',
          imageUrl: apiKehinde.imageUrl || CANONICAL_SENIOR_PASTORS[1].imageUrl,
          bio: apiKehinde.bio || CANONICAL_SENIOR_PASTORS[1].bio,
        }
      : CANONICAL_SENIOR_PASTORS[1];

    return [bishopGabriel, pastorKehinde];
  }, [leaders]);

  // ── 2. Co-Ministers & Pastoral Oversight ───────────────────────────────────
  // Rev. Victor Jimba (Resident Pastor) & Pastor Bamidele (Pastor)
  // Rock-solid canonical foundation: strictly separated from deacons
  const coMinisters = useMemo(() => {
    return CANONICAL_CO_MINISTERS;
  }, []);

  // ── 3. Deacons & Deaconesses (Dynamic from API endpoint) ───────────────────
  // Includes Jimba Oluwatoyosi Victoria and Deacon Temisan; excludes Michael Oluwatoyosi Osaseyi
  const deacons = useMemo(() => {
    return leaders
      .filter(l => {
        // Explicitly remove Michael Oluwatoyosi Osaseyi as instructed
        if (matchesName(l, 'osaseyi')) return false;

        // Exclude Pastoral leadership
        if (
          matchesName(l, 'gabriel') ||
          matchesName(l, 'kehinde') ||
          matchesName(l, 'bamidele') ||
          (matchesName(l, 'jimba') &&
            matchesName(l, 'victor') &&
            !matchesName(l, 'victoria') &&
            !matchesName(l, 'oluwatoyosi'))
        ) {
          return false;
        }

        // Include Deacon Temisan from the API
        if (matchesName(l, 'temisan')) return true;

        // Include Jimba Oluwatoyosi Victoria from the API
        const isToyosiJimba =
          matchesName(l, 'oluwatoyosi') ||
          matchesName(l, 'toyosi') ||
          (matchesName(l, 'jimba') && !matchesName(l, 'victor'));
        if (isToyosiJimba) return true;

        // Include any other deacons from the API
        const roleLower = (l.role || '').toLowerCase();
        const deptLower = (l.department || '').toLowerCase();
        return (
          roleLower.includes('deacon') ||
          roleLower.includes('deaconess') ||
          deptLower.includes('deacon')
        );
      })
      .map(l => {
        // Ensure Jimba Oluwatoyosi Victoria is accurately labeled as Deacon
        const isToyosiJimba =
          matchesName(l, 'oluwatoyosi') ||
          matchesName(l, 'toyosi') ||
          (matchesName(l, 'jimba') && !matchesName(l, 'victor'));
        if (isToyosiJimba) {
          return {
            ...l,
            role: 'deacon' as LeadershipMember['role'],
            department:
              l.department &&
              l.department.toLowerCase().trim() !== 'board of deacons'
                ? l.department
                : null,
          };
        }

        // If it's Deacon Temisan, ensure role displays cleanly as Deacon / Deaconess
        if (matchesName(l, 'temisan')) {
          const roleLower = (l.role || '').toLowerCase();
          const role =
            roleLower.includes('deaconess') || roleLower.includes('deacon')
              ? l.role
              : ('deacon' as LeadershipMember['role']);
          return {
            ...l,
            role,
            department:
              l.department &&
              l.department.toLowerCase().trim() !== 'board of deacons'
                ? l.department
                : null,
          };
        }

        return {
          ...l,
          department:
            l.department &&
            l.department.toLowerCase().trim() !== 'board of deacons'
              ? l.department
              : null,
        };
      });
  }, [leaders]);

  /*
  // ── 4. Departmental & Ministry Leaders (Commented out per request) ──────────
  const departmentLeaders: LeadershipMember[] = useMemo(() => {
    return leaders.filter(
      l =>
        l.role !== 'deacon' &&
        l.role !== 'deaconess' &&
        !matchesName(l, 'oluwatoyosi') &&
        !matchesName(l, 'toyosi')
    );
  }, [leaders]);

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
  */

  return (
    <>
      {/* ── 1. Senior Pastors Spotlight ─────────────────────── */}
      {seniorPastors.length > 0 && (
        <div id="senior-pastor" className="scroll-mt-24">
          <SeniorPastorsSpotlight
            seniorPastors={seniorPastors}
            onOpenBio={openBio}
          />
        </div>
      )}

      {/* ── 2. Leadership Organogram & Resident Pastors ───────── */}
      {coMinisters.length > 0 && (
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
                <ScrollFadeIn
                  key={leader.id ? `${leader.id}-${i}` : `cominister-${i}`}
                  delay={i * 0.1}
                >
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

      {/* ── 3. Deacons & Deaconess Section ───────────────────── */}
      {deacons.length > 0 && (
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
                <ScrollFadeIn
                  key={leader.id ? `${leader.id}-${i}` : `deacon-${i}`}
                  delay={i * 0.08}
                >
                  <LeaderCard leader={leader} tone="dark" onOpenBio={openBio} />
                </ScrollFadeIn>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── 4. Departmental & Ministry Leaders (Commented out per request) ── */}
      {/*
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
                <ScrollFadeIn
                  key={leader.id ? `${leader.id}-${i}` : `dept-leader-${i}`}
                  delay={i * 0.08}
                >
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
      */}

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
