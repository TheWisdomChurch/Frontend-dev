'use client';

import Image from 'next/image';
import { ArrowUpRight, Camera, MessageCircle, PlayCircle } from 'lucide-react';

import { communityLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '@/shared/assets';
import { BaseModal } from './Base';
import type { JoinCommunityModalProps } from '@/lib/types';

const iconMap = {
  whatsapp: MessageCircle,
  instagram: Camera,
  youtube: PlayCircle,
};

export default function JoinCommunityModal({
  isOpen,
  onClose,
}: JoinCommunityModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Stay Connected"
      subtitle="Choose a platform and join the Wisdom House family online."
      maxWidth="max-w-lg"
      forceBottomSheet
    >
      <div className="space-y-5">
        {/* Brand row */}
        <div className="flex items-center gap-3 pb-1">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-black/40"
            // eslint-disable-next-line no-restricted-syntax
            style={{ borderRadius: 'var(--radius-badge)' }}
          >
            <Image
              src={WisdomeHouseLogo}
              alt="The Wisdom Church"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div>
            <p className="font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              The Wisdom Church
            </p>
            <p className="font-ui text-[0.68rem] text-white/35">
              Updates · Fellowship · Prayer
            </p>
          </div>
        </div>

        <span className="block h-px w-full bg-white/[0.07]" />

        {/* Platform links */}
        <div className="space-y-2.5">
          {communityLinks.map(link => {
            const Icon = link.iconFA
              ? iconMap[link.icon as keyof typeof iconMap]
              : null;

            return (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 border border-white/[0.07] bg-white/[0.03] p-4 transition duration-200 hover:border-white/15 hover:bg-white/[0.06]"
                // eslint-disable-next-line no-restricted-syntax
                style={{ borderRadius: 'var(--radius-card)' }}
              >
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center text-white"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{
                    background: `linear-gradient(135deg, ${link.bgColor}, ${link.hoverColor})`,
                    borderRadius: 'var(--radius-badge)',
                  }}
                >
                  {Icon ? <Icon className="h-4.5 w-4.5" /> : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-ui text-[0.82rem] font-semibold text-white">
                    {link.title}
                  </p>
                  <p className="mt-0.5 font-ui text-[0.72rem] leading-[1.6] text-white/45 line-clamp-1">
                    {link.description}
                  </p>
                </div>

                <ArrowUpRight className="h-4 w-4 shrink-0 text-white/25 transition group-hover:text-[var(--app-primary)]" />
              </a>
            );
          })}
        </div>

        <p className="text-center font-ui text-[0.65rem] uppercase tracking-[0.15em] text-white/22">
          Turn on notifications to never miss updates.
        </p>
      </div>
    </BaseModal>
  );
}
