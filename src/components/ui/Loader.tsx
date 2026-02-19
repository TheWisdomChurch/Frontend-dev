'use client';

import Image from 'next/image';
import { WisdomeHouseLogo, videoBg } from '@/components/assets';

interface LoaderProps {
  label?: string;
}

export default function Loader({
  label = 'Equipped Empowered for Greatness',
}: LoaderProps) {
  return (
    <div
      className="fixed inset-0 z-[11000] flex items-center justify-center overflow-hidden bg-[#030303]"
      role="status"
      aria-live="polite"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={videoBg} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,12,0.85),rgba(8,16,20,0.72)_40%,rgba(2,6,12,0.9))]" />
      <div className="loader-ambient loader-ambient-top" />
      <div className="loader-ambient loader-ambient-bottom" />
      <div className="loader-grid" />

      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
        <div className="loader-stage relative mb-6 h-28 w-28 sm:h-32 sm:w-32">
          <span className="loader-orbit loader-orbit-fast" />
          <span className="loader-orbit loader-orbit-slow" />
          <span className="loader-ripple" />
          <div className="loader-core">
            <Image
              src={WisdomeHouseLogo}
              alt="The Wisdom Church"
              width={72}
              height={72}
              priority
              className="h-14 w-14 object-contain drop-shadow-[0_0_16px_rgba(247,222,18,0.4)] sm:h-16 sm:w-16"
            />
          </div>
        </div>

        <p className="max-w-xs text-sm font-semibold tracking-[0.08em] text-white sm:text-base">
          {label}
        </p>

        <div className="loader-progress" aria-hidden="true">
          <span className="loader-progress-fill" />
        </div>

        <div className="mt-4 flex items-center gap-2" aria-hidden="true">
          <span className="loader-bead h-1.5 w-1.5 rounded-full bg-[#f7de12]" />
          <span className="loader-bead h-1.5 w-1.5 rounded-full bg-[#f7de12]" />
          <span className="loader-bead h-1.5 w-1.5 rounded-full bg-[#f7de12]" />
          <span className="loader-bead h-1.5 w-1.5 rounded-full bg-[#f7de12]" />
        </div>
      </div>

      <style jsx>{`
        .loader-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(circle at center, black, transparent 75%);
          animation: gridDrift 10s linear infinite;
        }

        .loader-ambient {
          position: absolute;
          width: 40vw;
          height: 40vw;
          border-radius: 999px;
          filter: blur(80px);
          opacity: 0.35;
        }

        .loader-ambient-top {
          top: -10vw;
          left: -8vw;
          background: radial-gradient(circle, rgba(247, 222, 18, 0.35), transparent 70%);
          animation: ambientFloat 6s ease-in-out infinite;
        }

        .loader-ambient-bottom {
          right: -10vw;
          bottom: -10vw;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.16), transparent 70%);
          animation: ambientFloat 6s ease-in-out infinite reverse;
        }

        .loader-stage {
          animation: stagePulse 2s ease-in-out infinite;
        }

        .loader-core {
          position: absolute;
          inset: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background:
            radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.8) 60%),
            linear-gradient(135deg, rgba(247, 222, 18, 0.26), rgba(0, 0, 0, 0.85));
          border: 1px solid rgba(255, 255, 255, 0.24);
          box-shadow:
            0 0 0 1px rgba(247, 222, 18, 0.25),
            0 12px 40px rgba(247, 222, 18, 0.24);
          animation: coreBreath 2.3s ease-in-out infinite;
        }

        .loader-orbit {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 1px solid transparent;
          pointer-events: none;
        }

        .loader-orbit-fast {
          border-top-color: rgba(247, 222, 18, 0.95);
          border-left-color: rgba(247, 222, 18, 0.5);
          box-shadow: 0 0 28px rgba(247, 222, 18, 0.25);
          animation: orbitFast 2.2s linear infinite;
        }

        .loader-orbit-slow {
          inset: -9px;
          border-right-color: rgba(255, 255, 255, 0.7);
          border-bottom-color: rgba(247, 222, 18, 0.45);
          opacity: 0.8;
          animation: orbitSlow 3.8s linear infinite;
        }

        .loader-ripple {
          position: absolute;
          inset: -14px;
          border-radius: 999px;
          border: 1px solid rgba(247, 222, 18, 0.35);
          animation: ripple 2.4s ease-out infinite;
        }

        .loader-progress {
          margin-top: 14px;
          width: min(240px, 70vw);
          height: 3px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
        }

        .loader-progress-fill {
          display: block;
          width: 40%;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(247, 222, 18, 0.08), #f7de12, rgba(247, 222, 18, 0.08));
          animation: progressSweep 1.8s ease-in-out infinite;
        }

        .loader-bead {
          animation: beadPulse 1.4s ease-in-out infinite;
        }

        .loader-bead:nth-child(2) {
          animation-delay: 0.1s;
        }

        .loader-bead:nth-child(3) {
          animation-delay: 0.2s;
        }

        .loader-bead:nth-child(4) {
          animation-delay: 0.3s;
        }

        @keyframes orbitFast {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbitSlow {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes stagePulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @keyframes coreBreath {
          0%,
          100% {
            box-shadow:
              0 0 0 1px rgba(247, 222, 18, 0.25),
              0 12px 40px rgba(247, 222, 18, 0.24);
          }
          50% {
            box-shadow:
              0 0 0 1px rgba(247, 222, 18, 0.45),
              0 14px 48px rgba(247, 222, 18, 0.34);
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.78);
            opacity: 0;
          }
          35% {
            opacity: 0.8;
          }
          100% {
            transform: scale(1.12);
            opacity: 0;
          }
        }

        @keyframes progressSweep {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(250%);
          }
        }

        @keyframes beadPulse {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-4px) scale(1.15);
            opacity: 1;
          }
        }

        @keyframes ambientFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 14px, 0);
          }
        }

        @keyframes gridDrift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50px, -50px, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader-grid,
          .loader-ambient,
          .loader-stage,
          .loader-core,
          .loader-orbit,
          .loader-ripple,
          .loader-progress-fill,
          .loader-bead {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
