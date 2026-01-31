// components/ui/Homepage/HeroHighlights.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, Radio, Users, ArrowRight, X } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { lightShades } from '@/components/colors/colorScheme';
import { Container } from '@/components/layout';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';

const highlights = [
  {
    title: 'Wave Sundays',
    meta: 'Two vibrant gatherings',
    detail: 'Sundays • 9:00 AM (WAT)',
    description: 'Spirit-filled worship, teaching, and community moments.',
    icon: CalendarClock,
    href: '/contact',
    actionLabel: 'Plan a visit',
  },
  {
    title: 'Live Stream',
    meta: 'Join our online family',
    detail: 'YouTube + Mixlr every service',
    description: 'Stay in the flow from anywhere on earth.',
    icon: Radio,
    href: '/resources/sermons',
    actionLabel: 'Watch now',
  },
  {
    title: 'Serve & Belong',
    meta: 'Creative, worship & outreach',
    detail: 'Join a team this month',
    description: 'Put your gifts to work in music, media, youth, or prayer.',
    icon: Users,
    href: '#join',
    actionLabel: 'Join a team',
  },
];

export default function HeroHighlights() {
  const { colorScheme = lightShades } = useTheme();
  const [modal, setModal] = useState<'visit' | 'watch' | 'join' | null>(null);
  const { open } = useServiceUnavailable();

  const modalCopy = {
    visit: {
      title: 'Plan your visit',
      description: 'Tell us when you’re coming and we’ll reserve seats, parking, and a welcome guide.',
      cta: 'Confirm visit',
    },
    watch: {
      title: 'Watch live or on-demand',
      description: 'Share your email to get a reminder 30 minutes before we go live.',
      cta: 'Notify me',
    },
    join: {
      title: 'Join a serve team',
      description: 'Pick an area to serve. We’ll connect you with the team lead in under 24 hours.',
      cta: 'Send interest',
    },
  } as const;

  const renderModal = () => {
    if (!modal) return null;
    const copy = modalCopy[modal];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)} />
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0f0f0f] p-6 shadow-2xl text-white"
          >
            <button
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 text-white/70 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-2 pr-8">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Quick form</p>
              <h3 className="text-2xl font-black">{copy.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{copy.description}</p>
            </div>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setModal(null);
                open({
                  title: 'Service not available yet',
                  message:
                    'We are polishing this experience for production. Please check back soon.',
                  actionLabel: 'Okay, thanks',
                });
              }}
            >
              <input
                type="text"
                placeholder="Full name"
                className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
                required
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
                required
              />
              {modal === 'visit' ? (
                <input
                  type="date"
                  className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
                  required
                />
              ) : (
                <input
                  type="text"
                  placeholder="Which team? (media, music, hospitality)"
                  className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white text-sm outline-none focus:border-primary"
                  required
                />
              )}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black font-semibold py-3 text-sm hover:scale-[1.01] transition"
              >
                {copy.cta} <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-white/50 text-xs">
                We confirm by email and send a reminder. No spam, ever.
              </p>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <section className="relative z-30" style={{ background: '#0b0b0b' }}>
      <Container size="xl" className="relative py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#111] shadow-xl"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08 * index, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ translateY: -6, transition: { duration: 0.25 } }}
              >
                <div className="relative p-4 sm:p-5 lg:p-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.14em] text-white/70 font-semibold">
                        {item.meta}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 shadow-inner"
                      style={{
                        background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                        boxShadow: `0 20px 35px ${colorScheme.opacity.primary30}`,
                      }}
                    >
                      <Icon className="h-5 w-5 text-black" />
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {item.detail}
                  </p>
                  <p className="text-xs leading-relaxed text-white/75">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <Link href={item.href} className="inline-flex" onClick={(e) => {
                      e.preventDefault();
                      if (item.title === 'Wave Sundays') setModal('visit');
                      else if (item.title === 'Live Stream') setModal('watch');
                      else setModal('join');
                    }}>
                      <CustomButton
                        variant="outline"
                        size="sm"
                        curvature="full"
                        className="border border-white/30 text-[11px] text-white"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.12)',
                          color: '#fff',
                          borderColor: 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {item.actionLabel}
                      </CustomButton>
                    </Link>

                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-white/70">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: colorScheme.primary }}
                      />
                      <span>Always on mission</span>
                    </div>
                  </div>
                </div>

              </motion.article>
            );
          })}
        </div>
      </Container>
      {renderModal()}
    </section>
  );
}
