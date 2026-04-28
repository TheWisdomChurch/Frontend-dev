'use client';

import Image from 'next/image';
import { WisdomeHouseLogo } from '@/shared/assets';

interface LoaderProps {
  label?: string;
  subLabel?: string;
  fullscreen?: boolean;
}

export default function Loader({
  label = 'Equipped & Empowered for Greatness',
  subLabel = 'Preparing your experience',
  fullscreen = true,
}: LoaderProps) {
  return (
    <div
      className={[
        fullscreen ? 'fixed inset-0 z-[1100]' : 'relative min-h-[420px] w-full',
        'flex items-center justify-center overflow-hidden bg-[#050505] text-white',
      ].join(' ')}
      role="status"
      aria-live="polite"
      aria-label={subLabel}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/event-placeholder.webp"
      >
        <source src="/videos/videoBg.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(247,222,18,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,rgba(5,5,5,0.45)_0%,rgba(5,5,5,0.82)_100%)]" />

      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:46px_46px] [mask-image:radial-gradient(circle_at_50%_45%,black_22%,transparent_75%)] motion-safe:animate-[loader-grid_14s_linear_infinite]" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7de12]/10 blur-3xl motion-safe:animate-pulse sm:h-96 sm:w-96" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
        <div className="relative grid h-32 w-32 place-items-center sm:h-36 sm:w-36">
          <div className="absolute inset-0 rounded-full border border-[#f7de12]/20" />
          <div className="absolute inset-0 rounded-full border-t border-[#f7de12] border-r-transparent border-b-transparent border-l-transparent motion-safe:animate-[loader-spin_1.8s_linear_infinite]" />
          <div className="absolute inset-3 rounded-full border border-white/10" />
          <div className="absolute inset-3 rounded-full border-r border-white/70 border-t-transparent border-b-transparent border-l-transparent motion-safe:animate-[loader-spin-reverse_3.2s_linear_infinite]" />
          <div className="absolute inset-[-10px] rounded-full border border-[#f7de12]/25 opacity-70 motion-safe:animate-[loader-ripple_2.4s_ease-out_infinite]" />

          <div className="relative grid h-24 w-24 place-items-center rounded-[2rem] border border-white/10 bg-black/60 shadow-2xl shadow-[#f7de12]/15 backdrop-blur-xl sm:h-28 sm:w-28">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
            <Image
              src={WisdomeHouseLogo}
              alt="The Wisdom Church"
              width={74}
              height={74}
              priority
              className="relative h-16 w-16 object-contain drop-shadow-[0_0_18px_rgba(247,222,18,0.38)] sm:h-[72px] sm:w-[72px]"
            />
          </div>
        </div>

        <div className="mt-7 space-y-2">
          <p className="text-balance text-base font-semibold tracking-tight text-white sm:text-lg">
            {label}
          </p>
          <p className="text-sm text-white/60">{subLabel}</p>
        </div>

        <div className="mt-7 h-1 w-56 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#f7de12] to-transparent motion-safe:animate-[loader-progress_1.45s_ease-in-out_infinite]" />
        </div>

        <div className="mt-5 flex items-center gap-2" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f7de12] motion-safe:animate-[loader-dot_1.2s_ease-in-out_infinite]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#f7de12] motion-safe:animate-[loader-dot_1.2s_ease-in-out_0.15s_infinite]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#f7de12] motion-safe:animate-[loader-dot_1.2s_ease-in-out_0.3s_infinite]" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes loader-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes loader-spin-reverse {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes loader-ripple {
          0% {
            transform: scale(0.92);
            opacity: 0.8;
          }

          100% {
            transform: scale(1.18);
            opacity: 0;
          }
        }

        @keyframes loader-progress {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(220%);
          }
        }

        @keyframes loader-dot {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.35;
          }

          50% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        @keyframes loader-grid {
          0% {
            background-position:
              0 0,
              0 0;
          }

          100% {
            background-position:
              46px 46px,
              46px 46px;
          }
        }
      `}</style>
    </div>
  );
}
