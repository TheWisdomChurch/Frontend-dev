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
  { href: '/#give', label: 'Give' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(true);
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const isTransparent =
    isHomePage && !scrolled && !menuOpen && !isMobileViewport;

  const smoothEase = {
    transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
  } as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateViewportMode = () => {
      setIsMobileViewport(window.innerWidth < 1024);
    };

    updateViewportMode();
    window.addEventListener('resize', updateViewportMode, { passive: true });

    return () => window.removeEventListener('resize', updateViewportMode);
  }, []);

  useEffect(() => {
    document.body.dataset.scrolled = scrolled ? 'true' : 'false';
  }, [scrolled]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const scrollY = window.scrollY || 0;
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlTouchAction = html.style.touchAction;
    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    const previousBodyPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - html.clientWidth;

    body.dataset.scrollLockY = String(scrollY);
    body.dataset.menuOpen = 'true';
    body.classList.add('menu-open');
    html.classList.add('menu-open');

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';

    html.style.overflow = 'hidden';
    html.style.touchAction = 'none';
    html.style.overscrollBehavior = 'none';

    const canScrollInsideMenu = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest('[data-menu-scroll="true"]'));

    const preventBackgroundScroll = (event: TouchEvent | WheelEvent) => {
      if (canScrollInsideMenu(event.target)) return;
      event.preventDefault();
    };

    window.addEventListener('touchmove', preventBackgroundScroll, {
      passive: false,
    });
    window.addEventListener('wheel', preventBackgroundScroll, {
      passive: false,
    });

    return () => {
      const restoreY = Number(body.dataset.scrollLockY || scrollY);

      body.classList.remove('menu-open');
      body.dataset.menuOpen = 'false';
      html.classList.remove('menu-open');

      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      body.style.overscrollBehavior = previousBodyOverscroll;
      body.style.paddingRight = previousBodyPaddingRight;

      html.style.overflow = previousHtmlOverflow;
      html.style.touchAction = previousHtmlTouchAction;
      html.style.overscrollBehavior = previousHtmlOverscroll;

      window.removeEventListener('touchmove', preventBackgroundScroll);
      window.removeEventListener('wheel', preventBackgroundScroll);

      body.dataset.scrollLockY = '';
      window.scrollTo(0, restoreY);
    };
  }, [menuOpen]);

  return (
    <header
      className={`site-header z-50 w-full font-[family-name:var(--font-worksans)] transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent border-transparent backdrop-blur-0 shadow-none'
          : 'bg-[#06080f]/92 border-white/10 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)]'
      }`}
      style={smoothEase}
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
          <span className="flex flex-col leading-none text-white font-[family-name:var(--font-bricolage)]">
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
              className={`group relative text-[11px] font-light uppercase tracking-[0.2em] transition-colors duration-300 ${
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
          className={`relative z-[70] inline-flex h-11 w-11 items-center justify-center rounded-full border text-white transition-all duration-400 lg:hidden ${
            menuOpen
              ? 'border-white/35 bg-black/70 shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
              : 'border-white/25 bg-black/40'
          }`}
          style={smoothEase}
        >
          <span
            className={`absolute h-[2px] w-5 origin-center rounded-full bg-white transition-all duration-400 ${
              menuOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5 rotate-0'
            }`}
            style={smoothEase}
          />
          <span
            className={`absolute h-[2px] w-4 rounded-full bg-white transition-all duration-300 ${
              menuOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
            }`}
          />
          <span
            className={`absolute h-[2px] w-5 origin-center rounded-full bg-white transition-all duration-400 ${
              menuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5 rotate-0'
            }`}
            style={smoothEase}
          />
        </button>
      </Container>

      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={smoothEase}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          className="absolute inset-0 bg-black/82 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-[72px] h-[calc(100%-72px)] w-[90%] max-w-[420px] border-l border-white/10 bg-[linear-gradient(180deg,#0a0e18_0%,#080c14_52%,#070a12_100%)] shadow-[-26px_0_64px_rgba(0,0,0,0.55)] transition-transform duration-500 ${
            menuOpen ? 'translate-x-0' : 'translate-x-[104%]'
          }`}
          style={smoothEase}
        >
          <div className="border-b border-white/10 px-5 py-5">
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
              <span className="flex flex-col leading-none text-white font-[family-name:var(--font-bricolage)]">
                <span className="text-[8px] uppercase tracking-[0.3em] text-white/70 font-light">
                  The
                </span>
                <span className="text-[10px] font-light uppercase tracking-[0.22em]">
                  Wisdom Church
                </span>
              </span>
            </Link>
          </div>

          <div
            className="flex h-[calc(100%-79px)] flex-col gap-6 overflow-y-auto px-5 py-6 overscroll-contain"
            data-menu-scroll="true"
          >
            <nav className="space-y-2.5">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm font-light uppercase tracking-[0.2em] transition-all duration-500 ${
                    menuOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-2 opacity-0'
                  } ${
                    pathname === link.href
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                  style={{
                    ...smoothEase,
                    transitionDelay: `${80 + index * 45}ms`,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="space-y-3 border-t border-white/10 pt-5 text-sm text-white/70">
              <a
                href="tel:07069995333"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/15 px-4 py-3.5 text-[11px] font-medium uppercase tracking-[0.17em] text-primary transition hover:bg-primary/25"
              >
                <Phone className="h-4 w-4 text-primary" />
                Call Church
              </a>
              <a
                href="mailto:wisdomhousehq@gmail.com"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-[11px] font-medium uppercase tracking-[0.17em] text-white/90 transition hover:bg-white/[0.1]"
              >
                <Mail className="h-4 w-4 text-primary" />
                Email Church
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
