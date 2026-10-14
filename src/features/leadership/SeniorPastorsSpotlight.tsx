'use client';

import Image from 'next/image';
import { ArrowRight, Quote, Sparkles } from 'lucide-react';
import type { LeadershipMember } from '@/domain/leadership/types';
import { Container, Section, SectionHeader } from '@/shared/ui/layout';
import { IMAGE_QUALITY } from '@/shared/constants';

interface SeniorPastorsSpotlightProps {
  seniorPastors: LeadershipMember[];
  onOpenBio: (leader: LeadershipMember) => void;
}

export function SeniorPastorsSpotlight({
  seniorPastors,
  onOpenBio,
}: SeniorPastorsSpotlightProps) {
  if (seniorPastors.length === 0) return null;

  return (
    <Section
      tone="dark"
      className="relative border-b border-white/10 bg-[var(--app-dark)] py-16 sm:py-24"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-96 w-full max-w-7xl bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_srgb,var(--app-primary)_18%,transparent),transparent_70%)]"
      />

      <Container className="relative">
        <SectionHeader
          align="center"
          eyebrow="Spiritual Oversight"
          title="Our Senior"
          accent="Pastors."
          description="Apostolic vision, sound biblical exposition, and a servant's heart for God's transforming move in this generation."
          tone="dark"
          size="lg"
          className="mx-auto max-w-3xl text-center"
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:gap-12">
          {seniorPastors.map(pastor => {
            const fullName = `${pastor.firstName} ${pastor.lastName}`.trim();
            return (
              <div
                key={pastor.id}
                onClick={() => onOpenBio(pastor)}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/12 bg-[linear-gradient(160deg,var(--app-dark-2),var(--app-dark-3))] p-6 sm:p-8 shadow-2xl transition-all duration-500 hover:border-[var(--app-primary)] hover:shadow-[0_24px_64px_color-mix(in_srgb,var(--app-primary)_18%,transparent)] cursor-pointer"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-2xl bg-[var(--app-dark)]">
                  {pastor.imageUrl ? (
                    <Image
                      src={pastor.imageUrl}
                      alt={fullName}
                      fill
                      quality={IMAGE_QUALITY}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  ) : null}

                  {/* Gradient mask */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--app-dark)_85%,transparent)_0%,color-mix(in_srgb,var(--app-dark)_20%,transparent)_50%,transparent_100%)]"
                  />

                  {/* Floating role badge */}
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3.5 py-1 font-ui text-caption font-bold uppercase tracking-wider text-[var(--app-primary-light)] backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-[var(--app-primary)]" />
                      Senior Pastor
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-headline text-heading-md font-normal leading-tight text-white group-hover:text-[var(--app-primary-light)] transition-colors">
                      {fullName}
                    </h3>

                    {pastor.bio ? (
                      <p className="mt-3 line-clamp-3 font-ui text-body-md leading-relaxed text-white/75">
                        {pastor.bio}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onOpenBio(pastor);
                      }}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--app-primary)_50%,transparent)] bg-[color-mix(in_srgb,var(--app-primary)_12%,transparent)] px-4 py-2 font-ui text-caption font-bold uppercase tracking-wider text-[var(--app-primary-light)] transition-all duration-200 group-hover:border-[var(--app-primary)] group-hover:bg-[var(--app-primary)] group-hover:text-black"
                    >
                      <span>Read biography</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>

                    <Quote className="h-5 w-5 text-white/20" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
