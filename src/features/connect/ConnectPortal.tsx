'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';

import { WhatsappCommunity } from '@/shared/assets';

/* ── Inline social icons ─────────────────────────────── */

const YtIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0d0a06" />
  </svg>
);

const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IgIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const SOCIALS = [
  {
    label: 'YouTube',
    sub: 'Watch & stream',
    href: 'https://www.youtube.com/@wisdomchurchhq',
    Icon: YtIcon,
  },
  {
    label: 'Facebook',
    sub: 'Join the community',
    href: 'https://www.facebook.com/wisdomchurchhq',
    Icon: FbIcon,
  },
  {
    label: 'Instagram',
    sub: 'Follow along',
    href: 'https://www.instagram.com/wisdomchurchhq',
    Icon: IgIcon,
  },
  {
    label: 'X (Twitter)',
    sub: 'Latest updates',
    href: 'https://x.com/wisdomchurchhq',
    Icon: XIcon,
  },
];

export default function ConnectPortal() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--app-dark)]">
      <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-2">
        {/* ── Left — community image ──────────────────────────── */}
        <div className="relative order-2 min-h-[300px] overflow-hidden lg:order-1 lg:min-h-0">
          <Image
            src={WhatsappCommunity}
            alt="Wisdom Church community gathering"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={88}
            className="object-cover object-center"
          />
          {/* Blend into dark bg on right (desktop) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-dark)]/80 via-transparent to-transparent lg:hidden" />
          <div className="absolute inset-y-0 right-0 hidden w-32 bg-gradient-to-r from-transparent to-[var(--app-dark)] lg:block" />
          <div className="absolute inset-y-0 left-0 hidden w-8 bg-gradient-to-l from-transparent to-[var(--app-dark)]/40 lg:block" />
        </div>

        {/* ── Right — social content ──────────────────────────── */}
        <div className="order-1 flex flex-col justify-center px-8 py-14 sm:px-12 lg:order-2 lg:px-14 xl:px-20">
          {/* Eyebrow */}
          <p className="mb-5 font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Stay Connected
          </p>

          {/* Headline */}
          <h2
            className="font-headline font-normal text-white"
            // eslint-disable-next-line no-restricted-syntax
            style={{ fontSize: 'var(--type-display-sm)' }}
          >
            Join our online
            <br />
            community
          </h2>

          {/* Sub-copy */}
          <p className="mt-5 max-w-[400px] font-ui text-[0.92rem] leading-[1.85] text-white/55">
            Watch live services, receive weekly messages, and connect with the
            Wisdom House family wherever you are in the world.
          </p>

          {/* Stream live CTA */}
          <a
            href="https://www.youtube.com/@wisdomchurchhq"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2.5 self-start bg-[var(--app-primary)] px-7 py-3 font-ui text-[0.82rem] font-bold uppercase tracking-[0.1em] text-[#0d0a06] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
            // eslint-disable-next-line no-restricted-syntax
            style={{ borderRadius: 'var(--radius-button)' }}
          >
            <Play className="h-4 w-4 fill-[#0d0a06]" />
            Stream services live
          </a>

          {/* Divider */}
          <span className="mt-10 block h-px w-12 bg-white/10" />

          {/* Follow us */}
          <p className="mt-8 mb-4 font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/28">
            Follow us
          </p>
          <div className="flex flex-wrap gap-3">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 border border-white/10 bg-white/[0.04] px-4 py-2.5 font-ui text-[0.78rem] font-semibold text-white/60 transition hover:border-white/22 hover:bg-white/[0.09] hover:text-white"
                // eslint-disable-next-line no-restricted-syntax
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                <s.Icon />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
