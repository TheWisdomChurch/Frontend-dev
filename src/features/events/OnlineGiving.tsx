'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Phone, ShieldCheck } from 'lucide-react';

import { useServiceUnavailable } from '@/shared/contexts/ServiceUnavailableContext';

const GivingModal = dynamic(() => import('@/shared/ui/modals/GivingModal'), {
  ssr: false,
});
import { handleContactCall } from '@/shared/utils/functionUtils/contactUtils';
import apiClient from '@/lib/api';
import type { GivingOption } from '@/lib/types';
import { Container, SectionHeader, Panel, Section } from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion';

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

  const handlePrimaryGive = useCallback(() => {
    const firstOption = givingOptions[0];
    if (firstOption) {
      handleGive(firstOption);
      return;
    }

    open({
      title: 'Coming soon',
      message:
        'Our online giving portal is being set up. Please check back or contact us for available giving options.',
      actionLabel: 'Got it',
    });
  }, [givingOptions, handleGive, open]);

  return (
    <>
      <Section tone="dark" className="bg-[var(--app-dark-2)]">
        <Container>
          <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:gap-14 xl:gap-20">
            <div className="max-w-xl lg:sticky lg:top-28">
              <SectionHeader
                eyebrow="Give with purpose"
                title="Your generosity"
                accent="builds the church."
                tone="dark"
              />

              <Panel
                tone="dark"
                reveal
                className="mt-8 border-white/12 bg-white/[0.035] p-6 sm:p-7"
              >
                <Heart
                  aria-hidden="true"
                  className="h-5 w-5 text-[var(--app-primary)]"
                />
                <blockquote className="mt-5 font-ui text-body-lg italic leading-relaxed text-white/78">
                  &ldquo;As each has purposed in his heart, so let him give… God
                  loves a cheerful giver.&rdquo;
                </blockquote>
                <cite className="mt-5 block border-t border-white/10 pt-4 font-ui text-caption not-italic font-bold uppercase tracking-[0.16em] text-white/50">
                  2 Corinthians 9:7
                </cite>
              </Panel>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={handlePrimaryGive}
                  className={buttonClass('primary')}
                >
                  Give Online <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleContactCall}
                  className={buttonClass('outline')}
                >
                  <Phone className="h-4 w-4" />
                  Other ways to give
                </button>
              </div>
            </div>

            {/* Giving options */}
            {loading ? (
              <div
                className="overflow-hidden rounded-card border border-white/12 bg-white/[0.025]"
                aria-hidden="true"
              >
                <div className="border-b border-white/10 px-5 py-5 sm:px-7">
                  <span className="h-3 w-32 animate-pulse rounded bg-white/10" />
                </div>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-white/10 px-5 py-7 last:border-b-0 sm:gap-7 sm:px-7 sm:py-9"
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
                className="overflow-hidden rounded-card border border-white/12 bg-white/[0.025]"
              >
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7">
                  <div>
                    <p className="font-ui text-label font-bold uppercase tracking-[0.16em] text-[var(--app-primary)]">
                      Choose an option
                    </p>
                    <p className="mt-1 font-ui text-body-sm text-white/52">
                      Securely continue with your preferred method.
                    </p>
                  </div>
                  <ShieldCheck className="h-5 w-5 shrink-0 text-white/45" />
                </div>
                {givingOptions.slice(0, 3).map((opt, index) => (
                  <motion.button
                    key={opt.title}
                    variants={staggerItem}
                    type="button"
                    onClick={() => handleGive(opt)}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-white/10 px-5 py-7 text-left transition-[background-color,transform] duration-300 hover:bg-white/[0.055] sm:gap-7 sm:px-7 sm:py-9"
                  >
                    <span className="pt-0.5 font-ui text-caption font-bold tracking-[0.16em] text-[var(--app-primary)]/75">
                      0{index + 1}
                    </span>
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
              <Panel
                tone="dark"
                reveal
                className="flex min-h-[19rem] flex-col justify-between border-white/12 bg-white/[0.025] p-6 sm:min-h-[22rem] sm:p-8"
              >
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--app-primary-10)] text-[var(--app-primary)]">
                    <Heart className="h-5 w-5" />
                  </span>
                  <h3 className="mt-7 font-ui text-heading-md font-semibold text-white">
                    Online giving is being prepared.
                  </h3>
                  <p className="mt-4 max-w-lg font-ui text-body-md leading-loose text-white/60">
                    Our giving portal is being set up. In the meantime, reach
                    out and we&rsquo;ll walk you through the ways to give today.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className={buttonClass('outline', 'md', 'self-start')}
                >
                  Contact us
                </Link>
              </Panel>
            )}
          </div>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 font-ui text-label font-semibold text-white/55 transition duration-300 hover:text-white"
          >
            Need help with giving? Contact us{' '}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
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
