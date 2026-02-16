'use client';

import Image from 'next/image';
import { WisdomeHouseLogo } from '@/components/assets';

interface LoaderProps {
  label?: string;
}

export default function Loader({
  label = 'We are Equipped and Empowered',
}: LoaderProps) {
  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center px-6 text-center">
        <div className="loader-ring-shell relative mb-5 h-24 w-24">
          <span className="loader-ring-outer absolute inset-[-8px] rounded-full border border-[#f7de12]/35" />
          <span className="loader-ring-inner absolute inset-0 rounded-full border border-white/20" />
          <div className="absolute inset-0 rounded-full bg-black/80 shadow-[0_0_36px_rgba(247,222,18,0.22)]" />
          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              src={WisdomeHouseLogo}
              alt="The Wisdom Church"
              width={64}
              height={64}
              priority
              className="h-14 w-14 object-contain sm:h-16 sm:w-16"
            />
          </div>
        </div>

        <p className="max-w-xs text-sm font-medium tracking-[0.08em] text-white/90 sm:text-base">
          {label}
        </p>

        <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
          <span className="loader-dot h-1.5 w-1.5 rounded-full bg-[#f7de12]" />
          <span className="loader-dot h-1.5 w-1.5 rounded-full bg-[#f7de12]" />
          <span className="loader-dot h-1.5 w-1.5 rounded-full bg-[#f7de12]" />
        </div>
      </div>

      <style jsx>{`
        .loader-ring-shell {
          animation: loaderPulse 1.8s ease-in-out infinite;
        }

        .loader-ring-outer {
          animation: loaderSpin 2.4s linear infinite;
        }

        .loader-dot {
          animation: loaderDots 1.2s ease-in-out infinite;
        }

        .loader-dot:nth-child(2) {
          animation-delay: 0.15s;
        }

        .loader-dot:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes loaderSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes loaderPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        @keyframes loaderDots {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.55;
          }
          40% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

