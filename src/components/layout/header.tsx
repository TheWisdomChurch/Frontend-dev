/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/utils/buttons/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import {
  Menu,
  Church,
  Home,
  Users,
  Calendar,
  BookOpen,
  Phone,
  X,
} from 'lucide-react';
import { extendedNavLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '@/components/assets';
import { cn } from '@/lib/cn';
import { bricolageGrotesque, worksans } from '../fonts/fonts';
import JoinCommunityModal from '../modal/joinUsModal';
import { QRDisplayModal } from '../modal/QrModal';
import { useHeader } from '../utils/hooks/header';

const iconMap = {
  Home: Home,
  Users: Users,
  Calendar: Calendar,
  BookOpen: BookOpen,
  Phone: Phone,
};

export default function Header() {
  const {
    isHeaderScrolled,
    isSheetOpen,
    isCommunityModalOpen,
    isQRDisplayOpen,
    colorScheme,
    setSheetOpen,
    handleLinkClick,
    openCommunityModal,
    closeCommunityModal,
    closeQRDisplay,
    isLinkActive,
    closeAllDropdowns,
  } = useHeader();

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out',
          isHeaderScrolled
            ? 'h-12 bg-black/90 backdrop-blur-xl border-b border-primary/30' // Always dark background when scrolled
            : 'h-14 top-2 left-1/2 -translate-x-1/2 w-[96%] max-w-4xl rounded-xl bg-black/80 backdrop-blur-xl border border-primary/30 shadow-sm' // Always dark background
        )}
        style={{
          backgroundColor: isHeaderScrolled
            ? '#000000cc' // Always black background
            : '#000000cc', // Always black background
          borderColor: colorScheme.primary + '40',
        }}
      >
        <div className="h-full flex items-center justify-between px-4 sm:px-6">
          {/* Left: Logo - More Compact */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              href="/"
              onClick={closeAllDropdowns}
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <Image
                  src={WisdomeHouseLogo}
                  alt="The Wisdom House"
                  width={isHeaderScrolled ? 28 : 32}
                  height={isHeaderScrolled ? 28 : 32}
                  className="rounded-full ring-1 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40"
                />
              </div>

              {/* Text - Smaller & More Compact */}
              <div className="flex items-center gap-2">
                {/* Vertical Demarcation Line */}
                <div
                  className="h-3 w-px opacity-40"
                  style={{ backgroundColor: colorScheme.primary }}
                />

                <span
                  className={`${bricolageGrotesque.className} text-xs font-medium tracking-tight hidden sm:flex flex-col`}
                >
                  <span
                    className="leading-[0.9]"
                    style={{ color: colorScheme.white }} // Always white text
                  >
                    The
                  </span>
                  <span
                    className="leading-[0.9]"
                    style={{ color: colorScheme.primary }} // Primary color for emphasis
                  >
                    Wisdom House
                  </span>
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation - Smaller Text */}
          <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-0">
              {extendedNavLinks.map(link => {
                const isActive = isLinkActive(link.href);
                const Icon = iconMap[link.icon as keyof typeof iconMap];

                return (
                  <div key={link.label} className="relative">
                    <Link
                      href={link.href}
                      onClick={e => handleLinkClick(link.href, false, e)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 mx-0.5',
                        'hover:bg-white/10'
                      )}
                      style={{
                        backgroundColor: isActive
                          ? colorScheme.primary + '20'
                          : 'transparent',
                        color: colorScheme.white, // Always white text
                      }}
                    >
                      {Icon && (
                        <Icon
                          className="w-3 h-3"
                          style={{ color: colorScheme.white }}
                        />
                      )}
                      <span className="text-[11px]">{link.label}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Right: CTA + Mobile Menu - More Compact */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop Join Us Button - Stretched */}
            <Button
              onClick={openCommunityModal}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 min-w-[100px] justify-center"
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black || '#000',
              }}
            >
              <Church className="w-3.5 h-3.5" />
              Join Us
            </Button>

            {/* Mobile Menu Trigger - Smaller */}
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-full p-1 hover:bg-white/10 transition-colors"
                  style={{ color: colorScheme.white }} // White icon
                >
                  <Menu className="h-3.5 w-3.5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full max-w-sm p-0 border-0 overflow-y-auto"
                style={{
                  backgroundColor: '#000000', // Dark background for mobile menu
                }}
              >
                <MobileNavigation
                  colorScheme={colorScheme}
                  isLinkActive={isLinkActive}
                  setSheetOpen={setSheetOpen}
                  openCommunityModal={openCommunityModal}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <JoinCommunityModal
        isOpen={isCommunityModalOpen}
        onClose={closeCommunityModal}
      />
      <QRDisplayModal isOpen={isQRDisplayOpen} onClose={closeQRDisplay} />
    </>
  );
}

