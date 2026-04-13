'use client';

import Link from 'next/link';
import Image from 'next/image';
import { WisdomeHouseLogo } from '@/shared/assets';

const quickLinks = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/resources/sermons', label: 'Sermons' },
  { href: '/contact', label: 'Contact' },
];

const ministries = [
  { href: '/ministries/men', label: "Men's Ministry" },
  { href: '/ministries/women', label: "Women's Ministry" },
  { href: '/ministries/youth', label: 'Youth Ministry' },
  { href: '/ministries/children', label: "Children's Ministry" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden rounded-full border border-white/20 bg-white/5">
                <Image
                  src={WisdomeHouseLogo}
                  alt="Wisdom House Church"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] uppercase tracking-[0.28em] text-white/60">
                  The
                </span>
                <span className="text-[13px] font-semibold uppercase tracking-[0.22em]">
                  Wisdom
                </span>
                <span className="text-[12px] uppercase tracking-[0.22em] text-white/80">
                  Church
                </span>
              </div>
            </div>
            <p className="text-sm text-white/65 leading-relaxed max-w-md">
              Equipping and empowering believers with the Word and Spirit. Join
              us every Sunday and Thursday for worship, teaching, and community.
            </p>
            <div className="grid grid-cols-2 gap-3 text-[11px] text-white/70">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Sunday • 9:00 AM
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Thursday • 6:00 PM
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
                Quick Links
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                {quickLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
                Ministries
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                {ministries.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-3 text-sm text-white/70">
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
              Visit Us
            </p>
            <p>Honor Gardens, Lekki-Epe Expressway, Lagos</p>
            <p>Phone: 0706 999 5333</p>
            <p>Email: wisdomhousehq@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} The Wisdom Church. All rights reserved.
      </div>
    </footer>
  );
}
