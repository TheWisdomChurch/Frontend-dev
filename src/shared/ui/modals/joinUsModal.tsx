'use client';

import Image from 'next/image';
import {
  ArrowUpRight,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Users2,
} from 'lucide-react';
import { Camera, PlayCircle } from 'lucide-react';

import { communityLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '@/shared/assets';
import { H3, H4, BodySM, Caption } from '@/shared/text';
import { BaseModal } from './Base';
import type { JoinCommunityModalProps } from '@/lib/types';

const iconMap = {
  whatsapp: MessageCircle,
  instagram: Camera,
  youtube: PlayCircle,
};

const communityStats = [
  {
    title: 'Always Active',
    detail: 'Round-the-clock fellowship',
    icon: CheckCircle2,
    value: '24/7',
  },
  {
    title: 'Live Community',
    detail: 'Real-time interactions',
    icon: Users2,
    value: 'Live',
  },
  {
    title: 'Safe Space',
    detail: 'Secure and welcoming',
    icon: ShieldCheck,
    value: 'Safe',
  },
];

export default function JoinCommunityModal({
  isOpen,
  onClose,
}: JoinCommunityModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Our Community"
      subtitle="Connect with us across different platforms and grow together in faith."
      maxWidth="max-w-2xl"
      forceBottomSheet
    >
      <div className="space-y-6">
        <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-[var(--app-primary)]/20 bg-[var(--app-primary)]/10">
            <div className="relative h-14 w-14">
              <Image
                src={WisdomeHouseLogo}
                alt="The Wisdom House Church Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <BodySM className="mx-auto mt-4 max-w-md text-white/65">
            Choose your preferred platform and stay connected to updates,
            fellowship, prayers, and ministry moments.
          </BodySM>
        </div>

        <div className="grid gap-3">
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
                className="group rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--app-primary)]/35 hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-white shadow-lg"
                    // eslint-disable-next-line no-restricted-syntax
                    style={{
                      background: `linear-gradient(135deg, ${link.bgColor}, ${link.hoverColor})`,
                    }}
                  >
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <H3 className="truncate text-white">{link.title}</H3>
                    <BodySM className="mt-1 line-clamp-2 text-white/58">
                      {link.description}
                    </BodySM>
                  </div>

                  <div className="grid h-10 w-10 flex-none place-items-center rounded-full border border-white/10 bg-black/25 text-white/55 transition group-hover:border-[var(--app-primary)]/40 group-hover:text-[var(--app-primary)]">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {communityStats.map(item => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[1.15rem] border border-white/10 bg-black/25 p-4 text-center"
              >
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
                  <Icon className="h-4 w-4" />
                </div>

                <BodySM weight="semibold" className="mt-3 text-white">
                  {item.title}
                </BodySM>
                <Caption className="mt-1 text-white/48">{item.detail}</Caption>
              </div>
            );
          })}
        </div>

        <div className="rounded-[1.25rem] border border-[var(--app-primary)]/20 bg-[var(--app-primary)]/10 p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <H4 className="text-white">Quick tip</H4>
              <BodySM className="mt-1 text-white/62">
                Turn on notifications so you never miss updates from the
                ministry.
              </BodySM>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