// Enhanced Mobile Navigation without Dropdowns
const MobileNavigation: React.FC<{
  colorScheme: any;
  isLinkActive: (href: string) => boolean;
  setSheetOpen: (open: boolean) => void;
  openCommunityModal: () => void;
}> = ({ colorScheme, isLinkActive, setSheetOpen, openCommunityModal }) => {
  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: '#000000', // Dark background for mobile menu
      }}
    >
      {/* Enhanced Header with better spacing */}
      <div
        className="flex items-center justify-between p-6 border-b"
        style={{ borderColor: colorScheme.primary + '30' }}
      >
        <Link
          href="/"
          onClick={() => setSheetOpen(false)}
          className="flex items-center gap-3"
        >
          <Image
            src={WisdomeHouseLogo}
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          {/* Enhanced Mobile Logo Text */}
          <div className="flex items-center gap-3">
            <div
              className="h-6 w-px opacity-40"
              style={{ backgroundColor: colorScheme.primary }}
            />
            <span
              className={`${bricolageGrotesque.className} text-base font-semibold flex flex-col`}
              style={{ color: colorScheme.white }} // White text
            >
              <span className="leading-none">The</span>
              <span
                className="leading-none"
                style={{ color: colorScheme.primary }} // Primary color for emphasis
              >
                Wisdom House
              </span>
            </span>
          </div>
        </Link>
        <button
          onClick={() => setSheetOpen(false)}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" style={{ color: colorScheme.white }} />{' '}
          {/* White icon */}
        </button>
      </div>

      {/* Enhanced Navigation Links with Better Spacing - No Dropdowns */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {extendedNavLinks.map(link => {
          const isActive = isLinkActive(link.href);
          const Icon = iconMap[link.icon as keyof typeof iconMap];

          return (
            <div key={link.label} className="space-y-1">
              {/* Main Navigation Item - Simple Link */}
              <div className="flex flex-col">
                <Link
                  href={link.href}
                  onClick={() => setSheetOpen(false)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group relative',
                    isActive ? 'bg-primary/20' : 'hover:bg-white/10'
                  )}
                  style={{
                    color: colorScheme.white, // White text
                    border: isActive
                      ? `1px solid ${colorScheme.primary}40`
                      : '1px solid transparent',
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {Icon && (
                      <div
                        className="p-2 rounded-xl transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: isActive
                            ? colorScheme.primary + '30'
                            : colorScheme.primary + '15',
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: colorScheme.primary }}
                        />
                      </div>
                    )}
                    <span
                      className={`${worksans.className} font-semibold text-sm flex-1`}
                      style={{ color: colorScheme.white }} // White text
                    >
                      {link.label}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Enhanced Mobile Footer CTA */}
      <div
        className="p-6 border-t"
        style={{ borderColor: colorScheme.primary + '30' }}
      >
        <div className="space-y-3">
          <div className="text-center">
            <p
              className={`${worksans.className} text-xs opacity-70 mb-2`}
              style={{ color: colorScheme.white }} // White text
            >
              Ready to join our community?
            </p>
          </div>
          <Button
            onClick={() => {
              setSheetOpen(false);
              openCommunityModal();
            }}
            className="w-full py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 text-sm shadow-lg"
            style={{
              backgroundColor: colorScheme.primary,
              color: colorScheme.black || '#000',
            }}
          >
            <Church className="w-4 h-4 mr-2" />
            Join Community
          </Button>
        </div>
      </div>
    </div>
  );
};
