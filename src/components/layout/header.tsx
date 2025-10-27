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
import { useState, useEffect } from 'react';

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
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDropdownToggle = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-transparent'
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo - Left */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src={WisdomeHouseLogo}
                alt="WisdomHouse"
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
                width={40}
                height={40}
              />
            </div>
            <span
              className={cn(
                'font-bold font-headline text-xl transition-colors duration-300 hidden sm:block',
                isScrolled ? 'text-gray-900' : 'text-white'
              )}
            >
              Wisdom House
            </span>
          </Link>
        </div>

        {/* Navigation Links - Centered */}
        <nav className="hidden lg:flex items-center justify-center flex-1 max-w-2xl">
          <div className="flex items-center space-x-1">
            {extendedNavLinks.map(link => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + '/');
              const hasDropdown = link.dropdown;
              const IconComponent = iconMap[link.icon as keyof typeof iconMap];

              return (
                <div key={link.label} className="relative">
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      onClick={e =>
                        hasDropdown && handleDropdownToggle(link.label, e)
                      }
                      className={cn(
                        'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group',
                        isActive
                          ? 'bg-[#8bea19] text-gray-900 shadow-md'
                          : isScrolled
                            ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                            : 'text-white hover:text-white hover:bg-white/20'
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{link.label}</span>
                      {hasDropdown && (
                        <ChevronDown
                          className={cn(
                            'h-3 w-3 transition-transform duration-300',
                            activeDropdown === link.label ? 'rotate-180' : ''
                          )}
                        />
                      )}
                    </Link>

                    {/* Active indicator for non-home links */}
                    {isActive && link.label !== 'Home' && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-[#8bea19] rounded-full"></div>
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  {hasDropdown && activeDropdown === link.label && (
                    <div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in-0 zoom-in-95"
                      onClick={e => e.stopPropagation()}
                    >
                      {link.dropdown?.map(dropdownItem => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#8bea19] hover:text-gray-900 transition-all duration-200 group"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span className="flex-1">{dropdownItem.label}</span>
                          <div className="w-0 h-0.5 bg-gray-900 group-hover:w-3 transition-all duration-300"></div>
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
              'hidden lg:flex transition-all duration-300',
              isScrolled
                ? 'bg-[#8bea19] text-gray-900 hover:bg-[#7ad017] hover:scale-105'
                : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white hover:text-gray-900 border border-white/30'
            )}
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
                  'lg:hidden transition-colors ml-4',
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/20'
                )}
              >
                <Menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6">
                {/* Mobile Logo */}
                <Link
                  href="/"
                  className="flex items-center space-x-3"
                  onClick={() => setSheetOpen(false)}
                >
                  <Image
                    src={WisdomeHouseLogo}
                    alt="Wisdom House Logo"
                    className="h-10 w-10"
                    width={40}
                    height={40}
                  />
                  <span className="font-bold font-headline text-xl text-gray-900">
                    Wisdom House
                  </span>
                </Link>

                {/* Mobile Navigation */}
                <nav className="grid gap-2">
                  {extendedNavLinks.map(link => {
                    const isActive = pathname === link.href;
                    const IconComponent =
                      iconMap[link.icon as keyof typeof iconMap];

                    return (
                      <div key={link.label}>
                        <Link
                          href={link.href}
                          onClick={() => setSheetOpen(false)}
                          className={cn(
                            'flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300',
                            isActive
                              ? 'bg-[#8bea19] text-gray-900'
                              : 'text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span>{link.label}</span>
                        </Link>

                        {/* Mobile Dropdown Items */}
                        {link.dropdown && (
                          <div className="ml-8 mt-1 space-y-1">
                            {link.dropdown.map(dropdownItem => (
                              <Link
                                key={dropdownItem.label}
                                href={dropdownItem.href}
                                onClick={() => setSheetOpen(false)}
                                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <span className="ml-2">
                                  {dropdownItem.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>

                {/* Mobile CTA Button */}
                <Button
                  asChild
                  className="bg-[#8bea19] text-gray-900 hover:bg-[#7ad017] mt-4"
                >
                  <Link href="#community" onClick={() => setSheetOpen(false)}>
                    <Church className="mr-2 h-4 w-4" />
                    Join Our Community
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
