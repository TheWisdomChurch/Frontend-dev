// components/Header.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/Sheet';
import {
  Menu,
  Church,
  ChevronDown,
  Home,
  Users,
  Calendar,
  BookOpen,
  Phone,
  QrCode,
  X,
} from 'lucide-react';
import { extendedNavLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '@/components/assets';
import { cn } from '@/lib/cn';
import { bricolageGrotesque, worksans } from '../fonts/fonts';
import JoinCommunityModal from '../modal/joinUsModal';

import { QRDisplayModal } from '../modal/QrModal';
import { useHeader } from '../utils/hooks/header';

// Icon mapping
const iconMap = {
  Home: Home,
  Users: Users,
  Calendar: Calendar,
  BookOpen: BookOpen,
  Phone: Phone,
};

export default function Header() {
  const {
    // State
    isHeaderScrolled,
    activeDropdown,
    mobileOpenDropdown,
    isSheetOpen,
    isCommunityModalOpen,
    isQRDisplayOpen,

    // Refs
    dropdownRef,

    // Theme
    colorScheme,

    // Handlers
    setSheetOpen,
    setActiveDropdown, // Add this missing handler
    handleLinkClick,
    handleDropdownItemClick,
    toggleMobileDropdown,
    openCommunityModal,
    closeCommunityModal,
    openQRDisplay,
    closeQRDisplay,
    isLinkActive,
    closeAllDropdowns,
  } = useHeader();

  return (
    <>
      <header
        className={cn(
          'fixed z-50 transition-all duration-500 ease-out',
          isHeaderScrolled
            ? 'top-0 left-0 right-0 bg-transparent border-b-4 border-yellow-400 shadow-lg py-0'
            : 'top-8 left-4 right-4 mx-auto max-w-7xl bg-transparent border border-yellow-400 rounded-2xl py-0'
        )}
        style={{
          backgroundColor: isHeaderScrolled
            ? colorScheme.background
            : 'transparent',
          borderColor: colorScheme.primary,
        }}
      >
        <div
          className={cn(
            'mx-auto transition-all duration-500',
            isHeaderScrolled ? 'max-w-full' : 'max-w-screen-2xl'
          )}
        >
          <div
            className={cn(
              'flex items-center justify-between mx-auto transition-all duration-500',
              isHeaderScrolled ? 'h-16 px-6' : 'h-14 px-4 sm:px-6 lg:px-8'
            )}
          >
            {/* Logo - Left */}
            <div className="relative flex items-center space-x-3">
              <Link href="/" onClick={closeAllDropdowns}>
                <div className="relative">
                  <Image
                    src={WisdomeHouseLogo}
                    alt="WisdomHouse"
                    className={cn(
                      'rounded-full transition-all duration-500',
                      isHeaderScrolled ? 'h-10 w-10' : 'h-8 w-8'
                    )}
                    width={isHeaderScrolled ? 40 : 32}
                    height={isHeaderScrolled ? 40 : 32}
                  />
                </div>
              </Link>

              {!isHeaderScrolled && (
                <div
                  className="h-6 w-px mx-1"
                  style={{ backgroundColor: colorScheme.border }}
                />
              )}

              <span
                className={cn(
                  `${worksans.className} font-medium transition-all duration-500 hidden sm:flex items-center gap-1 leading-none`,
                  isHeaderScrolled ? 'text-xs' : 'text-[8px]'
                )}
                style={{
                  color: isHeaderScrolled
                    ? colorScheme.text
                    : colorScheme.white,
                }}
              >
                The
                <span style={{ color: colorScheme.primary }}> Wisdom </span>
                <span style={{ color: colorScheme.primary }}>Church</span>
              </span>
            </div>

            {/* Navigation Links - Centered */}
            <nav className="hidden lg:flex items-center justify-center flex-1 max-w-2xl">
              <div className="flex items-center space-x-1" ref={dropdownRef}>
                {extendedNavLinks.map(link => {
                  const isActive = isLinkActive(link.href);
                  const hasDropdown = !!link.dropdown;
                  const IconComponent =
                    iconMap[link.icon as keyof typeof iconMap];
                  const isHome = link.label === 'Home';

                  return (
                    <div key={link.label} className="relative">
                      <div className="flex items-center">
                        <Link
                          href={link.href}
                          onClick={e =>
                            handleLinkClick(link.href, hasDropdown, e)
                          }
                          onMouseEnter={() =>
                            hasDropdown && setActiveDropdown(link.label)
                          } // FIXED: Use setActiveDropdown
                          className={cn(
                            `${worksans.className} flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group`,
                            isActive
                              ? isHome
                                ? 'text-gray-900 shadow-md'
                                : 'text-gray-900 shadow-md'
                              : isHeaderScrolled
                                ? 'hover:bg-yellow-400/20'
                                : 'hover:bg-white/20'
                          )}
                          style={{
                            backgroundColor: isActive
                              ? isHome
                                ? colorScheme.primary
                                : '#8bea19'
                              : 'transparent',
                            color: isActive
                              ? colorScheme.textInverted
                              : isHeaderScrolled
                                ? colorScheme.text
                                : colorScheme.white,
                            borderRadius: colorScheme.borderRadius.medium,
                          }}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{link.label}</span>
                          {hasDropdown && (
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform duration-300',
                                activeDropdown === link.label
                                  ? 'rotate-180'
                                  : ''
                              )}
                            />
                          )}
                        </Link>

                        {isActive && !isHome && (
                          <div
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 rounded-full"
                            style={{ backgroundColor: '#8bea19' }}
                          ></div>
                        )}
                      </div>

                      {/* Dropdown Menu */}
                      {hasDropdown &&
                        activeDropdown === link.label &&
                        link.dropdown && (
                          <div
                            className="absolute top-full left-0 mt-2 w-56 backdrop-blur-md rounded-xl shadow-xl border py-2 animate-in fade-in-0 zoom-in-95 duration-200 origin-top"
                            style={{
                              backgroundColor: colorScheme.surface,
                              borderColor: colorScheme.primary,
                              borderRadius: colorScheme.borderRadius.large,
                            }}
                            onMouseLeave={() => setActiveDropdown(null)} // FIXED: Use setActiveDropdown
                          >
                            {link.dropdown.map(dropdownItem => (
                              <Link
                                key={dropdownItem.label}
                                href={dropdownItem.href}
                                className={`${worksans.className} flex items-center px-4 py-3 text-sm transition-all duration-300 group rounded-lg mx-2 hover:bg-opacity-10`}
                                style={{
                                  color: colorScheme.text,
                                }}
                                onClick={handleDropdownItemClick}
                              >
                                <div
                                  className="w-1 h-1 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  style={{
                                    backgroundColor: colorScheme.primary,
                                  }}
                                ></div>
                                <span className="flex-1">
                                  {dropdownItem.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </nav>

            {/* CTA Button - Right */}
            <div className="flex items-center justify-end flex-shrink-0">
              <Button
                onClick={openCommunityModal}
                className={cn(
                  `${worksans.className} hidden lg:flex items-center transition-all duration-500 cursor-pointer`,
                  isHeaderScrolled
                    ? 'hover:scale-105 h-10 px-6 text-sm border-2'
                    : 'backdrop-blur-sm hover:bg-white hover:text-gray-900 border h-8 px-3 text-xs'
                )}
                style={{
                  backgroundColor: isHeaderScrolled
                    ? colorScheme.primary
                    : colorScheme.white + '20',
                  color: isHeaderScrolled
                    ? colorScheme.textInverted
                    : colorScheme.white,
                  borderColor: isHeaderScrolled
                    ? colorScheme.primary
                    : colorScheme.white + '30',
                  borderRadius: colorScheme.borderRadius.medium,
                }}
              >
                <Church className="mr-2 h-4 w-4" />
                Join Us
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'lg:hidden transition-colors ml-2',
                      isHeaderScrolled
                        ? 'hover:bg-yellow-400/20 h-10 w-10'
                        : 'hover:bg-white/20 h-8 w-8'
                    )}
                    style={{
                      color: isHeaderScrolled
                        ? colorScheme.text
                        : colorScheme.white,
                      borderRadius: colorScheme.borderRadius.medium,
                    }}
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[320px] sm:w-[380px] p-0"
                  style={{
                    backgroundColor: colorScheme.background,
                    borderColor: colorScheme.border,
                  }}
                >
                  <MobileNavigation
                    colorScheme={colorScheme}
                    isLinkActive={isLinkActive}
                    mobileOpenDropdown={mobileOpenDropdown}
                    toggleMobileDropdown={toggleMobileDropdown}
                    setSheetOpen={setSheetOpen}
                    closeAllDropdowns={closeAllDropdowns}
                    openCommunityModal={openCommunityModal}
                    openQRDisplay={openQRDisplay}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Community Modal */}
      <JoinCommunityModal
        isOpen={isCommunityModalOpen}
        onClose={closeCommunityModal}
        // colorScheme={colorScheme}
      />

      {/* QR Display Modal */}
      <QRDisplayModal
        isOpen={isQRDisplayOpen}
        onClose={closeQRDisplay}
        // colorScheme={colorScheme}
      />
    </>
  );
}

// Mobile Navigation Component
const MobileNavigation: React.FC<{
  colorScheme: any;
  isLinkActive: (href: string) => boolean;
  mobileOpenDropdown: string | null;
  toggleMobileDropdown: (label: string, e: React.MouseEvent) => void;
  setSheetOpen: (open: boolean) => void;
  closeAllDropdowns: () => void;
  openCommunityModal: () => void;
  openQRDisplay: () => void;
}> = ({
  colorScheme,
  isLinkActive,
  mobileOpenDropdown,
  toggleMobileDropdown,
  setSheetOpen,
  closeAllDropdowns,
  openCommunityModal,
  openQRDisplay,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Mobile Logo */}
      <div
        className="p-6 border-b relative"
        style={{ borderColor: colorScheme.border }}
      >
        {/* Close Button */}
        <button
          onClick={() => setSheetOpen(false)}
          className="absolute top-7 right-4 h-8 w-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-200"
          style={{
            backgroundColor: colorScheme.primary,
            color: colorScheme.textInverted,
          }}
        >
          <X className="h-4 w-4" />
        </button>

        <Link
          href="/"
          className="flex items-center space-x-4"
          onClick={() => setSheetOpen(false)}
        >
          {/* Rounded Logo Image */}
          <div className="relative">
            <Image
              src={WisdomeHouseLogo}
              alt="Wisdom House Logo"
              className="h-10 w-10 rounded-full border-2"
              width={30}
              height={30}
              style={{ borderColor: colorScheme.primary }}
            />
          </div>

          {/* White Divider */}
          <div
            className="h-12 w-px"
            style={{ backgroundColor: colorScheme.border }}
          />

          {/* Stacked Text */}
          <div className="flex flex-col">
            <span
              className={`${bricolageGrotesque.className} font-bold text-xs leading-tight`}
              style={{ color: colorScheme.text }}
            >
              The
            </span>
            <span
              className={`${bricolageGrotesque.className} font-bold text-xs leading-tight`}
              style={{ color: colorScheme.text }}
            >
              WisdomHouse
            </span>
            <span
              className={`${bricolageGrotesque.className} font-bold text-xs leading-tight`}
              style={{ color: colorScheme.primary }}
            >
              Church
            </span>
          </div>
        </Link>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="space-y-3">
          {extendedNavLinks.map(link => {
            const isActive = isLinkActive(link.href);
            const hasDropdown = !!link.dropdown;
            const IconComponent = iconMap[link.icon as keyof typeof iconMap];
            const isMobileDropdownOpen = mobileOpenDropdown === link.label;
            const isHome = link.label === 'Home';

            return (
              <div key={link.label} className="space-y-2">
                <div
                  className="flex items-center justify-between rounded-xl border"
                  style={{
                    backgroundColor: colorScheme.surface,
                    borderColor: colorScheme.border,
                    borderRadius: colorScheme.borderRadius.large,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={e => {
                      if (hasDropdown) {
                        toggleMobileDropdown(link.label, e);
                      } else {
                        setSheetOpen(false);
                        closeAllDropdowns();
                      }
                    }}
                    className={cn(
                      `${worksans.className} flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-300 flex-1 rounded-xl`,
                      isActive && 'font-semibold'
                    )}
                    style={{
                      backgroundColor: isActive
                        ? isHome
                          ? colorScheme.primary
                          : '#8bea19'
                        : 'transparent',
                      color: isActive
                        ? colorScheme.textInverted
                        : colorScheme.text,
                      borderRadius: colorScheme.borderRadius.large,
                    }}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="text-sm sm:text-base">{link.label}</span>
                  </Link>

                  {hasDropdown && (
                    <button
                      type="button"
                      onClick={e => toggleMobileDropdown(link.label, e)}
                      className="h-12 w-12 flex items-center justify-center transition-colors rounded-r-xl hover:bg-white/10"
                      style={{
                        color: colorScheme.text,
                        borderRadius: colorScheme.borderRadius.large,
                      }}
                    >
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 transition-transform duration-300',
                          isMobileDropdownOpen ? 'rotate-180' : ''
                        )}
                      />
                    </button>
                  )}
                </div>

                {/* Mobile Dropdown Items */}
                {hasDropdown && isMobileDropdownOpen && link.dropdown && (
                  <div
                    className="ml-4 mt-2 space-y-2 rounded-lg p-3 border"
                    style={{
                      backgroundColor: colorScheme.surfaceVariant,
                      borderColor: colorScheme.border,
                      borderRadius: colorScheme.borderRadius.large,
                    }}
                  >
                    {link.dropdown.map(dropdownItem => (
                      <Link
                        key={dropdownItem.label}
                        href={dropdownItem.href}
                        onClick={() => {
                          setSheetOpen(false);
                          closeAllDropdowns();
                        }}
                        className={`${worksans.className} flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 group hover:bg-white/10`}
                        style={{
                          color: colorScheme.text,
                          borderRadius: colorScheme.borderRadius.medium,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full mr-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            backgroundColor: colorScheme.primary,
                          }}
                        ></div>
                        <span className="font-medium text-sm sm:text-base">
                          {dropdownItem.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* QR Code Section */}
        <div
          className="mt-8 pt-6 border-t"
          style={{ borderColor: colorScheme.border }}
        >
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* QR Code Display Trigger */}
            <button
              onClick={openQRDisplay}
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                // borderColor: colorScheme.primary,
                backgroundColor: colorScheme.surface,
              }}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-2 shadow-inner">
                <QrCode className="h-8 w-8 text-white" />
              </div>
              <span
                className={`${worksans.className} text-xs sm:text-sm text-center font-medium`}
                style={{ color: colorScheme.text }}
              >
                Show QR Code
              </span>
            </button>

            {/* Text Column */}
            <div className="flex flex-col justify-center">
              <p
                className={`${worksans.className} font-semibold text-sm sm:text-base leading-tight mb-2`}
                style={{ color: colorScheme.primary }}
              >
                Join our Whatsapp Community
              </p>
              <p
                className={`${worksans.className} text-xs text-white leading-tight`}
              >
                Get latest news and updates
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile CTA Button */}
      <div
        className="p-4 sm:p-6 border-t"
        style={{ borderColor: colorScheme.border }}
      >
        <Button
          onClick={() => {
            setSheetOpen(false);
            openCommunityModal();
          }}
          className={`${worksans.className} w-full h-14 text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center`}
          style={{
            backgroundColor: colorScheme.primary,
            color: colorScheme.textInverted,
            borderRadius: colorScheme.borderRadius.large,
          }}
        >
          <Church className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
          Join Our Community
        </Button>
      </div>
    </div>
  );
};
