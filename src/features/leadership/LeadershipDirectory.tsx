'use client';

import { useMemo, useState } from 'react';
import type { LeadershipMember } from '@/domain/leadership/types';
import { Container, Section, SectionHeader } from '@/shared/ui/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { LeaderCard } from '@/features/leadership/LeadershipCards';
import { LeaderBioModal } from '@/features/leadership/LeaderBioModal';
import { SeniorPastorsSpotlight } from '@/features/leadership/SeniorPastorsSpotlight';
import { ExploreMoreBand } from '@/features/resources/ExploreMoreBand';
import { LeadershipNewsletterSection } from '@/features/leadership/NewsletterSection';
import {
  Bishop,
  PstKenny_1,
  Associate_1,
  Associate_2,
  Deacon_1,
  Deacon_2,
  Children_head,
} from '@/shared/assets';

// Canonical fallback members ensuring complete display even if backend CMS is in cold start
export const CANONICAL_SENIOR_PASTORS: LeadershipMember[] = [
  {
    id: 'canon-senior-1',
    firstName: 'Bishop Gabriel',
    lastName: 'Ayilara',
    role: 'senior_pastor',
    status: 'approved',
    department: 'Spiritual Oversight',
    imageUrl: Bishop.src,
    bio: 'Bishop Gabriel Ayilara is the Senior Pastor of The Wisdom Church. An apostolic voice and compassionate teacher of the Word, he carries a divine mandate to raise believers of excellence, wisdom, and kingdom impact across Lagos and worldwide. Under his oversight, the church continues to witness radical life transformations, community outreach, and deep spiritual revival.',
  },
  {
    id: 'canon-senior-2',
    firstName: 'Pastor Kehinde',
    lastName: 'Ayilara',
    role: 'senior_pastor',
    status: 'approved',
    department: 'Spiritual Oversight',
    imageUrl: PstKenny_1.src,
    bio: 'Pastor Mrs Kehinde Ayilara serves as Senior Pastor, ministering with maternal grace, prayer fervor, and life-changing discipleship. She has an enduring passion for mentoring families, building authentic believers, and empowering women and youth to step boldly into God’s sovereign plan.',
  },
];

export const CANONICAL_CO_MINISTERS: LeadershipMember[] = [
  {
    id: 'canon-pastor-1',
    firstName: 'Rev. Victor',
    lastName: 'Jimba',
    role: 'reverend',
    status: 'approved',
    department: 'Resident Pastor',
    imageUrl: Associate_2.src,
    bio: 'Rev. Victor Jimba serves as Resident Pastor, providing steadfast pastoral administration, sound spiritual counsel, and leadership discipleship throughout the Wisdom Church family.',
  },
  {
    id: 'canon-pastor-2',
    firstName: 'Pastor',
    lastName: 'Bamidele',
    role: 'associate_pastor',
    status: 'approved',
    department: 'Associate Pastor',
    imageUrl: Associate_1.src,
    bio: 'Pastor Bamidele serves as Associate Pastor, actively leading youth discipleship, evangelistic outreaches, and kingdom community mentorship initiatives.',
  },
];

export const CANONICAL_DEACONS: LeadershipMember[] = [
  {
    id: 'canon-deacon-1',
    firstName: 'Deacon',
    lastName: 'Adeyemi',
    role: 'deacon',
    status: 'approved',
    department: 'Board of Deacons',
    imageUrl: Associate_1.src,
    bio: 'Deacon Adeyemi oversees deacon board activities, church administration, and member care ministries with excellence, integrity, and diligence.',
  },
  {
    id: 'canon-deacon-2',
    firstName: 'Deaconess Temisan',
    lastName: 'Adeniran',
    role: 'deaconess',
    status: 'approved',
    department: 'Finance & Stewardship',
    imageUrl: Deacon_1.src,
    bio: 'Deaconess Temisan Adeniran faithfully manages financial stewardship, church records, and biblical principles of kingdom prosperity.',
  },
  {
    id: 'canon-deacon-3',
    firstName: 'Deaconess Bimbo',
    lastName: 'Adeyemi',
    role: 'deaconess',
    status: 'approved',
    department: 'Member Care & Outreach',
    imageUrl: Deacon_2.src,
    bio: 'Deaconess Bimbo Adeyemi faithfully serves in hospitality coordination, family welfare, and benevolent outreach operations across the church.',
  },
];

interface LeadershipDirectoryProps {
  cmsLeaders: LeadershipMember[];
}

