import type { LucideIcon } from 'lucide-react';
import { CalendarDays, HeartHandshake, MapPin, Users } from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import {
  ActionBanner,
  FeatureGrid,
  SplitSection,
  StatStrip,
  type FeatureItem,
  type StatItem,
} from '@/shared/components/site/PublicPageBlocks';

export type MinistryDetailConfig = {
  hero: {
    title: string;
    subtitle: string;
    note: string;
    chips?: string[];
  };
  stats: StatItem[];
  mission: {
    eyebrow: string;
    title: string;
    description: string;
    points: string[];
    panelTitle: string;
    panelBody: string;
    panelItems: string[];
  };
  programs: FeatureItem[];
  pathways: FeatureItem[];
  cta: {
    title: string;
    description: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  };
};

type MinistryDetailPageProps = {
  config: MinistryDetailConfig;
};

const defaultPathwayIcons: LucideIcon[] = [
  Users,
  CalendarDays,
  HeartHandshake,
  MapPin,
];

export default function MinistryDetailPage({
  config,
}: MinistryDetailPageProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title={config.hero.title}
        subtitle={config.hero.subtitle}
        note={config.hero.note}
        chips={config.hero.chips}
        compact
      />

      <StatStrip items={config.stats} />

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl">
          <SplitSection
            eyebrow={config.mission.eyebrow}
            title={config.mission.title}
            description={config.mission.description}
            points={config.mission.points}
            panelTitle={config.mission.panelTitle}
            panelBody={config.mission.panelBody}
            panelItems={config.mission.panelItems}
          />
        </Container>
      </Section>

      <Section padding="lg" className="bg-[#080808] border-y border-white/10">
        <Container size="xl" className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              What this ministry does
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Programs designed for consistent growth and real belonging.
            </h2>
          </div>
          <FeatureGrid items={config.programs} columns={3} />
        </Container>
      </Section>

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              Next steps
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              A clear pathway from first visit to active service.
            </h2>
          </div>
          <FeatureGrid
            items={config.pathways.map((item, index) => ({
              ...item,
              icon:
                item.icon ??
                defaultPathwayIcons[index % defaultPathwayIcons.length],
            }))}
            columns={2}
          />
        </Container>
      </Section>

      <ActionBanner
        eyebrow="Join the ministry"
        title={config.cta.title}
        description={config.cta.description}
        primaryHref={config.cta.primaryHref}
        primaryLabel={config.cta.primaryLabel}
        secondaryHref={config.cta.secondaryHref}
        secondaryLabel={config.cta.secondaryLabel}
      />
    </div>
  );
}
