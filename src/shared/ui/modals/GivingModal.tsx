'use client';

import Image from 'next/image';
import { IMAGE_QUALITY } from '@/shared/constants';
import { useCallback, useState } from 'react';
import { Check, Copy, ShieldCheck } from 'lucide-react';

import { BaseModal, modalStyles } from './Modal';
import { H3, H4, BodySM, Caption } from '@/shared/text';
import { Button } from '@/shared/ui/button';
import type { GivingModalProps } from '@/lib/types';

export default function GivingModal({
  isOpen,
  onClose,
  givingOption,
}: GivingModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const displayedCopiedIndex = isOpen ? copiedIndex : null;

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

  // Defensive: the giving options API is admin-configured server-side data,
  // not a compile-time constant — an option with a missing/malformed
  // `accounts` array must not crash the whole modal on open.
  const accounts = Array.isArray(givingOption.accounts)
    ? givingOption.accounts
    : [];

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
        <section className="overflow-hidden min-w-0 border border-[var(--app-primary)]/15 bg-[var(--app-primary)]/8 p-5">
          <blockquote
            className="pl-4"
            // eslint-disable-next-line no-restricted-syntax
            style={{ borderLeft: '2px solid var(--app-primary)' }}
          >
            <p className="font-ui text-body-sm italic leading-[1.85] text-white/65">
              &ldquo;Each of you should give what you have decided in your heart
              to give, not reluctantly or under compulsion, for God loves a
              cheerful giver.&rdquo;
            </p>
            <p className="mt-3 font-ui text-label font-bold text-[var(--app-primary)]">
              2 Corinthians 9:7
            </p>
          </blockquote>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className={modalStyles.sectionTitle}>Transfer details</p>
              <H3 className="mt-2 text-white">Account Details</H3>
            </div>

            <div className="hidden items-center gap-1.5 border border-white/10 bg-white/[0.04] px-3 py-1.5 font-ui text-caption font-semibold text-white/50 sm:flex">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--app-primary)]" />
              Secure giving
            </div>
          </div>

          <div className="space-y-4">
            {accounts.length === 0 ? (
              <p className="font-ui text-body-sm leading-[1.7] text-white/45">
                Account details are being updated. Please use &ldquo;Other ways
                to give&rdquo; below or contact us to complete your gift.
              </p>
            ) : null}
            {accounts.map((account, index) => {
              const isCopied = displayedCopiedIndex === index;

              return (
                <article
                  key={`${account.bank}-${account.accountNumber}-${index}`}
                  className="overflow-hidden border border-white/[0.07] bg-white/[0.04]"
                >
                  <div className="flex items-center gap-4 border-b border-white/10 p-4 sm:p-5">
                    <div className="grid h-10 w-10 flex-none place-items-center overflow-hidden border border-white/10 bg-black/30">
                      {account.image ? (
                        <Image
                          quality={IMAGE_QUALITY}
                          src={account.image}
                          alt={account.bank}
                          width={48}
                          height={48}
                          className="h-full w-full object-contain p-1"
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

                      <div className="mt-3 flex items-center gap-3 border border-white/10 bg-black/30 px-4 py-3">
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

        <p className="font-ui text-label leading-[1.75] text-white/35">
          After transfer, keep your receipt for reference. Thank you for giving
          cheerfully and supporting the work of ministry.
        </p>
      </div>
    </BaseModal>
  );
}
