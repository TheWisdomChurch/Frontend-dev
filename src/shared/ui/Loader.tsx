'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { IMAGE_QUALITY } from '@/shared/constants';
import { WisdomeHouseLogo } from '@/shared/assets';

interface LoaderProps {
  label?: string;
  subLabel?: string;
  fullscreen?: boolean;
}

const textVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Loader({
  label = 'Equipped & Empowered for Greatness',
  subLabel = 'Preparing your experience',
  fullscreen = true,
}: LoaderProps) {
  return (
    <div
      className={[
        fullscreen ? 'fixed inset-0 z-[1100]' : 'relative min-h-[420px] w-full',
        'flex items-center justify-center overflow-hidden bg-[var(--app-dark)] text-white',
      ].join(' ')}
      role="status"
      aria-live="polite"
      aria-label={subLabel}
    >
      {/* Single soft ambient glow — calm, not busy */}
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--app-primary)]/[0.08] blur-[90px] motion-safe:animate-[loader-glow_4s_ease-in-out_infinite] sm:h-[26rem] sm:w-[26rem]" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 text-center">
        {/* Mark — one steady ring, one gentle breathing scale. No competing motion. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: [0.98, 1.03, 0.98],
          }}
          transition={{
            opacity: { duration: 0.5, ease: 'easeOut' },
            scale: {
              duration: 2.6,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: 0.5,
            },
          }}
          className="relative grid h-28 w-28 place-items-center sm:h-32 sm:w-32"
        >
          <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
          <div className="absolute inset-0 rounded-full border-t-2 border-[var(--app-primary)] border-r-transparent border-b-transparent border-l-transparent motion-safe:animate-[loader-spin_1.6s_linear_infinite]" />

          <div className="relative grid h-20 w-20 place-items-center rounded-[1.75rem] border border-white/[0.08] bg-black/50 shadow-2xl shadow-black/40 backdrop-blur-xl sm:h-[5.5rem] sm:w-[5.5rem]">
            <Image
              quality={IMAGE_QUALITY}
              src={WisdomeHouseLogo}
              alt="The Wisdom Church"
              width={60}
              height={60}
              priority
              className="relative h-12 w-12 object-contain sm:h-14 sm:w-14"
            />
          </div>
        </motion.div>

        <div className="mt-8 space-y-2">
          <motion.p
            custom={0.25}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-balance text-base font-semibold tracking-tight text-white sm:text-lg"
          >
            {label}
          </motion.p>
          <motion.p
            custom={0.35}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-sm text-white/50"
          >
            {subLabel}
          </motion.p>
        </div>

        <motion.div
          custom={0.45}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mt-8 h-[3px] w-40 overflow-hidden rounded-full bg-white/[0.08]"
        >
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-[var(--app-primary)] to-transparent motion-safe:animate-[loader-progress_1.6s_ease-in-out_infinite]" />
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes loader-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes loader-progress {
          0% {
            transform: translateX(-140%);
          }

          100% {
            transform: translateX(240%);
          }
        }

        @keyframes loader-glow {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
