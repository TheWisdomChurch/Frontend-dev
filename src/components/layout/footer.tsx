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

  const borderStyle = useMemo(() => ({
    borderColor: colorScheme.primary + '40'
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
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-black"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={gradientStyle} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-18">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 xl:gap-12 mb-14">
          
          {/* Column 1 - Contact */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-primary/20">
                {/* FIXED: Properly pass the imported image */}
                <Image
                  src={WisdomeHouseLogo}
                  alt="The Wisdom House Church"
                  width={48}
                  height={48}
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <BodySM className="text-base font-medium text-white">
                  The Wisdom Church
                </BodySM>
                <Caption style={{ color: colorScheme.primary }} useThemeColor={false}>
                  Equipping & Empowering for greatness
                </Caption>
              </div>
            </div>
            <div className="space-y-4">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                    <item.Icon className="w-4 h-4" style={{ color: colorScheme.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <BodySM className="font-medium text-white mb-1" useThemeColor={false}>
                      {item.title}
                    </BodySM>
                    <Caption className="text-gray-300 break-words leading-relaxed" useThemeColor={false}>
                      {item.text}
                    </Caption>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-6">
            <BodySM className="font-semibold mb-6 text-white" useThemeColor={false}>
              Quick Links
            </BodySM>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center gap-2 py-2 hover:translate-x-1 transition-all duration-300" style={{ color: colorScheme.primary }}>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex-shrink-0" style={{ color: colorScheme.primary }} />
                    <Caption className="truncate">{link.label}</Caption>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Service Times */}
          <div className="space-y-6">
            <BodySM className="font-semibold mb-6 text-white" useThemeColor={false}>
              Service Times
            </BodySM>
            <div className="space-y-4">
              {serviceTimes.map(s => (
                <div key={s.day} className={`p-3.5 rounded-lg ${s.highlight ? 'border border-primary bg-primary/10' : 'border border-gray-700'}`}>
                  <BodySM className={`font-medium ${s.highlight ? '' : 'text-white'} mb-1`} style={{ color: s.highlight ? colorScheme.primary : undefined }} useThemeColor={false}>
                    {s.day}
                  </BodySM>
                  <Caption className="text-gray-300" useThemeColor={false}>{s.time}</Caption>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4 - Newsletter & Social */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div>
                <BodyLG className="font-semibold mb-4 text-white" useThemeColor={false}>
                  Stay Inspired
                </BodyLG>
                <Caption className="text-gray-300 mb-6 leading-relaxed" useThemeColor={false}>
                  Get weekly sermons, event updates, and devotionals.
                </Caption>
              </div>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input type="email" placeholder="Your email" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 focus:border-primary focus:outline-none transition-all placeholder:text-gray-500 text-white text-sm" />
                <button type="submit" style={{ backgroundColor: colorScheme.primary, color: colorScheme.black }} className="w-full px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-1.5 text-sm">
                  <BodySM>Subscribe</BodySM>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            </div>
            <div className="pt-6 border-t border-gray-800">
              <div className="text-center">
                <BodyMD className="font-medium mb-4 text-white" useThemeColor={false}>Follow Us</BodyMD>
                <div className="flex justify-center items-center gap-3">
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
                        className="p-2.5 rounded-full bg-white/10 border border-gray-700 hover:bg-primary/20 hover:border-primary transition-all duration-300 hover:scale-105"
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
        </div>

        <div className="pt-10 border-t" style={borderStyle}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Caption className="text-gray-400 text-center md:text-left" useThemeColor={false}>
              © {currentYear} The Wisdom House Church. All Rights Reserved.
            </Caption>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors" style={{ color: colorScheme.primary }}>
                <Caption useThemeColor={false}>Privacy Policy</Caption>
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors" style={{ color: colorScheme.primary }}>
                <Caption useThemeColor={false}>Terms of Service</Caption>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
