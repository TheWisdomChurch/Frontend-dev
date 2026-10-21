'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, Check, Loader2, Mail, MapPin, Phone } from 'lucide-react';

import { IMAGE_QUALITY } from '@/shared/constants';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { CONTACT_INFO } from '@/shared/constants/contactInfo';
import { WisdomChurchLogo } from '@/shared/assets';
import { Container } from '@/shared/ui/Container';
import { SOCIAL_MARKS } from '@/shared/ui/icons/social';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/cn';

/* ── Data ─────────────────────────────────────────────── */

const EXPLORE = [
  { href: '/about', label: 'About Us' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/grow', label: 'Growth Portal' },
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
            className="group inline-flex items-center gap-1.5 rounded font-ui text-body-sm text-[var(--app-muted)] transition hover:text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--app-primary)_50%,transparent)]"
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
      // 1. Submit to newsletter subscription endpoint
      await apiClient.subscribe({
        email: val,
        source: 'footer:stay-in-the-word',
      });

      // 2. Also route notice to admin portal message inbox
      apiClient
        .submitContactMessage({
          firstName: 'Newsletter',
          lastName: 'Subscriber',
          email: val,
          topic: 'Newsletter Subscription (Stay in the Word)',
          sourceChannel: 'frontend:footer:stay-in-the-word',
          message: `New subscriber to Stay in the Word:\nEmail: ${val}\nChannel: Website Global Footer`,
        })
        .catch(() => {
          // Graceful fallback if secondary notice endpoint fails
        });

      setEmail('');
      setSubState('done');
      setTimeout(() => setSubState('idle'), 4000);
    } catch {
      setSubState('err');
      setTimeout(() => setSubState('idle'), 4000);
    }
  };

  return (
    <footer className="tone-dark border-t border-[var(--app-border)] bg-[var(--app-dark)] text-[var(--app-text)]">
      <div className="h-px w-full bg-[linear-gradient(90deg,transparent,var(--app-primary),transparent)]" />

      <Container className="py-section-md">
        {/* ── Global "Stay in the Word" Newsletter Band (Across All Pages) ── */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,var(--app-dark-2),var(--app-dark-3))] p-7 sm:p-10 lg:p-12 shadow-2xl mb-12">
          {/* Subtle gold ambient glow in top-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--app-primary)_14%,transparent)] blur-3xl"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--app-primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] px-3.5 py-1.5 font-ui text-caption font-bold uppercase tracking-[0.16em] text-[var(--app-primary-light)]">
                <Mail className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                Stay in the Word
              </div>

              <h2 className="mt-4 font-headline text-heading-lg sm:text-heading-xl font-normal leading-tight text-white">
                Spiritual growth and updates,{' '}
                <span className="italic text-[var(--app-primary-light)]">
                  straight to you.
                </span>
              </h2>

              <p className="mt-3 max-w-lg font-ui text-body-md text-white/70 leading-relaxed">
                Subscribe to receive weekly sermon devotionals, upcoming
                ministry events, and pastoral encouragement from our leadership
                team.
              </p>
            </div>

            <div>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <div
                  className={cn(
                    'flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl border p-2 transition duration-200',
                    subState === 'err'
                      ? 'border-[var(--status-error)]/60 bg-white/5'
                      : 'border-white/15 bg-white/[0.04] focus-within:border-[var(--app-primary)] focus-within:bg-white/[0.07]'
                  )}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    disabled={subState === 'loading'}
                    className="h-11 min-h-11 min-w-0 flex-1 bg-transparent px-4 font-ui text-body-sm sm:text-body text-white outline-none placeholder:text-white/45"
                  />

                  <button
                    type="submit"
                    disabled={subState === 'loading'}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--app-primary-dark)] via-[var(--app-primary)] to-[var(--app-primary-light)] px-6 py-2.5 font-ui text-xs font-bold uppercase tracking-wider text-[var(--app-dark)] shadow-[0_4px_16px_color-mix(in_srgb,var(--app-primary)_35%,transparent)] transition-all duration-300 hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
                  >
                    {subState === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Joining...</span>
                      </>
                    ) : subState === 'done' ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Subscribed!</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <div
                  className="min-h-[1.5rem] px-2 font-ui text-caption"
                  aria-live="polite"
                >
                  {subState === 'done' && (
                    <span className="text-[var(--status-success)] font-medium">
                      Thank you! You are now subscribed to our spiritual
                      updates.
                    </span>
                  )}
                  {subState === 'err' && (
                    <span className="text-[var(--status-error)] font-medium">
                      Unable to subscribe right now. Please try again shortly.
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ── Columns ─────────────────────────────────────── */}
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-14">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              prefetch={false}
              className="mb-6 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--app-primary)_50%,transparent)]"
              aria-label="The Wisdom Church — home"
            >
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-button border border-[var(--app-border)] bg-[var(--app-surface)]">
                <Image
                  quality={IMAGE_QUALITY}
                  src={WisdomChurchLogo}
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
              A spirit filled community empowered by God for Greatness —
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
              {SOCIAL_MARKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-subtle)] transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--app-primary)_50%,transparent)]"
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
