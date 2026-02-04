'use client';

import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { BaseModal } from './Base';
import type { GivingModalProps } from '@/lib/types';

export default function GivingModal({
  isOpen,
  onClose,
  givingOption,
}: GivingModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  if (!givingOption) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={givingOption.title}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center">
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {givingOption.description}
          </p>
        </div>

        <div className="rounded-lg sm:rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4 sm:p-6">
          <p className="text-slate-200 italic text-xs sm:text-sm font-medium leading-relaxed mb-2 sm:mb-3">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
          </p>
          <p className="text-amber-400 font-semibold text-xs sm:text-sm text-center">
            2 Corinthians 9:7
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold text-base sm:text-lg mb-4 text-center">
            Account Details
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {givingOption.accounts.map((account, idx) => (
              <div
                key={idx}
                className="rounded-lg sm:rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4 sm:p-6 space-y-4 sm:space-y-5"
              >
                <div className="text-center">
                  <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Bank
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {account.image ? (
                      <Image
                        src={account.image}
                        alt={account.bank}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 flex items-center justify-center">
                        <span className="text-amber-400 font-semibold text-sm">
                          {account.bank.charAt(0)}
                        </span>
                      </div>
                    )}
                    <p className="text-white font-bold text-lg sm:text-2xl break-words">
                      {account.bank}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                <div className="text-center">
                  <p className="text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">
                    Account Number
                  </p>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 bg-slate-900/50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 border border-slate-700/50 mx-auto">
                    <code className="font-mono text-white font-bold text-base sm:text-xl tracking-wider break-all">
                      {account.accountNumber}
                    </code>
                    <button
                      onClick={() => copyToClipboard(account.accountNumber, idx)}
                      className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 ${
                        copiedIndex === idx
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      }`}
                      title={copiedIndex === idx ? 'Copied!' : 'Copy account number'}
                      type="button"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                <div className="text-center">
                  <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Account Name
                  </p>
                  <p className="text-white font-bold text-sm sm:text-lg break-words">
                    {account.accountName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
