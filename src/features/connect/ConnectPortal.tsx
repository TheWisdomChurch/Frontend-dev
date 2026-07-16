'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

import { WhatsappCommunity } from '@/shared/assets';
import { IMAGE_QUALITY } from '@/shared/constants';
import SectionGlow from '@/shared/ui/SectionGlow';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion/staggerReveal';

/* ── Social icons ───────────────────────────────────── */

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

/* WhatsApp icon */
const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const SOCIALS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@wisdomchurchhq',
    Icon: YtIcon,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/wisdomchurchhq',
    Icon: FbIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/wisdomchurchhq',
    Icon: IgIcon,
  },
  {
    label: 'X',
    href: 'https://x.com/wisdomchurchhq',
    Icon: XIcon,
  },
];

export default function ConnectPortal() {
  return (
    <section className="min-w-0 relative w-full overflow-hidden bg-[var(--app-dark)]">
      <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
        {/* ── Left — community image (full image visible, not cropped) ── */}
        <div className="relative order-2 bg-[var(--app-dark)] lg:order-1">
          {/* Mobile: natural aspect ratio so full image shows */}
          <div
            className="relative w-full overflow-hidden lg:hidden"
            // eslint-disable-next-line no-restricted-syntax
            style={{
              aspectRatio: `${WhatsappCommunity.width} / ${WhatsappCommunity.height}`,
            }}
          >
            <Image
              src={WhatsappCommunity}
              alt="Wisdom Church community gathering"
              fill
              sizes="100vw"
              quality={IMAGE_QUALITY}
              className="object-cover object-top"
            />
            {/* Bottom fade into section bg */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--app-dark)] to-transparent" />
          </div>

          {/* Desktop: full column height, object-contain shows full image */}
          <div className="absolute inset-0 hidden lg:block">
            <Image
              src={WhatsappCommunity}
              alt="Wisdom Church community gathering"
              fill
              sizes="50vw"
              quality={IMAGE_QUALITY}
              className="object-contain object-center"
            />
            {/* Right-edge blend into content column */}
            <div className="absolute inset-y-0 right-0 w-36 bg-gradient-to-r from-transparent to-[var(--app-dark)]" />
            {/* Subtle top/bottom vignettes */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--app-dark)]/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--app-dark)]/60 to-transparent" />
          </div>
        </div>

        {/* ── Right — social content ───────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={staggerViewport}
          className="relative order-1 flex flex-col justify-center px-8 py-14 sm:px-12 lg:order-2 lg:px-14 xl:px-20"
        >
          <SectionGlow />

          {/* Eyebrow */}
          <motion.p
            variants={staggerItem}
            className="mb-5 font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]"
          >
            Stay Connected
          </motion.p>

          {/* Headline */}
          <motion.h2
            variants={staggerItem}
            className="font-headline font-normal text-white"
            // eslint-disable-next-line no-restricted-syntax
            style={{ fontSize: 'var(--type-display-md)' }}
          >
            Join our online
            <br />
            community
          </motion.h2>

          {/* Sub-copy */}
          <motion.p
            variants={staggerItem}
            className="mt-5 max-w-[400px] font-ui text-[0.92rem] leading-[1.85] text-white/55"
          >
            Watch live services, receive weekly messages, and connect with the
            Wisdom Church community wherever you are in the world.
          </motion.p>

          {/* Primary CTAs */}
          <motion.div
            variants={staggerItem}
            className="mt-8 flex flex-wrap gap-3"
          >
            {/* Stream live */}
            <a
              href="https://www.youtube.com/@wisdomchurchhq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2.5 bg-[var(--app-primary)] px-6 font-ui text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)] active:scale-[0.98]"
            >
              <Play className="h-3.5 w-3.5 fill-[var(--app-ink)]" />
              Stream services live
            </a>

            {/* WhatsApp community */}
            <a
              href="https://wa.me/2347069995333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2.5 border border-[var(--app-whatsapp)]/30 bg-[var(--app-whatsapp)]/10 px-6 font-ui text-[0.78rem] font-bold text-[var(--app-whatsapp)] transition hover:border-[var(--app-whatsapp)]/50 hover:bg-[var(--app-whatsapp)]/18 active:scale-[0.98]"
            >
              <WaIcon />
              Join WhatsApp community
            </a>
          </motion.div>

          {/* Divider + Follow us */}
          <motion.div variants={staggerItem}>
            <span className="mt-10 block h-px w-12 bg-white/10" />
            <p className="mb-4 mt-8 font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/28">
              Follow us
            </p>
          </motion.div>
          <div className="flex flex-wrap gap-3">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-4 py-2 font-ui text-[0.75rem] font-semibold text-white/55 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
              >
                <s.Icon />
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
