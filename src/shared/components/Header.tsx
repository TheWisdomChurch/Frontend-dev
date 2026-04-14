'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, Mail } from 'lucide-react';
import { WisdomeHouseLogo } from '@/shared/assets';
import { Container } from '@/shared/layout';

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
    if (!menuOpen) return;

    const scrollY = window.scrollY || 0;
    document.body.dataset.scrollLockY = String(scrollY);
    document.body.classList.add('menu-open');
    document.documentElement.classList.add('menu-open');

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      const restoreY = Number(document.body.dataset.scrollLockY || scrollY);
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.dataset.scrollLockY = '';
      window.scrollTo(0, restoreY);
    };
  }, [menuOpen]);

  return (
    <header
      className={`site-header z-50 w-full bg-black/95 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_12px_40px_rgba(0,0,0,0.45)]' : 'shadow-none'
      }`}
    >
      <Container
        size="xl"
        className="flex h-[72px] items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-white/5 shadow-[0_0_16px_rgba(255,255,255,0.06)]">
            <Image
              src={WisdomeHouseLogo}
              alt="Wisdom House Church"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </span>
          <span className="h-9 w-px bg-white/25" />
          <span className="flex flex-col leading-none text-white font-sans">
            <span className="text-[8px] uppercase tracking-[0.3em] text-white/70 font-light">
              The
            </span>
            <span className="text-[11px] font-light uppercase tracking-[0.22em]">
              Wisdom
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-light">
              Church
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative text-[11px] font-light uppercase tracking-[0.18em] transition-colors ${
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

        <div className="hidden items-center gap-2.5 lg:flex">
          <a
            href="tel:07069995333"
            aria-label="Call Wisdom Church"
            title="Call Wisdom Church"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:text-white"
          >
            <Phone className="h-4 w-4 text-primary" />
          </a>
          <a
            href="mailto:wisdomhousehq@gmail.com"
            aria-label="Email Wisdom Church"
            title="Email Wisdom Church"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:text-white"
          >
            <Mail className="h-4 w-4 text-primary" />
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
          className="relative z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition lg:hidden"
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
      </Container>

      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[86%] max-w-[360px] bg-[#0b0b0b] border-l border-white/10 transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
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
              <span className="flex flex-col leading-none text-white font-sans">
                <span className="text-[8px] uppercase tracking-[0.3em] text-white/70 font-light">
                  The
                </span>
                <span className="text-[10px] font-light uppercase tracking-[0.22em]">
                  Wisdom Church
                </span>
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white"
            >
              <span className="absolute h-[2px] w-5 rotate-45 bg-white" />
              <span className="absolute h-[2px] w-5 -rotate-45 bg-white" />
            </button>
          </div>

          <div className="flex h-full flex-col gap-6 px-5 py-6 overflow-y-auto">
            <nav className="flex flex-col gap-3">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-light uppercase tracking-[0.16em] ${
                    pathname === link.href
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="space-y-3 text-sm text-white/70">
              <a
                href="tel:07069995333"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <Phone className="h-4 w-4 text-primary" />
                0706 999 5333
              </a>
              <a
                href="mailto:wisdomhousehq@gmail.com"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <Mail className="h-4 w-4 text-primary" />
                wisdomhousehq@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
