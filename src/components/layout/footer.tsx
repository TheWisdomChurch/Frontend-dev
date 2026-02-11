'use client';

import { memo, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Mail, Facebook, Youtube, Instagram, Twitter, ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { useDormantAction } from '@/components/utils/hooks/useDormantAction';
import { BodySM, BodyMD, Caption, BodyLG } from '@/components/text';
import { WisdomeHouseLogo } from '../assets';

// MEMOIZE STATIC DATA & COMPONENTS OUTSIDE
const currentYear = new Date().getFullYear();
const socialLinks = [
  { Icon: Facebook, href: 'https://www.facebook.com/wisdomhousehq', label: 'Facebook' },
  { Icon: Youtube, href: 'https://www.youtube.com/@wisdomhousehq', label: 'YouTube' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
];
const contactInfo = [
  { Icon: MapPin, title: 'Location', text: 'Honor Gardens, opposite Dominion City, Alasia, Lekki-Epe Expressway, Lagos' },
  { Icon: Phone, title: 'Phone', text: '0706 999 5333' },
  { Icon: Mail, title: 'Email', text: 'Wisdomhousehq@gmail.com' },
];
const quickLinks = [
  { href: '/about/mission', label: 'About Us' },
  { href: '/events/upcoming', label: 'Events & Programs' },
  { href: '/resources/sermons', label: 'Sermons' },
  { href: '/resources/store', label: 'Store' },
  { href: '/contact', label: 'Contact Us' },
];
const serviceTimes = [
  { day: 'Sunday Worship', time: '9:00 AM', highlight: true },
  { day: 'Midweek Service', time: 'Thursday • 6:00 PM', highlight: false },
];

// MAIN COMPONENT WITH MEMOIZATION
function Footer() {
  const { colorScheme } = useTheme();
  const footerRef = useRef<HTMLElement>(null);
  const openDormant = useDormantAction();

  // MEMOIZE VALUES THAT DEPEND ON colorScheme
  const gradientStyle = useMemo(() => ({
    background: `radial-gradient(circle at 20% 80%, ${colorScheme.primary}40 0%, transparent 60%)`
  }), [colorScheme.primary]);

  // MEMOIZE EVENT HANDLERS
  const handleSubscribe = useCallback(
    (e: React.FormEvent) => {
      openDormant(e, {
        title: 'Newsletter signup opening soon',
        message:
          'We are preparing weekly updates and devotionals. Please check back shortly.',
        actionLabel: 'Okay, thanks',
      });
    },
    [openDormant]
  );

  // RENDER LOGIC
  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={gradientStyle} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.9fr_0.95fr_1.1fr] gap-10 lg:gap-8 xl:gap-10 mb-12">
          {/* Brand + Contact */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-lg overflow-hidden ring-1 ring-white/15">
                <Image
                  src={WisdomeHouseLogo}
                  alt="The Wisdom House Church"
                  width={44}
                  height={44}
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <BodySM className="text-sm font-medium text-white">
                  The Wisdom Church
                </BodySM>
                <Caption className="text-white/60">
                  Equipping & Empowering for greatness
                </Caption>
              </div>
            </div>

            <Caption className="text-white/65 leading-relaxed">
              A Spirit‑filled family helping believers grow in faith, purpose, and community.
            </Caption>

            <div className="space-y-3">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <item.Icon className="w-4 h-4" style={{ color: colorScheme.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <BodySM className="text-xs text-white/85">{item.title}</BodySM>
                    <Caption className="text-white/60 break-words leading-relaxed">
                      {item.text}
                    </Caption>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <BodySM className="text-xs uppercase tracking-[0.18em] text-white/60">
              Quick Links
            </BodySM>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-all"
                  >
                    <ArrowRight
                      className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      style={{ color: colorScheme.primary }}
                    />
                    <Caption className="text-[12px]">{link.label}</Caption>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div className="space-y-5">
            <BodySM className="text-xs uppercase tracking-[0.18em] text-white/60">
              Service Times
            </BodySM>
            <div className="space-y-3">
              {serviceTimes.map(s => (
                <div
                  key={s.day}
                  className={`rounded-lg border px-3.5 py-3 ${
                    s.highlight
                      ? 'border-white/20 bg-white/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <BodySM
                    className="text-[12px] text-white/85 mb-1"
                    style={{ color: s.highlight ? colorScheme.primary : undefined }}
                  >
                    {s.day}
                  </BodySM>
                  <Caption className="text-white/60">{s.time}</Caption>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter + Social */}
          <div className="space-y-7">
            <div className="space-y-3">
              <BodyLG className="text-sm font-medium text-white">
                Stay Inspired
              </BodyLG>
              <Caption className="text-white/60 leading-relaxed">
                Get weekly sermons, event updates, and devotionals.
              </Caption>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 focus:border-primary focus:outline-none transition placeholder:text-white/35 text-white text-sm"
              />
              <button
                type="submit"
                style={{ backgroundColor: colorScheme.primary, color: colorScheme.black }}
                className="w-full h-10 rounded-lg text-[12px] font-medium hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
              >
                Subscribe
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>

            <div className="pt-4 border-t border-white/10">
              <BodyMD className="text-xs uppercase tracking-[0.18em] text-white/60 mb-3">
                Follow Us
              </BodyMD>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social, i) => {
                  const isDormant = social.href === '#';
                  return (
                    <a
                      key={i}
                      href={social.href}
                      target={isDormant ? undefined : '_blank'}
                      rel={isDormant ? undefined : 'noopener noreferrer'}
                      onClick={
                        isDormant
                          ? (event) =>
                              openDormant(event, {
                                title: `${social.label} opening soon`,
                                message:
                                  'We are activating this social channel. Please check back shortly.',
                                actionLabel: 'Got it',
                              })
                          : undefined
                      }
                      className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                      aria-label={social.label}
                    >
                      <social.Icon className="w-4 h-4" style={{ color: colorScheme.primary }} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Caption className="text-white/45 text-center md:text-left">
              © {currentYear} The Wisdom House Church. All Rights Reserved.
            </Caption>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
                <Caption>Privacy Policy</Caption>
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
                <Caption>Terms of Service</Caption>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
