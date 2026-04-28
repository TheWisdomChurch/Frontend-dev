'use client';

import Image from 'next/image';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Users2 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faWhatsapp,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

import { communityLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '@/shared/assets';
import { BaseModal } from './Base';
import type { JoinCommunityModalProps } from '@/lib/types';

const faIconMap = {
  whatsapp: faWhatsapp,
  instagram: faInstagram,
  youtube: faYoutube,
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
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-[#f7de12]/20 bg-[#f7de12]/10">
            <div className="relative h-14 w-14">
              <Image
                src={WisdomeHouseLogo}
                alt="The Wisdom House Church Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/65">
            Choose your preferred platform and stay connected to updates,
            fellowship, prayers, and ministry moments.
          </p>
        </div>

        <div className="grid gap-3">
          {communityLinks.map(link => {
            const faIcon = link.iconFA
              ? faIconMap[link.icon as keyof typeof faIconMap]
              : null;

            return (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#f7de12]/35 hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${link.bgColor}, ${link.hoverColor})`,
                    }}
                  >
                    {faIcon ? (
                      <FontAwesomeIcon icon={faIcon} className="h-5 w-5" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-white">
                      {link.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/58">
                      {link.description}
                    </p>
                  </div>

                  <div className="grid h-10 w-10 flex-none place-items-center rounded-full border border-white/10 bg-black/25 text-white/55 transition group-hover:border-[#f7de12]/40 group-hover:text-[#f7de12]">
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
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#f7de12]/10 text-[#f7de12]">
                  <Icon className="h-4 w-4" />
                </div>

                <p className="mt-3 text-sm font-semibold text-white">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-white/48">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>

        <div className="rounded-[1.25rem] border border-[#f7de12]/20 bg-[#f7de12]/10 p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#f7de12]/10 text-[#f7de12]">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white">Quick tip</h4>
              <p className="mt-1 text-sm leading-6 text-white/62">
                Turn on notifications so you never miss updates from the
                ministry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
