'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, Check, Loader2, Mail, MapPin, Phone } from 'lucide-react';

import { IMAGE_QUALITY } from '@/shared/constants';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { WisdomeHouseLogo } from '@/shared/assets';
import { Container } from '@/shared/ui/Container';
import { buttonClass } from '@/shared/ui/button';
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
    <polygon
      points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
      fill="var(--app-dark)"
    />
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
  { href: '/#giving', label: 'Give Online' },
  { href: '/forms/join', label: 'New Here?' },
];

const SOCIALS = [
  { href: SOCIAL_LINKS.instagram, label: 'Instagram', Icon: Ig },
  { href: SOCIAL_LINKS.youtube, label: 'YouTube', Icon: Yt },
  { href: SOCIAL_LINKS.facebook, label: 'Facebook', Icon: Fb },
];

/* ── Small parts ──────────────────────────────────────── */

function ColHead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary-dark)]">
      {children}
    </p>
  );
}

function FooterLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="space-y-3.5">
      {links.map(l => (
        <li key={l.href}>
          <Link
            href={l.href}
            prefetch={false}
            className="group inline-flex items-center gap-1.5 rounded font-ui text-body-sm text-[var(--app-muted)] transition hover:text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]/50"
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
    <footer className="tone-dark border-t border-[var(--app-border)] bg-[var(--app-dark)] text-[var(--app-text)]">
      <div className="h-px w-full bg-[linear-gradient(90deg,transparent,var(--app-primary),transparent)]" />

      <Container className="py-section-md">
        {/* ── Newsletter band ─────────────────────────────── */}
        <div className="grid gap-8 border-b border-[var(--app-border)] pb-12 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end lg:gap-16">
          <div>
            <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary-dark)]">
              Stay in the loop
            </p>
            <h2 className="mt-3 max-w-md font-ui text-heading-md font-semibold leading-snug text-[var(--app-text)] sm:text-heading-lg">
              Weekly encouragement, straight to your inbox.
            </h2>
          </div>

          <form onSubmit={handleSubscribe}>
            <div
              className={cn(
                'flex items-center gap-1 rounded-input border bg-[var(--app-surface)] py-1 pl-4 pr-1 transition',
                subState === 'err'
                  ? 'border-[var(--status-error)]/50'
                  : 'border-[var(--app-border)] focus-within:border-[var(--app-primary)]/50 focus-within:bg-[var(--app-surface-2)]'
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
                className="h-10 min-w-0 flex-1 bg-transparent font-ui text-body-sm text-[var(--app-text)] outline-none placeholder:text-[var(--app-subtle)]"
              />
              <button
                type="submit"
                disabled={subState === 'loading'}
                aria-label="Subscribe"
                className={buttonClass('primary', 'sm', '!size-10 !px-0')}
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
            <p
              className="mt-2 min-h-[1.25rem] font-ui text-caption"
              aria-live="polite"
            >
              {subState === 'done' ? (
                <span className="text-[var(--status-success)]">
                  Subscribed — thank you!
                </span>
              ) : subState === 'err' ? (
                <span className="text-[var(--status-error)]">
                  Something went wrong — please try again.
                </span>
              ) : (
                <span className="text-[var(--app-subtle)]">
                  Weekly reminders and church updates. Unsubscribe any time.
                </span>
              )}
            </p>
          </form>
        </div>

        {/* ── Columns ─────────────────────────────────────── */}
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-14">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              prefetch={false}
              className="mb-6 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]/50"
              aria-label="The Wisdom Church — home"
            >
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-button border border-[var(--app-border)] bg-[var(--app-surface)]">
                <Image
                  quality={IMAGE_QUALITY}
                  src={WisdomeHouseLogo}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary-dark)]">
                  The
                </span>
                <span className="font-ui text-heading-sm font-semibold leading-none text-[var(--app-text)]">
                  Wisdom Church
                </span>
              </span>
            </Link>

            <p className="max-w-sm font-ui text-body-sm leading-[1.85] text-[var(--app-muted)]">
              A Spirit-filled community raised to carry God&apos;s glory —
              equipping every believer with the Word, prayer, and purpose.
            </p>

            <div className="mt-6 space-y-1.5">
              <p className="font-ui text-label font-semibold text-[var(--app-text)]">
                {SERVICE_INFO.sunday.day}s · {SERVICE_INFO.sunday.time}{' '}
                {SERVICE_INFO.sunday.timezone}
              </p>
              <p className="font-ui text-label font-semibold text-[var(--app-muted)]">
                {SERVICE_INFO.dailyPrayer.label} ·{' '}
                {SERVICE_INFO.dailyPrayer.daysShort} at{' '}
                {SERVICE_INFO.dailyPrayer.time}
              </p>
            </div>
          </div>

          {/* Explore */}
          <div>
            <ColHead>Explore</ColHead>
            <FooterLinks links={EXPLORE} />
          </div>

          {/* Connect */}
          <div>
            <ColHead>Connect</ColHead>
            <FooterLinks links={CONNECT} />
          </div>

          {/* Reach us */}
          <div>
            <ColHead>Reach us</ColHead>
            <div className="space-y-3 font-ui text-body-sm text-[var(--app-muted)]">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--app-primary-dark)]" />
                {SERVICE_INFO.venue.full}
              </p>
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2.5 transition hover:text-[var(--app-text)]"
              >
                <Phone className="h-4 w-4 shrink-0 text-[var(--app-primary-dark)]" />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2.5 transition hover:text-[var(--app-text)]"
              >
                <Mail className="h-4 w-4 shrink-0 text-[var(--app-primary-dark)]" />
                {CONTACT_INFO.email}
              </a>
            </div>

            <div className="mt-6 flex items-center gap-2.5">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-subtle)] transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]/50"
                >
                  <s.Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────── */}
        <div className="mt-16 flex flex-col gap-4 border-t border-[var(--app-border)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-ui text-label text-[var(--app-subtle)]">
            © {new Date().getFullYear()} The Wisdom Church · Lagos, Nigeria
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              prefetch={false}
              className="font-ui text-label text-[var(--app-subtle)] transition hover:text-[var(--app-text)]"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              prefetch={false}
              className="font-ui text-label text-[var(--app-subtle)] transition hover:text-[var(--app-text)]"
            >
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
