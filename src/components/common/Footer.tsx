'use client';

import Link from 'next/link';

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-10 text-slate-300">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
            The Wisdom Church
          </div>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            Equipping and empowering believers with the Word and Spirit.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.16em]">
          {footerLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-2 px-4 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} The Wisdom Church</span>
        <span>Honor Gardens, Lekki-Epe Expressway, Lagos</span>
      </div>
    </footer>
  );
}
