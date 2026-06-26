'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

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
          <div className="mx-auto max-w-[660px] text-center">
            {/* Gold rule */}
            <span
              className="mx-auto mb-10 block h-[2px] w-10 bg-[var(--app-primary)]"
              aria-hidden="true"
            />

            <h2
              className="font-headline font-normal leading-[0.98] text-white"
              style={{ fontSize: 'var(--type-display-md)' }}
            >
              Your generosity
              <br />
              <em className="not-italic text-[var(--app-primary)]">
                builds
              </em>{' '}
              the house.
            </h2>

            <p className="mx-auto mt-8 max-w-[460px] text-[0.95rem] leading-[1.8] text-white/50 italic">
              &ldquo;As each has purposed in his heart, so let him give… God
              loves a cheerful giver.&rdquo;
              <br />
              <span className="not-italic text-white/30">
                2 Corinthians 9:7
              </span>
            </p>

            {/* Primary CTA(s) */}
            {loading ? null : givingOptions.length > 0 ? (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                {givingOptions.slice(0, 3).map(opt => (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => handleGive(opt)}
                    className="inline-flex h-12 items-center gap-2 bg-[var(--app-primary)] px-8 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-[#0d0a06] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
                    style={{ borderRadius: 'var(--radius-button)' }}
                  >
                    {opt.title}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
                  className="inline-flex h-12 items-center gap-2 bg-[var(--app-primary)] px-8 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-[#0d0a06] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
                  style={{ borderRadius: 'var(--radius-button)' }}
                >
                  Give Online
                </button>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleContactCall}
                className="inline-flex h-10 items-center gap-2 border border-[var(--app-primary)]/40 px-6 text-[0.75rem] font-semibold text-[var(--app-primary)] transition hover:border-[var(--app-primary)] active:scale-[0.98]"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                Other ways to give
              </button>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center px-5 text-[0.75rem] text-white/35 transition hover:text-white/65"
              >
                Contact us
              </Link>
            </div>

            {/* Trust line */}
            <p className="mt-10 text-[0.68rem] uppercase tracking-[0.18em] text-white/20">
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
