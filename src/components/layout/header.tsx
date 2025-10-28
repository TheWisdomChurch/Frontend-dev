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
} from 'lucide-react';
import { extendedNavLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '@/components/assets';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { useState, useEffect, useRef } from 'react';
import { bricolageGrotesque, worksans } from '../fonts/fonts';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme

// Icon mapping
const iconMap = {
  Home: Home,
  Users: Users,
  Calendar: Calendar,
  BookOpen: BookOpen,
  Phone: Phone,
};

export default function Header() {
  const pathname = usePathname();
  const { colorScheme } = useTheme(); // Get color scheme from theme
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (
    href: string,
    hasDropdown: boolean,
    e: React.MouseEvent
  ) => {
    if (hasDropdown) {
      e.preventDefault();
      return;
    }
    setActiveDropdown(null);
  };

  const toggleMobileDropdown = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileOpenDropdown(mobileOpenDropdown === label ? null : label);
  };

  const handleMobileLinkClick = (href: string, hasDropdown: boolean) => {
    if (!hasDropdown) {
      setSheetOpen(false);
      setMobileOpenDropdown(null);
    }
  };

  return (
    <header
      className={cn(
        'fixed z-50 transition-all duration-500 ease-out',
        isScrolled
          ? 'top-0 left-0 right-0 bg-transparent border-b-4 border-yellow-400 shadow-lg py-0'
          : 'top-8 left-4 right-4 mx-auto max-w-7xl bg-transparent border border-yellow-400 rounded-2xl py-0'
      )}
      style={{
        backgroundColor: isScrolled ? colorScheme.background : 'transparent',
        borderColor: colorScheme.primary, // Use primary yellow for borders
      }}
    >
      <div
        className={cn(
          'mx-auto transition-all duration-500',
          isScrolled ? 'max-w-full' : 'max-w-screen-2xl'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between mx-auto transition-all duration-500',
            isScrolled ? 'h-16 px-6' : 'h-14 px-4 sm:px-6 lg:px-8'
          )}
        >
          {/* Logo - Left */}
          <div className="relative flex items-center space-x-3">
            <div className="relative">
              <Image
                src={WisdomeHouseLogo}
                alt="WisdomHouse"
                className={cn(
                  'rounded-full transition-all duration-500',
                  isScrolled ? 'h-10 w-10' : 'h-8 w-8'
                )}
                width={isScrolled ? 40 : 32}
                height={isScrolled ? 40 : 32}
              />
            </div>

            {/* Divider line - show only when not scrolled */}
            {!isScrolled && (
              <div
                className="h-6 w-px mx-1"
                style={{ backgroundColor: colorScheme.border }}
              />
            )}

            {/* Updated text */}
            <span
              className={cn(
                `${worksans.className} font-medium transition-all duration-500 hidden sm:flex flex-col leading-tight`,
                isScrolled ? 'text-xs' : 'text-[8px]'
              )}
              style={{
                color: isScrolled ? colorScheme.text : colorScheme.white,
              }}
            >
              <span>The</span>
              <span>Wisdom</span>
              <span style={{ color: colorScheme.primary }}>HouseHq</span>
            </span>
          </div>

          {/* Navigation Links - Centered */}
          <nav className="hidden lg:flex items-center justify-center flex-1 max-w-2xl">
            <div className="flex items-center space-x-1" ref={dropdownRef}>
              {extendedNavLinks.map(link => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href + '/');
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
                        }
                        className={cn(
                          `${worksans.className} flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group`,
                          isActive
                            ? isHome
                              ? 'text-gray-900 shadow-md' // Home uses yellow background
                              : 'text-gray-900 shadow-md' // Other active links use green
                            : isScrolled
                              ? 'hover:bg-yellow-400/20'
                              : 'hover:bg-white/20'
                        )}
                        style={{
                          backgroundColor: isActive
                            ? isHome
                              ? colorScheme.primary // Yellow for home
                              : '#8bea19' // Keep existing green for others
                            : 'transparent',
                          color: isActive
                            ? colorScheme.textInverted // Black text on yellow/green
                            : isScrolled
                              ? colorScheme.text
                              : colorScheme.white,
                          borderRadius: colorScheme.borderRadius.medium, // Use theme borderRadius
                        }}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{link.label}</span>
                        {hasDropdown && (
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform duration-300',
                              activeDropdown === link.label ? 'rotate-180' : ''
                            )}
                          />
                        )}
                      </Link>

                      {/* Active indicator for non-home links */}
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
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          {link.dropdown.map(dropdownItem => (
                            <Link
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              className={`${worksans.className} flex items-center px-4 py-3 text-sm transition-all duration-300 group rounded-lg mx-2`}
                              style={{
                                color: colorScheme.text,
                              }}
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div
                                className="w-1 h-1 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ backgroundColor: colorScheme.primary }}
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
              asChild
              className={cn(
                `${worksans.className} hidden lg:flex transition-all duration-500`,
                isScrolled
                  ? 'hover:scale-105 h-10 px-6 text-sm border-2'
                  : 'backdrop-blur-sm hover:bg-white hover:text-gray-900 border h-8 px-3 text-xs'
              )}
              style={{
                backgroundColor: isScrolled
                  ? colorScheme.primary
                  : colorScheme.white + '20',
                color: isScrolled
                  ? colorScheme.textInverted
                  : colorScheme.white,
                borderColor: isScrolled
                  ? colorScheme.primary
                  : colorScheme.white + '30',
                borderRadius: colorScheme.borderRadius.medium,
              }}
            >
              <Link href="#community">
                <Church className="mr-2 h-4 w-4" />
                Join Us
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'lg:hidden transition-colors ml-2',
                    isScrolled
                      ? 'hover:bg-yellow-400/20 h-10 w-10'
                      : 'hover:bg-white/20 h-8 w-8'
                  )}
                  style={{
                    color: isScrolled ? colorScheme.text : colorScheme.white,
                    borderRadius: colorScheme.borderRadius.medium,
                  }}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] sm:w-[350px] p-0"
                style={{
                  backgroundColor: colorScheme.background,
                  borderColor: colorScheme.border,
                }}
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div
                    className="p-4 border-b"
                    style={{ borderColor: colorScheme.border }}
                  >
                    <Link
                      href="/"
                      className="flex items-center space-x-2"
                      onClick={() => setSheetOpen(false)}
                    >
                      <Image
                        src={WisdomeHouseLogo}
                        alt="Wisdom House Logo"
                        className="h-10 w-10"
                        width={40}
                        height={40}
                      />
                      <span
                        className={`${bricolageGrotesque.className} font-bold text-lg`}
                        style={{ color: colorScheme.text }}
                      >
                        Wisdom House
                      </span>
                    </Link>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-3 overflow-y-auto">
                    <div className="space-y-2">
                      {extendedNavLinks.map(link => {
                        const isActive = pathname === link.href;
                        const hasDropdown = !!link.dropdown;
                        const IconComponent =
                          iconMap[link.icon as keyof typeof iconMap];
                        const isMobileDropdownOpen =
                          mobileOpenDropdown === link.label;
                        const isHome = link.label === 'Home';

                        return (
                          <div key={link.label} className="space-y-1">
                            <div
                              className="flex items-center justify-between rounded-lg border"
                              style={{
                                backgroundColor: colorScheme.surface,
                                borderColor: colorScheme.border,
                                borderRadius: colorScheme.borderRadius.medium,
                              }}
                            >
                              <Link
                                href={link.href}
                                onClick={e => {
                                  if (hasDropdown) {
                                    toggleMobileDropdown(link.label, e);
                                  } else {
                                    handleMobileLinkClick(link.href, false);
                                  }
                                }}
                                className={cn(
                                  `${worksans.className} flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-300 flex-1 rounded-lg`,
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
                                  borderRadius: colorScheme.borderRadius.medium,
                                }}
                              >
                                <IconComponent className="h-4 w-4" />
                                <span>{link.label}</span>
                              </Link>

                              {/* Mobile Dropdown Toggle */}
                              {hasDropdown && (
                                <button
                                  type="button"
                                  onClick={e =>
                                    toggleMobileDropdown(link.label, e)
                                  }
                                  className="h-10 w-10 flex items-center justify-center transition-colors rounded-r-lg"
                                  style={{
                                    color: colorScheme.text,
                                    borderRadius:
                                      colorScheme.borderRadius.medium,
                                  }}
                                >
                                  <ChevronDown
                                    className={cn(
                                      'h-4 w-4 transition-transform duration-300',
                                      isMobileDropdownOpen ? 'rotate-180' : ''
                                    )}
                                  />
                                </button>
                              )}
                            </div>

                            {/* Mobile Dropdown Items */}
                            {hasDropdown &&
                              isMobileDropdownOpen &&
                              link.dropdown && (
                                <div
                                  className="ml-3 mt-1 space-y-1 rounded-lg p-2 border"
                                  style={{
                                    backgroundColor: colorScheme.surfaceVariant,
                                    borderColor: colorScheme.border,
                                    borderRadius:
                                      colorScheme.borderRadius.medium,
                                  }}
                                >
                                  {link.dropdown.map(dropdownItem => (
                                    <Link
                                      key={dropdownItem.label}
                                      href={dropdownItem.href}
                                      onClick={() => {
                                        setSheetOpen(false);
                                        setMobileOpenDropdown(null);
                                      }}
                                      className={`${worksans.className} flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 group`}
                                      style={{
                                        color: colorScheme.text,
                                        borderRadius:
                                          colorScheme.borderRadius.small,
                                      }}
                                    >
                                      <div
                                        className="w-1.5 h-1.5 rounded-full mr-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                          backgroundColor: colorScheme.primary,
                                        }}
                                      ></div>
                                      <span className="font-medium">
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

                  {/* Mobile CTA Button */}
                  <div
                    className="p-3 border-t"
                    style={{ borderColor: colorScheme.border }}
                  >
                    <Button
                      asChild
                      className={`${worksans.className} w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300`}
                      style={{
                        backgroundColor: colorScheme.primary,
                        color: colorScheme.textInverted,
                        borderRadius: colorScheme.borderRadius.medium,
                      }}
                    >
                      <Link
                        href="#community"
                        onClick={() => setSheetOpen(false)}
                      >
                        <Church className="mr-2 h-5 w-5" />
                        Join Our Community
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
