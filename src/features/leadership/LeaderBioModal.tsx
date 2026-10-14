'use client';

import { useId } from 'react';
import Image from 'next/image';
import type { LeadershipMember } from '@/domain/leadership/types';
import { formatLeadershipRole } from '@/domain/leadership/types';
import { BaseModal } from '@/shared/ui/modals/Modal';
import { Button } from '@/shared/ui/button';
import { initials } from '@/features/leadership/LeadershipCards';
import { Quote, Sparkles } from 'lucide-react';
import { IMAGE_QUALITY } from '@/shared/constants';

interface LeaderBioModalProps {
  leader: LeadershipMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderBioModal({
  leader,
  isOpen,
  onClose,
}: LeaderBioModalProps) {
  const bioId = useId();

  if (!leader) return null;

  const fullName = `${leader.firstName} ${leader.lastName}`.trim();
  const roleTitle = formatLeadershipRole(leader.role);
  const bioParagraphs = leader.bio
    ? leader.bio.split('\n').filter(p => p.trim().length > 0)
    : [];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      tone="dark"
      showCloseButton
      showHandle
      title={fullName}
      subtitle={roleTitle}
      forceBottomSheet={false}
    >
      <div className="space-y-6 pt-2">
        <div className="grid gap-6 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-start sm:gap-8">
          {/* Portrait Column */}
          <div className="relative mx-auto aspect-[3/3.8] w-full max-w-[14rem] overflow-hidden rounded-2xl border border-white/15 bg-[var(--app-dark-2)] shadow-2xl sm:mx-0">
            {leader.imageUrl ? (
              <Image
                src={leader.imageUrl}
                alt={fullName}
                fill
                quality={IMAGE_QUALITY}
                sizes="(max-width: 640px) 14rem, 16rem"
                className="object-cover object-center"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(155deg,var(--app-dark-3),var(--app-dark-2))]">
                <span className="font-headline text-5xl font-light text-[var(--app-primary)]">
                  {initials(leader.firstName, leader.lastName)}
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          </div>

          {/* Bio Details Column */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] bg-[color-mix(in_srgb,var(--app-primary)_12%,transparent)] px-3 py-1 font-ui text-caption font-bold uppercase tracking-[0.14em] text-[var(--app-primary-light)]">
                <Sparkles className="h-3 w-3 text-[var(--app-primary)]" />
                {roleTitle}
              </span>

              {leader.department ? (
                <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 font-ui text-caption font-semibold tracking-wide text-white/70">
                  {leader.department}
                </span>
              ) : null}
            </div>

            <h3 className="mt-3 font-headline text-heading-md font-normal leading-tight text-white">
              {fullName}
            </h3>

            {/* Bio Body */}
            <div
              id={bioId}
              className="mt-4 space-y-3 font-ui text-body-md leading-relaxed text-white/80"
            >
              {bioParagraphs.length > 0 ? (
                bioParagraphs.map((para, i) => <p key={i}>{para}</p>)
              ) : (
                <p className="italic text-white/60">
                  Serving faithfully in the pastoral and leadership oversight of
                  The Wisdom Church.
                </p>
              )}
            </div>

            {/* Ministry Commitment Callout */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-white/75">
              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-[var(--app-primary)]" />
              <p className="font-ui text-body-sm italic">
                Shepherding God&apos;s people with wisdom, grace, and an
                unwavering commitment to the transforming power of the Gospel.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Action */}
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            className="min-h-11 px-6 font-ui text-body-sm font-semibold"
          >
            Close
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