export function LeadershipDirectory({ cmsLeaders }: LeadershipDirectoryProps) {
  const [selectedLeader, setSelectedLeader] = useState<LeadershipMember | null>(
    null
  );
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'pastoral' | 'deacons' | 'departments'
  >('all');

  const openBio = (leader: LeadershipMember) => {
    setSelectedLeader(leader);
    setIsBioOpen(true);
  };

  const closeBio = () => {
    setIsBioOpen(false);
    setSelectedLeader(null);
  };

  // Merge canonical senior leaders with CMS entries if present
  const seniorPastors = useMemo(() => {
    const cmsSeniors = cmsLeaders.filter(
      l =>
        l.role === 'senior_pastor' ||
        l.firstName.toLowerCase().includes('gabriel') ||
        l.firstName.toLowerCase().includes('kehinde')
    );
    if (cmsSeniors.length >= 2) return cmsSeniors;
    return CANONICAL_SENIOR_PASTORS;
  }, [cmsLeaders]);

  const coMinisters = useMemo(() => {
    const cmsPastors = cmsLeaders.filter(
      l =>
        (l.role === 'associate_pastor' || l.role === 'reverend') &&
        !l.firstName.toLowerCase().includes('gabriel') &&
        !l.firstName.toLowerCase().includes('kehinde')
    );
    if (cmsPastors.length > 0) return cmsPastors;
    return CANONICAL_CO_MINISTERS;
  }, [cmsLeaders]);

  const deacons = useMemo(() => {
    const cmsDeacons = cmsLeaders.filter(
      l => l.role === 'deacon' || l.role === 'deaconess'
    );
    if (cmsDeacons.length > 0) return cmsDeacons;
    return CANONICAL_DEACONS;
  }, [cmsLeaders]);

  // Ministry & departmental leaders (Children church, music, media, etc.)
  const departmentLeaders: LeadershipMember[] = useMemo(() => {
    const excludedIds = new Set([
      ...seniorPastors.map(l => l.id),
      ...coMinisters.map(l => l.id),
      ...deacons.map(l => l.id),
    ]);
    const others = cmsLeaders.filter(l => !excludedIds.has(l.id));

    if (others.length > 0) return others;

    // Fallback department head if CMS has no other records
    const fallbackDept: LeadershipMember[] = [
      {
        id: 'canon-dept-1',
        firstName: 'Mojisola',
        lastName: 'Oladejo',
        role: 'director',
        status: 'approved',
        department: "Children's Church",
        imageUrl: Children_head.src,
        bio: 'Mojisola Oladejo passionately directs the Children’s Department, cultivating a joyful, faith-filled atmosphere where kids discover Jesus and grow in godly character.',
      },
      {
        id: 'canon-dept-2',
        firstName: 'Tomide',
        lastName: 'Akinlehin',
        role: 'leader',
        status: 'approved',
        department: 'Music & Worship Ministry',
        imageUrl: '',
        bio: 'Tomide Akinlehin serves as Assistant Music Director, facilitating transformative worship encounters that lead the congregation into God’s intimate presence.',
      },
      {
        id: 'canon-dept-3',
        firstName: 'Kelechi',
        lastName: 'Ntekop',
        role: 'leader',
        status: 'approved',
        department: 'Protocol & Sanctuary Hospitality',
        imageUrl: '',
        bio: 'Kelechi Ntekop serves with devotion in sanctuary hospitality and member integration, ensuring every worshipper experiences the warmth and order of God’s house.',
      },
    ];

    return fallbackDept;
  }, [cmsLeaders, seniorPastors, coMinisters, deacons]);

  return (
    <>
      {/* ── 1. Senior Pastors Spotlight ─────────────────────── */}
      <SeniorPastorsSpotlight
        seniorPastors={seniorPastors}
        onOpenBio={openBio}
      />

      {/* ── 2. Co-Ministers & Pastoral Oversight ────────────── */}
      <Section tone="canvas" className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Pastoral Oversight"
            title="Co-Ministers &"
            accent="Pastoral Team."
            description="Devoted ministers shepherding the congregation, teaching biblical doctrine, and guiding church ministries."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl">
            {coMinisters.map((leader, i) => (
              <ScrollFadeIn key={leader.id} delay={i * 0.08}>
                <LeaderCard leader={leader} tone="canvas" onOpenBio={openBio} />
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 3. Board of Deacons & Deaconesses ───────────────── */}
      <Section
        tone="dark"
        className="border-t border-white/10 bg-[var(--app-dark)] py-16 sm:py-20"
      >
        <Container>
          <SectionHeader
            eyebrow="Servant Leadership"
            title="Board of"
            accent="Deacons & Deaconesses."
            description="Dedicated leaders who coordinate day-to-day church stewardship, welfare, and congregational care."
            tone="dark"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deacons.map((leader, i) => (
              <ScrollFadeIn key={leader.id} delay={i * 0.08}>
                <LeaderCard leader={leader} tone="dark" onOpenBio={openBio} />
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 4. Departmental & Ministry Leaders ──────────────── */}
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

            {/* Interactive Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Leaders' },
                { id: 'departments', label: 'Department Heads' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveFilter(tab.id as 'all' | 'departments')
                  }
                  className={`inline-flex min-h-[44px] items-center rounded-full px-5 font-ui text-caption font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeFilter === tab.id
                      ? 'bg-[var(--app-dark)] text-white shadow-sm'
                      : 'border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)] hover:border-[var(--app-primary)] hover:text-[var(--app-text)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departmentLeaders.map((leader, i) => (
              <ScrollFadeIn key={leader.id} delay={i * 0.08}>
                <LeaderCard leader={leader} tone="canvas" onOpenBio={openBio} />
              </ScrollFadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 5. Replaced CTA: Explore More Band ──────────────── */}
      <ExploreMoreBand tone="canvas" />

      {/* ── 6. Replaced CTA: Newsletter Band ────────────────── */}
      <LeadershipNewsletterSection />

      {/* ── 7. Full Biography Modal ─────────────────────────── */}
      <LeaderBioModal
        leader={selectedLeader}
        isOpen={isBioOpen}
        onClose={closeBio}
      />
    </>
  );
}
