'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IMAGE_QUALITY } from '@/shared/constants';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { useState } from 'react';
import { ArrowRight, Check, Loader2, MapPin, Mail, Phone } from 'lucide-react';

import { WisdomeHouseLogo } from '@/shared/assets';
import { Container } from '@/shared/layout';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/cn';

/* ── Social icons ──────────────────────────────────────── */

const Ig = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);
const Yt = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#040404" />
  </svg>
);
const Fb = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

/* ── Data ─────────────────────────────────────────────── */

const EXPLORE = [
  { href: '/about', label: 'About Us' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/events', label: 'Events' },
  { href: '/ministries', label: 'Ministries' },
  { href: '/resources/sermons', label: 'Sermons' },
  { href: '/resources', label: 'Resources' },
];

const CONNECT = [
  { href: '/contact', label: 'Contact' },
  { href: '/pastoral', label: 'Pastoral Care' },
  { href: '/testimonies', label: 'Testimonies' },
  { href: '/serve', label: 'Join a Serve Team' },
  { href: '/giving', label: 'Give Online' },
  { href: '/#visit', label: 'Plan Your Visit' },
];

const SOCIALS = [
  {
    href: SOCIAL_LINKS.instagram,
    label: 'Instagram',
    Icon: Ig,
  },
  {
    href: SOCIAL_LINKS.youtube,
    label: 'YouTube',
    Icon: Yt,
  },
  { href: SOCIAL_LINKS.facebook, label: 'Facebook', Icon: Fb },
];

/* ── Column header ─────────────────────────────────────── */

function ColHead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
      {children}
    </p>
  );
}

/* ── Link list ─────────────────────────────────────────── */

function FooterLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="space-y-3.5">
      {links.map(l => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="group inline-flex items-center gap-1.5 rounded font-ui text-body-sm text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]/50"
          >
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              {l.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ── Component ─────────────────────────────────────────── */

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subState, setSubState] = useState<'idle' | 'loading' | 'done' | 'err'>(
    'idle'
  );

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = email.trim();
    if (!val) return;
    setSubState('loading');
    try {
      await apiClient.subscribe({ email: val });
      setEmail('');
      setSubState('done');
      setTimeout(() => setSubState('idle'), 3000);
    } catch {
      setSubState('err');
      setTimeout(() => setSubState('idle'), 3000);
    }
  };

  return (
    <footer className="border-t border-white/[0.07] bg-[var(--app-dark)]">
      {/* ── Gold top accent line ─────────────────────────── */}
      <div
        className="h-[2px] w-full"
        // eslint-disable-next-line no-restricted-syntax
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--app-primary) 40%, transparent)',
        }}
      />

      <Container size="xl" className="py-20 sm:py-24 lg:py-28">
        {/* Brand + link columns share one grid so column count always
            divides evenly (1 → 3 → 4), instead of a leftover half-empty
            column at tablet widths. */}
        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-14 xl:gap-20">
          {/* Brand ───────────────────────────────────────── */}
          <div className="sm:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="mb-6 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]/50"
              aria-label="The Wisdom Church — home"
            >
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.05]">
                <Image
                  quality={IMAGE_QUALITY}
                  src={WisdomeHouseLogo}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-ui text-eyebrow uppercase tracking-[0.25em] text-white/45">
                  The
                </span>
                <span className="font-ui text-body-sm font-bold uppercase tracking-[0.18em] text-white">
                  Wisdom Church
                </span>
              </div>
            </Link>

            <p className="max-w-sm font-ui text-body-sm leading-[1.85] text-white/60">
              A Spirit-filled community raised to carry God's glory — equipping
              every believer with the Word, prayer, and purpose.
            </p>

            <div className="mt-6 space-y-2">
              <p className="font-ui text-label font-semibold text-white/75">
                {SERVICE_INFO.sunday.day}s · {SERVICE_INFO.sunday.time}
              </p>
              <p className="font-ui text-label font-semibold text-white/75">
                {SERVICE_INFO.dailyPrayer.label} ·{' '}
                {SERVICE_INFO.dailyPrayer.time}
              </p>
            </div>

            <div className="mt-5 space-y-2 font-body text-body-sm text-[color-mix(in_srgb,white_52%,transparent)]">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--app-primary)]/60" />
                {SERVICE_INFO.venue.full}
              </p>
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 transition hover:text-white/80"
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-[var(--app-primary)]/60" />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2 transition hover:text-white/80"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-[var(--app-primary)]/60" />
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>

          {/* Explore ─────────────────────────────────────── */}
          <div>
            <ColHead>Explore</ColHead>
            <FooterLinks links={EXPLORE} />
          </div>

          {/* Connect ─────────────────────────────────────── */}
          <div>
            <ColHead>Connect</ColHead>
            <FooterLinks links={CONNECT} />
          </div>

          {/* Newsletter + Socials ────────────────────────── */}
          <div>
            <ColHead>Stay Connected</ColHead>

            <form onSubmit={handleSubscribe} className="mb-8">
              <p className="mb-3 font-body text-label text-white/50">
                Get weekly reminders and updates.
              </p>
              <div
                className={cn(
                  'flex items-center gap-1 rounded-full border bg-white/[0.04] py-1 pl-4 pr-1 transition',
                  subState === 'err'
                    ? 'border-red-400/40'
                    : 'border-[color-mix(in_srgb,white_12%,transparent)] focus-within:border-[var(--app-primary)]/50 focus-within:bg-white/[0.06]'
                )}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email"
                  aria-label="Email address"
                  disabled={subState === 'loading'}
                  className="h-9 min-w-0 flex-1 bg-transparent font-body text-body-sm text-white outline-none placeholder:text-white/40"
                />
                <button
                  type="submit"
                  disabled={subState === 'loading'}
                  aria-label="Subscribe"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)] text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]/50"
                >
                  {subState === 'loading' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : subState === 'done' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </div>
              {subState === 'done' ? (
                <p className="mt-2 font-body text-caption text-[var(--app-primary)]">
                  Subscribed — thank you!
                </p>
              ) : subState === 'err' ? (
                <p className="mt-2 font-body text-caption text-red-400">
                  Something went wrong — please try again.
                </p>
              ) : null}
            </form>

            <div>
              <p className="mb-3 font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-white/45">
                Follow
              </p>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-[var(--app-primary)]/40 hover:text-[var(--app-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]/50"
                  >
                    <s.Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.07] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-label text-white/45">
            © {new Date().getFullYear()} The Wisdom Church · Lagos, Nigeria
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="font-body text-label text-white/45 transition hover:text-white/75"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="font-body text-label text-white/45 transition hover:text-white/75"
            >
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
