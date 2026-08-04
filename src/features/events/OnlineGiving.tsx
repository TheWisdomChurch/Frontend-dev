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
import { Section, Container } from '@/shared/layout';
import SectionGlow from '@/shared/ui/SectionGlow';
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
      <Section padding="none" className="relative bg-[var(--app-dark)]">
        <SectionGlow />
        <Container size="2xl" className="py-16 sm:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20">
            <div data-gsap="reveal" className="max-w-xl lg:sticky lg:top-28">
              <p className="font-ui text-xs font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Give with purpose
              </p>
              <h2
                className="mt-5 font-sans font-black uppercase leading-[0.92] tracking-[-0.045em] text-white"
                // eslint-disable-next-line no-restricted-syntax
                style={{ fontSize: 'var(--type-display-md)' }}
              >
                Your generosity
                <br />
                <span className="text-[var(--app-primary)]">builds</span> the
                church.
              </h2>

              <blockquote className="mt-8 border-l border-[var(--app-primary)]/60 pl-5 font-ui text-base italic leading-8 text-white/62">
                &ldquo;As each has purposed in his heart, so let him give… God
                loves a cheerful giver.&rdquo;
                <br />
                <cite className="mt-2 block text-xs not-italic uppercase tracking-[0.16em] text-white/38">
                  2 Corinthians 9:7
                </cite>
              </blockquote>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleContactCall}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/16 px-5 font-ui text-xs font-bold text-white/65 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Other ways to give
                </button>
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center gap-2 px-3 font-ui text-xs font-bold text-white/48 transition hover:text-white"
                >
                  Contact us <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Giving options */}
            {!loading && givingOptions.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={staggerViewport}
                className="border-t border-white/14"
              >
                {givingOptions.slice(0, 3).map((opt, index) => (
                  <motion.button
                    key={opt.title}
                    variants={staggerItem}
                    type="button"
                    onClick={() => handleGive(opt)}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-white/14 py-7 text-left transition-colors duration-200 hover:bg-white/[0.035] sm:gap-7 sm:px-5 sm:py-9"
                  >
                    <span className="pt-1 font-ui text-xs tabular-nums text-[var(--app-primary)]">
                      {String(index + 1).padStart(2, '0')}
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
            ) : !loading ? (
              <div className="border-t border-white/14 pt-9 lg:text-left">
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
                  className="inline-flex h-12 items-center gap-2 bg-[var(--app-primary)] px-8 font-ui text-body-sm font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
                >
                  Give Online
                </button>
              </div>
            ) : null}
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
