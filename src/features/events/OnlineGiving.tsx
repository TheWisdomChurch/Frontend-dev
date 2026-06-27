'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Phone } from 'lucide-react';

import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import GivingModal from '@/shared/ui/modals/GivingModal';
import { handleContactCall } from '@/shared/utils/functionUtils/contactUtils';
import apiClient from '@/lib/api';
import type { GivingOption } from '@/lib/types';
import { Section, Container } from '@/shared/layout';

export default function OnlineGiving() {
  const { open } = useServiceUnavailable();

  const [givingOptions, setGivingOptions] = useState<GivingOption[]>([]);
  const [selected, setSelected] = useState<GivingOption | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiClient
      .listGivingOptions()
      .then(opts => {
        if (mounted) setGivingOptions(Array.isArray(opts) ? opts : []);
      })
      .catch(() => {
        if (mounted) setGivingOptions([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleGive = useCallback(async (option: GivingOption) => {
    setSelected(option);
    setModalOpen(true);
    try {
      await apiClient.submitGivingIntent({
        title: option.title,
        description: option.description,
        sourceChannel: 'frontend:web:online-giving',
        metadata: { page: 'home', component: 'OnlineGiving' },
      });
    } catch {
      // non-blocking
    }
  }, []);

  return (
    <>
      <Section padding="none" className="bg-[var(--app-dark)]">
        <Container size="xl" className="py-section-lg">
          <div className="mx-auto max-w-[720px]">
            {/* Gold rule */}
            <span
              className="mx-auto mb-10 block h-[2px] w-10 bg-[var(--app-primary)]"
              aria-hidden="true"
            />

            {/* Headline */}
            <h2
              className="text-center font-headline font-normal leading-[0.98] text-white"
              // eslint-disable-next-line no-restricted-syntax
              style={{ fontSize: 'var(--type-display-md)' }}
            >
              Your generosity
              <br />
              <em className="not-italic text-[var(--app-primary)]">
                builds
              </em>{' '}
              the house.
            </h2>

            {/* Scripture */}
            <p className="mx-auto mt-7 max-w-[460px] text-center text-[0.95rem] italic leading-[1.8] text-white/45">
              &ldquo;As each has purposed in his heart, so let him give… God
              loves a cheerful giver.&rdquo;
              <br />
              <span className="not-italic text-white/25">
                2 Corinthians 9:7
              </span>
            </p>

            {/* Giving options */}
            {!loading && givingOptions.length > 0 ? (
              <div
                className={`mt-12 grid gap-4 ${
                  givingOptions.length === 1
                    ? 'max-w-sm mx-auto'
                    : givingOptions.length === 2
                      ? 'sm:grid-cols-2'
                      : 'sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {givingOptions.slice(0, 3).map(opt => (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => handleGive(opt)}
                    className="group relative flex flex-col p-6 text-left border border-white/10 bg-white/[0.04] transition-all duration-300 hover:border-[var(--app-primary)]/40 hover:bg-white/[0.07] hover:shadow-[inset_0_1px_0_rgba(201,150,26,0.15)]"
                    // eslint-disable-next-line no-restricted-syntax
                    style={{ borderRadius: 'var(--radius-card)' }}
                  >
                    {/* Gold top accent */}
                    <span
                      className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[var(--app-primary)] transition-transform duration-300 group-hover:scale-x-100"
                      aria-hidden="true"
                      // eslint-disable-next-line no-restricted-syntax
                      style={{
                        borderRadius:
                          'var(--radius-card) var(--radius-card) 0 0',
                      }}
                    />

                    {/* Icon */}
                    <div
                      className="mb-4 flex h-10 w-10 items-center justify-center bg-[var(--app-primary)]/10 transition duration-300 group-hover:bg-[var(--app-primary)]/18"
                      // eslint-disable-next-line no-restricted-syntax
                      style={{ borderRadius: 'var(--radius-badge)' }}
                    >
                      <Heart className="h-4 w-4 text-[var(--app-primary)]" />
                    </div>

                    <p className="font-ui text-[0.82rem] font-bold text-white">
                      {opt.title}
                    </p>
                    {opt.description ? (
                      <p className="mt-1.5 font-ui text-[0.76rem] leading-[1.65] text-white/45">
                        {opt.description}
                      </p>
                    ) : null}

                    <span className="mt-auto flex items-center justify-between pt-5">
                      <span className="font-ui text-[0.72rem] font-semibold text-[var(--app-primary)]/70 transition group-hover:text-[var(--app-primary)]">
                        Give now
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-white/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--app-primary)]" />
                    </span>
                  </button>
                ))}
              </div>
            ) : !loading ? (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() =>
                    open({
                      title: 'Coming soon',
                      message:
                        'Our online giving portal is being set up. Please check back.',
                      actionLabel: 'Got it',
                    })
                  }
                  className="inline-flex h-12 items-center gap-2 bg-[var(--app-primary)] px-8 font-ui text-[0.82rem] font-bold uppercase tracking-[0.1em] text-[#0d0a06] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ borderRadius: 'var(--radius-button)' }}
                >
                  Give Online
                </button>
              </div>
            ) : null}

            {/* Secondary actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleContactCall}
                className="inline-flex h-10 items-center gap-2 border border-white/12 px-5 font-ui text-[0.75rem] font-semibold text-white/50 transition hover:border-white/22 hover:text-white/80 active:scale-[0.98]"
                // eslint-disable-next-line no-restricted-syntax
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                <Phone className="h-3.5 w-3.5" />
                Other ways to give
              </button>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center px-5 font-ui text-[0.75rem] text-white/30 transition hover:text-white/65"
              >
                Contact us
              </Link>
            </div>

            {/* Trust line */}
            <p className="mt-10 text-center font-ui text-[0.65rem] uppercase tracking-[0.18em] text-white/18">
              100% Secured · Instant Receipt · Tax Deductible
            </p>
          </div>
        </Container>
      </Section>

      {selected && (
        <GivingModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          givingOption={selected}
        />
      )}
    </>
  );
}
