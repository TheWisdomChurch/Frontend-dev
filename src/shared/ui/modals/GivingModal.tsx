'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Check, Copy, Gift, ShieldCheck } from 'lucide-react';

import { BaseModal, modalStyles } from './Base';
import { H3, H4, BodySM, Caption } from '@/shared/text';
import { Button } from '@/shared/utils/buttons';
import type { GivingModalProps } from '@/lib/types';

export default function GivingModal({
  isOpen,
  onClose,
  givingOption,
}: GivingModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCopiedIndex(null);
    }
  }, [isOpen]);

  const copyToClipboard = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);

      window.setTimeout(() => {
        setCopiedIndex(null);
      }, 1800);
    } catch {
      setCopiedIndex(null);
    }
  }, []);

  if (!givingOption) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={givingOption.title}
      subtitle={givingOption.description}
      maxWidth="max-w-2xl"
      forceBottomSheet
    >
      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-[1.35rem] border border-[var(--app-primary)]/20 bg-[var(--app-primary)]/10 p-5 sm:p-6">
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-[var(--app-primary)]/20 blur-3xl" />

          <div className="relative flex gap-4">
            <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl border border-[var(--app-primary)]/20 bg-black/25 text-[var(--app-primary)]">
              <Gift className="h-5 w-5" />
            </div>

            <div>
              <BodySM className="italic text-white/78">
                "Each of you should give what you have decided in your heart to
                give, not reluctantly or under compulsion, for God loves a
                cheerful giver."
              </BodySM>
              <BodySM weight="bold" className="mt-3 text-[var(--app-primary)]">
                2 Corinthians 9:7
              </BodySM>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className={modalStyles.sectionTitle}>Transfer details</p>
              <H3 className="mt-2 text-white">Account Details</H3>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/55 sm:flex">
              <ShieldCheck className="h-4 w-4 text-[var(--app-primary)]" />
              Secure giving
            </div>
          </div>

          <div className="space-y-4">
            {givingOption.accounts.map((account, index) => {
              const isCopied = copiedIndex === index;

              return (
                <article
                  key={`${account.bank}-${account.accountNumber}-${index}`}
                  className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20"
                >
                  <div className="flex items-center gap-4 border-b border-white/10 p-4 sm:p-5">
                    <div className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                      {account.image ? (
                        <Image
                          src={account.image}
                          alt={account.bank}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-black text-[var(--app-primary)]">
                          {account.bank.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <Caption className="text-white/45">Bank</Caption>
                      <H4 className="truncate text-white">{account.bank}</H4>
                    </div>
                  </div>

                  <div className="grid gap-0 sm:grid-cols-[1.1fr_0.9fr]">
                    <div className="border-b border-white/10 p-4 sm:border-b-0 sm:border-r sm:p-5">
                      <Caption className="text-white/45">
                        Account Number
                      </Caption>

                      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                        <code className="min-w-0 flex-1 break-all font-mono text-lg font-bold tracking-[0.08em] text-white sm:text-xl">
                          {account.accountNumber}
                        </code>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            copyToClipboard(account.accountNumber, index)
                          }
                          className={`h-10 w-10 flex-none rounded-full transition ${
                            isCopied
                              ? 'bg-emerald-400/15 text-emerald-300'
                              : 'bg-[var(--app-primary)]/10 text-[var(--app-primary)] hover:bg-[var(--app-primary)]/20'
                          }`}
                          aria-label={
                            isCopied
                              ? 'Account number copied'
                              : 'Copy account number'
                          }
                          title={isCopied ? 'Copied!' : 'Copy account number'}
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {isCopied ? (
                        <Caption
                          weight="semibold"
                          className="mt-2 text-emerald-300"
                        >
                          Account number copied.
                        </Caption>
                      ) : null}
                    </div>

                    <div className="p-4 sm:p-5">
                      <Caption className="text-white/45">Account Name</Caption>
                      <BodySM
                        weight="semibold"
                        className="mt-3 break-words text-white/85"
                      >
                        {account.accountName}
                      </BodySM>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="rounded-[1.2rem] border border-white/10 bg-black/25 px-4 py-3">
          <BodySM className="text-white/58">
            After transfer, keep your receipt for reference. Thank you for
            giving cheerfully and supporting the work of ministry.
          </BodySM>
        </div>
      </div>
    </BaseModal>
  );
}
