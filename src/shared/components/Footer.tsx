'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { WisdomeHouseLogo } from '@/shared/assets';

const quickLinks = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/resources/sermons', label: 'Sermons' },
  { href: '/resources', label: 'Resources' },
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
    <footer className="relative overflow-hidden bg-[#040404] text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="relative h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-white/5">
                <Image
                  src={WisdomeHouseLogo}
                  alt="Wisdom House Church"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] uppercase tracking-[0.28em] text-white/60">
                  The
                </span>
                <span className="text-[14px] font-semibold uppercase tracking-[0.22em]">
                  Wisdom
                </span>
                <span className="text-[12px] uppercase tracking-[0.22em] text-white/80">
                  Church
                </span>
              </div>
            </div>
            <p className="text-sm text-white/68 leading-relaxed max-w-md">
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
                      className="inline-flex items-center gap-2 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 text-white/50" />
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
                      className="inline-flex items-center gap-2 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 text-white/50" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 text-sm text-white/70">
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
              Visit Us
            </p>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <p>Honor Gardens, Lekki-Epe Expressway, Lagos</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" />
              <p>0706 999 5333</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" />
              <p>wisdomhousehq@gmail.com</p>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
              Newsletter
            </p>
            <p className="text-sm text-white/70">
              Subscribe to get service updates and upcoming events.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                className="h-11 w-full rounded-full border border-white/15 bg-black/40 px-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-primary"
              />
              <button
                type="submit"
                className="h-11 rounded-full border border-primary/50 bg-primary/15 px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary transition hover:bg-primary/25"
              >
                Subscribe
              </button>
            </form>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[10px] font-semibold uppercase tracking-[0.18em]">
                  W
                </span>
                <span className="h-5 w-px bg-white/25" />
                <span className="text-[11px] uppercase tracking-[0.22em] text-white/70">
                  Follow Us
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.youtube.com/@wisdomhousehq"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/70 transition hover:text-white"
                >
                  <span className="h-5 w-5 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3 fill-white/70 group-hover:fill-white"
                      aria-hidden="true"
                    >
                      <path d="M23.5 7.1a3 3 0 00-2.1-2.1C19.6 4.5 12 4.5 12 4.5s-7.6 0-9.4.5A3 3 0 00.5 7.1C0 8.9 0 12 0 12s0 3.1.5 4.9a3 3 0 002.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 002.1-2.1c.5-1.8.5-4.9.5-4.9s0-3.1-.5-4.9zM9.6 15.5v-7l6.3 3.5-6.3 3.5z" />
                    </svg>
                  </span>
                  YouTube
                </a>
                <a
                  href="https://www.facebook.com/wisdomhousehq"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/70 transition hover:text-white"
                >
                  <span className="h-5 w-5 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3 fill-white/70 group-hover:fill-white"
                      aria-hidden="true"
                    >
                      <path d="M22.7 0H1.3C.6 0 0 .6 0 1.3v21.4C0 23.4.6 24 1.3 24h11.5v-9.3H9.7v-3.6h3.1V8.4c0-3.1 1.9-4.8 4.6-4.8 1.3 0 2.4.1 2.7.1v3.1h-1.9c-1.5 0-1.8.7-1.8 1.7v2.3h3.6l-.5 3.6h-3.1V24h6.1c.7 0 1.3-.6 1.3-1.3V1.3C24 .6 23.4 0 22.7 0z" />
                    </svg>
                  </span>
                  Facebook
                </a>
                <a
                  href="https://x.com/wisdomhousehq"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/70 transition hover:text-white"
                >
                  <span className="h-5 w-5 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3 fill-white/70 group-hover:fill-white"
                      aria-hidden="true"
                    >
                      <path d="M18.2 2H21l-6.6 7.5L22 22h-6.5l-5-6.3L5.6 22H3l7.1-8.1L2 2h6.6l4.5 5.7L18.2 2zm-2.1 18h1.8L8.1 4H6.2l9.9 16z" />
                    </svg>
                  </span>
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} The Wisdom Church. All rights reserved.
      </div>
    </footer>
  );
}
