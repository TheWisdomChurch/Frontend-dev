'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
  Camera,
  Play,
  Users,
  MessageCircle,
} from 'lucide-react';
import { WisdomeHouseLogo } from '@/shared/assets';
import { Container } from '@/shared/layout';

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

const socials = [
  {
    href: 'https://www.instagram.com/wisdomhousehq',
    label: 'Instagram',
    Icon: Camera,
  },
  {
    href: 'https://www.youtube.com/@wisdomhousehq',
    label: 'YouTube',
    Icon: Play,
  },
  {
    href: 'https://www.facebook.com/wisdomhousehq',
    label: 'Facebook',
    Icon: Users,
  },
  {
    href: 'https://x.com/wisdomhousehq',
    label: 'Twitter',
    Icon: MessageCircle,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#040404] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_90%_30%,rgba(255,255,255,0.06),transparent_40%)] opacity-70" />
      <div className="relative">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
        <Container size="xl" className="relative py-20">
          <div className="grid gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-14 xl:grid-cols-[1.2fr_1fr_1fr_1.1fr] xl:gap-16">
            <div className="space-y-7">
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
                  <span className="text-[9px] uppercase tracking-[0.26em] text-white/60">
                    The
                  </span>
                  <span className="text-[14px] font-medium uppercase tracking-[0.2em]">
                    Wisdom
                  </span>
                  <span className="text-[12px] uppercase tracking-[0.2em] text-white/80">
                    Church
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed max-w-md">
                Equipping and empowering believers with the Word and Spirit.
                Join us every Sunday and Thursday for worship, teaching, and
                community.
              </p>
              <div className="grid gap-3 text-[11px] text-white/70 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  Sunday • 9:00 AM
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  Thursday • 6:00 PM
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                Quick Links
              </p>
              <ul className="space-y-3 text-sm text-white/70">
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

            <div className="space-y-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                Ministries
              </p>
              <ul className="space-y-3 text-sm text-white/70">
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

            <div className="space-y-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                Visit Us
              </p>
              <div className="space-y-3 text-sm text-white/70">
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
            </div>
          </div>

          <div className="mt-16 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                Newsletter
              </p>
              <form className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="Email address"
                  className="h-11 w-full rounded-full border border-white/15 bg-black/40 px-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-primary"
                />
                <button
                  type="submit"
                  className="h-11 rounded-full border border-primary/50 bg-primary/15 px-5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary transition hover:bg-primary/25"
                >
                  Subscribe
                </button>
              </form>
            </div>

            <div className="space-y-3 md:justify-self-end">
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary md:text-right">
                Follow Us
              </p>
              <div className="flex items-center gap-2 md:justify-end">
                {socials.map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:text-white"
                  >
                    <item.Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/50 md:flex-row">
            <span>
              © {new Date().getFullYear()} The Wisdom Church. All rights
              reserved.
            </span>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/60">
              Worship • Word • Community
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
