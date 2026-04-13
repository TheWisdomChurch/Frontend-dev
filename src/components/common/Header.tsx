'use client';

import Link from 'next/link';
import Image from 'next/image';
import { WisdomeHouseLogo } from '@/components/assets';
import { useState } from 'react';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/resources/sermons', label: 'Sermons' },
  { href: '/give', label: 'Give' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header z-50 w-full">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-white/20 bg-white/5">
            <Image
              src={WisdomeHouseLogo}
              alt="Wisdom House Church"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </span>
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white">
            Wisdom House
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/events"
            className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/20"
          >
            Plan a Visit
          </Link>
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(prev => !prev)}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition md:hidden"
        >
          <span
            className={`absolute h-[2px] w-5 bg-white transition-all ${
              menuOpen ? 'rotate-45' : '-translate-y-1.5'
            }`}
          />
          <span
            className={`absolute h-[2px] w-5 bg-white transition-all ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute h-[2px] w-5 bg-white transition-all ${
              menuOpen ? '-rotate-45' : 'translate-y-1.5'
            }`}
          />
        </button>
      </div>

      {/* Mobile Door Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/95 via-[#0b0b0b] to-black/90 backdrop-blur-xl transition-transform duration-300 ${
            menuOpen ? 'scale-y-100' : 'scale-y-0'
          } origin-top`}
        />
        <div
          className={`relative z-10 flex h-full flex-col items-center justify-center gap-6 text-center transition-all duration-300 ${
            menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold uppercase tracking-[0.24em] text-white/85 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/events"
            onClick={() => setMenuOpen(false)}
            className="mt-3 rounded-full border border-primary/50 bg-primary/15 px-6 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
          >
            Plan a Visit
          </Link>
        </div>
      </div>
    </header>
  );
}
