/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import {
  Menu,
  Church,
  ChevronDown,
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
    activeDropdown,
    mobileOpenDropdown,
    isSheetOpen,
    isCommunityModalOpen,
    isQRDisplayOpen,
    dropdownRef,
    colorScheme,
    setSheetOpen,
    setActiveDropdown,
    handleLinkClick,
    handleDropdownItemClick,
    toggleMobileDropdown,
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
            ? 'h-12 bg-background/90 backdrop-blur-xl border-b border-border/50'
            : 'h-14 top-2 left-1/2 -translate-x-1/2 w-[96%] max-w-4xl rounded-xl bg-background/80 backdrop-blur-xl border border-border/30 shadow-sm'
        )}
        style={{
          backgroundColor: isHeaderScrolled
            ? `${colorScheme.background}cc`
            : 'transparent',
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
                    style={{ color: colorScheme.white }}
                  >
                    The
                  </span>
                  <span
                    className="leading-[0.9]"
                    style={{ color: colorScheme.primary }}
                  >
                    Wisdom House
                  </span>
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation - Smaller Text */}
          <nav
            className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            ref={dropdownRef}
          >
            <div className="flex items-center gap-0">
              {extendedNavLinks.map(link => {
                const isActive = isLinkActive(link.href);
                const hasDropdown = !!link.dropdown;
                const Icon = iconMap[link.icon as keyof typeof iconMap];

                return (
                  <div key={link.label} className="relative">
                    <Link
                      href={link.href}
                      onClick={e => handleLinkClick(link.href, hasDropdown, e)}
                      onMouseEnter={() =>
                        hasDropdown && setActiveDropdown(link.label)
                      }
                      className={cn(
                        'flex items-center gap-1 px-2 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 mx-0.5',
                        'hover:bg-white/10'
                      )}
                      style={{
                        backgroundColor: isActive
                          ? colorScheme.primary + '20'
                          : 'transparent',
                        color: colorScheme.white,
                      }}
                    >
                      {Icon && <Icon className="w-3 h-3" />}
                      <span className="text-[11px]">{link.label}</span>
                      {hasDropdown && (
                        <ChevronDown
                          className={cn(
                            'w-2.5 h-2.5 transition-transform duration-300',
                            activeDropdown === link.label && 'rotate-180'
                          )}
                        />
                      )}
                    </Link>

                    {/* Dropdown - Primary background with black text on hover */}
                    {hasDropdown && activeDropdown === link.label && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-2xl bg-background/95 backdrop-blur-xl border shadow-xl overflow-hidden"
                        style={{
                          backgroundColor: `${colorScheme.background}ee`,
                          borderColor: colorScheme.primary + '40',
                          borderWidth: '1px',
                        }}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="p-2">
                          {link.dropdown?.map((item, index) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={handleDropdownItemClick}
                              className={cn(
                                'block px-4 py-3 text-sm transition-all duration-300 rounded-xl hover:bg-primary hover:text-black',
                                index === 0 && 'rounded-t-xl',
                                index === (link.dropdown?.length || 0) - 1 &&
                                  'rounded-b-xl'
                              )}
                              style={{
                                color: colorScheme.white,
                              }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Right: CTA + Mobile Menu - More Compact */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop Join Us Button - Smaller */}
            <Button
              onClick={openCommunityModal}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black || '#000',
              }}
            >
              <Church className="w-3 h-3" />
              Join Us
            </Button>

            {/* Mobile Menu Trigger - Smaller */}
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-full p-1 hover:bg-white/10 transition-colors"
                  style={{ color: colorScheme.white }}
                >
                  <Menu className="h-3.5 w-3.5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full max-w-sm p-0 border-0 overflow-y-auto"
                style={{
                  backgroundColor: colorScheme.background,
                }}
              >
                <MobileNavigation
                  colorScheme={colorScheme}
                  isLinkActive={isLinkActive}
                  mobileOpenDropdown={mobileOpenDropdown}
                  toggleMobileDropdown={toggleMobileDropdown}
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

// Enhanced Mobile Navigation with Better UX
const MobileNavigation: React.FC<{
  colorScheme: any;
  isLinkActive: (href: string) => boolean;
  mobileOpenDropdown: string | null;
  toggleMobileDropdown: (label: string, e: React.MouseEvent) => void;
  setSheetOpen: (open: boolean) => void;
  openCommunityModal: () => void;
}> = ({
  colorScheme,
  isLinkActive,
  mobileOpenDropdown,
  toggleMobileDropdown,
  setSheetOpen,
  openCommunityModal,
}) => {
  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: colorScheme.background,
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
              style={{ color: colorScheme.white }}
            >
              <span className="leading-none">The</span>
              <span
                className="leading-none"
                style={{ color: colorScheme.primary }}
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
          <X className="w-5 h-5" style={{ color: colorScheme.white }} />
        </button>
      </div>

      {/* Enhanced Navigation Links with Better Spacing */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {extendedNavLinks.map(link => {
          const isActive = isLinkActive(link.href);
          const Icon = iconMap[link.icon as keyof typeof iconMap];
          const isOpen = mobileOpenDropdown === link.label;
          const hasDropdown = !!link.dropdown;

          return (
            <div key={link.label} className="space-y-1">
              {/* Main Navigation Item */}
              <div className="flex flex-col">
                <button
                  onClick={e => toggleMobileDropdown(link.label, e)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group',
                    isActive ? 'bg-primary/20' : 'hover:bg-white/10'
                  )}
                  style={{
                    color: colorScheme.white,
                    border: isActive
                      ? `1px solid ${colorScheme.primary}40`
                      : '1px solid transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
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
                      className={`${worksans.className} font-semibold text-sm`}
                    >
                      {link.label}
                    </span>
                  </div>
                  {hasDropdown && (
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform duration-300 text-primary',
                        isOpen && 'rotate-180'
                      )}
                    />
                  )}
                </button>

                {/* Enhanced Dropdown with Primary background and Black text on hover */}
                {hasDropdown && isOpen && link.dropdown && (
                  <div
                    className="mt-2 ml-4 space-y-1 rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: colorScheme.primary + '10',
                      border: `1px solid ${colorScheme.primary}20`,
                    }}
                  >
                    {link.dropdown.map((item, index) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        className={cn(
                          'block px-4 py-3 text-sm transition-all duration-300 hover:bg-primary hover:text-black border-l-4',
                          index === 0 && 'rounded-t-2xl',
                          index === link.dropdown!.length - 1 && 'rounded-b-2xl'
                        )}
                        style={{
                          color: colorScheme.body,
                          borderLeftColor: colorScheme.primary,
                          backgroundColor: 'transparent',
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
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
              style={{ color: colorScheme.white }}
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
