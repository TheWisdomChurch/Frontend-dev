'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

import { WisdomeHouseLogo } from '@/shared/assets';
import { Container } from '@/shared/layout';
import { apiClient } from '@/lib/api';

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
  { href: '/#giving', label: 'Give Online' },
  { href: '/forms/join', label: 'New Here?' },
];

const SOCIALS = [
  {
    href: 'https://www.instagram.com/wisdomchurchhq',
    label: 'Instagram',
    Icon: Ig,
  },
  {
    href: 'https://www.youtube.com/@wisdomchurchhq',
    label: 'YouTube',
    Icon: Yt,
  },
  { href: 'https://facebook.com/wisdomchurchhq', label: 'Facebook', Icon: Fb },
];

/* ── Column header ─────────────────────────────────────── */

function ColHead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
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
            className="group inline-flex items-center gap-1.5 font-ui text-[0.88rem] text-white/60 transition hover:text-white"
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
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--app-primary) 40%, transparent)',
        }}
      />

      <Container size="xl" className="py-20 sm:py-24 lg:py-28">
        {/* ── 4-column grid ────────────────────────────────── */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-14 xl:gap-20">
          {/* Col 1 — Brand ───────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="mb-6 flex items-center gap-3"
              aria-label="The Wisdom Church — home"
            >
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.05]">
                <Image
                  src={WisdomeHouseLogo}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-ui text-[0.58rem] uppercase tracking-[0.25em] text-white/45">
                  The
                </span>
                <span className="font-ui text-[0.8rem] font-bold uppercase tracking-[0.18em] text-white">
                  Wisdom Church
                </span>
              </div>
            </Link>

            <p className="font-ui text-[0.88rem] leading-[1.85] text-white/60">
              A Spirit-filled community raised to carry God's glory — equipping
              every believer with the Word, prayer, and purpose.
            </p>

            <div className="mt-6 space-y-2">
              <p className="font-ui text-[0.75rem] font-semibold text-white/75">
                Sundays · 9:00 AM
              </p>
              <p className="font-ui text-[0.75rem] font-semibold text-white/75">
                Thursdays · 6:00 PM
              </p>
            </div>

            <div className="mt-5 space-y-2 font-body text-[0.8rem] text-white/52">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--app-primary)]/60" />
                Honor Gardens, Lekki-Epe Expressway, Lagos
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-[var(--app-primary)]/60" />
                0706 999 5333
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-[var(--app-primary)]/60" />
                wisdomhousehq@gmail.com
              </p>
            </div>
          </div>

          {/* Col 2 — Explore ─────────────────────────────── */}
          <div>
            <ColHead>Explore</ColHead>
            <FooterLinks links={EXPLORE} />
          </div>

          {/* Col 3 — Connect ─────────────────────────────── */}
          <div>
            <ColHead>Connect</ColHead>
            <FooterLinks links={CONNECT} />
          </div>

          {/* Col 4 — Newsletter + Socials ────────────────── */}
          <div>
            <ColHead>Stay Connected</ColHead>

            <form onSubmit={handleSubscribe} className="mb-8">
              <p className="mb-3 font-body text-[0.78rem] text-white/40">
                Get weekly reminders and updates.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="h-10 w-full border border-white/10 bg-white/[0.05] px-3.5 font-body text-[0.82rem] text-white outline-none placeholder:text-white/25 transition focus:border-[var(--app-primary)]/50 focus:bg-white/[0.08]"
                />
                <button
                  type="submit"
                  disabled={subState === 'loading'}
                  className="h-10 bg-[var(--app-primary)] px-4 font-ui text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#0d0a06] transition hover:bg-[var(--app-primary-light)] disabled:opacity-60"
                >
                  {subState === 'loading'
                    ? 'Sending…'
                    : subState === 'done'
                      ? '✓ Subscribed'
                      : subState === 'err'
                        ? 'Try again'
                        : 'Subscribe'}
                </button>
              </div>
            </form>

            <div>
              <p className="mb-3 font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/25">
                Follow
              </p>
              <div className="flex items-center gap-2">
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.04] text-white/45 transition hover:border-white/20 hover:text-white/80"
                  >
                    <s.Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-7 sm:flex-row sm:items-center">
          <p className="font-body text-[0.75rem] text-white/45">
            © {new Date().getFullYear()} The Wisdom Church · Lagos, Nigeria
          </p>

          <div className="flex items-center gap-5">
            <span className="font-ui text-[0.68rem] uppercase tracking-[0.2em] text-white/38">
              Worship · Word · Community
            </span>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="font-body text-[0.73rem] text-white/45 transition hover:text-white/75"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="font-body text-[0.73rem] text-white/45 transition hover:text-white/75"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
