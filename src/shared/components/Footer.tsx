'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';

const IconInstagram = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? 'h-4 w-4'}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);
const IconYoutube = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className ?? 'h-4 w-4'}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#040404" />
  </svg>
);
const IconFacebook = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className ?? 'h-4 w-4'}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconX = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className ?? 'h-4 w-4'}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { WisdomeHouseLogo } from '@/shared/assets';
import { Container } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';
import { BodySM, Eyebrow } from '@/shared/text';

const quickLinks = [
  { href: '/about', label: 'About' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/events', label: 'Events' },
  { href: '/resources/sermons', label: 'Sermons' },
  { href: '/testimonies', label: 'Testimonies' },
  { href: '/contact', label: 'Contact' },
];

const ministries = [
  { href: '/ministries/men', label: "Men's Ministry" },
  { href: '/ministries/women', label: "Women's Ministry" },
  { href: '/ministries/youth', label: 'Youth Ministry' },
  { href: '/ministries/children', label: "Children's Ministry" },
  { href: '/ministries/outreach', label: 'Outreach' },
];

const socials = [
  {
    href: 'https://www.instagram.com/wisdomhousehq',
    label: 'Instagram',
    Icon: IconInstagram,
  },
  {
    href: 'https://www.youtube.com/@wisdomhousehq',
    label: 'YouTube',
    Icon: IconYoutube,
  },
  {
    href: 'https://www.facebook.com/wisdomhousehq',
    label: 'Facebook',
    Icon: IconFacebook,
  },
  { href: 'https://x.com/wisdomhousehq', label: 'X', Icon: IconX },
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
              <BodySM className="max-w-md text-white/70">
                Equipping and empowering believers with the Word and Spirit.
                Join us every Sunday and Thursday for worship, teaching, and
                community.
              </BodySM>
              <div className="grid gap-3 text-[11px] text-white/70 sm:grid-cols-2">
                <div className="rounded-radius-sm border border-[var(--app-primary)]/15 bg-[var(--app-primary)]/[0.05] px-4 py-3">
                  Sunday • 9:00 AM
                </div>
                <div className="rounded-radius-sm border border-[var(--app-primary)]/15 bg-[var(--app-primary)]/[0.05] px-4 py-3">
                  Thursday • 6:00 PM
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <Eyebrow className="text-primary">Quick Links</Eyebrow>
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
              <Eyebrow className="text-primary">Ministries</Eyebrow>
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
              <Eyebrow className="text-primary">Visit Us</Eyebrow>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <span>Honor Gardens, Lekki-Epe Expressway, Lagos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>0706 999 5333</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>wisdomhousehq@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="space-y-3">
              <Eyebrow className="text-primary">Newsletter</Eyebrow>
              <form className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="Email address"
                  className="h-11 w-full rounded-full border border-white/15 bg-black/40 px-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-primary"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  curvature="full"
                  className="h-11 border border-primary/50 bg-primary/15 px-5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary hover:bg-primary/25"
                >
                  Subscribe
                </Button>
              </form>
            </div>

            <div className="space-y-3 md:justify-self-end">
              <Eyebrow className="text-primary md:text-right">
                Follow Us
              </Eyebrow>
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
