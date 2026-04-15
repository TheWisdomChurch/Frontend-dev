import type { LucideIcon } from 'lucide-react';
import { CalendarDays, HeartHandshake, MapPin, Users } from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
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

      <ScrollFadeIn>
        <StatStrip items={config.stats} />
      </ScrollFadeIn>

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl">
          <ScrollFadeIn data-parallax-global="0.08">
            <SplitSection
              eyebrow={config.mission.eyebrow}
              title={config.mission.title}
              description={config.mission.description}
              points={config.mission.points}
              panelTitle={config.mission.panelTitle}
              panelBody={config.mission.panelBody}
              panelItems={config.mission.panelItems}
            />
          </ScrollFadeIn>
        </Container>
      </Section>

      <Section padding="lg" className="bg-[#080808] border-y border-white/10">
        <Container size="xl" className="space-y-8">
          <ScrollFadeIn className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              What this ministry does
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Programs designed for consistent growth and real belonging.
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.1} data-parallax-global="0.1">
            <FeatureGrid items={config.programs} columns={3} />
          </ScrollFadeIn>
        </Container>
      </Section>

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <ScrollFadeIn className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              Next steps
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              A clear pathway from first visit to active service.
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.1} data-parallax-global="0.1">
            <FeatureGrid
              items={config.pathways.map((item, index) => ({
                ...item,
                icon:
                  item.icon ??
                  defaultPathwayIcons[index % defaultPathwayIcons.length],
              }))}
              columns={2}
            />
          </ScrollFadeIn>
        </Container>
      </Section>

      <ScrollFadeIn>
        <ActionBanner
          eyebrow="Join the ministry"
          title={config.cta.title}
          description={config.cta.description}
          primaryHref={config.cta.primaryHref}
          primaryLabel={config.cta.primaryLabel}
          secondaryHref={config.cta.secondaryHref}
          secondaryLabel={config.cta.secondaryLabel}
        />
      </ScrollFadeIn>
    </div>
  );
}
