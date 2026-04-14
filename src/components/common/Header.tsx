'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, Mail } from 'lucide-react';
import { WisdomeHouseLogo } from '@/components/assets';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/resources/sermons', label: 'Sermons' },
  { href: '/give', label: 'Give' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);
  return (
    <header
      className={`site-header z-50 w-full ${
        scrolled
          ? 'bg-black/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
          : 'bg-black/85 backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-white/5">
            <Image
              src={WisdomeHouseLogo}
              alt="Wisdom House Church"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </span>
          <span className="h-9 w-px bg-white/35" />
          <span className="flex flex-col leading-none text-white font-sans">
            <span className="text-[8px] uppercase tracking-[0.32em] text-white/70 font-medium">
              The
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.24em]">
              Wisdom
            </span>
            <span className="text-[10.5px] uppercase tracking-[0.22em] text-white/80 font-medium">
              Church
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                pathname === link.href
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <div className="relative group">
            <a
              href="tel:07069995333"
              aria-label="Call us"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition hover:text-white"
            >
              <Phone className="h-4 w-4" />
            </a>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-white/80 opacity-0 transition group-hover:opacity-100">
              24/7 Support
            </span>
          </div>
          <div className="relative group">
            <a
              href="mailto:wisdomhousehq@gmail.com"
              aria-label="Email us"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition hover:text-white"
            >
              <Mail className="h-4 w-4" />
            </a>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-white/80 opacity-0 transition group-hover:opacity-100">
              Email Us
            </span>
          </div>
          <Link
            href="/events"
            className="rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary/20"
          >
            Plan a Visit
          </Link>
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(prev => !prev)}
          className={`relative z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition md:hidden ${
            menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
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
          className={`relative z-10 flex h-full flex-col transition-all duration-300 ${
            menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 pb-5 pt-6">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5"
            >
              <span className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-white/5">
                <Image
                  src={WisdomeHouseLogo}
                  alt="Wisdom House Church"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </span>
              <span className="h-7 w-px bg-white/35" />
              <span className="flex flex-col leading-none text-white font-sans">
                <span className="text-[7px] uppercase tracking-[0.32em] text-white/70 font-medium">
                  The
                </span>
                <span className="text-[9.5px] font-medium uppercase tracking-[0.24em]">
                  Wisdom
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-white/80 font-medium">
                  Church
                </span>
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white"
            >
              <span className="absolute h-[2px] w-5 rotate-45 bg-white" />
              <span className="absolute h-[2px] w-5 -rotate-45 bg-white" />
            </button>
          </div>
          <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <div className="grid w-full max-w-[320px] grid-cols-2 gap-3">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`group relative rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                    pathname === link.href
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-8" />
                </Link>
              ))}
            </div>
            <Link
              href="/events"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-primary/50 bg-primary/15 px-6 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
            >
              Plan a Visit
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
