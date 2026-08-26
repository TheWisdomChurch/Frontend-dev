'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';
import GivingModal from '@/shared/ui/modals/GivingModal';
import { handleContactCall } from '@/shared/utils/functionUtils/contactUtils';
import apiClient from '@/lib/api';
import type { GivingOption } from '@/lib/types';
import {
  EditorialContainer,
  EditorialHeader,
  EditorialSection,
} from '@/shared/ui/editorial';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion/staggerReveal';

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

  const handleGive = useCallback((option: GivingOption) => {
    setSelected(option);
    setModalOpen(true);
    // Giving-intent tracking is disabled until the backend endpoint is
    // properly configured — re-enable once /giving/intents is ready.
    // apiClient.submitGivingIntent({
    //   title: option.title,
    //   description: option.description,
    //   sourceChannel: 'frontend:web:online-giving',
    //   metadata: { page: 'home', component: 'OnlineGiving' },
    // }).catch(() => {});
  }, []);

  return (
    <>
      <EditorialSection tone="dark">
        <EditorialContainer>
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-6">
            <div className="max-w-xl lg:sticky lg:top-28 lg:col-start-1 lg:row-start-1">
              <EditorialHeader
                eyebrow="Give with purpose"
                title="Your generosity"
                accent="builds the church."
                tone="dark"
              />

              <blockquote className="mt-8 border-l border-[color-mix(in_srgb,var(--app-primary)_60%,transparent)] pl-5 font-ui text-base italic leading-8 text-white/70">
                &ldquo;As each has purposed in his heart, so let him give… God
                loves a cheerful giver.&rdquo;
                <br />
                <cite className="mt-2 block text-xs not-italic uppercase tracking-[0.16em] text-white/55">
                  2 Corinthians 9:7
                </cite>
              </blockquote>
            </div>

            {/* Giving options */}
            {loading ? (
              <div
                className="border-t border-white/15 lg:col-start-2 lg:row-start-1 lg:row-span-2"
                aria-hidden="true"
              >
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-white/15 py-7 sm:gap-7 sm:px-5 sm:py-9"
                  >
                    <span className="h-3 w-4 animate-pulse rounded bg-white/10" />
                    <span className="flex flex-col gap-3">
                      <span className="h-5 w-2/3 max-w-[220px] animate-pulse rounded bg-white/10" />
                      <span className="h-4 w-4/5 max-w-sm animate-pulse rounded bg-white/[0.06]" />
                    </span>
                    <span className="mt-1 hidden h-11 w-11 animate-pulse rounded-full bg-white/[0.06] sm:block" />
                  </div>
                ))}
              </div>
            ) : givingOptions.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={staggerViewport}
                className="border-t border-white/15 lg:col-start-2 lg:row-start-1 lg:row-span-2"
              >
                {givingOptions.slice(0, 3).map(opt => (
                  <motion.button
                    key={opt.title}
                    variants={staggerItem}
                    type="button"
                    onClick={() => handleGive(opt)}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="group grid w-full grid-cols-[1fr_auto] items-start gap-4 border-b border-white/15 py-7 text-left transition-colors duration-200 hover:bg-white/[0.035] sm:gap-7 sm:px-5 sm:py-9"
                  >
                    <span>
                      <span className="block font-ui text-lg font-bold leading-6 text-white sm:text-xl">
                        {opt.title}
                      </span>
                      {opt.description ? (
                        <span className="mt-2 block max-w-lg font-ui text-sm leading-6 text-white/45">
                          {opt.description}
                        </span>
                      ) : null}
                      <span className="mt-4 inline-flex items-center gap-2 font-ui text-xs font-bold uppercase tracking-[0.12em] text-[var(--app-primary)] sm:hidden">
                        Give now <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </span>
                    <span className="mt-1 hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/55 transition duration-200 group-hover:border-[var(--app-primary)] group-hover:bg-[var(--app-primary)] group-hover:text-black sm:flex">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <div className="border-t border-white/15 pt-9 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:text-left">
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
                  className="inline-flex h-12 items-center gap-2 rounded-button bg-[var(--app-primary)] px-8 font-ui text-body-sm font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
                >
                  Give Online
                </button>
              </div>
            )}

            <motion.div
              variants={staggerItem}
              initial="hidden"
              whileInView="show"
              viewport={staggerViewport}
              className="flex flex-wrap items-center gap-3 lg:col-start-1 lg:row-start-2 lg:self-end"
            >
              <button
                type="button"
                onClick={handleContactCall}
                className="inline-flex h-11 items-center gap-2 rounded-button border border-white/15 px-5 font-ui text-xs font-bold text-white/65 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
              >
                <Phone className="h-3.5 w-3.5" />
                Other ways to give
              </button>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 px-3 font-ui text-xs font-bold text-white/50 transition hover:text-white"
              >
                Contact us <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </EditorialContainer>
      </EditorialSection>

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
