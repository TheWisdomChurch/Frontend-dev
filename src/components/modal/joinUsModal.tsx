'use client';

import { communityLinks } from '@/lib/data';
import Image from 'next/image';
import { WisdomeHouseLogo } from '../assets';
import { BaseModal } from './Base';
import type { JoinCommunityModalProps } from '@/lib/types';

export default function JoinCommunityModal({
  isOpen,
  onClose,
}: JoinCommunityModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Our Community"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 mb-4">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
              <Image
                src={WisdomeHouseLogo}
                alt="The Wisdom House Church Logo"
                fill
                className="object-contain p-1"
              />
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Connect with us across different platforms and grow together in faith
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {communityLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${link.bgColor}, ${link.hoverColor})`,
                }}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                <div className="relative p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm sm:text-lg truncate">
                        {link.title}
                      </h3>
                      <p className="text-white/90 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">
                        {link.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <svg
                          className="w-4 h-4 text-white transform -rotate-45"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-lg sm:rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-4 text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 mb-2 sm:mb-3">
              <span className="text-amber-400 text-sm font-bold">24/7</span>
            </div>
            <h4 className="text-white font-medium text-xs sm:text-sm mb-1">Always Active</h4>
            <p className="text-slate-400 text-xs">Round-the-clock fellowship</p>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-4 text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 mb-2 sm:mb-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-white font-medium text-xs sm:text-sm mb-1">Live Community</h4>
            <p className="text-slate-400 text-xs">Real-time interactions</p>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-4 text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 mb-2 sm:mb-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-white font-medium text-xs sm:text-sm mb-1">Safe Space</h4>
            <p className="text-slate-400 text-xs">Secure & welcoming environment</p>
          </div>
        </div>

        <div className="rounded-lg sm:rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-1">Quick tip</h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Turn on notifications so you never miss updates from the ministry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
